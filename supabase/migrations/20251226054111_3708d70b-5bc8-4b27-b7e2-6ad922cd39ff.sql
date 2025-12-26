-- Allow RLS policy for quotations delete (for draft deletion)
CREATE POLICY "Admins can delete quotations"
ON public.quotations
FOR DELETE
USING (is_admin(auth.uid()));