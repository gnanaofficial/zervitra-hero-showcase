-- Fix RLS policies to allow Admins to view/manage all data

-- Clients
DROP POLICY IF EXISTS "Admins can view all clients" ON public.clients;
CREATE POLICY "Admins can view all clients" ON public.clients
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can insert all clients" ON public.clients;
CREATE POLICY "Admins can insert all clients" ON public.clients
  FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update all clients" ON public.clients;
CREATE POLICY "Admins can update all clients" ON public.clients
  FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete all clients" ON public.clients;
CREATE POLICY "Admins can delete all clients" ON public.clients
  FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

-- Projects
DROP POLICY IF EXISTS "Admins can view all projects" ON public.projects;
CREATE POLICY "Admins can view all projects" ON public.projects
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all projects" ON public.projects;
CREATE POLICY "Admins can manage all projects" ON public.projects
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Quotations
DROP POLICY IF EXISTS "Admins can view all quotations" ON public.quotations;
CREATE POLICY "Admins can view all quotations" ON public.quotations
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all quotations" ON public.quotations;
CREATE POLICY "Admins can manage all quotations" ON public.quotations
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Invoices
DROP POLICY IF EXISTS "Admins can view all invoices" ON public.invoices;
CREATE POLICY "Admins can view all invoices" ON public.invoices
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage all invoices" ON public.invoices;
CREATE POLICY "Admins can manage all invoices" ON public.invoices
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
