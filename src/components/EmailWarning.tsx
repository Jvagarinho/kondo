import React from 'react';

interface EmailWarningProps {
  onClose: () => void;
  onResend: () => void;
  loading?: boolean;
}

const EmailWarning: React.FC<EmailWarningProps> = ({ onClose, onResend, loading = false }) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">
            Please Verify Your Email
          </h3>
          <p className="text-sm text-yellow-700 mb-4">
            We've sent a verification link to your email address.
            Please verify your email to access all features.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onResend}
              disabled={loading}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Sending...' : 'Resend Email'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white text-yellow-700 border border-yellow-300 rounded-lg text-sm font-medium hover:bg-yellow-50 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailWarning;
