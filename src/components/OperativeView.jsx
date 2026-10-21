import React, { useState } from 'react';
import { ChevronDown, Check, PenLine, Trash2 } from 'lucide-react';
import { SECTIONS, TOTAL_ITEMS, LOCALIDADES, TURNOS, UBICACIONES, SIGNERS } from '../data/checklist';
import SignatureModal from './SignatureModal';

const inp = 'w-full h-12 px-3 rounded-xl bg-slate-800 text-white border border-slate-700 focus:border-sky-400 outline-none';
const Field = ({ label, children }) => (<label className="block"><span className="text-xs text-slate-400 uppercase tracking-wide">{label}</span>{children}</label>);

export default function OperativeView({ data, setData }) {
  const [open, setOpen] = useState({ s1: true });
  const [signing, setSigning] = useState(null);
  const done = Object.values(data.checks).filter((c) => c.ok).length;
  const pct = Math.round((done / TOTAL_ITEMS) * 100);

  const setHeader = (k, v) => setData((d) => ({ ...d, header: { ...d.header, [k]: v } }));
  const setCheck = (key, patch) => setData((d) => ({ ...d, checks: { ...d.checks, [key]: { ...d.checks[key], ...patch } } }));
  const setSig = (id, patch) => setData((d) => ({ ...d, signatures: { ...d.signatures, [id]: { ...d.signatures[id], ...patch } } }));
  const markAll = (s) => setData((d) => { const checks = { ...d.checks }; s.items.forEach((_, i) => { checks[`${s.id}-${i}`] = { ...checks[`${s.id}-${i}`], ok: true }; }); return { ...d, checks }; });

  return (
    <div className="space-y-4 pb-28">
      <section className="bg-slate-900 rounded-2xl p-4 space-y-3 border border-slate-800">
        <h2 className="text-sky-300 font-semibold">Datos de cabecera</h2>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Soporte"><input className={inp} value={data.header.soporte} onChange={(e) => setHeader('soporte', e.target.value)} /></Field>
          <Field label="Teléfono"><input className={inp} inputMode="tel" value={data.header.telefono} onChange={(e) => setHeader('telefono', e.target.value)} /></Field>
          <Field label="Localidad"><select className={inp} value={data.header.localidad} onChange={(e) => setHeader('localidad', e.target.value)}>{[...new Set([data.header.localidad, ...LOCALIDADES])].map((o) => <option key={o}>{o}</option>)}</select></Field>
          <Field label="Fecha"><input className={inp} value={data.header.fecha} onChange={(e) => setHeader('fecha', e.target.value)} /></Field>
        </div>
        <Field label="Horario de soporte">
          <input className={inp} list="turnos" value={data.header.horario} onChange={(e) => setHeader('horario', e.target.value)} />
          <datalist id="turnos">{TURNOS.map((t) => <option key={t} value={t} />)}</datalist>
        </Field>
        <Field label="Ubicación"><select className={inp} value={data.header.ubicacion} onChange={(e) => setHeader('ubicacion', e.target.value)}>{UBICACIONES.map((o) => <option key={o}>{o}</option>)}</select></Field>
      </section>

      <div className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-[#071f4d]/95 backdrop-blur">
        <div className="flex justify-between text-sm text-white mb-1"><span>{done}/{TOTAL_ITEMS} verificados</span><span>{pct}%</span></div>
        <div className="h-3 rounded-full bg-slate-800 overflow-hidden"><div className="h-full bg-emerald-400 transition-all" style={{ width: `${pct}%` }} /></div>
      </div>

      {SECTIONS.map((s, si) => {
        const sd = s.items.filter((_, i) => data.checks[`${s.id}-${i}`].ok).length;
        const isOpen = !!open[s.id];
        return (
          <section key={s.id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 text-left" onClick={() => setOpen((o) => ({ ...o, [s.id]: !o[s.id] }))}>
              <div><div className="text-xs text-sky-300">SECCIÓN {si + 1}</div><div className="text-white font-semibold">{s.title}</div></div>
              <div className="flex items-center gap-3">
                <span className={`text-sm px-2 py-0.5 rounded-full ${sd === s.items.length ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>{sd}/{s.items.length}</span>
                <ChevronDown className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {isOpen && (
              <div className="px-4 pb-4 space-y-3">
                {s.items.map((label, i) => {
                  const key = `${s.id}-${i}`, c = data.checks[key];
                  return (
                    <div key={key} className={`rounded-xl p-3 border ${c.ok ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-slate-700 bg-slate-800/50'}`}>
                      <button className="w-full flex items-center gap-3 text-left min-h-[3.5rem]" onClick={() => setCheck(key, { ok: !c.ok })} aria-pressed={c.ok}>
                        <span className={`shrink-0 w-12 h-12 rounded-xl grid place-items-center ${c.ok ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-transparent'}`}><Check size={28} strokeWidth={3} /></span>
                        <span className="text-white leading-snug">{label}</span>
                      </button>
                      <input className={`${inp} mt-2 h-11 text-sm`} placeholder="Observaciones (opcional)" value={c.obs} onChange={(e) => setCheck(key, { obs: e.target.value })} />
                    </div>
                  );
                })}
                <button onClick={() => markAll(s)} className="w-full h-12 rounded-xl bg-sky-600/20 text-sky-300 font-medium">Marcar toda la sección</button>
              </div>
            )}
          </section>
        );
      })}

      <section className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
        <Field label="Comentarios generales"><textarea rows={4} className={`${inp} h-auto py-3`} value={data.comentarios} onChange={(e) => setData((d) => ({ ...d, comentarios: e.target.value }))} /></Field>
      </section>

      <section className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-4">
        <h2 className="text-sky-300 font-semibold">Datos adicionales · Firmas</h2>
        {SIGNERS.map((sg) => {
          const s = data.signatures[sg.id];
          return (
            <div key={sg.id} className="space-y-2">
              <Field label={`Nombre ${sg.label}`}><input className={inp} value={s.name} onChange={(e) => setSig(sg.id, { name: e.target.value })} /></Field>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-20 rounded-xl bg-white grid place-items-center overflow-hidden">
                  {s.img ? <img src={s.img} alt={`Firma ${sg.label}`} className="max-h-full" /> : <span className="text-slate-400 text-sm">Sin firma</span>}
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => setSigning(sg)} className="h-11 px-4 rounded-xl bg-sky-500 text-white font-semibold flex items-center gap-2"><PenLine size={18} />{s.img ? 'Repetir' : 'Firmar'}</button>
                  {s.img && <button onClick={() => setSig(sg.id, { img: '' })} className="h-9 rounded-xl bg-slate-800 text-red-300 flex items-center justify-center gap-1 text-sm"><Trash2 size={14} />Quitar</button>}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {signing && <SignatureModal title={signing.label} onClose={() => setSigning(null)} onSave={(img) => { setSig(signing.id, { img }); setSigning(null); }} />}
    </div>
  );
}
