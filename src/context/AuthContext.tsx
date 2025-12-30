import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'admin' | 'manager' | 'user' | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: UserRole;
  managerId: string | null;
  signIn: (email: string, password: string, expectedRole?: 'admin' | 'manager' | 'user') => Promise<{ error: any; redirectTo: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole>(null);
  const [managerId, setManagerId] = useState<string | null>(null);
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
          setRole(data.role as UserRole);
          
          // If manager, fetch manager_id
          if (data.role === 'manager') {
            const { data: managerData } = await supabase
              .from('managers')
              .select('id')
              .eq('user_id', userId)
              .single();
            
            if (managerData) {
              setManagerId(managerData.id);
            }
          }
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
          setManagerId(null);
        }
        
        setLoading(false);
        
        if (event === 'SIGNED_OUT') {
          setRole(null);
          setManagerId(null);
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

  const signIn = async (email: string, password: string, expectedRole?: 'admin' | 'manager' | 'user') => {
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

    // Fetch user role
    if (data.user) {
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      if (roleError || !roleData) {
        // If expectedRole is set and no role found, deny access
        if (expectedRole) {
          await supabase.auth.signOut();
          const noRoleError = { message: 'No role assigned to this user.' };
          toast({
            title: "Access denied",
            description: noRoleError.message,
            variant: "destructive"
          });
          return { error: noRoleError, redirectTo: null };
        }
        
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in."
        });
        return { error: null, redirectTo: '/dashboard' };
      }

      // If expectedRole is set, verify it matches
      if (expectedRole && roleData.role !== expectedRole) {
        await supabase.auth.signOut();
        const mismatchError = { message: `Access denied. This login is for ${expectedRole}s only.` };
        toast({
          title: "Access denied",
          description: mismatchError.message,
          variant: "destructive"
        });
        return { error: mismatchError, redirectTo: null };
      }

      // Set role and determine redirect path
      setRole(roleData.role as UserRole);
      
      let redirectTo = '/dashboard';
      if (roleData.role === 'admin') {
        redirectTo = '/admin/dashboard';
      } else if (roleData.role === 'manager') {
        // Fetch manager_id
        const { data: managerData } = await supabase
          .from('managers')
          .select('id')
          .eq('user_id', data.user.id)
          .single();
        
        if (managerData) {
          setManagerId(managerData.id);
        }
        redirectTo = '/manager/dashboard';
      } else {
        redirectTo = '/client/dashboard';
      }

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

    return { error: null, redirectTo: '/dashboard' };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    role,
    managerId,
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
