interface SceneProps {
  foundClues: string[]
  onClueFound?: (clueId: string) => void
}

export default function Playa03Scene({ foundClues, onClueFound }: SceneProps) {
  const found = foundClues.includes('playa_03_clue_1')

  return (
    <svg viewBox="0 0 600 400" className="w-full h-full">
      {/* Indoor background */}
      <rect width="600" height="400" fill="#edf4ff" />
      <rect x="50" y="50" width="500" height="300" rx="15" fill="white" stroke="#bfc8d0" strokeWidth="2" />

      {/* Photo frame */}
      <rect x="80" y="80" width="440" height="240" rx="10" fill="#f7f9ff" stroke="#d4e4f8" strokeWidth="2" />
      <text x="300" y="110" textAnchor="middle" fill="#3f484f" fontSize="12" fontFamily="monospace">📸 Selfie of the day</text>

      {/* Selfie person (simplified Pebble taking selfie) */}
      <circle cx="260" cy="200" r="35" fill="#097dac" />
      <circle cx="248" cy="188" r="5" fill="white" />
      <circle cx="272" cy="188" r="5" fill="white" />
      <circle cx="246" cy="186" r="2.5" fill="#0d1d2b" />
      <circle cx="270" cy="186" r="2.5" fill="#0d1d2b" />
      <ellipse cx="260" cy="208" rx="8" ry="4" fill="#fd6e58" />
      <ellipse cx="260" cy="235" rx="25" ry="30" fill="#097dac" />
      {/* Arm holding phone */}
      <line x1="285" y1="210" x2="320" y2="195" stroke="#097dac" strokeWidth="6" strokeLinecap="round" />
      <rect x="315" y="182" width="18" height="28" rx="3" fill="#1C2B3A" />
      <text x="324" y="200" textAnchor="middle" fill="white" fontSize="10">📱</text>
      {/* Funny hat */}
      <ellipse cx="260" cy="170" rx="30" ry="8" fill="#f9bc46" />
      <rect x="245" y="145" width="30" height="25" rx="5" fill="#f9bc46" />
      <circle cx="260" cy="145" r="8" fill="#fd6e58" />

      {/* SCHOOL SIGN IN BACKGROUND - CLUE */}
      {!found ? (
        <g onClick={() => onClueFound?.('playa_03_clue_1')} className="cursor-pointer">
          <rect x="380" y="110" width="120" height="50" rx="5" fill="#d4e4f8" stroke="#006389" strokeWidth="2" />
          <text x="440" y="128" textAnchor="middle" fill="#006389" fontSize="9" fontFamily="monospace" fontWeight="bold">ESCUELA</text>
          <text x="440" y="142" textAnchor="middle" fill="#006389" fontSize="9" fontFamily="monospace" fontWeight="bold">GLACIAR NORTE</text>
          <text x="440" y="155" textAnchor="middle" fill="#006389" fontSize="7" fontFamily="monospace">Welcome!</text>
          {/* Highlight pulse */}
          <rect x="380" y="110" width="120" height="50" rx="5" fill="none" stroke="#fd6e58" strokeWidth="2" strokeDasharray="5,3" opacity="0.8">
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="1.5s" repeatCount="indefinite" />
          </rect>
        </g>
      ) : (
        <g>
          <rect x="380" y="110" width="120" height="50" rx="5" fill="#fd6e58" stroke="#ac3323" strokeWidth="2" />
          <text x="440" y="128" textAnchor="middle" fill="white" fontSize="9" fontFamily="monospace" fontWeight="bold">ESCUELA</text>
          <text x="440" y="142" textAnchor="middle" fill="white" fontSize="9" fontFamily="monospace" fontWeight="bold">GLACIAR NORTE</text>
          <text x="440" y="155" textAnchor="middle" fill="white" fontSize="7">🏫 School visible!</text>
        </g>
      )}

      {/* Found badge */}
      {found && (
        <g>
          <rect x="150" y="320" width="300" height="35" rx="17" fill="#097dac" opacity="0.95" />
          <text x="300" y="342" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">🔍 The school name is visible in the photo!</text>
        </g>
      )}
    </svg>
  )
}
