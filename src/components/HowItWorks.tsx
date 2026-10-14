import React from 'react';
import { UserCheck, Palette, QrCode, Download, Shield } from 'lucide-react';

interface HowItWorksProps {
  language: 'en' | 'hi';
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ language }) => {
  const steps = [
    {
      num: '01',
      icon: <UserCheck className="w-6 h-6 text-blue-600" />,
      titleEn: 'Fill Employee Details',
      titleHi: 'कर्मचारी विवरण भरें',
      descEn:
        'Enter employee name, ID, designation, organization name, and optional dates, phone, or blood group.',
      descHi:
        'कर्मचारी का नाम, आईडी नंबर, पद, विभाग और संस्था का नाम भरें। जरूरत के अनुसार फोन, ब्लड ग्रुप और पता भी जोड़ सकते हैं।',
    },
    {
      num: '02',
      icon: <Palette className="w-6 h-6 text-purple-600" />,
      titleEn: 'Upload Photo & Select Theme',
      titleHi: 'फोटो अपलोड करें व थीम चुनें',
      descEn:
        'Add passport photo, company logo, and authorized signature. Pick from 8+ professional industry templates.',
      descHi:
        'कर्मचारी का फोटो, कंपनी का लोगो और अधिकृत हस्ताक्षर अपलोड करें। 8 में से अपनी पसंद का पेशेवर टेम्पलेट चुनें।',
    },
    {
      num: '03',
      icon: <QrCode className="w-6 h-6 text-emerald-600" />,
      titleEn: 'Configure QR System',
      titleHi: 'QR कोड सेटिंग्स चुनें',
      descEn:
        'Choose between Mode A (selective contact info) or Mode B (secure verification ID with Active/Expired status).',
      descHi:
        'मोड A (आवश्यक संपर्क जानकारी) या मोड B (सत्यापन आईडी और स्थिति) में से उपयुक्त QR मोड चुनें।',
    },
    {
      num: '04',
      icon: <Download className="w-6 h-6 text-rose-600" />,
      titleEn: 'Download PNG, JPG or PDF',
      titleHi: 'PNG, JPG या PDF में डाउनलोड करें',
      descEn:
        'Instantly export in 300 DPI high-resolution for crystal-clear physical ID card printing, or save to My Cards.',
      descHi:
        'एक क्लिक में हाई-क्वालिटी PNG, JPG या PDF डाउनलोड करें और सीधे पीवीसी कार्ड प्रिंटर या कागज पर प्रिंट करें।',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-slate-100/60 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest px-3 py-1 bg-blue-100 rounded-full">
            {language === 'hi' ? 'आसान प्रक्रिया' : 'Simple Workflow'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
            {language === 'hi' ? 'यह कैसे काम करता है? (4 आसान स्टेप्स)' : 'How It Works in 4 Simple Steps'}
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            {language === 'hi'
              ? 'बिना किसी कोडिंग या जटिल सॉफ्टवेयर के, सीधे अपने मोबाइल या कंप्यूटर से ID Card बनाएँ।'
              : 'Create print-ready physical ID badges directly in your browser without software installations.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition border border-slate-100">
                    {step.icon}
                  </div>
                  <span className="text-2xl font-black text-slate-200 group-hover:text-blue-200 transition font-mono">
                    {step.num}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 mb-2">
                  {language === 'hi' ? step.titleHi : step.titleEn}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'hi' ? step.descHi : step.descEn}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
                {language === 'hi' ? '100% मुफ्त व ऑफलाइन तैयार' : '100% Free & Local Processing'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
