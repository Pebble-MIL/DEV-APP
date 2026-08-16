import { mockApi } from './mockApi'
import { getToken } from './auth'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const BASE_URL = '/api'

async function tryRealBackend(path: string, options: RequestInit = {}) {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 800)

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch {
    clearTimeout(timeout)
    throw new Error('backend_unavailable')
  }
}

async function apiRequest(path: string, options: RequestInit = {}) {
  if (!USE_MOCK) {
    return tryRealBackend(path, options)
  }

  try {
    return await tryRealBackend(path, options)
  } catch {
    return mockApi.handle(path, options)
  }
}

export const api = {
  verifyToken: (idToken: string) =>
    apiRequest('/auth/verify', { method: 'POST', body: JSON.stringify({ id_token: idToken }) }),

  submitQuiz: (answers: Array<{ questionId: string; optionSelected: string }>) =>
    apiRequest('/quiz/submit', { method: 'POST', body: JSON.stringify({ answers }) }),

  getNextScenario: () => apiRequest('/scenarios/next'),

  attemptScenario: (scenarioId: string, x?: number, y?: number, textStart?: number, textEnd?: number) =>
    apiRequest(`/scenarios/${scenarioId}/attempt`, {
      method: 'POST',
      body: JSON.stringify({ x, y, textStart, textEnd }),
    }),

  evaluateChecklist: (
    scenarioId: string,
    answers: Array<{ question: string; userChoice: string }>,
    foundClueIds: string[]
  ) =>
    apiRequest('/checklist/evaluate', {
      method: 'POST',
      body: JSON.stringify({ scenarioId, answers, foundClueIds }),
    }),

  getNest: (uid: string) => apiRequest(`/nest/${uid}`),

  checkUnlock: () => apiRequest('/islands/unlock-check', { method: 'POST' }),

  getTutorial: () => apiRequest('/tutorial/scenario'),
}
