-- 1. Create the Condominiums table
CREATE TABLE IF NOT EXISTS public.kondo_condominiums (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Insert a default condominium for existing data
-- We use a DO block to capture the ID of the newly created condo
DO $$
DECLARE
    default_condo_id UUID;
BEGIN
    -- Check if we already have any condominiums, if not create one
    IF NOT EXISTS (SELECT 1 FROM public.kondo_condominiums) THEN
        INSERT INTO public.kondo_condominiums (name, address)
        VALUES ('Default Condominium', '123 Main St')
        RETURNING id INTO default_condo_id;
    ELSE
        SELECT id INTO default_condo_id FROM public.kondo_condominiums LIMIT 1;
    END IF;

    -- 3. Add condominium_id column to existing tables and backfill data
    
    -- kondo_users
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kondo_users' AND column_name = 'condominium_id') THEN
        ALTER TABLE public.kondo_users ADD COLUMN condominium_id UUID REFERENCES public.kondo_condominiums(id);
        UPDATE public.kondo_users SET condominium_id = default_condo_id WHERE condominium_id IS NULL;
    END IF;

    -- kondo_notices
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kondo_notices' AND column_name = 'condominium_id') THEN
        ALTER TABLE public.kondo_notices ADD COLUMN condominium_id UUID REFERENCES public.kondo_condominiums(id);
        UPDATE public.kondo_notices SET condominium_id = default_condo_id WHERE condominium_id IS NULL;
    END IF;

    -- kondo_payments
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kondo_payments' AND column_name = 'condominium_id') THEN
        ALTER TABLE public.kondo_payments ADD COLUMN condominium_id UUID REFERENCES public.kondo_condominiums(id);
        UPDATE public.kondo_payments SET condominium_id = default_condo_id WHERE condominium_id IS NULL;
    END IF;

    -- kondo_documents
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'kondo_documents' AND column_name = 'condominium_id') THEN
        ALTER TABLE public.kondo_documents ADD COLUMN condominium_id UUID REFERENCES public.kondo_condominiums(id);
        UPDATE public.kondo_documents SET condominium_id = default_condo_id WHERE condominium_id IS NULL;
    END IF;
END $$;

-- 4. Add Indexes for performance (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_kondo_users_condo_id ON public.kondo_users(condominium_id);
CREATE INDEX IF NOT EXISTS idx_kondo_notices_condo_id ON public.kondo_notices(condominium_id);
CREATE INDEX IF NOT EXISTS idx_kondo_payments_condo_id ON public.kondo_payments(condominium_id);
CREATE INDEX IF NOT EXISTS idx_kondo_documents_condo_id ON public.kondo_documents(condominium_id);

-- 5. Enable RLS on the new table
ALTER TABLE public.kondo_condominiums ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read condominium details (if they belong to it or are admin)
-- For simplicity, let's allow all authenticated users to read condos for now, 
-- or you can restrict it to "id = auth.uid() -> condominium_id" logic later.
CREATE POLICY "Enable read access for authenticated users" ON public.kondo_condominiums
    FOR SELECT
    TO authenticated
    USING (true);

-- Only admins can insert/update condominiums (you might want to refine this)
-- Assuming you have an is_admin function or similar logic. 
-- For now, we'll leave write policies open to service role or specific admin checks if you have them.
