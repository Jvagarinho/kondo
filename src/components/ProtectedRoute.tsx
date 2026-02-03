import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import EmailWarning from '../components/EmailWarning';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEmailVerified?: boolean;
}

const ProtectedRoute = ({ children, requireEmailVerified = false }: ProtectedRouteProps) => {
  const { currentUser, emailVerified, sendVerificationEmail } = useAuth();
  const [showEmailWarning, setShowEmailWarning] = useState(false);
  const [resending, setResending] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!requireEmailVerified) return;

    if (currentUser && !emailVerified) {
      setShowEmailWarning(true);
    }
    setAuthLoading(false);
  }, [currentUser, emailVerified, requireEmailVerified, setAuthLoading]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requireEmailVerified && !emailVerified && showEmailWarning) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <EmailWarning
          onClose={() => setShowEmailWarning(false)}
          onResend={async () => {
            setResending(true);
            try {
              await sendVerificationEmail();
            } catch (err: any) {
              console.error('Failed to resend verification email:', err);
            } finally {
              setResending(false);
            }
          }}
          loading={resending}
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
