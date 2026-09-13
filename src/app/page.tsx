import GrievanceWizard from '@/components/GrievanceWizard';
import { Language } from '@/lib/translations';
import { 
  Scale, 
  ShieldCheck, 
  Landmark, 
  Lock, 
  PhoneCall, 
  CheckCircle2,
  Users
} from 'lucide-react';

interface PageProps {
  searchParams: Promise<{ lang?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const rawLang = params?.lang || 'en';
  const validLanguages: Language[] = ['en', 'hi', 'pa', 'mr', 'bn', 'ta', 'te', 'gu', 'kn'];
  const initialLang: Language = validLanguages.includes(rawLang as Language) ? (rawLang as Language) : 'en';

  return (
    <main className="min-h-screen bg-[#050811] text-slate-100 py-6 px-4 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* 1. TOP STATUTORY & CITIZEN EMERGENCY HELPLINES BAR */}
      <header className="max-w-4xl mx-auto mb-6 p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400 no-print">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold px-2">
          <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>National Citizen Helplines:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 px-2">
          <span className="hover:text-white transition-colors">
            <strong className="text-slate-200">Emergency:</strong> <span className="text-emerald-400 font-bold">112</span>
          </span>
          <span className="text-slate-700">•</span>
          <span className="hover:text-white transition-colors">
            <strong className="text-slate-200">Women Safety:</strong> <span className="text-emerald-400 font-bold">181 / 1091</span>
          </span>
          <span className="text-slate-700">•</span>
          <span className="hover:text-white transition-colors">
            <strong className="text-slate-200">Cyber Crime:</strong> <span className="text-emerald-400 font-bold">1930</span>
          </span>
          <span className="text-slate-700">•</span>
          <span className="hover:text-white transition-colors">
            <strong className="text-slate-200">Legal Aid (NALSA):</strong> <span className="text-emerald-400 font-bold">15100</span>
          </span>
        </div>
      </header>

      {/* 2. HERO BRANDING & CIVIC AUTHORITY CREST */}
      <section className="max-w-4xl mx-auto mb-8 text-center space-y-4 no-print">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs font-mono shadow-sm">
          <Scale className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold tracking-wide">National Citizen Grievance Intelligence & Legal Router</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold font-mono text-white tracking-tight flex items-center justify-center gap-3">
          <span>NyayaPath</span> 
          <span className="text-emerald-400 font-normal font-indic">न्यायपथ</span>
        </h1>
        
        <p className="text-xs sm:text-base text-slate-300 font-mono max-w-2xl mx-auto leading-relaxed">
          Transform administrative friction, corruption, and bureaucratic delays into structured, jurisdiction-routed legal action with evidence matrixing and escalation roadmaps.
        </p>

        {/* 3. FOUR INSTITUTIONAL TRUST PILLARS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto pt-2 text-left">
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
              <Landmark className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Pan-India Routing</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Central CVC, Lokayuktas in 28 States & 8 UTs, and State ACB/Vigilance.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-blue-400">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Whistleblower Law</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Structured under Section 4 of Whistle Blowers Protection Act 2014.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400">
              <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Zero Retention</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              DPDPA 2023 compliant. Ephemeral browser memory; no cloud database.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-purple-400">
              <Users className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>9 Indic Languages</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Voice intake, audio read-back, and vector PDF export across Indian scripts.
            </p>
          </div>
        </div>

        {/* 4. DIGNIFIED PUBLIC SERVICE DISCLAIMER */}
        <div className="max-w-2xl mx-auto p-2.5 rounded-lg bg-slate-900/30 border border-slate-800/50 text-[11px] font-mono text-slate-400 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Independent public-interest initiative. Free citizen access. No sign-up or phone number required.</span>
        </div>
      </section>
      
      {/* 5. INTERACTIVE GRIEVANCE WIZARD */}
      <GrievanceWizard initialLang={initialLang} />
      
      {/* 6. INSTITUTIONAL FOOTER */}
      <footer className="max-w-4xl mx-auto mt-12 text-center border-t border-slate-800/60 pt-6 space-y-2 no-print">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-500">
          <span>Digital Personal Data Protection Act (DPDPA 2023) Compliant</span>
          <span>•</span>
          <span>Zero Server Storage</span>
          <span>•</span>
          <span>Local Ephemeral Inference</span>
        </div>
        <p className="text-[10px] text-slate-600 font-mono">
          NyayaPath does not substitute legal representation before courts of record. For formal litigation, consult an advocate or your District Legal Services Authority (DLSA).
        </p>
      </footer>
    </main>
  );
}
