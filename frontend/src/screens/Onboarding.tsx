import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { UserState } from '../types'
import { api } from '../services/api'
import pebbleHandUp from '../assets/pebble_hand_up.png'

interface OnboardingProps {
  user: UserState | null
  updateUser: (partial: Partial<UserState>) => void
}

const QUIZ = [
  {
    id: 'q1',
    category: 'privacidad',
    prompt: 'I found a shiny rock in front of my cave! I want to show it to all my penguin friends. Should I take the photo so my cave is visible too?',
    options: [
      { key: 'A', text: 'Yes! So everyone can see where you live', points: 0 },
      { key: 'B', text: 'Better just the rock, your cave is yours', points: 2 },
      { key: 'C', text: 'I don\'t know, does it matter?', points: 1 },
    ],
  },
  {
    id: 'q2',
    category: 'impulsividad',
    prompt: 'I\'m VERY angry! Another penguin took my fish. I want to tell the ENTIRE colony right now. What should I do?',
    options: [
      { key: 'A', text: 'Tell everyone now, let them all know', points: 0 },
      { key: 'B', text: 'Breathe first, then decide if you tell it', points: 2 },
      { key: 'C', text: 'Only tell your best friend', points: 1 },
    ],
  },
  {
    id: 'q3',
    category: 'datos_sensibles',
    prompt: 'A penguin I don\'t know asked me my name, where my nest is, and what time I go swimming. How friendly! Should I answer everything?',
    options: [
      { key: 'A', text: 'Yes, it\'s good manners to respond', points: 0 },
      { key: 'B', text: 'You can tell them your game name, but nothing else', points: 2 },
      { key: 'C', text: 'Only tell them where you swim', points: 0 },
    ],
  },
]

const LEVEL_INFO: Record<string, { emoji: string; title: string; desc: string; color: string }> = {
  playa: {
    emoji: '🏖️',
    title: 'Beach Nest',
    desc: 'You are starting your adventure. The pebbles will be big and easy to find. Every step counts!',
    color: 'bg-tertiary-fixed-dim',
  },
  acantilado: {
    emoji: '⛰️',
    title: 'Cliff Nest',
    desc: 'You have a good eye for clues. The challenges will be more interesting. Keep it up!',
    color: 'bg-primary-container',
  },
  glaciar: {
    emoji: '🏔️',
    title: 'Glacier Nest',
    desc: 'You are an expert guardian. The clues will be well hidden. Do you accept the challenge?',
    color: 'bg-primary-fixed-dim',
  },
}

type OnboardingStep = 'welcome' | 'name' | 'age' | 'password' | 'quiz' | 'result'

