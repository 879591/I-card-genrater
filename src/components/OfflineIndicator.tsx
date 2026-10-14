import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, Wifi } from 'lucide-react';

interface OfflineIndicatorProps {
  language: 'en' | 'hi';
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ language }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <aside aria-label="Offline status" className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-2xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xl border border-amber-400">
      <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
      <WifiOff className="w-3.5 h-3.5" />
      <span>
        {language === 'hi'
          ? 'ऑफलाइन मोड सक्रिय — लोकल स्टोरेज चालू'
          : 'Offline Mode Active — Running locally'}
      </span>
    </aside>
  );
};
