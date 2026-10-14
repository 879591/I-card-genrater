import React, { useState, useEffect } from 'react';
import { CardData } from '../types/card';
import { CardFront } from './CardTemplates/CardFront';
import { CardBack } from './CardTemplates/CardBack';
import { RotateCw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface CardPreviewProps {
  card: CardData;
  activeSide: 'front' | 'back' | 'both';
  setActiveSide: (side: 'front' | 'back' | 'both') => void;
  qrCodeUrl: string;
  language: 'en' | 'hi';
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  card,
  activeSide,
  setActiveSide,
  qrCodeUrl,
  language,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  useEffect(() => {
    if (activeSide === 'front') setIsFlipped(false);
    if (activeSide === 'back') setIsFlipped(true);
  }, [activeSide]);

  const handleFlipToggle = () => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);
    setActiveSide(nextFlipped ? 'back' : 'front');
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Controls Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        {/* Side switcher pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setActiveSide('front');
              setIsFlipped(false);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSide === 'front'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'आगे (Front)' : 'Front'}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveSide('back');
              setIsFlipped(true);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSide === 'back'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'पीछे (Back)' : 'Back'}
          </button>
          <button
            type="button"
            onClick={() => setActiveSide('both')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition hidden sm:inline-block cursor-pointer ${
              activeSide === 'both'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'दोनों (Both)' : 'Both'}
          </button>
        </div>

        {/* 3D Flip & Zoom */}
        <div className="flex items-center gap-1.5">
          {activeSide !== 'both' && (
            <button
              type="button"
              onClick={handleFlipToggle}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition cursor-pointer"
              title="Flip Card 3D"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'पलटें' : 'Flip'}</span>
            </button>
          )}

          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setZoomScale((s) => Math.max(0.7, +(s - 0.1).toFixed(1)))}
              className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-white cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono font-bold px-1.5 text-slate-500">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomScale((s) => Math.min(1.3, +(s + 0.1).toFixed(1)))}
              className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-white cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomScale(1)}
              className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-white cursor-pointer"
              title="Reset Zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Display Stage */}
      <div className="w-full flex items-center justify-center min-h-[460px] sm:min-h-[520px] bg-gradient-to-b from-slate-100/90 to-slate-200/60 rounded-3xl p-3 sm:p-6 border border-slate-200 shadow-inner overflow-hidden relative">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        />

        {/* Scaled Preview */}
        <div
          style={{
            transform: `scale(${zoomScale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.15s ease-out',
          }}
          className="relative z-10"
        >
          {activeSide === 'both' ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div>
                <CardFront card={card} qrCodeUrl={qrCodeUrl} />
              </div>
              <div>
                <CardBack card={card} qrCodeUrl={qrCodeUrl} />
              </div>
            </div>
          ) : (
            <div className="perspective-1000">
              <div
                className={`transition-transform duration-500 transform-style-3d ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                <div style={{ backfaceVisibility: 'hidden' }}>
                  <CardFront card={card} qrCodeUrl={qrCodeUrl} />
                </div>
                <div
                  className="absolute top-0 left-0 w-full h-full rotate-y-180"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <CardBack card={card} qrCodeUrl={qrCodeUrl} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Standard dimensions badge */}
      <div className="mt-2 text-center text-[11px] text-slate-500 font-medium">
        <span>
          CR80 Standards: {card.orientation === 'portrait' ? '54 × 85.6 mm' : '85.6 × 54 mm'} •
          300 DPI High Resolution
        </span>
      </div>
    </div>
  );
};
