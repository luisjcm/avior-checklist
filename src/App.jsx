import React, { useRef, useState } from 'react';
import { ClipboardCheck, FileText, Download, Share2, RotateCcw, Loader2 } from 'lucide-react';
import usePersistentState from './hooks/usePersistentState';
import { initialState } from './data/checklist';
import OperativeView from './components/OperativeView';
import OfficialSheet from './components/OfficialSheet';
import { downloadPdf, sharePdf } from './utils/pdf';

export default function App() {
  const [data, setData] = usePersistentState('avior-checklist-v1', initialState);
  const [view, setView] = useState('op');
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState('');
  const sheetRef = useRef(null);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3500); };
  const reset = () => {
    if (!window.confirm('¿Iniciar un nuevo checklist? Se borrarán los datos actuales (se conservan soporte, teléfono, localidad, horario y ubicación).')) return;
    const fresh = initialState();
    fresh.header = { ...fresh.header, soporte: data.header.soporte, telefono: data.header.telefono, localidad: data.header.localidad, horario: data.header.horario, ubicacion: data.header.ubicacion };
    setData(fresh); setView('op'); window.scrollTo(0, 0);
  };
  const run = async (kind) => {
    setBusy(kind);
    try {
      if (kind === 'pdf') await downloadPdf(sheetRef.current, data);
      else { const ok = await sharePdf(sheetRef.current, data); if (!ok) { await downloadPdf(sheetRef.current, data); flash('Compartir no disponible: se descargó el PDF.'); } }
    } catch (e) { if (e?.name !== 'AbortError') flash('Error al generar el PDF.'); }
    setBusy('');
  };

  return (
    <div className="min-h-screen text-white max-w-2xl mx-auto px-4 pt-[max(1rem,env(safe-area-inset-top))]">
      <header className="flex items-center justify-between py-3">
        <div><div className="text-xs text-sky-300 tracking-widest">AVIOR AIRLINES · IT</div><h1 className="text-xl font-bold">Check List Aeropuerto</h1></div>
        <button onClick={reset} className="h-11 px-3 rounded-xl bg-slate-800 text-slate-200 flex items-center gap-2 text-sm"><RotateCcw size={16} />Nuevo</button>
      </header>

      <nav className="grid grid-cols-2 gap-2 mb-4 p-1 bg-slate-900 rounded-2xl">
        {[['op', 'Operativo', ClipboardCheck], ['sheet', 'Planilla', FileText]].map(([id, label, Icon]) => (
          <button key={id} onClick={() => setView(id)} className={`h-12 rounded-xl flex items-center justify-center gap-2 font-medium ${view === id ? 'bg-sky-500 text-white' : 'text-slate-400'}`}><Icon size={18} />{label}</button>
        ))}
      </nav>

      {view === 'op' && <OperativeView data={data} setData={setData} />}

      {/* La planilla siempre está montada (fuera de pantalla si no se ve) para poder exportar desde cualquier vista */}
      <div className={view === 'sheet' ? 'pb-32' : ''} style={view === 'sheet' ? {} : { position: 'fixed', left: -10000, top: 0 }}>
        {view === 'sheet' && <p className="text-xs text-slate-400 mb-2">Vista previa fiel a la planilla oficial. Deslice horizontalmente si es necesario.</p>}
        <div className={view === 'sheet' ? 'overflow-x-auto rounded-lg bg-white' : ''}><OfficialSheet ref={sheetRef} data={data} /></div>
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-slate-950/95 backdrop-blur border-t border-slate-800 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="max-w-2xl mx-auto">
          {msg && <p className="text-center text-amber-300 text-sm mb-2">{msg}</p>}
          {view === 'op' ? (
            <button onClick={() => setView('sheet')} className="w-full h-14 rounded-xl bg-sky-500 font-semibold flex items-center justify-center gap-2"><FileText size={20} />Ver planilla oficial</button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button disabled={!!busy} onClick={() => run('pdf')} className="h-14 rounded-xl bg-emerald-500 disabled:opacity-60 font-semibold flex items-center justify-center gap-2">{busy === 'pdf' ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}Descargar PDF</button>
              <button disabled={!!busy} onClick={() => run('share')} className="h-14 rounded-xl bg-sky-500 disabled:opacity-60 font-semibold flex items-center justify-center gap-2">{busy === 'share' ? <Loader2 className="animate-spin" size={20} /> : <Share2 size={20} />}Compartir</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
