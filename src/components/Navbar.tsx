import React from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { AuthButton } from './AuthButton';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { User } from 'firebase/auth';
import { MoreVertical, FolderArchive, Bot, Sparkles } from 'lucide-react';

interface NavbarProps {
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  onOpenMenu: () => void;
  onOpenMyCards: () => void;
  onOpenChatbot: () => void;
  onAuthChange?: (user: User | null) => void;
  savedCardsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  setLanguage,
  onOpenMenu,
  onOpenMyCards,
  onOpenChatbot,
  onAuthChange,
  savedCardsCount,
}) => {
  const isOnline = useOnlineStatus();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
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
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700 uppercase">
                PWA
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              By 5tar Suraj • SDR
            </p>
          </div>
        </div>

        {/* Right Tools: Auth, AI Assistant, My Cards, Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Offline indicator pill */}
          {!isOnline && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Offline</span>
            </div>
          )}

          {/* Gemini AI Assistant Button */}
          <button
            type="button"
            onClick={onOpenChatbot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            title="Open 5tar Gemini AI Assistant"
          >
            <Bot className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">
              {language === 'hi' ? 'एआई सहायक' : 'AI Assistant'}
            </span>
          </button>

          {/* Google Firebase Auth */}
          <AuthButton language={language} onAuthChange={onAuthChange} />

          {/* Language Switcher */}
          <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                language === 'en' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                language === 'hi' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* My Cards Quick Button */}
          <button
            type="button"
            onClick={onOpenMyCards}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer relative"
            title="My Saved Cards"
          >
            <FolderArchive className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden lg:inline">My Cards</span>
            {savedCardsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                {savedCardsCount}
              </span>
            )}
          </button>

          {/* PWA Install */}
          <div className="hidden xl:block">
            <PWAInstallButton language={language} />
          </div>

          {/* THREE-DOT (⋮) MENU BUTTON */}
          <button
            type="button"
            onClick={onOpenMenu}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition cursor-pointer"
            title="Menu"
          >
            <MoreVertical className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'hi' ? 'मेनू' : 'Menu'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
