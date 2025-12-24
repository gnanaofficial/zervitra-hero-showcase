-- Create ID sequences table for tracking auto-increment values
CREATE TABLE IF NOT EXISTS public.id_sequences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_type VARCHAR(20) NOT NULL, -- 'client', 'quotation', 'invoice'
  client_id VARCHAR(50), -- NULL for client sequences, populated for quotation/invoice
  fiscal_year VARCHAR(4), -- Only used for invoice sequences (e.g., '2425' for FY 2024-25)
  current_value INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(sequence_type, client_id, fiscal_year)
);

-- Create index for faster lookups
CREATE INDEX idx_id_sequences_lookup ON public.id_sequences(sequence_type, client_id, fiscal_year);

-- Function to get next sequence value atomically
CREATE OR REPLACE FUNCTION public.get_next_sequence_value(
  p_sequence_type VARCHAR(20),
  p_client_id VARCHAR(50) DEFAULT NULL,
  p_fiscal_year VARCHAR(4) DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_next_value INTEGER;
BEGIN
  -- Insert or update the sequence record atomically
  INSERT INTO public.id_sequences (sequence_type, client_id, fiscal_year, current_value)
  VALUES (p_sequence_type, p_client_id, p_fiscal_year, 1)
  ON CONFLICT (sequence_type, client_id, fiscal_year)
  DO UPDATE SET 
    current_value = id_sequences.current_value + 1,
    updated_at = NOW()
  RETURNING current_value INTO v_next_value;
  
  RETURN v_next_value;
END;
$$;

-- Enable RLS
ALTER TABLE public.id_sequences ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Only admins can access sequences
CREATE POLICY "Admins can view all sequences"
  ON public.id_sequences FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert sequences"
  ON public.id_sequences FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update sequences"
  ON public.id_sequences FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Insert dummy data for testing
INSERT INTO public.id_sequences (sequence_type, client_id, fiscal_year, current_value)
VALUES 
  ('client', NULL, NULL, 5), -- 5 clients already created
  ('quotation', 'EA701', NULL, 3), -- 3 quotations for client EA701
  ('quotation', 'WS702', NULL, 1), -- 1 quotation for client WS702
  ('invoice', 'EA701', '2425', 2), -- 2 invoices for EA701 in FY 24-25
  ('invoice', 'WS702', '2425', 1); -- 1 invoice for WS702 in FY 24-25
