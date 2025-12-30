-- Add DELETE policy for projects (only one missing for projects)
CREATE POLICY "Admins can delete projects" 
ON public.projects 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Add DELETE policy for invoices
CREATE POLICY "Admins can delete invoices" 
ON public.invoices 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Secure SECURITY DEFINER functions to restrict arbitrary user ID queries
-- Update has_role to only allow self-query or admin access
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    -- Allow users to check their own role
    WHEN _user_id = auth.uid() THEN (
      SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id AND role = _role
      )
    )
    -- Allow admins to check anyone's role
    WHEN EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'::app_role
    ) THEN (
      SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id AND role = _role
      )
    )
    -- Deny all other queries
    ELSE FALSE
  END
$$;

-- Update is_admin to only allow self-query or admin access
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    -- Allow users to check their own admin status
    WHEN _user_id = auth.uid() THEN (
      SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id AND role = 'admin'::app_role
      )
    )
    -- Allow admins to check anyone's admin status
    WHEN EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'::app_role
    ) THEN (
      SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id AND role = 'admin'::app_role
      )
    )
    -- Deny all other queries
    ELSE FALSE
  END
$$;

-- Update get_user_role to only allow self-query or admin access
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    -- Allow users to get their own role
    WHEN user_id = auth.uid() THEN (
      SELECT role FROM public.user_roles
      WHERE public.user_roles.user_id = get_user_role.user_id
      LIMIT 1
    )
    -- Allow admins to get anyone's role
    WHEN EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE public.user_roles.user_id = auth.uid() AND role = 'admin'::app_role
    ) THEN (
      SELECT role FROM public.user_roles
      WHERE public.user_roles.user_id = get_user_role.user_id
      LIMIT 1
    )
    -- Deny all other queries
    ELSE NULL
  END
$$;