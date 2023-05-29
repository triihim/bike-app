import axios from 'axios';
import { useEffect, useState } from 'react';

export const useGetRequest = <TResponse>(path: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TResponse | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get<TResponse>(path, { baseURL: process.env.REACT_APP_API_BASE_URL })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
        setError('GET Request failed');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [path]);

  return { loading, data, error };
};
