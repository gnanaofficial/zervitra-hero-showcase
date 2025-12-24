-- =============================================
-- COMPLETE CLIENT-QUOTATION-INVOICE SYSTEM
-- =============================================

-- Add new columns to clients table for the ID system
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS client_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS project_code TEXT,
ADD COLUMN IF NOT EXISTS platform_code TEXT,
ADD COLUMN IF NOT EXISTS year_hex TEXT,
ADD COLUMN IF NOT EXISTS client_sequence_number INTEGER;

-- Add new columns to quotations table
ALTER TABLE public.quotations 
ADD COLUMN IF NOT EXISTS quotation_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS client_sequence INTEGER,
ADD COLUMN IF NOT EXISTS global_sequence INTEGER,
ADD COLUMN IF NOT EXISTS valid_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS discount_percent NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax_percent NUMERIC DEFAULT 18;

-- Add new columns to invoices table
ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS invoice_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS client_sequence INTEGER,
ADD COLUMN IF NOT EXISTS global_sequence INTEGER,
ADD COLUMN IF NOT EXISTS financial_year TEXT,
ADD COLUMN IF NOT EXISTS tax NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS total NUMERIC,
ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS discount_percent NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax_percent NUMERIC DEFAULT 18;

-- Create global_counters table for atomic counter management
CREATE TABLE IF NOT EXISTS public.global_counters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    counter_type TEXT NOT NULL UNIQUE,
    current_value INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on global_counters
ALTER TABLE public.global_counters ENABLE ROW LEVEL SECURITY;

-- RLS policies for global_counters (admin only)
CREATE POLICY "Admins can view global counters" ON public.global_counters
    FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update global counters" ON public.global_counters
    FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert global counters" ON public.global_counters
    FOR INSERT WITH CHECK (is_admin(auth.uid()));

-- Initialize global counters if not exist
INSERT INTO public.global_counters (counter_type, current_value)
VALUES 
    ('client', 0),
    ('quotation', 0),
    ('invoice', 0)
ON CONFLICT (counter_type) DO NOTHING;

-- Create client_sequences table for per-client quotation/invoice counters
CREATE TABLE IF NOT EXISTS public.client_sequences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_uuid UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    sequence_type TEXT NOT NULL, -- 'quotation' or 'invoice'
    fiscal_year TEXT, -- for invoices
    current_value INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(client_uuid, sequence_type, fiscal_year)
);

-- Enable RLS on client_sequences
ALTER TABLE public.client_sequences ENABLE ROW LEVEL SECURITY;

-- RLS policies for client_sequences (admin only)
CREATE POLICY "Admins can view client sequences" ON public.client_sequences
    FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update client sequences" ON public.client_sequences
    FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert client sequences" ON public.client_sequences
    FOR INSERT WITH CHECK (is_admin(auth.uid()));

-- Update existing RLS policies for clients to allow admin full access
DROP POLICY IF EXISTS "Admins can view all clients" ON public.clients;
CREATE POLICY "Admins can view all clients" ON public.clients
    FOR SELECT USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update all clients" ON public.clients;
CREATE POLICY "Admins can update all clients" ON public.clients
    FOR UPDATE USING (is_admin(auth.uid()));

