import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';
import Navbar from '../components/Navbar';
import { useLanguage } from '../contexts/LanguageContext';

const Profile = () => {
    const { currentUser, condominiumId } = useAuth();
    const { t } = useLanguage();
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [condominiumName, setCondominiumName] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const loadProfile = async () => {
            if (!currentUser) {
                setLoading(false);
                return;
            }

            setError(null);

            const { data: userRow, error: userError } = await supabase
                .from('kondo_users')
                .select('name, address, phone, condominium_id')
                .eq('id', currentUser.id)
                .single();

            if (userError) {
                console.error('Error loading profile:', userError);
                setError(t('profile.error.load'));
                setLoading(false);
                return;
            }

            if (userRow) {
                setName(userRow.name || '');
                setAddress(userRow.address || '');
                setPhone(userRow.phone || '');

                const condoId = userRow.condominium_id || condominiumId;
                if (condoId) {
                    const { data: condo, error: condoError } = await supabase
                        .from('kondo_condominiums')
                        .select('name')
                        .eq('id', condoId)
                        .single();

                    if (condoError) {
                        console.error('Error loading condominium:', condoError);
                    } else if (condo) {
                        setCondominiumName(condo.name);
                    }
                }
            }

            setLoading(false);
        };

        loadProfile();
    }, [currentUser, condominiumId, t]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        setSaving(true);
        setError(null);
        setSuccess(null);

        const { error: updateError } = await supabase
            .from('kondo_users')
            .update({
                name: name.trim(),
                address: address.trim(),
                phone: phone.trim()
            })
            .eq('id', currentUser.id);

        if (updateError) {
            console.error('Error saving profile:', updateError);
            setError(t('profile.error.update'));
            setSaving(false);
            return;
        }

        try {
            await supabase.auth.updateUser({
                data: {
                    full_name: name.trim()
                }
            });
        } catch (authError) {
            console.error('Error updating auth profile:', authError);
        }

        setSaving(false);
        setSuccess(t('profile.success.update'));
    };

    return (
        <div className="app-container" style={{ paddingBottom: '4rem' }}>
            <Navbar />

            <main className="page-main-content" style={{ maxWidth: '800px' }}>
                <div className="premium-card fade-in">
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>{t('profile.title')}</h2>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            {t('profile.subtitle')}
                        </p>
                    </div>

                    {loading ? (
                        <p style={{ color: 'var(--text-secondary)' }}>{t('profile.loading')}</p>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {error && (
                                <div style={{ color: 'var(--error-color)', fontSize: '0.9rem' }}>
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div style={{ color: 'var(--accent-color)', fontSize: '0.9rem' }}>
                                    {success}
                                </div>
                            )}

                            <div>
                                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
                                    {t('profile.nameLabel')}
                                </span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="input-field"
                                    style={{ marginTop: '0.35rem' }}
                                />
                            </div>

                            <div>
                                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
                                    {t('profile.emailLabel')}
                                </span>
                                <input
                                    type="email"
                                    value={currentUser?.email || ''}
                                    readOnly
                                    className="input-field"
                                    style={{ marginTop: '0.35rem', opacity: 0.7 }}
                                />
                            </div>

                            <div>
                                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
                                    {t('profile.addressLabel')}
                                </span>
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    rows={3}
                                    className="input-field"
                                    style={{ marginTop: '0.35rem', resize: 'vertical' }}
                                />
                            </div>

                            <div>
                                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
                                    {t('profile.phoneLabel')}
                                </span>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="input-field"
                                    style={{ marginTop: '0.35rem' }}
                                />
                            </div>

                            <div>
                                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
                                    {t('profile.condominiumLabel')}
                                </span>
                                <input
                                    type="text"
                                    value={condominiumName || t('profile.condominiumUnassigned')}
                                    readOnly
                                    className="input-field"
                                    style={{ marginTop: '0.35rem', opacity: 0.7 }}
                                />
                                <p style={{ marginTop: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    {t('profile.condominiumHint')}
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={saving}
                                style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}
                            >
                                {saving ? 'Saving...' : t('profile.saveButton')}
                            </button>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Profile;
