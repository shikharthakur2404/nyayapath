import { NextResponse } from 'next/server';
import { GoogleGenAI, Type, Schema } from '@google/genai';
import { checkRateLimit, getClientIp } from '@/lib/rateLimiter';
import { GEMINI_MODEL, MAX_GRIEVANCE_LENGTH, generateContentWithRetry } from '@/lib/gemini';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    jurisdiction: { 
      type: Type.STRING, 
      description: "CENTRAL | STATE | LOCAL_POLICE | SPECIALIZED_COMMISSION" 
    },
    state_or_ut: { 
      type: Type.STRING, 
      description: "Name of the relevant State or Union Territory in India (e.g. Punjab, Uttar Pradesh, Maharashtra, Karnataka, Tamil Nadu, West Bengal, Gujarat, Delhi, etc.) or 'CENTRAL' if pan-India body" 
    },
    target_authority: { type: Type.STRING },
    authority_portal_url: { type: Type.STRING },
    routing_explanation: { 
      type: Type.STRING, 
      description: "Clear explanation of why this specific authority has legal mandate over this grievance" 
    },
    readiness_score: { 
      type: Type.INTEGER, 
      description: "Complaint readiness score between 20 and 95 based on present factual completeness" 
    },
    missing_elements: { type: Type.ARRAY, items: { type: Type.STRING } },
    clarifying_questions: { type: Type.ARRAY, items: { type: Type.STRING } },
    timeline: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Chronological sequence of identified events" },
    evidence_checklist: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific evidence/documents recommended" },
    whistleblower_eligible: { type: Type.BOOLEAN },
    emergency_danger_detected: { 
      type: Type.BOOLEAN, 
      description: "True if physical violence, assault, kidnapping, or imminent physical danger is detected" 
    },
    emergency_guidance: { 
      type: Type.STRING, 
      description: "Emergency helpline and safety instruction if danger is detected" 
    }
  },
  required: [
    "jurisdiction",
    "state_or_ut",
    "target_authority", 
    "authority_portal_url", 
    "routing_explanation", 
    "readiness_score", 
    "missing_elements", 
    "clarifying_questions", 
    "timeline", 
    "evidence_checklist", 
    "whistleblower_eligible", 
    "emergency_danger_detected", 
    "emergency_guidance"
  ]
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

    const { grievance, language = 'en' } = await req.json();

    if (!grievance || typeof grievance !== 'string' || !grievance.trim()) {
      return NextResponse.json({ error: 'Grievance text is required.' }, { status: 400 });
    }

    if (grievance.length > MAX_GRIEVANCE_LENGTH) {
      return NextResponse.json(
        { error: `Grievance exceeds maximum allowed length of ${MAX_GRIEVANCE_LENGTH} characters.` },
        { status: 400 }
      );
    }

    const languageMap: Record<string, string> = {
      hi: "Hindi (हिन्दी, Devanagari script)",
      pa: "Punjabi (ਪੰਜਾਬੀ, Gurmukhi script)",
      mr: "Marathi (मराठी, Devanagari script)",
      bn: "Bengali (বাংলা script)",
      ta: "Tamil (தமிழ் script)",
      te: "Telugu (తెలుగు script)",
      gu: "Gujarati (ગુજરાતી script)",
      kn: "Kannada (ಕನ್ನಡ script)",
      en: "English"
    };

    const targetLang = languageMap[language] || "English";
    const langDirective = language !== 'en'
      ? `IMPORTANT: Provide the 'clarifying_questions', 'missing_elements', 'routing_explanation', 'timeline', and 'evidence_checklist' in ${targetLang}.`
      : "Provide all fields in clear, accessible English.";

    const systemInstruction = `You are NyayaPath, an expert pan-India citizen grievance intelligence and legal routing architect. 
Analyze the user's plain-language grievance across all 28 States, 8 Union Territories, and Central Government departments in India.

JURISDICTION ROUTING REFERENCE TABLE (PAN-INDIA):
- Central Govt / PSU / National Bank / Railway Employees: Central Vigilance Commission (CVC / VIGEYE) or Lokpal of India under Prevention of Corruption Act (PCA) 1988.
- Punjab State Public Servants (Patwari, Police, Municipal): Punjab Vigilance Bureau (VB) / CM Anti-Corruption Line / Punjab Lokpal.
- Uttar Pradesh State Public Servants (Lekhpal, RTO, Revenue): UP Anti-Corruption Organization (ACO) / IGRS Jansunwai (jansunwai.up.nic.in) / UP Lokayukta.
- Maharashtra State Public Servants (Talathi, Municipal, Police): Maharashtra Anti-Corruption Bureau (ACB - acbmaharashtra.gov.in) / Maharashtra Lokayukta.
- Karnataka State Public Servants (Tahsildar, BBMP, PWD): Karnataka Lokayukta (lokayukta.kar.nic.in).
- Tamil Nadu State Public Servants (VAO, Revenue, Police): Directorate of Vigilance and Anti-Corruption (DVAC - dvac.tn.gov.in).
- West Bengal State Public Servants (Revenue, Civic, Police): Anti-Corruption Branch, West Bengal / West Bengal Lokayukta.
- Gujarat State Public Servants (Talati, Revenue): Gujarat Anti-Corruption Bureau (ACB - acb.gujarat.gov.in).
- Delhi Public Servants: Anti-Corruption Branch (ACB), GNCTD / Lokayukta Delhi.
- Police Inaction / Refusal to Register FIR: Written complaint to District Superintendent of Police (SP / SSP / Commissioner) under Section 154(3) CrPC / Section 173(4) BNSS 2023. Distinct from substantive crime.
- Women Safety / Harassment: State Women's Commission / National Commission for Women (NCW) / 181 Helpline.
- Information Denial: Public Information Officer (PIO) -> First Appellate Authority -> Central/State Information Commission under RTI Act 2005.

ROUTING INSTRUCTIONS:
1. Determine the exact Jurisdiction Level (CENTRAL, STATE, LOCAL_POLICE, SPECIALIZED_COMMISSION) and the specific State/UT.
2. Direct the complaint to the exact nodal anti-corruption / grievance body of that jurisdiction.
3. Provide an explainable routing rationale: cite the statutory authority and official mandate.
4. Calculate a dynamic Complaint Readiness Score (20-95%) reflecting factual completeness.
5. Extract a chronological timeline of events.
6. Build a tailored evidence checklist (e.g. BSA 2023 Sec 63B certificate for digital proof, receipts, witness logs).
7. Generate 2-3 concise, non-intimidating clarifying questions to close critical information gaps.
8. Assess whistleblower eligibility and flag any imminent physical threats.

${langDirective}`;

    const response = await generateContentWithRetry(ai, {
      model: GEMINI_MODEL,
      contents: grievance,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('No text returned from Gemini');
    }

    return NextResponse.json(JSON.parse(text));
  } catch (error: unknown) {
    console.error('Classification error:', error);
    return NextResponse.json({ error: (error as Error).message || 'Internal Server Error' }, { status: 500 });
  }
}