-- Update RLS policies for quotations
DROP POLICY IF EXISTS "Admins can insert quotations" ON public.quotations;
CREATE POLICY "Admins can insert quotations" ON public.quotations
    FOR INSERT WITH CHECK (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can view all quotations" ON public.quotations;
CREATE POLICY "Admins can view all quotations" ON public.quotations
    FOR SELECT USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update quotations" ON public.quotations;
CREATE POLICY "Admins can update quotations" ON public.quotations
    FOR UPDATE USING (is_admin(auth.uid()));

-- Update RLS policies for invoices  
DROP POLICY IF EXISTS "Admins can insert invoices" ON public.invoices;
CREATE POLICY "Admins can insert invoices" ON public.invoices
    FOR INSERT WITH CHECK (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can view all invoices" ON public.invoices;
CREATE POLICY "Admins can view all invoices" ON public.invoices
    FOR SELECT USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update invoices" ON public.invoices;
CREATE POLICY "Admins can update invoices" ON public.invoices
    FOR UPDATE USING (is_admin(auth.uid()));

-- Update RLS policies for projects
DROP POLICY IF EXISTS "Admins can insert projects" ON public.projects;
CREATE POLICY "Admins can insert projects" ON public.projects
    FOR INSERT WITH CHECK (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can view all projects" ON public.projects;
CREATE POLICY "Admins can view all projects" ON public.projects
    FOR SELECT USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;
CREATE POLICY "Admins can update projects" ON public.projects
    FOR UPDATE USING (is_admin(auth.uid()));

-- =============================================
-- ID GENERATION FUNCTIONS
-- =============================================

-- Function to get hex month (1-C)
CREATE OR REPLACE FUNCTION public.get_hex_month(month_num INTEGER)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    IF month_num < 1 OR month_num > 12 THEN
        RAISE EXCEPTION 'Month must be between 1 and 12';
    END IF;
    RETURN upper(to_hex(month_num));
END;
$$;

-- Function to get fiscal year (e.g., "2425" for FY 2024-25)
CREATE OR REPLACE FUNCTION public.get_fiscal_year(input_date DATE DEFAULT CURRENT_DATE)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    year_num INTEGER;
    month_num INTEGER;
BEGIN
    year_num := EXTRACT(YEAR FROM input_date);
    month_num := EXTRACT(MONTH FROM input_date);
    
    IF month_num >= 4 THEN
        -- April onwards - current FY
        RETURN right(year_num::text, 2) || right((year_num + 1)::text, 2);
    ELSE
        -- Jan-Mar - previous FY
        RETURN right((year_num - 1)::text, 2) || right(year_num::text, 2);
    END IF;
END;
$$;

-- Function to atomically increment global counter
CREATE OR REPLACE FUNCTION public.get_next_global_counter(p_counter_type TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_next_value INTEGER;
BEGIN
    UPDATE public.global_counters
    SET current_value = current_value + 1,
        updated_at = NOW()
    WHERE counter_type = p_counter_type
    RETURNING current_value INTO v_next_value;
    
    IF v_next_value IS NULL THEN
        INSERT INTO public.global_counters (counter_type, current_value)
        VALUES (p_counter_type, 1)
        ON CONFLICT (counter_type) DO UPDATE 
        SET current_value = global_counters.current_value + 1,
            updated_at = NOW()
        RETURNING current_value INTO v_next_value;
    END IF;
    
    RETURN v_next_value;
END;
$$;

-- Function to atomically increment client sequence
CREATE OR REPLACE FUNCTION public.get_next_client_sequence(
    p_client_uuid UUID,
    p_sequence_type TEXT,
    p_fiscal_year TEXT DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_next_value INTEGER;
BEGIN
    INSERT INTO public.client_sequences (client_uuid, sequence_type, fiscal_year, current_value)
    VALUES (p_client_uuid, p_sequence_type, p_fiscal_year, 1)
    ON CONFLICT (client_uuid, sequence_type, fiscal_year) 
    DO UPDATE SET 
        current_value = client_sequences.current_value + 1,
        updated_at = NOW()
    RETURNING current_value INTO v_next_value;
    
    RETURN v_next_value;
END;
$$;

-- Function to generate Client ID
CREATE OR REPLACE FUNCTION public.generate_client_id(
    p_project_code TEXT,
    p_platform_code TEXT,
    p_country TEXT DEFAULT 'IND'
)
RETURNS TABLE(client_id TEXT, sequence_number INTEGER, year_hex TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_sequence INTEGER;
    v_year TEXT;
    v_month TEXT;
    v_year_hex TEXT;
    v_client_id TEXT;
BEGIN
    v_sequence := get_next_global_counter('client');
    v_year := right(EXTRACT(YEAR FROM CURRENT_DATE)::text, 2);
    v_month := get_hex_month(EXTRACT(MONTH FROM CURRENT_DATE)::integer);
    v_year_hex := v_year || v_month;
    
    v_client_id := upper(p_project_code) || upper(p_platform_code) || '7' || 
                   lpad(v_sequence::text, 2, '0') || '-' || 
                   upper(p_country) || '-' || v_year_hex;
    
    RETURN QUERY SELECT v_client_id, v_sequence, v_year_hex;
END;
$$;

-- Function to generate Quotation ID
CREATE OR REPLACE FUNCTION public.generate_quotation_id(
    p_client_uuid UUID,
    p_client_id TEXT,
    p_version INTEGER DEFAULT 1
)
RETURNS TABLE(quotation_id TEXT, client_sequence INTEGER, global_sequence INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_client_seq INTEGER;
    v_global_seq INTEGER;
    v_base_client_id TEXT;
    v_quotation_id TEXT;
BEGIN
    -- Extract base client ID (EA701 from EA701-IND-25C)
    v_base_client_id := split_part(p_client_id, '-', 1);
    
    v_client_seq := get_next_client_sequence(p_client_uuid, 'quotation', NULL);
    v_global_seq := get_next_global_counter('quotation');
    
    v_quotation_id := 'QN' || p_version || '-' || v_base_client_id || '-' || lpad(v_client_seq::text, 3, '0');
    
    RETURN QUERY SELECT v_quotation_id, v_client_seq, v_global_seq;
END;
$$;

-- Function to generate Invoice ID
CREATE OR REPLACE FUNCTION public.generate_invoice_id(
    p_client_uuid UUID,
    p_client_id TEXT,
    p_version INTEGER DEFAULT 1,
    p_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(invoice_id TEXT, client_sequence INTEGER, global_sequence INTEGER, financial_year TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_client_seq INTEGER;
    v_global_seq INTEGER;
    v_base_client_id TEXT;
    v_fiscal_year TEXT;
    v_fy_short TEXT;
    v_invoice_id TEXT;
BEGIN
    -- Extract base client ID (EA701 from EA701-IND-25C)
    v_base_client_id := split_part(p_client_id, '-', 1);
    
    v_fiscal_year := get_fiscal_year(p_date);
    v_fy_short := left(v_fiscal_year, 2);
    
    v_client_seq := get_next_client_sequence(p_client_uuid, 'invoice', v_fiscal_year);
    v_global_seq := get_next_global_counter('invoice');
    
    v_invoice_id := 'IN' || p_version || '-FY' || v_fy_short || '-' || v_base_client_id || '-' || lpad(v_client_seq::text, 3, '0');
    
    RETURN QUERY SELECT v_invoice_id, v_client_seq, v_global_seq, v_fiscal_year;
END;
$$;

-- Add admin_created_by column to track who created sub-admins
ALTER TABLE public.user_roles
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT false;

-- Update the admin who can create other admins
UPDATE public.user_roles SET is_super_admin = true WHERE role = 'admin' AND created_by IS NULL;