import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nyayapath.in"),
  title: {
    default: "NyayaPath — Citizen Grievance Intelligence & Legal Complaint Router",
    template: "%s | NyayaPath"
  },
  description: "Free, privacy-first legal drafting and jurisdiction routing assistant for Indian citizens. Convert plain language complaints into formal statutory letters for Vigilance, CVC, Lokpal, Police, and State Authorities in Hindi, Punjabi, Marathi, Bengali, Tamil, Telugu, and English.",
  keywords: [
    "NyayaPath",
    "Nyaya Setu",
    "Indian grievance portal",
    "file complaint against government officer",
    "patwari bribe complaint format",
    "lekhpal bribe complaint UP",
    "Punjab Vigilance Bureau complaint format",
    "police refusal to register FIR complaint format",
    "Section 154 CrPC Section 173 BNSS complaint draft",
    "Prevention of Corruption Act complaint format",
    "Whistleblowers Protection Act India",
    "Jansunwai UP complaint draft",
    "CVC portal complaint draft",
    "Lokpal India complaint draft",
    "RTI draft online India",
    "citizen legal drafting assistant"
  ],
  authors: [{ name: "NyayaPath Public Interest Technology" }],
  creator: "Shikhar Thakur",
  publisher: "NyayaPath",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "NyayaPath — Citizen Grievance Intelligence & Legal Router",
    description: "Empowering citizens across India to draft formal statutory complaints against corruption, police inaction, and administrative delays.",
    url: "https://nyayapath.in",
    siteName: "NyayaPath",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NyayaPath — Citizen Grievance Intelligence & Legal Router",
    description: "Turn everyday administrative friction into structured, jurisdiction-routed legal action in multiple Indian languages.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://nyayapath.in",
    languages: {
      'en': 'https://nyayapath.in?lang=en',
      'hi': 'https://nyayapath.in?lang=hi',
      'pa': 'https://nyayapath.in?lang=pa',
      'mr': 'https://nyayapath.in?lang=mr',
      'bn': 'https://nyayapath.in?lang=bn',
      'ta': 'https://nyayapath.in?lang=ta',
      'te': 'https://nyayapath.in?lang=te',
      'gu': 'https://nyayapath.in?lang=gu',
      'kn': 'https://nyayapath.in?lang=kn',
    }
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "NyayaPath",
      "alternateName": ["न्यायपथ", "ਨਿਆਂਪਥ"],
      "url": "https://nyayapath.in",
      "description": "Independent, zero-retention citizen grievance navigation and administrative complaint drafting platform for India.",
      "applicationCategory": "LegalApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR"
      },
      "inLanguage": ["en", "hi", "pa", "mr", "bn", "ta", "te"]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How to file a complaint if police refuse to register an FIR?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Under Section 154(3) CrPC (Section 173(4) of BNSS 2023), if the police station in-charge refuses to register an FIR, you can send the substance of the complaint in writing by registered post to the District Superintendent of Police (SP/SSP). NyayaPath drafts this formal escalation letter for you."
          }
        },
        {
          "@type": "Question",
          "name": "Where do I report a Patwari or Lekhpal demanding a bribe?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Demanding a bribe by a state revenue employee is an offence under Section 7 of the Prevention of Corruption Act 1988. In Punjab, report to the Punjab Vigilance Bureau or the CM Anti-Corruption Action Line. In Uttar Pradesh, report to the UP Anti-Corruption Organization (ACO) or the IGRS Jansunwai portal."
          }
        },
        {
          "@type": "Question",
          "name": "Is my data stored when using NyayaPath?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. NyayaPath operates under a strict zero-retention policy compliant with DPDPA 2023. No central database of cases is maintained, and you can destroy your local case draft at any time using the Burn Bag feature."
          }
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#061026] text-slate-100 font-sans selection:bg-amber-500/30">
        {children}
      </body>
    </html>
  );
}
