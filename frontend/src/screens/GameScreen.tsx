import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { UserState, Scenario } from '../types'
import { api } from '../services/api'
import PebbleDialog from '../components/PebbleDialog'
import ScenarioRenderer from '../components/scenarios'
import pebbleHandUp from '../assets/pebble_hand_up.png'

interface GameScreenProps {
  user: UserState | null
  updateUser: (partial: Partial<UserState>) => void
}

interface FoundClueInfo {
  clueId: string
  category: string
  explanation: string
}

export default function GameScreen({ user, updateUser }: GameScreenProps) {
  const navigate = useNavigate()
  const [scenario, setScenario] = useState<Scenario | null>(null)
  const [loading, setLoading] = useState(true)
  const [foundClues, setFoundClues] = useState<FoundClueInfo[]>([])
  const [feedback, setFeedback] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    loadScenario()
  }, [])

  const loadScenario = async () => {
    setLoading(true)
    try {
      const data = await api.getNextScenario()
      if (data.done) {
        setDone(true)
        setScenario(null)
      } else {
        setScenario(data)
        setFoundClues([])
        setFeedback(null)
      }
    } catch {
      setScenario(null)
    }
    setLoading(false)
  }

  const handleClueFound = async (clueId: string) => {
    if (foundClues.some((f) => f.clueId === clueId)) return
    if (!scenario) return

    const clueDef = scenario.hiddenClues.find((c) => c.clueId === clueId)
    const explanation = clueDef?.explanation || "You found an important clue!"

    const newClue: FoundClueInfo = {
      clueId,
      category: clueDef?.category || 'privacidad',
      explanation,
    }

    setFoundClues((prev) => [...prev, newClue])
    setFeedback(explanation)
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleContinue = () => {
    if (!scenario) return
    navigate('/checklist', {
      state: {
        scenario,
        foundClues: foundClues.map((f) => ({
          clueId: f.clueId,
          category: f.category,
          explanation: f.explanation,
        })),
      },
    })
  }

  const handleSkip = () => {
    if (!scenario) return
    navigate('/checklist', {
      state: {
        scenario,
        foundClues: foundClues.map((f) => ({
          clueId: f.clueId,
          category: f.category,
          explanation: f.explanation,
        })),
      },
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spring-bounce"><img src={pebbleHandUp} alt="Pebble" className="w-16 h-16 object-contain" /></div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-margin-mobile text-center space-y-6">
        <div className="text-7xl">🏆</div>
        <h2 className="font-baloo text-display-lg-mobile text-primary">You completed all missions!</h2>
        <p className="text-body-lg text-on-surface-variant">Come back soon for new adventures.</p>
        <div className="flex gap-4">
          <button onClick={() => navigate('/home')} className="tactile-btn bg-surface-container-high text-primary font-bold py-4 px-8 rounded-2xl border-2 border-primary text-headline-md">
            Go home
          </button>
          <button onClick={() => navigate('/nest')} className="tactile-btn bg-primary text-on-primary font-bold py-4 px-8 rounded-2xl text-headline-md">
            View my Nest
          </button>
        </div>
      </div>
    )
  }

  if (!scenario) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-margin-mobile text-center space-y-6">
        <div><img src={pebbleHandUp} alt="Pebble" className="w-20 h-20 object-contain mx-auto" /></div>
        <h2 className="font-baloo text-headline-md text-primary">No scenarios available</h2>
        <div className="flex gap-4">
          <button onClick={() => navigate('/home')} className="tactile-btn bg-surface-container-high text-primary font-bold py-4 px-8 rounded-2xl border-2 border-primary">
            Go home
          </button>
          <button onClick={loadScenario} className="tactile-btn bg-primary text-on-primary font-bold py-4 px-8 rounded-2xl">
            Try again
          </button>
        </div>
      </div>
    )
  }

  const allFound = foundClues.length >= scenario.hiddenClues.length

  return (
    <div className="min-h-screen flex flex-col px-margin-mobile py-4 max-w-2xl mx-auto pb-32">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{scenario.type === 'photo' ? '📷' : '💬'}</span>
          <span className="font-mono text-label-mono text-primary uppercase tracking-widest">
            {scenario.type === 'photo' ? 'Visual Scene' : 'Message'}
          </span>
        </div>
        <span className="font-mono text-label-mono text-on-surface-variant">
          Clues: {foundClues.length}/{scenario.hiddenClues.length}
        </span>
      </header>

      <PebbleDialog message={scenario.promptText} />

      {/* Scenario visual renderer */}
      <div className="w-full aspect-[3/2] rounded-3xl border-4 border-outline-variant overflow-hidden mb-4 bg-white shadow-inner">
        <ScenarioRenderer
          scenarioId={scenario.id}
          foundClues={foundClues.map((f) => f.clueId)}
          onClueFound={handleClueFound}
        />
      </div>

      {/* Feedback toast */}
      {feedback && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-deep-ink text-white px-5 py-3 rounded-2xl text-center animate-spring-in shadow-xl border-2 border-primary-fixed max-w-sm">
          <p className="font-bold text-sm"><img src={pebbleHandUp} alt="" className="w-5 h-5 inline-block object-contain align-middle" /> {feedback}</p>
        </div>
      )}

      {/* Progress indicator for found clues */}
      {foundClues.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {foundClues.map((clue, i) => (
            <span key={clue.clueId} className="px-3 py-1 bg-primary-container text-on-primary-container text-xs font-bold rounded-full">
              🪨 Clue {i + 1}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto space-y-3">
        {allFound && (
          <div className="bg-primary-fixed text-primary p-3 rounded-xl text-center font-bold animate-spring-in">
            🎉 All clues found! Now let's review the decisions.
          </div>
        )}
        <button
          onClick={handleContinue}
          className="tactile-btn w-full bg-primary text-on-primary font-bold py-4 px-8 rounded-2xl text-headline-md"
        >
          {allFound ? 'Review decisions' : 'Continue to checklist'}
        </button>
        <button
          onClick={handleSkip}
          className="w-full text-on-surface-variant font-mono text-sm py-2 hover:text-primary transition-colors"
        >
          Skip search (go to checklist)
        </button>
      </div>
    </div>
  )
}
