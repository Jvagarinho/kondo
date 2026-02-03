import { useState, useCallback, useRef, useEffect } from 'react';

interface SecurityConfig {
  maxAttempts?: number;
  lockoutTime?: number; // in milliseconds
  sessionTimeout?: number; // in milliseconds
}

interface RateLimitState {
  attempts: number;
  lastAttempt: number;
  lockedUntil: number | null;
}

export function useSecurity(config: SecurityConfig = {}) {
  const {
    maxAttempts = 5,
    lockoutTime = 15 * 60 * 1000, // 15 minutes
    sessionTimeout = 30 * 60 * 1000 // 30 minutes
  } = config;

  const [rateLimitState, setRateLimitState] = useState<RateLimitState>(() => {
    const stored = localStorage.getItem('rateLimit');
    return stored ? JSON.parse(stored) : { attempts: 0, lastAttempt: 0, lockedUntil: null };
  });

  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    const activityInterval = setInterval(() => {
      const inactiveTime = Date.now() - lastActivityRef.current;
      if (inactiveTime > sessionTimeout) {
        handleSessionTimeout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(activityInterval);
  }, [sessionTimeout]);

  const updateLastActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  const incrementAttempts = useCallback((): { success: boolean; message?: string } => {
    const now = Date.now();

    if (rateLimitState.lockedUntil && now < rateLimitState.lockedUntil) {
      const remainingTime = Math.ceil((rateLimitState.lockedUntil - now) / 60000);
      return {
        success: false,
        message: `Too many attempts. Please try again in ${remainingTime} minutes.`
      };
    }

    const newAttempts = rateLimitState.attempts + 1;
    let lockedUntil: number | null = null;

    if (newAttempts >= maxAttempts) {
      lockedUntil = now + lockoutTime;
    }

    const newState = {
      attempts: newAttempts >= maxAttempts ? 0 : newAttempts,
      lastAttempt: now,
      lockedUntil
    };

    setRateLimitState(newState);
    localStorage.setItem('rateLimit', JSON.stringify(newState));

    if (lockedUntil) {
      return {
        success: false,
        message: `Too many failed attempts. Account locked for ${Math.ceil(lockoutTime / 60000)} minutes.`
      };
    }

    return { success: true };
  }, [rateLimitState, maxAttempts, lockoutTime]);

  const resetAttempts = useCallback(() => {
    const newState = { attempts: 0, lastAttempt: 0, lockedUntil: null as number | null };
    setRateLimitState(newState);
    localStorage.setItem('rateLimit', JSON.stringify(newState));
  }, []);

  const isLocked = useCallback((): boolean => {
    if (!rateLimitState.lockedUntil) return false;
    return Date.now() < rateLimitState.lockedUntil;
  }, [rateLimitState.lockedUntil]);

  const getTimeRemaining = useCallback((): number => {
    if (!rateLimitState.lockedUntil) return 0;
    const remaining = rateLimitState.lockedUntil - Date.now();
    return Math.max(0, Math.ceil(remaining / 1000));
  }, [rateLimitState.lockedUntil]);

  const generateCSRFToken = useCallback((): string => {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('csrfToken', token);
    return token;
  }, []);

  const validateCSRFToken = useCallback((token: string): boolean => {
    const storedToken = sessionStorage.getItem('csrfToken');
    return storedToken === token;
  }, []);

  const handleSessionTimeout = useCallback(() => {
    const { supabase } = require('../supabase');
    supabase.auth.signOut();
    window.location.href = '/login?reason=timeout';
  }, []);

  const checkPasswordStrength = useCallback((password: string): {
    score: number;
    feedback: string[];
    strong: boolean;
  } => {
    const feedback: string[] = [];

    if (password.length < 8) {
      feedback.push('Password should be at least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
      feedback.push('Include at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      feedback.push('Include at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      feedback.push('Include at least one number');
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      feedback.push('Include at least one special character');
    }

    const commonPatterns = ['123456', 'password', 'qwerty', 'abc123'];
    if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
      feedback.push('Avoid common password patterns');
    }

    const score = Math.max(0, 5 - feedback.length);
    const strong = score >= 4 && password.length >= 10;

    return { score, feedback, strong };
  }, []);

  return {
    incrementAttempts,
    resetAttempts,
    isLocked,
    getTimeRemaining,
    generateCSRFToken,
    validateCSRFToken,
    updateLastActivity,
    checkPasswordStrength,
    attemptsRemaining: maxAttempts - rateLimitState.attempts
  };
}
