// Utilitário para gerar PDF bonito do laudo usando html2pdf.js
// Basta importar e usar generateLaudoPDF(html) para obter base64
import html2pdf from "html2pdf.js";

export async function generateLaudoPDF(html) {
  return await html2pdf().from(html).toPdf().outputPdf("datauristring");
}
