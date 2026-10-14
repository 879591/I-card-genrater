import React, { useState, useRef, useEffect } from 'react';
import { CardData, TemplateId } from './types/card';
import { DEFAULT_CARD, TEMPLATE_PRESETS } from './utils/demoData';
import { getAllCardsFromIDB, saveCardToIDB } from './utils/idb';
import { generateCardQRCode } from './utils/qr';
import { getSafeExportFilename, triggerCardPrint } from './utils/export';
import {
  drawCardFrontToCanvas,
  drawCardBackToCanvas,
  downloadCanvasAsFile,
  generateDualSidedCardPdf,
} from './utils/nativeCanvasExport';
import { auth, saveCardToFirestore, User } from './lib/firebase';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { CardPreview } from './components/CardPreview';
import { CardForm } from './components/CardForm';
import { ThreeDotMenu } from './components/ThreeDotMenu';
import { DeveloperSection } from './components/DeveloperSection';
import { Footer } from './components/Footer';
import { MyCardsDrawer } from './components/MyCardsDrawer';
import { VerificationModal } from './components/VerificationModal';
import { InfoModal } from './components/InfoModals';
import { ImageDownloadModal } from './components/ImageDownloadModal';
import { GeminiChatbot } from './components/GeminiChatbot';
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
  Bot,
  Cloud,
} from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<'en' | 'hi'>('hi');
  const [card, setCard] = useState<CardData>(DEFAULT_CARD);
  const [activeSide, setActiveSide] = useState<'front' | 'back' | 'both'>('front');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Modals & Drawers
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMyCardsOpen, setIsMyCardsOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<'how-it-works' | 'privacy' | null>(null);

  // Gallery preview modal for mobile devices
  const [previewModalImg, setPreviewModalImg] = useState<string | null>(null);
  const [previewModalFilename, setPreviewModalFilename] = useState<string>('');

  // Statuses
  const [savedCardsCount, setSavedCardsCount] = useState(0);
  const [downloadingAction, setDownloadingAction] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

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
  }, [isMyCardsOpen, currentUser]);

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

  // 1-Click Native Instant Download Handlers (100% Reliable!)
  const handleDownloadFrontImage = async (format: 'png' | 'jpeg') => {
    setDownloadingAction(`front-${format}`);
    try {
      const canvas = await drawCardFrontToCanvas(card, qrCodeUrl);
      const filename = getSafeExportFilename(
        `${card.fullName || 'Employee'}-Front`,
        format === 'jpeg' ? 'jpg' : 'png'
      );

      // Trigger instant download
      await downloadCanvasAsFile(canvas, filename, format);

      // Also open modal so mobile user can view & save to gallery/photos directly
      const dataUrl = canvas.toDataURL(format === 'jpeg' ? 'image/jpeg' : 'image/png');
      setPreviewModalImg(dataUrl);
      setPreviewModalFilename(filename);

      showToast(
        language === 'hi'
          ? `✓ आगे का भाग (${filename}) तैयार व डाउनलोड हो गया!`
          : `✓ Front side (${filename}) downloaded successfully!`
      );
      triggerConfetti();
    } catch (err) {
      console.error('Download Front Image Error:', err);
      showToast(
        language === 'hi'
          ? 'डाउनलोड में समस्या आई, कृपया दोबारा क्लिक करें।'
          : 'Download failed. Please try again.',
        'error'
      );
    } finally {
      setDownloadingAction(null);
    }
  };

  const handleDownloadBackImage = async (format: 'png' | 'jpeg') => {
    setDownloadingAction(`back-${format}`);
    try {
      const canvas = await drawCardBackToCanvas(card, qrCodeUrl);
      const filename = getSafeExportFilename(
        `${card.fullName || 'Employee'}-Back`,
        format === 'jpeg' ? 'jpg' : 'png'
      );

      // Trigger instant download
      await downloadCanvasAsFile(canvas, filename, format);

      // Also open modal so mobile user can view & save to gallery/photos directly
      const dataUrl = canvas.toDataURL(format === 'jpeg' ? 'image/jpeg' : 'image/png');
      setPreviewModalImg(dataUrl);
      setPreviewModalFilename(filename);

      showToast(
        language === 'hi'
          ? `✓ पीछे का भाग (${filename}) तैयार व डाउनलोड हो गया!`
          : `✓ Back side (${filename}) downloaded successfully!`
      );
      triggerConfetti();
    } catch (err) {
      console.error('Download Back Image Error:', err);
      showToast(
        language === 'hi'
          ? 'डाउनलोड में समस्या आई, कृपया दोबारा क्लिक करें।'
          : 'Download failed. Please try again.',
        'error'
      );
    } finally {
      setDownloadingAction(null);
    }
  };

  const handleDownloadPdf = async () => {
    setDownloadingAction('pdf');
    try {
      const [frontCanvas, backCanvas] = await Promise.all([
        drawCardFrontToCanvas(card, qrCodeUrl),
        drawCardBackToCanvas(card, qrCodeUrl),
      ]);

      const filename = getSafeExportFilename(card.fullName || 'Employee', 'pdf');
      await generateDualSidedCardPdf(frontCanvas, backCanvas, card.orientation, filename);

      showToast(
        language === 'hi'
          ? `✓ पूरा ID Card (${filename}) PDF में डाउनलोड हो गया!`
          : `✓ Dual-sided PDF (${filename}) downloaded successfully!`
      );
      triggerConfetti();
    } catch (err) {
      console.error('Download PDF Error:', err);
      showToast(
        language === 'hi'
          ? 'PDF डाउनलोड नहीं हो सका, कृपया पुनः प्रयास करें।'
          : 'PDF download failed. Please try again.',
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
      if (currentUser?.uid) {
        await saveCardToFirestore(currentUser.uid, card);
      }
      await updateSavedCount();
      showToast(
        currentUser
          ? language === 'hi'
            ? 'कार्ड IndexedDB और Cloud Firestore में सहेजा गया!'
            : 'Card saved to IndexedDB & Cloud Firestore!'
          : language === 'hi'
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
        onOpenChatbot={() => setIsChatbotOpen(true)}
        onAuthChange={setCurrentUser}
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

      {/* COMPACT HERO BAR */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-3 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-400 text-slate-950 font-black text-xs">
              5★
            </span>
            <span className="font-bold">
              {language === 'hi'
                ? 'मिनटों में बनाएँ और डाउनलोड करें Professional Employee ID Card'
                : 'Create & Download Professional Employee ID Cards in Minutes'}
            </span>
            {currentUser && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                <Cloud className="w-3 h-3" />
                Firestore Synced
              </span>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsChatbotOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition hover:brightness-110 cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'hi' ? 'एआई सहायक' : 'AI Assistant'}</span>
            </button>
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
                    {language === 'hi' ? 'सीधे गैलरी / फोन में डाउनलोड करें' : 'Direct Gallery & File Downloads'}
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  300 DPI Clear
                </span>
              </div>

              {/* Instant Action Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* 1. Download Front PNG */}
                <button
                  type="button"
                  disabled={downloadingAction !== null}
                  onClick={() => handleDownloadFrontImage('png')}
                  className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-2xl font-bold border border-blue-200 flex items-center justify-between transition cursor-pointer disabled:opacity-50 shadow-xs"
                  title="Download Front side as PNG to gallery"
                >
                  <div className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <span>{language === 'hi' ? 'आगे का भाग (PNG)' : 'Front (PNG)'}</span>
                  </div>
                  {downloadingAction === 'front-png' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
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
                  className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-2xl font-bold border border-blue-200 flex items-center justify-between transition cursor-pointer disabled:opacity-50 shadow-xs"
                  title="Download Back side as PNG to gallery"
                >
                  <div className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <span>{language === 'hi' ? 'पीछे का भाग (PNG)' : 'Back (PNG)'}</span>
                  </div>
                  {downloadingAction === 'back-png' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
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
                  className="col-span-2 p-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-2xl font-extrabold shadow-md flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 text-xs sm:text-sm"
                  title="Download Front and Back in high-resolution PDF"
                >
                  {downloadingAction === 'pdf' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
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

      {/* FLOATING AI ASSISTANT CHAT TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl shadow-xl shadow-purple-500/30 flex items-center gap-2 font-bold text-xs transition hover:scale-105 cursor-pointer"
        title="Open 5tar Gemini AI Assistant"
      >
        <Bot className="w-5 h-5 text-amber-300" />
        <span className="hidden sm:inline">
          {language === 'hi' ? 'एआई सहायक (Gemini)' : 'AI Assistant'}
        </span>
      </button>

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
        onOpenChatbot={() => setIsChatbotOpen(true)}
        savedCardsCount={savedCardsCount}
      />

      {/* MY SAVED CARDS MODAL (INDEXEDDB + CLOUD FIRESTORE) */}
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

      {/* IMAGE DOWNLOAD & MOBILE GALLERY SAVE MODAL */}
      <ImageDownloadModal
        isOpen={previewModalImg !== null}
        onClose={() => setPreviewModalImg(null)}
        imageUrl={previewModalImg}
        filename={previewModalFilename}
        language={language}
      />

      {/* GEMINI CHATBOT WITH GOOGLE SEARCH GROUNDING */}
      <GeminiChatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        language={language}
      />
    </div>
  );
}
