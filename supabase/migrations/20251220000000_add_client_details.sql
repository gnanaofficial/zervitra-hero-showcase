-- Add new columns to clients table for storing details found in Quotation Generator
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip TEXT,
ADD COLUMN IF NOT EXISTS country TEXT;
