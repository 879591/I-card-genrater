import React from 'react';
import { CardData, TemplateDefinition, TemplateId } from '../types/card';
import { TEMPLATE_PRESETS } from '../utils/demoData';
import {
  Building2,
  Briefcase,
  GraduationCap,
  Stethoscope,
  Shield,
  Wrench,
  Sparkles,
  Check,
} from 'lucide-react';

interface TemplatesGalleryProps {
  currentTemplateId: TemplateId;
  onSelectTemplate: (templateId: TemplateId, preset: Partial<CardData>) => void;
  language: 'en' | 'hi';
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'corporate',
    name: 'Corporate Employee ID',
    hindiName: 'कॉर्पोरेट कर्मचारी आईडी',
    category: 'Corporate & Tech',
    description: 'Sleek royal navy theme with modern executive hierarchy, clean typography, and badge slot.',
    defaultThemeColor: '#1e3a8a',
    defaultAccentColor: '#3b82f6',
    badgeStyle: 'Navy & Blue',
    recommendedFor: 'IT Firms, MNCs, Tech Companies',
  },
  {
    id: 'office',
    name: 'Office Staff ID',
    hindiName: 'ऑफिस स्टाफ आईडी',
    category: 'Finance & Agency',
    description: 'Minimalist teal and slate palette tailored for daily office, administrative, and bank personnel.',
    defaultThemeColor: '#0f766e',
    defaultAccentColor: '#14b8a6',
    badgeStyle: 'Teal & Emerald',
    recommendedFor: 'Offices, Banks, Financial Institutions',
  },
  {
    id: 'school',
    name: 'School Staff ID',
    hindiName: 'स्कूल शिक्षक एवं स्टाफ',
    category: 'K-12 Education',
    description: 'Warm crimson and amber crest style for teachers, principals, and school administrative personnel.',
    defaultThemeColor: '#991b1b',
    defaultAccentColor: '#f59e0b',
    badgeStyle: 'Crimson & Gold',
    recommendedFor: 'Primary & High Schools, Academies',
  },
  {
    id: 'college',
    name: 'College Employee ID',
    hindiName: 'कॉलेज एवं यूनिवर्सिटी स्टाफ',
    category: 'Higher Education',
    description: 'Formal scholarly emerald green with university seal styling and department emphasis.',
    defaultThemeColor: '#065f46',
    defaultAccentColor: '#10b981',
    badgeStyle: 'Emerald & Gold',
    recommendedFor: 'Colleges, Universities, Research Centers',
  },
  {
    id: 'hospital',
    name: 'Hospital Staff ID',
    hindiName: 'अस्पताल मेडिकल स्टाफ',
    category: 'Healthcare & Medical',
    description: 'Medical cyan and alert rose accents, prominent blood group badge, and emergency instructions.',
    defaultThemeColor: '#0284c7',
    defaultAccentColor: '#e11d48',
    badgeStyle: 'Cyan & Medical Red',
    recommendedFor: 'Hospitals, Clinics, Diagnostic Labs',
  },
  {
    id: 'security',
    name: 'Security Staff ID',
    hindiName: 'सुरक्षा गार्ड एवं स्टाफ',
    category: 'Security & Vigilance',
    description: 'High-contrast dark obsidian shield motif with bold yellow hazard accents for guards and vigilance officers.',
    defaultThemeColor: '#0f172a',
    defaultAccentColor: '#eab308',
    badgeStyle: 'Tactical Obsidian',
    recommendedFor: 'Security Agencies, Facility Protection',
  },
  {
    id: 'factory',
    name: 'Factory Worker ID',
    hindiName: 'फैक्ट्री एवं इंडस्ट्रियल वर्कर',
    category: 'Manufacturing',
    description: 'Industrial safety orange and charcoal with prominent shift, safety, and blood group visibility.',
    defaultThemeColor: '#ea580c',
    defaultAccentColor: '#f97316',
    badgeStyle: 'Industrial Orange',
    recommendedFor: 'Plants, Warehouses, Manufacturing Units',
  },
  {
    id: 'business',
    name: 'Business Professional ID',
    hindiName: 'बिजनेस प्रोफेशनल आईडी',
    category: 'Executive & Consulting',
    description: 'Modern luxury purple gradient with executive aesthetic, suitable for consultants, partners, and advisors.',
    defaultThemeColor: '#581c87',
    defaultAccentColor: '#a855f7',
    badgeStyle: 'Deep Purple & Violet',
    recommendedFor: 'Consulting Agencies, Executive Boards',
  },
];

export const TemplatesGallery: React.FC<TemplatesGalleryProps> = ({
  currentTemplateId,
  onSelectTemplate,
  language,
}) => {
  return (
    <section id="templates-section" className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? '8+ विशेष टेम्पलेट्स' : '8+ Production-Grade Templates'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'hi' ? 'अपनी संस्था के अनुसार टेम्पलेट चुनें' : 'Choose Your Ideal ID Card Style'}
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            {language === 'hi'
              ? 'प्रत्येक टेम्पलेट को प्रिंटिंग के लिए अनुकूलित (CR80 अनुपात) किया गया है।'
              : 'Every template is designed to international CR80 credit-card standards with distinct branding.'}
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEMPLATES.map((tmpl) => {
            const isSelected = currentTemplateId === tmpl.id;
            const preset = TEMPLATE_PRESETS[tmpl.id];

            return (
              <div
                key={tmpl.id}
                className={`group relative rounded-3xl p-5 border-2 transition-all flex flex-col justify-between bg-white shadow-sm hover:shadow-xl ${
                  isSelected
                    ? 'border-blue-600 ring-4 ring-blue-500/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Top Swatch */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {tmpl.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div
                        style={{ backgroundColor: tmpl.defaultThemeColor }}
                        className="w-4 h-4 rounded-full border border-white shadow-xs"
                      />
                      <div
                        style={{ backgroundColor: tmpl.defaultAccentColor }}
                        className="w-4 h-4 rounded-full border border-white shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Template Mini Preview Mockup */}
                  <div
                    style={{ backgroundColor: tmpl.defaultThemeColor }}
                    className="h-28 rounded-2xl p-3 flex flex-col justify-between text-white relative overflow-hidden shadow-inner mb-4"
                  >
                    <div
                      style={{ backgroundColor: tmpl.defaultAccentColor }}
                      className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full opacity-30"
                    />
                    <div className="flex items-center justify-between relative z-10">
                      <div className="w-6 h-6 rounded-md bg-white/20 backdrop-blur-sm flex items-center justify-center text-[10px] font-bold">
                        ★
                      </div>
                      <span className="text-[9px] font-mono opacity-80 uppercase tracking-widest">
                        {tmpl.id}
                      </span>
                    </div>

                    <div className="relative z-10 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/90 border border-white/40 shrink-0" />
                      <div className="leading-tight">
                        <div className="w-16 h-2 bg-white/90 rounded-full mb-1" />
                        <div className="w-10 h-1.5 bg-white/60 rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition">
                    {language === 'hi' ? tmpl.hindiName : tmpl.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{tmpl.description}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {tmpl.badgeStyle}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectTemplate(tmpl.id, preset);
                      const formElem = document.getElementById('card-creator-section');
                      formElem?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'सक्रिय है' : 'Active'}</span>
                      </>
                    ) : (
                      <span>{language === 'hi' ? 'उपयोग करें' : 'Use Template'}</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
