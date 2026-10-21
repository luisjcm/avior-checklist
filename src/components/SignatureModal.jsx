import React, { useEffect, useRef, useState } from 'react';
import { X, Eraser, Check } from 'lucide-react';

// Pad de firma nativo con Pointer Events (táctil, lápiz y ratón). Exporta PNG transparente.
export default function SignatureModal({ title, onSave, onClose }) {
  const ref = useRef(null);
  const drawing = useRef(false);
  const last = useRef(null);
  const [empty, setEmpty] = useState(true);

  useEffect(() => {
    const c = ref.current;
    const ratio = window.devicePixelRatio || 1;
    const r = c.getBoundingClientRect();
    c.width = r.width * ratio; c.height = r.height * ratio;
    const ctx = c.getContext('2d');
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#0a1a5c';
  }, []);

  const pos = (e) => { const r = ref.current.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const down = (e) => {
    e.preventDefault(); ref.current.setPointerCapture(e.pointerId);
    drawing.current = true; last.current = pos(e);
    const ctx = ref.current.getContext('2d'); ctx.beginPath(); ctx.arc(last.current.x, last.current.y, 1.2, 0, 7); ctx.fillStyle = '#0a1a5c'; ctx.fill();
    setEmpty(false);
  };
  const move = (e) => {
    if (!drawing.current) return; e.preventDefault();
    const p = pos(e), ctx = ref.current.getContext('2d');
    ctx.beginPath(); ctx.moveTo(last.current.x, last.current.y); ctx.lineTo(p.x, p.y); ctx.stroke(); last.current = p;
  };
  const up = () => { drawing.current = false; };
  const clear = () => {
    const c = ref.current; c.getContext('2d').clearRect(0, 0, c.width, c.height); setEmpty(true);
  };
  const save = () => { if (!empty) onSave(ref.current.toDataURL('image/png')); };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 flex flex-col p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between text-white mb-2">
        <h3 className="font-semibold">Firma: {title}</h3>
        <button onClick={onClose} className="p-2 rounded-full bg-white/10" aria-label="Cerrar"><X size={22} /></button>
      </div>
      <div className="flex-1 bg-white rounded-2xl relative overflow-hidden min-h-[240px]">
        <canvas ref={ref} className="absolute inset-0 w-full h-full" style={{ touchAction: 'none' }}
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
        {empty && <p className="absolute inset-0 grid place-items-center text-slate-300 text-lg pointer-events-none">Firme aquí con el dedo</p>}
        <div className="absolute left-6 right-6 bottom-12 border-b border-slate-300 pointer-events-none" />
      </div>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <button onClick={clear} className="h-14 rounded-xl bg-slate-700 text-white font-semibold flex items-center justify-center gap-2"><Eraser size={20} />Limpiar</button>
        <button onClick={save} disabled={empty} className="h-14 rounded-xl bg-emerald-500 disabled:opacity-40 text-white font-semibold flex items-center justify-center gap-2"><Check size={20} />Guardar Firma</button>
      </div>
    </div>
  );
}
