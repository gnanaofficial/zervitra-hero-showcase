-- Create managers table with full profile
CREATE TABLE public.managers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    department TEXT,
    region TEXT,
    hire_date DATE,
    commission_percent NUMERIC(5,2) DEFAULT 0,
    target_revenue NUMERIC(12,2),
    target_clients INTEGER,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    UNIQUE(user_id),
    UNIQUE(email)
);

-- Enable RLS on managers table
ALTER TABLE public.managers ENABLE ROW LEVEL SECURITY;

-- RLS policies for managers table
CREATE POLICY "Admins can view all managers"
ON public.managers FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert managers"
ON public.managers FOR INSERT
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update managers"
ON public.managers FOR UPDATE
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete managers"
ON public.managers FOR DELETE
USING (is_admin(auth.uid()));

CREATE POLICY "Managers can view their own profile"
ON public.managers FOR SELECT
USING (user_id = auth.uid());

-- Add manager_id to clients table
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES public.managers(id);

-- Add manager_id to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES public.managers(id);

-- Add manager_id and audit fields to quotations table
ALTER TABLE public.quotations 
ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES public.managers(id),
ADD COLUMN IF NOT EXISTS created_by_role TEXT,
ADD COLUMN IF NOT EXISTS created_by_id UUID;

-- Add manager_id and audit fields to invoices table
ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES public.managers(id),
ADD COLUMN IF NOT EXISTS created_by_role TEXT,
ADD COLUMN IF NOT EXISTS created_by_id UUID;

-- Create function to check if user is a manager
CREATE OR REPLACE FUNCTION public.is_manager(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    WHEN _user_id = auth.uid() THEN (
      SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id AND role = 'manager'::app_role
      )
    )
    WHEN EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'::app_role
    ) THEN (
      SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id AND role = 'manager'::app_role
      )
    )
    ELSE FALSE
  END
$$;

-- Helper function to get manager_id for current user
CREATE OR REPLACE FUNCTION public.get_current_manager_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.managers WHERE user_id = auth.uid() LIMIT 1
$$;

-- Update RLS policies for clients to include manager access
CREATE POLICY "Managers can view their own clients"
ON public.clients FOR SELECT
USING (manager_id = get_current_manager_id());

CREATE POLICY "Managers can insert their own clients"
ON public.clients FOR INSERT
WITH CHECK (manager_id = get_current_manager_id());

CREATE POLICY "Managers can update their own clients"
ON public.clients FOR UPDATE
USING (manager_id = get_current_manager_id());

-- Update RLS policies for projects to include manager access
CREATE POLICY "Managers can view their own projects"
ON public.projects FOR SELECT
USING (manager_id = get_current_manager_id());

CREATE POLICY "Managers can insert their own projects"
ON public.projects FOR INSERT
WITH CHECK (manager_id = get_current_manager_id());

CREATE POLICY "Managers can update their own projects"
ON public.projects FOR UPDATE
USING (manager_id = get_current_manager_id());

-- Update RLS policies for quotations to include manager access
CREATE POLICY "Managers can view their own quotations"
ON public.quotations FOR SELECT
USING (manager_id = get_current_manager_id());

CREATE POLICY "Managers can insert their own quotations"
ON public.quotations FOR INSERT
WITH CHECK (manager_id = get_current_manager_id());

CREATE POLICY "Managers can update their own quotations"
ON public.quotations FOR UPDATE
USING (manager_id = get_current_manager_id());

-- Update RLS policies for invoices to include manager access
CREATE POLICY "Managers can view their own invoices"
ON public.invoices FOR SELECT
USING (manager_id = get_current_manager_id());

CREATE POLICY "Managers can insert their own invoices"
ON public.invoices FOR INSERT
WITH CHECK (manager_id = get_current_manager_id());

CREATE POLICY "Managers can update their own invoices"
ON public.invoices FOR UPDATE
USING (manager_id = get_current_manager_id());

-- Add trigger for updated_at on managers table
CREATE TRIGGER update_managers_updated_at
BEFORE UPDATE ON public.managers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();