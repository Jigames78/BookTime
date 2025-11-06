import { useState, useEffect } from 'react';

// Détecte si on est dans Claude (window.storage existe) ou en local
const isClaudeEnvironment = typeof window !== 'undefined' && window.storage;

export const useStorage = (key, initialValue) => {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (isClaudeEnvironment) {
          // Dans Claude : utiliser le cloud storage
          const result = await window.storage.get(key, true);
          if (result && result.value) {
            setData(JSON.parse(result.value));
          }
        } else {
          // En local : utiliser localStorage
          const savedData = localStorage.getItem(key);
          if (savedData) {
            setData(JSON.parse(savedData));
          }
        }
      } catch (err) {
        console.log('Première utilisation ou données non trouvées');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [key]);

  const saveData = async (newData) => {
    try {
      if (isClaudeEnvironment) {
        // Dans Claude : sauvegarder dans le cloud
        await window.storage.set(key, JSON.stringify(newData), true);
      } else {
        // En local : sauvegarder dans localStorage
        localStorage.setItem(key, JSON.stringify(newData));
      }
      setData(newData);
      setError(null);
    } catch (err) {
      console.error('Erreur de sauvegarde:', err);
      setError('Erreur lors de la sauvegarde');
      alert('Erreur lors de la sauvegarde des données');
    }
  };

  return [data, saveData, loading, error];
};