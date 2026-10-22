import { useEffect, useState } from 'react';

// Só devolve o novo valor depois que ele para de mudar por `delay` ms.
export default function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
