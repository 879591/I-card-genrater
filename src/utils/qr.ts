import QRCode from 'qrcode';
import { CardData } from '../types/card';

export async function generateCardQRCode(card: CardData): Promise<string> {
  let content = '';

  if (card.qrMode === 'verification') {
    // Mode B: Employee Verification QR
    // Embeds the verification payload or URL structure
    const payload = {
      type: '5TAR_EMPLOYEE_ID_VERIFICATION',
      vid: card.verificationId,
      empId: card.employeeId,
      name: card.fullName,
      org: card.organizationName,
      status: card.verificationStatus,
      issued: card.issueDate,
      expires: card.expiryDate || 'N/A',
      authNotice: 'Genuine real-time enterprise verification requires connection to organizational verification service.',
    };
    content = JSON.stringify(payload);
  } else {
    // Mode A: Information QR
    // Generate clean text representation of selected user fields
    const lines: string[] = ['BEGIN:5TAR-ID'];
    if (card.qrFields.includeOrg && card.organizationName) {
      lines.push(`ORG:${card.organizationName}`);
    }
    if (card.qrFields.includeName && card.fullName) {
      lines.push(`NAME:${card.fullName}`);
    }
    if (card.qrFields.includeId && card.employeeId) {
      lines.push(`ID:${card.employeeId}`);
    }
    if (card.qrFields.includeDesignation && card.designation) {
      lines.push(`ROLE:${card.designation}`);
    }
    if (card.qrFields.includeBloodGroup && card.bloodGroup) {
      lines.push(`BLOOD:${card.bloodGroup}`);
    }
    if (card.qrFields.includeEmergency && card.emergencyContact) {
      lines.push(`EMERGENCY:${card.emergencyContact}`);
    }
    if (card.qrFields.includeWebsite && card.websiteUrl) {
      lines.push(`URL:${card.websiteUrl}`);
    }
    lines.push('END:5TAR-ID');
    content = lines.join('\n');
  }

  try {
    const dataUrl = await QRCode.toDataURL(content, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 256,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate QR Code:', err);
    throw err;
  }
}

export function generateRandomVerificationId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '5TAR-';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  result += '-';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
