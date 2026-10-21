import html2pdf from 'html2pdf.js';

export const fileName = (data) => {
  const loc = data.header.localidad.replace(/\s+/g, '');
  const date = data.header.fecha.replace(/\//g, '-');
  return `Checklist_Aeropuerto_${loc}_${date}.pdf`;
};
const worker = (el, name) => html2pdf().set({
  margin: 8, filename: name,
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', scrollX: 0, scrollY: 0, windowWidth: 1000 },
  jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' },
}).from(el);

export const downloadPdf = (el, data) => worker(el, fileName(data)).save();
export const buildPdfBlob = (el, data) => worker(el, fileName(data)).outputPdf('blob');

export async function sharePdf(el, data) {
  const name = fileName(data);
  const blob = await buildPdfBlob(el, data);
  const file = new File([blob], name, { type: 'application/pdf' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({ files: [file], title: 'Check List Aeropuerto', text: `Check List Aeropuerto ${data.header.localidad} - ${data.header.fecha}` });
    return true;
  }
  return false;
}
