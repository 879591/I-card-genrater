import React, { useState, useRef, useEffect } from 'react';
import { CardData, TemplateId } from './types/card';
import { DEFAULT_CARD, TEMPLATE_PRESETS } from './utils/demoData';
import { getAllCardsFromIDB, saveCardToIDB } from './utils/idb';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CardPreview } from './components/CardPreview';
import { CardForm } from './components/CardForm';
import { TemplatesGallery } from './components/TemplatesGallery';
import { HowItWorks } from './components/HowItWorks';
import { PrivacySection } from './components/PrivacySection';
import { DeveloperSection } from './components/DeveloperSection';
import { Footer } from './components/Footer';
import { ExportModal } from './components/ExportModal';
import { MyCardsDrawer } from './components/MyCardsDrawer';
import { VerificationModal } from './components/VerificationModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import {
  Download,
  Printer,
  Bookmark,
  Sparkles,
  RefreshCw,
  CheckCircle,
  Eye,
  CreditCard,
} from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [card, setCard] = useState<CardData>(DEFAULT_CARD);
  const [activeSide, setActiveSide] = useState<'front' | 'back' | 'both'>('front');

  // Modals
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isMyCardsOpen, setIsMyCardsOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [savedCardsCount, setSavedCardsCount] = useState(0);
  const [bannerAlert, setBannerAlert] = useState<string | null>(null);

  // References for export capture
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  // Refresh saved cards count on mount and when modal opens/closes
  const updateSavedCount = async () => {
    try {
      const cards = await getAllCardsFromIDB();
      setSavedCardsCount(cards.length);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    updateSavedCount();
  }, [isMyCardsOpen]);

  const handleSelectTemplate = (templateId: TemplateId, preset: Partial<CardData>) => {
    setCard((prev) => ({
      ...prev,
      ...preset,
      templateId,
      updatedAt: Date.now(),
    }));
    setBannerAlert(
      language === 'hi'
        ? `टेम्पलेट लागू किया गया: ${templateId.toUpperCase()}`
        : `Applied Template: ${templateId.toUpperCase()}`
    );
    setTimeout(() => setBannerAlert(null), 3000);
  };

  const handleResetForm = () => {
    if (
      window.confirm(
        language === 'hi'
          ? 'क्या आप फॉर्म रीसेट करना चाहते हैं?'
          : 'Are you sure you want to reset all form fields?'
      )
    ) {
      setCard({
        ...DEFAULT_CARD,
        id: `card-${Date.now()}`,
        fullName: '',
        employeeId: '',
        designation: '',
        organizationName: '',
        department: '',
        photoUrl: '',
        logoUrl: '',
        signatureUrl: '',
        updatedAt: Date.now(),
      });
    }
  };

  const handleLoadDemo = () => {
    setCard({
      ...DEFAULT_CARD,
      id: `demo-${Date.now()}`,
      updatedAt: Date.now(),
    });
    setBannerAlert(
      language === 'hi' ? 'डेमो कर्मचारी डेटा लोड हो गया!' : 'Loaded sample demo employee data!'
    );
    setTimeout(() => setBannerAlert(null), 3000);
  };

  const handleSaveToMyCards = async () => {
    try {
      await saveCardToIDB(card);
      await updateSavedCount();
      setBannerAlert(
        language === 'hi'
          ? 'कार्ड आपके My Cards में सफलतापूर्वक सहेज लिया गया!'
          : 'Card saved to My Cards successfully!'
      );
      setTimeout(() => setBannerAlert(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const scrollToCreator = () => {
    const el = document.getElementById('card-creator-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTemplates = () => {
    const el = document.getElementById('templates-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Offline Toast */}
      <OfflineIndicator language={language} />

      {/* Main Header Navbar */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        onOpenMyCards={() => setIsMyCardsOpen(true)}
        onOpenVerification={() => setIsVerificationOpen(true)}
        savedCardsCount={savedCardsCount}
      />

      {/* Hero Header */}
      <Hero
        language={language}
        onGetStarted={scrollToCreator}
        onExploreTemplates={scrollToTemplates}
      />

      {/* Floating Action Banner Notification */}
      {bannerAlert && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-full shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>{bannerAlert}</span>
        </div>
      )}

      {/* CARD CREATOR WORKSPACE */}
      <main id="card-creator-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Workspace Action Toolbar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base leading-tight">
                {language === 'hi' ? 'आईडी कार्ड जनरेटर वर्कस्पेस' : 'Card Design Workspace'}
              </h2>
              <p className="text-[11px] text-slate-500">
                Template: <strong className="text-slate-800 uppercase">{card.templateId}</strong> •{' '}
                {card.orientation === 'portrait' ? 'Vertical 54x85.6mm' : 'Horizontal 85.6x54mm'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleSaveToMyCards}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Save to local browser IndexedDB"
            >
              <Bookmark className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === 'hi' ? 'My Cards में सहेजें' : 'Save Card'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'hi' ? 'डाउनलोड करें (PNG/PDF)' : 'Download Card'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Split Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Live Card Stage & Previews (Sticky on desktop) */}
          <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-24">
            <CardPreview
              card={card}
              activeSide={activeSide}
              setActiveSide={setActiveSide}
              frontRef={frontRef}
              backRef={backRef}
              language={language}
            />

            {/* Quick Export CTAs directly below Preview */}
            <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div className="text-xs text-slate-600">
                <span className="font-bold text-slate-800 block">Print & Export Options</span>
                <span className="text-[11px] text-slate-400">PDF, PNG, JPG, or Direct Print</span>
              </div>
              <button
                type="button"
                onClick={() => setIsExportModalOpen(true)}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Now</span>
              </button>
            </div>
          </div>

          {/* Right Column: 22-Field Comprehensive Editor */}
          <div className="lg:col-span-7 xl:col-span-7">
            <CardForm
              card={card}
              setCard={setCard}
              language={language}
              onReset={handleResetForm}
              onLoadDemo={handleLoadDemo}
            />
          </div>
        </div>
      </main>

      {/* 8+ Templates Gallery Section */}
      <TemplatesGallery
        currentTemplateId={card.templateId}
        onSelectTemplate={handleSelectTemplate}
        language={language}
      />

      {/* How It Works Section */}
      <HowItWorks language={language} />

      {/* Privacy & Security Section */}
      <PrivacySection language={language} />

      {/* Developer Section (Suraj Maurya / SDR) */}
      <DeveloperSection language={language} />

      {/* Footer */}
      <Footer language={language} />

      {/* MODALS */}
      {/* 1. Export High-Res Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        card={card}
        frontRef={frontRef}
        backRef={backRef}
        language={language}
      />

      {/* 2. My Saved Cards Drawer */}
      <MyCardsDrawer
        isOpen={isMyCardsOpen}
        onClose={() => setIsMyCardsOpen(false)}
        currentCard={card}
        onLoadCard={(loaded) => {
          setCard(loaded);
          setBannerAlert(
            language === 'hi'
              ? `कार्ड खोला गया: ${loaded.fullName}`
              : `Loaded saved card: ${loaded.fullName}`
          );
          setTimeout(() => setBannerAlert(null), 3000);
        }}
        language={language}
      />

      {/* 3. Verification Architecture Portal */}
      <VerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        currentCard={card}
        language={language}
      />
    </div>
  );
}
