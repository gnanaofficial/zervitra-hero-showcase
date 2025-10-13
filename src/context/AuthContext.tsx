import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: 'admin' | 'user' | null;
  signIn: (email: string, password: string, expectedRole?: 'admin' | 'user') => Promise<{ error: any; redirectTo: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserRole = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .single();
        
        if (!error && data) {
          setRole(data.role as 'admin' | 'user');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchUserRole(session.user.id);
        } else {
          setRole(null);
        }
        
        setLoading(false);
        
        if (event === 'SIGNED_OUT') {
          setRole(null);
          toast({
            title: "Signed out successfully",
            description: "You have been logged out."
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const signIn = async (email: string, password: string, expectedRole?: 'admin' | 'user') => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
      return { error, redirectTo: null };
    }

    // Verify role matches expected role if provided
    if (expectedRole && data.user) {
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      if (roleError || !roleData || roleData.role !== expectedRole) {
        await supabase.auth.signOut();
        const roleError = {
          message: `Access denied. This login is for ${expectedRole}s only.`
        };
        toast({
          title: "Access denied",
          description: roleError.message,
          variant: "destructive"
        });
        return { error: roleError, redirectTo: null };
      }

      // Set role and determine redirect path
      setRole(roleData.role as 'admin' | 'user');
      const redirectTo = roleData.role === 'admin' ? '/admin/dashboard' : '/client/dashboard';

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in."
      });

      return { error: null, redirectTo };
    }

    toast({
      title: "Welcome back!",
      description: "You have successfully logged in."
    });

    return { error: null, redirectTo: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    role,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};