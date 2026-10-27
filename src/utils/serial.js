// Serial compuesto: LOCALIDAD-AAAAMMDD-NN  (ej. ATO-BLA-20261027-01)
const KEY = 'avior-serial-counters';
const DATE_RE = /^(\d{2})\/(\d{2})\/(\d{4})$/;

export const isValidDate = (f) => {
  const m = DATE_RE.exec(String(f || '').trim());
  if (!m) return false;
  const [d, mo, y] = [+m[1], +m[2], +m[3]];
  const dt = new Date(y, mo - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d;
};

// Clave base (sin número del día). Cambia si cambia la localidad o la fecha.
export const serialKey = (header) => {
  const loc = String(header.localidad).replace(/\s+/g, '');
  const m = DATE_RE.exec(header.fecha.trim());
  return `${loc}-${m[3]}${m[2]}${m[1]}`;
};

const readCounters = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };

// Devuelve el serial existente si sigue siendo válido para esta localidad/fecha; si no, genera uno nuevo.
export function ensureSerial(data) {
  const key = serialKey(data.header);
  if (data.serial && data.serial.key === key) return { serial: data.serial, created: false };
  const counters = readCounters();
  const n = (counters[key] || 0) + 1;
  counters[key] = n;
  try { localStorage.setItem(KEY, JSON.stringify(counters)); } catch {}
  return { serial: { key, id: `${key}-${String(n).padStart(2, '0')}` }, created: true };
}
