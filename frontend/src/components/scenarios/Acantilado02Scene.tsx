interface SceneProps {
  foundClues: string[]
  onClueFound?: (clueId: string) => void
}

import pebbleHandUp from '../../assets/pebble_hand_up.png'

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
            <p className="text-sm font-bold text-secondary">Colonia General <img src={pebbleHandUp} alt="" className="w-4 h-4 inline-block object-contain align-middle" /></p>
            <p className="text-xs text-secondary opacity-70">128 members</p>
          </div>
        </div>

        {/* Messages */}
        <div className="p-4 space-y-3 max-h-[320px] overflow-y-auto">
          {/* Previous messages */}
          <div className="flex justify-start">
            <div className="bg-surface-container-high rounded-2xl rounded-bl-sm px-3 py-2 max-w-[75%]">
              <p className="text-xs text-on-surface-variant">SomePenguin</p>
              <p className="text-sm text-on-surface">Did anyone see who stole the fish from the store?</p>
            </div>
          </div>

          {/* Pebble's angry message - CLUE 1 (impulsividad) */}
          <div className="flex justify-end">
            <div className={`rounded-2xl rounded-br-sm px-3 py-2 max-w-[80%] ${found1 ? 'bg-red-200 border-2 border-red-500' : 'bg-primary-container'}`}>
              <p className="text-xs text-right text-on-primary-container">Pebble <img src={pebbleHandUp} alt="" className="w-4 h-4 inline-block object-contain align-middle" /></p>
              {!found1 ? (
                <div>
                  <p className={`text-sm text-on-primary-container ${!found1 ? 'cursor-pointer' : ''}`}
                     onClick={() => !found1 && onClueFound?.('acantilado_02_clue_1')}>
                    <span className="bg-yellow-200 px-1">I'M VERY ANGRY!</span>
                  </p>
                  <p className="text-sm text-on-primary-container">That penguin took my favorite fish! 😤</p>
                  <p className="text-sm text-on-primary-container">I know what I'm going to do... 👿</p>
                </div>
              ) : (
                <p className="text-sm text-on-primary-container line-through">I'M VERY ANGRY! 😤</p>
              )}
            </div>
          </div>

          {/* Friend response */}
          <div className="flex justify-start">
            <div className="bg-surface-container-high rounded-2xl rounded-bl-sm px-3 py-2 max-w-[75%]">
              <p className="text-xs text-on-surface-variant">KindPenguin</p>
              <p className="text-sm text-on-surface">Easy, take a deep breath. Don't make decisions when angry.</p>
            </div>
          </div>

          {/* Pebble's second message - CLUE 2 (datos_sensibles / overexposure) */}
          <div className="flex justify-end">
            <div className={`rounded-2xl rounded-br-sm px-3 py-2 max-w-[85%] ${found2 ? 'bg-red-200 border-2 border-red-500' : 'bg-primary-container'}`}>
              {!found2 ? (
                <div>
                  <p className="text-xs text-right text-on-primary-container">Pebble <img src={pebbleHandUp} alt="" className="w-4 h-4 inline-block object-contain align-middle" /></p>
                  <p className="text-sm text-on-primary-container">I'm going to tell <span className="bg-yellow-200 px-1 cursor-pointer" onClick={() => onClueFound?.('acantilado_02_clue_2')}>
                    THE WHOLE colony</span> what happened!</p>
                  <p className="text-sm text-on-primary-container">Let everyone know who it is! 📢</p>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-right text-on-primary-container">Pebble <img src={pebbleHandUp} alt="" className="w-4 h-4 inline-block object-contain align-middle" /></p>
                  <p className="text-sm text-on-primary-container line-through">I'm going to tell THE WHOLE colony what happened! 📢</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Found badges */}
        <div className="px-4 pb-3 flex flex-col gap-1">
          {found1 && <span className="text-xs text-red-600 font-bold">✅ Clue 1: Reacting angry - better to breathe!</span>}
          {found2 && <span className="text-xs text-red-600 font-bold">✅ Clue 2: Telling the whole colony - better just a friend!</span>}
        </div>
      </div>
    </div>
  )
}
