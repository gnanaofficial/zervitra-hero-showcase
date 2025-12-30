import { supabase } from '@/integrations/supabase/client';

export const setupAdminUser = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('create-admin-user', {
      method: 'POST',
    });

    if (error) {
      console.error('Error in admin setup:', error);
      return { success: false, error };
    }

    console.log('Admin setup complete');
    return { success: true, data };
  } catch (err) {
    console.error('Failed to setup admin:', err);
    return { success: false, error: err };
  }
};
