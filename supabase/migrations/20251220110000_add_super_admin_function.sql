-- Add super admin function to check if user is gs@gmail.com
-- Only super admin can create other admin users

CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = _user_id AND email = 'gs@gmail.com'
  )
$$;

-- Add RLS policy for super admin to manage user roles
DROP POLICY IF EXISTS "Super admin can manage all roles" ON public.user_roles;
CREATE POLICY "Super admin can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));

-- Comment for documentation
COMMENT ON FUNCTION public.is_super_admin IS 'Checks if the user is the super admin (gs@gmail.com). Only super admin can create other admin users.';
