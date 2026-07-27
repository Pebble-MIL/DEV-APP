const _store: Record<string, any> = {
  users: {} as Record<string, any>,
  pebbles: {} as Record<string, any[]>,
  quizDone: false,
}

const SCENARIOS = [
  {
    id: 'tutorial_01', type: 'photo', nestLevelTarget: 'playa', mediaUrl: '', difficulty: 1,
    promptText: '¡Mira esta foto que tomé! Quiero compartirla con la colonia. ¿Puedes ayudarme a encontrar qué cosas deberíamos revisar antes de publicarla?',
    hiddenClues: [{ clueId: 'tutorial_clue_1', category: 'privacidad', coordinates: { x: 180, y: 218, radius: 30 }, textSpan: null, explanation: '¡Aquí hay una ventana! Si se ve mi cueva, otros pingüinos sabrían dónde vivo.' }],
  },
  {
    id: 'playa_01', type: 'photo', nestLevelTarget: 'playa', mediaUrl: '', difficulty: 1,
    promptText: '¡Encontré una roca brillante! ¿Le tomo la foto donde se vea mi cueva también?',
    hiddenClues: [{ clueId: 'playa_01_clue_1', category: 'privacidad', coordinates: { x: 160, y: 260, radius: 55 }, textSpan: null, explanation: '¡Oh! Ahí está mi cueva de fondo. Si la foto muestra dónde vivo, cualquier pingüino podría venir.' }],
  },
  {
    id: 'playa_02', type: 'message', nestLevelTarget: 'playa', mediaUrl: '', difficulty: 1,
    promptText: 'Un pingüino nuevo me preguntó cómo me llamo. ¿Le digo mi nombre completo?',
    hiddenClues: [{ clueId: 'playa_02_clue_1', category: 'datos_sensibles', coordinates: null, textSpan: { start: 10, end: 35 }, explanation: '¡Espera! No conocemos bien a ese pingüino. Mejor solo mi nombre de juego.' }],
  },
  {
    id: 'playa_03', type: 'photo', nestLevelTarget: 'playa', mediaUrl: '', difficulty: 1,
    promptText: 'Mirá este selfie que me saqué con mi nuevo sombrero. ¿Está bien para subirlo?',
    hiddenClues: [{ clueId: 'playa_03_clue_1', category: 'privacidad', coordinates: { x: 440, y: 135, radius: 40 }, textSpan: null, explanation: '¡Veo el nombre de mi escuela en el fondo! No quiero que sepan dónde paso mis días.' }],
  },
  {
    id: 'acantilado_01', type: 'photo', nestLevelTarget: 'acantilado', mediaUrl: '', difficulty: 2,
    promptText: '¡Miren! Me probé el uniforme nuevo del equipo de hockey. ¿Qué opinan de la foto?',
    hiddenClues: [
      { clueId: 'acantilado_01_clue_1', category: 'datos_sensibles', coordinates: { x: 190, y: 230, radius: 50 }, textSpan: null, explanation: 'El uniforme tiene el nombre de mi equipo y escuela.' },
      { clueId: 'acantilado_01_clue_2', category: 'privacidad', coordinates: { x: 420, y: 300, radius: 40 }, textSpan: null, explanation: 'El reflejo en el hielo muestra mi casa.' },
    ],
  },
  {
    id: 'acantilado_02', type: 'message', nestLevelTarget: 'acantilado', mediaUrl: '', difficulty: 2,
    promptText: '¡Estoy muy enojado! Otro pingüino me quitó mi pescado. Quiero contarlo ya mismo.',
    hiddenClues: [
      { clueId: 'acantilado_02_clue_1', category: 'impulsividad', coordinates: null, textSpan: { start: 0, end: 18 }, explanation: 'Cuando estamos enojados a veces decimos cosas que después lamentamos.' },
      { clueId: 'acantilado_02_clue_2', category: 'datos_sensibles', coordinates: null, textSpan: { start: 35, end: 55 }, explanation: 'Contar esto a toda la colonia es demasiado.' },
    ],
  },
  {
    id: 'acantilado_03', type: 'photo', nestLevelTarget: 'acantilado', mediaUrl: '', difficulty: 2,
    promptText: '¡Terminé mi tarea! Le saqué una foto a mi cuaderno para mostrárselo a mis amigos.',
    hiddenClues: [{ clueId: 'acantilado_03_clue_1', category: 'datos_sensibles', coordinates: { x: 200, y: 295, radius: 60 }, textSpan: null, explanation: '¡Ahí se ve mi nombre completo y el de mi profesora!' }],
  },
  {
    id: 'glaciar_01', type: 'photo', nestLevelTarget: 'glaciar', mediaUrl: '', difficulty: 3,
    promptText: '¡Qué día tan divertido! Miren todas las fotos que tomé hoy en la excursión.',
    hiddenClues: [
      { clueId: 'glaciar_01_clue_1', category: 'datos_sensibles', coordinates: { x: 85, y: 218, radius: 20 }, textSpan: null, explanation: 'El reloj que uso tiene el logo de mi club.' },
      { clueId: 'glaciar_01_clue_2', category: 'privacidad', coordinates: { x: 475, y: 208, radius: 35 }, textSpan: null, explanation: 'El cartel detrás dice el nombre del lugar exacto.' },
      { clueId: 'glaciar_01_clue_3', category: 'impulsividad', coordinates: null, textSpan: { start: 0, end: 15 }, explanation: 'Publicar todo de golpe sin revisar es tentador.' },
    ],
  },
  {
    id: 'glaciar_02', type: 'message', nestLevelTarget: 'glaciar', mediaUrl: '', difficulty: 3,
    promptText: 'Mira lo que me contaron: van a inspeccionar todos los nidos del sector norte. ¡Corre la voz!',
    hiddenClues: [
      { clueId: 'glaciar_02_clue_1', category: 'impulsividad', coordinates: null, textSpan: { start: 0, end: 20 }, explanation: 'Compartir algo que no verificamos puede causar preocupación innecesaria.' },
      { clueId: 'glaciar_02_clue_2', category: 'datos_sensibles', coordinates: null, textSpan: { start: 50, end: 75 }, explanation: 'El sector norte es donde vivo.' },
    ],
  },
  {
    id: 'glaciar_03', type: 'photo', nestLevelTarget: 'glaciar', mediaUrl: '', difficulty: 3,
    promptText: '¡Mi primer día de clases! Acá estoy con mis nuevos amigos. ¿La comparto?',
    hiddenClues: [
      { clueId: 'glaciar_03_clue_1', category: 'datos_sensibles', coordinates: { x: 430, y: 90, radius: 40 }, textSpan: null, explanation: 'El horario de clases está pegado en la pared.' },
      { clueId: 'glaciar_03_clue_2', category: 'privacidad', coordinates: { x: 220, y: 260, radius: 60 }, textSpan: null, explanation: 'Mis nuevos amigos también salen en la foto.' },
    ],
  },
]

