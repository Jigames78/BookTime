import { useState, useEffect } from 'react';

export const useStorage = (key, initialValue) => {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const savedData = localStorage.getItem(key);
        if (savedData) {
          setData(JSON.parse(savedData));
        }
      } catch (error) {
        console.log('Pas de données existantes, utilisation des valeurs par défaut');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [key]);

  const saveData = (newData) => {
    try {
      localStorage.setItem(key, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error('Erreur de sauvegarde:', error);
      alert('Erreur lors de la sauvegarde des données');
    }
  };

  return [data, saveData, loading];
};