interface SceneProps {
  foundClues: string[]
  onClueFound?: (clueId: string) => void
}

import pebbleHandUp from '../../assets/pebble_hand_up.png'

export default function TutorialScene({ foundClues, onClueFound }: SceneProps) {
  const found = foundClues.includes('tutorial_clue_1')

  return (
    <svg viewBox="0 0 600 400" className="w-full h-full">
      {/* Sky */}
      <rect width="600" height="400" fill="#c6e7ff" />
      {/* Ground */}
      <rect y="280" width="600" height="120" fill="#e3efff" rx="10" />
      <rect y="300" width="600" height="100" fill="#d4e4f8" rx="10" />
      {/* Ice floor */}
      <ellipse cx="300" cy="320" rx="250" ry="30" fill="#f7f9ff" opacity="0.6" />
      {/* Snow piles */}
      <ellipse cx="100" cy="290" rx="60" ry="20" fill="#edf4ff" />
      <ellipse cx="500" cy="295" rx="50" ry="15" fill="#edf4ff" />

      {/* Cave entrance (the clue!) */}
      <ellipse cx="180" cy="250" rx="70" ry="60" fill="#233241" />
      <ellipse cx="180" cy="250" rx="60" ry="50" fill="#0d1d2b" />
      {/* Cave arch */}
      <path d="M110 280 Q120 180 180 170 Q240 180 250 280" fill="none" stroke="#3f484f" strokeWidth="4" />

      {/* Window on cave - hidden clue */}
      {!found ? (
        <g onClick={() => onClueFound?.('tutorial_clue_1')} className="cursor-pointer">
          <rect x="155" y="195" width="50" height="45" rx="3" fill="#82cfff" stroke="#006389" strokeWidth="2" opacity="0.9" />
          <line x1="180" y1="195" x2="180" y2="240" stroke="#006389" strokeWidth="1.5" />
          <line x1="155" y1="218" x2="205" y2="218" stroke="#006389" strokeWidth="1.5" />
          <rect x="165" y="202" width="30" height="25" fill="#f9bc46" opacity="0.4" rx="2" />
          <animateTransform attributeName="transform" type="pulse" values="1;1.05;1" dur="2s" repeatCount="indefinite" />
        </g>
      ) : (
        <g>
          <rect x="155" y="195" width="50" height="45" rx="3" fill="#fd6e58" stroke="#ac3323" strokeWidth="2" opacity="0.8" />
          <text x="180" y="222" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">!</text>
        </g>
      )}

      {/* Pebble character */}
      <circle cx="420" cy="250" r="30" fill="#097dac" />
      <circle cx="410" cy="240" r="5" fill="white" />
      <circle cx="430" cy="240" r="5" fill="white" />
      <circle cx="408" cy="238" r="2" fill="#0d1d2b" />
      <circle cx="428" cy="238" r="2" fill="#0d1d2b" />
      <ellipse cx="420" cy="255" rx="6" ry="3" fill="#fd6e58" />
      {/* Body */}
      <ellipse cx="420" cy="280" rx="20" ry="25" fill="#097dac" />
      {/* Feet */}
      <ellipse cx="410" cy="305" rx="8" ry="4" fill="#f9bc46" />
      <ellipse cx="430" cy="305" rx="8" ry="4" fill="#f9bc46" />

      {/* Rock */}
      <ellipse cx="300" cy="285" rx="40" ry="25" fill="#bfc8d0" />
      <ellipse cx="300" cy="280" rx="35" ry="20" fill="#d4e4f8" />
      <ellipse cx="310" cy="275" rx="15" ry="10" fill="#e3efff" opacity="0.5" />
      {/* Sparkles */}
      <text x="310" y="270" fill="#f9bc46" fontSize="16">✦</text>

      {/* Ice crystals decoration */}
      <polygon points="50,150 60,130 70,150" fill="#e3efff" opacity="0.5" />
      <polygon points="550,170 560,150 570,170" fill="#e3efff" opacity="0.5" />

      {/* Found badge */}
      {found && (
        <g>
          <rect x="200" y="130" width="200" height="40" rx="20" fill="#097dac" opacity="0.95" />
          <image href={pebbleHandUp} x="210" y="138" width="18" height="18" />
          <text x="300" y="155" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Clue found: the window!</text>
        </g>
      )}
    </svg>
  )
}
