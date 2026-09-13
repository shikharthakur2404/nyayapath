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
      
      {/* BACKGROUND BHARAT / INDIA MOTIF & CONSTITUTIONAL WATERMARK (NEUTRAL, CALM, ZERO CLUTTER) */}
      <div className="fixed inset-0 pointer-events-none select-none flex flex-col justify-between items-center p-6 opacity-[0.025] z-0 overflow-hidden text-slate-300 font-mono text-xs tracking-[0.35em] uppercase text-center">
        <div>॥ सत्यमेव जयते • RECOGNISED CITIZEN ACTION • भारत गणराज्य ॥</div>
        <svg
          className="w-96 h-96 max-w-full text-slate-100 animate-spin-slow"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
        >
          <circle cx="50" cy="50" r="45" />
          <circle cx="50" cy="50" r="41" strokeDasharray="1.5 1.5" />
          <circle cx="50" cy="50" r="8" fill="currentColor" fillOpacity="0.3" />
          {/* 24 Ashoka Chakra Spokes */}
          {Array.from({ length: 24 }).map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2="50"
              y2="9"
              transform={`rotate(${i * 15} 50 50)`}
            />
          ))}
        </svg>
        <div>॥ यतो धर्मस्ततो जयः • JUSTICE • EQUALITY • LIBERTY • FRATERNITY ॥</div>
      </div>

      {/* 1. CALM TOP BAR: CIVIC IDENTITY & ESSENTIAL HELPLINES */}
      <header className="relative z-10 max-w-4xl mx-auto mb-6 p-3 rounded-xl bg-slate-900/50 border border-slate-800/70 backdrop-blur-sm flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-mono text-slate-300 no-print">
        <div className="flex items-center gap-2.5 text-slate-200">
          <Scale className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-bold text-white text-sm sm:text-base tracking-tight">NyayaPath</span>
          <span className="text-emerald-400 font-indic font-semibold text-sm sm:text-base">न्यायपथ</span>
          <span className="text-slate-700">•</span>
          <span className="text-xs sm:text-sm text-slate-400">Bharat • India</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 text-xs sm:text-sm text-slate-300">
          <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Emergency: <strong className="text-white">112</strong></span>
          <span className="text-slate-700">•</span>
          <span>Cyber: <strong className="text-white">1930</strong></span>
          <span className="text-slate-700">•</span>
          <span>Legal Aid: <strong className="text-white">15100</strong></span>
        </div>
      </header>

      {/* 2. MINIMAL, CALM HERO (ACCESSIBLE TO EVERY CITIZEN) */}
      <section className="relative z-10 max-w-3xl mx-auto mb-6 text-center space-y-4 no-print">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-xs sm:text-sm font-mono text-slate-200">
          <span className="text-emerald-400 font-bold">॥</span>
          <span className="font-semibold text-emerald-400">सत्यमेव जयते</span>
          <span className="text-emerald-400 font-bold">॥</span>
          <span className="text-slate-600">•</span>
          <span>हर नागरिक का अधिकार • Free Help For Everyone</span>
        </div>
        
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-mono text-white tracking-tight leading-snug sm:leading-tight">
          सरकारी काम में रिश्वत, देरी या सुनवाई न होने पर — सीधे अपनी अर्जी बनाएं
        </h1>
        
        <p className="text-sm sm:text-lg text-slate-200 font-mono max-w-2xl mx-auto leading-relaxed">
          पटवारी द्वारा पैसे मांगना, राशन डीलर द्वारा अनाज रोकना या थाने में FIR न लिखना — बस अपनी भाषा में बोलकर या लिखकर बताएं। NyayaPath सही कानूनी अर्जी तैयार करेगा।
        </p>

        {/* 4 PROMISES TO NERVOUS/FIRST-TIME CITIZENS */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1 text-xs sm:text-sm font-mono text-slate-300">
          <span className="px-3 py-1.5 rounded-md bg-slate-900/60 border border-slate-800/80 text-emerald-300 font-semibold">
            ✓ 100% नि:शुल्क (Free For All)
          </span>
          <span className="px-3 py-1.5 rounded-md bg-slate-900/60 border border-slate-800/80 text-blue-300 font-semibold">
            ✓ फोन नंबर या लॉगिन की जरूरत नहीं
          </span>
          <span className="px-3 py-1.5 rounded-md bg-slate-900/60 border border-slate-800/80 text-amber-300 font-semibold">
            ✓ कोई भी डेटा सर्वर पर सेव नहीं होता
          </span>
          <span className="px-3 py-1.5 rounded-md bg-slate-900/60 border border-slate-800/80 text-purple-300 font-semibold">
            ✓ 9 भारतीय भाषाओं में बोलें या सुनें
          </span>
        </div>

        {/* CHHOTA SA GUIDING SYSTEM (3-STEP VISUAL ROADMAP FOR FAST UNDERSTANDING) */}
        <div className="pt-2">
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/50 border border-slate-800/70 text-left">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs sm:text-sm font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span>💡 3 आसान कदमों में आपकी अर्जी तैयार:</span>
              </span>
              <span className="text-xs sm:text-sm font-mono text-slate-300 font-medium">
                समय: केवल 2 मिनट
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <div>
                  <p className="text-sm sm:text-base font-bold text-slate-100 font-mono">1. क्या हुआ?</p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-snug mt-0.5">माइक दबाकर बोलें या लिखें। कानून की धाराओं की चिंता न करें।</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs sm:text-sm font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div>
                  <p className="text-sm sm:text-base font-bold text-slate-100 font-mono">2. सरकारी दफ्तर</p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-snug mt-0.5">AI सही सरकारी विभाग व जरूरी नियम खुद ढूंढेगा।</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs sm:text-sm font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <div>
                  <p className="text-sm sm:text-base font-bold text-slate-100 font-mono">3. अर्जी तैयार!</p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-snug mt-0.5">जन सेवा केंद्र से प्रिंट निकालें या ऑनलाइन जमा करें।</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 3. INTERACTIVE GRIEVANCE WIZARD */}
      <GrievanceWizard initialLang={initialLang} />
      
      {/* 4. CALM INSTITUTIONAL FOOTER */}
      <footer className="max-w-4xl mx-auto mt-12 text-center border-t border-slate-800/60 pt-6 space-y-2 no-print">
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-mono text-slate-400">
          <span>DPDPA 2023 सुरक्षित</span>
          <span>•</span>
          <span>कोई डेटा सर्वर पर सेव नहीं होता</span>
          <span>•</span>
          <span>100% नि:शुल्क जन-सेवा</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-2xl mx-auto leading-relaxed">
          न्यायपथ आम नागरिकों की सहायता हेतु बनाया गया स्वतंत्र लोक-हित मंच है।
        </p>
      </footer>
    </main>
  );
}
