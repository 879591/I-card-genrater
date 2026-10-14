import React, { useState } from 'react';
import { CardData, TemplateId } from '../types/card';
import { TEMPLATES } from './TemplatesGallery';
import { TEMPLATE_PRESETS } from '../utils/demoData';
import {
  X,
  Layers,
  FolderArchive,
  ShieldCheck,
  HelpCircle,
  Lock,
  Smartphone,
  Globe,
  User,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface ThreeDotMenuProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  currentTemplateId: TemplateId;
  onSelectTemplate: (templateId: TemplateId, preset: Partial<CardData>) => void;
  onOpenMyCards: () => void;
  onOpenVerification: () => void;
  onOpenHowItWorks: () => void;
  onOpenPrivacy: () => void;
  onOpenDeveloper: () => void;
  onInstallPWA?: () => void;
  savedCardsCount: number;
}

export const ThreeDotMenu: React.FC<ThreeDotMenuProps> = ({
  isOpen,
  onClose,
  language,
  setLanguage,
  currentTemplateId,
  onSelectTemplate,
  onOpenMyCards,
  onOpenVerification,
  onOpenHowItWorks,
  onOpenPrivacy,
  onOpenDeveloper,
  savedCardsCount,
}) => {
  const [showTemplatesSubmenu, setShowTemplatesSubmenu] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-amber-300 text-sm shadow-md">
              5★
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white leading-tight">
                5tar Card Menu
              </h3>
              <p className="text-[11px] text-blue-200">
                {language === 'hi' ? 'सभी फीचर्स एवं सेटिंग्स' : 'All Features & Shortcuts'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Quick Language Switcher Banner */}
          <div className="p-3 bg-slate-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>{language === 'hi' ? 'भाषा (Language)' : 'Language'}</span>
            </div>
            <div className="flex bg-white p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-lg transition ${
                  language === 'en' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1 rounded-lg transition ${
                  language === 'hi' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          {/* Core Feature Menus */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
              {language === 'hi' ? 'मुख्य फीचर्स' : 'Main Tools'}
            </span>

            {/* 1. Templates selector */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setShowTemplatesSubmenu(!showTemplatesSubmenu)}
                className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">
                      {language === 'hi' ? '8+ कार्ड टेम्पलेट्स' : '8+ Card Templates'}
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Current: <strong className="uppercase text-blue-600">{currentTemplateId}</strong>
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    showTemplatesSubmenu ? 'rotate-90' : ''
                  }`}
                />
              </button>

              {showTemplatesSubmenu && (
                <div className="p-2.5 pt-0 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-1.5">
                  {TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => {
                        onSelectTemplate(tmpl.id, TEMPLATE_PRESETS[tmpl.id]);
                        onClose();
                      }}
                      className={`p-2 rounded-xl text-left text-xs transition border flex items-center gap-2 ${
                        currentTemplateId === tmpl.id
                          ? 'border-blue-600 bg-blue-50/80 font-bold text-blue-900'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div
                        style={{ backgroundColor: tmpl.defaultThemeColor }}
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                      />
                      <span className="truncate">{language === 'hi' ? tmpl.hindiName : tmpl.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. My Cards */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenMyCards();
              }}
              className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 bg-white flex items-center justify-between text-left transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <FolderArchive className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">
                    {language === 'hi' ? 'सहेजे गए कार्ड (My Cards)' : 'My Saved Cards'}
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    {language === 'hi'
                      ? 'लोकल ब्राउज़र IndexedDB मेमोरी'
                      : 'Private browser IndexedDB storage'}
                  </p>
                </div>
              </div>
              {savedCardsCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px]">
                  {savedCardsCount}
                </span>
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* 3. Verification Portal */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenVerification();
              }}
              className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 bg-white flex items-center justify-between text-left transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">
                    {language === 'hi' ? 'पहचान सत्यापन पोर्टल' : 'Verify ID Portal'}
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Mode B cryptographic token validation
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* 4. How It Works */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenHowItWorks();
              }}
              className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white flex items-center justify-between text-left transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">
                    {language === 'hi' ? 'यह कैसे काम करता है?' : 'How It Works (Guide)'}
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    {language === 'hi' ? '4 आसान स्टेप्स' : '4 Simple steps to generate badges'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* 5. Privacy & Data Security */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPrivacy();
              }}
              className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white flex items-center justify-between text-left transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">
                    {language === 'hi' ? 'गोपनीयता और डेटा सुरक्षा' : 'Privacy & Security'}
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    100% Client-side • Zero server upload
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Developer Quick Link */}
          <div className="pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
              {language === 'hi' ? 'डेवलपर प्रोफाइल' : 'Developer & Creator'}
            </span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenDeveloper();
              }}
              className="w-full p-3 rounded-2xl bg-slate-900 text-white flex items-center justify-between text-left transition hover:bg-slate-800 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-black text-slate-950 text-xs">
                  5★
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Suraj Maurya (5tar Suraj)</h4>
                  <p className="text-[10px] text-amber-300">Supriya Digital Research (SDR)</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <span>Rudhauli, Basti, U.P.</span>
          <span>100% Free PWA</span>
        </div>
      </div>
    </div>
  );
};
