// hooks/useBuildings.ts
import { useEffect, useState } from 'react';

type Building = {
  id: number;
  name: string;
  address: string;
  description: string;
  lat: number;
  lon: number;
}

const API_URL = import.meta.env.VITE_API_URL;

export const useBuildings = () => {
  const [allBuildings, setAllBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/buildings`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setAllBuildings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { allBuildings, loading, error };
};