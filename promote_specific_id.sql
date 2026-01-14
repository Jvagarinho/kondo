-- FINAL ATTEMPT: Promote your current session ID to admin
-- Run this in the Supabase SQL Editor

DO $$
BEGIN
    -- Upsert the specific ID shown in your Debug Info
    INSERT INTO public.kondo_users (id, name, role)
    VALUES ('da366882-9ee5-467b-ace2-8b93936f471f', 'Jorge Vagarinho', 'admin')
    ON CONFLICT (id) DO UPDATE SET role = 'admin';
    
    RAISE NOTICE 'Admin set for ID da366882-9ee5-467b-ace2-8b93936f471f';
END $$;
