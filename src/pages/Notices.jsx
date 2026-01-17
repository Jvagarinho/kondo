import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';
import Navbar from '../components/Navbar';
import { useLanguage } from '../contexts/LanguageContext';

const Notices = () => {
    const { currentUser, isAdmin, condominiumId } = useAuth();
    const { t } = useLanguage();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNoticeModal, setShowNoticeModal] = useState(false);
    const [newNotice, setNewNotice] = useState({ title: '', content: '', urgent: false });

    const fetchNotices = useCallback(async () => {
        setLoading(true);
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
        setLoading(false);
    }, [condominiumId]);

    useEffect(() => {
        fetchNotices();
    }, [fetchNotices]);

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

    return (
        <div className="app-container" style={{ paddingBottom: '4rem' }}>
            <Navbar />

            <main className="page-main-content" style={{ maxWidth: '800px' }}>
                <div className="premium-card fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>{t('notices.title')}</h2>
                        {isAdmin && (
                            <button onClick={() => setShowNoticeModal(true)} className="btn-primary">
                                {t('notices.newAlertButton')}
                            </button>
                        )}
                    </div>

                    <div className="notices-list">
                        {loading ? (
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>{t('notices.loading')}</p>
                        ) : notices.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>{t('notices.empty')}</p>
                        ) : (
                            notices.map(notice => (
                                <div key={notice.id} className="notice-item" style={{
                                    background: notice.urgent ? 'var(--urgent-bg)' : 'var(--highlight-blue)',
                                    borderLeft: notice.urgent ? `6px solid var(--urgent-border)` : `6px solid var(--accent-color)`,
                                }}>
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDeleteNotice(notice.id)}
                                            style={{
                                                position: 'absolute',
                                                top: '1rem',
                                                right: '1rem',
                                                background: 'none',
                                                border: 'none',
                                                color: '#ef4444',
                                                cursor: 'pointer',
                                                fontSize: '1.5rem',
                                                opacity: 0.6
                                            }}
                                        >
                                            &times;
                                        </button>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingRight: isAdmin ? '2rem' : 0 }}>
                                        <span style={{ fontSize: '1.1rem', fontWeight: '700', color: notice.urgent ? '#b91c1c' : '#0369a1' }}>
                                            {notice.title}
                                        </span>
                                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                            {new Date(notice.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>
                                        {notice.content}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            {showNoticeModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
                }}>
                    <div className="premium-card" style={{ width: '450px', margin: '1rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>{t('notices.modal.title')}</h3>
                        <form onSubmit={handleAddNotice} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>{t('notices.modal.titleLabel')}</label>
                                <input required className="glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '10px' }}
                                    value={newNotice.title} onChange={e => setNewNotice({ ...newNotice, title: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>{t('notices.modal.contentLabel')}</label>
                                <textarea required rows="5" className="glass" style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', resize: 'none' }}
                                    value={newNotice.content} onChange={e => setNewNotice({ ...newNotice, content: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <input type="checkbox" id="urgent" checked={newNotice.urgent} onChange={e => setNewNotice({ ...newNotice, urgent: e.target.checked })} />
                                <label htmlFor="urgent" style={{ fontSize: '0.95rem', cursor: 'pointer' }}>{t('notices.modal.markUrgent')}</label>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowNoticeModal(false)} className="nav-link" style={{ flex: 1 }}>{t('common.cancel')}</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>{t('notices.modal.submit')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notices;
