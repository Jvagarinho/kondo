import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';
import Navbar from '../components/Navbar';
import { useLanguage } from '../contexts/LanguageContext';

const Users = () => {
    const { isAdmin } = useAuth();
    const { t } = useLanguage();
    const [users, setUsers] = useState([]);
    const [condominiums, setCondominiums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isAdmin) {
            fetchData();
        }
    }, [isAdmin]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch all condominiums for the dropdown
            const { data: condos, error: condoError } = await supabase
                .from('kondo_condominiums')
                .select('id, name')
                .order('name');
            
            if (condoError) throw condoError;
            setCondominiums(condos || []);

            // Fetch all users with their current condominium details
            // We join manually or fetch separate since we might not have a foreign key relationship set up 
            // exactly for a join in the way supabase-js expects without explicit defining, 
            // but we added condominium_id to kondo_users, so it should be fine.
            // Let's just fetch users and match locally for simplicity and reliability.
            const { data: usersData, error: usersError } = await supabase
                .from('kondo_users')
                .select('*')
                .order('name');
            
            if (usersError) throw usersError;
            setUsers(usersData || []);

        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Error loading data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUserCondo = async (userId, newCondoId) => {
        try {
            const { error } = await supabase
                .from('kondo_users')
                .update({ condominium_id: newCondoId === 'none' ? null : newCondoId })
                .eq('id', userId);

            if (error) throw error;

            // Update local state
            setUsers(users.map(u => 
                u.id === userId 
                    ? { ...u, condominium_id: newCondoId === 'none' ? null : newCondoId } 
                    : u
            ));

        } catch (error) {
            console.error('Error updating user:', error);
            alert('Error updating user condominium: ' + error.message);
        }
    };

    const filteredUsers = users.filter(user => 
        (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isAdmin) {
        return (
            <div className="app-container">
                <Navbar />
                <main className="page-main-content">
                    <div className="premium-card">
                        <p style={{ color: 'var(--error-color)', textAlign: 'center' }}>
                            {t('users.accessDenied')}
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="app-container" style={{ paddingBottom: '4rem' }}>
            <Navbar />

            <main className="page-main-content" style={{ maxWidth: '1000px' }}>
                <div className="premium-card fade-in">
                    <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>{t('users.title')}</h2>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                {t('users.subtitle')}
                            </p>
                        </div>
                        <input
                            type="text"
                            placeholder={t('users.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field"
                            style={{
                                width: 'auto',
                                minWidth: '250px'
                            }}
                        />
                    </div>

                    {loading ? (
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>Loading users...</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                                        <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('users.table.user')}</th>
                                        <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('users.table.contact')}</th>
                                        <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('users.table.condominium')}</th>
                                        <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>{t('users.table.role')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(user => (
                                        <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: '600' }}>{user.name || 'Unnamed User'}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontSize: '0.9rem' }}>{user.phone || '-'}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.address || '-'}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <select
                                                    value={user.condominium_id || 'none'}
                                                    onChange={(e) => handleUpdateUserCondo(user.id, e.target.value)}
                                                    className="input-field"
                                                    style={{
                                                        padding: '0.5rem',
                                                        maxWidth: '250px'
                                                    }}
                                                >
                                                    <option value="none">-- Not Assigned --</option>
                                                    {condominiums.map(condo => (
                                                        <option key={condo.id} value={condo.id}>
                                                            {condo.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.8rem',
                                                    background: user.role === 'admin' ? 'var(--accent-glow)' : 'var(--bg-secondary)',
                                                    color: user.role === 'admin' ? 'var(--accent-color)' : 'var(--text-secondary)',
                                                    fontWeight: '500'
                                                }}>
                                                    {user.role}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredUsers.length === 0 && (
                                <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    {t('users.noneFound')} "{searchTerm}"
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Users;
