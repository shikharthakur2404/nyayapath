import { NextResponse } from 'next/server';
import { GoogleGenAI, Type, Schema } from '@google/genai';
import { checkRateLimit, getClientIp } from '@/lib/rateLimiter';
import { GEMINI_MODEL, MAX_GRIEVANCE_LENGTH, MAX_ANSWER_LENGTH, generateContentWithRetry } from '@/lib/gemini';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const draftResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    formal_draft: { type: Type.STRING, description: "Full statutory legal complaint draft with standard administrative layout" },
    citizen_view: { type: Type.STRING, description: "Plain-language summary of what the complaint asserts, why, and what is demanded" },
    escalation_steps: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Chronological follow-up and escalation plan (Day 1 submission, Day 15 reminder, Day 30 escalation bodies)"
    },
    submission_checklist: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Step-by-step checklist for physical / digital filing"
    }
  },
  required: ["formal_draft", "citizen_view", "escalation_steps", "submission_checklist"]
};

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting Protection (10 requests per 10 mins per IP)
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(clientIp, 10, 10 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Rate limit exceeded. Too many requests. Please retry in ${rateLimit.retryAfterSec} seconds.` },
        { status: 429 }
      );
    }

    const { grievance, answers, jurisdictionInfo, draftLanguage = 'en' } = await req.json();

    if (!grievance || typeof grievance !== 'string') {
      return NextResponse.json({ error: 'Grievance text is required.' }, { status: 400 });
    }

    if (grievance.length > MAX_GRIEVANCE_LENGTH) {
      return NextResponse.json(
        { error: `Grievance exceeds maximum allowed length of ${MAX_GRIEVANCE_LENGTH} characters.` },
        { status: 400 }
      );
    }

    // Sanitize answers
    if (answers && typeof answers === 'object') {
      for (const key of Object.keys(answers)) {
        if (typeof answers[key] === 'string' && answers[key].length > MAX_ANSWER_LENGTH) {
          answers[key] = answers[key].slice(0, MAX_ANSWER_LENGTH);
        }
      }
    }

    let langInstruction = "Draft both formal_draft and citizen_view in formal administrative English.";
    if (draftLanguage === 'hi') {
      langInstruction = "Draft formal_draft and citizen_view in official formal Hindi (हिन्दी, देवनागरी लिपि).";
    } else if (draftLanguage === 'pa') {
      langInstruction = "Draft formal_draft and citizen_view in official formal Punjabi (ਪੰਜਾਬੀ, ਗੁਰਮੁਖੀ ਲਿਪੀ).";
    } else if (draftLanguage === 'mr') {
      langInstruction = "Draft formal_draft and citizen_view in official formal Marathi (मराठी, देवनागरी लिपि).";
    } else if (draftLanguage === 'bn') {
      langInstruction = "Draft formal_draft and citizen_view in official formal Bengali (বাংলা লিপি).";
    } else if (draftLanguage === 'ta') {
      langInstruction = "Draft formal_draft and citizen_view in official formal Tamil (தமிழ் எழுத்துமுறை).";
    } else if (draftLanguage === 'te') {
      langInstruction = "Draft formal_draft and citizen_view in official formal Telugu (తెలుగు లిపి).";
    } else if (draftLanguage === 'gu') {
      langInstruction = "Draft formal_draft and citizen_view in official formal Gujarati (ગુજરાતી લિપિ).";
    } else if (draftLanguage === 'kn') {
      langInstruction = "Draft formal_draft and citizen_view in official formal Kannada (ಕನ್ನಡ ಲಿಪಿ).";
    } else if (draftLanguage === 'bilingual') {
      langInstruction = "Draft formal_draft with each legal section first in English followed by accurate regional language translation. Draft citizen_view in English with key regional notes.";
    }

    const prompt = `
USER'S ORIGINAL GRIEVANCE (May be in English, Hindi, or Hinglish):
${grievance}

VERIFIED ANSWERS TO CLARIFYING QUESTIONS:
${JSON.stringify(answers || {})}

CLASSIFIED JURISDICTION & AUTHORITY:
${JSON.stringify(jurisdictionInfo || {})}

LANGUAGE REQUIREMENT:
${langInstruction}

INSTRUCTIONS:
1. FORMAL DRAFT:
   - To: [Designation of Receiving Authority, Department, Location]
   - Subject: [Formal Statutory Subject Line with section references]
   - Complainant Details: [Name / Confidential Whistleblower request]
   - Chronological Statement of Facts: [Numbered, factual paragraphs with exact dates, names, locations]
   - Specific Grievance & Statutory Breaches: [Cite specific Indian acts e.g. Prevention of Corruption Act 1988/2018, BNSS 2023 / CrPC, Civil Services Rules]
   - Relief / Action Requested: [Concrete, lawful prayers e.g. formal inquiry, trap operation, suspension, completion of service]
   - List of Enclosures: [Numbered evidence list including electronic certificate under Sec 63B BSA 2023 / 65B IEA]
   - Verification: End the draft with TODAY'S DATE (${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}), Place, and a placeholder for Signature.

2. CITIZEN VIEW:
   - Provide a clear, non-intimidating plain language summary:
     "In simple words: What this document says, who it is sent to, and what outcome is demanded."

3. ESCALATION STEPS:
   - What the citizen must do if there is no response in 15 days, 30 days, or if retaliation occurs.

4. SUBMISSION CHECKLIST:
   - How many copies to print, where to sign, portal upload procedure, keeping an acknowledged copy.
`;

    const response = await generateContentWithRetry(ai, {
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: "You are NyayaPath Legal Drafting & Citizen Empowerment Engine. The user may write in English, Hindi, or Hinglish. Synthesize verified grievance facts into a legally unassailable administrative draft and an accessible citizen summary.",
        responseMimeType: "application/json",
        responseSchema: draftResponseSchema,
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('No draft generated by Gemini');
    }

    return NextResponse.json(JSON.parse(text));
  } catch (error: unknown) {
    console.error('Drafting error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Internal Server Error' }, { status: 500 });
  }
}
