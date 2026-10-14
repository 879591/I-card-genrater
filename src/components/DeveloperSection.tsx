import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  MapPin,
  Heart,
  Code2,
  Sparkles,
  Phone,
  MessageCircle,
  ExternalLink,
  Shield,
  Layers,
  Award,
} from 'lucide-react';

interface DeveloperSectionProps {
  language: 'en' | 'hi';
}

export const DeveloperSection: React.FC<DeveloperSectionProps> = ({ language }) => {
  const [showWhatsAppConfirm, setShowWhatsAppConfirm] = useState(false);

  const developerDetails = {
    fullName: 'Suraj Maurya',
    creatorBrand: '5tar Suraj',
    digitalBrand: 'Supriya Digital Research (SDR)',
    location: 'Rudhauli, Basti, Uttar Pradesh, India',
    phone: '9792006815',
    instagram: 'https://www.instagram.com/5tar.suraj?stkn=OWZjNXhyb2toanZk',
    facebook: 'https://www.facebook.com/share/1FDbbX2rcH/',
    youtubeDisplayName: '5tar Suraj',
  };

  const education = [
    {
      level: language === 'hi' ? 'स्नातक (प्रथम वर्ष)' : 'Bachelor of Arts (B.A.) — First Year',
      institution: 'Siddharth University',
      boardOrUniv: 'Siddharth University, Kapilvastu',
      subjects: 'Geography, Economics, Minor Sanskrit',
      year: 'Current Enrollment',
      status: language === 'hi' ? 'वर्तमान अध्ययनरत' : 'Pursuing',
    },
    {
      level: language === 'hi' ? 'इंटरमीडिएट (कक्षा 12)' : 'Intermediate — Class 12',
      institution: 'Dileshwari Inter College, Rudhauli, Basti, Uttar Pradesh',
      boardOrUniv: 'UP Board',
      year: '2026',
      status: language === 'hi' ? 'पूर्ण' : 'Completed',
    },
    {
      level: language === 'hi' ? 'हाई स्कूल (कक्षा 10)' : 'High School — Class 10',
      institution: 'Dileshwari Inter College, Rudhauli, Basti, Uttar Pradesh',
      boardOrUniv: 'UP Board',
      year: '2024',
      status: language === 'hi' ? 'पूर्ण' : 'Completed',
    },
  ];

  const interests = [
    'Website Development',
    'Progressive Web Apps (PWA)',
    'Mobile Applications',
    'Game Development',
    'Artificial Intelligence',
    'Digital Design',
  ];

  const handleWhatsAppClick = () => {
    const text = encodeURIComponent(
      'Hello Suraj Maurya! I am contacting you regarding 5tar Employee Card Maker application.'
    );
    window.open(`https://wa.me/91${developerDetails.phone}?text=${text}`, '_blank');
    setShowWhatsAppConfirm(false);
  };

  return (
    <section id="developer-section" className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header Badge */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-3 border border-blue-400/30">
            <User className="w-3.5 h-3.5 text-blue-400" />
            <span>{language === 'hi' ? 'डेवलपर प्रोफाइल' : 'Creator Profile'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {language === 'hi' ? 'डेवलपर के बारे में' : 'About the Developer'}
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            {language === 'hi'
              ? 'सच्ची और सत्यापित जानकारी — बिना किसी अतिशयोक्ति या झूठे दावों के।'
              : 'Verified profile and authentic background of the creator.'}
          </p>
        </div>

        {/* Creator Main Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Column 1: Identity & Brand Card */}
          <div className="bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl flex flex-col justify-between">
            <div>
              {/* Avatar Crest */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-1 shadow-lg mx-auto mb-5">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-3xl font-black text-amber-400">
                  5★
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-black tracking-tight text-white">
                  {developerDetails.fullName}
                </h3>
                <p className="text-amber-400 font-bold text-sm tracking-wide mt-1">
                  {developerDetails.creatorBrand}
                </p>
                <p className="text-xs text-blue-300 font-medium mt-0.5">
                  {developerDetails.digitalBrand}
                </p>

                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-700/60 text-slate-300 text-xs border border-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{developerDetails.location}</span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-700/80 text-xs text-slate-300 leading-relaxed">
                <p>
                  {language === 'hi'
                    ? 'सूरज मौर्य एक महत्वाकांक्षी डिजिटल क्रिएटर और वेब डेवलपर हैं, जो भारत के उत्तर प्रदेश के रुधौली, बस्ती से हैं। वे व्यावहारिक, उपयोगी और पूरी तरह से मुफ्त टूल्स का निर्माण करने के लिए समर्पित हैं।'
                    : 'Suraj Maurya is an aspiring digital creator and web developer based in Rudhauli, Basti, Uttar Pradesh, India. He builds practical, free, and accessible digital tools for students, professionals, and small organizations.'}
                </p>
              </div>
            </div>

            {/* Social & Contact Buttons */}
            <div className="mt-8 pt-5 border-t border-slate-700/80 space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                {language === 'hi' ? 'आधिकारिक सोशल मीडिया' : 'Official Social Links'}
              </span>

              {/* Instagram */}
              <a
                href={developerDetails.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-2.5 rounded-xl bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/50 hover:to-pink-600/50 border border-pink-500/30 text-white text-xs font-semibold flex items-center justify-between transition"
              >
                <span>Instagram: @5tar.suraj</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {/* Facebook */}
              <a
                href={developerDetails.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-2.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30 text-white text-xs font-semibold flex items-center justify-between transition"
              >
                <span>Facebook: Suraj Maurya</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {/* YouTube */}
              <div className="w-full p-2.5 rounded-xl bg-slate-700/40 border border-slate-600 text-slate-300 text-xs flex items-center justify-between">
                <span>YouTube: {developerDetails.youtubeDisplayName}</span>
                <span className="text-[10px] text-slate-400">Creator</span>
              </div>

              {/* WhatsApp Contact */}
              <button
                type="button"
                onClick={() => setShowWhatsAppConfirm(true)}
                className="w-full p-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between transition"
              >
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp Contact</span>
                </div>
                <span className="text-[10px] font-mono">{developerDetails.phone}</span>
              </button>

              {/* Public Phone */}
              <a
                href={`tel:${developerDetails.phone}`}
                className="w-full p-2 rounded-xl bg-slate-700/20 hover:bg-slate-700/40 text-slate-300 text-[11px] font-mono flex items-center justify-center gap-1.5 transition"
              >
                <Phone className="w-3 h-3 text-slate-400" />
                <span>Call: +91 {developerDetails.phone}</span>
              </a>
            </div>
          </div>

          {/* Column 2 & 3: Education & Interests */}
          <div className="lg:col-span-2 space-y-6">
            {/* Education Profile (Zero marks/percentages rule strictly observed) */}
            <div className="bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white">
                      {language === 'hi' ? 'शैक्षणिक योग्यता (Education)' : 'Educational Background'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Authentic institutional history without marks, rankings, or percentages.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-700 text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                  Verified
                </span>
              </div>

              <div className="space-y-4">
                {education.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700/70 hover:border-slate-600 transition flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{item.level}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900/50 text-blue-300 font-semibold border border-blue-700/40">
                          {item.year}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium">{item.institution}</p>
                      <p className="text-[11px] text-slate-400">Board / University: {item.boardOrUniv}</p>
                      {item.subjects && (
                        <p className="text-[11px] text-amber-300/90 font-medium pt-0.5">
                          Subjects: {item.subjects}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Aspirations & Interests */}
            <div className="bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white">
                    {language === 'hi' ? 'तकनीकी रुचियाँ एवं क्षेत्र' : 'Digital Creator Interests'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Fields of active exploration, learning, and independent creative development.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {interests.map((interest, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-slate-900/60 border border-slate-700/70 flex items-center gap-2 text-xs font-semibold text-slate-200"
                  >
                    <Code2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="truncate">{interest}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200 flex items-center justify-between flex-wrap gap-2">
                <span>
                  <strong>Ethical Profile Guarantee:</strong> No inflated claims or simulated experience.
                </span>
                <span className="text-[11px] font-mono text-amber-300">
                  Supriya Digital Research (SDR)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Consent Modal */}
      {showWhatsAppConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-800 p-6 border border-slate-700 shadow-2xl text-white">
            <h4 className="font-bold text-base mb-2 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              <span>Connect on WhatsApp?</span>
            </h4>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              This will launch WhatsApp with the public contact number{' '}
              <strong className="text-white">+91 {developerDetails.phone}</strong> for genuine inquiries regarding 5tar Employee Card Maker.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition"
              >
                Open WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setShowWhatsAppConfirm(false)}
                className="py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-xs transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
