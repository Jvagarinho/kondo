-- Run this in the Supabase SQL Editor to ensure your user exists and is an admin
-- Replace 'jorge.vagarinho@gmail.com' with your actual email if it's different

DO $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Get the ID from auth.users
    SELECT id INTO target_user_id FROM auth.users WHERE email = 'jorge.vagarinho@gmail.com' LIMIT 1;

    IF target_user_id IS NOT NULL THEN
        -- Upsert into kondo_users
        INSERT INTO public.kondo_users (id, name, role)
        VALUES (target_user_id, 'Jorge Vagarinho', 'admin')
        ON CONFLICT (id) DO UPDATE SET role = 'admin';
        
        RAISE NOTICE 'User % has been promoted to admin.', target_user_id;
    ELSE
        RAISE EXCEPTION 'User not found in auth.users table.';
    END IF;
END $$;
