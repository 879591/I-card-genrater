import React, { useRef, useState } from 'react';
import { CardData, CardOrientation, BloodGroup, QRMode } from '../types/card';
import {
  User,
  Building,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Upload,
  Trash2,
  RefreshCw,
  Palette,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { DEMO_PHOTOS, DEMO_LOGOS, DEMO_SIGNATURE } from '../utils/demoData';

interface CardFormProps {
  card: CardData;
  setCard: React.Dispatch<React.SetStateAction<CardData>>;
  language: 'en' | 'hi';
  onReset: () => void;
  onLoadDemo: () => void;
}

export const CardForm: React.FC<CardFormProps> = ({
  card,
  setCard,
  language,
  onReset,
  onLoadDemo,
}) => {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const signInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'info' | 'media' | 'contact' | 'qr' | 'style'>('info');
  const [imageError, setImageError] = useState<string | null>(null);

  const updateCard = <K extends keyof CardData>(field: K, value: CardData[K]) => {
    setCard((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: Date.now(),
    }));
  };

  const updateVisibility = (key: keyof CardData['visibility'], value: boolean) => {
    setCard((prev) => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        [key]: value,
      },
      updatedAt: Date.now(),
    }));
  };

  const updateQrFields = (key: keyof CardData['qrFields'], value: boolean) => {
    setCard((prev) => ({
      ...prev,
      qrFields: {
        ...prev.qrFields,
        [key]: value,
      },
      updatedAt: Date.now(),
    }));
  };

  // Image Upload Handler (reads as Base64 Data URL)
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetField: 'photoUrl' | 'logoUrl' | 'signatureUrl'
  ) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError(
        language === 'hi'
          ? 'फोटो का आकार 5MB से कम होना चाहिए।'
          : 'Image size must be less than 5MB.'
      );
      return;
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      setImageError(
        language === 'hi'
          ? 'कृपया वैध इमेज फाइल (PNG, JPG, SVG, WebP) चुनें।'
          : 'Please select a valid image file (PNG, JPG, SVG, WebP).'
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        updateCard(targetField, event.target.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Unknown'];

  // Presets of theme colors
  const themeColors = [
    { label: 'Royal Blue', theme: '#1e40af', accent: '#3b82f6' },
    { label: 'Navy Corporate', theme: '#0f172a', accent: '#38bdf8' },
    { label: 'Teal Office', theme: '#0f766e', accent: '#14b8a6' },
    { label: 'Crimson Red', theme: '#991b1b', accent: '#f59e0b' },
    { label: 'Emerald Green', theme: '#065f46', accent: '#10b981' },
    { label: 'Cyan Medical', theme: '#0284c7', accent: '#e11d48' },
    { label: 'Amber Industrial', theme: '#ea580c', accent: '#f97316' },
    { label: 'Purple Executive', theme: '#581c87', accent: '#a855f7' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden flex flex-col">
      {/* Header with Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-4 sm:p-5 text-white flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold">
              {language === 'hi' ? 'कर्मचारी विवरण भरें' : 'Card Editor & Details'}
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            {language === 'hi'
              ? 'बदलाव तुरंत लाइव कार्ड पर दिखते हैं।'
              : 'Live real-time preview updates as you type.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLoadDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/60 hover:bg-blue-600 text-xs font-semibold text-white border border-blue-400/40 transition"
            title="Load Sample Demo Data"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'hi' ? 'डेमो भरें' : 'Load Demo'}</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 transition"
            title="Reset All Fields"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'रीसेट' : 'Reset'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation for easy mobile navigation */}
      <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto text-xs font-semibold text-slate-600 scrollbar-none">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-1.5 px-4 py-3 shrink-0 border-b-2 transition ${
            activeTab === 'info'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>{language === 'hi' ? '1. मुख्य जानकारी' : '1. Basic Info'}</span>
        </button>
        <button
          onClick={() => setActiveTab('media')}
          className={`flex items-center gap-1.5 px-4 py-3 shrink-0 border-b-2 transition ${
            activeTab === 'media'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>{language === 'hi' ? '2. फोटो और लोगो' : '2. Media'}</span>
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-1.5 px-4 py-3 shrink-0 border-b-2 transition ${
            activeTab === 'contact'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{language === 'hi' ? '3. तारीख व संपर्क' : '3. Dates & Contact'}</span>
        </button>
        <button
          onClick={() => setActiveTab('qr')}
          className={`flex items-center gap-1.5 px-4 py-3 shrink-0 border-b-2 transition ${
            activeTab === 'qr'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>{language === 'hi' ? '4. QR कोड सेटिंग्स' : '4. QR Code'}</span>
        </button>
        <button
          onClick={() => setActiveTab('style')}
          className={`flex items-center gap-1.5 px-4 py-3 shrink-0 border-b-2 transition ${
            activeTab === 'style'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>{language === 'hi' ? '5. स्टाइलिंग' : '5. Style & Layout'}</span>
        </button>
      </div>

      {imageError && (
        <div className="m-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{imageError}</span>
        </div>
      )}

      {/* Form Body */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* TAB 1: BASIC INFO */}
        {activeTab === 'info' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'कर्मचारी का पूरा नाम *' : 'Employee Full Name *'}
              </label>
              <input
                type="text"
                value={card.fullName}
                onChange={(e) => updateCard('fullName', e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-slate-800"
              />
              {!card.fullName.trim() && (
                <span className="text-[11px] text-amber-600 font-medium">
                  {language === 'hi' ? 'नाम आवश्यक है' : 'Name is required'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'कर्मचारी आईडी *' : 'Employee ID *'}
                </label>
                <input
                  type="text"
                  value={card.employeeId}
                  onChange={(e) => updateCard('employeeId', e.target.value)}
                  placeholder="e.g. EMP-7842"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'पद (Designation) *' : 'Designation / Job Title *'}
                </label>
                <input
                  type="text"
                  value={card.designation}
                  onChange={(e) => updateCard('designation', e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'कंपनी / संस्था का नाम *' : 'Company / Organization Name *'}
                </label>
                <input
                  type="text"
                  value={card.organizationName}
                  onChange={(e) => updateCard('organizationName', e.target.value)}
                  placeholder="e.g. 5tar Tech Solutions"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'विभाग (Department)' : 'Department'}
                </label>
                <input
                  type="text"
                  value={card.department}
                  onChange={(e) => updateCard('department', e.target.value)}
                  placeholder="e.g. Information Technology"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-800"
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between text-xs text-blue-900">
              <span>{language === 'hi' ? 'अगला: फोटो और लोगो अपलोड करें' : 'Next: Upload Photo & Logo'}</span>
              <button
                type="button"
                onClick={() => setActiveTab('media')}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                {language === 'hi' ? 'आगे बढ़ें →' : 'Continue →'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MEDIA ASSETS */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            {/* Employee Photo */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>{language === 'hi' ? 'कर्मचारी फोटो' : 'Employee Photograph'}</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={card.visibility.showPhoto}
                    onChange={(e) => updateVisibility('showPhoto', e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>{language === 'hi' ? 'दिखाएँ' : 'Visible'}</span>
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border-2 border-slate-300 shadow-xs flex items-center justify-center shrink-0">
                  {card.photoUrl ? (
                    <img src={card.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-slate-400">No Image</span>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'photoUrl')}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{card.photoUrl ? (language === 'hi' ? 'फोटो बदलें' : 'Replace Photo') : (language === 'hi' ? 'फोटो अपलोड करें' : 'Upload Photo')}</span>
                    </button>
                    {card.photoUrl && (
                      <button
                        type="button"
                        onClick={() => updateCard('photoUrl', '')}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'हटाएँ' : 'Remove'}</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    PNG, JPG, WebP. Max 5MB. Stored locally in your browser memory.
                  </p>
                </div>
              </div>
            </div>

            {/* Company Logo */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-blue-600" />
                  <span>{language === 'hi' ? 'कंपनी लोगो' : 'Company / Organization Logo'}</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={card.visibility.showLogo}
                    onChange={(e) => updateVisibility('showLogo', e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>{language === 'hi' ? 'दिखाएँ' : 'Visible'}</span>
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-300 p-1 flex items-center justify-center shrink-0">
                  {card.logoUrl ? (
                    <img src={card.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-[9px] text-slate-400">No Logo</span>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'logoUrl')}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{card.logoUrl ? (language === 'hi' ? 'लोगो बदलें' : 'Replace Logo') : (language === 'hi' ? 'लोगो अपलोड करें' : 'Upload Logo')}</span>
                    </button>
                    {card.logoUrl && (
                      <button
                        type="button"
                        onClick={() => updateCard('logoUrl', '')}
                        className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'हटाएँ' : 'Remove'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Authorized Signature */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'hi' ? 'अधिकृत हस्ताक्षर (Signature)' : 'Authorized Signatory & Signature'}</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={card.visibility.showSignature}
                    onChange={(e) => updateVisibility('showSignature', e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>{language === 'hi' ? 'दिखाएँ' : 'Visible'}</span>
                </label>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {language === 'hi' ? 'हस्ताक्षरकर्ता का नाम व पद' : 'Signatory Full Name / Title'}
                  </label>
                  <input
                    type="text"
                    value={card.signatoryName || ''}
                    onChange={(e) => updateCard('signatoryName', e.target.value)}
                    placeholder="e.g. Suraj Maurya (Director)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    ref={signInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'signatureUrl')}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => signInputRef.current?.click()}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{language === 'hi' ? 'हस्ताक्षर अपलोड करें' : 'Upload Signature Image'}</span>
                  </button>
                  {card.signatureUrl && (
                    <button
                      type="button"
                      onClick={() => updateCard('signatureUrl', '')}
                      className="px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-800"
                    >
                      {language === 'hi' ? 'हटाएँ' : 'Clear'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DATES & CONTACT */}
        {activeTab === 'contact' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'ज्वाइनिंग की तारीख' : 'Date of Joining'}
                </label>
                <input
                  type="date"
                  value={card.joiningDate}
                  onChange={(e) => updateCard('joiningDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'जन्म तिथि (वैकल्पिक)' : 'Date of Birth (Optional)'}
                </label>
                <input
                  type="date"
                  value={card.dob || ''}
                  onChange={(e) => updateCard('dob', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'कार्ड जारी करने की तारीख' : 'Card Issue Date'}
                </label>
                <input
                  type="date"
                  value={card.issueDate}
                  onChange={(e) => updateCard('issueDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'वैधता समाप्ति तिथि (Expiry)' : 'Card Expiry Date (Optional)'}
                </label>
                <input
                  type="date"
                  value={card.expiryDate || ''}
                  onChange={(e) => updateCard('expiryDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'ब्लड ग्रुप (Blood Group)' : 'Blood Group (Optional)'}
                </label>
                <select
                  value={card.bloodGroup || 'Unknown'}
                  onChange={(e) => updateCard('bloodGroup', e.target.value as BloodGroup)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
                >
                  {bloodGroups.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'फोन नंबर (वैकल्पिक)' : 'Phone Number (Optional)'}
                </label>
                <input
                  type="tel"
                  value={card.phoneNumber || ''}
                  onChange={(e) => updateCard('phoneNumber', e.target.value)}
                  placeholder="+91 97920 06815"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'hi' ? 'ईमेल पता (वैकल्पिक)' : 'Email Address (Optional)'}
                </label>
                <input
                  type="email"
                  value={card.email || ''}
                  onChange={(e) => updateCard('email', e.target.value)}
                  placeholder="employee@domain.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'आपातकालीन संपर्क (Emergency ICE)' : 'Emergency Contact (ICE)'}
              </label>
              <input
                type="text"
                value={card.emergencyContact || ''}
                onChange={(e) => updateCard('emergencyContact', e.target.value)}
                placeholder="+91 98765 43210 (Spouse/Parent)"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'कार्यालय का पूरा पता' : 'Office / Workplace Address'}
              </label>
              <textarea
                rows={2}
                value={card.officeAddress || ''}
                onChange={(e) => updateCard('officeAddress', e.target.value)}
                placeholder="Tech Park, Rudhauli, Basti, Uttar Pradesh 272151"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'hi' ? 'संस्था की वेबसाइट' : 'Organization Website URL'}
              </label>
              <input
                type="url"
                value={card.websiteUrl || ''}
                onChange={(e) => updateCard('websiteUrl', e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
              />
            </div>
          </div>
        )}

        {/* TAB 4: QR CODE SETTINGS */}
        {activeTab === 'qr' && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-blue-600" />
                <span>{language === 'hi' ? 'QR कोड मोड चुनें' : 'Select QR Code Mode'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`p-3 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition ${
                    card.qrMode === 'verification'
                      ? 'border-blue-600 bg-blue-50/50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">
                      Mode B: Employee Verification
                    </span>
                    <input
                      type="radio"
                      name="qrMode"
                      value="verification"
                      checked={card.qrMode === 'verification'}
                      onChange={() => updateCard('qrMode', 'verification')}
                      className="text-blue-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Cryptographic record verification ID with Active/Expired status.
                  </p>
                </label>

                <label
                  className={`p-3 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition ${
                    card.qrMode === 'info'
                      ? 'border-blue-600 bg-blue-50/50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">
                      Mode A: Information QR
                    </span>
                    <input
                      type="radio"
                      name="qrMode"
                      value="info"
                      checked={card.qrMode === 'info'}
                      onChange={() => updateCard('qrMode', 'info')}
                      className="text-blue-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Directly encodes selected employee details (vCard/text).
                  </p>
                </label>
              </div>
            </div>

            {/* Verification Status Controls (Mode B) */}
            {card.qrMode === 'verification' && (
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900">
                    {language === 'hi' ? 'सत्यापन स्थिति (Record Status)' : 'Record Status'}
                  </span>
                  <select
                    value={card.verificationStatus}
                    onChange={(e) =>
                      updateCard(
                        'verificationStatus',
                        e.target.value as 'active' | 'expired' | 'revoked'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg border border-amber-300 bg-white font-bold text-xs text-slate-800"
                  >
                    <option value="active">Active & Valid</option>
                    <option value="expired">Card Expired</option>
                    <option value="revoked">Revoked / Terminated</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <span>Verification ID:</span>
                  <span className="font-mono font-bold">{card.verificationId}</span>
                </div>

                <p className="text-[11px] text-amber-800 leading-relaxed">
                  <strong>Notice:</strong> This QR embeds a non-guessable verification record ID. In
                  an enterprise environment, this can connect to the organization's central employee
                  database.
                </p>
              </div>
            )}

            {/* Information Mode Field Toggles (Mode A) */}
            {card.qrMode === 'info' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="text-xs font-bold text-slate-700 mb-2">
                  {language === 'hi' ? 'QR में कौन सी जानकारी शामिल करें:' : 'Select fields to encode in QR:'}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={card.qrFields.includeName}
                      onChange={(e) => updateQrFields('includeName', e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Full Name</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={card.qrFields.includeId}
                      onChange={(e) => updateQrFields('includeId', e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Employee ID</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={card.qrFields.includeDesignation}
                      onChange={(e) => updateQrFields('includeDesignation', e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Designation</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={card.qrFields.includeOrg}
                      onChange={(e) => updateQrFields('includeOrg', e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Organization</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={card.qrFields.includeBloodGroup}
                      onChange={(e) => updateQrFields('includeBloodGroup', e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Blood Group</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={card.qrFields.includeEmergency}
                      onChange={(e) => updateQrFields('includeEmergency', e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Emergency ICE</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: STYLE & ORIENTATION */}
        {activeTab === 'style' && (
          <div className="space-y-6">
            {/* Orientation */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                {language === 'hi' ? 'कार्ड ओरिएंटेशन (Orientation)' : 'Card Orientation'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateCard('orientation', 'portrait')}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 text-xs font-bold transition ${
                    card.orientation === 'portrait'
                      ? 'border-blue-600 bg-blue-50 text-blue-800'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="w-4 h-6 border-2 border-current rounded-sm" />
                  <span>{language === 'hi' ? 'वर्टिकल (Portrait)' : 'Portrait (Vertical)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateCard('orientation', 'landscape')}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 text-xs font-bold transition ${
                    card.orientation === 'landscape'
                      ? 'border-blue-600 bg-blue-50 text-blue-800'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="w-6 h-4 border-2 border-current rounded-sm" />
                  <span>{language === 'hi' ? 'हॉरिजॉन्टल (Landscape)' : 'Landscape (Horizontal)'}</span>
                </button>
              </div>
            </div>

            {/* Color Palette Presets */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                {language === 'hi' ? 'थीम रंग चुनें' : 'Choose Brand Colors'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {themeColors.map((palette) => (
                  <button
                    key={palette.label}
                    type="button"
                    onClick={() => {
                      updateCard('themeColor', palette.theme);
                      updateCard('accentColor', palette.accent);
                    }}
                    className={`p-2 rounded-xl border flex items-center gap-2 text-left text-xs transition ${
                      card.themeColor === palette.theme
                        ? 'border-blue-600 ring-2 ring-blue-500/20 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      style={{ backgroundColor: palette.theme }}
                      className="w-5 h-5 rounded-full shrink-0 shadow-xs border border-white"
                    />
                    <span className="font-semibold text-slate-700 truncate">{palette.label}</span>
                  </button>
                ))}
              </div>

              {/* Custom Hex Picker */}
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={card.themeColor}
                      onChange={(e) => updateCard('themeColor', e.target.value)}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    />
                    <span className="font-mono text-slate-600">{card.themeColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={card.accentColor}
                      onChange={(e) => updateCard('accentColor', e.target.value)}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer"
                    />
                    <span className="font-mono text-slate-600">{card.accentColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visibility Toggles */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {language === 'hi' ? 'फ़ील्ड विजिबिलिटी' : 'Field Visibility Toggles'}
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={card.visibility.showLanyardSlot}
                    onChange={(e) => updateVisibility('showLanyardSlot', e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Lanyard Clip Slot</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={card.visibility.showBarcode}
                    onChange={(e) => updateVisibility('showBarcode', e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Barcode (Back)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={card.visibility.showDates}
                    onChange={(e) => updateVisibility('showDates', e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Issue & Expiry Dates</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={card.visibility.showEmergency}
                    onChange={(e) => updateVisibility('showEmergency', e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Emergency ICE Details</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
