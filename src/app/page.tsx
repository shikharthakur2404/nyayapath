import GrievanceWizard from '@/components/GrievanceWizard';
import { Language } from '@/lib/translations';
import { LionCapitalEmblem, AshokaChakra, TricolorRibbon } from '@/components/NationalEmblem';
import { ShieldCheck, PhoneCall, CheckCircle2 } from 'lucide-react';

interface PageProps {
  searchParams: Promise<{ lang?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const rawLang = params?.lang || 'en';
  const validLanguages: Language[] = ['en', 'hi', 'pa', 'mr', 'bn', 'ta', 'te', 'gu', 'kn'];
  const initialLang: Language = validLanguages.includes(rawLang as Language) ? (rawLang as Language) : 'en';

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#061026] via-[#091b3f] to-[#050e24] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* 1. NATIONAL TRICOLOR TOP RIBBON (TIRANGA) */}
      <TricolorRibbon height="h-2" />

      <div className="py-4 sm:py-6 px-3 sm:px-6 relative max-w-7xl mx-auto w-full pb-safe">
        {/* MAJESTIC CIVIC WATERMARK (LION CAPITAL & ASHOKA CHAKRA - HIGH-TRUST PSYCHOLOGY) */}
        <div className="fixed inset-0 pointer-events-none select-none flex flex-col justify-between items-center p-4 sm:p-6 opacity-[0.04] z-0 overflow-hidden text-amber-200 text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.35em] uppercase text-center">
          <div className="flex items-center gap-2 sm:gap-3 truncate max-w-full">
            <span>॥ सत्यमेव जयते</span>
            <span>•</span>
            <span>भारत गणराज्य • REPUBLIC OF INDIA</span>
            <span>•</span>
            <span>यतो धर्मस्ततो जयः ॥</span>
          </div>
          <div className="relative flex items-center justify-center my-auto">
            <AshokaChakra className="w-64 h-64 sm:w-[420px] sm:h-[420px] max-w-full text-blue-400 animate-spin-slow opacity-90" strokeWidth={0.8} />
          </div>
          <div className="truncate max-w-full">॥ JUSTICE • LIBERTY • EQUALITY • FRATERNITY • नागरिक सशक्तिकरण ॥</div>
        </div>

        {/* 2. OFFICIAL CIVIC HEADER: EMBLEM, AUTHORITY & CITIZEN HELPLINES */}
        <header className="relative z-10 max-w-4xl mx-auto mb-4 sm:mb-6 p-3 sm:p-4 rounded-2xl bg-[#091738]/95 border border-blue-800/60 backdrop-blur-md shadow-xl shadow-blue-950/50 flex flex-col sm:flex-row items-center sm:justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-slate-200 no-print">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <LionCapitalEmblem className="w-8 h-10 sm:w-9 sm:h-12 text-amber-400 shrink-0" fill="#f59e0b" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="font-bold text-white text-base sm:text-lg tracking-tight">NyayaPath</span>
                <span className="text-amber-400 font-indic font-bold text-base sm:text-lg">न्यायपथ</span>
                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded bg-blue-900/60 border border-blue-700/60 text-blue-200 font-semibold">
                  भारत • INDIA
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 font-indic leading-snug truncate sm:whitespace-normal">
                राष्ट्रीय नागरिक शिकायत निवारण मंच • National Citizen Grievance Portal
              </p>
            </div>
          </div>
          
          {/* CIVIC HELPLINES - ONE-TOUCH PHONE DIALERS ON MOBILE */}
          <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2.5 text-[11px] sm:text-xs w-full sm:w-auto shrink-0">
            <a 
              href="tel:112"
              className="flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 border border-blue-800/60 text-slate-200 transition-colors"
              title="Call Emergency 112"
            >
              <PhoneCall className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">आपात: <strong className="text-white">112</strong></span>
            </a>
            <a 
              href="tel:1930"
              className="flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 border border-blue-800/60 text-slate-200 transition-colors"
              title="Call Cyber Crime 1930"
            >
              <span className="truncate">साइबर: <strong className="text-white">1930</strong></span>
            </a>
            <a 
              href="tel:15100"
              className="flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 border border-blue-800/60 text-slate-200 transition-colors"
              title="Call Legal Aid 15100"
            >
              <span className="truncate">विधिक: <strong className="text-white">15100</strong></span>
            </a>
          </div>
        </header>

        {/* 3. NATIONAL HERO BANNER: HIGH-TRUST PSYCHOLOGY */}
        <section className="relative z-10 max-w-3xl mx-auto mb-5 sm:mb-6 text-center space-y-3.5 sm:space-y-4 no-print px-1">
          {/* NATIONAL TRUST BADGE */}
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#0d2047]/90 border border-amber-500/40 text-[11px] sm:text-xs text-amber-200 shadow-md max-w-full">
            <LionCapitalEmblem className="w-3.5 h-4 sm:w-4 sm:h-5 text-amber-400 shrink-0" fill="#f59e0b" />
            <span className="font-bold text-amber-300">॥ सत्यमेव जयते ॥</span>
            <span className="text-slate-500">•</span>
            <span className="font-semibold text-slate-100">भ्रष्टाचार मुक्त भारत • सबका साथ, सबका न्याय</span>
          </div>
          
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-indic text-white tracking-tight leading-snug sm:leading-tight break-words">
            सरकारी काम में रिश्वत, देरी या सुनवाई न होने पर — सीधे अपनी कानूनी अर्जी बनाएं
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-slate-200 font-indic max-w-2xl mx-auto leading-relaxed">
            पटवारी द्वारा पैसे मांगना, राशन डीलर द्वारा अनाज रोकना, थाने में FIR न लिखना या पेंशन में अड़चन — अपनी भाषा में बोलकर या लिखकर बताएं। NyayaPath सही सरकारी विभाग के नाम मान्य कानूनी अर्जी तैयार करेगा।
          </p>

          {/* 4 REASSURING PILLARS FOR CITIZEN CONFIDENCE */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 sm:gap-2.5 pt-1 text-[11px] sm:text-xs font-indic text-slate-200">
            <span className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-[#0c1d42] border border-blue-700/60 text-blue-200 font-semibold flex items-center justify-center gap-1.5 shadow-sm text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>CPGRAMS व NALSA मानक</span>
            </span>
            <span className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-[#0d261e] border border-emerald-700/60 text-emerald-200 font-semibold flex items-center justify-center gap-1.5 shadow-sm text-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>100% नि:शुल्क सेवा</span>
            </span>
            <span className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-[#271d0e] border border-amber-700/60 text-amber-200 font-semibold flex items-center justify-center gap-1.5 shadow-sm text-center">
              <span>✓ नो लॉगिन / नो फोन नंबर</span>
            </span>
            <span className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-[#0c1d42] border border-blue-700/60 text-slate-200 font-semibold flex items-center justify-center gap-1.5 shadow-sm text-center">
              <span>✓ शून्य डेटा संचय (DPDPA)</span>
            </span>
          </div>

          {/* 3-STEP TRICOLOR ROADMAP */}
          <div className="pt-2">
            <div className="p-3.5 sm:p-5 rounded-2xl bg-[#091738]/90 border border-blue-800/60 text-left shadow-xl">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>3 आसान चरणों में आपकी कानूनी अर्जी तैयार:</span>
                </span>
                <span className="text-[11px] sm:text-xs text-slate-300 font-medium">
                  समय: 2 मिनट
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {/* STEP 1: KESARIYA / SAFFRON ACCENT */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-[#141829] border border-amber-500/40 flex items-start gap-3 shadow-sm hover:border-amber-400 transition-colors">
                  <span className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 text-xs sm:text-sm font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm">1</span>
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-bold text-amber-200 font-indic">1. क्या हुआ?</p>
                    <p className="text-xs sm:text-sm text-slate-300 leading-snug mt-0.5 font-indic">माइक दबाकर बोलें या लिखें।</p>
                  </div>
                </div>

                {/* STEP 2: ASHOKA NAVY BLUE ACCENT */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-[#0f1d3d] border border-blue-500/50 flex items-start gap-3 shadow-sm hover:border-blue-400 transition-colors">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm">2</span>
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-bold text-blue-200 font-indic">2. सरकारी विभाग</p>
                    <p className="text-xs sm:text-sm text-slate-300 leading-snug mt-0.5 font-indic">AI सही विभाग व कानून तय करेगा।</p>
                  </div>
                </div>

                {/* STEP 3: INDIA GREEN ACCENT */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-[#0d221c] border border-emerald-500/50 flex items-start gap-3 shadow-sm hover:border-emerald-400 transition-colors">
                  <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm">3</span>
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-bold text-emerald-200 font-indic">3. अर्जी तैयार!</p>
                    <p className="text-xs sm:text-sm text-slate-300 leading-snug mt-0.5 font-indic">जन सेवा केंद्र से प्रिंट निकालें, डाक से भेजें या ऑनलाइन जमा करें।</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* 4. INTERACTIVE GRIEVANCE WIZARD */}
        <GrievanceWizard initialLang={initialLang} />
        
        {/* 5. DIGNIFIED INSTITUTIONAL FOOTER */}
        <footer className="max-w-4xl mx-auto mt-12 text-center border-t border-blue-800/40 pt-6 space-y-2 no-print">
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-400 font-indic">
            <span className="text-amber-400 font-semibold">सत्यमेव जयते</span>
            <span>•</span>
            <span>DPDPA 2023 सुरक्षित</span>
            <span>•</span>
            <span>कोई डेटा सर्वर पर संचित नहीं</span>
            <span>•</span>
            <span>100% नि:शुल्क जन-सेवा पहल</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-indic max-w-2xl mx-auto leading-relaxed">
            न्यायपथ आम नागरिकों को विधिक सहायता व सरकारी अधिकारियों तक शिकायत पहुंचाने हेतु बनाया गया स्वतंत्र, निष्पक्ष लोक-हित मंच है।
          </p>
        </footer>
      </div>
    </main>
  );
}

