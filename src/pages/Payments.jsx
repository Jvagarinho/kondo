import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';
import Navbar from '../components/Navbar';

const Payments = () => {
    const { isAdmin } = useAuth();
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

    useEffect(() => {
        fetchData();
    }, [isAdmin]);

    const fetchData = async () => {
        setLoading(true);
        await Promise.all([
            fetchPayments(),
            isAdmin ? fetchUsers() : Promise.resolve()
        ]);
        setLoading(false);
    };

    const fetchPayments = async () => {
        const { data, error } = await supabase
            .from('kondo_payments')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) console.error('Error fetching payments:', error);
        else setPayments(data);
    };

    const fetchUsers = async () => {
        const { data, error } = await supabase
            .from('kondo_users')
            .select('id, name')
            .order('name');
        if (error) console.error('Error fetching users:', error);
        else setUsers(data);
    };

    const handleAddPayment = async (e) => {
        e.preventDefault();
        const selectedUser = users.find(u => u.id === newPayment.owner_id);
        const { error } = await supabase
            .from('kondo_payments')
            .insert([{
                ...newPayment,
                owner_name: selectedUser?.name || 'Unknown',
                amount: parseFloat(newPayment.amount)
            }]);

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

    return (
        <div className="app-container" style={{ paddingBottom: '4rem' }}>
            <Navbar />

            <main style={{ padding: '0 2rem', maxWidth: '1000px', margin: '2rem auto' }}>
                <div className="premium-card fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Payment Control</h2>
                        {isAdmin && (
                            <button onClick={() => setShowPaymentModal(true)} className="btn-primary">
                                + Add Record
                            </button>
                        )}
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    <th style={{ padding: '1.25rem 1rem' }}>Owner</th>
                                    <th style={{ padding: '1.25rem 1rem' }}>Unit</th>
                                    <th style={{ padding: '1.25rem 1rem' }}>Month</th>
                                    <th style={{ padding: '1.25rem 1rem' }}>Amount</th>
                                    <th style={{ padding: '1.25rem 1rem' }}>Status</th>
                                    {isAdmin && <th style={{ padding: '1.25rem 1rem' }}>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={isAdmin ? 6 : 5} style={{ textAlign: 'center', padding: '2rem' }}>Loading payments...</td></tr>
                                ) : payments.length === 0 ? (
                                    <tr><td colSpan={isAdmin ? 6 : 5} style={{ textAlign: 'center', padding: '2rem' }}>No payment records found.</td></tr>
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
                                                        onClick={() => handleDeletePayment(p.id)}
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
                        <h3 style={{ marginBottom: '1.5rem' }}>Create Payment Record</h3>
                        <form onSubmit={handleAddPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Owner</label>
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
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Unit</label>
                                <input required className="glass" style={{ width: '100%', padding: '0.8rem', outline: 'none', borderRadius: '10px' }}
                                    value={newPayment.unit} onChange={e => setNewPayment({ ...newPayment, unit: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Reference Month</label>
                                <input type="month" required className="glass" style={{ width: '100%', padding: '0.8rem', outline: 'none', borderRadius: '10px' }}
                                    value={newPayment.month} onChange={e => setNewPayment({ ...newPayment, month: e.target.value })} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Amount ($)</label>
                                <input type="number" step="0.01" required className="glass" style={{ width: '100%', padding: '0.8rem', outline: 'none', borderRadius: '10px' }}
                                    value={newPayment.amount} onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowPaymentModal(false)} className="nav-link" style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create Record</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payments;
