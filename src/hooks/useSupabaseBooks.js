import { useState, useEffect } from 'react';
import { supabase, handleSupabaseError, handleSupabaseSuccess } from '../lib/supabase';
import { getCoverUrl } from '../utils/imageGenerator';

export const useSupabaseBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 📥 Charger tous les livres
  const loadBooks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
      setError(null);
    } catch (err) {
      console.error('Erreur chargement:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ➕ Ajouter un livre
  const addBook = async (book) => {
    try {
      const { data, error } = await supabase
        .from('books')
        .insert([book])
        .select()
        .single();

      if (error) throw error;
      
      setBooks([data, ...books]);
      return handleSupabaseSuccess(data);
    } catch (err) {
      return handleSupabaseError(err);
    }
  };

  // ✏️ Mettre à jour un livre
  const updateBook = async (bookId, updates) => {
    try {
      const { data, error } = await supabase
        .from('books')
        .update(updates)
        .eq('id', bookId)
        .select()
        .single();

      if (error) throw error;

      setBooks(books.map(book => book.id === bookId ? data : book));
      return handleSupabaseSuccess(data);
    } catch (err) {
      return handleSupabaseError(err);
    }
  };

  // 🗑️ Supprimer un livre
  const deleteBook = async (bookId) => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);

      if (error) throw error;

      setBooks(books.filter(book => book.id !== bookId));
      return handleSupabaseSuccess();
    } catch (err) {
      return handleSupabaseError(err);
    }
  };

  // 📦 Import multiple avec recherche automatique des couvertures
  const importBooks = async (newBooks) => {
    try {
      console.log(`🔄 Import de ${newBooks.length} livres...`);
      
      // Chercher les couvertures pour chaque livre
      const booksWithCovers = await Promise.all(
        newBooks.map(async (book) => {
          console.log(`🔍 Recherche couverture pour: ${book.title}`);
          const cover = await getCoverUrl(book.title);
          return { ...book, cover };
        })
      );

      // Insérer tous les livres avec leurs couvertures
      const { data, error } = await supabase
        .from('books')
        .insert(booksWithCovers)
        .select();

      if (error) throw error;

      setBooks([...data, ...books]);
      console.log(`✅ ${data.length} livres importés avec succès !`);

      return handleSupabaseSuccess(data);
    } catch (err) {
      return handleSupabaseError(err);
    }
  };

  // 🗑️ Tout supprimer
  const clearAllBooks = async () => {
    if (!window.confirm('Voulez-vous vraiment supprimer TOUTES vos lectures ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .neq('id', 0);

      if (error) throw error;

      setBooks([]);
      return handleSupabaseSuccess();
    } catch (err) {
      return handleSupabaseError(err);
    }
  };

  // 📊 Statistiques
  const getStats = () => ({
    total: books.length,
    finished: books.filter(b => b.status === 'finished').length,
    reading: books.filter(b => b.status === 'reading').length,
    stopped: books.filter(b => b.status === 'stopped').length,
    autre: books.filter(b => b.status === 'autre').length
  });

  // 🔄 Charger au montage
  useEffect(() => {
    loadBooks();

    // 🎧 Écouter les changements en temps réel
    const subscription = supabase
      .channel('books_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'books' },
        (payload) => {
          console.log('Changement détecté:', payload);
          loadBooks();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    books,
    loading,
    error,
    addBook,
    updateBook,
    deleteBook,
    clearAllBooks,
    importBooks,
    getStats,
    refreshBooks: loadBooks
  };
};