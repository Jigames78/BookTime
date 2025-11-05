import { useState, useEffect } from 'react';

export const useStorage = (key, initialValue) => {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erreur de chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveData = (newData) => {
    try {
      localStorage.setItem(key, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error('Erreur de sauvegarde:', error);
    }
  };

  return [data, saveData, loading];
};