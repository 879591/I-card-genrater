import React, { useState } from 'react';
import { ShieldCheck, Heart, ExternalLink, ArrowUp, X } from 'lucide-react';

interface FooterProps {
  language: 'en' | 'hi';
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const currentYear = new Date().getFullYear();
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Identity & Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-amber-300 text-sm">
                5★
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">
                5tar Employee Card Maker
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'मुफ्त, सुरक्षित और मोबाइल-फ्रेंडली PWA आधारित एम्प्लॉई आईडी कार्ड जनरेटर।'
                : 'A free, private, and mobile-first progressive web application for generating professional employee identification cards.'}
            </p>
            <p className="text-[11px] text-blue-400 font-medium">
              Digital Brand: Supriya Digital Research (SDR)
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              {language === 'hi' ? 'नेविगेशन' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-white transition"
                >
                  {language === 'hi' ? 'होम पेज' : 'Home'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('card-creator-section')}
                  className="hover:text-white transition"
                >
                  {language === 'hi' ? 'कार्ड बनाएँ' : 'Create ID Card'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('templates-section')}
                  className="hover:text-white transition"
                >
                  {language === 'hi' ? '8+ टेम्पलेट्स' : 'Card Templates'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('how-it-works')}
                  className="hover:text-white transition"
                >
                  {language === 'hi' ? 'यह कैसे काम करता है' : 'How It Works'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Trust */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              {language === 'hi' ? 'गोपनीयता और नियम' : 'Trust & Policies'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setModalType('privacy')}
                  className="hover:text-white transition"
                >
                  {language === 'hi' ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalType('terms')}
                  className="hover:text-white transition"
                >
                  {language === 'hi' ? 'उपयोग की शर्तें (Terms of Use)' : 'Terms of Use'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('privacy-section')}
                  className="hover:text-white transition"
                >
                  {language === 'hi' ? 'डेटा सुरक्षा गारंटी' : 'Data Protection'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Developer & Contact */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              {language === 'hi' ? 'डेवलपर संपर्क' : 'About Developer'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="text-slate-300 font-semibold">Suraj Maurya (5tar Suraj)</li>
              <li>Rudhauli, Basti, Uttar Pradesh, India</li>
              <li>
                <a
                  href="https://www.instagram.com/5tar.suraj?stkn=OWZjNXhyb2toanZk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition flex items-center gap-1"
                >
                  <span>Instagram Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/share/1FDbbX2rcH/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition flex items-center gap-1"
                >
                  <span>Facebook Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="tel:9792006815" className="hover:text-blue-400 font-mono transition">
                  Contact: +91 97920 06815
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {currentYear} 5tar Employee Card Maker. Built by 5tar Suraj.</p>
          <p className="flex items-center gap-1.5">
            <span>Powered by Supriya Digital Research (SDR)</span>
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Privacy Policy / Terms Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white text-slate-800 rounded-3xl p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {modalType === 'privacy'
                  ? (language === 'hi' ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy')
                  : (language === 'hi' ? 'उपयोग की शर्तें (Terms of Use)' : 'Terms of Use')}
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-3 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              {modalType === 'privacy' ? (
                <>
                  <p>
                    <strong>1. Absolute Client-Side Privacy:</strong> 5tar Employee Card Maker does not transmit or upload employee data, names, ID numbers, or photos to external servers. All rendering and export happens inside your browser.
                  </p>
                  <p>
                    <strong>2. Local Storage:</strong> When you choose to save a card, it is stored in your browser's IndexedDB. This data never leaves your device and can be cleared at any time.
                  </p>
                  <p>
                    <strong>3. No Cookies or Tracking:</strong> We do not track user behavior, inject third-party ad pixels, or sell user information.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>1. Free Usage:</strong> This tool is free for personal, educational, corporate, and organizational use.
                  </p>
                  <p>
                    <strong>2. Official Identification Notice:</strong> Cards generated with this software represent organizational staff credentials. This tool does not issue, replicate, or simulate government-issued official identities (such as Aadhaar, Passports, or Driving Licenses).
                  </p>
                  <p>
                    <strong>3. User Responsibility:</strong> The user warrants that they possess lawful authorization to create cards for their organization.
                  </p>
                </>
              )}
            </div>

            <button
              onClick={() => setModalType(null)}
              className="mt-6 w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
