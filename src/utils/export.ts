import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { CardOrientation } from '../types/card';

// Format safe filename based on employee name
export function getSafeExportFilename(employeeName: string, ext: string): string {
  const safeName = (employeeName || 'Employee')
    .trim()
    .replace(/[^a-zA-Z0-9_\u0900-\u097F-]/g, '-')
    .replace(/-+/g, '-');
  return `Employee-ID-${safeName || '5tar'}.${ext}`;
}

// Convert HTML element to high-DPI canvas
export async function renderElementToCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
  // Ensure element styles allow capturing
  return await html2canvas(element, {
    scale: 2.5, // 2.5x high-res output: crisp yet fast and reliable on mobile devices
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    imageTimeout: 15000,
    onclone: (clonedDoc, clonedElem) => {
      // Ensure cloned element is visible and properly dimensioned
      clonedElem.style.display = 'flex';
      clonedElem.style.visibility = 'visible';
      clonedElem.style.opacity = '1';
      clonedElem.style.transform = 'none';
      clonedElem.style.position = 'relative';
      clonedElem.style.left = '0';
      clonedElem.style.top = '0';
    },
  });
}

// Download element as PNG or JPG with reliable Blob handling for mobile & desktop
export async function exportCardAsImage(
  element: HTMLElement,
  format: 'png' | 'jpeg',
  filename: string
): Promise<void> {
  const canvas = await renderElementToCanvas(element);
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const quality = format === 'jpeg' ? 0.95 : undefined;

  if (canvas.toBlob) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to generate image blob'));
            return;
          }
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = filename;
          link.href = blobUrl;
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
            resolve();
          }, 300);
        },
        mimeType,
        quality
      );
    });
  } else {
    const dataUrl = canvas.toDataURL(mimeType, quality);
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 300);
  }
}

// Generate standard ISO CR80 ID Card PDF (85.6mm x 53.98mm)
export async function exportCardAsPdf(
  frontElement: HTMLElement,
  backElement: HTMLElement | null,
  orientation: CardOrientation,
  filename: string
): Promise<void> {
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
  const frontImgData = frontCanvas.toDataURL('image/jpeg', 0.95);
  pdf.addImage(frontImgData, 'JPEG', 0, 0, cardWidthMm, cardHeightMm, undefined, 'FAST');

  // Render Back Side if provided
  if (backElement) {
    pdf.addPage([cardWidthMm, cardHeightMm], isPortrait ? 'portrait' : 'landscape');
    const backCanvas = await renderElementToCanvas(backElement);
    const backImgData = backCanvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(backImgData, 'JPEG', 0, 0, cardWidthMm, cardHeightMm, undefined, 'FAST');
  }

  pdf.save(filename);
}

// Print trigger
export function triggerCardPrint(): void {
  window.print();
}
