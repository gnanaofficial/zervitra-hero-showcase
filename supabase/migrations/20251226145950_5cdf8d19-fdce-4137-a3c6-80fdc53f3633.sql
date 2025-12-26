-- Add 'sent' to quotations status check constraint
ALTER TABLE public.quotations
  DROP CONSTRAINT IF EXISTS quotations_status_check;

ALTER TABLE public.quotations
  ADD CONSTRAINT quotations_status_check
  CHECK (status = ANY (ARRAY['draft'::text,'pending'::text,'sent'::text,'accepted'::text,'rejected'::text]));