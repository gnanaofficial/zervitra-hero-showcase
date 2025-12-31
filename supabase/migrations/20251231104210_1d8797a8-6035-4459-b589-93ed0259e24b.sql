-- Create client_inquiries table for public inquiry form submissions
CREATE TABLE public.client_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT,
  city TEXT,
  service_interest TEXT NOT NULL,
  project_description TEXT,
  budget TEXT,
  timeline TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  assigned_manager_id UUID REFERENCES public.managers(id),
  converted_to_client_id UUID REFERENCES public.clients(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_inquiries ENABLE ROW LEVEL SECURITY;

-- Admins can do everything with inquiries
CREATE POLICY "Admins can view all inquiries" 
ON public.client_inquiries 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert inquiries" 
ON public.client_inquiries 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can update inquiries" 
ON public.client_inquiries 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete inquiries" 
ON public.client_inquiries 
FOR DELETE 
USING (is_admin(auth.uid()));

-- Managers can view inquiries assigned to them
CREATE POLICY "Managers can view assigned inquiries" 
ON public.client_inquiries 
FOR SELECT 
USING (assigned_manager_id = get_current_manager_id());

CREATE POLICY "Managers can update assigned inquiries" 
ON public.client_inquiries 
FOR UPDATE 
USING (assigned_manager_id = get_current_manager_id());

-- Public can insert inquiries (for the public form)
CREATE POLICY "Anyone can submit inquiries" 
ON public.client_inquiries 
FOR INSERT 
WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_client_inquiries_updated_at
BEFORE UPDATE ON public.client_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();