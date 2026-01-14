-- Run this in the Supabase SQL Editor to make the current user an admin
-- Replace 'YOUR_EMAIL' with your actual email address

UPDATE public.kondo_users
SET role = 'admin'
WHERE id IN (
    SELECT id 
    FROM auth.users 
    WHERE email = 'YOUR_EMAIL_HERE'
);

-- Alternatively, if you only have one user, you can run:
-- UPDATE public.kondo_users SET role = 'admin' WHERE role = 'user';
