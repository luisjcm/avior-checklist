import { useEffect, useState } from 'react';

// Persiste en localStorage. `migrate(saved)` completa/repara datos guardados con una estructura antigua o incompleta.
export default function usePersistentState(key, initialFn, migrate) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && typeof saved === 'object') return migrate ? migrate(saved) : saved;
      }
    } catch {}
    return initialFn();
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} }, [key, state]);
  return [state, setState];
}
