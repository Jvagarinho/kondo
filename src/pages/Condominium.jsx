import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';
import Navbar from '../components/Navbar';
import { useLanguage } from '../contexts/LanguageContext';
import Footer from '../components/Footer';

const Condominium = () => {
    const { condominiumId, isAdmin } = useAuth();
    const { t } = useLanguage();
    const [condominium, setCondominium] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [creating, setCreating] = useState(false);
    const [editName, setEditName] = useState('');
    const [editAddress, setEditAddress] = useState('');
    const [newName, setNewName] = useState('');
    const [newAddress, setNewAddress] = useState('');

    useEffect(() => {
        const fetchCondominium = async () => {
            if (!condominiumId) {
                setLoading(false);
                return;
            }

        const { data, error: fetchError } = await supabase
                .from('kondo_condominiums')
                .select('*')
                .eq('id', condominiumId)
                .single();

            if (fetchError) {
                console.error('Error fetching condominium:', fetchError);
                setError('Unable to load condominium details.');
            } else {
                setCondominium(data);
                setEditName(data.name || '');
                setEditAddress(data.address || '');
            }

            setLoading(false);
        };

        fetchCondominium();
    }, [condominiumId]);

    return (
        <div className="app-container" style={{ paddingBottom: '4rem' }}>
            <Navbar />

            <main className="page-main-content" style={{ maxWidth: '800px' }}>
                <div className="premium-card fade-in">
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>{t('condominium.title')}</h2>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            {t('condominium.subtitle')}
                        </p>
                    </div>

                    {loading ? (
                        <p style={{ color: 'var(--text-secondary)' }}>Loading condominium details...</p>
                    ) : error ? (
                        <p style={{ color: 'var(--error-color)' }}>{error}</p>
                    ) : !condominiumId ? (
                        <p style={{ color: 'var(--text-secondary)' }}>
                            {t('condominium.noLink')}
                        </p>
                    ) : !condominium ? (
                        <p style={{ color: 'var(--text-secondary)' }}>
                            {t('condominium.noDetails')}
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
                                    {t('condominium.currentTitle')}
                                </h3>

                                {isAdmin ? (
                                    <form
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            setSaving(true);
                                            setError(null);

                                            const { error: updateError } = await supabase
                                                .from('kondo_condominiums')
                                                .update({
                                                    name: editName.trim(),
                                                    address: editAddress.trim()
                                                })
                                                .eq('id', condominiumId);

                                            if (updateError) {
                                                console.error('Error updating condominium:', updateError);
                                                setError('Unable to save condominium changes.');
                                            } else {
                                                setCondominium({
                                                    ...condominium,
                                                    name: editName.trim(),
                                                    address: editAddress.trim()
                                                });
                                            }

                                            setSaving(false);
                                        }}
                                        style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                                    >
                                        <div>
                                            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
                                                {t('condominium.nameLabel')}
                                            </span>
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                required
                                                className="input-field"
                                    style={{ marginTop: '0.35rem' }}
                                />
                            </div>

                            <div>
                                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
                                                {t('condominium.addressLabel')}
                                            </span>
                                <textarea
                                    value={editAddress}
                                    onChange={(e) => setEditAddress(e.target.value)}
                                    rows={3}
                                    className="input-field"
                                    style={{ marginTop: '0.35rem', resize: 'vertical' }}
                                />
                                        </div>

                                        <div>
                                            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
                                                {t('condominium.createdAtLabel')}
                                            </span>
                                            <div style={{ fontSize: '0.95rem', marginTop: '0.35rem', color: 'var(--text-secondary)' }}>
                                                {new Date(condominium.created_at).toLocaleString()}
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn-primary"
                                            disabled={saving}
                                            style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
                                        >
                                            {saving ? 'Saving...' : t('condominium.saveButton')}
                                        </button>
                                    </form>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <div>
                                            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
                                                {t('condominium.nameLabel')}
                                            </span>
                                            <div style={{ fontSize: '1.1rem', fontWeight: '600', marginTop: '0.35rem' }}>
                                                {condominium.name}
                                            </div>
                                        </div>

                                        <div>
                                            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
                                                {t('condominium.addressLabel')}
                                            </span>
                                            <div style={{ fontSize: '1rem', marginTop: '0.35rem' }}>
                                                {condominium.address || 'No address on file.'}
                                            </div>
                                        </div>

                                        <div>
                                            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
                                                {t('condominium.createdAtLabel')}
                                            </span>
                                            <div style={{ fontSize: '0.95rem', marginTop: '0.35rem', color: 'var(--text-secondary)' }}>
                                                {new Date(condominium.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {isAdmin && (
                                <div style={{ borderTop: '1px solid rgba(148, 163, 184, 0.25)', paddingTop: '2rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
                                        {t('condominium.createTitle')}
                                    </h3>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                        {t('condominium.createSubtitle')}
                                    </p>

                                    <form
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            setCreating(true);
                                            setError(null);

        const { error: insertError } = await supabase
                                                .from('kondo_condominiums')
                                                .insert([{
                                                    name: newName.trim(),
                                                    address: newAddress.trim()
                                                }])
                                                .select()
                                                .single();

                                            if (insertError) {
                                                console.error('Error creating condominium:', insertError);
                                                setError('Unable to create condominium.');
                                            } else {
                                                setNewName('');
                                                setNewAddress('');
                                            }

                                            setCreating(false);
                                        }}
                                        style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                                    >
                                        <div>
                                            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
                                                {t('condominium.nameLabel')}
                                            </span>
                                            <input
                                                type="text"
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                required
                                                className="input-field"
                                    style={{ marginTop: '0.35rem' }}
                                />
                            </div>

                            <div>
                                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
                                                {t('condominium.addressLabel')}
                                            </span>
                                <textarea
                                    value={newAddress}
                                    onChange={(e) => setNewAddress(e.target.value)}
                                    rows={3}
                                    className="input-field"
                                    style={{ marginTop: '0.35rem', resize: 'vertical' }}
                                />
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn-secondary"
                                            disabled={creating}
                                            style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
                                        >
                                            {creating ? 'Creating...' : t('condominium.createButton')}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default Condominium;

