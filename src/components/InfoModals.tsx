import React from 'react';
import { X, CheckCircle, ShieldCheck, HelpCircle, Lock, ServerOff, Database } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'how-it-works' | 'privacy';
  language: 'en' | 'hi';
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  type,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {type === 'how-it-works' ? (
              <div className="p-2 bg-blue-500/20 rounded-xl text-blue-300">
                <HelpCircle className="w-5 h-5" />
              </div>
            ) : (
              <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="font-bold text-base">
                {type === 'how-it-works'
                  ? language === 'hi'
                    ? 'यह कैसे काम करता है? (4 आसान स्टेप्स)'
                    : 'How It Works (4 Steps)'
                  : language === 'hi'
                  ? 'गोपनीयता और डेटा सुरक्षा नीति'
                  : 'Privacy & Security Architecture'}
              </h3>
              <p className="text-xs text-blue-200">5tar Employee Card Maker</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-slate-700 leading-relaxed">
          {type === 'how-it-works' ? (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="font-bold text-blue-600 block mb-1">
                  1. {language === 'hi' ? 'कर्मचारी विवरण भरें' : 'Fill Details'}
                </span>
                <p className="text-slate-600">
                  {language === 'hi'
                    ? 'नाम, कर्मचारी आईडी, पद, विभाग और संस्था का नाम भरें।'
                    : 'Enter employee full name, ID, job title, department, and company.'}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="font-bold text-blue-600 block mb-1">
                  2. {language === 'hi' ? 'फोटो व लोगो अपलोड करें' : 'Upload Photos & Select Style'}
                </span>
                <p className="text-slate-600">
                  {language === 'hi'
                    ? 'पासपोर्ट साइज फोटो और कंपनी लोगो जोड़ें। 8 टेम्पलेट्स में से अपनी पसंद चुनें।'
                    : 'Add employee photo, organization logo, and signature. Choose from 8+ templates.'}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="font-bold text-blue-600 block mb-1">
                  3. {language === 'hi' ? 'QR कोड सेट करें' : 'Configure QR Code'}
                </span>
                <p className="text-slate-600">
                  {language === 'hi'
                    ? 'आवश्यक सूचना या सत्यापन आईडी (Active / Expired स्थिति) जोड़ें।'
                    : 'Choose Mode A (contact details) or Mode B (verification identifier with status).'}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="font-bold text-blue-600 block mb-1">
                  4. {language === 'hi' ? 'तुरंत डाउनलोड करें' : 'Instant 300 DPI Export'}
                </span>
                <p className="text-slate-600">
                  {language === 'hi'
                    ? 'PNG, JPG या ISO CR80 स्टैंडर्ड PDF में डाउनलोड करें और सीधे प्रिंट करें।'
                    : 'Download crisp PNG, JPG, or dual-sided print-ready PDF.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                <ServerOff className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-950">100% Client-Side In-Browser</h4>
                  <p className="text-emerald-800 text-[11px] mt-0.5">
                    {language === 'hi'
                      ? 'कोई भी फोटो या कर्मचारी डेटा किसी सर्वर पर अपलोड नहीं किया जाता। सब कुछ आपके डिवाइस पर ही जनरेट होता है।'
                      : 'Zero remote server uploads. Card photos and details are processed purely in local browser memory.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <Database className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Local IndexedDB Sandbox</h4>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Saved cards live inside your browser’s IndexedDB. You can delete or clear them at any moment.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <Lock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">No Tracking & 100% Free</h4>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    No advertisements, cookies, telemetry, or hidden paywalls.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
          >
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
