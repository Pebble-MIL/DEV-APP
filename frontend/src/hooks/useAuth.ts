import { useState, useEffect } from 'react'
import { onAuthChange, loginAnonymously, initFirebaseAuth } from '../services/auth'
import { api } from '../services/api'
import type { UserState } from '../types'

export function useAuth() {
  const [user, setUser] = useState<UserState | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function init() {
      try {
        const { auth } = await initFirebaseAuth()

        if (auth?._isDev) {
          // Dev mode — auto-login
          await loginAnonymously()
          try { await api.verifyToken('dev') } catch {}
          if (mounted) {
            setUser({
              uid: 'dev-user',
              displayName: 'Explorador',
              nestLevel: 'playa',
              totalPebbles: 0,
              unlockedIslandIds: ['isla_bahia_calma'],
              tutorialCompleted: false,
            })
            setLoading(false)
          }
          return
        }

        // Real Firebase mode
        const unsub = onAuthChange(async (fbUser: any) => {
          if (!mounted) return
          if (fbUser) {
            const token = await fbUser.getIdToken()
            localStorage.setItem('pebble_id_token', token)
            try { await api.verifyToken(token) } catch {}
            setUser({
              uid: fbUser.uid,
              displayName: 'Explorador',
              nestLevel: 'playa',
              totalPebbles: 0,
              unlockedIslandIds: ['isla_bahia_calma'],
              tutorialCompleted: false,
            })
          } else {
            setUser(null)
          }
          setLoading(false)
        })
        return () => unsub?.()
      } catch {
        // Ultimate fallback
        if (mounted) {
          setUser({
            uid: 'dev-user',
            displayName: 'Explorador',
            nestLevel: 'playa',
            totalPebbles: 0,
            unlockedIslandIds: ['isla_bahia_calma'],
            tutorialCompleted: false,
          })
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
    setUser({
      uid: 'dev-user',
      displayName: 'Explorador',
      nestLevel: 'playa',
      totalPebbles: 0,
      unlockedIslandIds: ['isla_bahia_calma'],
      tutorialCompleted: false,
    })
    setLoading(false)
  }

  const updateUser = (partial: Partial<UserState>) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev))
  }

  return { user, loading, login, updateUser }
}
