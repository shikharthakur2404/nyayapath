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
    <main className="min-h-screen bg-[#050811] text-slate-100 py-6 px-4 selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-x-hidden">
      
      {/* 0. AMBIENT BACKGROUND CONSTITUTIONAL WATERMARKS & SLOGANS */}
      <div 
        aria-hidden="true" 
        className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0 flex flex-col justify-between py-8 opacity-[0.035] space-y-12 no-print"
      >
        <div className="-rotate-2 text-xl sm:text-3xl font-mono uppercase tracking-[0.4em] font-bold whitespace-nowrap text-emerald-400">
          ॥ भारत गणराज्य ॥ INDIA, THAT IS BHARAT • सत्यमेव जयते • TRUTH ALONE TRIUMPHS • यतो धर्मस्ततो जयः • WHERE THERE IS JUSTICE, THERE IS VICTORY • मा गृधः कस्यस्विद्धनम्
        </div>
        <div className="rotate-2 text-xl sm:text-3xl font-mono uppercase tracking-[0.4em] font-bold whitespace-nowrap text-blue-400">
          JUSTICE • LIBERTY • EQUALITY • FRATERNITY • न्याय • स्वतंत्रता • समता • बंधुता • CONSTITUTION OF INDIA • ARTICLE 21 • 28 STATES & 8 UNION TERRITORIES
        </div>
        <div className="-rotate-1 text-xl sm:text-3xl font-mono uppercase tracking-[0.4em] font-bold whitespace-nowrap text-purple-400">
          WHISTLE BLOWERS PROTECTION ACT 2014 • CENTRAL VIGILANCE COMMISSION • 28 STATES & 8 UT LOKAYUKTA REDRESSAL • ANTI-CORRUPTION BUREAU • CITIZEN SOVEREIGNTY
        </div>
        <div className="rotate-2 text-xl sm:text-3xl font-mono uppercase tracking-[0.4em] font-bold whitespace-nowrap text-emerald-400">
          ॥ धर्मो रक्षति रक्षितः ॥ DIGITAL PERSONAL DATA PROTECTION ACT 2023 • ZERO RETENTION • EPHEMERAL LOCAL INFERENCE • NO SERVER STORAGE
        </div>
        <div className="-rotate-2 text-xl sm:text-3xl font-mono uppercase tracking-[0.4em] font-bold whitespace-nowrap text-amber-400">
          भयमुक्त नागरिक • पारदर्शी प्रशासन • DEMOCRACY THROUGH STATUTORY ACCOUNTABILITY • NO CITIZEN STANDS ALONE BEFORE ADMINISTRATIVE POWER
        </div>
      </div>

      {/* 1. TOP STATUTORY & CITIZEN EMERGENCY HELPLINES BAR */}
      <header className="max-w-4xl mx-auto mb-4 p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400 relative z-10 no-print">
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

      {/* CIVIC MOTTO & STATUTORY VALUE RIBBON */}
      <div className="max-w-4xl mx-auto mb-6 px-4 py-2 rounded-xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm flex flex-wrap items-center justify-around gap-3 text-xs font-mono text-slate-400 relative z-10 no-print">
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <span className="text-emerald-500 font-bold">॥</span>
          <span className="tracking-wide">सत्यमेव जयते</span>
          <span className="text-emerald-500 font-bold">॥</span>
          <span className="text-[10px] text-slate-500 font-normal hidden sm:inline">(Truth Alone Triumphs)</span>
        </div>
        <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
          <span className="text-blue-500 font-bold">॥</span>
          <span className="tracking-wide">यतो धर्मस्ततो जयः</span>
          <span className="text-blue-500 font-bold">॥</span>
          <span className="text-[10px] text-slate-500 font-normal hidden sm:inline">(Where Justice Prevails, Victory Follows)</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
          <span className="text-amber-500 font-bold">॥</span>
          <span className="tracking-wide">मा गृधः कस्यस्विद्धनम्</span>
          <span className="text-amber-500 font-bold">॥</span>
          <span className="text-[10px] text-slate-500 font-normal hidden sm:inline">(Do Not Covet Another&apos;s Wealth)</span>
        </div>
      </div>

      {/* 2. HERO BRANDING & CIVIC AUTHORITY CREST */}
      <section className="max-w-4xl mx-auto mb-8 text-center space-y-4 relative z-10 no-print">
        
        {/* SOVEREIGN ARTICLE 1 IDENTITY CREST */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs font-mono shadow-md backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
          <span className="text-amber-400 font-semibold tracking-wider">INDIA</span>
          <span className="text-slate-600 font-bold">•</span>
          <span className="text-slate-200 font-medium italic tracking-wide">that is BHARAT</span>
          <span className="text-slate-600 font-bold">•</span>
          <span className="text-emerald-400 font-semibold font-indic">भारत गणराज्य</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold font-mono text-white tracking-tight flex items-center justify-center gap-3">
          <span>NyayaPath</span> 
          <span className="text-emerald-400 font-normal font-indic">न्यायपथ</span>
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
          <Scale className="w-4 h-4 text-emerald-400" />
          <span>Pan-Bharat Citizen Grievance Intelligence</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400 font-normal">28 States & 8 Union Territories</span>
        </div>
        
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
      <div className="relative z-10">
        <GrievanceWizard initialLang={initialLang} />
      </div>
      
      {/* 6. INSTITUTIONAL FOOTER */}
      <footer className="max-w-4xl mx-auto mt-12 text-center border-t border-slate-800/60 pt-6 space-y-2 relative z-10 no-print">
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
