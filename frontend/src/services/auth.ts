let firebaseApp: any = null
let firebaseAuthModule: any = null

export async function initFirebaseAuth(): Promise<{ app: any; auth: any }> {
  if (firebaseApp) return { app: firebaseApp, auth: firebaseAuthModule }
  try {
    const appMod = await import('firebase/app')
    firebaseApp = appMod.initializeApp({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'pebble-mil-app.firebaseapp.com',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'pebble-mil-app',
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'pebble-mil-app.appspot.com',
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:0000000000000000000000',
    })
    const authMod = await import('firebase/auth')
    firebaseAuthModule = authMod.getAuth(firebaseApp)
    return { app: firebaseApp, auth: firebaseAuthModule }
  } catch {
    console.log('Firebase not available — using dev auth mode')
    firebaseApp = { _isDev: true }
    firebaseAuthModule = { _isDev: true }
    return { app: firebaseApp, auth: firebaseAuthModule }
  }
}

export async function loginAnonymously(): Promise<string> {
  const { auth } = await initFirebaseAuth()
  if (auth?._isDev) {
    localStorage.setItem('pebble_id_token', 'dev-token')
    return 'dev-token'
  }
  try {
    const authMod = await import('firebase/auth')
    const cred = await authMod.signInAnonymously(auth)
    const token = await cred.user.getIdToken()
    localStorage.setItem('pebble_id_token', token)
    return token
  } catch {
    localStorage.setItem('pebble_id_token', 'dev-token')
    return 'dev-token'
  }
}

export function onAuthChange(callback: (user: any) => void): () => void {
  initFirebaseAuth().then(({ auth }) => {
    if (auth?._isDev) {
      callback({ uid: 'dev-user', isDev: true })
      return
    }
    import('firebase/auth').then(({ onAuthStateChanged }) => {
      onAuthStateChanged(auth, callback)
    })
  })
  return () => {}
}
