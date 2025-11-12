import React, { useState } from 'react';
import { BookOpen, Lock, User, Loader, AlertCircle } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await onLogin(username, password);
      if (!result.success) {
        setError(result.error || 'Identifiant ou mot de passe incorrect');
      }
    } catch (err) {
      setError('Erreur de connexion. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 mb-4"
            style={{ boxShadow: '0 0 40px rgba(20, 184, 166, 0.6)' }}>
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">BookTime</h1>
          <p className="text-gray-400">Votre bibliothèque personnelle</p>
        </div>

        {/* Formulaire de connexion */}
        <div className="bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 border border-gray-700"
          style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)' }}>
          
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Connexion</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Identifiant */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Identifiant
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Votre identifiant"
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 disabled:opacity-50 transition-all"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 disabled:opacity-50 transition-all"
                />
              </div>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              style={{ boxShadow: '0 0 30px rgba(20, 184, 166, 0.5)' }}
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-center text-gray-500 text-sm">
              Vos données sont sécurisées et chiffrées
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            BookTime v2.0 - Données stockées sur Supabase
          </p>
        </div>
      </div>
    </div>
  );
}