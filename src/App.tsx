import React, { useState, useRef, useEffect } from 'react';
import { CardData, TemplateId } from './types/card';
import { DEFAULT_CARD, TEMPLATE_PRESETS } from './utils/demoData';
import { getAllCardsFromIDB, saveCardToIDB } from './utils/idb';
import { generateCardQRCode } from './utils/qr';
import { exportCardAsImage, exportCardAsPdf, triggerCardPrint, getSafeExportFilename } from './utils/export';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { CardPreview } from './components/CardPreview';
import { CardFront } from './components/CardTemplates/CardFront';
import { CardBack } from './components/CardTemplates/CardBack';
import { CardForm } from './components/CardForm';
import { ThreeDotMenu } from './components/ThreeDotMenu';
import { DeveloperSection } from './components/DeveloperSection';
import { Footer } from './components/Footer';
import { MyCardsDrawer } from './components/MyCardsDrawer';
import { VerificationModal } from './components/VerificationModal';
import { InfoModal } from './components/InfoModals';
import { OfflineIndicator } from './components/OfflineIndicator';
import { TEMPLATES } from './components/TemplatesGallery';
import {
  Download,
  Printer,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Sparkles,
  Layers,
  Bookmark,
  Share2,
} from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<'en' | 'hi'>('hi'); // Default Hindi friendly as requested
  const [card, setCard] = useState<CardData>(DEFAULT_CARD);
  const [activeSide, setActiveSide] = useState<'front' | 'back' | 'both'>('front');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // Modals & Drawers
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMyCardsOpen, setIsMyCardsOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<'how-it-works' | 'privacy' | null>(null);

  // Statuses
  const [savedCardsCount, setSavedCardsCount] = useState(0);
  const [downloadingAction, setDownloadingAction] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Dedicated offscreen pristine refs for html2canvas export
  const exportFrontRef = useRef<HTMLDivElement>(null);
  const exportBackRef = useRef<HTMLDivElement>(null);

  // Generate QR code whenever relevant fields change
  useEffect(() => {
    let isMounted = true;
    generateCardQRCode(card)
      .then((url) => {
        if (isMounted) setQrCodeUrl(url);
      })
      .catch((err) => {
        console.error('QR code generation error:', err);
      });
    return () => {
      isMounted = false;
    };
  }, [
    card.qrMode,
    card.qrFields,
    card.verificationId,
    card.verificationStatus,
    card.fullName,
    card.employeeId,
    card.designation,
    card.organizationName,
    card.bloodGroup,
    card.emergencyContact,
    card.websiteUrl,
  ]);

  // Refresh saved cards count
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

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }
  };

  // 1-Click Instant Download Handlers
  const handleDownloadFrontImage = async (format: 'png' | 'jpeg') => {
    if (!exportFrontRef.current) {
      showToast(language === 'hi' ? 'कार्ड तैयार नहीं है, कृपया प्रतीक्षा करें' : 'Card not ready for export', 'error');
      return;
    }
    setDownloadingAction(`front-${format}`);
    try {
      const filename = getSafeExportFilename(
        `${card.fullName || 'Employee'}-Front`,
        format === 'jpeg' ? 'jpg' : 'png'
      );
      await exportCardAsImage(exportFrontRef.current, format, filename);
      showToast(
        language === 'hi'
          ? `✓ आगे का भाग (${filename}) डाउनलोड हो गया!`
          : `✓ Front side (${filename}) downloaded successfully!`
      );
      triggerConfetti();
    } catch (err) {
      console.error(err);
      showToast(
        language === 'hi' ? 'डाउनलोड करने में त्रुटि आई। कृपया पुनः प्रयास करें।' : 'Download failed. Please try again.',
        'error'
      );
    } finally {
      setDownloadingAction(null);
    }
  };

  const handleDownloadBackImage = async (format: 'png' | 'jpeg') => {
    if (!exportBackRef.current) {
      showToast(language === 'hi' ? 'कार्ड तैयार नहीं है, कृपया प्रतीक्षा करें' : 'Card not ready for export', 'error');
      return;
    }
    setDownloadingAction(`back-${format}`);
    try {
      const filename = getSafeExportFilename(
        `${card.fullName || 'Employee'}-Back`,
        format === 'jpeg' ? 'jpg' : 'png'
      );
      await exportCardAsImage(exportBackRef.current, format, filename);
      showToast(
        language === 'hi'
          ? `✓ पीछे का भाग (${filename}) डाउनलोड हो गया!`
          : `✓ Back side (${filename}) downloaded successfully!`
      );
      triggerConfetti();
    } catch (err) {
      console.error(err);
      showToast(
        language === 'hi' ? 'डाउनलोड करने में त्रुटि आई। कृपया पुनः प्रयास करें।' : 'Download failed. Please try again.',
        'error'
      );
    } finally {
      setDownloadingAction(null);
    }
  };

  const handleDownloadPdf = async () => {
    if (!exportFrontRef.current || !exportBackRef.current) {
      showToast(language === 'hi' ? 'कार्ड रेंडर नहीं हो सका' : 'Card elements not ready', 'error');
      return;
    }
    setDownloadingAction('pdf');
    try {
      const filename = getSafeExportFilename(card.fullName || 'Employee', 'pdf');
      await exportCardAsPdf(
        exportFrontRef.current,
        exportBackRef.current,
        card.orientation,
        filename
      );
      showToast(
        language === 'hi'
          ? `✓ प्रिंट-रेडी PDF (${filename}) डाउनलोड हो गया!`
          : `✓ Print-ready PDF (${filename}) downloaded successfully!`
      );
      triggerConfetti();
    } catch (err) {
      console.error(err);
      showToast(
        language === 'hi' ? 'PDF डाउनलोड नहीं हो सका, पुनः प्रयास करें।' : 'PDF generation failed.',
        'error'
      );
    } finally {
      setDownloadingAction(null);
    }
  };

  const handlePrint = () => {
    triggerCardPrint();
  };

  const handleSaveToMyCards = async () => {
    try {
      await saveCardToIDB(card);
      await updateSavedCount();
      showToast(
        language === 'hi'
          ? 'कार्ड My Cards में सुरक्षित सहेज लिया गया!'
          : 'Card saved to My Cards successfully!'
      );
      triggerConfetti();
    } catch (err) {
      console.error(err);
      showToast('Could not save card to local database', 'error');
    }
  };

  const handleSelectTemplate = (templateId: TemplateId, preset: Partial<CardData>) => {
    setCard((prev) => ({
      ...prev,
      ...preset,
      templateId,
      updatedAt: Date.now(),
    }));
    showToast(
      language === 'hi'
        ? `टेम्पलेट लागू हुआ: ${templateId.toUpperCase()}`
        : `Applied Template: ${templateId.toUpperCase()}`
    );
  };

  const handleResetForm = () => {
    if (
      window.confirm(
        language === 'hi'
          ? 'क्या आप सभी जानकारी साफ़ करके नया कार्ड बनाना चाहते हैं?'
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
      showToast(language === 'hi' ? 'फॉर्म रीसेट कर दिया गया।' : 'Form reset successfully.');
    }
  };

  const handleLoadDemo = () => {
    setCard({
      ...DEFAULT_CARD,
      id: `demo-${Date.now()}`,
      updatedAt: Date.now(),
    });
    showToast(language === 'hi' ? 'डेमो कर्मचारी डेटा लोड हो गया!' : 'Loaded sample demo employee data!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Offline Toast */}
      <OfflineIndicator language={language} />

      {/* Header Navbar with Three-Dot Menu */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenMyCards={() => setIsMyCardsOpen(true)}
        savedCardsCount={savedCardsCount}
      />

      {/* Floating Status Toast */}
      {toastMessage && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold border animate-in fade-in slide-in-from-top-4 ${
            toastType === 'success'
              ? 'bg-slate-900 text-white border-emerald-500/50'
              : 'bg-rose-900 text-white border-rose-400'
          }`}
        >
          {toastType === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* COMPACT HERO BAR (No long scrolling!) */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-3 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-400 text-slate-950 font-black text-xs">
              5★
            </span>
            <span className="font-bold">
              {language === 'hi'
                ? 'मिनटों में बनाएँ प्रोफेशनल Employee ID Card'
                : 'Create Professional Employee ID Cards in Minutes'}
            </span>
            <span className="hidden md:inline text-blue-200">
              • {language === 'hi' ? 'मुफ्त, आसान और मोबाइल-फ्रेंडली' : '100% Free & Mobile-Friendly'}
            </span>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'hi' ? '8+ टेम्पलेट्स' : '8+ Templates'}</span>
            </button>
            <button
              type="button"
              onClick={handleSaveToMyCards}
              className="px-2.5 py-1 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'सहेजें' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Template Strip (Horizontal Scrollable for 1-Click switching) */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            {language === 'hi' ? 'टेम्पलेट चुनें:' : 'Templates:'}
          </span>
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => handleSelectTemplate(tmpl.id, TEMPLATE_PRESETS[tmpl.id])}
              className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition flex items-center gap-1.5 cursor-pointer border ${
                card.templateId === tmpl.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              <span
                style={{ backgroundColor: tmpl.defaultThemeColor }}
                className="w-2.5 h-2.5 rounded-full border border-white"
              />
              <span>{language === 'hi' ? tmpl.hindiName : tmpl.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN WORKSPACE (Studio Stage + Form) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: LIVE CARD STAGE + DIRECT DOWNLOAD BUTTONS */}
          <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-20 space-y-4">
            <CardPreview
              card={card}
              activeSide={activeSide}
              setActiveSide={setActiveSide}
              qrCodeUrl={qrCodeUrl}
              language={language}
            />

            {/* DIRECT 1-CLICK INSTANT DOWNLOAD PANEL */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-600" />
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {language === 'hi' ? 'कार्ड डाउनलोड करें (1-क्लिक)' : 'Direct Instant Downloads'}
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  300 DPI Ready
                </span>
              </div>

              {/* Instant Action Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* 1. Download Front PNG */}
                <button
                  type="button"
                  disabled={downloadingAction !== null}
                  onClick={() => handleDownloadFrontImage('png')}
                  className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl font-bold border border-blue-200 flex items-center justify-between transition cursor-pointer disabled:opacity-50"
                  title="Download Front side as PNG"
                >
                  <div className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>{language === 'hi' ? 'आगे का भाग' : 'Front PNG'}</span>
                  </div>
                  {downloadingAction === 'front-png' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span className="text-[9px] bg-white px-1.5 py-0.5 rounded text-blue-700 font-mono">
                      PNG
                    </span>
                  )}
                </button>

                {/* 2. Download Back PNG */}
                <button
                  type="button"
                  disabled={downloadingAction !== null}
                  onClick={() => handleDownloadBackImage('png')}
                  className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl font-bold border border-blue-200 flex items-center justify-between transition cursor-pointer disabled:opacity-50"
                  title="Download Back side as PNG"
                >
                  <div className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>{language === 'hi' ? 'पीछे का भाग' : 'Back PNG'}</span>
                  </div>
                  {downloadingAction === 'back-png' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span className="text-[9px] bg-white px-1.5 py-0.5 rounded text-blue-700 font-mono">
                      PNG
                    </span>
                  )}
                </button>

                {/* 3. Download Full Dual-Sided PDF */}
                <button
                  type="button"
                  disabled={downloadingAction !== null}
                  onClick={handleDownloadPdf}
                  className="col-span-2 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black shadow-md flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                  title="Download Front and Back in high-resolution PDF"
                >
                  {downloadingAction === 'pdf' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4 text-amber-300" />
                  )}
                  <span>
                    {language === 'hi'
                      ? 'पूरा ID Card (Front + Back) PDF डाउनलोड करें'
                      : 'Download Full Card (Front + Back) PDF'}
                  </span>
                </button>

                {/* 4. JPG Export */}
                <button
                  type="button"
                  disabled={downloadingAction !== null}
                  onClick={() => handleDownloadFrontImage('jpeg')}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50 text-[11px]"
                >
                  <Download className="w-3 h-3" />
                  <span>JPG (Front)</span>
                </button>

                {/* 5. Print Card */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer text-[11px]"
                >
                  <Printer className="w-3 h-3" />
                  <span>{language === 'hi' ? 'प्रिंट करें' : 'Print Card'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: COMPREHENSIVE 22-FIELD FORM */}
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

      {/* DEVELOPER SECTION AT BOTTOM ("jyda nichhe sirf mera rahe") */}
      <DeveloperSection language={language} />

      {/* COMPACT FOOTER */}
      <Footer language={language} />

      {/* THREE-DOT (⋮) SLIDE-OUT MENU DRAWER */}
      <ThreeDotMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        language={language}
        setLanguage={setLanguage}
        currentTemplateId={card.templateId}
        onSelectTemplate={handleSelectTemplate}
        onOpenMyCards={() => setIsMyCardsOpen(true)}
        onOpenVerification={() => setIsVerificationOpen(true)}
        onOpenHowItWorks={() => setInfoModalType('how-it-works')}
        onOpenPrivacy={() => setInfoModalType('privacy')}
        onOpenDeveloper={() => {
          const dev = document.getElementById('developer-section');
          dev?.scrollIntoView({ behavior: 'smooth' });
        }}
        savedCardsCount={savedCardsCount}
      />

      {/* MY SAVED CARDS MODAL (INDEXEDDB) */}
      <MyCardsDrawer
        isOpen={isMyCardsOpen}
        onClose={() => setIsMyCardsOpen(false)}
        currentCard={card}
        onLoadCard={(loaded) => {
          setCard(loaded);
          showToast(
            language === 'hi'
              ? `कार्ड लोड किया गया: ${loaded.fullName}`
              : `Loaded saved card: ${loaded.fullName}`
          );
        }}
        language={language}
      />

      {/* VERIFICATION MODAL */}
      <VerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        currentCard={card}
        language={language}
      />

      {/* HOW IT WORKS / PRIVACY MODAL */}
      <InfoModal
        isOpen={infoModalType !== null}
        onClose={() => setInfoModalType(null)}
        type={infoModalType || 'how-it-works'}
        language={language}
      />

      {/* OFF-SCREEN PRISTINE CAPTURE ELEMENTS (ZERO 3D TRANSFORMS, 100% RELIABLE HTML2CANVAS CAPTURE) */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-99999px',
          top: '0',
          zIndex: -100,
          pointerEvents: 'none',
          opacity: 1,
          display: 'flex',
          gap: '20px',
        }}
      >
        <div ref={exportFrontRef}>
          <CardFront card={card} qrCodeUrl={qrCodeUrl} />
        </div>
        <div ref={exportBackRef}>
          <CardBack card={card} qrCodeUrl={qrCodeUrl} />
        </div>
      </div>
    </div>
  );
}
