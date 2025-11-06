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

const createStorage = () => {
  const hasLocal = typeof window !== 'undefined' && !!window.localStorage;
  const mem = new Map();

  return {
    async set(key, value) {
      try {
        const v = typeof value === 'string' ? value : JSON.stringify(value);
        if (hasLocal) {
          window.localStorage.setItem(key, v);
        } else {
          mem.set(key, v);
        }
      } catch (e) {
        console.error('storage set error', e);
      }
    },
    async get(key) {
      try {
        const v = hasLocal ? window.localStorage.getItem(key) : mem.get(key);
        if (v === null || v === undefined) return null;
        try { return JSON.parse(v); } catch { return v; }
      } catch (e) {
        console.error('storage get error', e);
        return null;
      }
    },
    async remove(key) {
      try {
        if (hasLocal) {
          window.localStorage.removeItem(key);
        } else {
          mem.delete(key);
        }
      } catch (e) {
        console.error('storage remove error', e);
      }
    }
  };
};

const storage = createStorage();
export default storage;