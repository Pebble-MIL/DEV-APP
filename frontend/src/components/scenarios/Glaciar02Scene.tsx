interface SceneProps {
  foundClues: string[]
  onClueFound?: (clueId: string) => void
}

export default function Glaciar02Scene({ foundClues, onClueFound }: SceneProps) {
  const found1 = foundClues.includes('glaciar_02_clue_1')
  const found2 = foundClues.includes('glaciar_02_clue_2')

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl flex items-center justify-center p-6">
      {/* Forwarded message */}
      <div className="w-full max-w-md bg-white rounded-2xl border-2 border-outline-variant overflow-hidden shadow-lg">
        {/* Header */}
        <div className="bg-purple-100 px-4 py-3 flex items-center gap-2 border-b-2 border-purple-200">
          <div className="w-8 h-8 rounded-full bg-tertiary flex items-center justify-center text-white text-xs font-bold">📨</div>
          <div>
            <p className="text-sm font-bold text-tertiary">Mensaje Reenviado</p>
            <p className="text-xs text-tertiary opacity-70">Reenviado 23 veces</p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Warning banner */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-3">
            <p className="text-xs font-bold text-amber-700 mb-1">⚠️ Este mensaje fue reenviado muchas veces</p>
            <p className="text-xs text-amber-600">La información podría no ser verificada.</p>
          </div>

          {/* The forwarded message */}
          <div className={`rounded-2xl p-4 ${found1 && found2 ? 'bg-red-100 border-2 border-red-400' : 'bg-surface-container-high border-2 border-purple-200'}`}>
            {/* Forwarded label */}
            <div className="flex items-center gap-1 mb-2">
              <span className="text-xs text-on-surface-variant">📨 Reenviado</span>
            </div>

            <p className="text-sm text-on-surface font-bold mb-2">🚨 URGENTE 🚨</p>

            {/* CLUE 1 - Unverified info */}
            {!found1 ? (
              <p className="text-sm text-on-surface mb-2">
                <span className="bg-yellow-200 px-1 cursor-pointer" onClick={() => onClueFound?.('glaciar_02_clue_1')}>
                  Me contaron que mañana van a inspeccionar TODOS los nidos
                </span>
              </p>
            ) : (
              <p className="text-sm text-on-surface mb-2 line-through opacity-60">
                Me contaron que mañana van a inspeccionar TODOS los nidos
              </p>
            )}

            {/* CLUE 2 - Specific location */}
            {!found2 ? (
              <p className="text-sm text-on-surface mb-2">
                Empiezan por el <span className="bg-yellow-200 px-1 cursor-pointer" onClick={() => onClueFound?.('glaciar_02_clue_2')}>
                  sector norte, donde vivimos
                </span>!
              </p>
            ) : (
              <p className="text-sm text-on-surface mb-2 line-through opacity-60">
                Empiezan por el sector norte, donde vivimos!
              </p>
            )}

            <p className="text-sm text-on-surface">CORRE LA VOZ! 🗣️</p>

            <div className="mt-3 pt-3 border-t border-outline-variant">
              <p className="text-xs text-on-surface-variant font-bold">🤔 Datos no verificados:</p>
              <ul className="text-xs text-on-surface-variant mt-1 space-y-0.5">
                <li>• No dice quién lo vio primero</li>
                <li>• No hay fuente oficial</li>
                <li>• Causa alarma innecesaria</li>
              </ul>
            </div>
          </div>

          {/* Found badges */}
          <div className="flex flex-col gap-1">
            {found1 && <span className="text-xs text-red-600 font-bold">✅ Pista 1: No verificamos si es cierto!</span>}
            {found2 && <span className="text-xs text-red-600 font-bold">✅ Pista 2: Revela dónde vives!</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
