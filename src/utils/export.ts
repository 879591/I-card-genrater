import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { CardOrientation } from '../types/card';

// Format safe filename based on employee name
export function getSafeExportFilename(employeeName: string, ext: string): string {
  const safeName = (employeeName || 'Employee')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-');
  return `Employee-ID-${safeName}.${ext}`;
}

// Convert HTML element to high-DPI canvas
async function renderElementToCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
  return await html2canvas(element, {
    scale: 3, // 3x high-resolution output for crisp print quality
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
    imageTimeout: 10000,
  });
}

// Download element as PNG or JPG
export async function exportCardAsImage(
  element: HTMLElement,
  format: 'png' | 'jpeg',
  filename: string
): Promise<void> {
  const canvas = await renderElementToCanvas(element);
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const quality = format === 'jpeg' ? 0.95 : undefined;

  const dataUrl = canvas.toDataURL(mimeType, quality);
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Generate standard ISO CR80 ID Card PDF (85.6mm x 53.98mm)
export async function exportCardAsPdf(
  frontElement: HTMLElement,
  backElement: HTMLElement | null,
  orientation: CardOrientation,
  filename: string
): Promise<void> {
  // CR80 dimensions in millimeters
  const isPortrait = orientation === 'portrait';
  const cardWidthMm = isPortrait ? 53.98 : 85.6;
  const cardHeightMm = isPortrait ? 85.6 : 53.98;

  const pdf = new jsPDF({
    orientation: isPortrait ? 'portrait' : 'landscape',
    unit: 'mm',
    format: [cardWidthMm, cardHeightMm],
  });

  // Render Front Side
  const frontCanvas = await renderElementToCanvas(frontElement);
  const frontImgData = frontCanvas.toDataURL('image/jpeg', 0.98);
  pdf.addImage(frontImgData, 'JPEG', 0, 0, cardWidthMm, cardHeightMm, undefined, 'FAST');

  // Render Back Side if provided
  if (backElement) {
    pdf.addPage([cardWidthMm, cardHeightMm], isPortrait ? 'portrait' : 'landscape');
    const backCanvas = await renderElementToCanvas(backElement);
    const backImgData = backCanvas.toDataURL('image/jpeg', 0.98);
    pdf.addImage(backImgData, 'JPEG', 0, 0, cardWidthMm, cardHeightMm, undefined, 'FAST');
  }

  pdf.save(filename);
}

// Print trigger
export function triggerCardPrint(): void {
  window.print();
}
