import { CardData } from '../types/card';
import { jsPDF } from 'jspdf';
import { getSafeExportFilename } from './export';

// Helper to load image safely into HTMLImageElement
function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // If crossOrigin fails, try without crossOrigin (for data URLs)
      const fallbackImg = new Image();
      fallbackImg.onload = () => resolve(fallbackImg);
      fallbackImg.onerror = () => resolve(null);
      fallbackImg.src = src;
    };
    img.src = src;
  });
}

// Helper to draw rounded rectangle
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Generate Front Card on Native Canvas (640 x 1016 portrait or 1016 x 640 landscape)
export async function drawCardFrontToCanvas(
  card: CardData,
  qrCodeUrl: string
): Promise<HTMLCanvasElement> {
  const isPortrait = card.orientation === 'portrait';
  const width = isPortrait ? 640 : 1016;
  const height = isPortrait ? 1016 : 640;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  // Pre-load images
  const [photoImg, logoImg, qrImg] = await Promise.all([
    loadImage(card.photoUrl),
    loadImage(card.logoUrl),
    loadImage(qrCodeUrl),
  ]);

  // Card Outer Rounded Clip & Background
  ctx.save();
  roundRect(ctx, 0, 0, width, height, 36);
  ctx.clip();

  // White base card background
  ctx.fillStyle = card.templateId === 'security' ? '#090d16' : '#ffffff';
  ctx.fillRect(0, 0, width, height);

  const themeColor = card.themeColor || '#1e40af';
  const accentColor = card.accentColor || '#f59e0b';
  const textColor = card.templateId === 'security' ? '#ffffff' : '#0f172a';
  const subTextColor = card.templateId === 'security' ? '#94a3b8' : '#475569';

  if (isPortrait) {
    // ---------------- PORTRAIT FRONT ---------------- //
    // Header Banner
    ctx.fillStyle = themeColor;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, 210);
    ctx.quadraticCurveTo(width / 2, 260, 0, 210);
    ctx.closePath();
    ctx.fill();

    // Accent glow circle
    ctx.fillStyle = accentColor;
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.arc(width - 40, 20, 140, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // Lanyard slot
    if (card.visibility.showLanyardSlot) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
      roundRect(ctx, width / 2 - 60, 24, 120, 18, 9);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      roundRect(ctx, width / 2 - 40, 28, 80, 10, 5);
      ctx.fill();
    }

    // Header: Logo & Org Name
    const headerY = 70;
    if (card.visibility.showLogo && logoImg) {
      roundRect(ctx, 36, headerY, 68, 68, 14);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.drawImage(logoImg, 42, headerY + 6, 56, 56);
    }

    const orgX = card.visibility.showLogo && logoImg ? 120 : 40;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(card.organizationName || '5tar Organization', orgX, headerY + 34, 460);

    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillText(card.department || 'Official Identification Badge', orgX, headerY + 58, 460);

    // Photo Box
    const photoSize = 210;
    const photoX = width / 2 - photoSize / 2;
    const photoY = 240;

    if (card.visibility.showPhoto) {
      // Photo border & background
      ctx.save();
      roundRect(ctx, photoX, photoY, photoSize, photoSize, 28);
      ctx.fillStyle = '#f1f5f9';
      ctx.fill();
      ctx.lineWidth = 8;
      ctx.strokeStyle = themeColor;
      ctx.stroke();
      ctx.clip();

      if (photoImg) {
        ctx.drawImage(photoImg, photoX, photoY, photoSize, photoSize);
      } else {
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('NO PHOTO', photoX + photoSize / 2, photoY + photoSize / 2);
      }
      ctx.restore();

      // Star badge
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(photoX + photoSize - 16, photoY + photoSize - 16, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('★', photoX + photoSize - 16, photoY + photoSize - 8);
    }

    // Employee Full Name
    ctx.textAlign = 'center';
    ctx.fillStyle = textColor;
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(card.fullName || 'Employee Name', width / 2, 505, 560);

    // Designation
    ctx.fillStyle = themeColor;
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText((card.designation || 'Designation').toUpperCase(), width / 2, 538, 560);

    // ID Pill & Blood Group
    const pillY = 565;
    ctx.fillStyle = '#f1f5f9';
    roundRect(ctx, width / 2 - 140, pillY, 280, 36, 18);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    ctx.fillText(`ID: ${card.employeeId || 'EMP-0000'}`, width / 2, pillY + 24);

    if (card.visibility.showBloodGroup && card.bloodGroup) {
      ctx.fillStyle = '#ffe4e6';
      roundRect(ctx, width / 2 - 60, pillY + 46, 120, 28, 14);
      ctx.fill();
      ctx.fillStyle = '#e11d48';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(`🩸 ${card.bloodGroup}`, width / 2, pillY + 65);
    }

    // Info card box
    const infoY = 660;
    ctx.fillStyle = '#f8fafc';
    roundRect(ctx, 40, infoY, width - 80, 160, 20);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = subTextColor;

    // Dept row
    ctx.fillText('Department:', 65, infoY + 40);
    ctx.fillStyle = textColor;
    ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(card.department || 'General Administration', 210, infoY + 40, 350);

    // Joining row
    ctx.fillStyle = subTextColor;
    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Joined Date:', 65, infoY + 80);
    ctx.fillStyle = textColor;
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillText(card.joiningDate || '—', 210, infoY + 80);

    // Phone row
    ctx.fillStyle = subTextColor;
    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Phone:', 65, infoY + 120);
    ctx.fillStyle = textColor;
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillText(card.phoneNumber || '—', 210, infoY + 120);

    // Bottom Footer Bar (QR Code & Credentials)
    const footerY = 850;
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, footerY);
    ctx.lineTo(width - 40, footerY);
    ctx.stroke();

    // QR Code
    if (card.visibility.showQrCode && qrImg) {
      roundRect(ctx, 45, footerY + 15, 110, 110, 16);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.drawImage(qrImg, 50, footerY + 20, 100, 100);
    }

    // QR Details
    ctx.textAlign = 'left';
    ctx.fillStyle = textColor;
    ctx.font = 'bold 17px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('5tar Identity Badge', 175, footerY + 45);

    ctx.fillStyle = subTextColor;
    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.fillText(card.verificationId, 175, footerY + 70);

    ctx.fillStyle = '#059669';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('● SYSTEM VERIFIED', 175, footerY + 95);

    // Expiry date right aligned
    if (card.visibility.showDates && card.expiryDate) {
      ctx.textAlign = 'right';
      ctx.fillStyle = subTextColor;
      ctx.font = '13px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Valid Thru:', width - 50, footerY + 55);
      ctx.fillStyle = textColor;
      ctx.font = 'bold 16px "JetBrains Mono", monospace';
      ctx.fillText(card.expiryDate, width - 50, footerY + 80);
    }
  } else {
    // ---------------- LANDSCAPE FRONT ---------------- //
    // Header Banner
    ctx.fillStyle = themeColor;
    ctx.fillRect(0, 0, width, 130);

    // Lanyard slot
    if (card.visibility.showLanyardSlot) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
      roundRect(ctx, width / 2 - 60, 14, 120, 16, 8);
      ctx.fill();
    }

    // Logo & Org
    if (card.visibility.showLogo && logoImg) {
      roundRect(ctx, 40, 35, 70, 70, 14);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.drawImage(logoImg, 45, 40, 60, 60);
    }

    const orgX = card.visibility.showLogo && logoImg ? 130 : 45;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(card.organizationName || '5tar Organization', orgX, 72, 600);
    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillText(card.department || 'Official Identification Badge', orgX, 100, 600);

    // Template pill top right
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    roundRect(ctx, width - 180, 48, 140, 36, 18);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(card.templateId.toUpperCase(), width - 110, 71);

    // Photo on Left
    const photoSize = 180;
    const photoX = 45;
    const photoY = 165;
    if (card.visibility.showPhoto) {
      ctx.save();
      roundRect(ctx, photoX, photoY, photoSize, photoSize, 24);
      ctx.fillStyle = '#f1f5f9';
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = themeColor;
      ctx.stroke();
      ctx.clip();
      if (photoImg) {
        ctx.drawImage(photoImg, photoX, photoY, photoSize, photoSize);
      }
      ctx.restore();

      // Star
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(photoX + photoSize - 12, photoY + photoSize - 12, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('★', photoX + photoSize - 12, photoY + photoSize - 6);
    }

    // Name & Title
    ctx.textAlign = 'left';
    ctx.fillStyle = textColor;
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(card.fullName || 'Employee Name', 255, 210, 500);

    ctx.fillStyle = themeColor;
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText((card.designation || 'Designation').toUpperCase(), 255, 242, 500);

    // Details Box in Center
    ctx.fillStyle = '#f8fafc';
    roundRect(ctx, 255, 265, 480, 160, 20);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = subTextColor;
    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ID Number:', 280, 305);
    ctx.fillStyle = textColor;
    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    ctx.fillText(card.employeeId || 'EMP-0000', 400, 305);

    ctx.fillStyle = subTextColor;
    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Department:', 280, 345);
    ctx.fillStyle = textColor;
    ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(card.department || 'General', 400, 345, 300);

    ctx.fillStyle = subTextColor;
    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Date Joined:', 280, 385);
    ctx.fillStyle = textColor;
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillText(card.joiningDate || '—', 400, 385);

    // QR Code on Far Right
    if (card.visibility.showQrCode && qrImg) {
      roundRect(ctx, width - 210, 165, 165, 165, 20);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.drawImage(qrImg, width - 200, 175, 145, 145);

      ctx.textAlign = 'center';
      ctx.fillStyle = subTextColor;
      ctx.font = '13px "JetBrains Mono", monospace';
      ctx.fillText(card.verificationId.slice(0, 9), width - 128, 355);
    }

    // Bottom strip
    const footY = 460;
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(45, footY);
    ctx.lineTo(width - 45, footY);
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = subTextColor;
    ctx.font = '15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('5tar Certified Identity Card • Official Document', 45, footY + 40);

    if (card.expiryDate) {
      ctx.textAlign = 'right';
      ctx.fillText(`Valid Thru: ${card.expiryDate}`, width - 45, footY + 40);
    }
  }

  ctx.restore();
  return canvas;
}

