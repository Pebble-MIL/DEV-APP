interface SceneProps {
  foundClues: string[]
  onClueFound?: (clueId: string) => void
}

export default function Playa02Scene({ foundClues, onClueFound }: SceneProps) {
  const found = foundClues.includes('playa_02_clue_1')

  return (
    <div className="w-full h-full bg-gradient-to-br from-surface-container-low to-surface-container rounded-3xl flex items-center justify-center p-6">
      {/* Chat message */}
      <div className="w-full max-w-md bg-white rounded-2xl border-2 border-outline-variant overflow-hidden shadow-lg">
        {/* Chat header */}
        <div className="bg-primary-container px-4 py-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">?</div>
          <div>
            <p className="text-sm font-bold text-on-primary-container">PingüinoDesconocido</p>
            <p className="text-xs text-on-primary-container opacity-70">En línea</p>
          </div>
        </div>

        {/* Chat body */}
        <div className="p-4 space-y-3">
          <div className="flex justify-start">
            <div className="bg-surface-container-high rounded-2xl rounded-bl-sm px-4 py-2 max-w-[80%]">
              <p className="text-sm text-on-surface">¡Hola! Me pareció muy divertido el dibujo que compartiste.</p>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-surface-container-high rounded-2xl rounded-bl-sm px-4 py-2 max-w-[80%]">
              <p className="text-sm text-on-surface">Soy nuevo en la colonia. ¿Cómo te llamas?</p>
            </div>
          </div>

          {/* Danger zone - asking personal info */}
          <div className="flex justify-start">
            <div className={`rounded-2xl rounded-bl-sm px-4 py-3 max-w-[85%] ${found ? 'bg-red-100 border-2 border-red-400' : 'bg-amber-50 border-2 border-amber-300'}`}>
              <p className="text-xs font-bold text-amber-700 mb-1">⚠️ Este mensaje necesita atención</p>
              <p className="text-sm text-on-surface">Qué buena onda! Me llamo <strong>Pepito Pérez</strong>, vivo en la <strong>Calle del Glaciar 123</strong> cerca del <strong>nido grande</strong>. ¿Y tú? 😊</p>
              {!found && (
                <button
                  onClick={() => onClueFound?.('playa_02_clue_1')}
                  className="mt-2 w-full py-2 px-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-container transition-colors active:translate-y-0.5"
                >
                  🔍 Tocar si ves información que no debería compartirse
                </button>
              )}
              {found && (
                <div className="mt-2 py-2 px-3 bg-red-500 text-white text-xs font-bold rounded-xl text-center">
                  🚫 Nombre, dirección y ubicación expuestos!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
