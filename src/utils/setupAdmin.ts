import { supabase } from '@/integrations/supabase/client';

export const setupAdminUser = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('create-admin-user', {
      method: 'POST',
    });

    if (error) {
      console.error('Error creating admin user:', error);
      return { success: false, error };
    }

    console.log('✅ Admin user setup complete:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Failed to setup admin:', err);
    return { success: false, error: err };
  }
};

// Auto-run on import in development
if (import.meta.env.DEV) {
  console.log('🔧 Setting up admin user...');
  setupAdminUser().then(result => {
    if (result.success) {
      console.log('✅ Admin user is ready! Use: gs@gmail.com / Gnana@8179');
    }
  });
}
