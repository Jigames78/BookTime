import { useState, useEffect } from 'react';

export const useStorage = (key, initialValue) => {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Utilisation du stockage cloud partagé
        const result = await window.storage.get(key, true);
        if (result && result.value) {
          setData(JSON.parse(result.value));
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
      // Sauvegarde dans le cloud (shared: true)
      await window.storage.set(key, JSON.stringify(newData), true);
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