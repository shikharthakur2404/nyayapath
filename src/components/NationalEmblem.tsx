import React from 'react';

// 1. OFFICIAL STATE EMBLEM OF INDIA (LION CAPITAL OF ASHOKA WITH SATYAMEVA JAYATE)
export function LionCapitalEmblem({ className = "w-12 h-16", fill = "currentColor" }: { className?: string; fill?: string }) {
  return (
    <svg
      viewBox="0 0 100 130"
      className={className}
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="State Emblem of India - Lion Capital of Ashoka"
    >
      {/* Crown / Top Abacus Details */}
      <g stroke="currentColor" strokeWidth="1.2" fill={fill}>
        {/* Central Lion Head */}
        <path d="M50 12 C44 12, 39 16, 39 23 C39 27, 41 31, 44 33 C41 35, 38 38, 38 42 C38 48, 43 51, 50 51 C57 51, 62 48, 62 42 C62 38, 59 35, 56 33 C59 31, 61 27, 61 23 C61 16, 56 12, 50 12 Z" />
        {/* Central Lion Mane & Face Features */}
        <path d="M47 21 C48 19, 52 19, 53 21" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="45" cy="25" r="1.5" />
        <circle cx="55" cy="25" r="1.5" />
        <path d="M48 29 C49 31, 51 31, 52 29" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M46 34 C48 37, 52 37, 54 34" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M43 40 C46 44, 54 44, 57 40" strokeWidth="1.2" strokeLinecap="round" />

        {/* Left Lion Profile */}
        <path d="M38 24 C33 22, 26 26, 26 33 C26 38, 29 42, 33 44 C29 47, 28 52, 30 56 C33 60, 39 60, 42 57 L41 46 C39 44, 38 41, 38 38 Z" />
        <circle cx="31" cy="34" r="1.2" />
        <path d="M28 40 C30 42, 34 42, 35 40" strokeWidth="1" strokeLinecap="round" />

        {/* Right Lion Profile */}
        <path d="M62 24 C67 22, 74 26, 74 33 C74 38, 71 42, 67 44 C71 47, 72 52, 70 56 C67 60, 61 60, 58 57 L59 46 C61 44, 62 41, 62 38 Z" />
        <circle cx="69" cy="34" r="1.2" />
        <path d="M65 40 C67 42, 71 42, 72 40" strokeWidth="1" strokeLinecap="round" />

        {/* Pillar Chest & Mane Structure */}
        <path d="M36 54 C36 65, 42 72, 50 72 C58 72, 64 65, 64 54 Z" fillOpacity="0.4" />
        <path d="M42 56 C44 64, 47 68, 50 68 C53 68, 56 64, 58 56" fill="none" strokeWidth="1.2" />
        <path d="M37 62 C41 68, 45 70, 50 70 C55 70, 59 68, 63 62" fill="none" strokeWidth="1" />

        {/* Circular Abacus Upper Plate */}
        <rect x="22" y="74" width="56" height="5" rx="2" />
        
        {/* Abacus Frieze with Central Dharma Chakra */}
        <rect x="20" y="79" width="60" height="14" rx="1" fillOpacity="0.2" />
        {/* Center Ashoka Chakra on Abacus */}
        <circle cx="50" cy="86" r="6" strokeWidth="1" fill="none" />
        <circle cx="50" cy="86" r="1.5" fill="currentColor" />
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="86"
            x2="50"
            y2="80"
            strokeWidth="0.7"
            transform={`rotate(${i * 30} 50 86)`}
          />
        ))}

        {/* Left Galloping Horse Silhouette Representation */}
        <path d="M26 83 C28 81, 31 82, 33 85 C31 87, 28 88, 26 87 C24 86, 24 84, 26 83 Z" />
        <path d="M25 88 L23 91 M30 88 L32 91" strokeWidth="1" strokeLinecap="round" />

        {/* Right Standing Bull Silhouette Representation */}
        <path d="M67 83 C69 82, 73 83, 74 86 C73 88, 70 88, 68 87 C66 86, 66 84, 67 83 Z" />
        <path d="M69 88 L68 91 M73 88 L74 91" strokeWidth="1" strokeLinecap="round" />

        {/* Inverted Lotus Base (Padma) */}
        <path d="M24 93 C32 99, 42 101, 50 101 C58 101, 68 99, 76 93 L78 97 C68 104, 58 106, 50 106 C42 106, 32 104, 22 97 Z" />
        <path d="M30 96 C36 102, 44 104, 50 104 C56 104, 64 102, 70 96" fill="none" strokeWidth="0.9" />

        {/* Base Pedestal Plinth */}
        <rect x="18" y="106" width="64" height="4" rx="1.5" />
      </g>

      {/* MOTTO: SATYAMEVA JAYATE (सत्यमेव जयते) in Devanagari */}
      <text
        x="50"
        y="124"
        textAnchor="middle"
        fontSize="10"
        fontWeight="bold"
        fontFamily="'Noto Sans Devanagari', sans-serif"
        letterSpacing="0.8"
        fill="currentColor"
      >
        सत्यमेव जयते
      </text>
    </svg>
  );
}

// 2. 24-SPOKE ASHOKA CHAKRA (DHARMA CHAKRA)
export function AshokaChakra({ className = "w-20 h-20 text-blue-500", strokeWidth = 1 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Ashoka Chakra - 24 Spokes"
    >
      {/* Outer Rings */}
      <circle cx="50" cy="50" r="46" strokeWidth={strokeWidth * 1.5} />
      <circle cx="50" cy="50" r="42" strokeDasharray="1.5 2" strokeWidth={strokeWidth * 0.8} />
      {/* Inner Hub */}
      <circle cx="50" cy="50" r="8" strokeWidth={strokeWidth * 1.2} />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
      
      {/* 24 Spokes */}
      {Array.from({ length: 24 }).map((_, i) => (
        <line
          key={i}
          x1="50"
          y1="50"
          x2="50"
          y2="4"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          transform={`rotate(${i * 15} 50 50)`}
        />
      ))}
    </svg>
  );
}

// 3. NATIONAL TRICOLOR RIBBON (TIRANGA)
export function TricolorRibbon({ height = "h-1.5" }: { height?: string }) {
  return (
    <div className={`w-full ${height} flex shadow-sm`}>
      <div className="flex-1 bg-[#FF9933]" title="Kesariya / Saffron" />
      <div className="flex-1 bg-white relative flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-[#000080]" />
      </div>
      <div className="flex-1 bg-[#138808]" title="India Green" />
    </div>
  );
}

// 4. DIGITAL INDIA & CITIZEN INITIATIVE CREST
export function DigitalIndiaCrest({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center rounded-full bg-gradient-to-tr from-amber-500/20 via-blue-500/20 to-emerald-500/20 border border-amber-400/40 p-1.5 ${className}`}>
      <AshokaChakra className="w-full h-full text-amber-400 animate-spin-slow" strokeWidth={1.2} />
    </div>
  );
}
