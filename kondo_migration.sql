-- KONDO DATABASE MIGRATION SCRIPT

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS public.kondo_users (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    name TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Users
ALTER TABLE public.kondo_users ENABLE ROW LEVEL SECURITY;

-- Policies for Kondo Users
DROP POLICY IF EXISTS "Allow individual read access" ON public.kondo_users;
CREATE POLICY "Allow individual read access" ON public.kondo_users FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Allow admin read all" ON public.kondo_users;
CREATE POLICY "Allow admin read all" ON public.kondo_users FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.kondo_users WHERE id = auth.uid() AND role = 'admin')
);

-- 2. Create Notices Table
CREATE TABLE IF NOT EXISTS public.kondo_notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT,
    urgent BOOLEAN DEFAULT FALSE,
    author_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Notices
ALTER TABLE public.kondo_notices ENABLE ROW LEVEL SECURITY;

-- Policies for Notices
DROP POLICY IF EXISTS "Allow public read notices" ON public.kondo_notices;
CREATE POLICY "Allow public read notices" ON public.kondo_notices FOR SELECT USING (TRUE);
DROP POLICY IF EXISTS "Allow admin manage notices" ON public.kondo_notices;
CREATE POLICY "Allow admin manage notices" ON public.kondo_notices FOR ALL USING (
    EXISTS (SELECT 1 FROM public.kondo_users WHERE id = auth.uid() AND role = 'admin')
);

-- 3. Create Payments Table
CREATE TABLE IF NOT EXISTS public.kondo_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id),
    owner_name TEXT,
    unit TEXT,
    amount NUMERIC(10, 2),
    status TEXT DEFAULT 'Pending',
    month TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Payments
ALTER TABLE public.kondo_payments ENABLE ROW LEVEL SECURITY;

-- Policies for Payments
DROP POLICY IF EXISTS "Allow users to view own payments" ON public.kondo_payments;
CREATE POLICY "Allow users to view own payments" ON public.kondo_payments FOR SELECT USING (auth.uid() = owner_id);
DROP POLICY IF EXISTS "Allow admin manage payments" ON public.kondo_payments;
CREATE POLICY "Allow admin manage payments" ON public.kondo_payments FOR ALL USING (
    EXISTS (SELECT 1 FROM public.kondo_users WHERE id = auth.uid() AND role = 'admin')
);

-- 4. Create Documents Table
CREATE TABLE IF NOT EXISTS public.kondo_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Documents
ALTER TABLE public.kondo_documents ENABLE ROW LEVEL SECURITY;

-- Policies for Documents
DROP POLICY IF EXISTS "Allow logged in users to view documents" ON public.kondo_documents;
CREATE POLICY "Allow logged in users to view documents" ON public.kondo_documents FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Allow admin manage documents" ON public.kondo_documents;
CREATE POLICY "Allow admin manage documents" ON public.kondo_documents FOR ALL USING (
    EXISTS (SELECT 1 FROM public.kondo_users WHERE id = auth.uid() AND role = 'admin')
);

-- 5. Trigger for New User Creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_count INTEGER;
BEGIN
    SELECT count(*) INTO user_count FROM public.kondo_users;
    
    IF user_count = 0 THEN
        INSERT INTO public.kondo_users (id, name, role)
        VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'admin');
    ELSE
        INSERT INTO public.kondo_users (id, name, role)
        VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'user');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Storage Bucket Instructions
-- Note: You need to manually create a bucket named 'kondo_documents' in the Supabase Storage dashboard.
-- Set it to Public or configure appropriate RLS policies for it.
