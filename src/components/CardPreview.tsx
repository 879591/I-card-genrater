import React, { useState, useEffect } from 'react';
import { CardData } from '../types/card';
import { CardFront } from './CardTemplates/CardFront';
import { CardBack } from './CardTemplates/CardBack';
import { generateCardQRCode } from '../utils/qr';
import { RotateCw, Eye, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface CardPreviewProps {
  card: CardData;
  activeSide: 'front' | 'back' | 'both';
  setActiveSide: (side: 'front' | 'back' | 'both') => void;
  frontRef: React.RefObject<HTMLDivElement | null>;
  backRef: React.RefObject<HTMLDivElement | null>;
  language: 'en' | 'hi';
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  card,
  activeSide,
  setActiveSide,
  frontRef,
  backRef,
  language,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  // Sync flip state with activeSide if changed externally
  useEffect(() => {
    if (activeSide === 'front') setIsFlipped(false);
    if (activeSide === 'back') setIsFlipped(true);
  }, [activeSide]);

  // Generate QR whenever relevant fields change
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

  const handleFlipToggle = () => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    setActiveSide(nextFlipped ? 'back' : 'front');
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Controls Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-4 bg-white/80 backdrop-blur p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Side switcher pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => {
              setActiveSide('front');
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSide === 'front'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'आगे का भाग (Front)' : 'Front Side'}
          </button>
          <button
            onClick={() => {
              setActiveSide('back');
              setIsFlipped(true);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSide === 'back'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'पीछे का भाग (Back)' : 'Back Side'}
          </button>
          <button
            onClick={() => setActiveSide('both')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition hidden sm:inline-block ${
              activeSide === 'both'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'दोनों साथ (Both)' : 'Both Sides'}
          </button>
        </div>

        {/* 3D Flip & Zoom */}
        <div className="flex items-center gap-1.5">
          {activeSide !== 'both' && (
            <button
              onClick={handleFlipToggle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition"
              title="Flip Card 3D"
            >
              <RotateCw className="w-3.5 h-3.5 animate-spin-hover" />
              <span>{language === 'hi' ? 'पलटें' : 'Flip'}</span>
            </button>
          )}

          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => setZoomScale((s) => Math.max(0.7, +(s - 0.1).toFixed(1)))}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-medium px-1.5 text-slate-500">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              onClick={() => setZoomScale((s) => Math.min(1.4, +(s + 0.1).toFixed(1)))}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomScale(1)}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-white"
              title="Reset Zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Display Stage */}
      <div className="w-full flex items-center justify-center min-h-[540px] bg-gradient-to-b from-slate-100/70 to-slate-200/50 rounded-3xl p-4 sm:p-8 border border-slate-200/80 shadow-inner overflow-hidden relative">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        />

        {/* Live Card Scaler */}
        <div
          style={{
            transform: `scale(${zoomScale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className="relative z-10"
        >
          {activeSide === 'both' ? (
            /* Side-by-side view */
            <div
              id="printable-card-area"
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <div ref={frontRef}>
                <CardFront card={card} qrCodeUrl={qrCodeUrl} />
              </div>
              <div ref={backRef}>
                <CardBack card={card} qrCodeUrl={qrCodeUrl} />
              </div>
            </div>
          ) : (
            /* 3D Flip Card View */
            <div className="perspective-1000">
              <div
                className={`transition-transform duration-500 transform-style-3d ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* Front Side */}
                <div
                  ref={frontRef}
                  className={isFlipped ? 'pointer-events-none' : ''}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <CardFront card={card} qrCodeUrl={qrCodeUrl} />
                </div>

                {/* Back Side */}
                <div
                  ref={backRef}
                  className={`absolute top-0 left-0 w-full h-full rotate-y-180 ${
                    !isFlipped ? 'pointer-events-none' : ''
                  }`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <CardBack card={card} qrCodeUrl={qrCodeUrl} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden container for single side rendering during high-res PDF generation */}
      <div className="sr-only">
        {activeSide !== 'both' && (
          <div ref={isFlipped ? frontRef : backRef}>
            {isFlipped ? (
              <CardFront card={card} qrCodeUrl={qrCodeUrl} />
            ) : (
              <CardBack card={card} qrCodeUrl={qrCodeUrl} />
            )}
          </div>
        )}
      </div>

      {/* Dimensions specification pill */}
      <div className="mt-3 text-center text-xs text-slate-500 font-medium">
        <span>
          Standard ISO CR80 Dimensions:{' '}
          <strong className="text-slate-700">
            {card.orientation === 'portrait' ? '54mm × 85.6mm' : '85.6mm × 54mm'}
          </strong>{' '}
          (3.375" × 2.125") • 300 DPI High-Resolution Ready
        </span>
      </div>
    </div>
  );
};
