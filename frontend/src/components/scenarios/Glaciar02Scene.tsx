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
            <p className="text-sm font-bold text-tertiary">Forwarded Message</p>
            <p className="text-xs text-tertiary opacity-70">Forwarded 23 times</p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Warning banner */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-3">
            <p className="text-xs font-bold text-amber-700 mb-1">⚠️ This message has been forwarded many times</p>
            <p className="text-xs text-amber-600">The information might not be verified.</p>
          </div>

          {/* The forwarded message */}
          <div className={`rounded-2xl p-4 ${found1 && found2 ? 'bg-red-100 border-2 border-red-400' : 'bg-surface-container-high border-2 border-purple-200'}`}>
            {/* Forwarded label */}
            <div className="flex items-center gap-1 mb-2">
              <span className="text-xs text-on-surface-variant">📨 Forwarded</span>
            </div>

            <p className="text-sm text-on-surface font-bold mb-2">🚨 URGENT 🚨</p>

            {/* CLUE 1 - Unverified info */}
            {!found1 ? (
              <p className="text-sm text-on-surface mb-2">
                <span className="bg-yellow-200 px-1 cursor-pointer" onClick={() => onClueFound?.('glaciar_02_clue_1')}>
                  They told me that tomorrow they'll inspect ALL the nests
                </span>
              </p>
            ) : (
              <p className="text-sm text-on-surface mb-2 line-through opacity-60">
                They told me that tomorrow they'll inspect ALL the nests
              </p>
            )}

            /** Clue 2 - specific location */
            {!found2 ? (
              <p className="text-sm text-on-surface mb-2">
                They start with the <span className="bg-yellow-200 px-1 cursor-pointer" onClick={() => onClueFound?.('glaciar_02_clue_2')}>
                  north sector, where we live
                </span>!
              </p>
            ) : (
              <p className="text-sm text-on-surface mb-2 line-through opacity-60">
                They start with the north sector, where we live!
              </p>
            )}

            <p className="text-sm text-on-surface">SPREAD THE WORD! 🗣️</p>

            <div className="mt-3 pt-3 border-t border-outline-variant">
              <p className="text-xs text-on-surface-variant font-bold">🤔 Unverified info:</p>
              <ul className="text-xs text-on-surface-variant mt-1 space-y-0.5">
                <li>• Doesn't say who saw it first</li>
                <li>• No official source</li>
                <li>• Causes unnecessary alarm</li>
              </ul>
            </div>
          </div>

          {/* Found badges */}
          <div className="flex flex-col gap-1">
            {found1 && <span className="text-xs text-red-600 font-bold">✅ Clue 1: We didn't check if it's true!</span>}
            {found2 && <span className="text-xs text-red-600 font-bold">✅ Clue 2: Reveals where you live!</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
