import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UserPlus, Loader2, ShieldCheck } from 'lucide-react';

interface CreateAdminDialogProps {
  onSuccess?: () => void;
}

export function CreateAdminDialog({ onSuccess }: CreateAdminDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const { toast } = useToast();

  // Check if current user is super admin
  const checkSuperAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('user_roles')
        .select('is_super_admin')
        .eq('user_id', user.id)
        .single();
      
      setIsSuperAdmin(data?.is_super_admin || false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      checkSuperAdmin();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSuperAdmin) {
      toast({
        title: "Access Denied",
        description: "Only super admins can create new admin accounts",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Call edge function to create admin user
      const { data, error } = await supabase.functions.invoke('create-admin-user', {
        body: { email, password }
      });

      if (error) throw error;

      toast({
        title: "Admin Created",
        description: `Admin account for ${email} has been created successfully.`
      });

      setEmail('');
      setPassword('');
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create admin account",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10">
          <ShieldCheck className="w-4 h-4" />
          Create Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-destructive" />
            Create Admin Account
          </DialogTitle>
          <DialogDescription>
            {isSuperAdmin 
              ? "Create a new administrator account. The new admin will have access to the admin dashboard."
              : "Only super admins can create new admin accounts."}
          </DialogDescription>
        </DialogHeader>
        
        {isSuperAdmin ? (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="newadmin@zervitra.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminPassword">Password</Label>
                <Input
                  id="adminPassword"
                  type="password"
                  placeholder="Secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} variant="destructive">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Admin
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="py-6 text-center">
            <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              You don't have permission to create admin accounts.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
