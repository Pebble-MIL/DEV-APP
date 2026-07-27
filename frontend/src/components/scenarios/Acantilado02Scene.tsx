interface SceneProps {
  foundClues: string[]
  onClueFound?: (clueId: string) => void
}

export default function Acantilado02Scene({ foundClues, onClueFound }: SceneProps) {
  const found1 = foundClues.includes('acantilado_02_clue_1')
  const found2 = foundClues.includes('acantilado_02_clue_2')

  return (
    <div className="w-full h-full bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl flex items-center justify-center p-6">
      {/* Group chat */}
      <div className="w-full max-w-md bg-white rounded-2xl border-2 border-outline-variant overflow-hidden shadow-lg">
        {/* Chat header */}
        <div className="bg-red-100 px-4 py-3 flex items-center gap-2 border-b-2 border-red-200">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white text-xs font-bold">P</div>
          <div>
            <p className="text-sm font-bold text-secondary">Colonia General 🐧</p>
            <p className="text-xs text-secondary opacity-70">128 miembros</p>
          </div>
        </div>

        {/* Messages */}
        <div className="p-4 space-y-3 max-h-[320px] overflow-y-auto">
          {/* Previous messages */}
          <div className="flex justify-start">
            <div className="bg-surface-container-high rounded-2xl rounded-bl-sm px-3 py-2 max-w-[75%]">
              <p className="text-xs text-on-surface-variant">AlguienPingüino</p>
              <p className="text-sm text-on-surface">Alguien vio quién se robó el pescado de la tienda?</p>
            </div>
          </div>

          {/* Pebble's angry message - CLUE 1 (impulsividad) */}
          <div className="flex justify-end">
            <div className={`rounded-2xl rounded-br-sm px-3 py-2 max-w-[80%] ${found1 ? 'bg-red-200 border-2 border-red-500' : 'bg-primary-container'}`}>
              <p className="text-xs text-right text-on-primary-container">Pebble 🐧</p>
              {!found1 ? (
                <div>
                  <p className={`text-sm text-on-primary-container ${!found1 ? 'cursor-pointer' : ''}`}
                     onClick={() => !found1 && onClueFound?.('acantilado_02_clue_1')}>
                    <span className="bg-yellow-200 px-1">ESTOY MUY ENOJADO!</span>
                  </p>
                  <p className="text-sm text-on-primary-container">Ese pingüino me quitó mi pescado favorito! 😤</p>
                  <p className="text-sm text-on-primary-container">Ya sé lo que voy a hacer... 👿</p>
                </div>
              ) : (
                <p className="text-sm text-on-primary-container line-through">ESTOY MUY ENOJADO! 😤</p>
              )}
            </div>
          </div>

          {/* Friend response */}
          <div className="flex justify-start">
            <div className="bg-surface-container-high rounded-2xl rounded-bl-sm px-3 py-2 max-w-[75%]">
              <p className="text-xs text-on-surface-variant">AmablePingüino</p>
              <p className="text-sm text-on-surface">Tranqui, respira hondo. No tomes decisiones enojado.</p>
            </div>
          </div>

          {/* Pebble's second message - CLUE 2 (datos_sensibles / sobreexposición) */}
          <div className="flex justify-end">
            <div className={`rounded-2xl rounded-br-sm px-3 py-2 max-w-[85%] ${found2 ? 'bg-red-200 border-2 border-red-500' : 'bg-primary-container'}`}>
              {!found2 ? (
                <div>
                  <p className="text-xs text-right text-on-primary-container">Pebble 🐧</p>
                  <p className="text-sm text-on-primary-container">Voy a contarle a <span className="bg-yellow-200 px-1 cursor-pointer" onClick={() => onClueFound?.('acantilado_02_clue_2')}>
                    TODA la colonia</span> lo que pasó!</p>
                  <p className="text-sm text-on-primary-container">Que todos sepan quién es! 📢</p>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-right text-on-primary-container">Pebble 🐧</p>
                  <p className="text-sm text-on-primary-container line-through">Voy a contarle a TODA la colonia lo que pasó! 📢</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Found badges */}
        <div className="px-4 pb-3 flex flex-col gap-1">
          {found1 && <span className="text-xs text-red-600 font-bold">✅ Pista 1: Reaccionar enojado - mejor respirar!</span>}
          {found2 && <span className="text-xs text-red-600 font-bold">✅ Pista 2: Contarlo a toda la colonia - mejor solo a un amigo!</span>}
        </div>
      </div>
    </div>
  )
}
