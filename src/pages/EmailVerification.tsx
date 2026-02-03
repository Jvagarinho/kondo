import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useToast } from '../hooks/useToast';

const EmailVerification = () => {
  const { currentUser, sendVerificationEmail, emailVerified } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (emailVerified) {
      navigate('/', { replace: true });
    }
  }, [emailVerified, navigate]);

  const handleResend = async () => {
    setLoading(true);
    setResent(false);

    try {
      await sendVerificationEmail();
      setResent(true);
      showSuccess('Verification email sent! Check your inbox.');
    } catch (err: any) {
      showError('Failed to send verification email: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0 2.89 5.26L21 21M14.5 9h-9L12 13 6 7.5M12 13V9a3 3 0 016 0 0-6 0v4" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Verify Your Email
        </h2>

        <p className="text-gray-600 mb-6">
          We've sent a verification email to <strong>{currentUser.email}</strong>.
          Please check your inbox and click the verification link to activate your account.
        </p>

        {searchParams.get('resend') && (
          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-6">
            <p className="text-sm">
              Didn't receive the email? It may take a few minutes to arrive.
              Also, check your spam folder.
            </p>
          </div>
        )}

        {resent && (
          <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-6">
            <p className="text-sm">
              Verification email sent! Check your inbox.
            </p>
          </div>
        )}

        <Button
          onClick={handleResend}
          variant="primary"
          size="md"
          loading={loading}
          className="w-full mb-4"
        >
          {loading ? 'Sending...' : 'Resend Verification Email'}
        </Button>

        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-700 font-medium w-full"
        >
          Skip for Now
        </button>
      </div>
    </div>
  );
};

export default EmailVerification;
