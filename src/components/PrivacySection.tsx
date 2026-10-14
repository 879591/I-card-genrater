import React from 'react';
import { ShieldCheck, Lock, EyeOff, ServerOff, Database, CheckCircle2 } from 'lucide-react';

interface PrivacySectionProps {
  language: 'en' | 'hi';
}

export const PrivacySection: React.FC<PrivacySectionProps> = ({ language }) => {
  const points = [
    {
      icon: <ServerOff className="w-5 h-5 text-emerald-600" />,
      titleEn: '100% Client-Side Processing',
      titleHi: '100% क्लाइंट-साइड प्रोसेसिंग',
      descEn:
        'Employee details and photos are processed strictly inside your local browser memory. No data is sent or uploaded to any remote server.',
      descHi:
        'कर्मचारी का नाम, फोटो और संवेदनशील विवरण केवल आपके ब्राउज़र की मेमोरी में रहते हैं। कोई भी डेटा बाहरी सर्वर पर अपलोड नहीं किया जाता।',
    },
    {
      icon: <Lock className="w-5 h-5 text-blue-600" />,
      titleEn: 'No Tracking or Analytics',
      titleHi: 'कोई ट्रैकिंग या गुप्त डेटा संग्रह नहीं',
      descEn:
        'We do not employ ad trackers, spyware, telemetry, or third-party tracking cookies. Your organization data remains your own.',
      descHi:
        'हम किसी भी प्रकार का विज्ञापन ट्रैकर, टेलीमेट्री या जासूसी कुकीज का उपयोग नहीं करते हैं। आपकी संस्था की जानकारी पूरी तरह गोपनीय है।',
    },
    {
      icon: <Database className="w-5 h-5 text-indigo-600" />,
      titleEn: 'Local IndexedDB Storage',
      titleHi: 'लोकल ब्राउज़र IndexedDB स्टोरेज',
      descEn:
        'Saved cards are stored strictly in your browser’s local IndexedDB sandbox. You can export or clear your entire data archive with one click.',
      descHi:
        'आपके द्वारा सहेजे गए कार्ड केवल आपके डिवाइस के ब्राउज़र में रहते हैं। आप जब चाहें एक क्लिक में पूरा डेटा साफ़ कर सकते हैं।',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
      titleEn: 'No Hidden Subscriptions',
      titleHi: 'कोई छिपा हुआ शुल्क या सब्सक्रिप्शन नहीं',
      descEn:
        'The application is completely free for everyone. There are no watermarks, forced logins, paywalls, or artificial download restrictions.',
      descHi:
        'यह टूल सभी के लिए पूरी तरह मुफ्त है। कोई वॉटरमार्क, अनिवार्य लॉगिन या डाउनलोड प्रतिबंध नहीं है।',
    },
  ];

  return (
    <section id="privacy-section" className="py-16 sm:py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{language === 'hi' ? 'गोपनीयता एवं सुरक्षा गारंटी' : 'Privacy-First Architecture'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'hi'
              ? 'आपकी जानकारी शत-प्रतिशत सुरक्षित और निजी है'
              : 'Enterprise Security & Absolute Data Privacy'}
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            {language === 'hi'
              ? 'कार्ड निर्माण और फोटो रेंडरिंग की पूरी प्रक्रिया आपके डिवाइस पर ही सम्पन्न होती है।'
              : 'Card generation, QR rendering, and PDF exports run strictly in-browser without cloud storage.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {points.map((pt, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 flex items-start gap-4"
            >
              <div className="p-3 bg-white rounded-2xl shadow-xs border border-slate-200 shrink-0">
                {pt.icon}
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 mb-1">
                  {language === 'hi' ? pt.titleHi : pt.titleEn}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'hi' ? pt.descHi : pt.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Clear Guarantee Box */}
        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-sm block">
                {language === 'hi' ? '5tar Suraj प्राइवेसी प्रतिज्ञा' : '5tar Suraj Privacy Pledge'}
              </span>
              <span className="text-blue-200">
                {language === 'hi'
                  ? 'निर्मित: सुप्रिया डिजिटल रिसर्च (SDR), रुधौली, बस्ती (उ.प्र.) द्वारा।'
                  : 'Developed by Supriya Digital Research (SDR), Rudhauli, Basti (U.P.), India.'}
              </span>
            </div>
          </div>

          <div className="text-xs font-mono bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 shrink-0">
            Zero Server Uploads Verified
          </div>
        </div>
      </div>
    </section>
  );
};
