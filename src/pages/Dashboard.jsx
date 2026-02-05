import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';
import Navbar from '../components/Navbar';
import { useLanguage } from '../contexts/LanguageContext';
import { useDebounce } from '../hooks/useDebounce';

const Card = ({ title, children, action, viewAllLink }) => {
    const { t } = useLanguage();
    return (
        <div className="premium-card fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{title}</h3>
                    {viewAllLink && (
                        <Link to={viewAllLink} style={{ fontSize: '0.8rem', color: 'var(--accent-color)', textDecoration: 'none', fontWeight: '600' }}>
                            {t('dashboard.viewAll')} &rarr;
                        </Link>
                    )}
                </div>
                {action}
            </div>
            <div>{children}</div>
        </div>
    );
};

const Dashboard = () => {
    const { currentUser, isAdmin, condominiumId } = useAuth();
    const { t } = useLanguage();
    const [notices, setNotices] = useState([]);
    const [payments, setPayments] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showNoticeModal, setShowNoticeModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [newNotice, setNewNotice] = useState({ title: '', content: '', urgent: false });
    const [newPayment, setNewPayment] = useState({
        owner_id: '',
        unit: '',
        amount: '',
        status: 'Pending',
        month: new Date().toISOString().slice(0, 7) // Default to current month YYYY-MM
    });
    
    // Search states
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 300);

    const fetchNotices = useCallback(async () => {
        let query = supabase
            .from('kondo_notices')
            .select('*')
            .order('created_at', { ascending: false });
        if (condominiumId) {
            query = query.eq('condominium_id', condominiumId);
        }
        const { data, error } = await query;
        if (error) console.error('Error fetching notices:', error);
        else setNotices(data);
    }, [condominiumId]);

    const fetchPayments = useCallback(async () => {
        let query = supabase
            .from('kondo_payments')
            .select('*')
            .order('created_at', { ascending: false });
        if (condominiumId) {
            query = query.eq('condominium_id', condominiumId);
        }
        const { data, error } = await query;
        if (error) console.error('Error fetching payments:', error);
        else setPayments(data);
    }, [condominiumId]);

    const fetchDocuments = useCallback(async () => {
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
    }, [condominiumId]);

    const fetchUsers = useCallback(async () => {
        let query = supabase
            .from('kondo_users')
            .select('id, name')
            .order('name');
        if (condominiumId) {
            query = query.eq('condominium_id', condominiumId);
        }
        const { data, error } = await query;
        if (error) console.error('Error fetching users:', error);
        else setUsers(data);
    }, [condominiumId]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        await Promise.all([
            fetchNotices(),
            fetchPayments(),
            fetchDocuments(),
            isAdmin ? fetchUsers() : Promise.resolve()
        ]);
        setLoading(false);
    }, [fetchNotices, fetchPayments, fetchDocuments, fetchUsers, isAdmin]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Listen for search events from navbar
    useEffect(() => {
        const handleSearch = (event) => {
            setSearchQuery(event.detail);
        };
        
        window.addEventListener('navbar-search', handleSearch);
        return () => {
            window.removeEventListener('navbar-search', handleSearch);
        };
    }, []);

    // Filter function for search
    const filterItems = (items, fields) => {
        if (!debouncedSearch) return items;
        const query = debouncedSearch.toLowerCase();
        return items.filter(item => 
            fields.some(field => {
                const value = item[field];
                return value && value.toString().toLowerCase().includes(query);
            })
        );
    };

    const filteredNotices = filterItems(notices, ['title', 'content']);
    const filteredPayments = filterItems(payments, ['owner_name', 'unit', 'status']);
    const filteredDocuments = filterItems(documents, ['name']);

    // Highlight search matches
    const highlightMatch = (text, query) => {
        if (!query || !text) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark style="background: rgba(2, 132, 199, 0.2); padding: 0 2px; border-radius: 2px;">$1</mark>');
    };

    const handleAddNotice = async (e) => {
        e.preventDefault();
        const payload = {
            ...newNotice,
            author_id: currentUser.id
        };
        if (condominiumId) {
            payload.condominium_id = condominiumId;
        }
        const { error } = await supabase
            .from('kondo_notices')
            .insert([payload]);

        if (error) alert('Error adding notice: ' + error.message);
        else {
            setShowNoticeModal(false);
            setNewNotice({ title: '', content: '', urgent: false });
            fetchNotices();
        }
    };

    const handleDeleteNotice = async (id) => {
        if (!window.confirm('Are you sure you want to delete this notice?')) return;
        const { error } = await supabase.from('kondo_notices').delete().eq('id', id);
        if (error) alert('Error deleting notice: ' + error.message);
        else fetchNotices();
    };

    const handleAddPayment = async (e) => {
        e.preventDefault();
        const selectedUser = users.find(u => u.id === newPayment.owner_id);
        const payload = {
            ...newPayment,
            owner_name: selectedUser?.name || 'Unknown',
            amount: parseFloat(newPayment.amount)
        };
        if (condominiumId) {
            payload.condominium_id = condominiumId;
        }
        const { error } = await supabase
            .from('kondo_payments')
            .insert([payload]);

        if (error) alert('Error adding payment: ' + error.message);
        else {
            setShowPaymentModal(false);
            setNewPayment({
                owner_id: '',
                unit: '',
                amount: '',
                status: 'Pending',
                month: new Date().toISOString().slice(0, 7)
            });
            fetchPayments();
        }
    };

    const handleTogglePaymentStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Paid' ? 'Pending' : 'Paid';
        const { error } = await supabase
            .from('kondo_payments')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) alert('Error updating status: ' + error.message);
        else fetchPayments();
    };

    const handleDeletePayment = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        const { error } = await supabase.from('kondo_payments').delete().eq('id', id);
        if (error) alert('Error deleting payment: ' + error.message);
        else fetchPayments();
    };

    const handleUploadDocument = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
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

        if (error) {
            alert('Error getting download link: ' + error.message);
        } else {
            window.open(data.signedUrl, '_blank');
        }
    };

    return (
        <div className="app-container" style={{ paddingBottom: '4rem' }}>
            <Navbar />

            <section className="dashboard-header">
                <h1 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                    {t('dashboard.welcome')}, {currentUser?.user_metadata?.name || currentUser?.email}
                </h1>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-on-highlight)', fontWeight: '500' }}>
                    {t('dashboard.subtitle')}
                </p>
            </section>

            <main className="dashboard-grid">

                <Card
                    title={t('dashboard.recentNotices')}
                    viewAllLink="/notices"
                    action={isAdmin && (
                        <button
                            onClick={() => setShowNoticeModal(true)}
                            className="btn-primary"
                            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                        >
                            {t('dashboard.newAlertButton')}
                        </button>
                    )}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {loading ? (
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>{t('dashboard.loadingNotices')}</p>
                        ) : filteredNotices.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
                                {debouncedSearch ? t('dashboard.noSearchResults') || 'No notices match your search' : t('dashboard.noNotices')}
                            </p>
                        ) : (
                            filteredNotices.slice(0, 4).map(notice => (
                                <div key={notice.id} style={{
                                    padding: '1.25rem',
                                    borderRadius: '12px',
                                    background: notice.urgent ? 'var(--urgent-bg)' : 'var(--highlight-blue)',
                                    borderLeft: notice.urgent ? `4px solid var(--urgent-border)` : `4px solid var(--accent-color)`,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                    position: 'relative'
                                }}>
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDeleteNotice(notice.id)}
                                            style={{
                                                position: 'absolute',
                                                top: '0.5rem',
                                                right: '0.5rem',
                                                background: 'none',
                                                border: 'none',
                                                color: '#ef4444',
                                                cursor: 'pointer',
                                                fontSize: '1.2rem',
                                                opacity: 0.6
                                            }}
                                            title="Delete Notice"
                                        >
                                            &times;
                                        </button>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', paddingRight: isAdmin ? '1.5rem' : 0 }}>
                                        <span style={{ fontWeight: '700', color: notice.urgent ? '#b91c1c' : '#0369a1' }}>{notice.title}</span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            {new Date(notice.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                        {notice.content}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                <Card title={t('dashboard.paymentControl')} viewAllLink="/payments">
                    <div className="table-wrapper">
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                    <th style={{ padding: '1rem 0.5rem' }}>{t('dashboard.table.owner')}</th>
                                    <th style={{ padding: '1rem 0.5rem' }}>{t('dashboard.table.unit')}</th>
                                    <th style={{ padding: '1rem 0.5rem' }}>{t('dashboard.table.month')}</th>
                                    <th style={{ padding: '1rem 0.5rem' }}>{t('dashboard.table.status')}</th>
                                    {isAdmin && <th style={{ padding: '1rem 0.5rem' }}>{t('dashboard.table.actions')}</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={isAdmin ? 5 : 4} style={{ textAlign: 'center', padding: '1rem' }}>{t('dashboard.loadingPayments')}</td></tr>
                                ) : filteredPayments.length === 0 ? (
                                    <tr><td colSpan={isAdmin ? 5 : 4} style={{ textAlign: 'center', padding: '1rem' }}>
                                        {debouncedSearch ? t('dashboard.noSearchResults') || 'No payments match your search' : t('dashboard.noPayments')}
                                    </td></tr>
                                ) : (
                                    filteredPayments.slice(0, 4).map((p) => (
                                        <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)', fontSize: '0.9rem' }}>
                                            <td style={{ padding: '1rem 0.5rem' }}>{p.owner_name}</td>
                                            <td style={{ padding: '1rem 0.5rem' }}>{p.unit}</td>
                                            <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold' }}>{p.month}</td>
                                            <td style={{ padding: '1rem 0.5rem' }}>
                                                <span
                                                    onClick={() => isAdmin && handleTogglePaymentStatus(p.id, p.status)}
                                                    style={{
                                                        padding: '0.4rem 0.8rem',
                                                        borderRadius: '20px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '600',
                                                        background: p.status === 'Paid' ? 'var(--success-bg)' : 'var(--pending-bg)',
                                                        color: p.status === 'Paid' ? 'var(--success-text)' : 'var(--pending-text)',
                                                        border: p.status === 'Paid' ? '1px solid #bbf7d0' : '1px solid #fef08a',
                                                        cursor: isAdmin ? 'pointer' : 'default'
                                                    }}
                                                >
                                                    {p.status}
                                                </span>
                                            </td>
                                            {isAdmin && (
                                                <td style={{ padding: '1rem 0.5rem' }}>
                                                    <button
                                                        onClick={() => handleDeletePayment(p.id)}
                                                        className="icon-btn danger"
                                                        title="Delete record"
                                                    >
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {isAdmin && (
                        <button onClick={() => setShowPaymentModal(true)} className="btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.6rem' }}>
                            {t('dashboard.addPaymentRecord')}
                        </button>
                    )}
                </Card>

                <Card
                    title={t('dashboard.recentDocuments')}
                    viewAllLink="/documents"
                    action={isAdmin && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="file"
                                id="doc-upload"
                                style={{ display: 'none' }}
                                onChange={handleUploadDocument}
                            />
                            <button
                                onClick={() => document.getElementById('doc-upload').click()}
                                className="btn-primary"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                disabled={uploading}
                            >
                                {uploading ? '...' : t('dashboard.upload')}
                            </button>
                        </div>
                    )}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {loading ? (
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>{t('dashboard.loadingDocuments')}</p>
                        ) : filteredDocuments.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
                                {debouncedSearch ? t('dashboard.noSearchResults') || 'No documents match your search' : t('dashboard.noDocuments')}
                            </p>
                        ) : (
                            filteredDocuments.slice(0, 4).map((doc) => (
                                <div key={doc.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '1.25rem',
                                    borderRadius: '16px',
                                    background: 'var(--primary-bg)',
                                    border: '1px solid var(--glass-border)',
                                    transition: 'all 0.3s ease',
                                    position: 'relative'
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                        <span style={{ fontSize: '0.95rem', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.name}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                            {new Date(doc.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <button
                                            onClick={() => handleDownloadDocument(doc.file_path)}
                                            className="btn-secondary"
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                        >
                                            Download
                                        </button>
                                        {isAdmin && (
                                            <button
                                                onClick={() => handleDeleteDocument(doc.id, doc.file_path)}
                                                className="icon-btn danger"
                                                title="Delete Document"
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
                </Card>
            </main>

            {showNoticeModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
                }}>
                    <div className="premium-card" style={{ width: '400px', margin: '1rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>{t('dashboard.noticeModal.title')}</h3>
                        <form onSubmit={handleAddNotice} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem' }}>{t('dashboard.noticeModal.titleLabel')}</label>
                                <input required className="glass" style={{ width: '100%', padding: '0.8rem', outline: 'none', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                                    value={newNotice.title} onChange={e => setNewNotice({ ...newNotice, title: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem' }}>{t('dashboard.noticeModal.contentLabel')}</label>
                                <textarea required rows="4" className="glass" style={{ width: '100%', padding: '0.8rem', outline: 'none', border: '1px solid var(--glass-border)', borderRadius: '8px', resize: 'none' }}
                                    value={newNotice.content} onChange={e => setNewNotice({ ...newNotice, content: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input type="checkbox" id="urgent" checked={newNotice.urgent} onChange={e => setNewNotice({ ...newNotice, urgent: e.target.checked })} />
                                <label htmlFor="urgent" style={{ fontSize: '0.9rem' }}>{t('dashboard.noticeModal.markUrgent')}</label>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowNoticeModal(false)} className="nav-link" style={{ flex: 1 }}>{t('common.cancel')}</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>{t('dashboard.noticeModal.submit')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showPaymentModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
                }}>
                    <div className="premium-card" style={{ width: '400px', margin: '1rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>{t('dashboard.paymentModal.title')}</h3>
                        <form onSubmit={handleAddPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem' }}>{t('dashboard.paymentModal.ownerLabel')}</label>
                                <select
                                    required
                                    className="glass"
                                    style={{ width: '100%', padding: '0.8rem', outline: 'none', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                                    value={newPayment.owner_id}
                                    onChange={e => setNewPayment({ ...newPayment, owner_id: e.target.value })}
                                >
                                    <option value="">{t('payments.modal.ownerLabel')}</option>
                                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem' }}>{t('dashboard.paymentModal.unitLabel')}</label>
                                <input required className="glass" style={{ width: '100%', padding: '0.8rem', outline: 'none', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                                    value={newPayment.unit} onChange={e => setNewPayment({ ...newPayment, unit: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem' }}>{t('dashboard.paymentModal.monthLabel')}</label>
                                <input type="month" required className="glass" style={{ width: '100%', padding: '0.8rem', outline: 'none', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                                    value={newPayment.month} onChange={e => setNewPayment({ ...newPayment, month: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem' }}>{t('dashboard.paymentModal.amountLabel')}</label>
                                <input type="number" step="0.01" required className="glass" style={{ width: '100%', padding: '0.8rem', outline: 'none', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                                    value={newPayment.amount} onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowPaymentModal(false)} className="nav-link" style={{ flex: 1 }}>{t('common.cancel')}</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>{t('dashboard.paymentModal.submit')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
