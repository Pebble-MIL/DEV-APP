interface SceneProps {
  foundClues: string[]
  onClueFound?: (clueId: string) => void
}

export default function Acantilado03Scene({ foundClues, onClueFound }: SceneProps) {
  const found = foundClues.includes('acantilado_03_clue_1')

  return (
    <svg viewBox="0 0 600 400" className="w-full h-full">
      {/* Desk background */}
      <rect width="600" height="400" fill="#edf4ff" />
      <rect x="30" y="30" width="540" height="340" rx="15" fill="white" stroke="#bfc8d0" strokeWidth="2" />

      {/* Desk surface */}
      <rect y="340" width="600" height="60" fill="#d4e4f8" />

      {/* Notebook */}
      <rect x="100" y="80" width="400" height="250" rx="5" fill="#fffbff" stroke="#bfc8d0" strokeWidth="1.5" />
      {/* Spiral binding */}
      <g fill="none" stroke="#3f484f" strokeWidth="1.5">
        {[0,1,2,3,4].map(i => (
          <circle key={i} cx={100 + i*80 + 40} cy="80" r="6" />
        ))}
      </g>

      {/* Notebook lines */}
      {[0,1,2,3,4,5,6,7].map(i => (
        <line key={i} x1="130" y1={120 + i*25} x2="470" y2={120 + i*25} stroke="#bfc8d0" strokeWidth="0.5" />
      ))}

      {/* Homework text */}
      <text x="140" y="140" fill="#0d1d2b" fontSize="11" fontFamily="monospace">1. Resolver problemas de matemáticas</text>
      <text x="140" y="165" fill="#0d1d2b" fontSize="11" fontFamily="monospace">2. Escribir una historia sobre el hielo</text>
      <text x="140" y="190" fill="#0d1d2b" fontSize="11" fontFamily="monospace">3. Dibujar un pingüino y su hábitat</text>
      <text x="140" y="230" fill="#097dac" fontSize="12" fontFamily="monospace" fontWeight="bold">✏️ Tarea completada!</text>

      {/* Red grade */}
      <text x="400" y="140" fill="#ac3323" fontSize="16" fontWeight="bold" fontFamily="monospace">A+</text>

      {/* NAME ON NOTEBOOK - CLUE */}
      {!found ? (
        <g onClick={() => onClueFound?.('acantilado_03_clue_1')} className="cursor-pointer">
          <rect x="120" y="280" width="160" height="30" rx="4" fill="#ffdad4" stroke="#ac3323" strokeWidth="1.5" />
          <text x="130" y="298" fill="#ac3323" fontSize="12" fontFamily="monospace" fontWeight="bold">Nombre: Pepito P.</text>
          <text x="130" y="308" fill="#ac3323" fontSize="9" fontFamily="monospace">4° Básico - Prof. Martina</text>
          <rect x="120" y="280" width="160" height="30" rx="4" fill="none" stroke="#fd6e58" strokeWidth="2" strokeDasharray="5,3">
            <animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.5s" repeatCount="indefinite" />
          </rect>
        </g>
      ) : (
        <g>
          <rect x="120" y="280" width="160" height="30" rx="4" fill="#fd6e58" stroke="#ac3323" strokeWidth="2" opacity="0.9" />
          <text x="130" y="298" fill="white" fontSize="12" fontFamily="monospace" fontWeight="bold">Nombre: 🚫 visible!</text>
        </g>
      )}

      {/* Pencil */}
      <line x1="480" y1="300" x2="530" y2="250" stroke="#f9bc46" strokeWidth="5" strokeLinecap="round" />
      <polygon points="530,250 535,245 528,242" fill="#1C2B3A" />

      {/* Found badge */}
      {found && (
        <g>
          <rect x="120" y="50" width="360" height="25" rx="12" fill="#097dac" opacity="0.95" />
          <text x="300" y="67" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">🔍 El nombre y la profesora están visibles!</text>
        </g>
      )}
    </svg>
  )
}
