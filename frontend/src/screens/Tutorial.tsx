import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { UserState } from '../types'
import { api } from '../services/api'
import PebbleDialog from '../components/PebbleDialog'

interface TutorialProps {
  user: UserState | null
  updateUser: (partial: Partial<UserState>) => void
}

const STEPS = [
  {
    message: '¡Bienvenido a tu primera aventura! Voy a mostrarte cómo funciona esto.',
    instruction: null,
  },
  {
    message: 'En cada escenario, hay pistas escondidas. Toca la imagen donde creas que hay información que deberíamos revisar.',
    instruction: 'Toca el área marcada en la imagen para practicar',
    clueArea: { x: 50, y: 50, radius: 40 },
  },
  {
    message: '¡Lo encontraste! Cuando encuentras una pista, yo te explico por qué es importante.',
    instruction: null,
  },
  {
    message: 'Después de buscar pistas, viene el checklist. Yo pienso en voz alta y tú me ayudas a decidir si hice bien o mal.',
    instruction: null,
  },
  {
    message: 'Cada buena decisión se convierte en una piedrita para nuestro nido. ¿Entendiste? ¡Vamos a jugar de verdad!',
    instruction: null,
  },
]

export default function Tutorial({ user, updateUser }: TutorialProps) {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [foundClue, setFoundClue] = useState(false)
  const [showPractice, setShowPractice] = useState(false)

  const current = STEPS[step]

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!current.clueArea || foundClue) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const dx = x - current.clueArea.x * (rect.width / 100)
    const dy = y - current.clueArea.y * (rect.height / 100)
    if (Math.sqrt(dx * dx + dy * dy) < current.clueArea.radius) {
      setFoundClue(true)
    }
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
      setFoundClue(false)
      setShowPractice(step + 1 === 1)
    } else {
      updateUser({ tutorialCompleted: true })
      navigate('/game')
    }
  }

  return (
    <div className="min-h-screen flex flex-col px-margin-mobile py-4 max-w-2xl mx-auto pb-32">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate('/game')} className="text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
        <span className="font-mono text-label-mono text-on-surface-variant">{step + 1}/{STEPS.length}</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        <PebbleDialog message={current.message} />

        {current.instruction && (
          <div className="bg-secondary-fixed border-2 border-secondary p-4 rounded-2xl w-full text-center">
            <p className="font-bold text-secondary text-body-lg">{current.instruction}</p>
          </div>
        )}

        {showPractice && (
          <div className="relative w-full max-w-sm aspect-square bg-surface-container-high rounded-3xl border-4 border-outline-variant overflow-hidden cursor-crosshair" onClick={handleTap}>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl">🏔️</span>
            </div>
            {!foundClue && (
              <div className="absolute top-1/3 left-1/3 w-20 h-20 border-4 border-dashed border-secondary rounded-full animate-pulse-slow" />
            )}
            {foundClue && (
              <div className="absolute top-1/3 left-1/3 w-20 h-20 bg-secondary-container/80 rounded-full flex items-center justify-center animate-spring-in">
                <span className="text-3xl">🐚</span>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={handleNext}
        disabled={current.clueArea && !foundClue}
        className={`tactile-btn w-full font-bold py-4 px-8 rounded-2xl text-headline-md mt-6 ${
          current.clueArea && !foundClue
            ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed'
            : 'bg-primary text-on-primary'
        }`}
      >
        {step < STEPS.length - 1 ? 'Siguiente' : '¡A Jugar!'}
      </button>
    </div>
  )
}
