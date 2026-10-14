import React from 'react';
import { X, Download, Share2, Check, Smartphone, Image as ImageIcon } from 'lucide-react';

interface ImageDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  filename: string;
  language: 'en' | 'hi';
}

export const ImageDownloadModal: React.FC<ImageDownloadModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  filename,
  language,
}) => {
  if (!isOpen || !imageUrl) return null;

  const handleShare = async () => {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const file = new File([blob], filename, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Employee ID Card',
          text: '5tar Employee ID Card',
        });
      } else {
        // Fallback: open in new tab
        window.open(imageUrl, '_blank');
      }
    } catch (err) {
      console.warn('Share error:', err);
    }
  };

  const handleDirectDownload = () => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col items-center p-5 text-center">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
          <Check className="w-6 h-6 stroke-[3]" />
        </div>

        <h3 className="font-extrabold text-base text-slate-900">
          {language === 'hi' ? 'कार्ड तैयार है!' : 'Card Ready!'}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {filename}
        </p>

        {/* Card Image Display */}
        <div className="my-4 max-h-[360px] overflow-hidden rounded-2xl border-2 border-slate-200 shadow-lg bg-slate-50 p-1">
          <img
            src={imageUrl}
            alt="Generated Card"
            className="w-auto h-auto max-h-[340px] rounded-xl object-contain mx-auto"
          />
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2">
          <button
            type="button"
            onClick={handleDirectDownload}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{language === 'hi' ? 'गैलरी में सहेजें (Download Image)' : 'Save to Gallery / Download'}</span>
          </button>

          {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
            <button
              type="button"
              onClick={handleShare}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-emerald-600" />
              <span>{language === 'hi' ? 'WhatsApp या फाइल्स पर शेयर करें' : 'Share Image'}</span>
            </button>
          )}
        </div>

        {/* Mobile Instructions Tip */}
        <div className="mt-4 p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-snug flex items-start gap-2 text-left">
          <Smartphone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            {language === 'hi'
              ? 'मोबाइल टिप: अगर डाउनलोड अपने आप शुरू न हो, तो ऊपर दिख रहे कार्ड फोटो पर 2 सेकंड तक दबाकर रखें (Long Press) और "Download image" या "Save to Photos" चुनें।'
              : 'Mobile Tip: You can also tap and hold (long press) on the card image above and tap "Download image" to save directly into your phone gallery!'}
          </p>
        </div>
      </div>
    </div>
  );
};
