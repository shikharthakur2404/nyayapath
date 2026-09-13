'use client';

import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { generatePDF, printDocument } from '@/lib/pdfGenerator';
import { translations, languagesList, Language } from '@/lib/translations';
import { 
  ShieldAlert, 
  ChevronRight, 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Copy, 
  Check, 
  Printer, 
  RotateCcw,
  Languages,
  Flame,
  Clock,
  Briefcase,
  HelpCircle,
  Eye,
  FileCheck2,
  TrendingUp,
  PhoneCall,
  ListTodo,
  XCircle,
  Mic,
  MicOff,
  Volume2,
  Pause,
  Play,
  Square
} from 'lucide-react';

interface ClassificationResult {
  jurisdiction: string;
  state_or_ut?: string;
  target_authority: string;
  authority_portal_url: string;
  routing_explanation: string;
  readiness_score: number;
  missing_elements: string[];
  clarifying_questions: string[];
  timeline: string[];
  evidence_checklist: string[];
  whistleblower_eligible: boolean;
  emergency_danger_detected: boolean;
  emergency_guidance: string;
}

interface DraftResult {
  formal_draft: string;
  citizen_view: string;
  escalation_steps: string[];
  submission_checklist: string[];
}

interface GrievanceWizardProps {
  initialLang?: Language;
}

const speechLocaleMap: Record<Language, string | null> = {
  en: 'en-IN',
  hi: 'hi-IN',
  pa: null, // Note: Google Chrome & Apple Web Speech engines omit Punjabi (pa-IN / pa-Guru-IN)
  mr: 'mr-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
};

const ttsLocaleMap: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  pa: 'pa-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
  bilingual: 'en-IN',
};

const EMPTY_VOICES: SpeechSynthesisVoice[] = [];
let cachedVoices: SpeechSynthesisVoice[] = EMPTY_VOICES;
let isVoiceCacheInitialized = false;

function updateVoiceCache() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const current = window.speechSynthesis.getVoices();
    if (current && current.length > 0) {
      cachedVoices = current;
    }
  }
}

function subscribeVoices(callback: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return () => {};
  }
  const handler = () => {
    updateVoiceCache();
    callback();
  };
  window.speechSynthesis.addEventListener('voiceschanged', handler);
  return () => {
    window.speechSynthesis.removeEventListener('voiceschanged', handler);
  };
}

function getVoicesSnapshot(): SpeechSynthesisVoice[] {
  if (!isVoiceCacheInitialized) {
    updateVoiceCache();
    isVoiceCacheInitialized = true;
  }
  return cachedVoices;
}

function getServerVoicesSnapshot(): SpeechSynthesisVoice[] {
  return EMPTY_VOICES;
}

