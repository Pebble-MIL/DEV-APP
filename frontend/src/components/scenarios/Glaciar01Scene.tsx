interface SceneProps {
  foundClues: string[]
  onClueFound?: (clueId: string) => void
}

export default function Glaciar01Scene({ foundClues, onClueFound }: SceneProps) {
  const found1 = foundClues.includes('glaciar_01_clue_1')
  const found2 = foundClues.includes('glaciar_01_clue_2')

  return (
    <svg viewBox="0 0 600 400" className="w-full h-full">
      <defs>
        <linearGradient id="glaciarSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#82cfff" />
          <stop offset="100%" stopColor="#c6e7ff" />
        </linearGradient>
      </defs>
      {/* Background */}
      <rect width="600" height="400" fill="url(#glaciarSky)" />
      <rect y="280" width="600" height="120" fill="#d4e4f8" rx="5" />
      <rect y="300" width="600" height="100" fill="#ccdcf0" rx="5" />

      {/* Photo collage frame */}
      <rect x="40" y="40" width="520" height="280" rx="12" fill="white" stroke="#bfc8d0" strokeWidth="2" />
      <text x="300" y="65" textAnchor="middle" fill="#3f484f" fontSize="11" fontFamily="monospace">📸 Álbum: Excursión al Glaciar</text>

      {/* Photo 1 */}
      <rect x="60" y="80" width="220" height="150" rx="8" fill="#e3efff" stroke="#bfc8d0" strokeWidth="1" />
      <text x="170" y="120" textAnchor="middle" fill="#3f484f" fontSize="9">Grupo en el hielo</text>
      {/* Small figures in photo */}
      <circle cx="140" cy="160" r="8" fill="#097dac" />
      <circle cx="170" cy="155" r="8" fill="#097dac" />
      <circle cx="200" cy="162" r="8" fill="#097dac" />
      <circle cx="155" cy="180" r="6" fill="#097dac" />
      <circle cx="185" cy="178" r="6" fill="#097dac" />

      {/* Wristwatch - CLUE 1 */}
      {!found1 ? (
        <g onClick={() => onClueFound?.('glaciar_01_clue_1')} className="cursor-pointer">
          <rect x="60" y="210" width="50" height="15" rx="3" fill="#1C2B3A" />
          <circle cx="85" cy="218" r="12" fill="white" stroke="#006389" strokeWidth="2" />
          <text x="85" y="221" textAnchor="middle" fill="#006389" fontSize="7" fontWeight="bold">CLUB</text>
          <circle cx="85" cy="218" r="14" fill="none" stroke="#fd6e58" strokeWidth="2" strokeDasharray="3,3">
            <animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </g>
      ) : (
        <g>
          <rect x="60" y="210" width="50" height="15" rx="3" fill="#fd6e58" />
          <circle cx="85" cy="218" r="12" fill="#fd6e58" opacity="0.8" />
          <text x="85" y="222" textAnchor="middle" fill="white" fontSize="10">!</text>
        </g>
      )}

      {/* Photo 2 */}
      <rect x="310" y="80" width="220" height="150" rx="8" fill="#e3efff" stroke="#bfc8d0" strokeWidth="1" />
      <text x="420" y="120" textAnchor="middle" fill="#3f484f" fontSize="9">Paisaje glacial</text>
      {/* Mountains */}
      <polygon points="320,200 360,120 400,200" fill="#82cfff" opacity="0.5" />
      <polygon points="380,200 430,100 480,200" fill="#82cfff" opacity="0.7" />
      <polygon points="350,200 390,140 430,200" fill="white" opacity="0.5" />

      {/* LOCATION SIGN - CLUE 2 */}
      {!found2 ? (
        <g onClick={() => onClueFound?.('glaciar_01_clue_2')} className="cursor-pointer">
          <rect x="430" y="190" width="90" height="35" rx="4" fill="#d4e4f8" stroke="#006389" strokeWidth="1.5" />
          <text x="475" y="205" textAnchor="middle" fill="#006389" fontSize="8" fontFamily="monospace" fontWeight="bold">GLACIAR</text>
          <text x="475" y="218" textAnchor="middle" fill="#006389" fontSize="8" fontFamily="monospace">NORTE - KM 12</text>
          <rect x="430" y="190" width="90" height="35" rx="4" fill="none" stroke="#fd6e58" strokeWidth="2" strokeDasharray="4,3">
            <animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.8s" repeatCount="indefinite" />
          </rect>
        </g>
      ) : (
        <g>
          <rect x="430" y="190" width="90" height="35" rx="4" fill="#fd6e58" stroke="#ac3323" strokeWidth="2" opacity="0.9" />
          <text x="475" y="212" textAnchor="middle" fill="white" fontSize="10">🚫 Ubicación</text>
        </g>
      )}

      {/* Found badges */}
      {found1 && (
        <text x="85" y="250" textAnchor="middle" fill="#097dac" fontSize="9" fontWeight="bold">⌚ Logo del club!</text>
      )}
      {found2 && (
        <text x="475" y="245" textAnchor="middle" fill="#097dac" fontSize="9" fontWeight="bold">📍 Ubicación exacta!</text>
      )}
    </svg>
  )
}
