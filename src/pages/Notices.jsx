import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDemo } from '../contexts/DemoContext';
import { supabase } from '../supabase';
import Navbar from '../components/Navbar';
import { useLanguage } from '../contexts/LanguageContext';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import FormInput from '../components/FormInput';
import Footer from '../components/Footer';
import FormTextArea from '../components/FormTextArea';
import { noticeSchema } from '../lib/validation';
import { useValidation } from '../hooks/useValidation';

const Notices = () => {
    const { currentUser, isAdmin, condominiumId } = useAuth();
    const { isDemoMode, getDemoSupabase, demoData } = useDemo();
    const { t } = useLanguage();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNoticeModal, setShowNoticeModal] = useState(false);
    
    // Confirm Dialog state
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        noticeId: null,
        noticeTitle: ''
    });
    
    // Form validation
    const [touchedFields, setTouchedFields] = useState({});
    const { data: newNotice, errors, updateField, validateAll, reset } = useValidation({
        schema: noticeSchema,
        initialData: { title: '', content: '', urgent: false }
    });

    const fetchNotices = useCallback(async () => {
        setLoading(true);
        if (isDemoMode) {
            setNotices(demoData.notices);
            setLoading(false);
            return;
        }
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
    }, [condominiumId, isDemoMode, demoData.notices]);

    useEffect(() => {
        fetchNotices();
    }, [fetchNotices]);

    const handleAddNotice = async (e) => {
        e.preventDefault();

        // Mark all fields as touched
        setTouchedFields({ title: true, content: true });

        if (!validateAll()) {
            return;
        }

        const payload = {
            ...newNotice,
            author_id: currentUser.id
        };
        if (condominiumId) {
            payload.condominium_id = condominiumId;
        }

        if (isDemoMode) {
            const { error } = getDemoSupabase('kondo_notices').insert(payload).select().single();
            if (error) alert('Error adding notice: ' + error.message);
            else {
                setShowNoticeModal(false);
                reset();
                setTouchedFields({});
                fetchNotices();
            }
            return;
        }

        const { error } = await supabase
            .from('kondo_notices')
            .insert([payload]);

        if (error) alert('Error adding notice: ' + error.message);
        else {
            setShowNoticeModal(false);
            reset();
            setTouchedFields({});
            fetchNotices();
        }
    };
    
    const handleFieldChange = (field) => (e) => {
        const value = field === 'urgent' ? e.target.checked : e.target.value;
        updateField(field, value);
    };
    
    const handleFieldBlur = (field) => () => {
        setTouchedFields(prev => ({ ...prev, [field]: true }));
    };
    
    const closeModal = () => {
        setShowNoticeModal(false);
        reset();
        setTouchedFields({});
    };

    const handleDeleteNotice = (id, title) => {
        setConfirmDialog({
            isOpen: true,
            noticeId: id,
            noticeTitle: title
        });
    };

    const confirmDeleteNotice = async () => {
        if (isDemoMode) {
            const { error } = getDemoSupabase('kondo_notices').delete().eq('id', confirmDialog.noticeId);
            if (error) alert('Error deleting notice: ' + error.message);
            else {
                fetchNotices();
                setConfirmDialog({ isOpen: false, noticeId: null, noticeTitle: '' });
            }
            return;
        }

        const { error } = await supabase.from('kondo_notices').delete().eq('id', confirmDialog.noticeId);
        if (error) alert('Error deleting notice: ' + error.message);
        else {
            fetchNotices();
            setConfirmDialog({ isOpen: false, noticeId: null, noticeTitle: '' });
        }
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
                            <EmptyState 
                                type="notices" 
                                actionLabel={isAdmin ? t('notices.newAlertButton') : null}
                                onAction={isAdmin ? () => setShowNoticeModal(true) : null}
                            />
                        ) : (
                            notices.map(notice => (
                                <div key={notice.id} className="notice-item" style={{
                                    background: notice.urgent ? 'var(--urgent-bg)' : 'var(--highlight-blue)',
                                    borderLeft: notice.urgent ? `6px solid var(--urgent-border)` : `6px solid var(--accent-color)`,
                                }}>
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDeleteNotice(notice.id, notice.title)}
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
                    <div className="premium-card" style={{ width: '450px', margin: '1rem', maxHeight: '90vh', overflow: 'auto' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>{t('notices.modal.title')}</h3>
                        <form onSubmit={handleAddNotice} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <FormInput
                                label={t('notices.modal.titleLabel')}
                                value={newNotice.title}
                                onChange={handleFieldChange('title')}
                                onBlur={handleFieldBlur('title')}
                                error={errors.title}
                                touched={touchedFields.title}
                                placeholder={t('notices.modal.titleLabel')}
                                required
                            />
                            <FormTextArea
                                label={t('notices.modal.contentLabel')}
                                value={newNotice.content}
                                onChange={handleFieldChange('content')}
                                onBlur={handleFieldBlur('content')}
                                error={errors.content}
                                touched={touchedFields.content}
                                placeholder={t('notices.modal.contentLabel')}
                                required
                                rows={4}
                                maxLength={2000}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <input 
                                    type="checkbox" 
                                    id="urgent" 
                                    checked={newNotice.urgent} 
                                    onChange={handleFieldChange('urgent')}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <label htmlFor="urgent" style={{ fontSize: '0.95rem', cursor: 'pointer', userSelect: 'none' }}>{t('notices.modal.markUrgent')}</label>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="button" onClick={closeModal} className="nav-link" style={{ flex: 1 }}>{t('common.cancel')}</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>{t('notices.modal.submit')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ isOpen: false, noticeId: null, noticeTitle: '' })}
                onConfirm={confirmDeleteNotice}
                type="danger"
                title={t('confirmDialog.danger.title')}
                message={confirmDialog.noticeTitle 
                    ? `${t('noticesPage.deleteConfirm')} "${confirmDialog.noticeTitle}"?`
                    : t('confirmDialog.danger.message')
                }
                confirmLabel={t('confirmDialog.danger.confirm')}
            />
            
            <Footer />
        </div>
    );
};

export default Notices;
