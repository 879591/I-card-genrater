import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  X,
  Sparkles,
  Bot,
  User,
  Globe,
  Loader2,
  ExternalLink,
  Search,
  CheckCircle,
  Copy,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  sources?: Array<{
    web?: {
      uri: string;
      title: string;
    };
  }>;
  webSearchQueries?: string[];
  timestamp: number;
}

interface GeminiChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'hi';
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content:
        language === 'hi'
          ? 'नमस्ते! मैं 5tar कार्ड एआई सहायक हूँ। मैं आपको सही पद (Designation), विभाग, कंपनी का पता, रंग संयोजन या Google सर्च से वास्तविक जानकारी खोजने में सहायता कर सकता हूँ। आप क्या पूछना चाहते हैं?'
          : 'Hello! I am 5tar Card AI Assistant. I can help you craft professional designations, format card addresses, suggest color themes, or look up live information with Google Search. How can I help you today?',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          searchEnabled,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server error');
      }

      const botMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.text || 'No response generated.',
        sources: data.sources || [],
        webSearchQueries: data.webSearchQueries || [],
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content:
          language === 'hi'
            ? 'क्षमा करें, उत्तर प्राप्त करने में समस्या आई। कृपया पुनः प्रयास करें।'
            : 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const samplePrompts = [
    language === 'hi'
      ? 'सॉफ्टवेयर इंजीनियर के लिए सही पद और विभाग सुझाएँ'
      : 'Suggest designations for a software tech company',
    language === 'hi'
      ? 'स्कूल आईडी कार्ड के पीछे लिखी जाने वाली शर्तें'
      : 'Card back return instructions for school staff',
    language === 'hi'
      ? 'सिद्धार्थ यूनिवर्सिटी, कपिलवस्तु का पता और पिन कोड'
      : 'Address and details of Siddharth University',
    language === 'hi'
      ? 'अस्पताल मेडिकल कार्ड के लिए मानक नियम'
      : 'Standard rules for hospital employee ID cards',
  ];

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex items-end sm:items-center justify-center p-0 sm:p-0">
      <div className="w-full h-full sm:h-[620px] sm:w-[440px] bg-white sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-400/30 text-amber-300">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-white">5tar Card AI Assistant</h3>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-400/30">
                  Online
                </span>
              </div>
              <p className="text-[10px] text-blue-200 flex items-center gap-1 mt-0.5">
                <Globe className="w-3 h-3 text-cyan-300" />
                <span>Google Search Grounded • gemini-3.8-flash</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Grounding toggle bar */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={searchEnabled}
              onChange={(e) => setSearchEnabled(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="font-semibold text-slate-700 flex items-center gap-1 text-[11px]">
              <Search className="w-3 h-3 text-blue-600" />
              {language === 'hi' ? 'Google Search डेटा उपयोग करें' : 'Use Google Search Grounding'}
            </span>
          </label>
          <span className="text-[10px] text-slate-400 font-mono">Real-time Web</span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'model' && (
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                  5★
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed relative group shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white font-medium rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Google Search Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] space-y-1">
                    <span className="font-bold text-slate-500 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-blue-500" />
                      Google Search Sources:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {msg.sources.slice(0, 3).map((s, idx) => (
                        <a
                          key={idx}
                          href={s.web?.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-50 text-blue-600 border border-slate-200 max-w-[180px] truncate"
                          title={s.web?.title}
                        >
                          <span className="truncate">{s.web?.title || 'Web Result'}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Copy button */}
                <button
                  type="button"
                  onClick={() => handleCopy(msg.id, msg.content)}
                  className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-600 transition"
                  title="Copy text"
                >
                  {copiedId === msg.id ? (
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center text-xs shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5 items-center text-slate-500 text-xs p-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white p-2.5 rounded-2xl border border-slate-200 text-slate-600 text-[11px] flex items-center gap-2">
                <span>
                  {searchEnabled
                    ? (language === 'hi' ? 'Google Search से जानकारी खोजी जा रही है...' : 'Searching with Google Search...')
                    : (language === 'hi' ? 'एआई उत्तर तैयार कर रहा है...' : 'Thinking...')}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(p)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[10px] font-medium shrink-0 transition border border-slate-200"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'पद, संस्था का पता, या नियम पूछें...'
                  : 'Ask about designations, addresses, card rules...'
              }
              className="flex-1 px-3.5 py-2.5 bg-slate-100 rounded-xl border border-transparent focus:border-blue-500 focus:bg-white text-xs text-slate-800 outline-none transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl transition cursor-pointer shadow-xs shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
