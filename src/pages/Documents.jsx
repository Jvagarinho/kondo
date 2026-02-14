import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDemo } from '../contexts/DemoContext';
import { supabase } from '../supabase';
import Navbar from '../components/Navbar';
import { useLanguage } from '../contexts/LanguageContext';
import EmptyState from '../components/EmptyState';
import DropZoneAdvanced from '../components/DropZoneAdvanced';
import ConfirmDialog from '../components/ConfirmDialog';
import DropZone from '../components/DropZone';
import Footer from '../components/Footer';

const Documents = () => {
    const { currentUser, isAdmin, condominiumId } = useAuth();
    const { isDemoMode, getDemoSupabase, demoData } = useDemo();
    const { t } = useLanguage();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Confirm Dialog state
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        documentId: null,
        documentName: '',
        filePath: ''
    });

    const fetchDocuments = useCallback(async () => {
        setLoading(true);
        if (isDemoMode) {
            setDocuments(demoData.documents);
            setLoading(false);
            return;
        }
        let query = supabase
            .from('kondo_documents')
            .select('*')
            .order('created_at', { ascending: false });
        if (condominiumId) {
            query = query.eq('condominium_id', condominiumId);
        }
        const { data, error } = await query;
        if (error) console.error('Error fetching documents:', error);
        else setDocuments(data || []);
        setLoading(false);
    }, [condominiumId, isDemoMode, demoData.documents]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const handleUploadDocument = async (file, { signal } = {}) => {
        // Em modo demo, simula o upload sem enviar ao servidor
        if (isDemoMode) {
            const mockDoc = {
                name: file.name,
                file_path: `demo-${Date.now()}.pdf`,
                uploaded_by: currentUser.id,
                file_type: file.type,
                file_size: file.size
            };
            if (condominiumId) {
                mockDoc.condominium_id = condominiumId;
            }

            const { error: dbError } = getDemoSupabase('kondo_documents').insert(mockDoc).select().single();
            if (dbError) {
                throw new Error('Error saving document info: ' + dbError.message);
            }
            fetchDocuments();
            return;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).slice(2,6)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('kondo_documents')
            .upload(filePath, file, { signal });
        if (uploadError) throw uploadError;

        const payload = {
            name: file.name,
            file_path: filePath,
            uploaded_by: currentUser.id
        };
        if (condominiumId) {
            payload.condominium_id = condominiumId;
        }

        const { error: dbError } = await supabase
            .from('kondo_documents')
            .insert([payload]);

        if (dbError) {
            throw new Error('Error saving document info: ' + dbError.message);
        }

        fetchDocuments();
    };

    const handleDeleteDocument = (id, filePath, docName) => {
        setConfirmDialog({
            isOpen: true,
            documentId: id,
            documentName: docName,
            filePath: filePath
        });
    };

    const confirmDeleteDocument = async () => {
        if (isDemoMode) {
            const { error: dbError } = getDemoSupabase('kondo_documents').delete().eq('id', confirmDialog.documentId);

            if (dbError) alert('Error deleting document: ' + dbError.message);
            else {
                fetchDocuments();
                setConfirmDialog({ isOpen: false, documentId: null, documentName: '', filePath: '' });
            }
            return;
        }

        const { error: storageError } = await supabase.storage
            .from('kondo_documents')
            .remove([confirmDialog.filePath]);

        if (storageError) console.error('Error removing from storage:', storageError);

        const { error: dbError } = await supabase
            .from('kondo_documents')
            .delete()
            .eq('id', confirmDialog.documentId);

        if (dbError) alert('Error deleting document: ' + dbError.message);
        else {
            fetchDocuments();
            setConfirmDialog({ isOpen: false, documentId: null, documentName: '', filePath: '' });
        }
    };

    const handleDownloadDocument = async (filePath) => {
        // Em modo demo, apenas mostra um alerta informativo
        if (isDemoMode) {
            alert('Modo Demo: Download simulado. Em produção, o arquivo seria baixado aqui.');
            return;
        }

        const { data, error } = await supabase.storage
            .from('kondo_documents')
            .createSignedUrl(filePath, 60);

        if (error) alert('Error getting download link: ' + error.message);
        else window.open(data.signedUrl, '_blank');
    };

    return (
        <div className="app-container" style={{ paddingBottom: '4rem' }}>
            <Navbar />

            <main className="page-main-content" style={{ maxWidth: '900px' }}>
                <div className="premium-card fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>{t('documents.title')}</h2>
                    </div>

                    {/* Drag and Drop Upload Zone - Apenas para Admin */}
                    {isAdmin && (
                        <div style={{ marginBottom: '2rem' }}>
                            <DropZoneAdvanced onUpload={handleUploadDocument} acceptedTypes={['application/pdf', 'image/*', '.doc', '.docx', '.xls', '.xlsx', '.txt']} maxSize={10 * 1024 * 1024} maxFiles={5} multiple={true} />
                        </div>
                    )}

                    <div className="documents-grid">
                        {loading ? (
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', gridColumn: '1 / -1' }}>{t('documents.loading')}</p>
                        ) : documents.length === 0 ? (
                            <div style={{ gridColumn: '1 / -1' }}>
                                <EmptyState 
                                    type="documents" 
                                />
                            </div>
                        ) : (
                            documents.map((doc) => (
                                <div key={doc.id} className="document-item">
                                    <div>
                                        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '10px',
                                                background: 'var(--accent-glow)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'var(--accent-color)'
                                            }}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                    <polyline points="14 2 14 8 20 8" />
                                                </svg>
                                            </div>
                                            <div style={{ overflow: 'hidden' }}>
                                                <h4 style={{
                                                    margin: 0,
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }} title={doc.name}>
                                                    {doc.name}
                                                </h4>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                    {new Date(doc.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                        <button
                                            onClick={() => handleDownloadDocument(doc.file_path)}
                                            className="btn-secondary"
                                            style={{ flex: 1, fontSize: '0.9rem' }}
                                        >
                                            {t('documents.download')}
                                        </button>
                                        {isAdmin && (
                                            <button
                                                onClick={() => handleDeleteDocument(doc.id, doc.file_path, doc.name)}
                                                className="btn-danger"
                                                style={{ padding: '0.6rem 1rem' }}
                                                title="Delete document"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ isOpen: false, documentId: null, documentName: '', filePath: '' })}
                onConfirm={confirmDeleteDocument}
                type="danger"
                title={t('confirmDialog.danger.title')}
                message={confirmDialog.documentName
                    ? `${t('documentsPage.deleteConfirm')} "${confirmDialog.documentName}"?`
                    : t('confirmDialog.danger.message')
                }
                confirmLabel={t('confirmDialog.danger.confirm')}
            />
            
            <Footer />
        </div>
    );
};

export default Documents;
