import GrievanceWizard from '@/components/GrievanceWizard';
import { Language } from '@/lib/translations';

interface PageProps {
  searchParams: Promise<{ lang?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const rawLang = params?.lang || 'en';
  const validLanguages: Language[] = ['en', 'hi', 'pa', 'mr', 'bn', 'ta', 'te', 'gu', 'kn'];
  const initialLang: Language = validLanguages.includes(rawLang as Language) ? (rawLang as Language) : 'en';

  return (
    <main className="min-h-screen bg-[#060913] py-10 px-4 selection:bg-emerald-500/30 selection:text-emerald-200">
      <div className="max-w-4xl mx-auto mb-8 text-center space-y-3 no-print">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-800/50 text-emerald-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Independent Citizen Grievance Intelligence</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold font-mono text-white tracking-tight">
          NyayaPath <span className="text-emerald-500 font-normal">न्यायपथ</span>
        </h1>
        
        <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-2xl mx-auto leading-relaxed">
          Transform complex administrative friction into structured, jurisdiction-routed legal complaints with evidence matrixing and escalation planning.
        </p>

        <div className="max-w-xl mx-auto p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/50 text-[11px] font-mono text-slate-500">
          ⚠️ Not a law firm, court, or government agency. Provides self-navigated administrative routing and complaint structuring under DPDPA 2023 zero-knowledge principles.
        </div>
      </div>
      
      <GrievanceWizard initialLang={initialLang} />
      
      <div className="max-w-4xl mx-auto mt-12 text-center border-t border-slate-800/50 pt-6 no-print">
        <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">
          DPDPA 2023 Compliant • Zero Cloud Database • Ephemeral Client Memory
        </p>
      </div>
    </main>
  );
}
