import GrievanceWizard from '@/components/GrievanceWizard';
import { Language } from '@/lib/translations';
import { Scale, PhoneCall } from 'lucide-react';

interface PageProps {
  searchParams: Promise<{ lang?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const rawLang = params?.lang || 'en';
  const validLanguages: Language[] = ['en', 'hi', 'pa', 'mr', 'bn', 'ta', 'te', 'gu', 'kn'];
  const initialLang: Language = validLanguages.includes(rawLang as Language) ? (rawLang as Language) : 'en';

  return (
    <main className="min-h-screen bg-[#060913] text-slate-100 py-6 px-4 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* 1. CALM TOP BAR: CIVIC IDENTITY & ESSENTIAL HELPLINES */}
      <header className="max-w-4xl mx-auto mb-6 p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/70 backdrop-blur-sm flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400 no-print">
        <div className="flex items-center gap-2 text-slate-300">
          <Scale className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-bold text-white tracking-tight">NyayaPath</span>
          <span className="text-emerald-400 font-indic">न्यायपथ</span>
          <span className="text-slate-700">•</span>
          <span className="text-[11px] text-slate-400">Bharat • India</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] text-slate-400">
          <PhoneCall className="w-3 h-3 text-slate-500 shrink-0" />
          <span>Emergency: <strong className="text-slate-200">112</strong></span>
          <span className="text-slate-700">•</span>
          <span>Cyber: <strong className="text-slate-200">1930</strong></span>
          <span className="text-slate-700">•</span>
          <span>Legal Aid: <strong className="text-slate-200">15100</strong></span>
        </div>
      </header>

      {/* 2. MINIMAL, CALM HERO */}
      <section className="max-w-3xl mx-auto mb-8 text-center space-y-3 no-print">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-400">
          <span className="text-emerald-400 font-bold">॥</span>
          <span className="text-slate-300 font-medium">सत्यमेव जयते</span>
          <span className="text-emerald-400 font-bold">॥</span>
          <span className="text-slate-600">•</span>
          <span>National Citizen Grievance Intelligence</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-bold font-mono text-white tracking-tight">
          File Administrative Grievances With Legal Clarity
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-xl mx-auto leading-relaxed">
          Transform administrative friction, corruption, and delays into structured, jurisdiction-routed complaints with evidence checklists.
        </p>

        {/* COMPACT QUIET PILLARS (SINGLE CLEAN ROW) */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] font-mono text-slate-400">
          <span className="px-2.5 py-1 rounded-md bg-slate-900/50 border border-slate-800/80">
            🏛️ 28 States & 8 UTs (CVC / Lokayukta)
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-900/50 border border-slate-800/80">
            🛡️ Whistleblower Shield (WBPA 2014)
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-900/50 border border-slate-800/80">
            🔒 Zero Retention (DPDPA 2023)
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-900/50 border border-slate-800/80">
            🌐 9 Indic Languages
          </span>
        </div>
      </section>
      
      {/* 3. INTERACTIVE GRIEVANCE WIZARD */}
      <GrievanceWizard initialLang={initialLang} />
      
      {/* 4. CALM INSTITUTIONAL FOOTER */}
      <footer className="max-w-4xl mx-auto mt-12 text-center border-t border-slate-800/60 pt-6 space-y-2 no-print">
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-slate-500">
          <span>Digital Personal Data Protection Act (DPDPA 2023) Compliant</span>
          <span>•</span>
          <span>Zero Server Storage</span>
          <span>•</span>
          <span>Local Ephemeral Processing</span>
        </div>
        <p className="text-[10px] text-slate-600 font-mono max-w-2xl mx-auto">
          NyayaPath is an independent public-interest initiative and does not substitute formal legal representation before courts of record.
        </p>
      </footer>
    </main>
  );
}
