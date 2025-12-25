-- Create storage bucket for quotation PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('quotations', 'quotations', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the quotations bucket
CREATE POLICY "Admins can upload quotation PDFs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'quotations' AND is_admin(auth.uid()));

CREATE POLICY "Admins can update quotation PDFs"
ON storage.objects FOR UPDATE
USING (bucket_id = 'quotations' AND is_admin(auth.uid()));

CREATE POLICY "Public can view quotation PDFs"
ON storage.objects FOR SELECT
USING (bucket_id = 'quotations');

CREATE POLICY "Admins can delete quotation PDFs"
ON storage.objects FOR DELETE
USING (bucket_id = 'quotations' AND is_admin(auth.uid()));

-- Add pdf_url column to quotations table
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS pdf_url TEXT;