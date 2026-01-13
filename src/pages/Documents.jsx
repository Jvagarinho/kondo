import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';
import Navbar from '../components/Navbar';

const Documents = () => {
    const { currentUser, isAdmin } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('kondo_documents')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) console.error('Error fetching documents:', error);
        else setDocuments(data || []);
        setLoading(false);
    };

    const handleUploadDocument = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('kondo_documents')
            .upload(filePath, file);

        if (uploadError) {
            alert('Error uploading file: ' + uploadError.message);
            setUploading(false);
            return;
        }

        const { error: dbError } = await supabase
            .from('kondo_documents')
            .insert([{
                name: file.name,
                file_path: filePath,
                uploaded_by: currentUser.id
            }]);

        if (dbError) {
            alert('Error saving document info: ' + dbError.message);
        } else {
            fetchDocuments();
        }
        setUploading(false);
    };

    const handleDeleteDocument = async (id, filePath) => {
        if (!window.confirm('Delete this document?')) return;

        const { error: storageError } = await supabase.storage
            .from('kondo_documents')
            .remove([filePath]);

        if (storageError) console.error('Error removing from storage:', storageError);

        const { error: dbError } = await supabase
            .from('kondo_documents')
            .delete()
            .eq('id', id);

        if (dbError) alert('Error deleting document: ' + dbError.message);
        else fetchDocuments();
    };

    const handleDownloadDocument = async (filePath) => {
        const { data, error } = await supabase.storage
            .from('kondo_documents')
            .createSignedUrl(filePath, 60);

        if (error) alert('Error getting download link: ' + error.message);
        else window.open(data.signedUrl, '_blank');
    };

    return (
        <div className="app-container" style={{ paddingBottom: '4rem' }}>
            <Navbar />

            <main style={{ padding: '0 2rem', maxWidth: '900px', margin: '2rem auto' }}>
                <div className="premium-card fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Document Repository</h2>
                        {isAdmin && (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="file"
                                    id="page-doc-upload"
                                    style={{ display: 'none' }}
                                    onChange={handleUploadDocument}
                                />
                                <button
                                    onClick={() => document.getElementById('page-doc-upload').click()}
                                    className="btn-primary"
                                    disabled={uploading}
                                >
                                    {uploading ? 'Uploading...' : 'Upload Document'}
                                </button>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {loading ? (
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', gridColumn: '1 / -1' }}>Loading documents...</p>
                        ) : documents.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', gridColumn: '1 / -1' }}>No documents available.</p>
                        ) : (
                            documents.map((doc) => (
                                <div key={doc.id} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    padding: '1.5rem',
                                    borderRadius: '16px',
                                    background: 'var(--primary-bg)',
                                    border: '1px solid var(--glass-border)',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    cursor: 'default'
                                }} onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.05)';
                                }} onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)';
                                }}>
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
                                            Download
                                        </button>
                                        {isAdmin && (
                                            <button
                                                onClick={() => handleDeleteDocument(doc.id, doc.file_path)}
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
        </div>
    );
};

export default Documents;