export default function GrievanceWizard({ initialLang = 'en' }: GrievanceWizardProps) {
  const [lang, setLang] = useState<Language>(initialLang);
  const [draftLang, setDraftLang] = useState<string>('en');
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [grievance, setGrievance] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  
  const [draftData, setDraftData] = useState<DraftResult | null>(null);
  const [activeTab, setActiveTab] = useState<'formal' | 'citizen' | 'escalation'>('formal');
  const [copied, setCopied] = useState(false);

  // Voice Input State (Step 2: Indic & English speech intake)
  const [isListening, setIsListening] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Feature detect SpeechRecognition cleanly on client
  const isSpeechSupported = useSyncExternalStore(
    () => () => {},
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => typeof window !== 'undefined' && Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition),
    () => false
  );

  // Audio Playback State (Step 4: Indic & English Draft Read-Back)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAudioPaused, setIsAudioPaused] = useState(false);
  const isAudioActive = isPlayingAudio || isAudioPaused;
  const currentChunkIndexRef = useRef(0);
  const chunksRef = useRef<string[]>([]);

  // Feature detect SpeechSynthesis cleanly on client
  const isSynthesisSupported = useSyncExternalStore(
    () => () => {},
    () => typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window,
    () => false
  );

  // Synchronize available device speech voices reactively with cached snapshots
  const voices = useSyncExternalStore(
    subscribeVoices,
    getVoicesSnapshot,
    getServerVoicesSnapshot
  );

  const getVoiceForLocale = (locale: string, baseLang: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voiceList = window.speechSynthesis.getVoices();
    if (!voiceList || voiceList.length === 0) return null;

    // 1. Exact match e.g. 'hi-IN' or 'en-IN'
    const exact = voiceList.find(
      (v) => v.lang.toLowerCase() === locale.toLowerCase() || v.lang.replace('_', '-').toLowerCase() === locale.toLowerCase()
    );
    if (exact) return exact;

    // 2. Base language match e.g. 'hi' or 'mr'
    const prefix = voiceList.find((v) => v.lang.toLowerCase().startsWith(baseLang.toLowerCase()));
    if (prefix) return prefix;

    // 3. Fallback for English
    if (baseLang === 'en' || baseLang === 'bilingual') {
      const enVoice = voiceList.find((v) => v.lang.toLowerCase().startsWith('en'));
      if (enVoice) return enVoice;
    }

    return null;
  };

  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // safe ignore
      }
    }
    chunksRef.current = [];
    currentChunkIndexRef.current = 0;
    setIsPlayingAudio(false);
    setIsAudioPaused(false);
  };

  const playChunk = (index: number, targetLang: string, voice: SpeechSynthesisVoice | null) => {
    if (index >= chunksRef.current.length) {
      stopAudio();
      return;
    }

    currentChunkIndexRef.current = index;
    const utterance = new SpeechSynthesisUtterance(chunksRef.current[index]);
    utterance.lang = targetLang;
    utterance.rate = 0.95;

    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => {
      playChunk(index + 1, targetLang, voice);
    };

    utterance.onerror = (e) => {
      if (e.error === 'canceled' || e.error === 'interrupted') return;
      stopAudio();
    };

    window.speechSynthesis.speak(utterance);
  };

  const startAudioPlayback = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    stopAudio();

    const targetLocale = ttsLocaleMap[draftLang] || 'en-IN';
    const voice = getVoiceForLocale(targetLocale, draftLang);

    const sentences = text
      .split(/([.?!।\n]+)/)
      .reduce<string[]>((acc, cur, idx, arr) => {
        if (idx % 2 === 0) {
          const punctuation = arr[idx + 1] || '';
          const full = (cur + punctuation).trim();
          if (full) acc.push(full);
        }
        return acc;
      }, []);

    if (sentences.length === 0) return;

    chunksRef.current = sentences;
    setIsPlayingAudio(true);
    setIsAudioPaused(false);
    playChunk(0, targetLocale, voice);
  };

  const pauseAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.pause();
        setIsAudioPaused(true);
      } catch {
        // safe ignore
      }
    }
  };

  const resumeAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
        setIsAudioPaused(false);
      } catch {
        // safe ignore
      }
    }
  };

  const handleTabChange = (tab: 'formal' | 'citizen' | 'escalation') => {
    if (tab !== 'citizen') {
      stopAudio();
    }
    setActiveTab(tab);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          // safe ignore
        }
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // graceful ignore
        }
      }
    };
  }, []);

  // Sync document language attribute for accessibility and screen readers
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // graceful ignore
        }
      }
      setIsListening(false);
      return;
    }

    setErrorMessage(null);

    // Feature detect
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setErrorMessage('Voice input is not supported in your current browser. You can type your grievance directly below.');
      return;
    }

    const targetLocale = speechLocaleMap[lang];
    if (!targetLocale) {
      setErrorMessage(`Voice intake in ${activeLangObj.native} (${activeLangObj.label}) is not supported by standard browser speech engines (Google/Apple). You can type directly below, or dictate in Hindi / English.`);
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognitionRef.current = recognition;

      // STEP 2: Indic & English speech recognition mapped to active language
      recognition.lang = targetLocale;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setGrievance((prev) => {
            const trimmed = prev.trim();
            return trimmed ? `${trimmed} ${transcript}` : transcript;
          });
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'no-speech' || event.error === 'aborted') {
          // Graceful silent reset if user tapped but paused or canceled
          return;
        }
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setErrorMessage('Microphone access was blocked. Please allow microphone permissions in your browser settings to speak, or type directly below.');
          return;
        }
        if (event.error === 'audio-capture') {
          setErrorMessage('No microphone hardware detected on this device. You can type your grievance directly below.');
          return;
        }
        if (event.error === 'network') {
          setErrorMessage('Speech service network error or unsupported dialect. You can still type your grievance directly below.');
          return;
        }
        if (event.error === 'language-not-supported') {
          const currentLangName = languagesList.find((l) => l.id === lang)?.native || lang;
          setErrorMessage(`Voice recognition for ${currentLangName} is not supported by your browser's speech engine. You can type your grievance directly below.`);
          return;
        }
        setErrorMessage(`Voice recognition issue (${event.error}). You can continue typing directly below.`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setErrorMessage('Could not initialize voice input. You can type directly below.');
    }
  };

  const t = translations[lang] || translations.en;
  const activeLangObj = languagesList.find((l) => l.id === lang) || languagesList[0];

  const currentDraftLangObj = languagesList.find((l) => l.id === draftLang);
  const draftLangNative = currentDraftLangObj ? currentDraftLangObj.native : (draftLang === 'bilingual' ? 'Bilingual' : 'English');
  const draftLangLabel = currentDraftLangObj ? currentDraftLangObj.label : (draftLang === 'bilingual' ? 'Bilingual' : 'English');

  const targetTtsLocale = ttsLocaleMap[draftLang] || 'en-IN';
  const hasVoiceForDraft = Boolean(
    draftLang === 'en' ||
    draftLang === 'bilingual' ||
    voices.some((v) => 
      v.lang.toLowerCase() === targetTtsLocale.toLowerCase() || 
      v.lang.replace('_', '-').toLowerCase() === targetTtsLocale.toLowerCase() ||
      v.lang.toLowerCase().startsWith(draftLang.toLowerCase())
    )
  );

  const handleAnalyze = async () => {
    if (!grievance.trim()) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grievance, language: lang })
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to analyze grievance');
      setClassification(data);
      setStep(2);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Analysis failed. Please check connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDraft = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          grievance, 
          answers, 
          jurisdictionInfo: classification,
          draftLanguage: draftLang
        })
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to generate legal draft');
      setDraftData(data);
      setStep(3);
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Drafting failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!draftData) return;
    const content = activeTab === 'citizen' ? draftData.citizen_view : draftData.formal_draft;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handlePrint = () => {
    if (draftData) {
      printDocument(draftData.formal_draft, 'NyayaPath_Formal_Complaint');
    } else {
      window.print();
    }
  };

  const handleRestart = () => {
    stopAudio();
    setStep(1);
    setGrievance('');
    setClassification(null);
    setAnswers({});
    setDraftData(null);
    setErrorMessage(null);
  };

  const handleDestroyCase = () => {
    if (confirm(t.destroyConfirm)) {
      stopAudio();
      setStep(1);
      setGrievance('');
      setClassification(null);
      setAnswers({});
      setDraftData(null);
      setErrorMessage(null);
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch {
        // Safe ignore
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto font-indic">
      {/* LANGUAGE SELECTOR & BURN BAG BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-2 no-print">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Languages className="w-4 h-4 text-emerald-500" />
          <span>Language / ਭਾਸ਼ਾ / भाषा:</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg overflow-x-auto max-w-[300px] sm:max-w-md scrollbar-none">
            {languagesList.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  if (isListening && recognitionRef.current) {
                    try {
                      recognitionRef.current.abort();
                    } catch {
                      // safe ignore
                    }
                    setIsListening(false);
                  }
                  setLang(l.id);
                  if (draftLang === 'en' && l.id !== 'en') setDraftLang(l.id);
                }}
                className={`px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap transition-colors cursor-pointer ${
                  lang === l.id 
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {l.native}
              </button>
            ))}
          </div>

          {(step > 1 || grievance.length > 0) && (
            <button
              onClick={handleDestroyCase}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-900/40 text-red-300 text-xs font-mono rounded-lg transition-colors cursor-pointer"
              title="Irreversibly purge all case state from this browser"
            >
              <Flame className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">{t.btnDestroy}</span>
            </button>
          )}
        </div>
      </div>

      {/* INLINE ERROR BANNER */}
      {errorMessage && (
        <div className="mb-4 p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs font-mono flex items-start justify-between gap-3 animate-in fade-in duration-200 no-print">
          <div className="flex items-start gap-2.5">
            <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
          <button 
            onClick={() => setErrorMessage(null)} 
            className="text-red-400 hover:text-white cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>
      )}

      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-sm no-print">
        {/* STEP 1: INTAKE */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <ShieldAlert className="w-6 h-6 text-emerald-500" />
              <h2 className="text-xl font-mono text-white">{t.intakeTitle}</h2>
            </div>
            <p className="text-sm text-slate-400 font-mono leading-relaxed">
              {t.intakeDesc}
            </p>

            {/* VOICE INPUT CONTROLS & PRIVACY DISCLOSURE */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2">
                {!isSpeechSupported ? (
                  <span className="text-[11px] font-mono text-slate-500">
                    Voice input not supported in this browser (typing available below)
                  </span>
                ) : !speechLocaleMap[lang] ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-amber-950/40 border border-amber-800/40 text-amber-300">
                    <MicOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Voice intake unavailable for {activeLangObj.native} in browser engines (type below or use हिन्दी / English)</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      isListening
                        ? 'bg-red-500/20 border border-red-500 text-red-300 animate-pulse font-bold'
                        : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200'
                    }`}
                    title={`Speak grievance in ${activeLangObj.label} (${activeLangObj.native})`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-3.5 h-3.5 text-red-400" />
                        <span>Listening ({activeLangObj.native})... (Tap to finish)</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Speak Grievance ({activeLangObj.native})</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <p className="text-[11px] font-mono text-slate-400/90">
                Voice audio is processed by your device&apos;s speech service (not stored by NyayaPath).
              </p>
            </div>

            <textarea
              value={grievance}
              onChange={(e) => setGrievance(e.target.value)}
              className="w-full h-48 bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-200 text-sm focus:border-emerald-500 focus:outline-none leading-relaxed"
              placeholder={t.placeholder}
              maxLength={4000}
            />
            <div className="flex justify-between items-center text-[11px] font-mono text-slate-500">
              <span>Zero-knowledge client processing</span>
              <span>{grievance.length} / 4000</span>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading || !grievance}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-mono rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer font-medium"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
              {t.btnAnalyze}
            </button>
          </div>
        )}

        {/* STEP 2: CLASSIFICATION, EXPLANABILITY & GAP-CLOSING */}
        {step === 2 && classification && (
          <div className="space-y-6">
            {/* EMERGENCY ALERT BANNER IF PHYSICAL DANGER DETECTED */}
            {classification.emergency_danger_detected && (
              <div className="bg-red-950/40 border border-red-800/80 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-red-400 font-mono font-bold text-sm">
                  <PhoneCall className="w-4 h-4" />
                  {t.emergencyTitle}
                </div>
                <p className="text-xs text-red-200 font-mono">
                  {classification.emergency_guidance}
                </p>
                <div className="flex flex-wrap gap-3 pt-2 text-[11px] font-mono text-red-300">
                  <span className="bg-red-900/40 px-2 py-1 rounded border border-red-800/50">{t.emergencyPolice}</span>
                  <span className="bg-red-900/40 px-2 py-1 rounded border border-red-800/50">{t.emergencyWomen}</span>
                  <span className="bg-red-900/40 px-2 py-1 rounded border border-red-800/50">{t.emergencyCyber}</span>
                </div>
              </div>
            )}

            {/* READINESS METER & SCORE */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between font-mono text-xs text-slate-300">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                  {t.readinessTitle}
                </span>
                <span className="font-bold text-emerald-400">{classification.readiness_score}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-700" 
                  style={{ width: `${Math.max(10, Math.min(100, classification.readiness_score))}%` }}
                />
              </div>
            </div>

            {/* EXPLAINABLE ROUTING RECOMMENDATION */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-emerald-400 font-mono text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> {t.detectedJurisdiction}
                </h3>
                {Boolean(classification.authority_portal_url) && (
                  <a 
                    href={classification.authority_portal_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs text-blue-400 hover:underline"
                  >
                    🔗 {t.officialPortal}
                  </a>
                )}
              </div>
              <p className="text-white text-base font-semibold">{classification.target_authority}</p>
              
              <div className="pt-2 border-t border-slate-800/60">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-mono block mb-1">
                  {t.routingWhyTitle}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {classification.routing_explanation}
                </p>
              </div>
            </div>

            {/* WHISTLEBLOWER NOTICE */}
            {classification.whistleblower_eligible && (
              <div className="bg-amber-950/30 border border-amber-900/50 p-4 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  {t.whistleblowerNotice}
                </p>
              </div>
            )}

            {/* TIMELINE & EVIDENCE MATRIX SPLIT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* TIMELINE */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg space-y-2">
                <h4 className="text-xs font-mono text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  {t.timelineTitle}
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {classification.timeline && classification.timeline.map((evt: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{evt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* EVIDENCE MATRIX */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg space-y-2">
                <h4 className="text-xs font-mono text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                  {t.evidenceMatrixTitle}
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {classification.evidence_checklist && classification.evidence_checklist.map((ev: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500">✓</span>
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CLARIFYING GAP-CLOSING QUESTIONS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white font-mono text-sm">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <h3>{t.clarifyingQuestionsTitle}</h3>
              </div>
              <p className="text-xs text-slate-400 font-mono">{t.clarifyingQuestionsDesc}</p>
              {classification.clarifying_questions && classification.clarifying_questions.map((q: string, idx: number) => (
                <div key={idx} className="space-y-2">
                  <label className="text-sm text-slate-300 block">{idx + 1}. {q}</label>
                  <input
                    type="text"
                    value={answers[idx] || ''}
                    onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-slate-200 text-sm focus:border-emerald-500 focus:outline-none"
                    maxLength={1000}
                  />
                </div>
              ))}
            </div>

            {/* DECOUPLED DRAFT OUTPUT LANGUAGE SELECTOR (ALL 9 LANGUAGES + BILINGUAL) */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg space-y-2.5">
              <label className="text-xs font-mono text-slate-300 block">{t.draftLangLabel}</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'en', label: 'English' },
                  { id: 'hi', label: 'हिन्दी (Hindi)' },
                  { id: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
                  { id: 'mr', label: 'मराठी (Marathi)' },
                  { id: 'bn', label: 'বাংলা (Bengali)' },
                  { id: 'ta', label: 'தமிழ் (Tamil)' },
                  { id: 'te', label: 'తెలుగు (Telugu)' },
                  { id: 'gu', label: 'ગુજરાતી (Gujarati)' },
                  { id: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
                  { id: 'bilingual', label: '🌐 Bilingual' }
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setDraftLang(option.id)}
                    className={`px-2.5 py-2 rounded text-xs font-mono text-center border transition-colors cursor-pointer ${
                      draftLang === option.id 
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-bold shadow-sm'
                        : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleDraft}
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-mono rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer font-medium"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileCheck2 className="w-5 h-5" />}
              {t.btnGenerateDraft}
            </button>
          </div>
        )}

        {/* STEP 3: DUAL REPRESENTATION VIEW, ESCALATION LADDER & EXPORT */}
        {step === 3 && draftData && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <h2 className="text-xl font-mono text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" /> {t.draftReadyTitle}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? t.btnCopied : t.btnCopy}
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Prints or saves A4 PDF using native vector fonts for 100% Indic glyph fidelity"
                >
                  <Printer className="w-3.5 h-3.5 text-blue-400" />
                  {t.btnPrint}
                </button>
                <button
                  onClick={() => generatePDF(draftData.formal_draft, 'NyayaPath_Formal_Complaint.pdf')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono rounded flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  {t.btnExportPdf}
                </button>
              </div>
            </div>

            {/* TAB NAVIGATION: FORMAL VIEW vs CITIZEN PLAIN VIEW vs ESCALATION LADDER */}
            <div className="flex items-center gap-2 border-b border-slate-800">
              <button
                onClick={() => handleTabChange('formal')}
                className={`pb-2 px-3 text-xs font-mono transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'formal'
                    ? 'border-emerald-500 text-emerald-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  {t.tabFormal}
                </span>
              </button>
              <button
                onClick={() => handleTabChange('citizen')}
                className={`pb-2 px-3 text-xs font-mono transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'citizen'
                    ? 'border-emerald-500 text-emerald-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  {t.tabCitizen}
                </span>
              </button>
              <button
                onClick={() => handleTabChange('escalation')}
                className={`pb-2 px-3 text-xs font-mono transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'escalation'
                    ? 'border-emerald-500 text-emerald-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <ListTodo className="w-3.5 h-3.5" />
                  {t.tabEscalation}
                </span>
              </button>
            </div>
            
            {/* TAB 1: FORMAL LEGAL DRAFT */}
            {activeTab === 'formal' && (
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 max-h-[60vh] overflow-y-auto">
                <pre className="text-slate-300 font-legal-serif text-sm whitespace-pre-wrap leading-relaxed">
                  {draftData.formal_draft}
                </pre>
              </div>
            )}

            {/* TAB 2: CITIZEN PLAIN VIEW */}
            {activeTab === 'citizen' && (
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 max-h-[60vh] overflow-y-auto space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-emerald-950/20 border border-emerald-900/40 rounded">
                  <div className="text-xs font-mono text-emerald-300">
                    💡 This section explains in everyday language what the formal statutory document asserts on your behalf.
                  </div>

                  {/* AUDIO PLAYBACK CONTROLS (STEP 4: INDIC & ENGLISH) */}
                  {isSynthesisSupported && (
                    <div className="flex items-center gap-2 shrink-0">
                      {!isAudioActive ? (
                        hasVoiceForDraft ? (
                          <button
                            type="button"
                            onClick={() => startAudioPlayback(draftData.citizen_view)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-mono transition-colors cursor-pointer font-medium shadow-sm"
                            title={`Listen to this explanation in ${draftLangLabel} (${draftLangNative})`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen ({draftLangNative})</span>
                          </button>
                        ) : (
                          <div
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400"
                            title={`Your device does not have an installed voice pack for ${draftLangLabel}. You can add Indic voices in your operating system settings.`}
                          >
                            <MicOff className="w-3 h-3 text-slate-500" />
                            <span>Audio unavailable for {draftLangNative} (no device voice)</span>
                          </div>
                        )
                      ) : (
                        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg">
                          <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 animate-pulse">
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{isAudioPaused ? 'Paused' : `Reading in ${draftLangNative}...`}</span>
                          </span>

                          {isAudioPaused ? (
                            <button
                              type="button"
                              onClick={resumeAudio}
                              className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                              title="Resume reading"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={pauseAudio}
                              className="p-1 text-slate-300 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                              title="Pause reading"
                            >
                              <Pause className="w-3.5 h-3.5 fill-current" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={stopAudio}
                            className="p-1 text-red-400 hover:text-red-300 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Stop reading"
                          >
                            <Square className="w-3 h-3 fill-current" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                  {draftData.citizen_view}
                </div>
              </div>
            )}

            {/* TAB 3: ESCALATION & SUBMISSION LADDER */}
            {activeTab === 'escalation' && (
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 max-h-[60vh] overflow-y-auto space-y-6">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-emerald-400 font-mono mb-3">
                    {t.submissionChecklistTitle}
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {draftData.submission_checklist && draftData.submission_checklist.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded border border-slate-800">
                        <span className="text-emerald-500 font-bold">□</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-wider text-blue-400 font-mono mb-3">
                    {t.tabEscalation}
                  </h4>
                  <div className="space-y-3">
                    {draftData.escalation_steps && draftData.escalation_steps.map((stepDesc: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 bg-slate-900/60 p-3 rounded border border-slate-800">
                        <div className="w-6 h-6 rounded-full bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center text-xs font-mono shrink-0">
                          {idx + 1}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {stepDesc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={handleRestart}
                className="text-xs text-slate-400 hover:text-white font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t.btnRestart}
              </button>
              <p className="text-[11px] text-slate-500 font-mono text-right">
                {t.zeroRetentionNotice}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* PRINT-ONLY VIEW FOR PRINTER/PDF EXPORT */}
      {draftData && (
        <div className="hidden print-only printable-document p-8">
          <pre className="whitespace-pre-wrap font-legal-serif text-black text-sm leading-relaxed">
            {draftData.formal_draft}
          </pre>
        </div>
      )}
    </div>
  );
}
