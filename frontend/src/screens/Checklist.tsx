import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { UserState, Scenario, HiddenClue } from '../types'
import { api } from '../services/api'
import PebbleDialog from '../components/PebbleDialog'
import pebbleHandUp from '../assets/pebble_hand_up.png'

interface ChecklistProps {
  user: UserState | null
  updateUser: (partial: Partial<UserState>) => void
}

interface LocationState {
  scenario: Scenario
  foundClues: HiddenClue[]
}

interface Answer {
  question: string
  userChoice: string
}

const CHOICES = [
  { key: 'bien', label: 'You did well', icon: '👍', color: 'bg-primary-container border-primary' },
  { key: 'mejor', label: 'Better edit it first', icon: '✏️', color: 'bg-tertiary-fixed-dim border-tertiary' },
  { key: 'no_se', label: "I don't know, explain", icon: '🤔', color: 'bg-surface-container-high border-outline' },
]

export default function Checklist({ user, updateUser }: ChecklistProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState | null

  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [feedback, setFeedback] = useState<Array<{ award_pebble: boolean; feedback_text: string; category: string }> | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!state || !state.scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button onClick={() => navigate('/home')} className="tactile-btn bg-primary text-on-primary px-8 py-4 rounded-2xl">
          Go home
        </button>
      </div>
    )
  }

  const { scenario, foundClues } = state
  const totalQuestions = foundClues.length

  const generateQuestion = (clue: HiddenClue): string => {
    const templates = [
      `I found that something important is visible in the photo. ${clue.explanation.split('.')[0]}. Do you think it was right to share it like that?`,
      `Look, I discovered a clue: ${clue.explanation.split('.')[0].toLowerCase()}. What do you think, was it okay to show that?`,
      `I found something! ${clue.explanation.split('.')[0]}. Should I have just posted it like that?`,
    ]
    return templates[Math.floor(Math.random() * templates.length)]
  }

  const handleChoice = async (choice: string) => {
    const newAnswers = [...answers, { question: generateQuestion(foundClues[currentIdx]), userChoice: choice }]
    setAnswers(newAnswers)

    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1)
    } else {
      setSubmitting(true)
      try {
        const res = await api.evaluateChecklist(
          scenario.id,
          newAnswers.map((a) => ({ question: a.question, userChoice: a.userChoice })),
          foundClues.map((c) => c.clueId)
        )
        setFeedback(
          res.evaluations.map((e: { award_pebble: boolean; pebble_feedback_text: string; pebble_color_category: string }) => ({
            award_pebble: e.award_pebble,
            feedback_text: e.pebble_feedback_text,
            category: e.pebble_color_category,
          }))
        )
      } catch {
        setFeedback(
          foundClues.map(() => ({
            award_pebble: true,
            feedback_text: 'Well thought! That pebble goes straight to the nest.',
            category: 'privacidad',
          }))
        )
      }
      setSubmitting(false)
    }
  }

  if (feedback) {
    const awarded = feedback.filter((f) => f.award_pebble).length
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-margin-mobile text-center space-y-6 max-w-2xl mx-auto pb-32">
        <div className={`text-7xl ${awarded > 0 ? 'animate-spring-bounce' : ''}`}>
          {awarded > 0 ? '🎉' : '🤔'}
        </div>
        <h2 className="font-baloo text-display-lg-mobile text-primary">
          {awarded > 0 ? `You got ${awarded} pebble${awarded > 1 ? 's' : ''}!` : "Let's keep learning"}
        </h2>

        <div className="w-full space-y-4">
          {feedback.map((f, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl border-2 text-left ${f.award_pebble ? 'bg-primary-container/30 border-primary' : 'bg-surface-container border-outline-variant'}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${f.award_pebble ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant'}`}>
                  {f.category}
                </span>
                {f.award_pebble && <span className="text-xl">🪨</span>}
              </div>
              <p className="font-bold text-deep-ink">{f.feedback_text}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={() => navigate('/home')}
            className="tactile-btn bg-primary text-on-primary font-bold py-4 px-10 rounded-2xl text-headline-md"
          >
            Go home
          </button>
          <button
            onClick={() => navigate('/nest')}
            className="tactile-btn bg-surface-container-high text-primary font-bold py-4 px-10 rounded-2xl border-2 border-primary text-headline-md"
          >
            View nest
          </button>
        </div>
      </div>
    )
  }

  if (submitting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spring-bounce"><img src={pebbleHandUp} alt="Pebble" className="w-16 h-16 object-contain" /></div>
          <p className="font-baloo text-headline-md text-primary">Pebble is thinking...</p>
        </div>
      </div>
    )
  }

  const clue = foundClues[currentIdx]

  return (
    <div className="min-h-screen flex flex-col px-margin-mobile py-4 max-w-2xl mx-auto pb-32">
      <div className="flex items-center justify-between mb-6">
        <span className="font-mono text-label-mono text-primary uppercase tracking-widest">Checklist</span>
        <span className="font-mono text-label-mono text-on-surface-variant">
          {currentIdx + 1} of {totalQuestions}
        </span>
      </div>

      <div className="h-2 w-full bg-surface-variant rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(currentIdx / totalQuestions) * 100}%` }} />
      </div>

      <div className="bg-white border-2 border-outline-variant rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">
            {clue.category === 'privacidad' ? '🔒' : clue.category === 'impulsividad' ? '⚡' : '🔍'}
          </span>
          <span className="font-mono text-label-mono text-primary uppercase">
            {clue.category === 'privacidad' ? 'Privacy' : clue.category === 'impulsividad' ? 'Impulsivity' : 'Sensitive data'}
          </span>
        </div>
        <p className="text-body-md text-on-surface-variant">{clue.explanation}</p>
      </div>

      <PebbleDialog message={generateQuestion(clue)} />

      <div className="grid grid-cols-1 gap-4 mt-auto">
        {CHOICES.map((choice) => (
          <button
            key={choice.key}
            onClick={() => handleChoice(choice.key)}
            className={`tactile-card w-full p-4 rounded-xl flex items-center gap-4 text-left hover:${choice.color} transition-all border-2`}
          >
            <span className="text-3xl">{choice.icon}</span>
            <span className="font-bold text-headline-md text-deep-ink">{choice.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
