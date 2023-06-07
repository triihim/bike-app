import axios from 'axios';
import { useState } from 'react';

export const usePostRequest = <T>(path: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const post = async (data: object) => {
    try {
      setLoading(true);
      return await axios.post<T>(path, JSON.stringify(data), {
        baseURL: process.env.REACT_APP_API_BASE_URL,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error(error);
      setError('POST request failed');
    } finally {
      setLoading(false);
    }
  };

  return { post, loading, error };
};
