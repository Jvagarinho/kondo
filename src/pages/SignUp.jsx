import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import FormInput from '../components/FormInput';
import { signUpSchema } from '../lib/validation';
import { useValidation } from '../hooks/useValidation';

const SignUp = () => {
    const { t } = useLanguage();
    const { signUp } = useAuth();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [touchedFields, setTouchedFields] = useState({});
    
    const { data, errors, updateField, validateAll, isValid } = useValidation({
        schema: signUpSchema,
        initialData: { name: '', email: '', password: '' }
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
        setTouchedFields({ name: true, email: true, password: true });
        
        if (!validateAll()) {
            return;
        }

        try {
            setSubmitError('');
            setLoading(true);
            await signUp(data.email, data.password, data.name);
            navigate('/login');
        } catch (err) {
            setSubmitError(t('auth.signUp.errorPrefix') + err.message);
        }
        setLoading(false);
    }

    // Ícones para os campos
    const NameIcon = (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );

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

    // Dicas de senha
    const getPasswordHint = () => {
        if (!data.password) {
            return t('validation.passwordHint') || 'Password must be at least 8 characters with uppercase, lowercase, number and special character';
        }
        return null;
    };

    return (
        <div className="auth-layout">
            <div className="premium-card fade-in auth-card">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.75rem', color: 'var(--accent-color)' }}>
                    {t('auth.signUp.title')}
                </h2>
                
                {submitError && (
                    <div className="form-validation-summary" style={{ marginBottom: '1.5rem' }}>
                        <div className="form-validation-summary-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                            {submitError}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <FormInput
                        label={t('auth.signUp.fullNameLabel')}
                        type="text"
                        value={data.name}
                        onChange={handleFieldChange('name')}
                        onBlur={handleFieldBlur('name')}
                        error={errors.name}
                        touched={touchedFields.name}
                        placeholder={t('auth.signUp.fullNameLabel')}
                        required
                        icon={NameIcon}
                        autoComplete="name"
                    />
                    
                    <FormInput
                        label={t('auth.signUp.emailLabel')}
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
                        label={t('auth.signUp.passwordLabel')}
                        type="password"
                        value={data.password}
                        onChange={handleFieldChange('password')}
                        onBlur={handleFieldBlur('password')}
                        error={errors.password}
                        touched={touchedFields.password}
                        required
                        icon={PasswordIcon}
                        autoComplete="new-password"
                        hint={getPasswordHint()}
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
                                {t('auth.signUp.loading')}
                            </span>
                        ) : (
                            t('auth.signUp.submit')
                        )}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
                    {t('auth.signUp.switchText')}{' '}
                    <Link to="/login" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: '600' }}>
                        {t('auth.signUp.switchLink')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
