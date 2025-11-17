import { createClient } from '@supabase/supabase-js';

// 🔐 Configuration depuis les variables d'environnement
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Vérification de la configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Configuration Supabase manquante !');
  console.error('Vérifiez votre fichier .env');
}

// ✅ Configuration avec options d'authentification correctes
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'booktime-auth',
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'booktime',
    },
  },
});

// 🧪 Test de connexion au démarrage
supabase.from('books').select('count', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) {
      console.error('❌ Erreur connexion Supabase:', error.message);
    } else {
      console.log('✅ Connexion Supabase OK');
    }
  });

// Helper pour gérer les erreurs
export const handleSupabaseError = (error) => {
  console.error('Supabase error:', error);
  
  // Messages d'erreur personnalisés
  let errorMessage = 'Une erreur est survenue';
  
  if (error.message?.includes('JWT')) {
    errorMessage = 'Session expirée, veuillez vous reconnecter';
  } else if (error.message?.includes('Invalid login')) {
    errorMessage = 'Identifiant ou mot de passe incorrect';
  } else if (error.message?.includes('Network')) {
    errorMessage = 'Erreur de connexion réseau';
  } else if (error.message) {
    errorMessage = error.message;
  }
  
  return {
    success: false,
    error: errorMessage
  };
};

// Helper pour les réponses réussies
export const handleSupabaseSuccess = (data) => {
  return {
    success: true,
    data
  };
};