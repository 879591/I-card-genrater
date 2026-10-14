import React from 'react';
import { CardData } from '../../types/card';
import { MapPin, Phone, Mail, Globe, AlertCircle, ShieldCheck } from 'lucide-react';

interface CardBackProps {
  card: CardData;
  qrCodeUrl?: string;
  isPrint?: boolean;
}

export const CardBack: React.FC<CardBackProps> = ({ card, qrCodeUrl }) => {
  const isPortrait = card.orientation === 'portrait';
  const { visibility } = card;

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

      {/* PORTRAIT BACK */}
      {isPortrait ? (
        <div className="flex-1 flex flex-col justify-between p-4 relative z-10 pt-7">
          {/* Top header line */}
          <div
            style={{ backgroundColor: card.themeColor }}
            className="absolute top-0 left-0 right-0 h-3"
          />

          {/* Return & Security Notice Header */}
          <div className="text-center border-b border-slate-100 pb-2">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>OFFICIAL EMPLOYEE CREDENTIAL</span>
            </div>
            <p className="text-[9px] text-slate-400 mt-0.5">
              Property of {card.organizationName || 'Issuing Organization'}
            </p>
          </div>

          {/* Details Section */}
          <div className="space-y-2 text-[10.5px] text-slate-600 my-auto">
            {visibility.showAddress && card.officeAddress && (
              <div className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
                    Office Address:
                  </span>
                  <p className="font-medium text-slate-700 leading-tight">
                    {card.officeAddress}
                  </p>
                </div>
              </div>
            )}

            {visibility.showEmergency && card.emergencyContact && (
              <div className="flex items-center gap-2 bg-rose-50 p-2 rounded-lg border border-rose-100 text-rose-800">
                <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[8px] text-rose-500 font-bold uppercase tracking-wider block">
                    In Case of Emergency (ICE):
                  </span>
                  <p className="font-bold font-mono text-[11px] leading-tight">
                    {card.emergencyContact}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {visibility.showPhone && card.phoneNumber && (
                <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-md border border-slate-100">
                  <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="font-mono text-[10px] text-slate-700 truncate">
                    {card.phoneNumber}
                  </span>
                </div>
              )}
              {visibility.showEmail && card.email && (
                <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-md border border-slate-100">
                  <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="text-[10px] text-slate-700 truncate">{card.email}</span>
                </div>
              )}
            </div>

            {card.websiteUrl && (
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] px-1">
                <Globe className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{card.websiteUrl}</span>
              </div>
            )}
          </div>

          {/* Terms & Return Clause */}
          <div className="bg-slate-50/80 p-2 rounded-lg border border-slate-100 text-[8.5px] text-slate-500 leading-tight">
            <p>
              <strong>Instructions:</strong> This card must be produced on demand by security personnel.
              If found, please return to the issuing office address or contact the organization. Card is
              non-transferable.
            </p>
          </div>

          {/* Signature & Auth Area */}
          <div className="flex items-end justify-between border-t border-slate-100 pt-2 pb-1">
            {/* Barcode representation */}
            {visibility.showBarcode && (
              <div className="flex flex-col">
                <div className="flex items-end gap-[1.5px] h-7">
                  {[4, 2, 6, 3, 5, 2, 4, 1, 3, 6, 2, 5, 3, 4, 2, 5, 3, 6, 2, 4, 3, 5, 2, 4].map(
                    (w, i) => (
                      <div
                        key={i}
                        style={{ width: `${w * 0.75}px` }}
                        className="h-full bg-slate-800"
                      />
                    )
                  )}
                </div>
                <span className="text-[8px] font-mono text-slate-400 mt-0.5 tracking-widest">
                  {card.employeeId || 'ID-0000'}
                </span>
              </div>
            )}

            {/* Signatory */}
            {visibility.showSignature && (
              <div className="text-center">
                {card.signatureUrl ? (
                  <div className="h-8 flex items-center justify-center">
                    <img
                      src={card.signatureUrl}
                      alt="Signature"
                      className="max-h-8 max-w-[100px] object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-8 border-b border-dashed border-slate-400 w-24" />
                )}
                <div className="border-t border-slate-300 pt-0.5 mt-0.5">
                  <p className="text-[9px] font-bold text-slate-800">
                    {card.signatoryName || 'Authorized Signatory'}
                  </p>
                  <p className="text-[7.5px] text-slate-400 uppercase tracking-tighter">
                    Signature & Seal
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* LANDSCAPE BACK */
        <div className="flex-1 flex flex-col justify-between p-4 relative z-10 pt-6">
          <div
            style={{ backgroundColor: card.themeColor }}
            className="absolute top-0 left-0 right-0 h-2.5"
          />

          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                Official Credential Verification
              </span>
            </div>
            <span className="text-[9px] font-mono text-slate-400">
              Ref: {card.verificationId}
            </span>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-2 gap-3 my-auto text-[10px]">
            <div className="space-y-1.5">
              {visibility.showAddress && card.officeAddress && (
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                  <span className="text-[8px] text-slate-400 font-bold uppercase block">
                    Office Address:
                  </span>
                  <p className="text-slate-700 leading-tight truncate">{card.officeAddress}</p>
                </div>
              )}
              {visibility.showEmergency && card.emergencyContact && (
                <div className="bg-rose-50 p-1.5 rounded-lg border border-rose-100 text-rose-800">
                  <span className="text-[8px] text-rose-500 font-bold uppercase block">
                    Emergency Contact (ICE):
                  </span>
                  <p className="font-bold font-mono text-[10px] leading-tight">
                    {card.emergencyContact}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-[8.5px] text-slate-500 leading-snug">
                This card is non-transferable and remains property of {card.organizationName || 'the issuing body'}. If found, return immediately.
              </div>
              <div className="flex items-center justify-between text-[9px] text-slate-600 px-1">
                <span>Phone: {card.phoneNumber || 'N/A'}</span>
                <span>Email: {card.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Landscape Bottom */}
          <div className="flex items-end justify-between border-t border-slate-100 pt-1.5">
            {/* Barcode */}
            {visibility.showBarcode && (
              <div className="flex flex-col">
                <div className="flex items-end gap-[1.5px] h-6">
                  {[3, 2, 5, 2, 4, 1, 4, 6, 2, 5, 3, 4, 2, 5, 3, 5, 2, 4].map((w, i) => (
                    <div
                      key={i}
                      style={{ width: `${w * 0.8}px` }}
                      className="h-full bg-slate-800"
                    />
                  ))}
                </div>
                <span className="text-[8px] font-mono text-slate-400 mt-0.5">
                  {card.employeeId}
                </span>
              </div>
            )}

            {/* Signature */}
            {visibility.showSignature && (
              <div className="text-center">
                {card.signatureUrl ? (
                  <img
                    src={card.signatureUrl}
                    alt="Signature"
                    className="max-h-7 max-w-[90px] object-contain mx-auto"
                  />
                ) : (
                  <div className="h-6 border-b border-dashed border-slate-400 w-24 mx-auto" />
                )}
                <div className="border-t border-slate-300 pt-0.5 mt-0.5">
                  <p className="text-[9px] font-bold text-slate-800">
                    {card.signatoryName || 'Authorized Signatory'}
                  </p>
                  <p className="text-[7.5px] text-slate-400 uppercase">Signature</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
