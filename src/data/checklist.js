export const SECTIONS = [
  { id: 's1', title: 'Revisión en los Counters Tráfico', items: [
    'Las Computadoras están encendidas',
    'Funciona correctamente KIU Res',
    'Están conectadas y funcionando las Impresoras' ] },
  { id: 's2', title: 'Revisión en Carga', items: [
    'Las Computadoras están encendidas',
    'Funciona correctamente Onix',
    'Están conectadas y funcionando las Impresoras' ] },
  { id: 's3', title: 'Revisión en Ventas', items: [
    'Funciona correctamente KIU Res',
    'Están conectadas y funcionando las Impresoras' ] },
  { id: 's4', title: 'Revisión en Puertas de Embarque', items: [
    'Funciona correctamente KIU Res',
    'Funciona el escáner' ] },
];
export const TOTAL_ITEMS = SECTIONS.reduce((n, s) => n + s.items.length, 0);
export const LOCALIDADES = ['ATO - BLA', 'ATO - CCS', 'ATO - MAR', 'ATO - PMV', 'ATO - VLN', 'ATO - BRM'];
export const TURNOS = ['04:30 a 12:30', '12:30 a 20:30', '20:30 a 04:30'];
export const UBICACIONES = ['Aeropuerto Nacional', 'Aeropuerto Internacional'];
export const SIGNERS = [
  { id: 'trafico', label: 'Supervisor de Tráfico' },
  { id: 'ventas', label: 'Supervisor de Ventas' },
  { id: 'carga', label: 'Supervisor de Carga' },
];
export const todayStr = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
};
export const initialState = () => {
  const checks = {}, obs = {};
  SECTIONS.forEach((s) => { obs[s.id] = ''; s.items.forEach((_, i) => { checks[`${s.id}-${i}`] = { ok: false, obs: '' }; }); });
  return {
    header: { soporte: '', telefono: '', localidad: 'ATO - BLA', horario: '04:30 a 12:30', fecha: todayStr(), ubicacion: 'Aeropuerto Nacional' },
    checks, comentarios: '', serial: null,
    signatures: { trafico: { name: '', img: '' }, ventas: { name: '', img: '' }, carga: { name: '', img: '' } },
  };
};

// Completa un estado guardado (posiblemente de una versión anterior) con la estructura actual.
export const migrateState = (saved) => {
  const base = initialState();
  const sigs = { ...base.signatures };
  Object.keys(sigs).forEach((k) => { sigs[k] = { ...sigs[k], ...(saved.signatures?.[k] || {}) }; });
  const checks = { ...base.checks };
  Object.keys(checks).forEach((k) => { checks[k] = { ...checks[k], ...(saved.checks?.[k] || {}) }; });
  return {
    ...base,
    ...saved,
    header: { ...base.header, ...(saved.header || {}) },
    checks,
    signatures: sigs,
    comentarios: typeof saved.comentarios === 'string' ? saved.comentarios : '',
    serial: saved.serial && saved.serial.id ? saved.serial : null,
  };
};
