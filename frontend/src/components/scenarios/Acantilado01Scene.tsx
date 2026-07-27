interface SceneProps {
  foundClues: string[]
  onClueFound?: (clueId: string) => void
}

export default function Acantilado01Scene({ foundClues, onClueFound }: SceneProps) {
  const found1 = foundClues.includes('acantilado_01_clue_1')
  const found2 = foundClues.includes('acantilado_01_clue_2')

  return (
    <svg viewBox="0 0 600 400" className="w-full h-full">
      <defs>
        <linearGradient id="iceGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#82cfff" />
          <stop offset="100%" stopColor="#e3efff" />
        </linearGradient>
      </defs>
      {/* Ice rink background */}
      <rect width="600" height="400" fill="url(#iceGrad)" />
      <ellipse cx="300" cy="350" rx="300" ry="60" fill="#f7f9ff" opacity="0.5" />

      {/* Ice surface */}
      <ellipse cx="300" cy="330" rx="200" ry="40" fill="#e3efff" opacity="0.6" />

      {/* Ice Hockey uniform - CLUE 1 */}
      {!found1 ? (
        <g onClick={() => onClueFound?.('acantilado_01_clue_1')} className="cursor-pointer">
          {/* Jersey */}
          <rect x="130" y="180" width="120" height="100" rx="10" fill="white" stroke="#006389" strokeWidth="2" />
          <rect x="150" y="195" width="80" height="25" rx="5" fill="#097dac" />
          <text x="190" y="212" textAnchor="middle" fill="white" fontSize="10" fontFamily="monospace" fontWeight="bold">HOCKEY</text>
          <text x="190" y="240" textAnchor="middle" fill="#006389" fontSize="20" fontWeight="bold">07</text>
          <text x="190" y="260" textAnchor="middle" fill="#3f484f" fontSize="8" fontFamily="monospace">OSOS POLARES</text>
          <rect x="130" y="180" width="120" height="100" rx="10" fill="none" stroke="#fd6e58" strokeWidth="2" strokeDasharray="5,3" opacity="0.8">
            <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite" />
          </rect>
        </g>
      ) : (
        <g>
          <rect x="130" y="180" width="120" height="100" rx="10" fill="#fd6e58" stroke="#ac3323" strokeWidth="2" opacity="0.9" />
          <text x="190" y="240" textAnchor="middle" fill="white" fontSize="14">🚫</text>
        </g>
      )}

      {/* REFLECTION in ice - CLUE 2 */}
      {!found2 ? (
        <g onClick={() => onClueFound?.('acantilado_01_clue_2')} className="cursor-pointer">
          {/* Ice patch with reflection */}
          <ellipse cx="420" cy="300" rx="60" ry="25" fill="#82cfff" opacity="0.3" />
          <ellipse cx="420" cy="300" rx="50" ry="18" fill="white" opacity="0.5" />
          {/* House reflection */}
          <polygon points="400,290 420,275 440,290" fill="#bfc8d0" opacity="0.6" />
          <rect x="405" y="290" width="30" height="20" fill="#bfc8d0" opacity="0.6" />
          <rect x="410" y="293" width="8" height="10" fill="#f9bc46" opacity="0.5" />
          <ellipse cx="420" cy="300" rx="55" ry="22" fill="none" stroke="#fd6e58" strokeWidth="2" strokeDasharray="4,3" opacity="0.7">
            <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite" />
          </ellipse>
        </g>
      ) : (
        <g>
          <ellipse cx="420" cy="300" rx="60" ry="25" fill="#fd6e58" opacity="0.5" />
          <text x="420" y="305" textAnchor="middle" fill="white" fontSize="16">🚫</text>
        </g>
      )}

      {/* Found badges */}
      {found1 && (
        <rect x="115" y="155" width="150" height="22" rx="11" fill="#097dac" opacity="0.95" />
      )}
      {found1 && <text x="190" y="170" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">🏒 Uniforme del equipo!</text>}

      {found2 && (
        <rect x="340" y="340" width="160" height="22" rx="11" fill="#097dac" opacity="0.95" />
      )}
      {found2 && <text x="420" y="355" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">🏠 Reflejo de la casa!</text>}
    </svg>
  )
}
