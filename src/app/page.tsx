import GrievanceWizard from '@/components/GrievanceWizard';
import CitizenFaq from '@/components/CitizenFaq';
import ThemeToggle from '@/components/ThemeToggle';
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
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 dark:bg-gradient-to-b dark:from-[#061026] dark:via-[#091b3f] dark:to-[#050e24] dark:text-slate-100 selection:bg-amber-500/30 selection:text-amber-900 dark:selection:text-amber-200 transition-colors duration-200">
      
      {/* 1. NATIONAL TRICOLOR TOP RIBBON (TIRANGA) */}
      <TricolorRibbon height="h-2" />

      {/* GOV.UK STYLE PHASE BANNER (PUBLIC CIVIC UTILITY) */}
      <div className="bg-slate-100 border-b border-slate-200 dark:bg-[#081538]/95 dark:border-blue-900/80 px-3 sm:px-6 py-1.5 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 no-print transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px] tracking-wider uppercase shrink-0">
              CIVIC UTILITY
            </span>
            <span className="truncate font-indic font-medium">
              न्यायपथ: राष्ट्रीय जन-शिकायत निवारण मंच (CPGRAMS, NALSA व उपभोक्ता संरक्षण मानक)
            </span>
          </div>
          <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>100% नि:शुल्क लोक सेवा • शून्य डेटा संचय</span>
          </span>
        </div>
      </div>

      <div className="py-4 sm:py-6 px-3 sm:px-6 relative max-w-7xl mx-auto w-full pb-safe">
        {/* MAJESTIC CIVIC WATERMARK (LION CAPITAL & ASHOKA CHAKRA - HIGH-TRUST PSYCHOLOGY) */}
        <div className="fixed inset-0 pointer-events-none select-none flex flex-col justify-between items-center p-4 sm:p-6 opacity-[0.03] dark:opacity-[0.04] z-0 overflow-hidden text-slate-900 dark:text-amber-200 text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.35em] uppercase text-center">
          <div className="flex items-center gap-2 sm:gap-3 truncate max-w-full">
            <span>॥ सत्यमेव जयते</span>
            <span>•</span>
            <span>भारत गणराज्य • REPUBLIC OF INDIA</span>
            <span>•</span>
            <span>यतो धर्मस्ततो जयः ॥</span>
          </div>
          <div className="relative flex items-center justify-center my-auto">
            <AshokaChakra className="w-64 h-64 sm:w-[420px] sm:h-[420px] max-w-full text-blue-900 dark:text-blue-400 animate-spin-slow opacity-20 dark:opacity-90" strokeWidth={0.8} />
          </div>
          <div className="truncate max-w-full">॥ JUSTICE • LIBERTY • EQUALITY • FRATERNITY • नागरिक सशक्तिकरण ॥</div>
        </div>

        {/* 2. OFFICIAL CIVIC HEADER: EMBLEM, AUTHORITY, THEME TOGGLE & CITIZEN HELPLINES */}
        <header className="relative z-10 max-w-4xl mx-auto mb-4 sm:mb-6 p-3 sm:p-4 rounded-2xl bg-white/95 dark:bg-[#091738]/95 border border-slate-200 dark:border-blue-800/60 backdrop-blur-md shadow-lg shadow-slate-200/50 dark:shadow-xl dark:shadow-blue-950/50 flex flex-col sm:flex-row items-center sm:justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-slate-700 dark:text-slate-200 no-print transition-colors">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <LionCapitalEmblem className="w-8 h-10 sm:w-9 sm:h-12 text-amber-500 dark:text-amber-400 shrink-0 drop-shadow-sm" fill="#f59e0b" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="font-bold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight">NyayaPath</span>
                <span className="text-amber-600 dark:text-amber-400 font-indic font-bold text-base sm:text-lg">न्यायपथ</span>
                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/60 border border-blue-200 dark:border-blue-700/60 text-blue-800 dark:text-blue-200 font-semibold">
                  भारत • INDIA
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 font-indic leading-snug truncate sm:whitespace-normal">
                राष्ट्रीय नागरिक शिकायत निवारण मंच • National Citizen Grievance Portal
              </p>
            </div>
          </div>
          
          {/* THEME TOGGLE & CIVIC HELPLINES */}
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto shrink-0 flex-wrap">
            <ThemeToggle />
            
            {/* ONE-TOUCH PHONE DIALERS */}
            <div className="grid grid-cols-3 sm:flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs flex-1 sm:flex-none">
              <a 
                href="tel:112"
                className="flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-blue-950/80 dark:hover:bg-blue-900 border border-slate-300 dark:border-blue-800/60 text-slate-700 dark:text-slate-200 transition-colors"
                title="Call Emergency 112"
              >
                <PhoneCall className="w-3 h-3 text-amber-500 dark:text-amber-400 shrink-0" />
                <span className="truncate">आपात: <strong className="text-slate-900 dark:text-white">112</strong></span>
              </a>
              <a 
                href="tel:1930"
                className="flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-blue-950/80 dark:hover:bg-blue-900 border border-slate-300 dark:border-blue-800/60 text-slate-700 dark:text-slate-200 transition-colors"
                title="Call Cyber Crime 1930"
              >
                <span className="truncate">साइबर: <strong className="text-slate-900 dark:text-white">1930</strong></span>
              </a>
              <a 
                href="tel:15100"
                className="flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-blue-950/80 dark:hover:bg-blue-900 border border-slate-300 dark:border-blue-800/60 text-slate-700 dark:text-slate-200 transition-colors"
                title="Call Legal Aid 15100"
              >
                <span className="truncate">विधिक: <strong className="text-slate-900 dark:text-white">15100</strong></span>
              </a>
            </div>
          </div>
        </header>

        {/* 3. NATIONAL HERO BANNER: HIGH-TRUST PSYCHOLOGY */}
        <section className="relative z-10 max-w-3xl mx-auto mb-5 sm:mb-6 text-center space-y-3.5 sm:space-y-4 no-print px-1">
          {/* NATIONAL TRUST BADGE */}
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-amber-50 dark:bg-[#0d2047]/90 border border-amber-300/80 dark:border-amber-500/40 text-[11px] sm:text-xs text-amber-900 dark:text-amber-200 shadow-sm dark:shadow-md max-w-full transition-colors">
            <LionCapitalEmblem className="w-3.5 h-4 sm:w-4 sm:h-5 text-amber-500 dark:text-amber-400 shrink-0" fill="#f59e0b" />
            <span className="font-bold text-amber-700 dark:text-amber-300">॥ सत्यमेव जयते ॥</span>
            <span className="text-slate-400 dark:text-slate-500">•</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">भ्रष्टाचार मुक्त भारत • सबका साथ, सबका न्याय</span>
          </div>
          
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-indic text-slate-900 dark:text-white tracking-tight leading-snug sm:leading-tight break-words">
            सरकारी काम में रिश्वत, देरी या सुनवाई न होने पर — सीधे अपनी कानूनी अर्जी बनाएं
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-200 font-indic max-w-2xl mx-auto leading-relaxed">
            पटवारी द्वारा पैसे मांगना, राशन डीलर द्वारा अनाज रोकना, थाने में FIR न लिखना या पेंशन में अड़चन — अपनी भाषा में बोलकर या लिखकर बताएं। NyayaPath सही सरकारी विभाग के नाम मान्य कानूनी अर्जी तैयार करेगा।
          </p>

          {/* 4 REASSURING PILLARS FOR CITIZEN CONFIDENCE */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 sm:gap-2.5 pt-1 text-[11px] sm:text-xs font-indic">
            <span className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-[#0c1d42] border border-blue-200 dark:border-blue-700/60 text-blue-900 dark:text-blue-200 font-semibold flex items-center justify-center gap-1.5 shadow-xs text-center transition-colors">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>CPGRAMS व NALSA मानक</span>
            </span>
            <span className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-[#0d261e] border border-emerald-200 dark:border-emerald-700/60 text-emerald-900 dark:text-emerald-200 font-semibold flex items-center justify-center gap-1.5 shadow-xs text-center transition-colors">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>100% नि:शुल्क सेवा</span>
            </span>
            <span className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-[#271d0e] border border-amber-200 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 font-semibold flex items-center justify-center gap-1.5 shadow-xs text-center transition-colors">
              <span>✓ नो लॉगिन / नो फोन नंबर</span>
            </span>
            <span className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#0c1d42] border border-slate-200 dark:border-blue-700/60 text-slate-800 dark:text-slate-200 font-semibold flex items-center justify-center gap-1.5 shadow-xs text-center transition-colors">
              <span>✓ शून्य डेटा संचय (DPDPA)</span>
            </span>
          </div>

          {/* 3-STEP TRICOLOR ROADMAP */}
          <div className="pt-2">
            <div className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-[#091738]/90 border border-slate-200 dark:border-blue-800/60 text-left shadow-md shadow-slate-200/50 dark:shadow-xl transition-colors">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-amber-700 dark:text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>3 आसान चरणों में आपकी कानूनी अर्जी तैयार:</span>
                </span>
                <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-300 font-medium">
                  समय: 2 मिनट
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {/* STEP 1: KESARIYA / SAFFRON ACCENT */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-amber-50/70 dark:bg-[#141829] border border-amber-200 dark:border-amber-500/40 flex items-start gap-3 shadow-xs hover:border-amber-400 transition-colors">
                  <span className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 text-xs sm:text-sm font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">1</span>
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-bold text-amber-900 dark:text-amber-200 font-indic">1. क्या हुआ?</p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-snug mt-0.5 font-indic">माइक दबाकर बोलें या लिखें।</p>
                  </div>
                </div>

                {/* STEP 2: ASHOKA NAVY BLUE ACCENT */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-blue-50/70 dark:bg-[#0f1d3d] border border-blue-200 dark:border-blue-500/50 flex items-start gap-3 shadow-xs hover:border-blue-400 transition-colors">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">2</span>
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-bold text-blue-900 dark:text-blue-200 font-indic">2. सरकारी विभाग</p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-snug mt-0.5 font-indic">AI सही विभाग व कानून तय करेगा।</p>
                  </div>
                </div>

                {/* STEP 3: INDIA GREEN ACCENT */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-emerald-50/70 dark:bg-[#0d221c] border border-emerald-200 dark:border-emerald-500/50 flex items-start gap-3 shadow-xs hover:border-emerald-400 transition-colors">
                  <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">3</span>
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-bold text-emerald-900 dark:text-emerald-200 font-indic">3. अर्जी तैयार!</p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-snug mt-0.5 font-indic">जन सेवा केंद्र से प्रिंट निकालें, डाक से भेजें या ऑनलाइन जमा करें।</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* 4. INTERACTIVE GRIEVANCE WIZARD */}
        <GrievanceWizard initialLang={initialLang} />

        {/* 5. CITIZEN RIGHTS & STATUTORY SAFEGUARDS FAQ (DIGILOCKER / CPGRAMS ACCORDION) */}
        <CitizenFaq lang={initialLang} />
        
        {/* 6. DIGNIFIED INSTITUTIONAL FOOTER */}
        <footer className="max-w-4xl mx-auto mt-12 text-center border-t border-slate-200 dark:border-blue-800/40 pt-6 space-y-2 no-print transition-colors">
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-indic">
            <span className="text-amber-600 dark:text-amber-400 font-semibold">सत्यमेव जयते</span>
            <span>•</span>
            <span>DPDPA 2023 सुरक्षित</span>
            <span>•</span>
            <span>कोई डेटा सर्वर पर संचित नहीं</span>
            <span>•</span>
            <span>100% नि:शुल्क जन-सेवा पहल</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-indic max-w-2xl mx-auto leading-relaxed">
            न्यायपथ आम नागरिकों को विधिक सहायता व सरकारी अधिकारियों तक शिकायत पहुंचाने हेतु बनाया गया स्वतंत्र, निष्पक्ष लोक-हित मंच है।
          </p>
        </footer>
      </div>
    </main>
  );
}

