import React, { useState, useRef } from 'react';
import { ChevronDown, Check, CheckCheck, PenLine, Trash2, Headset } from 'lucide-react';
import { SECTIONS, TOTAL_ITEMS, LOCALIDADES, TURNOS, UBICACIONES, SIGNERS } from '../data/checklist';
import SignatureModal from './SignatureModal';

const inp = 'w-full min-w-0 h-12 px-3 text-sm sm:text-base rounded-xl bg-avior-well text-avior-ink placeholder:text-zinc-500 border border-avior-line focus:border-avior-bright focus:ring-2 focus:ring-avior-bright/30 outline-none';
const errCls = '!border-red-400 ring-2 ring-red-500/40 animate-shake scroll-mt-24';
const Field = ({ label, error, children }) => (<label className="block"><span className={`text-xs uppercase tracking-wide ${error ? 'text-red-300' : 'text-avior-muted'}`}>{label}{error && ' *'}</span>{children}{error && <span className="block text-xs text-red-300 mt-1">Campo obligatorio</span>}</label>);

export default function OperativeView({ data, setData, missing = [], setMissing = () => {} }) {
  const [open, setOpen] = useState({ s1: true });
  const [signing, setSigning] = useState(null);
  const [burst, setBurst] = useState({}); // key -> orden para animar en cascada
  const burstTimer = useRef(null);
  const done = Object.values(data.checks).filter((c) => c.ok).length;
  const pct = Math.round((done / TOTAL_ITEMS) * 100);

  const setHeader = (k, v) => { if (v.trim() && (k !== 'fecha' || /^\d{2}\/\d{2}\/\d{4}$/.test(v.trim()))) setMissing((m) => m.filter((x) => x !== k)); setHeaderRaw(k, v); };
  const setHeaderRaw = (k, v) => setData((d) => ({ ...d, header: { ...d.header, [k]: v } }));
  const setCheck = (key, patch) => setData((d) => ({ ...d, checks: { ...d.checks, [key]: { ...d.checks[key], ...patch } } }));
  const setSig = (id, patch) => setData((d) => ({ ...d, signatures: { ...d.signatures, [id]: { ...d.signatures[id], ...patch } } }));
  const markAll = (s) => {
    const fresh = {}; let n = 0;
    s.items.forEach((_, i) => { const k = `${s.id}-${i}`; if (!data.checks[k].ok) fresh[k] = n++; });
    if (!n) return;
    setBurst(fresh);
    clearTimeout(burstTimer.current);
    burstTimer.current = setTimeout(() => setBurst({}), 700 + n * 110);
    if (navigator.vibrate) navigator.vibrate(30);
    applyAll(s);
  };
  const applyAll = (s) => setData((d) => { const checks = { ...d.checks }; s.items.forEach((_, i) => { checks[`${s.id}-${i}`] = { ...checks[`${s.id}-${i}`], ok: true }; }); return { ...d, checks }; });

  return (
    <div className="space-y-4 pb-28">
      <div className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-avior-silver/95 backdrop-blur">
        <div className="flex justify-between text-sm text-avior-ink mb-1"><span>{done}/{TOTAL_ITEMS} verificados</span><span>{pct}%</span></div>
        <div className="h-3 rounded-full bg-avior-line overflow-hidden"><div className="h-full bg-emerald-400 transition-all" style={{ width: `${pct}%` }} /></div>
      </div>

      <section className="bg-metal rounded-2xl p-4 space-y-3 border border-avior-line shadow-lg shadow-black/30">
        <h2 className="text-avior-light font-semibold">Datos de cabecera</h2>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Soporte" error={missing.includes('soporte')}><input id="field-soporte" className={`${inp} ${missing.includes('soporte') ? errCls : ''}`} placeholder="Nombre del técnico" value={data.header.soporte} onChange={(e) => setHeader('soporte', e.target.value)} /></Field>
          <Field label="Teléfono" error={missing.includes('telefono')}><input id="field-telefono" className={`${inp} ${missing.includes('telefono') ? errCls : ''}`} inputMode="tel" placeholder="0412-0000000" value={data.header.telefono} onChange={(e) => setHeader('telefono', e.target.value)} /></Field>
          <Field label="Localidad"><select className={inp} value={data.header.localidad} onChange={(e) => setHeader('localidad', e.target.value)}>{[...new Set([data.header.localidad, ...LOCALIDADES])].map((o) => <option key={o}>{o}</option>)}</select></Field>
          <Field label="Fecha" error={missing.includes('fecha')}><input id="field-fecha" className={`${inp} ${missing.includes('fecha') ? errCls : ''}`} placeholder="DD/MM/AAAA" inputMode="numeric" value={data.header.fecha} onChange={(e) => setHeader('fecha', e.target.value)} /></Field>
        </div>
        <Field label="Horario de soporte">
          <select className={inp} value={data.header.horario} onChange={(e) => setHeader('horario', e.target.value)}>
            {[...new Set([data.header.horario, ...TURNOS])].filter(Boolean).map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Ubicación"><select className={inp} value={data.header.ubicacion} onChange={(e) => setHeader('ubicacion', e.target.value)}>{UBICACIONES.map((o) => <option key={o}>{o}</option>)}</select></Field>
      </section>


      {SECTIONS.map((s, si) => {
        const sd = s.items.filter((_, i) => data.checks[`${s.id}-${i}`].ok).length;
        const isOpen = !!open[s.id];
        return (
          <section key={s.id} className="bg-metal rounded-2xl border border-avior-line shadow-lg shadow-black/30 overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 text-left bg-gradient-to-b from-[#141618] to-[#2F3236]" onClick={() => setOpen((o) => ({ ...o, [s.id]: !o[s.id] }))}>
              <div><div className="text-xs font-semibold text-avior-light">SECCIÓN {si + 1}</div><div className="text-avior-ink font-semibold">{s.title}</div></div>
              <div className="flex items-center gap-3">
                <span className={`text-sm px-2 py-0.5 rounded-full ${sd === s.items.length ? 'bg-emerald-500/20 text-emerald-300' : 'bg-avior-well text-zinc-300'}`}>{sd}/{s.items.length}</span>
                <ChevronDown className={`text-avior-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {isOpen && (
              <div className="px-4 pb-4 space-y-3">
                {s.items.map((label, i) => {
                  const key = `${s.id}-${i}`, c = data.checks[key];
                  return (
                    <div key={key} style={burst[key] !== undefined ? { animationDelay: `${burst[key] * 110}ms` } : undefined} className={`rounded-xl p-3 border transition-colors duration-300 ${c.ok ? 'border-emerald-500/60 bg-emerald-500/10' : 'border-avior-line bg-avior-well/70'} ${burst[key] !== undefined ? 'animate-flash' : ''}`}>
                      <button className="w-full flex items-center gap-3 text-left min-h-[3.5rem]" onClick={() => setCheck(key, { ok: !c.ok })} aria-pressed={c.ok}>
                        <span style={burst[key] !== undefined ? { animationDelay: `${burst[key] * 110}ms` } : undefined} className={`shrink-0 w-12 h-12 rounded-xl grid place-items-center transition-colors duration-300 ${c.ok ? 'bg-emerald-500 text-white' : 'bg-avior-line text-transparent'} ${burst[key] !== undefined ? 'animate-pop' : ''}`}><Check size={28} strokeWidth={3} /></span>
                        <span className="text-avior-ink leading-snug">{label}</span>
                      </button>
                      <input className={`${inp} mt-2 h-11 text-sm`} placeholder="Observaciones (opcional)" value={c.obs} onChange={(e) => setCheck(key, { obs: e.target.value })} />
                    </div>
                  );
                })}
                {sd === s.items.length ? (
                  <div className="w-full h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-medium flex items-center justify-center gap-2"><CheckCheck size={20} />Sección completa</div>
                ) : (
                  <button onClick={() => markAll(s)} className="w-full h-12 rounded-xl bg-avior-bright/20 border border-avior-bright/50 text-avior-light font-medium transition hover:bg-avior-bright/40 hover:text-white hover:border-avior-bright active:scale-[0.98]">Marcar toda la sección</button>
                )}
              </div>
            )}
          </section>
        );
      })}

      <section className="bg-metal rounded-2xl p-4 border border-avior-line shadow-lg shadow-black/30">
        <Field label="Comentarios generales"><textarea rows={4} className={`${inp} h-auto py-3`} value={data.comentarios} onChange={(e) => setData((d) => ({ ...d, comentarios: e.target.value }))} /></Field>
      </section>

      <section className="bg-metal rounded-2xl p-4 border border-avior-line shadow-lg shadow-black/30 space-y-4">
        <h2 className="text-avior-light font-semibold">Datos adicionales · Firmas</h2>
        {SIGNERS.map((sg) => {
          const s = data.signatures[sg.id];
          return (
            <div key={sg.id} className="space-y-2">
              <Field label={`Nombre ${sg.label}`}><input className={inp} placeholder="Nombre y apellido del supervisor" value={s.name} onChange={(e) => setSig(sg.id, { name: e.target.value })} /></Field>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-20 rounded-xl bg-zinc-200 border border-avior-line grid place-items-center overflow-hidden">
                  {s.img ? <img src={s.img} alt={`Firma ${sg.label}`} className="max-h-full" /> : <span className="text-zinc-400 text-sm">Sin firma</span>}
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => setSigning(sg)} className="h-11 px-4 rounded-xl bg-avior-bright text-white font-semibold flex items-center gap-2"><PenLine size={18} />{s.img ? 'Repetir' : 'Firmar'}</button>
                  {s.img && <button onClick={() => setSig(sg.id, { img: '' })} className="h-9 rounded-xl bg-avior-well text-red-300 flex items-center justify-center gap-1 text-sm"><Trash2 size={14} />Quitar</button>}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <footer className="flex items-center justify-center gap-1.5 pt-2 text-xs text-avior-muted select-none">
        <Headset size={14} strokeWidth={1.75} aria-hidden="true" />
        <span>Desarrollado por: <span className="font-medium text-avior-ink/70">HelpDesk Avior</span></span>
      </footer>

      {signing && <SignatureModal title={signing.label} onClose={() => setSigning(null)} onSave={(img) => { setSig(signing.id, { img }); setSigning(null); }} />}
    </div>
  );
}
