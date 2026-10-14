import React from 'react';
import { Sparkles, ArrowRight, Layers, ShieldCheck, Download, Smartphone } from 'lucide-react';

interface HeroProps {
  language: 'en' | 'hi';
  onGetStarted: () => void;
  onExploreTemplates: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  onGetStarted,
  onExploreTemplates,
}) => {
  return (
    <section className="relative pt-8 pb-12 sm:pt-14 sm:pb-16 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        {/* Top Pills */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold shadow-xs mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>
            {language === 'hi'
              ? '100% मुफ्त • ऑफलाइन सक्षम PWA • 8+ टेम्पलेट्स'
              : '100% Free • Offline-Ready PWA • 8+ Production Templates'}
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          {language === 'hi' ? (
            <>
              मिनटों में बनाएँ प्रोफेशनल{' '}
              <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
                Employee ID Card
              </span>
            </>
          ) : (
            <>
              Create Professional Employee{' '}
              <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
                ID Cards in Minutes
              </span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {language === 'hi'
            ? 'अपनी कर्मचारी जानकारी भरें, डिजाइन चुनें और अपना ID Card PNG, JPG या PDF में डाउनलोड करें। मुफ्त, आसान और मोबाइल-फ्रेंडली।'
            : 'Fill in employee details, select an elegant template, and instantly download print-ready ID cards in PNG, JPG, or PDF. 100% Free, secure, and mobile-friendly.'}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onGetStarted}
            className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/35 transition flex items-center gap-2 group cursor-pointer"
          >
            <span>{language === 'hi' ? 'ID Card बनाएँ' : 'Create Employee ID Card'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>

          <button
            type="button"
            onClick={onExploreTemplates}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-xs hover:border-slate-400 transition flex items-center gap-2 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-blue-600" />
            <span>{language === 'hi' ? '8+ टेम्पलेट्स देखें' : 'Explore Templates'}</span>
          </button>
        </div>

        {/* Feature Badges Grid */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-xs text-slate-600 font-semibold">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{language === 'hi' ? '100% प्राइवेट व सुरक्षित' : 'Private & Local'}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Download className="w-4 h-4 text-blue-600" />
            <span>{language === 'hi' ? '300 DPI PDF एक्सपोर्ट' : '300 DPI High-Res'}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Smartphone className="w-4 h-4 text-purple-600" />
            <span>{language === 'hi' ? 'मोबाइल व PWA ऐप' : 'Installable PWA'}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{language === 'hi' ? 'हमेशा पूरी तरह मुफ्त' : '100% Free Forever'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
