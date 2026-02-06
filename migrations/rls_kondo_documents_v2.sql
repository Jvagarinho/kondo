-- Activate and enforce RLS on kondo_documents
ALTER TABLE kondo_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE kondo_documents FORCE ROW LEVEL SECURITY;

-- INSERT policy: admin or owner (using WITH CHECK)
CREATE POLICY documents_upload_admin_or_owner ON kondo_documents
FOR INSERT
USING (true)
WITH CHECK (uploaded_by = auth.uid() OR EXISTS (
  SELECT 1 FROM kondo_users au WHERE au.id = auth.uid() AND au.is_admin = TRUE
));

-- DELETE policy: admin or owner
CREATE POLICY documents_delete_admin_or_owner ON kondo_documents
FOR DELETE
USING (uploaded_by = auth.uid() OR EXISTS (
  SELECT 1 FROM kondo_users au WHERE au.id = auth.uid() AND au.is_admin = TRUE
));

-- SELECT policy (optional open)
CREATE POLICY documents_select ON kondo_documents
FOR SELECT
USING (true);

-- End
