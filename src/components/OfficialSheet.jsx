import React, { forwardRef } from 'react';
import { SECTIONS, SIGNERS } from '../data/checklist';
import logo from '../assets/logo-avior-black.png';

const b = '1px solid #000';
const cell = { border: b, padding: '4px 6px', verticalAlign: 'middle' };
const Diagonal = () => (
  <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0 }}>
    <line x1="0" y1="100" x2="100" y2="0" stroke="#000" strokeWidth="1" vectorEffect="non-scaling-stroke" />
  </svg>
);

// Planilla oficial: tamaño fijo (720px < área útil carta) para PDF consistente.
const OfficialSheet = forwardRef(function OfficialSheet({ data }, ref) {
  const h = data.header;
  return (
    <div ref={ref} style={{ width: 720, background: '#fff', color: '#000', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 12, padding: 20, boxSizing: 'border-box' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td colSpan={4} style={{ ...cell, position: 'relative', textAlign: 'center', fontWeight: 700, fontSize: 16, padding: 8, height: 46 }}>
              <img src={logo} alt="Avior Airlines" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', height: 26 }} />
              CHECK LIST AEROPUERTO
              <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', textAlign: 'right', lineHeight: 1.25 }}>
                <div style={{ fontSize: 8, fontWeight: 400, color: '#444' }}>N° DE CHECKLIST</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: data.serial?.id ? '#000' : '#888', fontStyle: data.serial?.id ? 'normal' : 'italic' }}>{data.serial?.id || 'Se asigna al exportar'}</div>
              </div>
            </td>
          </tr>
          <tr>
            <td style={{ ...cell, fontWeight: 700, width: '16%' }}>Soporte:</td><td style={{ ...cell, width: '34%' }}>{h.soporte}</td>
            <td style={{ ...cell, fontWeight: 700, width: '16%' }}>Teléfono:</td><td style={{ ...cell, width: '34%' }}>{h.telefono}</td>
          </tr>
          <tr>
            <td style={{ ...cell, fontWeight: 700 }}>Localidad:</td><td style={cell}>{h.localidad}</td>
            <td style={{ ...cell, fontWeight: 700 }}>Horario de Soporte:</td><td style={cell}>{h.horario}</td>
          </tr>
          <tr>
            <td style={{ ...cell, fontWeight: 700 }}>Fecha:</td><td style={cell}>{h.fecha}</td>
            <td style={{ ...cell, fontWeight: 700 }}>Ubicación:</td><td style={cell}>{h.ubicacion}</td>
          </tr>
        </tbody>
      </table>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: -1 }}>
        <thead>
          <tr style={{ background: '#e5e5e5' }}>
            <th style={{ ...cell, textAlign: 'left', width: '58%' }}>Actividades a Realizar</th>
            <th style={{ ...cell, width: '8%' }}>Check</th>
            <th style={{ ...cell, width: '34%' }}>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {SECTIONS.map((s, si) => {
            const obsList = s.items.map((_, i) => data.checks[`${s.id}-${i}`].obs.trim()).filter(Boolean);
            return (
              <React.Fragment key={s.id}>
                <tr><td colSpan={3} style={{ ...cell, fontWeight: 700, background: '#f2f2f2' }}>{si + 1}. {s.title}</td></tr>
                {s.items.map((label, i) => {
                  const c = data.checks[`${s.id}-${i}`];
                  return (
                    <tr key={i} style={{ height: 26 }}>
                      <td style={cell}>{si + 1}.{i + 1} {label}</td>
                      <td style={{ ...cell, textAlign: 'center', fontSize: 16, fontWeight: 700 }}>{c.ok ? '✓' : ''}</td>
                      {i === 0 && (
                        <td rowSpan={s.items.length} style={{ ...cell, position: 'relative', padding: 0 }}>
                          {obsList.length ? (
                            <div style={{ padding: '4px 6px' }}>{s.items.map((l, k) => { const o = data.checks[`${s.id}-${k}`].obs.trim(); return o ? <div key={k}>• {o}</div> : null; })}</div>
                          ) : <Diagonal />}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </React.Fragment>
            );
          })}
          <tr>
            <td colSpan={3} style={{ ...cell, height: 70, verticalAlign: 'top', position: 'relative' }}>
              <b>Comentarios Generales:</b>
              <div style={{ whiteSpace: 'pre-wrap', marginTop: 4 }}>{data.comentarios}</div>
              {!data.comentarios.trim() && <Diagonal />}
            </td>
          </tr>
        </tbody>
      </table>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: -1 }}>
        <thead><tr><th colSpan={3} style={{ ...cell, background: '#e5e5e5' }}>Datos Adicionales</th></tr></thead>
        <tbody>
          <tr>
            {SIGNERS.map((sg) => {
              const s = data.signatures[sg.id];
              return (
                <td key={sg.id} style={{ ...cell, width: '33.33%', height: 90, verticalAlign: 'bottom', textAlign: 'center' }}>
                  <div style={{ height: 55, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    {s.img && <img src={s.img} alt="" style={{ maxHeight: 55, maxWidth: '90%', objectFit: 'contain' }} />}
                  </div>
                  <div style={{ borderTop: b, marginTop: 2, paddingTop: 2, fontSize: 11 }}>
                    {s.name && <div style={{ fontWeight: 700 }}>{s.name}</div>}
                    Nombre y Firma {sg.label}
                  </div>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
});
export default OfficialSheet;
