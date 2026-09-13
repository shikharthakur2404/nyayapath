'use client';

import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { generatePDF, printDocument } from '@/lib/pdfGenerator';
import { translations, languagesList, Language } from '@/lib/translations';
import { LionCapitalEmblem } from '@/components/NationalEmblem';
import { 
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
  ShieldCheck,
  Lock,
  Sparkles,
  ExternalLink,
  Compass,
  ClipboardList,
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
  },
  {
    id: 'consumer_refund',
    icon: '🛍️',
    title: {
      en: 'E-Commerce / Refund Denied',
      hi: 'ऑनलाइन शॉपिंग / रिफंड न मिलना',
      pa: 'ਆਨਲਾਈਨ ਖਰੀਦਦਾਰੀ / ਰਿਫੰਡ ਇਨਕਾਰ',
      mr: 'ऑनलाइन खरेदी / परतावा नकार',
      bn: 'অনলাইন কেনাকাটা / রিফান্ড অস্বীকার',
      ta: 'இணையவழி கொள்முதல் / பணத்தைத் திரும்பப்பெற மறுப்பு',
      te: 'ఆన్‌లైన్ షాపింగ్ / రీఫండ్ నిராకరణ',
      gu: 'ઓનલાઈન ખરીદી / રિફંડ ન મળવું',
      kn: 'ಆನ್‌ಲೈನ್ ಶಾಪಿಂಗ್ / ಮರುಪಾವತಿ ನಿರಾಕರಣೆ'
    },
    subtitle: {
      en: 'Defective product, return refused, or false delivery claim',
      hi: 'खराब सामान, वापसी से इनकार या धोखाधड़ी (उपभोक्ता कानून)',
    },
    template: {
      en: 'On [Date], I ordered [Product Name / Service Description] from [E-Commerce Platform / Merchant Name] for ₹[Amount] (Order / Invoice No: [Order ID]). The product delivered was defective / damaged / counterfeit, and my repeated statutory return and refund requests (Support Ticket: [Ticket ID]) have been arbitrarily rejected, constituting an unfair trade practice and deficiency of service under Section 2(47) and Section 35 of the Consumer Protection Act, 2019.',
      hi: 'दिनांक [दिनांक] को मैंने [कंपनी / ई-कॉमर्स पोर्टल का नाम] से ₹[राशि] का [सामान का नाम] ऑर्डर किया था (ऑर्डर संख्या: [ऑर्डर आईडी])। प्राप्त हुआ सामान खराब / नकली था। उपभोक्ता संरक्षण अधिनियम, 2019 के अंतर्गत निर्धारित समय-सीमा में शिकायत (शिकायत संख्या: [ID]) दर्ज कराने के बावजूद कंपनी ने रिफंड अथवा सामान बदलने से अनुचित रूप से मना कर दिया है।'
    }
  },
  {
    id: 'electricity_billing',
    icon: '⚡',
    title: {
      en: 'Electricity / Water Overbilling',
      hi: 'बिजली / पानी का भारी गलत बिल',
      pa: 'ਬਿਜਲੀ / ਪਾਣੀ ਦਾ ਗਲਤ ਬਿੱਲ',
      mr: 'वीज / पाणी अवाजवी बिल',
      bn: 'বিদ্যুৎ / জলের অস্বাভাবিক বিল',
      ta: 'மின்சாரம் / குடிநீர் அதிகப்படியான பில்',
      te: 'విద్యుత్ / నీటి అధిక బిల్లు',
      gu: 'વીજળી / પાણીનું વધુ પડતું બિલ',
      kn: 'ವಿದ್ಯುತ್ / ನೀರಿನ ತಪ್ಪು ಬಿಲ್'
    },
    subtitle: {
      en: 'Faulty meter billing without actual reading or disconnection threat',
      hi: 'खराब मीटर पर मनमाना बिल या कनेक्शन काटने की धमकी',
    },
    template: {
      en: 'For electricity / water service connection Consumer Account No. [Consumer Number] at [Address], the distribution licensee (DISCOM) has served an inflated, arbitrary bill of ₹[Amount] for the billing cycle [Month/Year] without recording actual physical meter readings. Despite lodging a formal meter testing request on [Date], the department has failed to inspect the defective meter and is unlawfully threatening supply disconnection in violation of statutory Electricity Supply Code regulations.',
      hi: 'मेरे विद्युत उपभोक्ता खाता संख्या [उपभोक्ता संख्या], पता [पूरा पता] पर विद्युत वितरण कंपनी (DISCOM) द्वारा माह [महीना/वर्ष] का ₹[राशि] का अत्यधिक व फर्जी बिल जारी कर दिया गया है। बिना कोई वास्तविक मीटर रीडिंग लिए खराब मीटर के आधार पर मनमाना बिल थोपा गया है तथा दिनांक [दिनांक] को लिखित आपत्ति दर्ज कराने के बावजूद बिना जांच किए बिजली काटने की अवैध धमकी दी जा रही है।'
    }
  },
  {
    id: 'epfo_delay',
    icon: '💼',
    title: {
      en: 'EPFO / PF Withdrawal Delay',
      hi: 'PF का पैसा अटकना / खारिज होना',
      pa: 'ਪੀਐਫ (PF) ਕਲੇਮ ਵਿੱਚ ਦੇਰੀ ਜਾਂ ਰੱਦ',
      mr: 'पीएफ (PF) पैसे मिळण्यात विलंब / नकार',
      bn: 'পিএফ (PF) টাকা আটকে থাকা / বিলম্ব',
      ta: 'வருங்கால வைப்பு நிதி (PF) தாமதம்',
      te: 'పీఎఫ్ (PF) క్లెయిమ్ ఆలస్యం / తిరస్కరణ',
      gu: 'પીએફ (PF) ઉપાડમાં વિલંબ / રદ',
      kn: 'ಪಿಎಫ್ (PF) ಹಿಂಪಡೆಯುವಿಕೆ ವಿಳಂಬ'
    },
    subtitle: {
      en: 'Unlawful rejection or delay beyond statutory 20-day citizen charter',
      hi: '20 दिनों की तय सीमा के बाद भी पीएफ का भुगतान न होना',
    },
    template: {
      en: 'I submitted my online PF final settlement / pension claim Form [Form 19 / 10C / 31] (UAN: [UAN Number], Claim ID: [Claim ID]) on [Date]. Despite verified Aadhaar-linked KYC and active bank details, the Regional PF Commissioner (EPFO) office at [City Name] has unlawfully kept the claim pending / repeatedly rejected it on frivolous technical pretexts, in direct breach of the 20-day statutory settlement mandate under Para 72(7) of the Employees Provident Funds Scheme, 1952.',
      hi: 'मैंने अपने यूएएन (UAN संख्या: [UAN]) के तहत पीएफ अंतिम भुगतान / क्लेम फॉर्म [फॉर्म 19/10C/31] (क्लेम संख्या: [क्लेम आईडी]) दिनांक [दिनांक] को जमा किया था। सभी बैंक व आधार केवाईसी सत्यापित होने के बावजूद क्षेत्रीय भविष्य निधि कार्यालय द्वारा कर्मचारी भविष्य निधि योजना के 20 दिवसीय नागरिक चार्टर का उल्लंघन करते हुए क्लेम को अटकाया गया है।'
    }
  },
  {
    id: 'rti_application',
    icon: '📑',
    title: {
      en: 'RTI Application / Info Denied',
      hi: 'RTI / सूचना का अधिकार (RTI Act)',
      pa: 'ਸੂਚਨਾ ਦਾ ਅਧਿਕਾਰ (RTI)',
      mr: 'माहिती अधिकार (RTI) अर्ज',
      bn: 'তথ্যের অধিকার (RTI) আবেদন',
      ta: 'தகவல் அறியும் உரிமை (RTI)',
      te: 'సమాచార హక్కు చట్టం (RTI)',
      gu: 'માહિતી અધિકાર (RTI) અરજી',
      kn: 'ಮಾಹಿತಿ ಹಕ್ಕು (RTI) ಅರ್ಜಿ'
    },
    subtitle: {
      en: 'Seeking official file notings, expenditure, or reasons for delay',
      hi: 'सरकारी फाइल की प्रमाणित प्रति, खर्च का ब्योरा व जांच रिपोर्ट',
    },
    template: {
      en: 'Under Section 6(1) of the Right to Information Act, 2005, I hereby seek certified copies of official file notings, inspection reports, sanction orders, and daily progress logs regarding [Subject Matter / Application / Scheme No.] pending with [Public Authority / Department Name] since [Date], along with the names and designations of all public officials who handled the file and grounds for delay.',
      hi: 'सूचना का अधिकार अधिनियम, 2005 की धारा 6(1) के अंतर्गत मैं [विभाग/कार्यालय का नाम] में दिनांक [दिनांक] से लंबित [आवेदन/कार्य/योजना का नाम] से संबंधित आधिकारिक फाइल नोटिंग्स (टिप्पणी), दैनिक प्रगति रजिस्टर, स्वीकृति आदेश तथा पत्रावली पर कार्य करने वाले संबंधित अधिकारियों के नाम व पदनाम की प्रमाणित प्रतिलिपियां प्राप्त करने हेतु यह औपचारिक आवेदन प्रस्तुत कर रहा हूँ।'
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
  const [docketId, setDocketId] = useState<string>('');

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
      const stateCode = (classification?.state_or_ut || 'IN').replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase() || 'IN';
      const randHash = Math.floor(100000 + Math.random() * 900000);
      setDocketId(`NP-2026-${stateCode}-${randHash}`);
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
    setDocketId('');
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
      setDocketId('');
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
      {/* LANGUAGE SELECTOR & BURN BAG BAR - RESPONSIVE MOBILE OPTIMIZED */}
      <div className="mb-4 space-y-2 px-1 no-print">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
            <Languages className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold">{lang === 'hi' ? 'भाषा (Language):' : 'Language:'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowGuide(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 bg-blue-950/70 hover:bg-blue-900/80 border border-blue-700/60 text-blue-200 text-xs sm:text-sm rounded-lg transition-colors cursor-pointer shadow-sm font-semibold min-h-[36px]"
              title="How NyayaPath Works"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{lang === 'hi' ? 'मार्गदर्शिका' : 'Guide'}</span>
            </button>

            {(step > 1 || grievance.length > 0) && (
              <button
                onClick={handleDestroyCase}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-red-950/50 hover:bg-red-900/70 border border-red-800/60 text-red-300 text-xs sm:text-sm rounded-lg transition-colors cursor-pointer font-semibold min-h-[36px]"
                title="Irreversibly purge all case state from this browser"
              >
                <Flame className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className="hidden sm:inline">{t.btnDestroy}</span>
              </button>
            )}
          </div>
        </div>

        {/* FULL-WIDTH TOUCH-SWIPEABLE LANGUAGE PILLS */}
        <div className="flex items-center gap-1.5 bg-[#050e24] border border-blue-900/60 p-1 rounded-xl overflow-x-auto no-scrollbar scroll-smooth w-full touch-pan-x">
          {languagesList.map((l) => (
            <button
              key={l.id}
              type="button"
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
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer font-semibold shrink-0 min-h-[36px] flex items-center justify-center ${
                lang === l.id 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                  : 'text-slate-300 hover:text-white hover:bg-blue-950/50'
              }`}
            >
              {l.native}
            </button>
          ))}
        </div>
      </div>

      {/* INLINE ERROR BANNER */}
      {errorMessage && (
        <div className="mb-4 p-3.5 sm:p-4 rounded-xl bg-red-950/70 border border-red-700/80 text-red-200 text-xs sm:text-sm flex items-start justify-between gap-3 animate-in fade-in duration-200 no-print shadow-lg">
          <div className="flex items-start gap-2.5">
            <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
          <button 
            onClick={() => setErrorMessage(null)} 
            className="text-red-400 hover:text-white cursor-pointer font-bold p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3-STEP TRICOLOR WORKFLOW STEPPER */}
      <div className="mb-4 sm:mb-6 grid grid-cols-3 gap-1.5 sm:gap-4 no-print">
        {/* STEP 1: KESARIYA / SAFFRON ACCENT */}
        <button
          type="button"
          onClick={() => step > 1 && setStep(1)}
          disabled={step === 1}
          className={`p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border text-left transition-all ${
            step === 1
              ? 'bg-[#181829] border-amber-500 shadow-xl shadow-amber-950/40 ring-1 ring-amber-500/50'
              : step > 1
              ? 'bg-[#091538]/70 border-blue-800/80 hover:border-amber-500/50 cursor-pointer'
              : 'bg-[#060e24]/60 border-blue-950 opacity-60 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-1.5 sm:gap-3">
            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 ${
              step === 1 
                ? 'bg-amber-500 text-slate-950 shadow-md' 
                : step > 1 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' 
                : 'bg-slate-800 text-slate-500'
            }`}>
              {step > 1 ? '✓' : '1'}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-amber-400 font-bold truncate">
                {lang === 'hi' ? 'चरण 1' : 'Step 1'}
              </p>
              <p className={`text-xs sm:text-base font-bold truncate ${step === 1 ? 'text-white' : 'text-slate-300'}`}>
                {lang === 'hi' ? '1. समस्या' : '1. Intake'}
              </p>
            </div>
          </div>
        </button>

        {/* STEP 2: ASHOKA NAVY BLUE ACCENT */}
        <button
          type="button"
          onClick={() => step > 2 && setStep(2)}
          disabled={step < 2}
          className={`p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border text-left transition-all ${
            step === 2
              ? 'bg-[#0e1d40] border-blue-500 shadow-xl shadow-blue-950/50 ring-1 ring-blue-500/50'
              : step > 2
              ? 'bg-[#091538]/70 border-blue-800/80 hover:border-blue-500/50 cursor-pointer'
              : 'bg-[#060e24]/60 border-blue-950 opacity-60 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center gap-1.5 sm:gap-3">
            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 ${
              step === 2 
                ? 'bg-blue-600 text-white shadow-md' 
                : step > 2 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' 
                : 'bg-slate-800 text-slate-500'
            }`}>
              {step > 2 ? '✓' : '2'}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-blue-400 font-bold truncate">
                {lang === 'hi' ? 'चरण 2' : 'Step 2'}
              </p>
              <p className={`text-xs sm:text-base font-bold truncate ${step === 2 ? 'text-white' : 'text-slate-300'}`}>
                {lang === 'hi' ? '2. विभाग' : '2. Office'}
              </p>
            </div>
          </div>
        </button>

        {/* STEP 3: INDIA GREEN ACCENT */}
        <div
          className={`p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border text-left transition-all ${
            step === 3
              ? 'bg-[#0c241c] border-emerald-500 shadow-xl shadow-emerald-950/50 ring-1 ring-emerald-500/50'
              : 'bg-[#060e24]/60 border-blue-950 opacity-60'
          }`}
        >
          <div className="flex items-center gap-1.5 sm:gap-3">
            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 ${
              step === 3 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'bg-slate-800 text-slate-500'
            }`}>
              3
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-emerald-400 font-bold truncate">
                {lang === 'hi' ? 'चरण 3' : 'Step 3'}
              </p>
              <p className={`text-xs sm:text-base font-bold truncate ${step === 3 ? 'text-white' : 'text-slate-400'}`}>
                {lang === 'hi' ? '3. अर्जी' : '3. Ready'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 md:p-8 bg-[#081538]/95 border border-blue-800/60 rounded-2xl sm:rounded-3xl shadow-2xl shadow-blue-950/80 backdrop-blur-md no-print">
        {/* STEP 1: INTAKE */}
        {step === 1 && (
          <div className="space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between border-b border-blue-800/60 pb-3.5">
              <div className="flex items-center gap-3">
                <LionCapitalEmblem className="w-7 h-9 sm:w-8 sm:h-10 text-amber-400 shrink-0" fill="#f59e0b" />
                <div>
                  <h2 className="text-xl sm:text-2xl text-white font-bold font-indic">{t.intakeTitle}</h2>
                  <p className="text-xs sm:text-sm text-slate-300 font-indic mt-0.5">
                    {t.intakeDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* COMPACT FIRST-TIME CITIZEN GUIDE STRIP */}
            <div className="p-3.5 rounded-xl bg-[#050e24] border border-blue-900/60 flex flex-wrap items-center justify-between gap-2.5 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5 text-slate-200">
                <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-indic">
                  {lang === 'hi'
                    ? '3 आसान कदम: 1. समस्या बताएं → 2. सरकारी विभाग चुनें → 3. अर्जी प्रिंट करें या सुनें।'
                    : '3 Simple Steps: 1. Tell what happened → 2. Find right department → 3. Print or listen to letter.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(true)}
                className="text-xs sm:text-sm text-amber-400 hover:text-amber-300 underline font-semibold cursor-pointer shrink-0"
              >
                {lang === 'hi' ? 'मार्गदर्शिका देखें (Guide) →' : 'How It Works →'}
              </button>
            </div>

            {/* GOV.UK & CPGRAMS STYLE: BEFORE YOU START PREREQUISITE CHECKLIST */}
            <div className="p-3 sm:p-4 rounded-xl bg-[#061433] border border-blue-800/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-900/60 border border-blue-700/60 flex items-center justify-center shrink-0 text-amber-400">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-100 font-indic flex items-center gap-2 flex-wrap">
                    <span>{lang === 'hi' ? 'शुरू करने से पहले आवश्यक तैयारी:' : 'Before You Start (Takes ~2 mins):'}</span>
                    <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 font-semibold">
                      {lang === 'hi' ? 'नो लॉगिन • 100% फ्री' : 'No Login • 100% Free'}
                    </span>
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-300 font-indic mt-0.5">
                    {lang === 'hi'
                      ? '1. घटना की तारीख/स्थान  •  2. अधिकारी या कंपनी का नाम  •  3. कोई रसीद या स्क्रीनशॉट (यदि उपलब्ध हो)'
                      : '1. Date & location of incident  •  2. Officer or company name  •  3. Receipts/screenshots (if any)'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center text-[11px] text-blue-300 font-sans">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'hi' ? 'समय: 2 मिनट' : 'Time: 2 mins'}</span>
              </div>
            </div>

            {/* QUICK SCENARIO STARTER TEMPLATE CHIPS */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-amber-300 uppercase tracking-wider flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'hi' ? 'सीधे चुनने के लिए क्लिक करें (आम समस्याएं):' : 'Common Issues (Click to pick):'}</span>
                </span>
                {grievance.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setGrievance('')}
                    className="text-xs sm:text-sm text-slate-400 hover:text-red-400 transition-colors cursor-pointer font-medium"
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
                      className="p-3.5 rounded-xl bg-[#06102a] hover:bg-[#0c1f4e] border border-blue-900/70 hover:border-amber-400/60 text-left transition-all cursor-pointer group shadow-sm hover:shadow-blue-950/40"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-lg shrink-0">{sc.icon}</span>
                        <span className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-amber-300 truncate font-indic">
                          {title}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2 font-indic">
                        {sub}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ELEVATED STUDIO VOICE INTAKE BAR & PRIVACY EMBLEM */}
            <div className="p-4 rounded-xl bg-[#050e24] border border-blue-800/60 shadow-sm space-y-2">
              {isListening ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-red-950/50 border border-red-500/60 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
                      <span className="w-10 h-10 rounded-full bg-red-500/40 animate-ping absolute" />
                      <span className="w-4 h-4 rounded-full bg-red-500" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-bold text-red-200 flex items-center gap-2 font-indic">
                        <span>🔴 आपकी बात रिकॉर्ड हो रही है ({activeLangObj.native} • {activeLangObj.label})</span>
                      </p>
                      <p className="text-xs sm:text-sm text-slate-200 mt-0.5 font-indic">
                        साफ-साफ बोलें। आपकी कही बात नीचे बॉक्स में अपने आप लिखी जा रही है।
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    className="w-full sm:w-auto px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <MicOff className="w-4 h-4" />
                    <span>बोलना पूरा हुआ (बंद करें)</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                      <Mic className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 font-indic">
                        <span>बोलकर बताएं (माइक दबाएं)</span>
                        <span className="text-xs font-semibold text-amber-300 bg-amber-950/60 border border-amber-800/60 px-2.5 py-0.5 rounded">
                          {activeLangObj.native} ({activeLangObj.label})
                        </span>
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-0.5 font-indic">
                        लिखने में परेशानी हो रही है? माइक दबाकर सीधे अपनी भाषा में बोलें।
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!isSpeechSupported ? (
                      <span className="text-xs sm:text-sm text-slate-400">
                        (इस ब्राउज़र में माइक उपलब्ध नहीं है — नीचे टाइप करें)
                      </span>
                    ) : !speechLocaleMap[lang] ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm bg-amber-950/40 border border-amber-800/40 text-amber-300">
                        <MicOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{activeLangObj.native} में माइक उपलब्ध नहीं है (नीचे लिखें या हिन्दी चुनें)</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={toggleVoiceInput}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition-all cursor-pointer font-bold shadow-md shadow-amber-950/50"
                        title={`अपनी भाषा में बोलें (${activeLangObj.native})`}
                      >
                        <Mic className="w-4 h-4 text-slate-950 animate-pulse" />
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
              className="w-full h-44 sm:h-52 bg-[#050c1f] border border-blue-900/70 rounded-xl p-3.5 sm:p-4 text-slate-100 text-base sm:text-lg focus:border-amber-500 focus:outline-none leading-relaxed shadow-inner placeholder:text-slate-400 font-indic"
              placeholder={t.placeholder}
              maxLength={4000}
            />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>100% सुरक्षित • केवल आपके फोन/कंप्यूटर पर (Zero-Retention)</span>
              </span>
              <span className="font-semibold text-slate-400 text-right sm:text-left">{grievance.length} / 4000</span>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading || !grievance.trim()}
              className="w-full py-3.5 sm:py-4 min-h-[50px] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 text-base sm:text-lg rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer font-bold shadow-lg shadow-amber-950/50 font-indic"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
              {t.btnAnalyze}
            </button>
          </div>
        )}

        {/* STEP 2: CLASSIFICATION, EXPLANABILITY & GAP-CLOSING */}
        {step === 2 && classification && (
          <div className="space-y-4 sm:space-y-6">
            {/* EMERGENCY ALERT BANNER IF PHYSICAL DANGER DETECTED */}
            {classification.emergency_danger_detected && (
              <div className="bg-red-950/60 border border-red-700/80 p-3.5 sm:p-4 rounded-xl space-y-2 shadow-lg">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm sm:text-base font-indic">
                  <PhoneCall className="w-4 h-4 shrink-0" />
                  {t.emergencyTitle}
                </div>
                <p className="text-xs sm:text-sm text-red-200 font-indic leading-relaxed">
                  {classification.emergency_guidance}
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-xs font-indic text-red-200">
                  <span className="bg-red-900/60 px-2.5 py-1 rounded-lg border border-red-700/80 font-bold">{t.emergencyPolice}</span>
                  <span className="bg-red-900/60 px-2.5 py-1 rounded-lg border border-red-700/80 font-bold">{t.emergencyWomen}</span>
                  <span className="bg-red-900/60 px-2.5 py-1 rounded-lg border border-red-700/80 font-bold">{t.emergencyCyber}</span>
                </div>
              </div>
            )}

            {/* READINESS METER & SCORE WITH QUALITATIVE APPRAISAL */}
            <div className="bg-[#06102a] border border-blue-800/60 p-3.5 sm:p-5 rounded-2xl space-y-2.5 sm:space-y-3 shadow-md">
              <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm text-slate-200 gap-2 font-indic">
                <span className="flex items-center gap-2 text-amber-400 font-bold">
                  <TrendingUp className="w-4 h-4" />
                  <span>{t.readinessTitle}</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] sm:text-xs text-slate-300 font-medium">
                    {classification.readiness_score >= 80 
                      ? (lang === 'hi' ? '✓ मजबूत शिकायत' : '✓ Strong Complaint') 
                      : classification.readiness_score >= 50 
                      ? (lang === 'hi' ? '• 2-3 बिंदु और बताएं' : '• Clarify 2-3 points') 
                      : (lang === 'hi' ? '⚠️ अधूरी शिकायत' : '⚠️ Gaps Found')}
                  </span>
                  <span className="font-bold text-sm sm:text-base text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2.5 sm:px-3 py-0.5 rounded-lg shadow-sm">
                    {classification.readiness_score}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-[#050c1f] h-2.5 sm:h-3 rounded-full overflow-hidden border border-blue-900/60">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    classification.readiness_score >= 75 
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' 
                      : classification.readiness_score >= 50 
                      ? 'bg-gradient-to-r from-amber-500 to-amber-400' 
                      : 'bg-gradient-to-r from-red-600 to-red-500'
                  }`} 
                  style={{ width: `${Math.max(10, Math.min(100, classification.readiness_score))}%` }}
                />
              </div>
            </div>

            {/* EXPLAINABLE ROUTING RECOMMENDATION (AUTHORITY DOSSIER CARD WITH LION CAPITAL) */}
            <div className="bg-[#09173a] border border-blue-700/60 rounded-2xl p-4 sm:p-5 space-y-3.5 sm:space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <LionCapitalEmblem className="w-8 h-10 text-amber-400 shrink-0" fill="#f59e0b" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-400 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t.detectedJurisdiction}</span>
                    </div>
                    <h3 className="text-white text-base sm:text-xl font-bold tracking-tight font-indic break-words">
                      {classification.target_authority}
                    </h3>
                  </div>
                </div>

                {Boolean(classification.authority_portal_url) && (
                  <a 
                    href={classification.authority_portal_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg bg-blue-950/70 hover:bg-blue-900/80 border border-blue-600/60 text-blue-200 text-xs sm:text-sm transition-colors font-semibold shadow-sm w-full sm:w-auto min-h-[38px]"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                    <span>{t.officialPortal}</span>
                  </a>
                )}
              </div>
              
              <div className="space-y-1.5">
                <span className="text-xs sm:text-sm uppercase tracking-wider text-amber-300 font-bold block font-indic">
                  {t.routingWhyTitle}
                </span>
                <p className="text-sm sm:text-base text-slate-100 leading-relaxed bg-[#050e24] p-3.5 sm:p-4 rounded-xl border border-blue-900/70 font-indic">
                  {classification.routing_explanation}
                </p>
              </div>
            </div>

            {/* WHISTLEBLOWER NOTICE */}
            {classification.whistleblower_eligible && (
              <div className="bg-amber-950/40 border border-amber-700/60 p-3.5 sm:p-4 rounded-xl flex items-start gap-3 shadow-md">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-amber-200 leading-relaxed font-indic">
                  {t.whistleblowerNotice}
                </p>
              </div>
            )}

            {/* TIMELINE & EVIDENCE MATRIX SPLIT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* TIMELINE */}
              <div className="bg-[#06102a] border border-blue-900/60 p-3.5 sm:p-5 rounded-2xl space-y-2.5 sm:space-y-3">
                <h4 className="text-xs sm:text-sm text-blue-300 flex items-center gap-1.5 uppercase tracking-wider font-bold">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>{t.timelineTitle}</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-200 font-indic">
                  {classification.timeline && classification.timeline.map((evt: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 bg-[#040b1e] p-2.5 sm:p-3 rounded-xl border border-blue-950/80">
                      <span className="text-blue-400 font-bold mt-0.5">•</span>
                      <span className="leading-relaxed">{evt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* EVIDENCE MATRIX */}
              <div className="bg-[#06102a] border border-blue-900/60 p-3.5 sm:p-5 rounded-2xl space-y-2.5 sm:space-y-3">
                <h4 className="text-xs sm:text-sm text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider font-bold">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  <span>{t.evidenceMatrixTitle}</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-200 font-indic">
                  {classification.evidence_checklist && classification.evidence_checklist.map((ev: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 bg-[#040b1e] p-2.5 sm:p-3 rounded-xl border border-blue-950/80">
                      <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                      <span className="leading-relaxed">{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CLARIFYING GAP-CLOSING QUESTIONS */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 text-white font-indic text-base sm:text-lg font-bold">
                <HelpCircle className="w-5 h-5 text-amber-400 shrink-0" />
                <h3>{t.clarifyingQuestionsTitle}</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-indic">{t.clarifyingQuestionsDesc}</p>
              {classification.clarifying_questions && classification.clarifying_questions.map((q: string, idx: number) => (
                <div key={idx} className="space-y-1.5 sm:space-y-2">
                  <label className="text-sm sm:text-base text-slate-200 block font-semibold font-indic">{idx + 1}. {q}</label>
                  <input
                    type="text"
                    value={answers[idx] || ''}
                    onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
                    className="w-full bg-[#050c1f] border border-blue-900/70 rounded-xl p-3 sm:p-3.5 text-base focus:border-blue-500 focus:outline-none font-indic shadow-inner"
                    maxLength={1000}
                  />
                </div>
              ))}
            </div>

            {/* DECOUPLED DRAFT OUTPUT LANGUAGE SELECTOR (ALL 9 LANGUAGES + BILINGUAL) */}
            <div className="p-3.5 sm:p-4 bg-[#06102a] border border-blue-900/60 rounded-2xl space-y-2.5">
              <label className="text-xs sm:text-sm text-slate-300 block font-semibold font-indic">{t.draftLangLabel}</label>
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
                    className={`px-2.5 py-2.5 rounded-xl text-xs sm:text-sm text-center border transition-all cursor-pointer font-semibold min-h-[44px] flex items-center justify-center ${
                      draftLang === option.id 
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300 shadow-sm font-bold'
                        : 'border-blue-900/60 text-slate-300 hover:border-blue-700 hover:text-white'
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
              className="w-full py-3.5 sm:py-4 min-h-[50px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 text-white font-indic text-base sm:text-lg rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer font-bold shadow-xl shadow-blue-950/60"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileCheck2 className="w-5 h-5" />}
              {t.btnGenerateDraft}
            </button>
          </div>
        )}

        {/* STEP 3: DUAL REPRESENTATION VIEW, ESCALATION LADDER & EXPORT */}
        {step === 3 && draftData && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-900/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shrink-0">
                  <LionCapitalEmblem className="w-6 h-7 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-indic text-white flex items-center gap-2 font-bold tracking-tight">
                    {t.draftReadyTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 font-sans">
                    {lang === 'hi' ? 'विधिक रूप से प्रमाणित प्रारूप तैयार है' : 'Statutorily structured complaint docket ready'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 sm:flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopy}
                  className="px-2.5 sm:px-3.5 py-2.5 bg-[#0a183d] hover:bg-[#0f245c] text-slate-200 border border-blue-800/80 text-xs sm:text-sm font-sans rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer font-semibold shadow-sm min-h-[42px]"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-blue-300" />}
                  <span className="truncate">{copied ? t.btnCopied : t.btnCopy}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-2.5 sm:px-3.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-sans rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer font-semibold shadow-sm shadow-blue-950/50 min-h-[42px]"
                  title="Prints or saves A4 PDF using native vector fonts for 100% Indic glyph fidelity"
                >
                  <Printer className="w-4 h-4 text-blue-100" />
                  <span className="truncate">{t.btnPrint}</span>
                </button>
                <button
                  onClick={() => generatePDF(draftData.formal_draft, 'NyayaPath_Formal_Complaint.pdf')}
                  className="px-2.5 sm:px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs sm:text-sm font-sans rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer font-bold shadow-md shadow-amber-950/40 min-h-[42px]"
                >
                  <Download className="w-4 h-4" />
                  <span className="truncate">{t.btnExportPdf}</span>
                </button>
              </div>
            </div>

            {/* CPGRAMS & CIVIC DOCKET REFERENCE & RESOLUTION SLA TICKER */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-[#061536] via-[#091e4a] to-[#061536] border border-blue-700/70 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-950/90 border border-blue-700 flex items-center justify-center shrink-0 text-amber-400 shadow-inner">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {lang === 'hi' ? 'दस्तावेज़ संदर्भ:' : 'CIVIC DOCKET REF:'}
                    </span>
                    <span className="font-mono font-bold text-amber-300 tracking-wider text-xs sm:text-sm bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/80">
                      {docketId || 'NP-2026-IN-884920'}
                    </span>
                    <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-blue-900/80 text-blue-200 border border-blue-700 font-semibold">
                      CPGRAMS / NALSA
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-300 font-indic mt-1">
                    {lang === 'hi'
                      ? 'नागरिक अधिकार चार्टर: कार्मिक मंत्रालय (DoPT) निर्देशानुसार 21 से 30 कार्य दिवसों में समाधान अनिवार्य।'
                      : 'Citizen Charter Mandate: Public authorities must resolve grievances within 21-30 working days.'}
                  </p>
                </div>
              </div>
              
              {/* THREE SUBMISSION CHANNELS QUICK-BADGES */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-[10px] sm:text-[11px] font-indic self-start sm:self-center">
                <span className="px-2 py-1 rounded-lg bg-[#091b42] border border-blue-800 text-slate-200 flex items-center gap-1 shadow-sm">
                  <span>🖨️ CSC / प्रिंट</span>
                </span>
                <span className="px-2 py-1 rounded-lg bg-[#091b42] border border-blue-800 text-slate-200 flex items-center gap-1 shadow-sm">
                  <span>📮 स्पीड पोस्ट AD</span>
                </span>
                <span className="px-2 py-1 rounded-lg bg-[#091b42] border border-blue-800 text-slate-200 flex items-center gap-1 shadow-sm">
                  <span>🌐 ऑनलाइन पोर्टल</span>
                </span>
              </div>
            </div>

            {/* TAB NAVIGATION: FORMAL VIEW vs CITIZEN PLAIN VIEW vs ESCALATION LADDER */}
            <div className="flex items-center gap-1 sm:gap-2 border-b border-blue-900/60 overflow-x-auto no-scrollbar">
              <button
                onClick={() => handleTabChange('formal')}
                className={`flex-1 sm:flex-none pb-2.5 sm:pb-3 px-2 sm:px-4 text-xs sm:text-sm font-indic transition-all border-b-2 cursor-pointer font-bold shrink-0 min-h-[44px] flex items-center justify-center ${
                  activeTab === 'formal'
                    ? 'border-amber-500 text-amber-300 bg-amber-500/10 rounded-t-lg'
                    : 'border-transparent text-slate-300 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                  <span className="truncate">{t.tabFormal}</span>
                </span>
              </button>
              <button
                onClick={() => handleTabChange('citizen')}
                className={`flex-1 sm:flex-none pb-2.5 sm:pb-3 px-2 sm:px-4 text-xs sm:text-sm font-indic transition-all border-b-2 cursor-pointer font-bold shrink-0 min-h-[44px] flex items-center justify-center ${
                  activeTab === 'citizen'
                    ? 'border-emerald-500 text-emerald-300 bg-emerald-500/10 rounded-t-lg'
                    : 'border-transparent text-slate-300 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{t.tabCitizen}</span>
                </span>
              </button>
              <button
                onClick={() => handleTabChange('escalation')}
                className={`flex-1 sm:flex-none pb-2.5 sm:pb-3 px-2 sm:px-4 text-xs sm:text-sm font-indic transition-all border-b-2 cursor-pointer font-bold shrink-0 min-h-[44px] flex items-center justify-center ${
                  activeTab === 'escalation'
                    ? 'border-blue-500 text-blue-300 bg-blue-500/10 rounded-t-lg'
                    : 'border-transparent text-slate-300 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <ListTodo className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 shrink-0" />
                  <span className="truncate">{t.tabEscalation}</span>
                </span>
              </button>
            </div>
            
            {/* TAB 1: FORMAL LEGAL DRAFT (COURT DOCKET LETTERHEAD STYLING) */}
            {activeTab === 'formal' && (
              <div className="rounded-2xl border border-blue-800/80 overflow-hidden bg-[#050e26] shadow-2xl">
                {/* CIVIC COURT LETTERHEAD / DOCKET STRIP */}
                <div className="p-3.5 sm:p-5 bg-gradient-to-r from-[#081538] via-[#0c1e48] to-[#081538] border-b border-blue-800/70 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs sm:text-sm font-sans">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <LionCapitalEmblem className="w-7 h-9 sm:w-8 sm:h-10 text-amber-400 shrink-0 drop-shadow" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold tracking-wider text-amber-200 uppercase font-indic text-xs sm:text-sm">
                            {lang === 'hi' ? 'भारत गणराज्य • कानूनी शिकायत पत्र' : 'REPUBLIC OF INDIA • OFFICIAL LEGAL COMPLAINT'}
                          </span>
                        </div>
                        <span className="text-[10px] sm:text-[11px] text-slate-300 font-sans">
                          {lang === 'hi' ? 'सत्यमेव जयते • विधिक रूप से बाध्यकारी मानक' : 'Satyameva Jayate • Statutory Standard Format'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-600/60 text-emerald-300 text-[11px] sm:text-xs font-sans font-semibold shadow-inner">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'hi' ? 'मान्य कानूनी प्रारूप' : 'Standard Legal Format'}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-sans text-slate-200 pt-2 border-t border-blue-900/60">
                    <span>{lang === 'hi' ? 'सेवा में:' : 'To:'} <strong className="text-white font-semibold font-indic">{classification?.target_authority || 'Competent Authority'}</strong></span>
                    <span className="text-amber-300/90 font-medium">{lang === 'hi' ? 'प्रारूप: A4 विधिक मानक' : 'Format: A4 Legal Ready'}</span>
                  </div>
                </div>

                <div className="p-4 sm:p-6 md:p-8 max-h-[60vh] overflow-y-auto bg-[#030919]/60">
                  <pre className="text-slate-100 font-legal-serif text-sm sm:text-base md:text-lg whitespace-pre-wrap break-words leading-relaxed selection:bg-amber-500/30">
                    {draftData.formal_draft}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 2: CITIZEN PLAIN VIEW (WITH ELEVATED AUDIO HUD) */}
            {activeTab === 'citizen' && (
              <div className="rounded-2xl border border-emerald-900/70 overflow-hidden bg-[#050e26] shadow-2xl space-y-0">
                {/* AUDIO HUD HEADER BAR */}
                <div className="p-3.5 sm:p-5 bg-gradient-to-r from-[#06182e] via-[#08203d] to-[#06182e] border-b border-emerald-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm sm:text-base font-indic font-bold text-emerald-300">
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                      <span>{lang === 'hi' ? 'सरल नागरिक सारांश' : 'Citizen Plain-Language Summary'}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-sans text-slate-300">
                      {lang === 'hi'
                        ? 'अपनी अर्जी, मांगे गए दस्तावेज और कानूनी अधिकारों को आसान भाषा में समझें या सुनें।'
                        : 'Everyday breakdown of rights, statutory claims, and evidence demanded on your behalf.'}
                    </p>
                  </div>

                  {/* AUDIO PLAYBACK CONTROLS (INDIC & ENGLISH TTS) */}
                  {isSynthesisSupported && (
                    <div className="shrink-0 w-full sm:w-auto">
                      {!isAudioActive ? (
                        hasVoiceForDraft ? (
                          <button
                            type="button"
                            onClick={() => startAudioPlayback(draftData.citizen_view)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-sans transition-all cursor-pointer font-bold shadow-md shadow-emerald-950/40 min-h-[42px]"
                            title={`Listen to this explanation in ${draftLangLabel} (${draftLangNative})`}
                          >
                            <Volume2 className="w-4 h-4" />
                            <span>{lang === 'hi' ? 'बोलकर सुनाएं' : 'Listen Aloud'} ({draftLangNative})</span>
                          </button>
                        ) : (
                          <div
                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0a183d] border border-blue-900/60 text-xs sm:text-sm font-sans text-slate-300 w-full sm:w-auto text-center"
                            title={`Your device does not have an installed voice pack for ${draftLangLabel}.`}
                          >
                            <MicOff className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>{lang === 'hi' ? `आवाज़ उपलब्ध नहीं है (${draftLangNative})` : `Audio unavailable for ${draftLangNative}`}</span>
                          </div>
                        )
                      ) : (
                        <div className="flex items-center justify-between sm:justify-start gap-2.5 bg-[#081538] border border-emerald-500/60 px-3.5 py-2 rounded-xl shadow-md w-full sm:w-auto">
                          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-sans text-emerald-300 font-semibold truncate">
                            <Volume2 className="w-4 h-4 animate-pulse text-emerald-400 shrink-0" />
                            <span className="truncate">{isAudioPaused ? (lang === 'hi' ? 'रुका हुआ' : 'Paused') : (lang === 'hi' ? `सुनाई दे रहा है (${draftLangNative})...` : `Reading (${draftLangNative})...`)}</span>
                          </div>

                          <div className="flex items-center gap-1.5 pl-2.5 border-l border-blue-900 shrink-0">
                            {isAudioPaused ? (
                              <button
                                type="button"
                                onClick={resumeAudio}
                                className="p-1.5 text-slate-200 hover:text-white rounded-lg hover:bg-blue-900/60 transition-colors cursor-pointer"
                                title="Resume reading"
                              >
                                <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={pauseAudio}
                                className="p-1.5 text-slate-200 hover:text-white rounded-lg hover:bg-blue-900/60 transition-colors cursor-pointer"
                                title="Pause reading"
                              >
                                <Pause className="w-3.5 h-3.5 fill-current text-amber-400" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={stopAudio}
                              className="p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-blue-900/60 transition-colors cursor-pointer"
                              title="Stop reading"
                            >
                              <Square className="w-3.5 h-3.5 fill-current" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-6 md:p-8 max-h-[60vh] overflow-y-auto bg-[#030919]/60">
                  <div className="text-slate-100 text-sm sm:text-base md:text-lg whitespace-pre-wrap break-words leading-relaxed font-sans">
                    {draftData.citizen_view}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ESCALATION & SUBMISSION LADDER */}
            {activeTab === 'escalation' && (
              <div className="bg-[#050e26] border border-blue-900/70 rounded-2xl p-4 sm:p-6 md:p-7 max-h-[60vh] overflow-y-auto space-y-5 sm:space-y-6 shadow-2xl">
                <div>
                  <h4 className="text-xs sm:text-sm uppercase tracking-wider text-emerald-300 font-indic mb-3 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{t.submissionChecklistTitle}</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-200 font-sans">
                    {draftData.submission_checklist && draftData.submission_checklist.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 sm:gap-3 bg-[#081538] p-3 sm:p-3.5 rounded-xl border border-blue-900/60">
                        <span className="text-emerald-400 font-bold mt-0.5">✔</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm uppercase tracking-wider text-amber-300 font-indic mb-3 font-bold flex items-center gap-2">
                    <ListTodo className="w-4 h-4 text-amber-400" />
                    <span>{t.tabEscalation}</span>
                  </h4>
                  <div className="space-y-2.5 sm:space-y-3">
                    {draftData.escalation_steps && draftData.escalation_steps.map((stepDesc: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2.5 sm:gap-3.5 bg-[#081538] p-3 sm:p-4 rounded-xl border border-blue-900/60">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-amber-500/20 border border-amber-500/60 text-amber-300 flex items-center justify-center text-xs sm:text-sm font-bold shrink-0">
                          {idx + 1}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mt-0.5 font-sans">
                          {stepDesc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <button
                onClick={handleRestart}
                className="text-xs sm:text-sm text-slate-300 hover:text-white font-sans flex items-center justify-center sm:justify-start gap-1.5 transition-colors cursor-pointer font-semibold px-3 py-2 rounded-lg hover:bg-blue-950 min-h-[40px]"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.btnRestart}</span>
              </button>
              <p className="text-xs sm:text-sm text-slate-400 font-sans text-center sm:text-right">
                {t.zeroRetentionNotice}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* INTERACTIVE CITIZEN GUIDANCE MODAL */}
      {showGuide && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowGuide(false)}
        >
          <div 
            className="w-full max-w-2xl max-h-[90dvh] overflow-y-auto bg-[#071330] border border-blue-700/80 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-7 space-y-4 sm:space-y-5 text-slate-200 font-sans relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between border-b border-blue-800/80 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shrink-0">
                  <LionCapitalEmblem className="w-6 h-7 sm:w-7 sm:h-8 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-bold font-indic text-white flex items-center gap-2">
                    <span>{lang === 'hi' ? 'आसान मार्गदर्शिका' : 'How NyayaPath Works'}</span>
                    <span className="text-amber-400 text-xs sm:text-sm font-semibold">
                      {lang === 'hi' ? '• 4 आसान कदम' : '• 4 Simple Steps'}
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                    {lang === 'hi'
                      ? 'अपनी समस्या को सही कानूनी शिकायत पत्र में बदलने का आसान तरीका।'
                      : 'Simple 4-step process to create your official legal complaint letter.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="text-slate-400 hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-blue-900/60 transition-colors cursor-pointer"
                title="Close Guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 4 ROADMAP STEP CARDS */}
            <div className="space-y-2.5 sm:space-y-3">
              {GUIDE_STEPS.map((g) => {
                const title = g.title[lang] || g.title.en;
                const desc = g.desc[lang] || g.desc.en;
                const badgeColor = g.step === '01' ? 'border-amber-500/60 bg-amber-500/20 text-amber-300' :
                                   g.step === '02' ? 'border-blue-500/60 bg-blue-500/20 text-blue-300' :
                                   g.step === '03' ? 'border-emerald-500/60 bg-emerald-500/20 text-emerald-300' :
                                   'border-cyan-500/60 bg-cyan-500/20 text-cyan-300';
                return (
                  <div key={g.step} className="p-3 sm:p-4 rounded-xl bg-[#0a1b42] border border-blue-900/80 flex items-start gap-3 hover:border-amber-500/50 transition-colors">
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 ${badgeColor}`}>
                      {g.step}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-base font-bold text-white font-indic">{title}</h4>
                        <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-blue-950 text-slate-300 border border-blue-800 font-semibold">
                          {lang === 'hi' ? `कदम ${g.badge}` : `Step ${g.badge}`}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                        {desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TRUST & ZERO RETENTION NOTICE */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#040d22] border border-emerald-500/40 space-y-1.5 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs sm:text-base">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
                <span>{lang === 'hi' ? '🔒 100% नि:शुल्क व पूरी तरह सुरक्षित (Full Privacy)' : '🔒 100% Free & Completely Private'}</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-200">
                {lang === 'hi'
                  ? 'फोन नंबर या किसी आईडी की जरूरत नहीं। आपकी लिखी कोई भी बात किसी सर्वर पर सेव नहीं होती। जब चाहें सब मिटा सकते हैं।'
                  : 'No phone number or login needed. Your complaint is never saved on any server. You can reset anytime.'}
              </p>
            </div>

            {/* PRIMARY CTA BUTTON */}
            <button
              onClick={() => setShowGuide(false)}
              className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-sm sm:text-base rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-950/50 min-h-[48px]"
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
