import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDemo } from '../contexts/DemoContext';
import { supabase } from '../supabase';
import Navbar from '../components/Navbar';
import { useLanguage } from '../contexts/LanguageContext';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import Footer from '../components/Footer';

const Payments = () => {
    const { isAdmin, condominiumId } = useAuth();
    const { isDemoMode, getDemoSupabase, demoData } = useDemo();
    const { t } = useLanguage();
    const [payments, setPayments] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [newPayment, setNewPayment] = useState({
        owner_id: '',
        unit: '',
        amount: '',
        status: 'Pending',
        month: new Date().toISOString().slice(0, 7)
    });
    
    // Confirm Dialog state
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        paymentId: null,
        ownerName: ''
    });

    const fetchPayments = useCallback(async () => {
        if (isDemoMode) {
            setPayments(demoData.payments);
            return;
        }
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
    }, [condominiumId, isDemoMode, demoData.payments]);

    const fetchUsers = useCallback(async () => {
        if (isDemoMode) {
            setUsers(demoData.users);
            return;
        }
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
    }, [condominiumId, isDemoMode, demoData.users]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        await Promise.all([
            fetchPayments(),
            isAdmin ? fetchUsers() : Promise.resolve()
        ]);
        setLoading(false);
    }, [isAdmin, fetchPayments, fetchUsers]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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

        if (isDemoMode) {
            const { error } = getDemoSupabase('kondo_payments').insert(payload).select().single();
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
            return;
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

        if (isDemoMode) {
            const { error } = getDemoSupabase('kondo_payments').update({ status: newStatus }).eq('id', id);
            if (error) alert('Error updating status: ' + error.message);
            else fetchPayments();
            return;
        }

        const { error } = await supabase
            .from('kondo_payments')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) alert('Error updating status: ' + error.message);
        else fetchPayments();
    };

    const handleDeletePayment = (id, ownerName) => {
        setConfirmDialog({
            isOpen: true,
            paymentId: id,
            ownerName: ownerName
        });
    };

    const confirmDeletePayment = async () => {
        if (isDemoMode) {
            const { error } = getDemoSupabase('kondo_payments').delete().eq('id', confirmDialog.paymentId);
            if (error) alert('Error deleting payment: ' + error.message);
            else {
                fetchPayments();
                setConfirmDialog({ isOpen: false, paymentId: null, ownerName: '' });
            }
            return;
        }

        const { error } = await supabase.from('kondo_payments').delete().eq('id', confirmDialog.paymentId);
        if (error) alert('Error deleting payment: ' + error.message);
        else {
            fetchPayments();
            setConfirmDialog({ isOpen: false, paymentId: null, ownerName: '' });
        }
    };

    return (
        <div className="app-container" style={{ paddingBottom: '4rem' }}>
            <Navbar />

            <main className="page-main-content" style={{ maxWidth: '1000px' }}>
                <div className="premium-card fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>{t('payments.title')}</h2>
                        {isAdmin && (
                            <button onClick={() => setShowPaymentModal(true)} className="btn-primary">
                                {t('payments.addRecordButton')}
                            </button>
                        )}
                    </div>

                    <div className="table-wrapper">
                        {/* Desktop Table */}
                        <table className="desktop-only" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    <th style={{ padding: '1.25rem 1rem' }}>{t('payments.table.owner')}</th>
                                    <th style={{ padding: '1.25rem 1rem' }}>{t('payments.table.unit')}</th>
                                    <th style={{ padding: '1.25rem 1rem' }}>{t('payments.table.month')}</th>
                                    <th style={{ padding: '1.25rem 1rem' }}>{t('payments.table.amount')}</th>
                                    <th style={{ padding: '1.25rem 1rem' }}>{t('payments.table.status')}</th>
                                    {isAdmin && <th style={{ padding: '1.25rem 1rem' }}>{t('payments.table.actions')}</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={isAdmin ? 6 : 5} style={{ textAlign: 'center', padding: '2rem' }}>{t('payments.loading')}</td></tr>
                                ) : payments.length === 0 ? (
                                    <tr>
                                        <td colSpan={isAdmin ? 6 : 5} style={{ padding: 0 }}>
                                            <div className="empty-state-table">
                                                <EmptyState 
                                                    type="payments" 
                                                    compact={true}
                                                    actionLabel={isAdmin ? t('payments.addRecordButton') : null}
                                                    onAction={isAdmin ? () => setShowPaymentModal(true) : null}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    payments.map((p) => (
                                        <tr key={p.id} style={{ borderBottom: '1px solid var(--glass-border)', fontSize: '1rem', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--highlight-blue)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                            <td style={{ padding: '1.25rem 1rem', fontWeight: '500' }}>{p.owner_name}</td>
                                            <td style={{ padding: '1.25rem 1rem' }}>{p.unit}</td>
                                            <td style={{ padding: '1.25rem 1rem', fontWeight: '700', color: 'var(--accent-color)' }}>{p.month}</td>
                                            <td style={{ padding: '1.25rem 1rem' }}>${p.amount.toFixed(2)}</td>
                                            <td style={{ padding: '1.25rem 1rem' }}>
                                                <span
                                                    onClick={() => isAdmin && handleTogglePaymentStatus(p.id, p.status)}
                                                    style={{
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: '20px',
                                                        fontSize: '0.8rem',
                                                        fontWeight: '600',
                                                        background: p.status === 'Paid' ? 'var(--success-bg)' : 'var(--pending-bg)',
                                                        color: p.status === 'Paid' ? 'var(--success-text)' : 'var(--pending-text)',
                                                        border: p.status === 'Paid' ? '1px solid #bbf7d0' : '1px solid #fef08a',
                                                        cursor: isAdmin ? 'pointer' : 'default',
                                                        display: 'inline-block'
                                                    }}
                                                >
                                                    {p.status}
                                                </span>
                                            </td>
                                            {isAdmin && (
                                                <td style={{ padding: '1.25rem 1rem' }}>
                                                    <button
                                                        onClick={() => handleDeletePayment(p.id, p.owner_name)}
                                                        className="icon-btn danger"
                                                        title="Delete record"
                                                    >
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

                        {/* Mobile Cards View */}
                        <div className="mobile-only mobile-cards">
                            {loading ? (
                                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>{t('payments.loading')}</p>
                            ) : payments.length === 0 ? (
                                <EmptyState 
                                    type="payments" 
                                    compact={true}
                                    actionLabel={isAdmin ? t('payments.addRecordButton') : null}
                                    onAction={isAdmin ? () => setShowPaymentModal(true) : null}
                                />
                            ) : (
                                payments.map((p) => (
                                    <div key={p.id} className="mobile-card-item">
                                        <div className="mobile-card-row">
                                            <span className="mobile-card-label">{t('payments.table.owner')}</span>
                                            <span className="mobile-card-value owner">{p.owner_name}</span>
                                        </div>
                                        <div className="mobile-card-row">
                                            <span className="mobile-card-label">{t('payments.table.unit')}</span>
                                            <span className="mobile-card-value">{p.unit}</span>
                                        </div>
                                        <div className="mobile-card-row">
                                            <span className="mobile-card-label">{t('payments.table.month')}</span>
                                            <span className="mobile-card-value">{p.month}</span>
                                        </div>
                                        <div className="mobile-card-row">
                                            <span className="mobile-card-label">{t('payments.table.amount')}</span>
                                            <span className="mobile-card-value amount">${p.amount.toFixed(2)}</span>
                                        </div>
                                        <div className="mobile-card-row">
                                            <span className="mobile-card-label">{t('payments.table.status')}</span>
                                            <span className="mobile-card-value">
                                                <span
                                                    onClick={() => isAdmin && handleTogglePaymentStatus(p.id, p.status)}
                                                    className="status-badge"
                                                    style={{
                                                        padding: '0.375rem 0.875rem',
                                                        borderRadius: '20px',
                                                        fontSize: '0.8rem',
                                                        fontWeight: '600',
                                                        background: p.status === 'Paid' ? 'var(--success-bg)' : 'var(--pending-bg)',
                                                        color: p.status === 'Paid' ? 'var(--success-text)' : 'var(--pending-text)',
                                                        border: p.status === 'Paid' ? '1px solid #bbf7d0' : '1px solid #fef08a',
                                                        cursor: isAdmin ? 'pointer' : 'default',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.375rem'
                                                    }}
                                                >
                                                    <span style={{
                                                        width: '6px',
                                                        height: '6px',
                                                        borderRadius: '50%',
                                                        background: p.status === 'Paid' ? 'var(--success-text)' : 'var(--pending-text)',
                                                        display: 'inline-block'
                                                    }} />
                                                    {p.status}
                                                </span>
                                            </span>
                                        </div>
                                        {isAdmin && (
                                            <div className="mobile-card-actions">
                                                <button
                                                    onClick={() => handleDeletePayment(p.id, p.owner_name)}
                                                    className="icon-btn danger"
                                                    title="Delete record"
                                                    style={{ minWidth: '44px', minHeight: '44px' }}
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {showPaymentModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
                }}>
                    <div className="premium-card" style={{ width: '450px', margin: '1rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>{t('payments.modal.title')}</h3>
                        <form onSubmit={handleAddPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>{t('payments.modal.ownerLabel')}</label>
                                <select
                                    required
                                    className="glass"
                                    style={{ width: '100%', padding: '0.8rem', outline: 'none', borderRadius: '10px' }}
                                    value={newPayment.owner_id}
                                    onChange={e => setNewPayment({ ...newPayment, owner_id: e.target.value })}
                                >
                                    <option value="">Select Owner</option>
                                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>{t('payments.modal.unitLabel')}</label>
                                <input required className="glass" style={{ width: '100%', padding: '0.8rem', outline: 'none', borderRadius: '10px' }}
                                    value={newPayment.unit} onChange={e => setNewPayment({ ...newPayment, unit: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>{t('payments.modal.monthLabel')}</label>
                                <input type="month" required className="glass" style={{ width: '100%', padding: '0.8rem', outline: 'none', borderRadius: '10px' }}
                                    value={newPayment.month} onChange={e => setNewPayment({ ...newPayment, month: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>{t('payments.modal.amountLabel')}</label>
                                <input type="number" step="0.01" required className="glass" style={{ width: '100%', padding: '0.8rem', outline: 'none', borderRadius: '10px' }}
                                    value={newPayment.amount} onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowPaymentModal(false)} className="nav-link" style={{ flex: 1 }}>{t('common.cancel')}</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>{t('payments.modal.submit')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ isOpen: false, paymentId: null, ownerName: '' })}
                onConfirm={confirmDeletePayment}
                type="danger"
                title={t('confirmDialog.danger.title')}
                message={confirmDialog.ownerName
                    ? `${t('paymentsPage.deleteConfirm')} ${t('payments.table.owner')}: "${confirmDialog.ownerName}"?`
                    : t('confirmDialog.danger.message')
                }
                confirmLabel={t('confirmDialog.danger.confirm')}
            />
            
            <Footer />
        </div>
    );
};

export default Payments;
