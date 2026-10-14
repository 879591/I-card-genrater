import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Check } from 'lucide-react';

interface PWAInstallButtonProps {
  language: 'en' | 'hi';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ language }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);

  // If already running inside standalone PWA window, don't show install button
  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
        <Check className="w-3.5 h-3.5" />
        <span>{language === 'hi' ? 'ऐप इंस्टॉल है' : 'PWA Installed'}</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow (supports beforeinstallprompt)
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{language === 'hi' ? 'ऐप इंस्टॉल करें' : 'Install App'}</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-600" />
          <span>{language === 'hi' ? 'iPhone पर इंस्टॉल करें' : 'Install on iOS'}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'hi' ? 'iPhone / iPad पर इंस्टॉल कैसे करें' : 'Install on iPhone / iPad'}
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
                <p>
                  1. Safari ब्राउज़र में नीचे दिए गए <strong>Share (शेयर)</strong> बटन पर टैप करें।
                </p>
                <p>
                  2. नीचे स्क्रॉल करके <strong>Add to Home Screen (होम स्क्रीन पर जोड़ें)</strong> चुनें।
                </p>
                <p>
                  3. ऊपर दाएँ कोने में <strong>Add</strong> पर टैप करें। अब 5tar Card Maker बिना इंटरनेट के भी ऐप की तरह काम करेगा!
                </p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
              >
                {language === 'hi' ? 'समझ गया (Got it)' : 'Understood'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for Android Chrome when prompt event hasn't fired or manual add
  return (
    <>
      <button
        onClick={() => setShowAndroidGuide(true)}
        className="flex items-center gap-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-700 border border-blue-200 px-3 py-1.5 text-xs font-bold transition"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span>{language === 'hi' ? 'ऐप इंस्टॉल करें' : 'Install App'}</span>
      </button>

      {showAndroidGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900">
                {language === 'hi' ? 'Android / PC पर इंस्टॉल कैसे करें' : 'Install App Guide'}
              </h3>
              <button
                onClick={() => setShowAndroidGuide(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
              <p>
                1. ब्राउज़र के शीर्ष दाएँ कोने में <strong>तीन बिंदु (⋮)</strong> मेनू पर टैप करें।
              </p>
              <p>
                2. <strong>Install app (ऐप इंस्टॉल करें)</strong> या <strong>Add to Home screen</strong> पर टैप करें।
              </p>
              <p>
                3. यह ऐप आपके मोबाइल पर बिना किसी ऐप स्टोर के एक असली ऐप की तरह इंस्टॉल हो जाएगा और ऑफलाइन काम करेगा।
              </p>
            </div>
            <button
              onClick={() => setShowAndroidGuide(false)}
              className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition"
            >
              {language === 'hi' ? 'ठीक है (Close)' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
