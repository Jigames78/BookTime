import { createClient } from '@supabase/supabase-js';

// 🔐 Configuration depuis les variables d'environnement
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Vérification de la configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Configuration Supabase manquante !');
  console.error('Créez un fichier .env à la racine avec :');
  console.error('REACT_APP_SUPABASE_URL=votre_url');
  console.error('REACT_APP_SUPABASE_ANON_KEY=votre_key');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper pour gérer les erreurs
export const handleSupabaseError = (error) => {
  console.error('Supabase error:', error);
  return {
    success: false,
    error: error.message || 'Une erreur est survenue'
  };
};

// Helper pour les réponses réussies
export const handleSupabaseSuccess = (data) => {
  return {
    success: true,
    data
  };
};