-- Create admin user (this will be done manually via Supabase Dashboard for security)
-- User: gs@gmail.com / Gnana@8179
-- Note: Admin users should be created via Supabase Dashboard Auth > Users > Invite User
-- Then add their role to user_roles table

-- For now, let's ensure the user_roles table is ready and add some helpful functions

-- Function to check if email domain is allowed for admin (optional security layer)
CREATE OR REPLACE FUNCTION public.is_valid_admin_email(email TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
AS $$
  SELECT email LIKE '%@gmail.com' OR email LIKE '%@zervitra.com';
$$;

-- Add index for faster role lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- Function to get user role (with caching hint)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = $1 LIMIT 1;
$$;

COMMENT ON FUNCTION public.get_user_role IS 'Returns the role for a given user ID. Returns NULL if no role found.';