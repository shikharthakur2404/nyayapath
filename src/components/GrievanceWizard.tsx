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
  Square,
  Scale,
  ShieldCheck,
  Landmark,
  Lock,
  Sparkles,
  ExternalLink,
  Compass,
  X
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

interface QuickScenario {
  id: string;
  icon: string;
  title: Record<string, string>;
  subtitle: Record<string, string>;
  template: Record<string, string>;
}

const QUICK_SCENARIOS: QuickScenario[] = [
  {
    id: 'bribe_mutation',
    icon: '🏛️',
    title: {
      en: 'Land Mutation / Bribe Demanded',
      hi: 'पटवारी / अफसर द्वारा रिश्वत मांगना',
      pa: 'ਇੰਤਕਾਲ / ਰਿਸ਼ਵਤ ਦੀ ਮੰਗ',
      mr: 'फेरफार / लाच मागणी',
      bn: 'নামজারি / ঘুষ দাবি',
      ta: 'பட்டா மாற்றம் / லஞ்சம்',
      te: 'మ్యुటేషన్ / లంచం',
      gu: 'જમીન નોંધણી / લાંચ',
      kn: 'ಖಾತೆ ಬದಲಾವಣೆ / ಲಂಚ'
    },
    subtitle: {
      en: 'Officer demanding unlawful cash for mutation or government work',
      hi: 'दाखिल-खारिज या सरकारी काम के लिए पैसों की अवैध मांग',
    },
    template: {
      en: 'The local revenue circle office (Patwari / Tehsildar) at [District / Tehsil Name] is demanding an unlawful cash gratification of ₹[Amount] for processing the land mutation (dakhil-kharij) application No. [Application Number] submitted on [Date]. Despite submitting all verified sale deed records and registry copies, the file has been intentionally kept pending for [Number] months without any written rejection notice or lawful cause.',
      hi: 'तहसील [तहसील/जिले का नाम] में नामांतरण / दाखिल-खारिज आवेदन संख्या [आवेदन संख्या] दिनांक [दिनांक] को प्रस्तुत किया गया था। समस्त वैधानिक रजिस्ट्री दस्तावेज संलग्न होने के बावजूद हलका पटवारी/राजस्व अधिकारी द्वारा कार्य आगे बढ़ाने के लिए ₹[राशि] की अनुचित रिश्वत की मांग की जा रही है तथा पिछले [महीने] महीनों से बिना किसी लिखित कारण के कार्य को लंबित रखा गया है।'
    }
  },
  {
    id: 'police_refusal',
    icon: '👮',
    title: {
      en: 'Police Refusing FIR / Complaint',
      hi: 'थाने में FIR दर्ज करने से मनाही',
      pa: 'ਪੁਲਿਸ ਵੱਲੋਂ FIR ਦਰਜ ਨਾ ਕਰਨਾ',
      mr: 'पोलीस ठाण्यात तक्रार नोंदवण्यास नकार',
      bn: 'থানায় এফআইআর নিতে অস্বীকার',
      ta: 'காவல்துறை FIR மறுப்பு',
      te: 'పోలీస్ FIR నమోదు నిరాకరణ',
      gu: 'પોલીસ ફરિયાદ ના નોંધવી',
      kn: 'ಪೊಲೀಸ್ ದೂರು ದಾಖಲಿಸದಿರುವುದು'
    },
    subtitle: {
      en: 'Police refusing written complaint or not giving receipt / GD number',
      hi: 'थाना प्रभारी द्वारा तहरीर लेने से इनकार या पर्ची न देना',
    },
    template: {
      en: 'On [Date] at approximately [Time], a cognizable offense occurred at [Location]. When I approached the Station House Officer (SHO) at [Police Station Name] to lodge a written First Information Report (FIR), the officers refused to accept my written complaint or issue a General Diary (GD) entry acknowledgment number, in direct violation of Section 173 of Bharatiya Nagarik Suraksha Sanhita (BNSS) / Section 154 CrPC and Supreme Court Lalita Kumari guidelines.',
      hi: 'दिनांक [दिनांक] को [स्थान] पर मेरे साथ संज्ञेय अपराध घटित हुआ। जब मैं लिखित प्राथमिकी (FIR) दर्ज कराने [थाने का नाम] पहुँचा, तो थाना प्रभारी/ड्यूटी अधिकारी ने लिखित तहरीर लेने और जीडी (GD) प्रविष्टि संख्या देने से साफ इनकार कर दिया, जो कि भारतीय नागरिक सुरक्षा संहिता की धारा 173 (पूर्व धारा 154 CrPC) तथा सर्वोच्च न्यायालय के ललिता कुमारी दिशा-निर्देशों का खुला उल्लंघन है।'
    }
  },
  {
    id: 'ration_pds',
    icon: '🌾',
    title: {
      en: 'Ration Not Given / Grain Withheld',
      hi: 'राशन नहीं मिल रहा / अनाज में कटौती',
      pa: 'ਰਾਸ਼ਨ ਡੀਲਰ ਵੱਲੋਂ ਕਟੌਤੀ ਜਾਂ ਇਨਕਾਰ',
      mr: 'रेशन धान्य न मिळणे / कपात',
      bn: 'রেশন সামগ্রী না দেওয়া',
      ta: 'ரேஷன் உணவு மறுப்பு',
      te: 'రేషన్ సరుకులు నిరాకరణ',
      gu: 'રેશન વિતરણમાં ગેરરીતિ',
      kn: 'ಪಡಿತರ ವಿತರಣೆ ನಿರಾಕರಣೆ'
    },
    subtitle: {
      en: 'Ration dealer denying quota or refusing receipt after thumb scan',
      hi: 'डीलर द्वारा अंगूठा लगवाने के बाद भी अनाज न देना',
    },
    template: {
      en: 'The Fair Price Shop (PDS Dealer) Licensee No. [FPS Number] located in [Village / Ward Name] has refused to distribute the monthly statutory grain quota for Ration Card No. [Card Number] for the months of [Months], falsely claiming offline POS machine failure while diverting subsidized public welfare grain to commercial open markets.',
      hi: 'उचित दर विक्रेता (राशन डीलर) दुकान संख्या [दुकान नंबर], वार्ड/ग्राम [ग्राम/वार्ड का नाम] द्वारा मेरे राशन कार्ड संख्या [राशन कार्ड नंबर] पर निर्धारित खाद्यान्न देने से लगातार मना किया जा रहा है। ई-पॉस (e-POS) मशीन में बायोमेट्रिक दर्ज कराने के बावजूद पर्ची नहीं दी जा रही है तथा राशन को अवैध रूप से खुले बाजार में बेचने की आशंका है।'
    }
  },
  {
    id: 'cyber_fraud',
    icon: '💳',
    title: {
      en: 'Online / UPI / Bank Account Fraud',
      hi: 'बैंक खाते से पैसे कट गए / ऑनलाइन ठगी',
      pa: 'ਬੈਂਕ ਖਾਤੇ ਵਿੱਚੋਂ ਧੋਖਾਧੜੀ',
      mr: 'खात्यातून परस्पर पैसे कपात / ऑनलाइन फसवणूक',
      bn: 'সাইবার আর্থিক প্রতারণা',
      ta: 'சைபர் நிதி மோசடி',
      te: 'సైబర్ ఆర్థిక మోసం',
      gu: 'સાયબર છેતરપિંડી',
      kn: 'ಸೈಬರ್ ಆರ್ಥಿಕ ವಂಚನೆ'
    },
    subtitle: {
      en: 'Unauthorized debit from bank account or UPI fraud',
      hi: 'खाते से बिना इजाजत पैसे कटना या ऑनलाइन धोखाधड़ी',
    },
    template: {
      en: 'On [Date] at [Time], an unauthorized fraudulent debit of ₹[Amount] was executed from my bank account No. [Account No / Bank Name] via UPI / Netbanking transaction reference [UTR / Transaction ID] under deceptive pretexts. The transaction was immediately reported to the bank customer care, but no immediate freeze or chargeback was initiated.',
      hi: 'दिनांक [दिनांक] को समय [समय] पर मेरे बैंक खाते संख्या [खाता संख्या, बैंक नाम] से बिना मेरी सहमति के यूपीआई / ऑनलाइन माध्यम से ₹[राशि] की अनधिकृत निकासी (ट्रांजैक्शन आईडी: [ID]) कर ली गई। घटना की सूचना तुरंत बैंक को दिए जाने के बावजूद खाते को फ्रीज करने अथवा राशि सुरक्षित करने में लापरवाही बरती जा रही है।'
    }
  }
];

