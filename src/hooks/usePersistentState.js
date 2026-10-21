import { useEffect, useState } from 'react';
export default function usePersistentState(key, initialFn) {
  const [state, setState] = useState(() => {
    try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw); } catch {}
    return initialFn();
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} }, [key, state]);
  return [state, setState];
}
