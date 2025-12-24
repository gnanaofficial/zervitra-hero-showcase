-- Add quotation_id field to quotations table
ALTER TABLE public.quotations
ADD COLUMN IF NOT EXISTS quotation_id VARCHAR(50) UNIQUE;

-- Add invoice_id field to invoices table  
ALTER TABLE public.invoices
ADD COLUMN IF NOT EXISTS invoice_id VARCHAR(50) UNIQUE;

-- Add comments for documentation
COMMENT ON COLUMN public.quotations.quotation_id IS 'Auto-generated quotation ID in format: QN<Version>-<ClientID>-<Sequence> (e.g., QN1-EA701-001)';
COMMENT ON COLUMN public.invoices.invoice_id IS 'Auto-generated invoice ID in format: IN<Version>-FY<FY>-<ClientID>-<Sequence> (e.g., IN1-FY25-EA701-001)';

-- Update existing records with sample IDs (optional - for testing)
UPDATE public.quotations
SET quotation_id = 'QN1-EA701-' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::TEXT, 3, '0')
WHERE quotation_id IS NULL;

UPDATE public.invoices
SET invoice_id = 'IN1-FY25-EA701-' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::TEXT, 3, '0')
WHERE invoice_id IS NULL;