interface GuideStepItem {
  step: string;
  badge: string;
  title: Record<string, string>;
  desc: Record<string, string>;
}

const GUIDE_STEPS: GuideStepItem[] = [
  {
    step: '01',
    badge: '1',
    title: {
      en: 'Tell What Happened (Speak or Type)',
      hi: 'समस्या बताएं (बोलें या लिखें)',
      pa: 'ਸਮੱਸਿਆ ਦੱਸੋ (ਬੋਲੋ ਜਾਂ ਲਿਖੋ)',
      mr: 'तक्रार सांगा (बोला किंवा लिहा)',
      bn: 'সমস্যা বলুন বা লিখুন',
      ta: 'பிரச்சனையை சொல்லுங்கள்',
      te: 'సమస్యను చెప్పండి',
      gu: 'સમસ્યા જણાવો',
      kn: 'ಸಮಸ್ಯೆ ತಿಳಿಸಿ'
    },
    desc: {
      en: 'Describe your issue in simple words. Click the microphone to speak in your language or select a common problem (Ration, Police, Bribes, or Bank Fraud).',
      hi: 'माइक दबाकर अपनी बोली में बोलें या संक्षेप में लिखें। राशन, रिश्वत, पुलिस FIR या बैंक ठगी जैसे विकल्प सीधे भी चुन सकते हैं।'
    }
  },
  {
    step: '02',
    badge: '2',
    title: {
      en: 'Find the Right Department',
      hi: 'सही सरकारी विभाग व दफ्तर',
      pa: 'ਸਹੀ ਸਰਕਾਰੀ ਵਿਭਾਗ',
      mr: 'योग्य सरकारी कार्यालय',
      bn: 'সঠিক সরকারি দপ্তর',
      ta: 'சரியான அரசு துறை',
      te: 'సరైన ప్రభుత్వ విభాగం',
      gu: 'સાચો સરકારી વિભાગ',
      kn: 'ಸರಿಯಾದ ಸರ್ಕಾರಿ ಇಲಾಖೆ'
    },
    desc: {
      en: 'NyayaPath automatically figures out which government office (like Vigilance, Lokayukta, District Magistrate, or Police) is required to take action.',
      hi: 'न्यायपथ खुद तय करेगा कि यह शिकायत किस सरकारी विभाग (जैसे सतर्कता आयोग, लोकायुक्त, डीएम या पुलिस) के पास जानी चाहिए।'
    }
  },
  {
    step: '03',
    badge: '3',
    title: {
      en: 'Make Your Complaint Strong',
      hi: 'शिकायत पक्की करें (2-3 सवाल)',
      pa: 'ਸ਼ਿਕਾਇਤ ਪੱਕੀ ਕਰੋ',
      mr: 'तक्रार पक्की करा',
      bn: 'অভিযোগ শক্ত করুন',
      ta: 'புகாரை உறுதிப்படுத்தவும்',
      te: 'ఫిర్యాదును పటిష్టం చేయండి',
      gu: 'ફરિયાદ પાકી કરો',
      kn: 'ದೂರು ಬಲಪಡಿಸಿ'
    },
    desc: {
      en: 'Answer 2-3 quick questions (like the date or receipt number) so no officer can delay or dismiss your complaint.',
      hi: 'केवल 2-3 आसान सवालों के जवाब दें (जैसे तारीख या रसीद नंबर) ताकि कोई भी अधिकारी अर्जी को टाल न सके।'
    }
  },
  {
    step: '04',
    badge: '4',
    title: {
      en: 'Print Letter & Submit',
      hi: 'अर्जी प्रिंट करें व जमा करें',
      pa: 'ਅਰਜ਼ੀ ਪ੍ਰਿੰਟ ਕਰੋ ਅਤੇ ਜਮ੍ਹਾਂ ਕਰੋ',
      mr: 'अर्जी प्रिंट करा आणि जमा करा',
      bn: 'দরখাস্ত প্রিন্ট ও জমা দিন',
      ta: 'மனுவை அச்சிட்டு சமர்ப்பிக்கவும்',
      te: 'దరఖాస్తు ప్రింట్ చేసి సమర్పించండి',
      gu: 'અરજી પ્રિન્ટ કરો અને જમા કરો',
      kn: 'ಅರ್ಜಿ ಪ್ರಿಂಟ್ ಮಾಡಿ ಸಲ್ಲಿಸಿ'
    },
    desc: {
      en: 'Print your formal letter at any local cyber cafe or Jan Seva Kendra (CSC), listen to the audio summary on your phone, and submit it to get an official stamped receipt.',
      hi: 'साइबर कैफे या जन सेवा केंद्र (CSC) से अर्जी का प्रिंट निकालें, फोन पर पूरा सारांश सुनें और दफ्तर में जमा करके मुहर लगी रसीद लें।'
    }
  }
];

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
  const [showGuide, setShowGuide] = useState(false);

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
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setShowGuide(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50 text-emerald-300 text-xs font-mono rounded-lg transition-colors cursor-pointer shadow-sm"
            title="How NyayaPath Works"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">
              {lang === 'hi' ? 'नागरिक मार्गदर्शिका' : lang === 'pa' ? 'ਗਾਈਡ' : lang === 'mr' ? 'मार्गदर्शक' : 'How It Works'}
            </span>
            <span className="sm:hidden">Guide</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg overflow-x-auto max-w-[200px] sm:max-w-md scrollbar-none">
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

      {/* 3-STEP INTERACTIVE CIVIC LEGAL WORKFLOW STEPPER */}
      <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-4 no-print">
        <button
          type="button"
          onClick={() => step > 1 && setStep(1)}
          disabled={step === 1}
          className={`p-3 rounded-xl border text-left transition-all ${
            step === 1
              ? 'bg-emerald-950/50 border-emerald-500/60 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/30'
              : step > 1
              ? 'bg-slate-900/60 border-slate-700/80 hover:border-emerald-500/40 cursor-pointer'
              : 'bg-slate-950/40 border-slate-900 opacity-60 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
              step === 1 
                ? 'bg-emerald-500 text-slate-950' 
                : step > 1 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                : 'bg-slate-800 text-slate-500'
            }`}>
              {step > 1 ? '✓' : '1'}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                {lang === 'hi' ? 'पहला कदम' : 'Step 1'}
              </p>
              <p className={`text-xs sm:text-sm font-semibold truncate ${step === 1 ? 'text-white' : 'text-slate-300'}`}>
                {lang === 'hi' ? '1. क्या हुआ?' : '1. What Happened?'}
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => step > 2 && setStep(2)}
          disabled={step < 2}
          className={`p-3 rounded-xl border text-left transition-all ${
            step === 2
              ? 'bg-emerald-950/50 border-emerald-500/60 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/30'
              : step > 2
              ? 'bg-slate-900/60 border-slate-700/80 hover:border-emerald-500/40 cursor-pointer'
              : 'bg-slate-950/40 border-slate-900 opacity-60 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
              step === 2 
                ? 'bg-emerald-500 text-slate-950' 
                : step > 2 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                : 'bg-slate-800 text-slate-500'
            }`}>
              {step > 2 ? '✓' : '2'}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                {lang === 'hi' ? 'दूसरा कदम' : 'Step 2'}
              </p>
              <p className={`text-xs sm:text-sm font-semibold truncate ${step === 2 ? 'text-white' : 'text-slate-300'}`}>
                {lang === 'hi' ? '2. सरकारी दफ्तर' : '2. Which Department?'}
              </p>
            </div>
          </div>
        </button>

        <div
          className={`p-3 rounded-xl border text-left transition-all ${
            step === 3
              ? 'bg-emerald-950/50 border-emerald-500/60 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/30'
              : 'bg-slate-950/40 border-slate-900 opacity-60'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
              step === 3 
                ? 'bg-emerald-500 text-slate-950' 
                : 'bg-slate-800 text-slate-500'
            }`}>
              3
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                {lang === 'hi' ? 'तीसरा कदम' : 'Step 3'}
              </p>
              <p className={`text-xs sm:text-sm font-semibold truncate ${step === 3 ? 'text-white' : 'text-slate-400'}`}>
                {lang === 'hi' ? '3. अर्जी तैयार!' : '3. Letter Ready!'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-sm no-print">
        {/* STEP 1: INTAKE */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-emerald-500 shrink-0" />
                <div>
                  <h2 className="text-xl font-mono text-white font-bold">{t.intakeTitle}</h2>
                  <p className="text-xs text-slate-400 font-mono">
                    {t.intakeDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* COMPACT FIRST-TIME CITIZEN GUIDE STRIP */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {lang === 'hi'
                    ? '3 आसान कदम: 1. समस्या बताएं → 2. सरकारी विभाग चुनें → 3. अर्जी प्रिंट करें या सुनें।'
                    : '3 Simple Steps: 1. Tell what happened → 2. Find right department → 3. Print or listen to letter.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(true)}
                className="text-emerald-400 hover:text-emerald-300 underline font-semibold cursor-pointer shrink-0"
              >
                {lang === 'hi' ? 'मार्गदर्शिका देखें (Guide) →' : 'How It Works →'}
              </button>
            </div>

            {/* QUICK SCENARIO STARTER TEMPLATE CHIPS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'hi' ? 'सीधे चुनने के लिए क्लिक करें (आम समस्याएं):' : 'Common Issues (Click to pick):'}</span>
                </span>
                {grievance.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setGrievance('')}
                    className="text-[11px] font-mono text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    {lang === 'hi' ? 'हटाएं (Clear)' : 'Clear'}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {QUICK_SCENARIOS.map((sc) => {
                  const title = sc.title[lang] || sc.title.en;
                  const sub = sc.subtitle[lang] || sc.subtitle.en;
                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => {
                        const tpl = sc.template[lang] || sc.template.en;
                        setGrievance(tpl);
                      }}
                      className="p-3 rounded-lg bg-slate-950/70 hover:bg-slate-900 border border-slate-800/80 hover:border-emerald-500/50 text-left transition-all cursor-pointer group shadow-sm hover:shadow-emerald-950/20"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base shrink-0">{sc.icon}</span>
                        <span className="text-xs font-mono font-semibold text-slate-200 group-hover:text-emerald-300 truncate">
                          {title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                        {sub}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ELEVATED STUDIO VOICE INTAKE BAR & PRIVACY EMBLEM */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 shadow-sm space-y-2">
              {isListening ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-red-950/40 border border-red-500/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-9 h-9 shrink-0">
                      <span className="w-9 h-9 rounded-full bg-red-500/40 animate-ping absolute" />
                      <span className="w-3.5 h-3.5 rounded-full bg-red-500" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-mono font-bold text-red-200 flex items-center gap-2">
                        <span>🔴 आपकी बात रिकॉर्ड हो रही है ({activeLangObj.native} • {activeLangObj.label})</span>
                      </p>
                      <p className="text-[11px] text-slate-300">
                        साफ-साफ बोलें। आपकी कही बात नीचे बॉक्स में अपने आप लिखी जा रही है।
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <MicOff className="w-4 h-4" />
                    <span>बोलना पूरा हुआ (बंद करें)</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <Mic className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                        <span>बोलकर बताएं (माइक दबाएं)</span>
                        <span className="text-[10px] font-normal text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                          {activeLangObj.native} ({activeLangObj.label})
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        लिखने में परेशानी हो रही है? माइक दबाकर सीधे अपनी भाषा में बोलें।
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!isSpeechSupported ? (
                      <span className="text-[11px] font-mono text-slate-500">
                        (इस ब्राउज़र में माइक उपलब्ध नहीं है — नीचे टाइप करें)
                      </span>
                    ) : !speechLocaleMap[lang] ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-amber-950/40 border border-amber-800/40 text-amber-300">
                        <MicOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{activeLangObj.native} में माइक उपलब्ध नहीं है (नीचे लिखें या हिन्दी चुनें)</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={toggleVoiceInput}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer font-bold shadow-md shadow-emerald-950/50"
                        title={`अपनी भाषा में बोलें (${activeLangObj.native})`}
                      >
                        <Mic className="w-4 h-4 text-white animate-pulse" />
                        <span>🎙️ माइक चालू करें</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <textarea
              value={grievance}
              onChange={(e) => setGrievance(e.target.value)}
              className="w-full h-48 bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-200 text-sm focus:border-emerald-500 focus:outline-none leading-relaxed shadow-inner"
              placeholder={t.placeholder}
              maxLength={4000}
            />
            <div className="flex justify-between items-center text-[11px] font-mono text-slate-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-500" />
                <span>100% सुरक्षित • केवल आपके फोन/कंप्यूटर पर (Zero-Retention)</span>
              </span>
              <span>{grievance.length} / 4000</span>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading || !grievance.trim()}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-mono rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer font-semibold shadow-md shadow-emerald-950/40"
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

            {/* READINESS METER & SCORE WITH QUALITATIVE APPRAISAL */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2.5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between font-mono text-xs text-slate-300 gap-2">
                <span className="flex items-center gap-2 text-emerald-400 font-bold">
                  <TrendingUp className="w-4 h-4" />
                  <span>{t.readinessTitle}</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono hidden sm:inline text-slate-300">
                    {classification.readiness_score >= 80 
                      ? (lang === 'hi' ? '✓ मजबूत शिकायत (अधिकारी टाल नहीं पाएंगे)' : '✓ Strong Complaint (Authorities cannot ignore)') 
                      : classification.readiness_score >= 50 
                      ? (lang === 'hi' ? '• अच्छी शिकायत — नीचे 2-3 जरूरी बातें और बताएं' : '• Good Merit — Clarify 2-3 points below') 
                      : (lang === 'hi' ? '⚠️ अधूरी शिकायत — खारिज होने से बचाने के लिए उत्तर दें' : '⚠️ Gaps Found — Answer below to prevent rejection')}
                  </span>
                  <span className="font-bold text-sm text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                    {classification.readiness_score}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    classification.readiness_score >= 75 
                      ? 'bg-emerald-500' 
                      : classification.readiness_score >= 50 
                      ? 'bg-amber-500' 
                      : 'bg-red-500'
                  }`} 
                  style={{ width: `${Math.max(10, Math.min(100, classification.readiness_score))}%` }}
                />
              </div>
            </div>

            {/* EXPLAINABLE ROUTING RECOMMENDATION (AUTHORITY DOSSIER CARD) */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center shrink-0">
                    <Landmark className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t.detectedJurisdiction}</span>
                    </div>
                    <h3 className="text-white text-base sm:text-lg font-bold tracking-tight">
                      {classification.target_authority}
                    </h3>
                  </div>
                </div>

                {Boolean(classification.authority_portal_url) && (
                  <a 
                    href={classification.authority_portal_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950/50 hover:bg-blue-900/60 border border-blue-800/60 text-blue-300 text-xs font-mono transition-colors font-semibold"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                    <span>{t.officialPortal}</span>
                  </a>
                )}
              </div>
              
              <div className="space-y-1.5">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono block font-semibold">
                  {t.routingWhyTitle}
                </span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-lg border border-slate-800/60">
                  {classification.routing_explanation}
                </p>
              </div>
            </div>

            {/* WHISTLEBLOWER NOTICE */}
            {classification.whistleblower_eligible && (
              <div className="bg-amber-950/30 border border-amber-900/50 p-4 rounded-xl flex items-start gap-3 shadow-sm">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  {t.whistleblowerNotice}
                </p>
              </div>
            )}

            {/* TIMELINE & EVIDENCE MATRIX SPLIT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* TIMELINE */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2.5">
                <h4 className="text-xs font-mono text-slate-300 flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t.timelineTitle}</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {classification.timeline && classification.timeline.map((evt: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-900/40 p-2 rounded border border-slate-800/50">
                      <span className="text-blue-400 font-bold mt-0.5">•</span>
                      <span className="leading-relaxed">{evt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* EVIDENCE MATRIX */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2.5">
                <h4 className="text-xs font-mono text-slate-300 flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.evidenceMatrixTitle}</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {classification.evidence_checklist && classification.evidence_checklist.map((ev: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-900/40 p-2 rounded border border-slate-800/50">
                      <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                      <span className="leading-relaxed">{ev}</span>
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
            
            {/* TAB 1: FORMAL LEGAL DRAFT (COURT DOCKET LETTERHEAD STYLING) */}
            {activeTab === 'formal' && (
              <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950 shadow-2xl">
                {/* CIVIC COURT LETTERHEAD / DOCKET STRIP */}
                <div className="p-4 bg-slate-900/90 border-b border-slate-800 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex items-center gap-2 text-slate-200">
                      <Scale className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold tracking-wider text-white uppercase">
                        {lang === 'hi' ? 'भारत गणराज्य • कानूनी शिकायत पत्र' : 'REPUBLIC OF INDIA • OFFICIAL LEGAL COMPLAINT'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 text-[11px] font-mono font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'hi' ? 'मान्य कानूनी प्रारूप' : 'Standard Legal Format'}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
                    <span>{lang === 'hi' ? 'सेवा में:' : 'To:'} <strong className="text-slate-200">{classification?.target_authority || 'Competent Authority'}</strong></span>
                    <span>{lang === 'hi' ? 'प्रारूप: प्रिंट हेतु A4 साइज' : 'Format: A4 Print Ready'}</span>
                  </div>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  <pre className="text-slate-300 font-legal-serif text-sm whitespace-pre-wrap leading-relaxed selection:bg-emerald-500/30">
                    {draftData.formal_draft}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 2: CITIZEN PLAIN VIEW (WITH ELEVATED AUDIO HUD) */}
            {activeTab === 'citizen' && (
              <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950 shadow-2xl space-y-0">
                {/* AUDIO HUD HEADER BAR */}
                <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                      <Eye className="w-4 h-4" />
                      <span>{lang === 'hi' ? 'सरल नागरिक सारांश' : 'Citizen Plain-Language Summary'}</span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-400">
                      {lang === 'hi'
                        ? 'अपनी अर्जी, मांगे गए दस्तावेज और कानूनी अधिकारों को आसान भाषा में समझें या सुनें।'
                        : 'Everyday breakdown of rights, statutory claims, and evidence demanded on your behalf.'}
                    </p>
                  </div>

                  {/* AUDIO PLAYBACK CONTROLS (INDIC & ENGLISH TTS) */}
                  {isSynthesisSupported && (
                    <div className="shrink-0">
                      {!isAudioActive ? (
                        hasVoiceForDraft ? (
                          <button
                            type="button"
                            onClick={() => startAudioPlayback(draftData.citizen_view)}
                            className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono transition-all cursor-pointer font-semibold shadow-sm hover:shadow-emerald-950/40"
                            title={`Listen to this explanation in ${draftLangLabel} (${draftLangNative})`}
                          >
                            <Volume2 className="w-4 h-4" />
                            <span>{lang === 'hi' ? 'बोलकर सुनाएं' : 'Listen Aloud'} ({draftLangNative})</span>
                          </button>
                        ) : (
                          <div
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400"
                            title={`Your device does not have an installed voice pack for ${draftLangLabel}.`}
                          >
                            <MicOff className="w-3.5 h-3.5 text-slate-500" />
                            <span>{lang === 'hi' ? `आवाज़ उपलब्ध नहीं है (${draftLangNative})` : `Audio unavailable for ${draftLangNative}`}</span>
                          </div>
                        )
                      ) : (
                        <div className="flex items-center gap-2.5 bg-slate-950 border border-emerald-500/50 px-3 py-1.5 rounded-lg shadow-sm">
                          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                            <Volume2 className="w-4 h-4 animate-pulse" />
                            <span>{isAudioPaused ? (lang === 'hi' ? 'रुका हुआ' : 'Paused') : (lang === 'hi' ? `सुनाई दे रहा है (${draftLangNative})...` : `Reading (${draftLangNative})...`)}</span>
                          </div>

                          <div className="flex items-center gap-1 pl-2 border-l border-slate-800">
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
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  <div className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                    {draftData.citizen_view}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ESCALATION & SUBMISSION LADDER */}
            {activeTab === 'escalation' && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 max-h-[60vh] overflow-y-auto space-y-6 shadow-2xl">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-emerald-400 font-mono mb-3 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.submissionChecklistTitle}</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300 font-mono">
                    {draftData.submission_checklist && draftData.submission_checklist.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 bg-slate-900/60 p-3 rounded-lg border border-slate-800/70">
                        <span className="text-emerald-400 font-bold mt-0.5">□</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-wider text-blue-400 font-mono mb-3 font-semibold flex items-center gap-1.5">
                    <ListTodo className="w-4 h-4" />
                    <span>{t.tabEscalation}</span>
                  </h4>
                  <div className="space-y-3">
                    {draftData.escalation_steps && draftData.escalation_steps.map((stepDesc: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 bg-slate-900/60 p-3.5 rounded-lg border border-slate-800/70">
                        <div className="w-6 h-6 rounded-full bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center text-xs font-mono font-bold shrink-0">
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

      {/* INTERACTIVE CITIZEN GUIDANCE MODAL */}
      {showGuide && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowGuide(false)}
        >
          <div 
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#070b16] border border-slate-700/90 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-5 text-slate-200 font-mono relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span>{lang === 'hi' ? 'आसान मार्गदर्शिका' : 'How NyayaPath Works'}</span>
                    <span className="text-emerald-400 text-xs sm:text-sm font-normal">
                      {lang === 'hi' ? '• 4 आसान कदम' : '• 4 Simple Steps'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'hi'
                      ? 'अपनी समस्या को सही कानूनी शिकायत पत्र में बदलने का आसान तरीका।'
                      : 'Simple 4-step process to create your official legal complaint letter.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close Guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 4 ROADMAP STEP CARDS */}
            <div className="space-y-3">
              {GUIDE_STEPS.map((g) => {
                const title = g.title[lang] || g.title.en;
                const desc = g.desc[lang] || g.desc.en;
                return (
                  <div key={g.step} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3.5 hover:border-emerald-500/40 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-800/60 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                      {g.step}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-100">{title}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {lang === 'hi' ? `कदम ${g.badge}` : `Step ${g.badge}`}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">
                        {desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TRUST & ZERO RETENTION NOTICE */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-900/40 space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === 'hi' ? '🔒 100% नि:शुल्क व पूरी तरह सुरक्षित (Full Privacy)' : '🔒 100% Free & Completely Private'}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                {lang === 'hi'
                  ? 'फोन नंबर या किसी आईडी की जरूरत नहीं। आपकी लिखी कोई भी बात किसी सर्वर पर सेव नहीं होती। जब चाहें सब मिटा सकते हैं।'
                  : 'No phone number or login needed. Your complaint is never saved on any server.'}
              </p>
            </div>

            {/* PRIMARY CTA BUTTON */}
            <button
              onClick={() => setShowGuide(false)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shadow-md shadow-emerald-950/40"
            >
              {lang === 'hi' ? 'समझ गया • शुरू करें' : 'Got It • Start'}
            </button>
          </div>
        </div>
      )}

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
