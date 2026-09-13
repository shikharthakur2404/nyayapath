# NyayaPath (न्यायपथ / ਨਿਆਂਪਥ)
### Pan-India Citizen Grievance Intelligence & Legal Complaint Router

**Product Name:** NyayaPath ("Path to Justice")  
**Target Coverage:** Pan-India (All 28 States & 8 UTs + Central Authorities)  
**Lead / Author:** Shikhar Thakur  
**Budget Constraint:** ₹0 Infrastructure & Hosting (Vercel / Cloudflare free-tier)  
**Intelligence Core:** Google Gemini 3.6 Flash Developer API via `@google/genai`  
**License:** Public Interest Open Source  

---

## 1. Executive Summary & Philosophy

India maintains established statutory grievance and anti-corruption mechanisms:
- **Central Level:** Central Vigilance Commission (CVC), Lokpal of India, CBI, Central Information Commission (CIC).
- **State Level:** State Anti-Corruption Bureaus (ACBs), State Lokayuktas, Directorate of Vigilance (e.g. Punjab VB, UP ACO, Maharashtra ACB, Karnataka Lokayukta, Tamil Nadu DVAC).
- **Departmental / Revenue:** District Magistrates (DM), Sub-Divisional Magistrates (SDM), Tehsildars, Revenue Courts.
- **Police & Civil Rights:** District Superintendent of Police (SP/SSP) escalations under Section 154(3) CrPC / Section 173(4) BNSS 2023, State Women's Commissions, RTI Act.

### The Real Friction
Grievances die before submission because:
1. **Jurisdiction Blindness:** Citizens cannot distinguish between Central vs. State officers, or direct crimes vs. police inaction escalation paths.
2. **Structural Rejections:** Complaints lack dates, sequential facts, statutory references, or proper formatting.
3. **Language Barriers:** Official administrative drafting requires formal legal terms inaccessible to vernacular citizens.
4. **Fear of Retaliation:** Complainants are unaware of confidentiality and protections under the *Whistle Blowers Protection Act, 2014*.

### The Core Solution
**NyayaPath** is an intelligent, zero-retention routing and drafting assistant. It takes natural language input across **9 major Indian languages** (English, Hindi, Punjabi, Marathi, Bengali, Tamil, Telugu, Gujarati, Kannada) and converts it into a formal, actionable legal draft directed to the exact authority.

> **Absolute Privacy Boundary:** NyayaPath operates on pure in-memory ephemeral client state under DPDPA 2023 principles. It maintains **NO central database**, no citizen dossiers, and no tracking cookies. A one-click **Burn Bag (Destroy Case)** feature permanently wipes all local session data.

---

## 2. System Architecture & Flow

```text
       ┌─────────────────────────────────────────────────────────────────┐
       │                  1. Plain Language Grievance                    │
       │ (English, हिन्दी, ਪੰਜਾਬੀ, मराठी, বাংলা, தமிழ், తెలుగు, ગુજરાતી, ಕನ್ನಡ)  │
       └────────────────────────────────┬────────────────────────────────┘
                                        │
                                        ▼
       ┌─────────────────────────────────────────────────────────────────┐
       │                   2. Pan-India Routing Engine                   │
       │       - State & Central Authority Matching (VB, ACB, CVC)       │
       │       - Explainable Routing Rationale                           │
       │       - Dynamic Complaint Readiness Score (0–100%)              │
       │       - Chronological Timeline & Evidence Matrix                │
       │       - Whistleblower & Imminent Physical Danger Detection      │
       └────────────────────────────────┬────────────────────────────────┘
                                        │
                                        ▼
       ┌─────────────────────────────────────────────────────────────────┐
       │                   3. Gap-Closing Clarification                  │
       │      2-3 targeted, localized questions (dates, reference IDs,   │
       │           audio recordings, witness presence)                   │
       └────────────────────────────────┬────────────────────────────────┘
                                        │
                                        ▼
       ┌─────────────────────────────────────────────────────────────────┐
       │                   4. Dual-Representation Output                 │
       │   - Official Statutory Draft (PCA 1988/2018, BNSS, BSA Sec 63B) │
       │   - Citizen Plain View (Plain-language non-legal summary)       │
       │   - Post-Submission Escalation Ladder (Day 1, 15, 30+ RTI/Lokayukta)
       └────────────────────────────────┬────────────────────────────────┘
                                        │
                                        ▼
       ┌─────────────────────────────────────────────────────────────────┐
       │                   5. High-Fidelity Export Engine                │
       │   - Dedicated A4 Vector Print with Google Noto Fonts (All 9)    │
       │   - jsPDF Latin fallback                                        │
       │   - One-click clipboard copy                                    │
       │   - Ephemeral Burn Bag browser destruction                      │
       └─────────────────────────────────────────────────────────────────┘
```

---

## 3. Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack, React 19, TypeScript)
- **Styling & Fonts:** Tailwind CSS v4 + Google Noto Sans/Serif fonts for all 9 Indian scripts
- **AI Backend:** Google Gemini 3.6 Flash (`@google/genai` Developer API)
- **Rate Limiting & Abuse Prevention:** In-memory sliding-window IP rate limiter + 4,000-char input capping
- **SEO & Discoverability:** Rich JSON-LD (`WebApplication`, `FAQPage` rich snippets), `sitemap.xml` with regional hreflang alternates, `robots.txt`
- **Privacy Standard:** Zero Server Database, DPDPA 2023 compliant, client-side ephemeral memory

---

## 4. Local Development

```bash
# Clone the repository
git clone https://github.com/shikharthakur2404/nyayapath.git
cd nyayapath

# Install dependencies
npm install

# Configure environment variables
echo "GEMINI_API_KEY=your_key_here" > .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000` to access the application.