const ISLANDS = [
  { id: 'isla_bahia_calma', name: 'Bahía Calma', order: 1, requiredPebbles: 0, unlockedContentId: 'intro_story' },
  { id: 'isla_bosque_dorado', name: 'Bosque Dorado', order: 2, requiredPebbles: 3, unlockedContentId: 'bosque_story' },
  { id: 'isla_cima_viento', name: 'Cima del Viento', order: 3, requiredPebbles: 6, unlockedContentId: 'cima_story' },
  { id: 'isla_laguna_espejo', name: 'Laguna Espejo', order: 4, requiredPebbles: 10, unlockedContentId: 'laguna_story' },
  { id: 'isla_glaciar_eterno', name: 'Glaciar Eterno', order: 5, requiredPebbles: 15, unlockedContentId: 'final_story' },
]

function getOrCreateUser(uid: string) {
  if (!_store.users[uid]) {
    _store.users[uid] = { uid, displayName: 'Explorador', nestLevel: 'playa', totalPebbles: 0, unlockedIslandIds: ['isla_bahia_calma'] }
    _store.pebbles[uid] = []
  }
  return _store.users[uid]
}

function requestToKey(path: string, method: string): string {
  return `${method}:${path}`
}

export const mockApi = {
  handle(path: string, options: RequestInit = {}) {
    const url = new URL(path, 'http://mock')
    const pathname = url.pathname
    const method = (options.method || 'GET').toUpperCase()

    try {
      const body = options.body ? JSON.parse(options.body as string) : {}

      // Auth
      if (pathname === '/auth/verify' && method === 'POST') {
        const uid = body.id_token === 'dev' ? 'dev-user' : body.id_token || 'anon'
        getOrCreateUser(uid)
        return { uid, status: 'ok' }
      }

      // Quiz
      if (pathname === '/quiz/submit' && method === 'POST') {
        const total = body.answers.reduce((sum: number, a: any) => {
          const q = a.questionId
          if (q === 'q1' || q === 'q2' || q === 'q3') {
            return sum + (a.optionSelected === 'B' ? 2 : a.optionSelected === 'C' ? 1 : 0)
          }
          return sum
        }, 0)
        const level = total <= 2 ? 'playa' : total <= 4 ? 'acantilado' : 'glaciar'
        const uid = 'dev-user'
        const user = getOrCreateUser(uid)
        user.nestLevel = level
        _store.quizDone = true
        return { totalScore: total, nestLevel: level, detailed: body.answers.map((a: any) => ({ questionId: a.questionId, optionSelected: a.optionSelected, points: a.optionSelected === 'B' ? 2 : a.optionSelected === 'C' ? 1 : 0 })) }
      }

      // Scenarios
      if (pathname === '/scenarios/next' && method === 'GET') {
        const uid = 'dev-user'
        const user = getOrCreateUser(uid)
        const completedIds = (_store.pebbles[uid] || []).map((p: any) => p.scenarioId)
        const available = SCENARIOS.filter(s => s.nestLevelTarget === user.nestLevel && s.id !== 'tutorial_01' && !completedIds.includes(s.id))
        if (available.length === 0) return { message: 'No more scenarios!', done: true }
        const scenario = { ...available[0] }
        return scenario
      }

      // Scenario attempt
      const attemptMatch = pathname.match(/^\/scenarios\/([^/]+)\/attempt$/)
      if (attemptMatch && method === 'POST') {
        const scenarioId = attemptMatch[1]
        const scenario = SCENARIOS.find(s => s.id === scenarioId)
        if (!scenario) throw new Error('Not found')
        for (const clue of scenario.hiddenClues) {
          if (clue.coordinates && body.x != null && body.y != null) {
            const dx = body.x - clue.coordinates.x
            const dy = body.y - clue.coordinates.y
            if (Math.sqrt(dx * dx + dy * dy) <= clue.coordinates.radius) {
              return { found: true, clueId: clue.clueId, category: clue.category, explanation: clue.explanation }
            }
          }
        }
        return { found: false }
      }

      // Checklist evaluate
      if (pathname === '/checklist/evaluate' && method === 'POST') {
        const evals = (body.answers || []).map((a: any, i: number) => {
          const isCorrect = a.userChoice === 'bien' || a.userChoice === 'mejor'
          const categories = ['privacidad', 'impulsividad', 'datos_sensibles']
          return {
            award_pebble: isCorrect,
            pebble_color_category: categories[i % 3],
            pebble_feedback_text: isCorrect
              ? '¡Lo logramos! Esa piedrita brilla mucho en nuestro nido. Aprendimos juntos a cuidar nuestra información.'
              : 'Hmm, la próxima vez podríamos pensarlo un poco más antes de compartir. ¡Seguimos aprendiendo!',
            tone: isCorrect ? 'celebratory' : 'thoughtful',
          }
        })
        const uid = 'dev-user'
        const awarded = evals.filter((e: any) => e.award_pebble).length
        if (!_store.pebbles[uid]) _store.pebbles[uid] = []
        awarded.forEach(() => {
          _store.pebbles[uid].push({ scenarioId: body.scenarioId, earnedAt: new Date().toISOString() })
        })
        _store.users[uid].totalPebbles = _store.pebbles[uid].length
        return { evaluations: evals, awardedCount: awarded, totalPebbles: _store.pebbles[uid].length }
      }

      // Nest
      const nestMatch = pathname.match(/^\/nest\/([^/]+)$/)
      if (nestMatch && method === 'GET') {
        const uid = nestMatch[1]
        const user = getOrCreateUser(uid)
        const pebbles = (_store.pebbles[uid] || []).map((_: any, i: number) => ({
          category: ['privacidad', 'impulsividad', 'datos_sensibles'][i % 3],
          colorCode: ['#097dac', '#fd6e58', '#f9bc46'][i % 3],
          scenarioId: _.scenarioId,
          feedback: '¡Bien hecho!',
        }))
        const unlocked = ISLANDS.filter(i => user.unlockedIslandIds.includes(i.id))
        const nextCandidate = ISLANDS.find(i => !user.unlockedIslandIds.includes(i.id))
        const nextIsland = nextCandidate ? { ...nextCandidate, progress: Math.min(100, Math.floor((user.totalPebbles / Math.max(1, nextCandidate.requiredPebbles)) * 100)) } : null
        return { pebbles, totalPebbles: user.totalPebbles, nestLevel: user.nestLevel, unlockedIslands: unlocked, nextIsland }
      }

      // Islands unlock
      if (pathname === '/islands/unlock-check' && method === 'POST') {
        const uid = 'dev-user'
        const user = getOrCreateUser(uid)
        const newUnlocks: any[] = []
        for (const island of ISLANDS) {
          if (!user.unlockedIslandIds.includes(island.id) && user.totalPebbles >= island.requiredPebbles) {
            user.unlockedIslandIds.push(island.id)
            newUnlocks.push(island)
          }
        }
        return { newUnlocks, unlockedIslandIds: user.unlockedIslandIds }
      }

      // Tutorial
      if (pathname === '/tutorial/scenario' && method === 'GET') {
        return { ...SCENARIOS.find(s => s.id === 'tutorial_01') }
      }

      throw new Error(`Mock: No handler for ${method} ${pathname}`)
    } catch (e: any) {
      throw new Error(e.message || 'Mock error')
    }
  },
}