// Generate Back Card on Native Canvas
export async function drawCardBackToCanvas(
  card: CardData,
  qrCodeUrl: string
): Promise<HTMLCanvasElement> {
  const isPortrait = card.orientation === 'portrait';
  const width = isPortrait ? 640 : 1016;
  const height = isPortrait ? 1016 : 640;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  const [sigImg] = await Promise.all([loadImage(card.signatureUrl)]);

  ctx.save();
  roundRect(ctx, 0, 0, width, height, 36);
  ctx.clip();

  ctx.fillStyle = card.templateId === 'security' ? '#090d16' : '#ffffff';
  ctx.fillRect(0, 0, width, height);

  const themeColor = card.themeColor || '#1e40af';
  const textColor = card.templateId === 'security' ? '#ffffff' : '#0f172a';
  const subTextColor = card.templateId === 'security' ? '#94a3b8' : '#475569';

  // Top color strip
  ctx.fillStyle = themeColor;
  ctx.fillRect(0, 0, width, 18);

  // Lanyard slot
  if (card.visibility.showLanyardSlot) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    roundRect(ctx, width / 2 - 60, 24, 120, 18, 9);
    ctx.fill();
  }

  // Header
  ctx.textAlign = 'center';
  ctx.fillStyle = textColor;
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('OFFICIAL EMPLOYEE CREDENTIAL', width / 2, 75);

  ctx.fillStyle = subTextColor;
  ctx.font = '15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Property of ${card.organizationName || 'Issuing Authority'}`, width / 2, 105);

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(50, 125);
  ctx.lineTo(width - 50, 125);
  ctx.stroke();

  if (isPortrait) {
    // Office Address
    let curY = 160;
    if (card.visibility.showAddress && card.officeAddress) {
      ctx.fillStyle = '#f8fafc';
      roundRect(ctx, 50, curY, width - 100, 100, 18);
      ctx.fill();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillStyle = themeColor;
      ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('OFFICE ADDRESS:', 75, curY + 32);

      ctx.fillStyle = textColor;
      ctx.font = '16px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(card.officeAddress, 75, curY + 62, width - 150);
      curY += 120;
    }

    // Emergency Contact
    if (card.visibility.showEmergency && card.emergencyContact) {
      ctx.fillStyle = '#fff1f2';
      roundRect(ctx, 50, curY, width - 100, 90, 18);
      ctx.fill();
      ctx.strokeStyle = '#fecdd3';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillStyle = '#e11d48';
      ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('IN CASE OF EMERGENCY (ICE):', 75, curY + 32);

      ctx.fillStyle = '#9f1239';
      ctx.font = 'bold 20px "JetBrains Mono", monospace';
      ctx.fillText(card.emergencyContact, 75, curY + 62);
      curY += 110;
    }

    // Contact Grid (Phone & Email)
    ctx.fillStyle = '#f8fafc';
    roundRect(ctx, 50, curY, width - 100, 80, 18);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = subTextColor;
    ctx.font = '14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Phone:', 75, curY + 34);
    ctx.fillStyle = textColor;
    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.fillText(card.phoneNumber || '—', 140, curY + 34);

    ctx.fillStyle = subTextColor;
    ctx.font = '14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Email:', 75, curY + 60);
    ctx.fillStyle = textColor;
    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.fillText(card.email || '—', 140, curY + 60, 380);

    curY += 100;

    // Terms
    ctx.fillStyle = '#f1f5f9';
    roundRect(ctx, 50, curY, width - 100, 100, 18);
    ctx.fill();

    ctx.textAlign = 'left';
    ctx.fillStyle = subTextColor;
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Notice: This card is non-transferable and remains property of the organization.', 70, curY + 32, width - 140);
    ctx.fillText('If found, return immediately to the office address or nearest police post.', 70, curY + 54, width - 140);
    ctx.fillText('Unauthorized use or replication of this credential is strictly prohibited.', 70, curY + 76, width - 140);

    // Bottom: Barcode & Signature
    const sigY = 740;
    if (card.visibility.showBarcode) {
      // Draw Barcode lines
      ctx.fillStyle = textColor;
      const barX = 60;
      const widths = [3, 5, 2, 6, 3, 5, 2, 7, 3, 4, 2, 6, 4, 3, 6, 2, 5, 4, 2, 6, 3, 5];
      let bx = barX;
      for (const w of widths) {
        ctx.fillRect(bx, sigY, w * 1.5, 60);
        bx += w * 1.5 + 4;
      }
      ctx.textAlign = 'left';
      ctx.fillStyle = subTextColor;
      ctx.font = '13px "JetBrains Mono", monospace';
      ctx.fillText(card.employeeId || 'ID-0000', barX, sigY + 84);
    }

    // Signature
    if (card.visibility.showSignature) {
      const sx = width - 220;
      if (sigImg) {
        ctx.drawImage(sigImg, sx, sigY - 20, 160, 60);
      } else {
        ctx.strokeStyle = '#94a3b8';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(sx, sigY + 40);
        ctx.lineTo(sx + 160, sigY + 40);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sx, sigY + 45);
      ctx.lineTo(sx + 160, sigY + 45);
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = textColor;
      ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(card.signatoryName || 'Authorized Signatory', sx + 80, sigY + 68);

      ctx.fillStyle = subTextColor;
      ctx.font = '12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Signature & Seal', sx + 80, sigY + 86);
    }
  } else {
    // Landscape back
    ctx.textAlign = 'left';
    ctx.fillStyle = subTextColor;
    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Office: ${card.officeAddress || 'Main Campus'}`, 60, 180);
    ctx.fillText(`Emergency Contact: ${card.emergencyContact || '—'}`, 60, 220);
    ctx.fillText(`Phone: ${card.phoneNumber || '—'}`, 60, 260);
    ctx.fillText(`Website: ${card.websiteUrl || '—'}`, 60, 300);

    // Signature
    const sx = width - 260;
    if (sigImg) {
      ctx.drawImage(sigImg, sx, 200, 180, 70);
    }
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sx, 280);
    ctx.lineTo(sx + 180, 280);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = textColor;
    ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(card.signatoryName || 'Authorized Signatory', sx + 90, 305);
  }

  ctx.restore();
  return canvas;
}

// Download canvas directly to mobile / desktop gallery / downloads
export async function downloadCanvasAsFile(
  canvas: HTMLCanvasElement,
  filename: string,
  format: 'png' | 'jpeg' = 'png'
): Promise<void> {
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const quality = format === 'jpeg' ? 0.95 : undefined;

  // Use toBlob first
  if (canvas.toBlob) {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, mimeType, quality)
    );

    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 500);
      return;
    }
  }

  // Fallback to dataURL
  const dataUrl = canvas.toDataURL(mimeType, quality);
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
  }, 500);
}

// Generate Dual-Sided PDF using Native Canvases
export async function generateDualSidedCardPdf(
  frontCanvas: HTMLCanvasElement,
  backCanvas: HTMLCanvasElement,
  orientation: 'portrait' | 'landscape',
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

  const frontDataUrl = frontCanvas.toDataURL('image/jpeg', 0.96);
  pdf.addImage(frontDataUrl, 'JPEG', 0, 0, cardWidthMm, cardHeightMm, undefined, 'FAST');

  pdf.addPage([cardWidthMm, cardHeightMm], isPortrait ? 'portrait' : 'landscape');
  const backDataUrl = backCanvas.toDataURL('image/jpeg', 0.96);
  pdf.addImage(backDataUrl, 'JPEG', 0, 0, cardWidthMm, cardHeightMm, undefined, 'FAST');

  pdf.save(filename);
}
