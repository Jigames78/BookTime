import { useState, useEffect } from 'react';

export const useStorage = (key, initialValue) => {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await window.storage.get(key);
        if (result) {
          setData(JSON.parse(result.value));
        }
      } catch (error) {
        console.log('Pas de données existantes');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [key]);

  const saveData = async (newData) => {
    try {
      await window.storage.set(key, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error('Erreur de sauvegarde:', error);
    }
  };

  return [data, saveData, loading];
};