import React from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import {
  Sparkles,
  FolderArchive,
  ShieldCheck,
  Globe,
  Menu,
  X,
  CreditCard,
} from 'lucide-react';

interface NavbarProps {
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  onOpenMyCards: () => void;
  onOpenVerification: () => void;
  savedCardsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  setLanguage,
  onOpenMyCards,
  onOpenVerification,
  savedCardsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const isOnline = useOnlineStatus();

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
            <span className="font-black text-amber-300 text-base">5★</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-none">
                5tar Card Maker
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
                PWA
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              By 5tar Suraj • Supriya Digital Research
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600">
          <button
            onClick={() => scrollTo('card-creator-section')}
            className="hover:text-blue-600 transition"
          >
            {language === 'hi' ? 'कार्ड बनाएँ' : 'Create Card'}
          </button>
          <button
            onClick={() => scrollTo('templates-section')}
            className="hover:text-blue-600 transition"
          >
            {language === 'hi' ? 'टेम्पलेट्स' : 'Templates'}
          </button>
          <button
            onClick={() => scrollTo('how-it-works')}
            className="hover:text-blue-600 transition"
          >
            {language === 'hi' ? 'कैसे काम करता है' : 'How It Works'}
          </button>
          <button
            onClick={() => scrollTo('privacy-section')}
            className="hover:text-blue-600 transition"
          >
            {language === 'hi' ? 'प्राइवेसी' : 'Privacy'}
          </button>
          <button
            onClick={() => scrollTo('developer-section')}
            className="hover:text-blue-600 transition"
          >
            {language === 'hi' ? 'डेवलपर' : 'About Developer'}
          </button>
        </nav>

        {/* Right Action Icons & Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Online/Offline status dot */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
              isOnline ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}
            title={isOnline ? 'Online' : 'Offline'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
              }`}
            />
            <span className="text-[10px]">{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                language === 'en' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                language === 'hi' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Verification Portal Button */}
          <button
            onClick={onOpenVerification}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
            title="Verify ID Code"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'hi' ? 'सत्यापन' : 'Verify ID'}</span>
          </button>

          {/* My Cards Saved Drawer Button */}
          <button
            onClick={onOpenMyCards}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition relative"
            title="Saved Cards"
          >
            <FolderArchive className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">
              {language === 'hi' ? 'My Cards' : 'My Cards'}
            </span>
            {savedCardsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                {savedCardsCount}
              </span>
            )}
          </button>

          {/* PWA Install Button */}
          <div className="hidden sm:block">
            <PWAInstallButton language={language} />
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
            <button
              onClick={() => scrollTo('card-creator-section')}
              className="p-2.5 rounded-xl bg-slate-50 text-left"
            >
              {language === 'hi' ? 'कार्ड बनाएँ' : 'Create Card'}
            </button>
            <button
              onClick={() => scrollTo('templates-section')}
              className="p-2.5 rounded-xl bg-slate-50 text-left"
            >
              {language === 'hi' ? 'टेम्पलेट्स (8+)' : 'Templates (8+)'}
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="p-2.5 rounded-xl bg-slate-50 text-left"
            >
              {language === 'hi' ? 'कैसे काम करता है' : 'How It Works'}
            </button>
            <button
              onClick={() => scrollTo('privacy-section')}
              className="p-2.5 rounded-xl bg-slate-50 text-left"
            >
              {language === 'hi' ? 'प्राइवेसी' : 'Privacy & Security'}
            </button>
            <button
              onClick={() => scrollTo('developer-section')}
              className="p-2.5 rounded-xl bg-slate-50 text-left col-span-2"
            >
              {language === 'hi' ? 'डेवलपर (Suraj Maurya)' : 'About Developer (Suraj Maurya)'}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenVerification();
              }}
              className="text-xs font-bold text-blue-600 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verify Employee ID</span>
            </button>
            <PWAInstallButton language={language} />
          </div>
        </div>
      )}
    </header>
  );
};
