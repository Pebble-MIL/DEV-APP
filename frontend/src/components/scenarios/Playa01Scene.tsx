interface SceneProps {
  foundClues: string[]
  onClueFound?: (clueId: string) => void
}

export default function Playa01Scene({ foundClues, onClueFound }: SceneProps) {
  const found = foundClues.includes('playa_01_clue_1')

  return (
    <svg viewBox="0 0 600 400" className="w-full h-full">
      {/* Sky gradient */}
      <defs>
        <linearGradient id="playaSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#82cfff" />
          <stop offset="100%" stopColor="#f7f9ff" />
        </linearGradient>
      </defs>
      <rect width="600" height="400" fill="url(#playaSky)" />
      {/* Ice ground */}
      <rect y="300" width="600" height="100" fill="#d4e4f8" rx="5" />
      <rect y="320" width="600" height="80" fill="#ccdcf0" rx="5" />

      {/* Cave in background - CLUE AREA */}
      {!found ? (
        <g onClick={() => onClueFound?.('playa_01_clue_1')} className="cursor-pointer">
          <ellipse cx="160" cy="260" rx="65" ry="55" fill="#1C2B3A" />
          <ellipse cx="160" cy="260" rx="55" ry="45" fill="#0d1d2b" />
          <path d="M95 290 Q100 200 160 190 Q220 200 225 290" fill="none" stroke="#3f484f" strokeWidth="3" />
          {/* Glow to attract attention */}
          <ellipse cx="160" cy="260" rx="60" ry="50" fill="none" stroke="#fd6e58" strokeWidth="2" strokeDasharray="6,4" opacity="0.7">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
          </ellipse>
        </g>
      ) : (
        <g>
          <ellipse cx="160" cy="260" rx="65" ry="55" fill="#1C2B3A" />
          <ellipse cx="160" cy="260" rx="55" ry="45" fill="#0d1d2b" />
          <path d="M95 290 Q100 200 160 190 Q220 200 225 290" fill="none" stroke="#3f484f" strokeWidth="3" />
          <text x="160" y="270" textAnchor="middle" fill="#fd6e58" fontSize="24">🚫</text>
        </g>
      )}

      {/* Bright rock */}
      <ellipse cx="350" cy="290" rx="45" ry="28" fill="#e3efff" stroke="#bfc8d0" strokeWidth="2" />
      <ellipse cx="345" cy="285" rx="35" ry="20" fill="#f7f9ff" />
      <ellipse cx="340" cy="280" rx="15" ry="10" fill="white" opacity="0.6" />
      {/* Sparkle effect */}
      <text x="355" y="275" fill="#f9bc46" fontSize="18">✦</text>
      <text x="330" y="295" fill="#f9bc46" fontSize="12">✦</text>

      {/* Pebble character */}
      <g transform="translate(460, 200)">
        <circle cx="0" cy="0" r="28" fill="#097dac" />
        <circle cx="-10" cy="-10" r="4" fill="white" />
        <circle cx="10" cy="-10" r="4" fill="white" />
        <circle cx="-8" cy="-10" r="2" fill="#0d1d2b" />
        <circle cx="8" cy="-10" r="2" fill="#0d1d2b" />
        <ellipse cx="0" cy="5" rx="5" ry="3" fill="#fd6e58" />
        <ellipse cx="0" cy="30" rx="18" ry="22" fill="#097dac" />
        <ellipse cx="-10" cy="52" rx="7" ry="4" fill="#f9bc46" />
        <ellipse cx="10" cy="52" rx="7" ry="4" fill="#f9bc46" />
      </g>

      {/* Found badge */}
      {found && (
        <g>
          <rect x="150" y="100" width="280" height="40" rx="20" fill="#097dac" opacity="0.95" />
          <text x="290" y="125" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">🔍 ¡La cueva está visible! Mala idea...</text>
        </g>
      )}
    </svg>
  )
}
