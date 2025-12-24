-- Add new columns to clients table for ID generation
ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS project_code CHAR(1) DEFAULT 'E',
ADD COLUMN IF NOT EXISTS platform_code CHAR(1) DEFAULT 'W',
ADD COLUMN IF NOT EXISTS country_code VARCHAR(3) DEFAULT 'IND',
ADD COLUMN IF NOT EXISTS client_sequence_number INTEGER;

-- Update existing clients with dummy data
UPDATE public.clients
SET 
  project_code = 'E',
  platform_code = 'A',
  country_code = 'IND',
  client_sequence_number = 1
WHERE client_sequence_number IS NULL
LIMIT 1;

-- Add comment for documentation
COMMENT ON COLUMN public.clients.project_code IS 'Project type: E=Enterprise, S=Startup, M=Medium, P=Personal';
COMMENT ON COLUMN public.clients.platform_code IS 'Platform: A=App, W=Web, B=Both, H=Hybrid';
COMMENT ON COLUMN public.clients.country_code IS 'ISO 3-letter country code';
COMMENT ON COLUMN public.clients.client_sequence_number IS 'Auto-increment sequence number for this client';
