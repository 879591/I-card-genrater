import React from 'react';
import { CardData } from '../../types/card';
import { Shield, Sparkles, Building2, Stethoscope, GraduationCap, Award, Wrench, Briefcase } from 'lucide-react';

interface CardFrontProps {
  card: CardData;
  qrCodeUrl?: string;
  isPrint?: boolean;
}

export const CardFront: React.FC<CardFrontProps> = ({ card, qrCodeUrl }) => {
  const isPortrait = card.orientation === 'portrait';
  const { visibility } = card;

  // Template specific decorative icons and styles
  const getTemplateIcon = () => {
    switch (card.templateId) {
      case 'hospital':
        return <Stethoscope className="w-4 h-4 text-rose-500" />;
      case 'school':
      case 'college':
        return <GraduationCap className="w-4 h-4 text-amber-400" />;
      case 'security':
        return <Shield className="w-4 h-4 text-amber-400" />;
      case 'factory':
        return <Wrench className="w-4 h-4 text-orange-400" />;
      case 'business':
        return <Briefcase className="w-4 h-4 text-purple-300" />;
      case 'office':
        return <Building2 className="w-4 h-4 text-teal-300" />;
      case 'corporate':
      default:
        return <Award className="w-4 h-4 text-blue-300" />;
    }
  };

  // Dimensions: 320px x 508px for portrait, 508px x 320px for landscape
  const containerStyle: React.CSSProperties = {
    width: isPortrait ? '320px' : '508px',
    height: isPortrait ? '508px' : '320px',
    minWidth: isPortrait ? '320px' : '508px',
    minHeight: isPortrait ? '508px' : '320px',
    backgroundColor: '#ffffff',
  };

  return (
    <div
      style={containerStyle}
      className={`relative rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-slate-200 select-none ${
        card.templateId === 'security' ? 'bg-slate-950 text-white' : 'bg-white text-slate-800'
      }`}
    >
      {/* Lanyard Slot */}
      {visibility.showLanyardSlot && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30">
          <div className="w-16 h-3 bg-slate-900/40 rounded-full border border-slate-300/60 shadow-inner flex items-center justify-center">
            <div className="w-8 h-1 bg-white/40 rounded-full" />
          </div>
        </div>
      )}

      {/* PORTRAIT LAYOUT */}
      {isPortrait ? (
        <div className="flex-1 flex flex-col justify-between p-4 relative z-10 pt-7">
          {/* Header Banner */}
          <div
            style={{ backgroundColor: card.themeColor }}
            className="absolute top-0 left-0 right-0 h-28 rounded-b-[2.5rem] shadow-md overflow-hidden z-0"
          >
            {/* Template geometric accents */}
            <div
              style={{ backgroundColor: card.accentColor }}
              className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-25 blur-sm"
            />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>

          {/* Org Header Content */}
          <div className="relative z-10 flex items-center justify-between gap-2 text-white px-1">
            <div className="flex items-center gap-2 max-w-[210px]">
              {visibility.showLogo && card.logoUrl ? (
                <img
                  src={card.logoUrl}
                  alt="Logo"
                  className="w-10 h-10 object-contain rounded-lg bg-white/95 p-1 shadow-sm border border-white/20"
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  {getTemplateIcon()}
                </div>
              )}
              <div className="leading-tight truncate">
                <h3 className="font-bold text-sm tracking-tight text-white drop-shadow truncate">
                  {card.organizationName || 'Organization Name'}
                </h3>
                <p className="text-[10px] text-white/80 font-medium tracking-wider uppercase truncate">
                  {card.department || 'Official Identification'}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-black/25 text-white/90 border border-white/20">
                {card.templateId.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Photo & Identity Section */}
          <div className="relative z-10 flex flex-col items-center mt-3">
            {visibility.showPhoto && (
              <div className="relative group">
                <div
                  style={{ borderColor: card.themeColor }}
                  className="w-28 h-28 rounded-2xl overflow-hidden border-4 shadow-lg bg-slate-100 flex items-center justify-center relative"
                >
                  {card.photoUrl ? (
                    <img
                      src={card.photoUrl}
                      alt={card.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Sparkles className="w-8 h-8 opacity-40 mb-1" />
                      <span className="text-[10px] font-medium">No Photo</span>
                    </div>
                  )}
                </div>

                {/* Star / Verified Badge */}
                <div
                  style={{ backgroundColor: card.accentColor }}
                  className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white"
                  title="5tar Verified Badge"
                >
                  <span className="text-xs font-black">★</span>
                </div>
              </div>
            )}

            {/* Name & Title */}
            <div className="text-center mt-3 px-2 w-full">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {card.fullName || 'Employee Name'}
              </h2>
              <p
                style={{ color: card.themeColor }}
                className="text-xs font-bold uppercase tracking-wider mt-0.5"
              >
                {card.designation || 'Designation'}
              </p>
              <div className="mt-1 flex items-center justify-center gap-1.5 flex-wrap">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 shadow-xs">
                  ID: {card.employeeId || 'EMP-0000'}
                </span>
                {visibility.showBloodGroup && card.bloodGroup && (
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                    🩸 {card.bloodGroup}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Details Grid */}
          <div className="relative z-10 bg-slate-50/90 rounded-xl p-2.5 border border-slate-200/80 text-[11px] space-y-1">
            <div className="flex justify-between items-center text-slate-600">
              <span className="text-slate-400 font-medium">Dept:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                {card.department || 'General'}
              </span>
            </div>
            {visibility.showDates && (
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-400 font-medium">Joined:</span>
                <span className="font-semibold text-slate-800 font-mono text-[10px]">
                  {card.joiningDate || '—'}
                </span>
              </div>
            )}
            {visibility.showPhone && card.phoneNumber && (
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-400 font-medium">Phone:</span>
                <span className="font-semibold text-slate-800 font-mono text-[10px]">
                  {card.phoneNumber}
                </span>
              </div>
            )}
          </div>

          {/* Footer Bar with QR and Verification indicator */}
          <div className="relative z-10 flex items-center justify-between border-t border-slate-100 pt-2 pb-1">
            <div className="flex items-center gap-2">
              {visibility.showQrCode && qrCodeUrl ? (
                <div className="w-12 h-12 p-0.5 bg-white border border-slate-200 rounded-lg shadow-xs">
                  <img src={qrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-[8px] text-slate-400 font-mono">
                  QR
                </div>
              )}
              <div className="leading-none text-[9px] text-slate-500">
                <p className="font-bold text-slate-700">5tar ID Card</p>
                <p className="font-mono text-[8px] mt-0.5 text-slate-400">
                  {card.verificationId}
                </p>
                <span className="inline-block mt-0.5 text-[7px] text-emerald-600 font-semibold uppercase tracking-wider">
                  ● Verified Format
                </span>
              </div>
            </div>

            <div className="text-right">
              {visibility.showDates && card.expiryDate && (
                <p className="text-[9px] text-slate-400">
                  Valid Thru:{' '}
                  <span className="font-bold text-slate-700 font-mono">{card.expiryDate}</span>
                </p>
              )}
              <p className="text-[7px] text-slate-400 uppercase tracking-tighter mt-0.5">
                Auth Signature on Back
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* LANDSCAPE LAYOUT */
        <div className="flex-1 flex flex-col justify-between p-4 relative z-10 pt-6">
          {/* Top colored strip */}
          <div
            style={{ backgroundColor: card.themeColor }}
            className="absolute top-0 left-0 right-0 h-16 rounded-b-2xl shadow-sm z-0 flex items-center px-4 justify-between"
          >
            <div
              style={{ backgroundColor: card.accentColor }}
              className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-20"
            />
          </div>

          {/* Landscape Header */}
          <div className="relative z-10 flex items-center justify-between text-white px-1">
            <div className="flex items-center gap-3">
              {visibility.showLogo && card.logoUrl ? (
                <img
                  src={card.logoUrl}
                  alt="Logo"
                  className="w-10 h-10 object-contain rounded-lg bg-white/95 p-1 shadow-sm border border-white/20"
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
                  {getTemplateIcon()}
                </div>
              )}
              <div className="leading-tight">
                <h3 className="font-bold text-base tracking-tight text-white drop-shadow truncate max-w-[280px]">
                  {card.organizationName || 'Organization Name'}
                </h3>
                <p className="text-[10px] text-white/80 font-medium tracking-wider uppercase">
                  {card.department || 'Official Identification'}
                </p>
              </div>
            </div>

            <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-black/30 text-white border border-white/20">
              {card.templateId.toUpperCase()}
            </span>
          </div>

          {/* Middle Body: Photo on Left, Details in Center, QR on Right */}
          <div className="relative z-10 flex items-center justify-between gap-4 mt-2">
            {/* Photo */}
            {visibility.showPhoto && (
              <div className="relative shrink-0">
                <div
                  style={{ borderColor: card.themeColor }}
                  className="w-24 h-28 rounded-xl overflow-hidden border-3 shadow-md bg-slate-100 flex items-center justify-center"
                >
                  {card.photoUrl ? (
                    <img
                      src={card.photoUrl}
                      alt={card.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-slate-400 text-center text-[10px]">No Photo</div>
                  )}
                </div>
                <div
                  style={{ backgroundColor: card.accentColor }}
                  className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-xs text-xs font-bold border border-white"
                >
                  ★
                </div>
              </div>
            )}

            {/* Central Info */}
            <div className="flex-1 min-w-0 pr-1">
              <h2 className="text-lg font-black tracking-tight text-slate-900 leading-snug truncate">
                {card.fullName || 'Employee Name'}
              </h2>
              <p
                style={{ color: card.themeColor }}
                className="text-xs font-bold uppercase tracking-wide truncate"
              >
                {card.designation || 'Designation'}
              </p>

              <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400">ID: </span>
                  <span className="font-bold text-slate-800 font-mono">{card.employeeId}</span>
                </div>
                {visibility.showBloodGroup && card.bloodGroup && (
                  <div>
                    <span className="text-slate-400">Blood: </span>
                    <span className="font-bold text-rose-600">{card.bloodGroup}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-400">Dept: </span>
                  <span className="font-semibold text-slate-700 truncate">{card.department}</span>
                </div>
                {visibility.showDates && card.joiningDate && (
                  <div>
                    <span className="text-slate-400">Joined: </span>
                    <span className="font-semibold text-slate-700 font-mono text-[9px]">
                      {card.joiningDate}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* QR Code on Right */}
            {visibility.showQrCode && qrCodeUrl && (
              <div className="shrink-0 flex flex-col items-center">
                <div className="w-18 h-18 p-1 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <img src={qrCodeUrl} alt="QR" className="w-full h-full object-contain" />
                </div>
                <span className="text-[8px] font-mono text-slate-400 mt-1">
                  {card.verificationId.slice(0, 9)}
                </span>
              </div>
            )}
          </div>

          {/* Bottom strip */}
          <div className="relative z-10 flex items-center justify-between text-[9px] text-slate-500 border-t border-slate-100 pt-1.5">
            <span className="font-semibold text-slate-600">5tar Certified Identity Card</span>
            {visibility.showDates && card.expiryDate && (
              <span>
                Valid Thru:{' '}
                <strong className="text-slate-800 font-mono">{card.expiryDate}</strong>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
