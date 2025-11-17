import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier la session au chargement
  useEffect(() => {
    checkUser();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        console.log('✅ Utilisateur connecté:', session?.user?.email);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        console.log('👋 Utilisateur déconnecté');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 Token rafraîchi');
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Vérifier l'utilisateur actuel
  const checkUser = async () => {
    try {
      console.log('🔍 Vérification de la session...');
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Erreur vérification session:', error);
        throw error;
      }
      
      if (session) {
        console.log('✅ Session trouvée:', session.user.email);
        setUser(session.user);
      } else {
        console.log('ℹ️ Aucune session active');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Erreur vérification session:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Connexion avec identifiant et mot de passe
  const login = async (username, password) => {
    try {
      console.log('🔐 Tentative de connexion pour:', username);
      
      // L'email fictif est construit : username@booktime.local
      const email = `${username}@booktime.local`;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Erreur de connexion:', error.message);
        throw error;
      }

      console.log('✅ Connexion réussie:', data.user.email);
      setUser(data.user);
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      
      let errorMessage = error.message;
      
      if (error.message === 'Invalid login credentials') {
        errorMessage = 'Identifiant ou mot de passe incorrect';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Email non confirmé';
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      console.log('👋 Déconnexion en cours...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      console.log('✅ Déconnexion réussie');
      
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur de déconnexion:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};