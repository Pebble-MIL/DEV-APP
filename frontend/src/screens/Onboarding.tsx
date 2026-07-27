import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { UserState } from '../types'
import { api } from '../services/api'

interface OnboardingProps {
  user: UserState | null
  updateUser: (partial: Partial<UserState>) => void
}

const QUIZ = [
  {
    id: 'q1',
    category: 'privacidad',
    prompt: '¡Encontré una roca brillante frente a mi cueva! Quiero mostrarla a todos mis amigos pingüinos. ¿Le tomo la foto donde se vea mi cueva también?',
    options: [
      { key: 'A', text: '¡Sí! Así todos ven dónde vives', points: 0 },
      { key: 'B', text: 'Mejor solo la roca, tu cueva es tuya', points: 2 },
      { key: 'C', text: 'No sé, ¿importa?', points: 1 },
    ],
  },
  {
    id: 'q2',
    category: 'impulsividad',
    prompt: '¡Estoy MUY enojado! Otro pingüino me quitó mi pescado. Quiero contárselo a TODA la colonia ahora mismo. ¿Qué hago?',
    options: [
      { key: 'A', text: 'Cuéntalo ya, que todos sepan', points: 0 },
      { key: 'B', text: 'Respira primero, y después decides si lo cuentas', points: 2 },
      { key: 'C', text: 'Cuéntaselo solo a tu mejor amigo', points: 1 },
    ],
  },
  {
    id: 'q3',
    category: 'datos_sensibles',
    prompt: 'Un pingüino que no conozco me preguntó cómo me llamo, dónde queda mi nido y a qué hora salgo a nadar. ¡Qué amigable! ¿Le respondo todo?',
    options: [
      { key: 'A', text: 'Sí, es de buena educación responder', points: 0 },
      { key: 'B', text: 'Puedes decirle tu nombre de juego, pero lo demás no', points: 2 },
      { key: 'C', text: 'Respóndele solo dónde nadas', points: 0 },
    ],
  },
]

const LEVEL_INFO: Record<string, { emoji: string; title: string; desc: string; color: string }> = {
  playa: {
    emoji: '🏖️',
    title: 'Nido de Playa',
    desc: 'Estás empezando tu aventura. Las piedritas serán grandes y fáciles de encontrar. ¡Cada paso cuenta!',
    color: 'bg-tertiary-fixed-dim',
  },
  acantilado: {
    emoji: '⛰️',
    title: 'Nido de Acantilado',
    desc: 'Tienes buen ojo para las pistas. Los desafíos serán más interesantes. ¡Sigue así!',
    color: 'bg-primary-container',
  },
  glaciar: {
    emoji: '🏔️',
    title: 'Nido de Glaciar',
    desc: 'Eres un guardián experto. Las pistas estarán bien escondidas. ¡Aceptas el reto?',
    color: 'bg-primary-fixed-dim',
  },
}

