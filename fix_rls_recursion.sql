-- RECURSION FIX: Run this in the Supabase SQL Editor
-- This fixes the "infinite recursion" error by simplifying the security policies

-- 1. Remove all old problematic policies
DROP POLICY IF EXISTS "Allow individual read access" ON public.kondo_users;
DROP POLICY IF EXISTS "Allow admin read all" ON public.kondo_users;

-- 2. Create a safe, non-recursive policy
-- This allows any logged-in user to see names/roles (safe for a condo app)
CREATE POLICY "Allow authenticated read all" 
ON public.kondo_users 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- 3. Verify your user is still admin (just in case)
INSERT INTO public.kondo_users (id, name, role)
VALUES ('da366882-9ee5-467b-ace2-8b93936f471f', 'Jorge Vagarinho', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 4. Final check
SELECT * FROM public.kondo_users WHERE id = 'da366882-9ee5-467b-ace2-8b93936f471f';
