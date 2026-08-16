import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { UserState, NestState, Island } from '../types'
import { api } from '../services/api'
import pebbleHandUp from '../assets/pebble_hand_up.png'

interface HomeScreenProps {
  user: UserState | null
  updateUser: (partial: Partial<UserState>) => void
  onLogout?: () => void
}

const LEVEL_EMOJI: Record<string, string> = { playa: '🏖️', acantilado: '⛰️', glaciar: '🏔️' }
const LEVEL_NAME: Record<string, string> = { playa: 'Beach', acantilado: 'Cliff', glaciar: 'Glacier' }

export default function HomeScreen({ user, onLogout }: HomeScreenProps) {
  const navigate = useNavigate()
  const [nest, setNest] = useState<NestState | null>(null)
  const [loadingNest, setLoadingNest] = useState(true)

  useEffect(() => {
    loadNest()
  }, [])

  const loadNest = async () => {
    setLoadingNest(true)
    try {
      const uid = user?.uid || 'dev-user'
      const data = await api.getNest(uid)
      setNest(data)
    } catch {
      setNest(null)
    }
    setLoadingNest(false)
  }

  const displayName = user?.displayName || 'Explorer'
  const age = user?.age || ''
  const nestLevel = user?.nestLevel || 'playa'
  const pebbles = nest?.totalPebbles || 0
  const islands = nest?.unlockedIslands || []
  const nextIsland = nest?.nextIsland

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="bg-surface border-b-4 border-surface-variant sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-5 py-4 max-w-7xl mx-auto">
          <div className="font-bold text-headline-md text-primary tracking-tighter">Pebble</div>
          <div className="flex items-center gap-3">
            <button className="text-on-surface-variant hover:text-primary transition-colors" title="Settings" aria-label="Settings">
              <span className="material-symbols-outlined" aria-hidden="true">settings</span>
            </button>
            <button onClick={onLogout} className="text-on-surface-variant hover:text-primary transition-colors" title="Log out" aria-label="Log out">
              <span className="material-symbols-outlined" aria-hidden="true">logout</span>
            </button>
            <div className="font-mono text-label-mono text-primary">{pebbles} 🪨</div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-5 space-y-6">
        {/* Welcome card */}
        <section className="bg-surface-container rounded-[32px] border-2 border-outline-variant p-6 text-center animate-spring-in">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary-fixed flex items-center justify-center">
            <img src={pebbleHandUp} alt="Pebble" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="font-baloo text-display-lg-mobile text-primary">
            Hi, <span className="text-secondary">{displayName}</span>!
          </h1>
          {age && <p className="text-body-md text-on-surface-variant mt-1">{age} years old</p>}
          <div className="inline-flex items-center gap-2 mt-3 bg-surface-container-high px-4 py-2 rounded-full">
            <span className="text-xl">{LEVEL_EMOJI[nestLevel]}</span>
            <span className="font-bold text-headline-sm text-primary">{LEVEL_NAME[nestLevel]} Nest</span>
          </div>
        </section>

        {/* Stats row */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-low rounded-2xl border-2 border-outline-variant p-5 text-center">
            <span className="text-3xl">🪨</span>
            <p className="font-baloo text-display-sm text-primary mt-1">{pebbles}</p>
            <p className="font-mono text-label-mono text-on-surface-variant uppercase text-xs">Pebbles</p>
          </div>
          <div className="bg-surface-container-low rounded-2xl border-2 border-outline-variant p-5 text-center">
            <span className="text-3xl">🗺️</span>
            <p className="font-baloo text-display-sm text-primary mt-1">{islands.length}</p>
            <p className="font-mono text-label-mono text-on-surface-variant uppercase text-xs">Islands</p>
          </div>
        </section>

        {/* Island progress */}
        {!loadingNest && (
          <section className="bg-surface rounded-2xl border-2 border-outline-variant p-5">
            <h3 className="font-bold text-headline-md text-on-surface mb-4">Your Progress</h3>
            <div className="space-y-3">
              {[...islands, ...(nextIsland ? [nextIsland] : [])]
                .sort((a, b) => a.order - b.order)
                .slice(0, 4)
                .map((island) => {
                  const isUnlocked = islands.some((u) => u.id === island.id)
                  const isNext = nextIsland?.id === island.id && !isUnlocked
                  const progress = isNext ? nextIsland?.progress || 0 : 100
                  return (
                    <div key={island.id} className="flex items-center gap-3">
                      <span className="text-xl">{isUnlocked ? '✅' : isNext ? '🚩' : '🔒'}</span>
                      <div className="flex-1">
                        <p className={`font-bold text-sm ${isUnlocked ? 'text-on-surface' : isNext ? 'text-primary' : 'text-outline'}`}>
                          {island.name}
                        </p>
                        <div className="h-2 bg-surface-variant rounded-full overflow-hidden mt-1">
                          <div className={`h-full rounded-full ${isUnlocked ? 'bg-primary' : 'bg-tertiary-fixed-dim'}`} style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                      <span className="font-mono text-label-mono text-on-surface-variant text-xs">
                        {isUnlocked ? '✅' : `${progress}%`}
                      </span>
                    </div>
                  )
                })}
            </div>
          </section>
        )}

        {/* Actions */}
        <section className="space-y-3">
          <button
            onClick={() => navigate('/game')}
            className="tactile-btn w-full bg-primary text-on-primary font-bold py-5 px-8 rounded-2xl text-headline-md flex items-center justify-center gap-3"
          >
            <span>📷</span>
            <span>Continue my adventure!</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/nest')}
              className="tactile-btn bg-surface-container-high text-primary font-bold py-4 px-6 rounded-2xl border-2 border-primary text-headline-sm flex items-center justify-center gap-2"
            >
              <span>🏠</span>
              <span>My Nest</span>
            </button>
            <button
              onClick={() => navigate('/tutorial')}
              className="tactile-btn bg-surface-container-high text-primary font-bold py-4 px-6 rounded-2xl border-2 border-primary text-headline-sm flex items-center justify-center gap-2"
            >
              <span>🎮</span>
              <span>Tutorial</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}