export default function Onboarding({ user, updateUser }: OnboardingProps) {
  const navigate = useNavigate()
  const [step, setStep] = useState<'welcome' | 'quiz' | 'result'>('welcome')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Array<{ questionId: string; optionSelected: string }>>([])
  const [result, setResult] = useState<{ totalScore: number; nestLevel: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleAnswer = async (key: string) => {
    const newAnswers = [...answers, { questionId: QUIZ[currentQ].id, optionSelected: key }]
    setAnswers(newAnswers)

    if (currentQ < QUIZ.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      setSubmitting(true)
      try {
        const res = await api.submitQuiz(newAnswers)
        setResult(res)
        updateUser({ nestLevel: res.nestLevel })
        setStep('result')
      } catch {
        const total = newAnswers.reduce((sum, a) => {
          const q = QUIZ.find((q) => q.id === a.questionId)
          const opt = q?.options.find((o) => o.key === a.optionSelected)
          return sum + (opt?.points ?? 0)
        }, 0)
        const level = total <= 2 ? 'playa' : total <= 4 ? 'acantilado' : 'glaciar'
        setResult({ totalScore: total, nestLevel: level })
        updateUser({ nestLevel: level })
        setStep('result')
      }
      setSubmitting(false)
    }
  }

  if (step === 'welcome') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-margin-mobile bg-background">
        <div className="text-center space-y-md max-w-lg animate-spring-in">
          <div className="text-8xl mb-4">🐧</div>
          <h1 className="font-baloo text-display-lg-mobile md:text-display-lg text-primary">
            ¡Hola! Soy <span className="text-secondary">Pebble</span>
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            Soy un pingüino joven y estoy aprendiendo a cuidar mi información en la colonia digital.
            ¿Me ayudas a construir mi primer nido?
          </p>
          <p className="text-body-md text-on-surface-variant font-semibold">
            Primero, unas preguntas para saber qué tipo de nido necesitamos.
          </p>
          <button
            onClick={() => setStep('quiz')}
            className="tactile-btn bg-primary text-on-primary font-bold py-4 px-12 rounded-2xl text-headline-md mt-6"
          >
            ¡Vamos allá!
          </button>
        </div>
      </div>
    )
  }

  if (step === 'quiz') {
    const q = QUIZ[currentQ]
    return (
      <div className="min-h-screen flex flex-col px-margin-mobile py-8 max-w-2xl mx-auto">
        <div className="mt-8 mb-6">
          <div className="flex justify-between items-end mb-2">
            <span className="font-mono text-label-mono text-deep-ink uppercase tracking-widest">
              {q.category === 'privacidad' ? 'Privacidad' : q.category === 'impulsividad' ? 'Pensar antes' : 'Datos sensibles'}
            </span>
            <span className="font-mono text-label-mono text-primary font-black">{currentQ + 1} de {QUIZ.length}</span>
          </div>
          <div className="h-3 w-full bg-surface-variant rounded-full border-2 border-outline-variant p-0.5 overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out" style={{ width: `${((currentQ) / QUIZ.length) * 100}%` }} />
          </div>
        </div>

        <div className="flex flex-col items-center mb-8 animate-spring-in">
          <div className="dialog-bubble mb-6">
            <p className="font-baloo text-headline-md text-deep-ink text-center leading-tight">
              "{q.prompt}"
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {q.options.map((opt, i) => (
            <button
              key={opt.key}
              onClick={() => handleAnswer(opt.key)}
              className="tactile-card group w-full bg-white border-2 border-deep-ink p-4 rounded-xl flex items-center gap-4 text-left hover:bg-primary-container/20 transition-all"
              style={{ animationDelay: `${0.3 + i * 0.1}s` }}
            >
              <div className="w-12 h-12 flex-shrink-0 bg-surface-container rounded-lg border-2 border-outline-variant flex items-center justify-center group-hover:bg-primary-container transition-colors">
                <span className="font-bold text-headline-md text-primary">{opt.key}</span>
              </div>
              <div className="flex-grow">
                <p className="font-bold text-deep-ink">{opt.text}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (step === 'result' && result) {
    const level = LEVEL_INFO[result.nestLevel]
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-margin-mobile bg-background">
        <div className="text-center space-y-md max-w-lg animate-spring-in">
          <div className="text-7xl mb-2">{level.emoji}</div>
          <div className={`inline-block ${level.color} px-6 py-2 rounded-full`}>
            <h1 className="font-baloo text-headline-md text-primary">{level.title}</h1>
          </div>
          <p className="text-body-lg text-on-surface-variant mt-4">{level.desc}</p>
          <div className="bg-surface-container-low rounded-2xl p-4 mt-4">
            <p className="font-mono text-label-mono text-on-surface-variant uppercase">Puntaje</p>
            <p className="font-baloo text-display-lg-mobile text-primary">{result.totalScore}/6</p>
          </div>
          <button
            onClick={() => navigate('/tutorial')}
            className="tactile-btn bg-primary text-on-primary font-bold py-4 px-12 rounded-2xl text-headline-md mt-6"
          >
            ¡Hacer el Tutorial!
          </button>
        </div>
      </div>
    )
  }

  return null
}
