import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useDemo } from './DemoContext.jsx';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const { isDemoMode, demoAuth, demoData } = useDemo();
    const [currentUser, setCurrentUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [condominiumId, setCondominiumId] = useState(null);
    const [loading, setLoading] = useState(true);

    async function signUp(email, password, name) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                }
            }
        });

        if (authError) throw authError;

        // Sign out immediately so they have to log in manually
        await supabase.auth.signOut();

        return authData.user;
    }

    async function login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data.user;
    }

    async function logout() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }

    useEffect(() => {
        // Se estiver em modo demo, configura o usuário fictício
        if (isDemoMode) {
            demoAuth(true).getSession().then(({ data }) => {
                const user = data.session.user;
                setCurrentUser(user);
                setIsAdmin(true);
                setCondominiumId(user.user_metadata.condominium_id);
                setLoading(false);
            });
            return;
        }

        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            handleAuthStateChange(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            handleAuthStateChange(session?.user ?? null);
        });

        async function handleAuthStateChange(user) {
            setCurrentUser(user);
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

        return () => subscription?.unsubscribe();
    }, [isDemoMode, demoAuth, demoData]);

    const value = {
        currentUser,
        isAdmin,
        condominiumId,
        signUp,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
