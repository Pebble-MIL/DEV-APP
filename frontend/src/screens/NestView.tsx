import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { UserState, NestState, Island, PebbleData } from '../types'
import { api } from '../services/api'

interface NestViewProps {
  user: UserState | null
  updateUser: (partial: Partial<UserState>) => void
}

const CATEGORY_META: Record<string, { label: string; emoji: string; bg: string; border: string }> = {
  privacidad: { label: 'Privacidad', emoji: '🔒', bg: 'bg-[#097dac]', border: 'border-[#004c6b]' },
  impulsividad: { label: 'Impulsividad', emoji: '⚡', bg: 'bg-[#fd6e58]', border: 'border-[#ac3323]' },
  datos_sensibles: { label: 'Datos Sensibles', emoji: '🔍', bg: 'bg-[#f9bc46]', border: 'border-[#5e4200]' },
}

export default function NestView({ user, updateUser }: NestViewProps) {
  const navigate = useNavigate()
  const [nest, setNest] = useState<NestState | null>(null)
  const [loading, setLoading] = useState(true)
  const [newUnlock, setNewUnlock] = useState<Island | null>(null)

  useEffect(() => {
    loadNest()
  }, [])

  const loadNest = async () => {
    setLoading(true)
    try {
      const uid = user?.uid || 'dev-user'
      const data = await api.getNest(uid)
      setNest(data)
      const unlockData = await api.checkUnlock()
      if (unlockData.newUnlocks?.length > 0) {
        setNewUnlock(unlockData.newUnlocks[0])
        setTimeout(() => setNewUnlock(null), 4000)
      }
    } catch {
      setNest(null)
    }
    setLoading(false)
  }

  const handleUnlockCheck = async () => {
    try {
      const data = await api.checkUnlock()
      if (data.newUnlocks?.length > 0) {
        setNewUnlock(data.newUnlocks[0])
        setTimeout(() => setNewUnlock(null), 4000)
      }
      loadNest()
    } catch {}
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spring-bounce text-6xl">🐧</div>
      </div>
    )
  }

  const pebbles: PebbleData[] = nest?.pebbles || []
  const totalPebbles = nest?.totalPebbles || 0
  const nestLevel = nest?.nestLevel || 'playa'
  const islands = nest?.unlockedIslands || []
  const nextIsland = nest?.nextIsland

  const grouped: Record<string, PebbleData[]> = {}
  pebbles.forEach((p) => {
    if (!grouped[p.category]) grouped[p.category] = []
    grouped[p.category].push(p)
  })

  const LEVEL_EMOJI: Record<string, string> = { playa: '🏖️', acantilado: '⛰️', glaciar: '🏔️' }

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="bg-surface border-b-4 border-surface-variant sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-5 py-4 max-w-7xl mx-auto">
          <div className="font-bold text-headline-md text-primary tracking-tighter">Pebble</div>
          <div className="font-mono text-label-mono text-primary">{totalPebbles} 🪨</div>
        </div>
      </header>

      {newUnlock && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-primary-container text-on-primary-container px-6 py-4 rounded-2xl border-2 border-primary shadow-xl animate-spring-in text-center">
          <p className="text-3xl mb-1">🗺️</p>
          <p className="font-bold text-headline-md">¡Desbloqueaste {newUnlock.name}!</p>
        </div>
      )}

      <main className="max-w-7xl mx-auto w-full p-5 space-y-8">
        {/* Nest Header */}
        <section className="text-center">
          <div className="relative inline-block py-8 px-12 bg-surface-container-high rounded-[40px] border-2 border-outline-variant animate-spring-bounce">
            <div className="absolute -top-4 -left-4 bg-tertiary-fixed text-on-tertiary-fixed font-bold px-4 py-1 rounded-full border-2 border-tertiary shadow-sm -rotate-12">
              Mi Nido {LEVEL_EMOJI[nestLevel]}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {pebbles.slice(0, 12).map((p, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${CATEGORY_META[p.category]?.bg || 'bg-primary-container'} pebble-shadow border-b-4 ${CATEGORY_META[p.category]?.border || 'border-primary-fixed-dim'} transition-all cursor-pointer hover:scale-110`}
                  title={p.feedback}
                />
              ))}
              {pebbles.length === 0 && (
                <div className="col-span-4 text-center py-4">
                  <p className="text-body-md text-on-surface-variant">Aún no hay piedritas. ¡Ve a jugar!</p>
                </div>
              )}
            </div>
          </div>
          <p className="mt-6 font-bold text-headline-md text-on-surface-variant">
            Has recolectado <span className="text-primary">{totalPebbles}</span> piedritas
          </p>
        </section>

        {/* Categories */}
        {Object.keys(CATEGORY_META).map((cat) => {
          const items = grouped[cat] || []
          const meta = CATEGORY_META[cat]
          return (
            <section key={cat} className="bg-surface rounded-2xl border-2 border-outline-variant p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{meta.emoji}</span>
                <h3 className="font-bold text-headline-md text-on-surface">{meta.label}</h3>
                <span className="font-mono text-label-mono text-on-surface-variant ml-auto">{items.length}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((p, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full ${meta.bg} pebble-shadow border-b-4 ${meta.border} transition-all cursor-pointer hover:scale-110`}
                    title={p.feedback}
                  />
                ))}
                {items.length === 0 && (
                  <p className="text-body-md text-on-surface-variant italic">Sin piedritas aún</p>
                )}
              </div>
            </section>
          )
        })}

        {/* Island Progress */}
        <section className="island-path p-6 rounded-2xl border-2 border-outline-variant bg-surface">
          <h3 className="font-bold text-headline-md text-on-surface mb-6">Ruta del Aventurero</h3>
          <div className="relative flex flex-col items-center gap-8">
            {[
              ...islands,
              ...(nextIsland ? [nextIsland] : []),
            ]
              .sort((a, b) => a.order - b.order)
              .map((island, i) => {
                const isUnlocked = islands.some((u) => u.id === island.id)
                const isNext = nextIsland?.id === island.id && !isUnlocked
                const progress = isNext ? nextIsland?.progress || 0 : 100

                return (
                  <div key={island.id} className="flex items-center gap-4 w-full">
                    <div
                      className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                        isUnlocked
                          ? 'bg-primary-container border-b-4 border-on-primary-fixed-variant text-on-primary-container'
                          : isNext
                          ? 'bg-primary ring-4 ring-primary-fixed-dim border-b-4 border-on-primary-fixed-variant text-white shadow-lg'
                          : 'bg-surface-dim border-b-4 border-outline text-outline-variant'
                      }`}
                    >
                      <span className="text-2xl">
                        {isUnlocked ? '✅' : isNext ? '🚩' : '🔒'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold ${isUnlocked ? 'text-on-surface' : isNext ? 'text-primary' : 'text-outline'}`}>
                        {island.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-700 ${isUnlocked ? 'bg-primary' : 'bg-tertiary-fixed-dim'}`} style={{ width: `${progress}%` }} />
                        </div>
                        <span className="font-mono text-label-mono text-on-surface-variant text-xs">
                          {isUnlocked ? 'Completado' : `${progress}%`}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </section>

        {/* Action */}
        <button
          onClick={() => navigate('/game')}
          className="tactile-btn w-full bg-primary text-on-primary font-bold py-4 px-6 rounded-2xl text-headline-md flex items-center justify-center gap-2"
        >
          <span>¡Seguir explorando!</span>
        </button>
      </main>
    </div>
  )
}
