import { NextResponse } from 'next/server';
import { GoogleGenAI, Type, Schema } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    jurisdiction: { type: Type.STRING, description: "CENTRAL | STATE_PUNJAB | STATE_UP | LOCAL_POLICE" },
    target_authority: { type: Type.STRING },
    authority_portal_url: { type: Type.STRING },
    routing_explanation: { type: Type.STRING, description: "Clear explanation of why this authority has legal jurisdiction" },
    readiness_score: { type: Type.INTEGER, description: "Complaint readiness score between 20 and 95 based on current facts" },
    missing_elements: { type: Type.ARRAY, items: { type: Type.STRING } },
    clarifying_questions: { type: Type.ARRAY, items: { type: Type.STRING } },
    timeline: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Chronological sequence of identified events" },
    evidence_checklist: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific evidence/documents recommended" },
    whistleblower_eligible: { type: Type.BOOLEAN },
    emergency_danger_detected: { type: Type.BOOLEAN, description: "True if physical violence, assault, kidnapping, or imminent physical danger" },
    emergency_guidance: { type: Type.STRING, description: "Emergency helpline and safety instruction if danger is detected" }
  },
  required: [
    "jurisdiction", 
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
    const { grievance, language = 'en' } = await req.json();

    if (!grievance) {
      return NextResponse.json({ error: 'Grievance is required' }, { status: 400 });
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

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: grievance,
      config: {
        systemInstruction: `You are NyayaPath, a premier Indian citizen grievance intelligence and routing architect. 
Analyze the user's plain-language grievance. 
Determine:
1. Exact Jurisdiction & Target Receiving Authority (focusing on Punjab e.g. Vigilance Bureau / Lokpal, UP e.g. ACO / IGRS Jansunwai, Central CVC / Lokpal, or District Police).
2. Routing Explanation: Clearly explain WHY this body is responsible and which official mandate or statute governs it.
3. Complaint Readiness Score (estimate 0-100% based on present facts: dates, specific designations, transaction details, evidence).
4. Chronological Timeline: Extract dates and events.
5. Evidence Checklist: Recommend specific documents, receipts, recordings, or witness statements needed.
6. Gap-Closing Clarifications: Formulate 2-3 concise, non-intimidating questions to fill critical voids.
7. Whistleblower Eligibility & Physical Emergency Safety check.
${langDirective}`,
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
