import { useState, useEffect } from 'react'
import { onAuthChange, loginAnonymously, initFirebaseAuth } from '../services/auth'
import { api } from '../services/api'
import type { UserState } from '../types'

const STORAGE_KEY = 'pebble_user'

function loadSavedUser(): UserState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as UserState
  } catch {}
  return null
}

function saveUser(u: UserState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
}

function clearSavedUser() {
  localStorage.removeItem(STORAGE_KEY)
}

const DEFAULT_USER: UserState = {
  uid: 'dev-user',
  displayName: '',
  age: 0,
  password: '',
  nestLevel: 'playa',
  totalPebbles: 0,
  unlockedIslandIds: ['isla_bahia_calma'],
  tutorialCompleted: false,
}

export function useAuth() {
  const [user, setUser] = useState<UserState | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function init() {
      // Try to restore saved user first
      const saved = loadSavedUser()
      if (saved) {
        if (mounted) {
          setUser(saved)
          setLoading(false)
        }
        return
      }

      try {
        const { auth } = await initFirebaseAuth()

        if (auth?._isDev) {
          await loginAnonymously()
          try { await api.verifyToken('dev') } catch {}
          if (mounted) {
            const u = { ...DEFAULT_USER }
            setUser(u)
            saveUser(u)
            setLoading(false)
          }
          return
        }

        const unsub = onAuthChange(async (fbUser: any) => {
          if (!mounted) return
          if (fbUser) {
            const token = await fbUser.getIdToken()
            localStorage.setItem('pebble_id_token', token)
            try { await api.verifyToken(token) } catch {}
            const u = { ...DEFAULT_USER, uid: fbUser.uid }
            setUser(u)
            saveUser(u)
          } else {
            setUser(null)
            clearSavedUser()
          }
          setLoading(false)
        })
        return () => unsub?.()
      } catch {
        if (mounted) {
          const u = { ...DEFAULT_USER }
          setUser(u)
          saveUser(u)
          setLoading(false)
        }
      }
    }

    init()
    return () => { mounted = false }
  }, [])

  const login = async () => {
    setLoading(true)
    await loginAnonymously()
    try { await api.verifyToken('dev') } catch {}
    const u = { ...DEFAULT_USER }
    setUser(u)
    saveUser(u)
    setLoading(false)
  }

  const updateUser = (partial: Partial<UserState>) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...partial }
      saveUser(next)
      return next
    })
  }

  const logout = () => {
    clearSavedUser()
    setUser(null)
    try { localStorage.removeItem('pebble_id_token') } catch {}
  }

  return { user, loading, login, updateUser, logout }
}
