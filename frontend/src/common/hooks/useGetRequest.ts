import axios from 'axios';
import { useEffect, useState } from 'react';

export const useGetRequest = <TResponse>(path: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TResponse | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      axios.get<TResponse>(path, { baseURL: 'http://localhost:3000' }).then((response) => {
        setData(response.data);
      });
    } catch (error) {
      console.error(error);
      setError('GET Request failed');
    }
    setLoading(false);
  }, [path]);

  return { loading, data, error };
};
