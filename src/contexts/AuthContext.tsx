import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { AuthContextType, User } from '../types/auth.types';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [condominiumId, setCondominiumId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);

  async function signUp(email: string, password: string, name: string): Promise<User> {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (authError) throw authError;

    await supabase.auth.signOut();

    return authData.user as unknown as User;
  }

  async function login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.user as unknown as User;
  }

  async function logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async function sendVerificationEmail(): Promise<void> {
    if (!currentUser?.email) throw new Error('No user logged in');

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: currentUser.email,
    });

    if (error) throw error;
  }

  async function changePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
  }

  async function updateProfile(updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase.auth.updateUser({
      data: updates.user_metadata || {}
    });

    if (error) throw error;
    return data.user as unknown as User;
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthStateChange(session?.user ?? null, session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthStateChange(session?.user ?? null, session);
    });

    async function handleAuthStateChange(user: SupabaseUser | null, session: any) {
      setCurrentUser(user);
      setSession(session);
      setEmailVerified(session?.user?.email_confirmed_at ? true : false);

      if (user) {
        try {
          const { data, error } = await supabase
            .from('kondo_users')
            .select('role, condominium_id')
            .eq('id', user.id)
            .single();

          if (error) {
            setIsAdmin(false);
            setCondominiumId(null);
          } else if (!data) {
            setIsAdmin(false);
            setCondominiumId(null);
          } else {
            setIsAdmin(data.role === 'admin');
            setCondominiumId(data.condominium_id || null);
          }
        } catch (e) {
          console.error("Error fetching user role", e);
          setIsAdmin(false);
          setCondominiumId(null);
        }
      } else {
        setIsAdmin(false);
        setCondominiumId(null);
      }
      setLoading(false);
    }

    return () => subscription.unsubscribe();
  }, []);

  const value: AuthContextType = {
    currentUser: currentUser as unknown as User,
    session,
    isAdmin,
    condominiumId,
    emailVerified,
    signUp,
    login,
    logout,
    sendVerificationEmail,
    changePassword,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
