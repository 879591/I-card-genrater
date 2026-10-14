import React, { useEffect, useState } from 'react';
import { CardData } from '../types/card';
import {
  getAllCardsFromIDB,
  saveCardToIDB,
  deleteCardFromIDB,
  clearAllCardsFromIDB,
} from '../utils/idb';
import {
  auth,
  saveCardToFirestore,
  getCardsFromFirestore,
  deleteCardFromFirestore,
} from '../lib/firebase';
import {
  FolderArchive,
  Trash2,
  Copy,
  FolderOpen,
  X,
  AlertCircle,
  Plus,
  Cloud,
  CheckCircle,
} from 'lucide-react';

interface MyCardsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentCard: CardData;
  onLoadCard: (card: CardData) => void;
  language: 'en' | 'hi';
}

export const MyCardsDrawer: React.FC<MyCardsDrawerProps> = ({
  isOpen,
  onClose,
  currentCard,
  onLoadCard,
  language,
}) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [confirmClear, setConfirmClear] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  const currentUser = auth.currentUser;

  const refreshList = async () => {
    // 1. Fetch from local IndexedDB
    let localCards = await getAllCardsFromIDB();

    // 2. If user is logged in with Firebase, sync with Firestore!
    if (currentUser?.uid) {
      setIsCloudSyncing(true);
      try {
        const cloudCards = await getCardsFromFirestore(currentUser.uid);
        // Merge cloud cards into local IndexedDB
        for (const cc of cloudCards) {
          await saveCardToIDB(cc);
        }
        localCards = await getAllCardsFromIDB();
      } catch (err) {
        console.warn('Cloud sync error:', err);
      } finally {
        setIsCloudSyncing(false);
      }
    }

    setCards(localCards);
  };

  useEffect(() => {
    if (isOpen) {
      refreshList();
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSaveCurrent = async () => {
    // Save to local IndexedDB
    await saveCardToIDB(currentCard);

    // If signed in, also sync to Firestore
    if (currentUser?.uid) {
      try {
        await saveCardToFirestore(currentUser.uid, currentCard);
      } catch (err) {
        console.warn('Firestore save error:', err);
      }
    }

    await refreshList();
    setMessage(
      currentUser
        ? language === 'hi'
          ? 'कार्ड IndexedDB और Cloud Firestore दोनों में सहेज लिया गया!'
          : 'Card saved to IndexedDB and Cloud Firestore!'
        : language === 'hi'
        ? 'वर्तमान कार्ड आपके ब्राउज़र में सुरक्षित सहेज लिया गया!'
        : 'Current card saved securely in browser storage!'
    );
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDuplicate = async (cardToDup: CardData) => {
    const duplicated: CardData = {
      ...cardToDup,
      id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      fullName: `${cardToDup.fullName} (Copy)`,
      employeeId: `${cardToDup.employeeId}-COPY`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await saveCardToIDB(duplicated);

    if (currentUser?.uid) {
      try {
        await saveCardToFirestore(currentUser.uid, duplicated);
      } catch (err) {
        console.warn(err);
      }
    }

    await refreshList();
    setMessage(language === 'hi' ? 'कार्ड की प्रतिलिपि बना ली गई!' : 'Card duplicated successfully!');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id: string) => {
    await deleteCardFromIDB(id);
    if (currentUser?.uid) {
      try {
        await deleteCardFromFirestore(currentUser.uid, id);
      } catch (err) {
        console.warn(err);
      }
    }
    await refreshList();
  };

  const handleClearAll = async () => {
    await clearAllCardsFromIDB();
    await refreshList();
    setConfirmClear(false);
    setMessage(
      language === 'hi'
        ? 'सभी स्थानीय कार्ड हटा दिए गए।'
        : 'All locally stored cards have been cleared.'
    );
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-400/30">
              <FolderArchive className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">
                  {language === 'hi' ? 'सहेजे गए कार्ड (My Cards)' : 'My Saved Cards'}
                </h3>
                {currentUser && (
                  <span className="flex items-center gap-1 text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30 font-bold">
                    <Cloud className="w-3 h-3" />
                    Cloud Active
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-200">
                {currentUser
                  ? `Google User: ${currentUser.email} • Cloud Firestore + IndexedDB`
                  : language === 'hi'
                  ? 'लोकल ब्राउज़र IndexedDB (Google लॉगिन करके क्लाउड पर भी सहेजें)'
                  : 'Local IndexedDB (Sign in with Google for Cloud Sync)'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSaveCurrent}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'hi' ? 'वर्तमान कार्ड सहेजें' : 'Save Current Card'}</span>
          </button>

          {cards.length > 0 && (
            <div>
              {confirmClear ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-rose-600 font-semibold">Delete all?</span>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="px-2.5 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Yes, Clear All
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="px-2.5 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="px-3 py-1.5 text-xs text-rose-600 hover:text-rose-800 font-medium hover:bg-rose-50 rounded-lg transition cursor-pointer"
                >
                  {language === 'hi' ? 'सभी कार्ड साफ़ करें' : 'Clear All'}
                </button>
              )}
            </div>
          )}
        </div>

        {message && (
          <div className="m-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Cards List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
          {cards.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <FolderArchive className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-slate-700">No saved cards yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Click "Save Current Card" above to save your employee ID template to your browser's
                offline storage.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cards.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-400 bg-white shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div
                      style={{ backgroundColor: c.themeColor }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 font-bold shadow-xs text-sm"
                    >
                      {c.fullName ? c.fullName[0].toUpperCase() : 'E'}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-slate-900 truncate">
                        {c.fullName || 'Untitled Card'}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {c.designation || 'No designation'}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 font-mono">
                        <span>ID: {c.employeeId}</span>
                        <span>•</span>
                        <span className="uppercase">{c.templateId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        onLoadCard(c);
                        onClose();
                      }}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'खोलें' : 'Open'}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleDuplicate(c)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Privacy & Cloud info */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              {currentUser
                ? 'Your cards are safely backed up in Firebase Cloud Firestore under your Google account and synchronized with local IndexedDB.'
                : 'Guest mode: Cards are stored in your local browser IndexedDB. Sign in with Google to sync your cards safely to Cloud Firestore across all devices!'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-white text-xs font-semibold cursor-pointer"
          >
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
