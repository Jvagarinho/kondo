import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useToast } from '../hooks/useToast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      showError('Invalid or expired reset link');
      navigate('/forgot-password');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { supabase } = require('../supabase');
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError('Error updating password: ' + error.message);
        showError('Failed to update password');
      } else {
        showSuccess('Password updated successfully!');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      showError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Set New Password
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="password"
            label="New Password"
            placeholder="At least 8 characters, uppercase, number, special"
            value={password}
            onChange={(v) => setPassword(String(v))}
            required
          />

          <Input
            type="password"
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(v) => setConfirmPassword(String(v))}
            required
          />

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            disabled={!password || !confirmPassword}
            className="w-full"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to Login
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">Password Requirements:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li className="flex items-center gap-2">
              <span>•</span> At least 8 characters
            </li>
            <li className="flex items-center gap-2">
              <span>•</span> One uppercase letter
            </li>
            <li className="flex items-center gap-2">
              <span>•</span> One number
            </li>
            <li className="flex items-center gap-2">
              <span>•</span> One special character
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
