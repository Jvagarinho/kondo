import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import FormInput from '../components/FormInput';
import { loginSchema } from '../lib/validation';
import { useValidation } from '../hooks/useValidation';

const SignIn = () => {
    const { t } = useLanguage();
    const { login } = useAuth();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [touchedFields, setTouchedFields] = useState({});
    
    const { data, errors, updateField, validateAll, isValid } = useValidation({
        schema: loginSchema,
        initialData: { email: '', password: '' }
    });

    const handleFieldChange = (field) => (e) => {
        updateField(field, e.target.value);
        setSubmitError('');
    };

    const handleFieldBlur = (field) => () => {
        setTouchedFields(prev => ({ ...prev, [field]: true }));
    };

    async function handleSubmit(e) {
        e.preventDefault();
        
        // Mark all fields as touched
        setTouchedFields({ email: true, password: true });
        
        if (!validateAll()) {
            return;
        }

        try {
            setSubmitError('');
            setLoading(true);
            await login(data.email, data.password);
            navigate('/');
        } catch {
            setSubmitError(t('auth.signIn.error'));
        }
        setLoading(false);
    }

    // Ícones para os campos
    const EmailIcon = (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
        </svg>
    );

    const PasswordIcon = (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );

    return (
        <div className="auth-layout">
            <div className="premium-card fade-in auth-card">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.75rem', color: 'var(--accent-color)' }}>
                    {t('auth.signIn.title')}
                </h2>
                
                {submitError && (
                    <div className="form-validation-summary" style={{ marginBottom: '1.5rem' }}>
                        <div className="form-validation-summary-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                            {t('auth.signIn.error')}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <FormInput
                        label={t('auth.signIn.emailLabel')}
                        type="email"
                        value={data.email}
                        onChange={handleFieldChange('email')}
                        onBlur={handleFieldBlur('email')}
                        error={errors.email}
                        touched={touchedFields.email}
                        placeholder="email@example.com"
                        required
                        icon={EmailIcon}
                        autoComplete="email"
                    />
                    
                    <FormInput
                        label={t('auth.signIn.passwordLabel')}
                        type="password"
                        value={data.password}
                        onChange={handleFieldChange('password')}
                        onBlur={handleFieldBlur('password')}
                        error={errors.password}
                        touched={touchedFields.password}
                        required
                        icon={PasswordIcon}
                        autoComplete="current-password"
                    />
                    
                    <button 
                        disabled={loading || !isValid} 
                        className="btn-primary form-submit-btn" 
                        type="submit" 
                        style={{ marginTop: '0.75rem' }}
                    >
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <span className="spinner-small" />
                                {t('auth.signIn.loading')}
                            </span>
                        ) : (
                            t('auth.signIn.submit')
                        )}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                    {t('auth.signIn.switchText')}{' '}
                    <Link to="/signup" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: '600' }}>
                        {t('auth.signIn.switchLink')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
