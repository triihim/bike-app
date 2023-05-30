import { useEffect, useState } from 'react';

interface DebouncedInputProps {
  debounceTimeMs?: number;
  onChange(value: string): void;
}

export const DebouncedInput = ({ debounceTimeMs, onChange }: DebouncedInputProps) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounceTimeMs || 500);
    return () => clearTimeout(timeout);
  }, [value]);

  return <input onChange={(event) => setValue(event.target.value)}></input>;
};
