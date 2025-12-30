-- Make quotations bucket private instead of public
UPDATE storage.buckets 
SET public = false 
WHERE id = 'quotations';

-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Public can view quotation PDFs" ON storage.objects;

-- Create policy for admins to view all quotation PDFs
CREATE POLICY "Admins can view quotation PDFs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'quotations' AND 
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  )
);

-- Create policy for clients to view quotation PDFs (all authenticated users can view from this bucket)
-- The actual access control is done via signed URLs in the application
CREATE POLICY "Authenticated users can view quotation PDFs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'quotations' AND 
  auth.role() = 'authenticated'
);

-- Admins can still upload/update/delete
CREATE POLICY "Admins can manage quotation PDFs"
ON storage.objects FOR ALL
USING (
  bucket_id = 'quotations' AND 
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  )
)
WITH CHECK (
  bucket_id = 'quotations' AND 
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  )
);