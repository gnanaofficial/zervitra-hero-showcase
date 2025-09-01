-- Create clients table
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT,
  contact_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on_hold', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create quotations table
CREATE TABLE public.quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  quotation_id UUID REFERENCES public.quotations(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  due_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  payment_method TEXT,
  payment_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Create policies for clients
CREATE POLICY "Users can view their own client data" ON public.clients
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own client data" ON public.clients
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own client data" ON public.clients
  FOR UPDATE USING (user_id = auth.uid());

-- Create policies for projects
CREATE POLICY "Users can view projects for their clients" ON public.projects
  FOR SELECT USING (
    client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
  );

-- Create policies for quotations
CREATE POLICY "Users can view quotations for their clients" ON public.quotations
  FOR SELECT USING (
    client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
  );

-- Create policies for invoices
CREATE POLICY "Users can view invoices for their clients" ON public.invoices
  FOR SELECT USING (
    client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update invoice payment status" ON public.invoices
  FOR UPDATE USING (
    client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
  );

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quotations_updated_at
  BEFORE UPDATE ON public.quotations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for testing user gnana@gmail.com
-- Note: This assumes the user ID for gnana@gmail.com - you'll need to update with actual ID after user signs up
INSERT INTO public.clients (id, user_id, company_name, contact_email) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Tech Startup Inc', 'gnana@gmail.com'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'E-commerce Solutions', 'client2@example.com');

INSERT INTO public.projects (client_id, title, description, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'E-commerce Website', 'Full-stack e-commerce platform with payment integration', 'active'),
('550e8400-e29b-41d4-a716-446655440001', 'Mobile App', 'iOS and Android mobile application', 'active'),
('550e8400-e29b-41d4-a716-446655440002', 'Landing Page Redesign', 'Modern, conversion-focused landing page', 'completed');

INSERT INTO public.quotations (project_id, client_id, amount, status) VALUES
((SELECT id FROM public.projects WHERE title = 'E-commerce Website' LIMIT 1), '550e8400-e29b-41d4-a716-446655440001', 15000.00, 'accepted'),
((SELECT id FROM public.projects WHERE title = 'Mobile App' LIMIT 1), '550e8400-e29b-41d4-a716-446655440001', 25000.00, 'pending'),
((SELECT id FROM public.projects WHERE title = 'Landing Page Redesign' LIMIT 1), '550e8400-e29b-41d4-a716-446655440002', 5000.00, 'accepted');

INSERT INTO public.invoices (project_id, client_id, quotation_id, amount, due_date, status) VALUES
((SELECT id FROM public.projects WHERE title = 'E-commerce Website' LIMIT 1), '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM public.quotations WHERE amount = 15000.00 LIMIT 1), 7500.00, now() + interval '30 days', 'pending'),
((SELECT id FROM public.projects WHERE title = 'Landing Page Redesign' LIMIT 1), '550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM public.quotations WHERE amount = 5000.00 LIMIT 1), 5000.00, now() + interval '15 days', 'paid');