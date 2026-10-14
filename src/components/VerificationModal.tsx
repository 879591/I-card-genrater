import React, { useState } from 'react';
import { CardData } from '../types/card';
import { ShieldCheck, AlertCircle, CheckCircle2, XCircle, Search, Building2, User, Calendar, ExternalLink, X } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCard: CardData;
  language: 'en' | 'hi';
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  currentCard,
  language,
}) => {
  const [searchId, setSearchId] = useState(currentCard.verificationId);
  const [queriedCard, setQueriedCard] = useState<CardData | null>(currentCard);
  const [hasSearched, setHasSearched] = useState(true);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    if (searchId.trim().toUpperCase() === currentCard.verificationId.toUpperCase()) {
      setQueriedCard(currentCard);
    } else {
      setQueriedCard(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-400/30">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg">
                {language === 'hi' ? 'कर्मचारी पहचान सत्यापन' : 'Employee ID Verification Portal'}
              </h3>
              <p className="text-xs text-blue-200 font-mono">5tar Verification Architecture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Verification ID (e.g. 5TAR-XXXX-XXXX)"
                className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-800 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shrink-0"
            >
              {language === 'hi' ? 'जाँच करें' : 'Verify'}
            </button>
          </form>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {hasSearched && queriedCard ? (
            <div className="space-y-4">
              {/* Status Badge */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  queriedCard.verificationStatus === 'active'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : queriedCard.verificationStatus === 'expired'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  {queriedCard.verificationStatus === 'active' ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  ) : queriedCard.verificationStatus === 'expired' ? (
                    <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                  )}
                  <div>
                    <h4 className="font-bold text-sm">
                      {queriedCard.verificationStatus === 'active'
                        ? (language === 'hi' ? 'रिकॉर्ड सक्रिय और प्रमाणित है' : 'Record Status: Active & Valid')
                        : queriedCard.verificationStatus === 'expired'
                        ? (language === 'hi' ? 'कार्ड की समय सीमा समाप्त (Expired)' : 'Record Status: Expired')
                        : (language === 'hi' ? 'रिकॉर्ड रद्द / अमान्य (Revoked)' : 'Record Status: Revoked / Invalid')}
                    </h4>
                    <p className="text-[11px] opacity-80 font-mono">
                      Verification ID: {queriedCard.verificationId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Public Authorized Data */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Employee Name
                  </span>
                  <span className="font-bold text-slate-800">{queriedCard.fullName}</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500 font-medium">Employee ID</span>
                  <span className="font-bold font-mono text-slate-800">
                    {queriedCard.employeeId}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    Organization
                  </span>
                  <span className="font-bold text-slate-800">
                    {queriedCard.organizationName}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500 font-medium">Designation / Role</span>
                  <span className="font-semibold text-slate-700">{queriedCard.designation}</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Card Issue Date
                  </span>
                  <span className="font-mono text-slate-700">{queriedCard.issueDate}</span>
                </div>

                {queriedCard.expiryDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Valid Until</span>
                    <span className="font-mono text-slate-700">{queriedCard.expiryDate}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-slate-700">No Record Found</h4>
              <p className="text-xs text-slate-500 mt-1">
                The identifier <code className="font-mono">{searchId}</code> does not match this session's employee record.
              </p>
            </div>
          )}

          {/* Honest Security & Architecture Explanation */}
          <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-600 space-y-1.5">
            <p className="font-bold text-slate-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Architectural Verification Policy:</span>
            </p>
            <p className="leading-relaxed">
              In this client-side PWA, each card receives a non-guessable cryptographic record ID.
              True enterprise validation requires linking this token to your company’s centralized HR/ERP server.
              A locally generated QR code confirms template integrity but does not substitute for organizational authorization.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition"
          >
            {language === 'hi' ? 'वापस जाएँ' : 'Close Portal'}
          </button>
        </div>
      </div>
    </div>
  );
};
