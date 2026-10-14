export type CardOrientation = 'portrait' | 'landscape';

export type TemplateId =
  | 'corporate'
  | 'office'
  | 'school'
  | 'college'
  | 'hospital'
  | 'security'
  | 'factory'
  | 'business';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-' | 'Unknown';

export type QRMode = 'info' | 'verification';

export interface CardData {
  id: string; // unique UUID or ID
  templateId: TemplateId;
  orientation: CardOrientation;
  themeColor: string;
  accentColor: string;
  
  // Basic Details
  fullName: string;
  employeeId: string;
  designation: string;
  organizationName: string;
  department: string;
  
  // Media
  photoUrl: string; // base64 or blob
  logoUrl: string; // base64 or blob
  signatureUrl: string; // base64 or draw
  
  // Dates
  joiningDate: string;
  dob?: string;
  issueDate: string;
  expiryDate?: string;
  
  // Contact & Personal
  bloodGroup?: BloodGroup;
  phoneNumber?: string;
  email?: string;
  officeAddress?: string;
  emergencyContact?: string;
  websiteUrl?: string;
  signatoryName?: string;
  
  // QR Code configuration
  qrMode: QRMode;
  qrFields: {
    includeName: boolean;
    includeId: boolean;
    includeDesignation: boolean;
    includeOrg: boolean;
    includeBloodGroup: boolean;
    includeEmergency: boolean;
    includeWebsite: boolean;
  };
  verificationId: string;
  verificationStatus: 'active' | 'expired' | 'revoked';
  
  // Field visibility toggles
  visibility: {
    showLogo: boolean;
    showPhoto: boolean;
    showDob: boolean;
    showBloodGroup: boolean;
    showPhone: boolean;
    showEmail: boolean;
    showAddress: boolean;
    showEmergency: boolean;
    showDates: boolean;
    showSignature: boolean;
    showQrCode: boolean;
    showLanyardSlot: boolean;
    showBarcode: boolean;
  };

  updatedAt: number;
  createdAt: number;
}

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  hindiName: string;
  category: string;
  description: string;
  defaultThemeColor: string;
  defaultAccentColor: string;
  badgeStyle: string;
  recommendedFor: string;
}
