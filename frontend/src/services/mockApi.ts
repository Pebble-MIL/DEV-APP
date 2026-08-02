const _store: Record<string, any> = {
  users: {} as Record<string, any>,
  pebbles: {} as Record<string, any[]>,
  quizDone: false,
}

const SCENARIOS = [
  {
    id: 'tutorial_01', type: 'photo', nestLevelTarget: 'playa', mediaUrl: '', difficulty: 1,
    promptText: 'Look at this photo I took! I want to share it with the colony. Can you help me find what things we should check before posting it?',
    hiddenClues: [{ clueId: 'tutorial_clue_1', category: 'privacidad', coordinates: { x: 180, y: 218, radius: 30 }, textSpan: null, explanation: 'There is a window here! If my cave is visible, other penguins would know where I live.' }],
  },
  {
    id: 'playa_01', type: 'photo', nestLevelTarget: 'playa', mediaUrl: '', difficulty: 1,
    promptText: 'I found a shiny rock! Should I take the photo where my cave is also visible?',
    hiddenClues: [{ clueId: 'playa_01_clue_1', category: 'privacidad', coordinates: { x: 160, y: 260, radius: 55 }, textSpan: null, explanation: 'Oh! My cave is in the background. If the photo shows where I live, any penguin could come.' }],
  },
  {
    id: 'playa_02', type: 'message', nestLevelTarget: 'playa', mediaUrl: '', difficulty: 1,
    promptText: 'A new penguin asked me what my name is. Should I tell him my full name?',
    hiddenClues: [{ clueId: 'playa_02_clue_1', category: 'datos_sensibles', coordinates: null, textSpan: { start: 10, end: 35 }, explanation: 'Wait! We don\'t know that penguin well. Better to just use my game name.' }],
  },
  {
    id: 'playa_03', type: 'photo', nestLevelTarget: 'playa', mediaUrl: '', difficulty: 1,
    promptText: 'Look at this selfie I took with my new hat. Is it okay to upload it?',
    hiddenClues: [{ clueId: 'playa_03_clue_1', category: 'privacidad', coordinates: { x: 440, y: 135, radius: 40 }, textSpan: null, explanation: 'I see the name of my school in the background! I don\'t want them to know where I spend my days.' }],
  },
  {
    id: 'acantilado_01', type: 'photo', nestLevelTarget: 'acantilado', mediaUrl: '', difficulty: 2,
    promptText: 'Look! I tried on the new hockey team uniform. What do you think of the photo?',
    hiddenClues: [
      { clueId: 'acantilado_01_clue_1', category: 'datos_sensibles', coordinates: { x: 190, y: 230, radius: 50 }, textSpan: null, explanation: 'The uniform has the name of my team and school.' },
      { clueId: 'acantilado_01_clue_2', category: 'privacidad', coordinates: { x: 420, y: 300, radius: 40 }, textSpan: null, explanation: 'The reflection in the ice shows my house.' },
    ],
  },
  {
    id: 'acantilado_02', type: 'message', nestLevelTarget: 'acantilado', mediaUrl: '', difficulty: 2,
    promptText: 'I am very angry! Another penguin took my fish. I want to tell everyone right now.',
    hiddenClues: [
      { clueId: 'acantilado_02_clue_1', category: 'impulsividad', coordinates: null, textSpan: { start: 0, end: 18 }, explanation: 'When we are angry we sometimes say things we regret later.' },
      { clueId: 'acantilado_02_clue_2', category: 'datos_sensibles', coordinates: null, textSpan: { start: 35, end: 55 }, explanation: 'Telling this to the whole colony is too much.' },
    ],
  },
  {
    id: 'acantilado_03', type: 'photo', nestLevelTarget: 'acantilado', mediaUrl: '', difficulty: 2,
    promptText: 'I finished my homework! I took a photo of my notebook to show my friends.',
    hiddenClues: [{ clueId: 'acantilado_03_clue_1', category: 'datos_sensibles', coordinates: { x: 200, y: 295, radius: 60 }, textSpan: null, explanation: 'There you can see my full name and my teacher\'s!' }],
  },
  {
    id: 'glaciar_01', type: 'photo', nestLevelTarget: 'glaciar', mediaUrl: '', difficulty: 3,
    promptText: 'What a fun day! Look at all the photos I took today on the trip.',
    hiddenClues: [
      { clueId: 'glaciar_01_clue_1', category: 'datos_sensibles', coordinates: { x: 85, y: 218, radius: 20 }, textSpan: null, explanation: 'The watch I wear has my club\'s logo.' },
      { clueId: 'glaciar_01_clue_2', category: 'privacidad', coordinates: { x: 475, y: 208, radius: 35 }, textSpan: null, explanation: 'The sign behind says the name of the exact location.' },
      { clueId: 'glaciar_01_clue_3', category: 'impulsividad', coordinates: null, textSpan: { start: 0, end: 15 }, explanation: 'Posting everything at once without checking is tempting.' },
    ],
  },
  {
    id: 'glaciar_02', type: 'message', nestLevelTarget: 'glaciar', mediaUrl: '', difficulty: 3,
    promptText: 'Look what I was told: they are going to inspect all the nests in the north sector. Spread the word!',
    hiddenClues: [
      { clueId: 'glaciar_02_clue_1', category: 'impulsividad', coordinates: null, textSpan: { start: 0, end: 20 }, explanation: 'Sharing something we haven\'t verified can cause unnecessary worry.' },
      { clueId: 'glaciar_02_clue_2', category: 'datos_sensibles', coordinates: null, textSpan: { start: 50, end: 75 }, explanation: 'The north sector is where I live.' },
    ],
  },
  {
    id: 'glaciar_03', type: 'photo', nestLevelTarget: 'glaciar', mediaUrl: '', difficulty: 3,
    promptText: 'My first day of school! Here I am with my new friends. Should I share it?',
    hiddenClues: [
      { clueId: 'glaciar_03_clue_1', category: 'datos_sensibles', coordinates: { x: 430, y: 90, radius: 40 }, textSpan: null, explanation: 'The class schedule is posted on the wall.' },
      { clueId: 'glaciar_03_clue_2', category: 'privacidad', coordinates: { x: 220, y: 260, radius: 60 }, textSpan: null, explanation: 'My new friends also appear in the photo.' },
    ],
  },
]

const ISLANDS = [
  { id: 'isla_bahia_calma', name: 'Calm Bay', order: 1, requiredPebbles: 0, unlockedContentId: 'intro_story' },
  { id: 'isla_bosque_dorado', name: 'Golden Forest', order: 2, requiredPebbles: 3, unlockedContentId: 'bosque_story' },
  { id: 'isla_cima_viento', name: 'Wind Peak', order: 3, requiredPebbles: 6, unlockedContentId: 'cima_story' },
  { id: 'isla_laguna_espejo', name: 'Mirror Lagoon', order: 4, requiredPebbles: 10, unlockedContentId: 'laguna_story' },
  { id: 'isla_glaciar_eterno', name: 'Eternal Glacier', order: 5, requiredPebbles: 15, unlockedContentId: 'final_story' },
]

function getOrCreateUser(uid: string) {
  if (!_store.users[uid]) {
    _store.users[uid] = { uid, displayName: 'Explorer', nestLevel: 'playa', totalPebbles: 0, unlockedIslandIds: ['isla_bahia_calma'] }
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
              ? 'We did it! That little pebble shines bright in our nest. We learned together how to take care of our information.'
              : 'Hmm, next time we could think about it a bit more before sharing. We keep learning!',
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
          feedback: 'Well done!',
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
