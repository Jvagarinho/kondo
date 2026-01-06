import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
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
                        .from('users')
                        .select('role')
                        .eq('id', user.id)
                        .single();

                    if (error) {
                        console.error("Error fetching user role", error);
                        setIsAdmin(false);
                    } else {
                        setIsAdmin(data?.role === 'admin');
                    }
                } catch (e) {
                    console.error("Error fetching user role", e);
                    setIsAdmin(false);
                }
            } else {
                setIsAdmin(false);
            }
            setLoading(false);
        }

        return () => subscription.unsubscribe();
    }, []);

    const value = {
        currentUser,
        isAdmin,
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
