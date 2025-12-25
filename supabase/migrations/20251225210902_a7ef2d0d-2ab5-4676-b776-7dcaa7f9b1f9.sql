-- Delete all duplicate clients except gnana@gmail.com
DELETE FROM public.clients 
WHERE id != '0cf0d2c0-b5d8-411c-8d7d-7991d2007410';

-- Update the remaining client with proper details
UPDATE public.clients 
SET 
  company_name = 'Gnana Test Company',
  client_id = 'GT701-IND-25C',
  platform_code = 'T',
  project_code = 'G',
  country = 'IND',
  year_hex = '25C',
  client_sequence_number = 1
WHERE id = '0cf0d2c0-b5d8-411c-8d7d-7991d2007410';

-- Create a project for the client (required for quotations/invoices)
INSERT INTO public.projects (id, client_id, title, description, status)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '0cf0d2c0-b5d8-411c-8d7d-7991d2007410',
  'Website Development Project',
  'Main development project for payment testing',
  'active'
);

-- Create a sample quotation
INSERT INTO public.quotations (
  id, client_id, project_id, amount, currency, status, 
  quotation_id, version, client_sequence, global_sequence,
  valid_until, services, tax_percent, notes
)
VALUES (
  'a1a2b3c4-d5e6-f789-0abc-def123456789',
  '0cf0d2c0-b5d8-411c-8d7d-7991d2007410',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  195.29,
  'USD',
  'pending',
  'QN1-GT701-001',
  1,
  1,
  1,
  NOW() + INTERVAL '7 days',
  '[{"description": "UI/UX Design", "amount": 45.95, "price": 45.95, "discount": 0}, {"description": "Frontend Development", "amount": 57.44, "price": 57.44, "discount": 0}, {"description": "Backend Development", "amount": 57.44, "price": 57.44, "discount": 0}, {"description": "Database Setup", "amount": 34.46, "price": 34.46, "discount": 0}]'::jsonb,
  0,
  'Validity: 7 days. Advance: 67%'
);

-- Create a sample invoice for payment testing
INSERT INTO public.invoices (
  id, client_id, project_id, amount, currency, status,
  invoice_id, version, client_sequence, global_sequence,
  financial_year, due_date, services, tax_percent, tax, total
)
VALUES (
  'b1a2b3c4-d5e6-f789-0abc-def123456789',
  '0cf0d2c0-b5d8-411c-8d7d-7991d2007410',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  100.00,
  'USD',
  'pending',
  'IN1-FY25-GT701-001',
  1,
  1,
  1,
  '2526',
  NOW() + INTERVAL '30 days',
  '[{"description": "Website Development", "amount": 50, "price": 50, "quantity": 1}, {"description": "UI/UX Design", "amount": 50, "price": 50, "quantity": 1}]'::jsonb,
  18,
  18.00,
  118.00
);