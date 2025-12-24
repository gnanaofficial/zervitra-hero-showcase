-- Fix RLS policies to allow admins to create clients for other users

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own client data" ON public.clients;
DROP POLICY IF EXISTS "Admins can insert all clients" ON public.clients;

-- Allow users to insert their own client data
CREATE POLICY "Users can insert their own client data" 
ON public.clients
FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

-- Allow admins to insert clients for any user
CREATE POLICY "Admins can insert clients for any user" 
ON public.clients
FOR INSERT 
TO authenticated 
WITH CHECK (public.is_admin(auth.uid()));

-- Verify the policy
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'clients' AND cmd = 'INSERT';
