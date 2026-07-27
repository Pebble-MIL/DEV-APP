import TutorialScene from './TutorialScene'
import Playa01Scene from './Playa01Scene'
import Playa02Scene from './Playa02Scene'
import Playa03Scene from './Playa03Scene'
import Acantilado01Scene from './Acantilado01Scene'
import Acantilado02Scene from './Acantilado02Scene'
import Acantilado03Scene from './Acantilado03Scene'
import Glaciar01Scene from './Glaciar01Scene'
import Glaciar02Scene from './Glaciar02Scene'
import Glaciar03Scene from './Glaciar03Scene'

interface ScenarioRendererProps {
  scenarioId: string
  foundClues: string[]
  onClueFound?: (clueId: string) => void
}

export default function ScenarioRenderer({ scenarioId, foundClues, onClueFound }: ScenarioRendererProps) {
  const props = { foundClues, onClueFound }

  switch (scenarioId) {
    case 'tutorial_01':
      return <TutorialScene {...props} />
    case 'playa_01':
      return <Playa01Scene {...props} />
    case 'playa_02':
      return <Playa02Scene {...props} />
    case 'playa_03':
      return <Playa03Scene {...props} />
    case 'acantilado_01':
      return <Acantilado01Scene {...props} />
    case 'acantilado_02':
      return <Acantilado02Scene {...props} />
    case 'acantilado_03':
      return <Acantilado03Scene {...props} />
    case 'glaciar_01':
      return <Glaciar01Scene {...props} />
    case 'glaciar_02':
      return <Glaciar02Scene {...props} />
    case 'glaciar_03':
      return <Glaciar03Scene {...props} />
    default:
      return (
        <div className="w-full h-full bg-surface-container-high rounded-3xl flex items-center justify-center">
          <div className="text-center">
            <span className="text-6xl block mb-2">🏔️</span>
            <p className="text-body-md text-on-surface-variant">Escenario: {scenarioId}</p>
          </div>
        </div>
      )
  }
}
