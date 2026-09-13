# Nyaya Setu (न्याय सेतु)
### A Citizen Complaint Routing & Drafting Assistant for India

**Working Title:** Nyaya Setu ("Bridge to Justice")  
**Target Pilot Geographies:** Punjab (Mohali/Chandigarh) + Uttar Pradesh (Kanpur)  
**Founder / Lead:** Shikhar Thakur  
**Budget Constraint:** ₹0 Infrastructure & Hosting (Free-tier only)  
**Core Engine:** Google Gemini 3.7 Flash Developer API  

---

## 1. Executive Summary & Philosophy

India contains established institutional mechanisms for public grievances and anti-corruption:
- **Central Level:** Central Vigilance Commission (CVC), Lokpal, CBI.
- **State Level:** State Anti-Corruption Bureaus (ACBs), State Lokayuktas, Vigilance Directorates.
- **Departmental / Revenue:** District Magistrates (DM), Sub-Divisional Magistrates (SDM), Tehsildars, Revenue Courts.
- **Police & Civil Rights:** SP/DGP Escalations, State Women's Commissions, National Human Rights Commission (NHRC), RTI Act.

### The Real Friction
Grievances die before submission because:
1. **Jurisdiction Blindness:** Citizens cannot distinguish between Central vs. State officers, or direct crimes vs. police inaction escalation paths.
2. **Structural Rejections:** Complaints lack dates, sequential facts, statutory references, or proper formatting.
3. **Fear of Retaliation:** Complainants are unaware of confidentiality and protections under the *Whistle Blowers Protection Act, 2014*.

### The Core Solution
**Nyaya Setu** is an intelligent, zero-retention routing and drafting assistant. It takes natural language input (Hindi, Punjabi, English) and converts it into a formal, actionable legal draft directed to the exact authority.

> **Absolute Boundary:** Nyaya Setu does **NOT** build public dossiers, name databases, scraped graphs, or accusation lists. It is a client-side legal drafting accelerator.

---

## 2. User Flow & System Architecture

```text
       ┌───────────────────────────────┐
       │   1. Plain Language Input     │
       │   (Hindi / Punjabi / English) │
       │   Voice or Text Description   │
       └───────────────┬───────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │     2. Classification Engine  │
       │   (Jurisdiction & Category)   │
       └───────────────┬───────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │   3. Gap-Closing Interview    │
       │   (2-3 Targeted Questions:    │
       │   Dates, Proofs, Witnesses)   │
       └───────────────┬───────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │   4. Formal Complaint Draft   │
       │   (Statutory Format + Secs)   │
       └───────────────┬───────────────┘
                       │
                       ▼
       ┌───────────────────────────────┐
       │     5. Routing & Submission   │
       │   Official Portal Links,      │
       │   Addresses, Whistleblower    │
       │   Protections Notice          │
       └───────────────────────────────┘
```

---

## 3. Jurisdiction & Routing Taxonomy (Punjab & UP Focus)

| Category / Scenario | Primary Receiving Body | Escalation / Alternate Body | Statutory Reference / Notes |
|---|---|---|---|
| **Bribery by Central Govt Employee** (Railways, Income Tax, National Banks, PSUs) | **CVC / VIGEYE Portal** | Lokpal of India | Prevention of Corruption Act, 1988 (PCA) |
| **Bribery / Extortion by Punjab State Employee** (Patwari, Police, Municipal Corp) | **Punjab Vigilance Bureau (VB)** | Punjab Lokpal | PB Vigilance Toll-free 1800-1800-1000 / CM Anti-Corruption Action Line |
| **Bribery / Extortion by UP State Employee** (Lekhpal, RTO, Development Authority) | **UP Anti-Corruption Organization (ACO)** | UP Lokayukta / IGRS Jansunwai | UP IGRS Portal (`jansunwai.up.nic.in`) |
| **Police Inaction / Refusal to File FIR** (Local Thana) | **Written Complaint to District SP / SSP (Sec 154(3) CrPC / Sec 173(4) BNSS)** | Judicial Magistrate (Sec 156(3) CrPC / Sec 175(3) BNSS) | Distinct from the crime itself: targets procedural non-compliance |
| **Violence / Harassment against Women (with local friction)** | **State Women's Commission (Punjab / UP)** | National Commission for Women (NCW) / Cyber Crime Portal | NCW Online Complaint Management System |
| **Land / Revenue Record Tampering** (Patwari/Lekhpal) | **SDM / District Revenue Officer** | Divisional Commissioner / Lokayukta | State Land Revenue Codes |
| **Information Denial by Public Authority** | **Public Information Officer (PIO) -> First Appellate Authority** | Central/State Information Commission (CIC/SIC) | RTI Act, 2005 (Sec 6(1) & Sec 19) |

