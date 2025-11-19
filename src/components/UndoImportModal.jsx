import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, AlertCircle, CheckCircle, RotateCcw, X } from 'lucide-react';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

export default function UndoImportModal({ onClose }) {
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState(null);

  const loadRecentBooks = useCallback(async () => {
    try {
      setLoading(true);
      
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      
      const groups = groupByMinute(data || []);
      setRecentBooks(groups);
    } catch (error) {
      console.error('Erreur:', error);
      showMessage('Erreur de chargement', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecentBooks();
  }, [loadRecentBooks]);

  const groupByMinute = (books) => {
    const groups = [];
    const sortedBooks = [...books].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    let currentGroup = [];
    let lastTime = null;

    sortedBooks.forEach(book => {
      const bookTime = new Date(book.created_at);
      
      if (!lastTime || (lastTime - bookTime) < 60000) {
        currentGroup.push(book);
        lastTime = bookTime;
      } else {
        if (currentGroup.length > 0) {
          groups.push([...currentGroup]);
        }
        currentGroup = [book];
        lastTime = bookTime;
      }
    });

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  };

  const deleteGroup = async (group) => {
    const count = group.length;
    if (!window.confirm(`Voulez-vous vraiment supprimer ces ${count} livre(s) ajouté(s) récemment ?`)) {
      return;
    }

    setDeleting(true);
    let deleted = 0;

    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      
      for (const book of group) {
        try {
          const { error } = await supabase
            .from('books')
            .delete()
            .eq('id', book.id);

          if (!error) {
            deleted++;
          }
        } catch (error) {
          console.error('Erreur suppression:', error);
        }
      }

      showMessage(`${deleted} livre(s) supprimé(s) !`, 'success');
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
    } catch (error) {
      showMessage('Erreur lors de la suppression', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'reading': { label: 'En cours', color: 'bg-blue-500' },
      'finished': { label: 'Terminé', color: 'bg-green-500' },
      'stopped': { label: 'Arrêté', color: 'bg-red-500' },
      'autre': { label: 'Autre', color: 'bg-amber-500' }
    };
    return statusMap[status] || { label: status, color: 'bg-gray-500' };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${diffDays}j`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-lg bg-black/80" onClick={onClose}>
      <div className="rounded-3xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 bg-gray-800/95" onClick={(e) => e.stopPropagation()}>
        {message && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl ${
            message.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="font-semibold">{message.text}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <RotateCcw className="w-8 h-8 text-teal-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Annuler le dernier import</h2>
              <p className="text-sm text-gray-400">Supprimez les livres ajoutés par erreur</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Chargement...</p>
          </div>
        ) : recentBooks.length === 0 ? (
          <div className="text-center py-16 bg-gray-900/50 rounded-2xl border border-gray-700">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-xl text-gray-400">Aucun livre récent trouvé</p>
          </div>
        ) : (
          <div className="space-y-6">
            {recentBooks.map((group, groupIndex) => (
              <div key={groupIndex} className="bg-gray-900/50 rounded-2xl border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-teal-400">
                      {group.length === 1 ? '1 livre' : `${group.length} livres`}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Ajouté(s) {formatDate(group[0].created_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteGroup(group)}
                    disabled={deleting}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl font-semibold transition-all disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                    Supprimer ce groupe
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.map(book => {
                    const statusInfo = getStatusInfo(book.status);
                    return (
                      <div key={book.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-teal-500 transition-all">
                        <div className="flex gap-3">
                          <img
                            src={book.cover}
                            alt={book.title}
                            className="w-16 h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white truncate mb-1">
                              {book.title}
                            </h4>
                            {book.author && (
                              <p className="text-xs text-gray-400 truncate mb-2">{book.author}</p>
                            )}
                            <div className="flex items-center gap-2">
                              <span className={`${statusInfo.color} text-xs px-2 py-1 rounded-full`}>
                                {statusInfo.label}
                              </span>
                              {book.episode && (
                                <span className="text-xs text-purple-400">
                                  Ép. {book.episode}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}