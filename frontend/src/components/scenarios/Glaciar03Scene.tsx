interface SceneProps {
  foundClues: string[]
  onClueFound?: (clueId: string) => void
}

export default function Glaciar03Scene({ foundClues, onClueFound }: SceneProps) {
  const found1 = foundClues.includes('glaciar_03_clue_1')
  const found2 = foundClues.includes('glaciar_03_clue_2')

  return (
    <svg viewBox="0 0 600 400" className="w-full h-full">
      {/* Classroom background */}
      <rect width="600" height="400" fill="#edf4ff" />
      {/* Wall */}
      <rect y="0" width="600" height="250" fill="#e3efff" />
      {/* Floor */}
      <rect y="250" width="600" height="150" fill="#d4e4f8" />

      {/* Blackboard */}
      <rect x="50" y="40" width="300" height="150" rx="5" fill="#1C2B3A" />
      <text x="200" y="80" textAnchor="middle" fill="white" fontSize="14" fontFamily="monospace" fontWeight="bold">Welcome!</text>
      <text x="200" y="105" textAnchor="middle" fill="#82cfff" fontSize="12" fontFamily="monospace">Class: 4th Grade</text>
      <text x="200" y="125" textAnchor="middle" fill="#82cfff" fontSize="10" fontFamily="monospace">Teacher: Martina</text>

      {/* CLASS SCHEDULE on wall - CLUE 1 */}
      {!found1 ? (
        <g onClick={() => onClueFound?.('glaciar_03_clue_1')} className="cursor-pointer">
          <rect x="380" y="50" width="100" height="80" rx="4" fill="white" stroke="#006389" strokeWidth="1.5" />
          <text x="430" y="68" textAnchor="middle" fill="#006389" fontSize="8" fontFamily="monospace" fontWeight="bold">SCHEDULE</text>
          <text x="390" y="82" fill="#0d1d2b" fontSize="7" fontFamily="monospace">Mon: 8:00-15:00</text>
          <text x="390" y="94" fill="#0d1d2b" fontSize="7" fontFamily="monospace">Tue: 8:00-15:00</text>
          <text x="390" y="106" fill="#0d1d2b" fontSize="7" fontFamily="monospace">Wed: 8:00-13:00</text>
          <text x="390" y="118" fill="#0d1d2b" fontSize="7" fontFamily="monospace">Thu: 8:00-15:00</text>
          <text x="390" y="130" fill="#0d1d2b" fontSize="7" fontFamily="monospace">Fri: 8:00-13:00</text>
          <rect x="380" y="50" width="100" height="80" rx="4" fill="none" stroke="#fd6e58" strokeWidth="2" strokeDasharray="4,3">
            <animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.5s" repeatCount="indefinite" />
          </rect>
        </g>
      ) : (
        <g>
          <rect x="380" y="50" width="100" height="80" rx="4" fill="#fd6e58" stroke="#ac3323" strokeWidth="2" opacity="0.9" />
          <text x="430" y="95" textAnchor="middle" fill="white" fontSize="10">🚫 Schedule!</text>
        </g>
      )}

      {/* Students / Friends - CLUE 2 */}
      {!found2 ? (
        <g onClick={() => onClueFound?.('glaciar_03_clue_2')} className="cursor-pointer">
          {/* Student 1 */}
          <g transform="translate(160, 240)">
            <circle cx="0" cy="0" r="15" fill="#097dac" />
            <ellipse cx="0" cy="20" rx="12" ry="15" fill="#097dac" />
            <text x="-5" y="3" fill="white" fontSize="8">😊</text>
          </g>
          {/* Student 2 */}
          <g transform="translate(220, 250)">
            <circle cx="0" cy="0" r="15" fill="#fd6e58" />
            <ellipse cx="0" cy="20" rx="12" ry="15" fill="#fd6e58" />
            <text x="-5" y="3" fill="white" fontSize="8">😄</text>
          </g>
          {/* Student 3 */}
          <g transform="translate(280, 245)">
            <circle cx="0" cy="0" r="15" fill="#f9bc46" />
            <ellipse cx="0" cy="20" rx="12" ry="15" fill="#f9bc46" />
            <text x="-5" y="3" fill="white" fontSize="8">😃</text>
          </g>
          {/* Highlight circle */}
          <ellipse cx="220" cy="260" rx="90" ry="40" fill="none" stroke="#fd6e58" strokeWidth="2" strokeDasharray="5,3" opacity="0.7">
            <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite" />
          </ellipse>
        </g>
      ) : (
        <g>
          <ellipse cx="220" cy="260" rx="90" ry="40" fill="#fd6e58" opacity="0.3" />
          <text x="220" y="265" textAnchor="middle" fill="white" fontSize="12">🚫 Friends visible</text>
        </g>
      )}

      {/* Found badges */}
      {found1 && (
        <text x="430" y="145" textAnchor="middle" fill="#097dac" fontSize="9" fontWeight="bold">🕐 Schedule visible!</text>
      )}
      {found2 && (
        <text x="220" y="310" textAnchor="middle" fill="#097dac" fontSize="9" fontWeight="bold">👥 Your friends are visible too!</text>
      )}
    </svg>
  )
}
