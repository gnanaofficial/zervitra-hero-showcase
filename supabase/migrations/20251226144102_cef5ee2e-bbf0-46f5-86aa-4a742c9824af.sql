-- Expand allowed status values to support draft workflow

ALTER TABLE public.quotations
  DROP CONSTRAINT IF EXISTS quotations_status_check;

ALTER TABLE public.quotations
  ADD CONSTRAINT quotations_status_check
  CHECK (status = ANY (ARRAY['draft'::text,'pending'::text,'accepted'::text,'rejected'::text]));

ALTER TABLE public.invoices
  DROP CONSTRAINT IF EXISTS invoices_status_check;

ALTER TABLE public.invoices
  ADD CONSTRAINT invoices_status_check
  CHECK (status = ANY (ARRAY['draft'::text,'pending'::text,'paid'::text,'overdue'::text,'cancelled'::text]));