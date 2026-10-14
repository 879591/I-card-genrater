import React, { useState } from 'react';
import { CardData } from '../types/card';
import {
  exportCardAsImage,
  exportCardAsPdf,
  triggerCardPrint,
  getSafeExportFilename,
} from '../utils/export';
import confetti from 'canvas-confetti';
import {
  Download,
  Printer,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: CardData;
  frontRef: React.RefObject<HTMLDivElement | null>;
  backRef: React.RefObject<HTMLDivElement | null>;
  language: 'en' | 'hi';
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  card,
  frontRef,
  backRef,
  language,
}) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // ignore
    }
  };

  const handleDownloadImage = async (format: 'png' | 'jpeg', side: 'front' | 'back') => {
    setLoadingAction(`${side}-${format}`);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const targetElement = side === 'front' ? frontRef.current : backRef.current;
      if (!targetElement) {
        throw new Error('Card element not available for export. Please verify card preview.');
      }

      const filename = getSafeExportFilename(
        `${card.fullName || 'Employee'}-${side}`,
        format === 'jpeg' ? 'jpg' : 'png'
      );

      await exportCardAsImage(targetElement, format, filename);
      setSuccessMsg(
        language === 'hi'
          ? `${filename} सफलतापूर्वक डाउनलोड हो गया!`
          : `Downloaded ${filename} successfully!`
      );
      triggerCelebration();
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Export failed. Please check browser permissions and try again.'
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDownloadPdf = async () => {
    setLoadingAction('pdf');
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (!frontRef.current) {
        throw new Error('Front side preview element not ready.');
      }

      const filename = getSafeExportFilename(card.fullName || 'Employee', 'pdf');
      await exportCardAsPdf(frontRef.current, backRef.current, card.orientation, filename);
      setSuccessMsg(
        language === 'hi'
          ? `${filename} (ISO CR80 ID Card PDF) तैयार और डाउनलोड हो गया!`
          : `Generated high-resolution PDF: ${filename}`
      );
      triggerCelebration();
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(
        err instanceof Error ? err.message : 'PDF generation failed. Please try again.'
      );
    } finally {
      setLoadingAction(null);
    }
  };

  const handlePrint = () => {
    triggerCardPrint();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-400/30">
              <Download className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg">
                {language === 'hi' ? 'कार्ड डाउनलोड और प्रिंट करें' : 'Download & Print ID Card'}
              </h3>
              <p className="text-xs text-blue-200">
                {language === 'hi'
                  ? '300 DPI उच्च गुणवत्ता में एक्सपोर्ट करें'
                  : '300 DPI High-Resolution Ready Output'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* PDF Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-600" />
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {language === 'hi' ? 'प्रिंट-रेडी PDF (CR80 Standard)' : 'Print-Ready PDF'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Includes both Front & Back pages at standard 85.6mm × 54mm.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={loadingAction !== null}
                onClick={handleDownloadPdf}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition disabled:opacity-50"
              >
                {loadingAction === 'pdf' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* High-Res Images Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-800">
                {language === 'hi' ? 'PNG और JPG इमेज डाउनलोड' : 'PNG & JPG High-Res Images'}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Front PNG */}
              <button
                type="button"
                disabled={loadingAction !== null}
                onClick={() => handleDownloadImage('png', 'front')}
                className="p-3 bg-white hover:bg-blue-50 border border-slate-200 rounded-xl flex items-center justify-between transition disabled:opacity-50"
              >
                <span className="font-semibold text-slate-700">Front Side (PNG)</span>
                {loadingAction === 'front-png' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                ) : (
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">
                    PNG
                  </span>
                )}
              </button>

              {/* Front JPG */}
              <button
                type="button"
                disabled={loadingAction !== null}
                onClick={() => handleDownloadImage('jpeg', 'front')}
                className="p-3 bg-white hover:bg-blue-50 border border-slate-200 rounded-xl flex items-center justify-between transition disabled:opacity-50"
              >
                <span className="font-semibold text-slate-700">Front Side (JPG)</span>
                {loadingAction === 'front-jpeg' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                ) : (
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">
                    JPG
                  </span>
                )}
              </button>

              {/* Back PNG */}
              <button
                type="button"
                disabled={loadingAction !== null}
                onClick={() => handleDownloadImage('png', 'back')}
                className="p-3 bg-white hover:bg-blue-50 border border-slate-200 rounded-xl flex items-center justify-between transition disabled:opacity-50"
              >
                <span className="font-semibold text-slate-700">Back Side (PNG)</span>
                {loadingAction === 'back-png' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                ) : (
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">
                    PNG
                  </span>
                )}
              </button>

              {/* Back JPG */}
              <button
                type="button"
                disabled={loadingAction !== null}
                onClick={() => handleDownloadImage('jpeg', 'back')}
                className="p-3 bg-white hover:bg-blue-50 border border-slate-200 rounded-xl flex items-center justify-between transition disabled:opacity-50"
              >
                <span className="font-semibold text-slate-700">Back Side (JPG)</span>
                {loadingAction === 'back-jpeg' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                ) : (
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">
                    JPG
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Direct Print Option */}
          <div className="flex items-center justify-between p-4 bg-slate-100 rounded-2xl">
            <div className="flex items-center gap-2">
              <Printer className="w-5 h-5 text-slate-700" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  {language === 'hi' ? 'सीधे प्रिंटर पर भेजें' : 'Send to Printer'}
                </span>
                <span className="text-[10px] text-slate-500">
                  Opens browser system print dialog with card layout.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'प्रिंट' : 'Print'}</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>{getSafeExportFilename(card.fullName, 'pdf')}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-white font-medium"
          >
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