export default function Onboarding({ user, updateUser }: OnboardingProps) {
  const navigate = useNavigate()
  const [step, setStep] = useState<OnboardingStep>('welcome')
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [password, setPassword] = useState('')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Array<{ questionId: string; optionSelected: string }>>([])
  const [result, setResult] = useState<{ totalScore: number; nestLevel: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSaveProfile = () => {
    if (!name.trim()) return
    updateUser({ displayName: name.trim(), age: parseInt(age) || 0, password })
    setStep('quiz')
  }

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
          <div className="mb-4"><img src={pebbleHandUp} alt="Pebble" className="w-64 h-64 object-contain mx-auto" /></div>
          <h1 className="font-baloo text-display-lg-mobile md:text-display-lg text-primary">
            Hi! I'm <span className="text-secondary">Pebble</span>
          </h1>
          <p className="text-body-lg text-on-surface-variant">
            I'm a young penguin learning to protect my information in the digital colony.
            Will you help me build my first nest?
          </p>
          <p className="text-body-md text-on-surface-variant font-semibold">
            First, I need to get to know you a bit.
          </p>
          <button
            onClick={() => setStep('name')}
            className="tactile-btn bg-primary text-on-primary font-bold py-4 px-12 rounded-2xl text-headline-md mt-6"
          >
            Let's go!
          </button>
        </div>
      </div>
    )
  }

  if (step === 'name') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-margin-mobile bg-background">
        <div className="text-center space-y-md max-w-lg animate-spring-in">
          <div className="mb-4"><img src={pebbleHandUp} alt="Pebble" className="w-48 h-48 object-contain mx-auto" /></div>
          <PebbleMessage text="What's your name? That way I can call you by name during our adventure." />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name..."
            className="w-full px-6 py-4 rounded-2xl border-4 border-outline-variant bg-white text-headline-md font-bold text-deep-ink outline-none focus:border-primary transition-colors text-center"
            autoFocus
            maxLength={30}
          />
          <button
            onClick={() => name.trim() && setStep('age')}
            disabled={!name.trim()}
            className={`tactile-btn font-bold py-4 px-12 rounded-2xl text-headline-md mt-4 ${
              name.trim() ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  if (step === 'age') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-margin-mobile bg-background">
        <div className="text-center space-y-md max-w-lg animate-spring-in">
          <div className="mb-4"><img src={pebbleHandUp} alt="Pebble" className="w-48 h-48 object-contain mx-auto" /></div>
          <PebbleMessage text="How old are you? So I can pick adventures suitable for you." />
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Your age..."
            className="w-full px-6 py-4 rounded-2xl border-4 border-outline-variant bg-white text-headline-md font-bold text-deep-ink outline-none focus:border-primary transition-colors text-center"
            autoFocus
            min={3}
            max={18}
          />
          <button
            onClick={() => age && setStep('password')}
            disabled={!age}
            className={`tactile-btn font-bold py-4 px-12 rounded-2xl text-headline-md mt-4 ${
              age ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  if (step === 'password') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-margin-mobile bg-background">
        <div className="text-center space-y-md max-w-lg animate-spring-in">
          <div className="mb-4"><img src={pebbleHandUp} alt="Pebble" className="w-48 h-48 object-contain mx-auto" /></div>
          <PebbleMessage text="Create a password to protect your account. That way only you can access your nest." />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your secret password..."
            className="w-full px-6 py-4 rounded-2xl border-4 border-outline-variant bg-white text-headline-md font-bold text-deep-ink outline-none focus:border-primary transition-colors text-center"
            autoFocus
            minLength={3}
            maxLength={30}
          />
          {password.length > 0 && password.length < 3 && (
            <p className="text-xs text-on-surface-variant">Password must be at least 3 characters</p>
          )}
          <div className="bg-surface-container-low rounded-2xl p-4 border-2 border-outline-variant">
            <p className="font-mono text-label-mono text-on-surface-variant uppercase text-xs">
              ⚠️ Remember your password. You'll need it to come back to your account.
            </p>
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={password.length < 3}
            className={`tactile-btn font-bold py-4 px-12 rounded-2xl text-headline-md mt-4 ${
              password.length >= 3 ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant cursor-not-allowed'
            }`}
          >
            Done!
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
              {q.category === 'privacidad' ? 'Privacy' : q.category === 'impulsividad' ? 'Think first' : 'Sensitive data'}
            </span>
            <span className="font-mono text-label-mono text-primary font-black">{currentQ + 1} of {QUIZ.length}</span>
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
            <p className="font-mono text-label-mono text-on-surface-variant uppercase">Score</p>
            <p className="font-baloo text-display-lg-mobile text-primary">{result.totalScore}/6</p>
          </div>
          <button
            onClick={() => navigate('/tutorial')}
            className="tactile-btn bg-primary text-on-primary font-bold py-4 px-12 rounded-2xl text-headline-md mt-6"
          >
            Take the Tutorial!
          </button>
        </div>
      </div>
    )
  }

  return null
}

function PebbleMessage({ text }: { text: string }) {
  return (
    <div className="dialog-bubble mb-2">
      <p className="font-baloo text-headline-md text-deep-ink leading-tight">{text}</p>
    </div>
  )
}