---

## 4. Prompt Engineering & LLM Architecture

Using **Google Gemini 3.7 Flash** Developer API via structured JSON outputs:

### Phase 1: Classification & Gap Detection Prompt

```json
{
  "system_instruction": "You are Nyaya Setu, an expert Indian administrative and legal grievance router. Analyze the user's plain-language grievance. Determine the jurisdiction (Central, State - Punjab, State - UP, or Local), the specific category, identify missing critical facts (exact dates, specific designations, transaction IDs, witness presence), and generate up to 3 clarifying questions.",
  "response_schema": {
    "jurisdiction": "CENTRAL | STATE_PUNJAB | STATE_UP | LOCAL_POLICE",
    "target_authority": "string",
    "authority_portal_url": "string",
    "missing_elements": ["string"],
    "clarifying_questions": ["string"],
    "whistleblower_eligible": "boolean"
  }
}
```

### Phase 2: Formal Legal Complaint Drafting Prompt

```text
TASK: Generate a formal, respectful, and legally sound complaint letter based on the verified facts.
STRUCTURE:
1. To: [Designation of Receiving Authority, Department, Location]
2. Subject: Formal Complaint regarding [Concise Subject Line referencing relevant Act/Section]
3. Complainant Details: [Name/Confidential/Representative]
4. Chronological Statement of Facts: [Numbered paragraphs with exact dates and actions]
5. Specific Grievance & Legal Breach: [e.g., Prevention of Corruption Act / Failure under Sec 154 CrPC]
6. Relief / Action Requested: [Formal inquiry, FIR registration, departmental action]
7. List of Enclosures: [Identified documents, receipts, screenshots]
```

---

## 5. Zero-Budget Implementation Stack

| Layer | Technology | Cost | Hosting / Platform |
|---|---|---|---|
| **Frontend** | Next.js 15 (React 19, Tailwind CSS, Lucide Icons) | ₹0 | **Vercel** / **Cloudflare Pages** |
| **LLM Engine** | **Google Gemini 3.7 Flash** (Developer API) | ₹0 | Google AI Studio (Free Tier) |
| **State / Cache** | LocalStorage / IndexedDB (Client-side only) | ₹0 | User Browser (Zero-Knowledge) |
| **Backend / Edge** | Next.js Edge API Routes | ₹0 | Vercel Edge Functions |
| **Export Engine** | `jspdf` / `docx` (Client-side PDF & Word document generation) | ₹0 | In-browser processing |

---

## 6. Privacy & Legal Safeguards (DPDPA 2023 Compliant)

1. **Zero Server Storage:** All text drafts, names, and grievance details are processed in memory and retained purely in the user's local browser storage (`localStorage`). No central database of grievances is maintained.
2. **Whistleblower Framing:** Prominently displays provisions of the *Whistle Blowers Protection Act, 2014* before drafting begins.
3. **Disclaimer & Boundary:** Clear disclaimers stating the tool is an automated drafting assistant, not an advocate, and does not provide legal representation.
4. **Zero Doxxing Vector:** No public feed, no searchable names, no profile aggregation.

---

## 7. Phased Implementation Roadmap

- [ ] **Phase 1 (MVP — 48h):**
  - Next.js web application with language toggle (English / Hindi / Punjabi).
  - Gemini 3.7 Flash classification & multi-turn drafting prompt.
  - One-click PDF download formatted to standard Indian administrative template.
  - Dedicated Punjab (VB/Lokayukta) + UP (ACO/IGRS) routing paths.
- [ ] **Phase 2 (UX & Guidance):**
  - Offline local draft persistence via unique 6-digit access token.
  - Audio input support (Whisper / Gemini multimodal speech-to-text) for rural users.
- [ ] **Phase 3 (Resource Hub):**
  - Verified directory of nodal anti-corruption & grievance officers for Punjab & UP.
