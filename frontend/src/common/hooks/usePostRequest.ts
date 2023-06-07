import axios from 'axios';
import { useState } from 'react';

export const usePostRequest = <TData>(path: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const post = async (data: TData) => {
    try {
      setLoading(true);
      return await axios.post(path, data, { baseURL: process.env.REACT_APP_API_BASE_URL });
    } catch (error) {
      console.error(error);
      setError('POST request failed');
    } finally {
      setLoading(false);
    }
  };

  return { post, loading, error };
};
