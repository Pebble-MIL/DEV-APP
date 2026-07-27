import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Landing from './screens/Landing'
import Onboarding from './screens/Onboarding'
import Tutorial from './screens/Tutorial'
import GameScreen from './screens/GameScreen'
import Checklist from './screens/Checklist'
import NestView from './screens/NestView'
import BottomNav from './components/BottomNav'

export default function App() {
  const { user, loading, login, updateUser } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 animate-spring-in">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary-fixed animate-spring-bounce flex items-center justify-center">
            <span className="text-3xl">🐧</span>
          </div>
          <p className="font-baloo text-headline-md text-primary">Pebble está preparando el hielo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={user ? <Navigate to="/game" /> : <Landing onStart={login} />} />
        <Route path="/onboarding" element={<Onboarding user={user} updateUser={updateUser} />} />
        <Route path="/tutorial" element={<Tutorial user={user} updateUser={updateUser} />} />
        <Route path="/game" element={<GameScreen user={user} updateUser={updateUser} />} />
        <Route path="/checklist" element={<Checklist user={user} updateUser={updateUser} />} />
        <Route path="/nest" element={<NestView user={user} updateUser={updateUser} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {user && <BottomNav />}
    </div>
  )
}
