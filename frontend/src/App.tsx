import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Landing from './screens/Landing'
import Onboarding from './screens/Onboarding'
import Tutorial from './screens/Tutorial'
import GameScreen from './screens/GameScreen'
import Checklist from './screens/Checklist'
import NestView from './screens/NestView'
import HomeScreen from './screens/HomeScreen'
import BottomNav from './components/BottomNav'
import pebbleHandUp from './assets/pebble_hand_up.png'

export default function App() {
  const { user, loading, login, updateUser, logout } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 animate-spring-in">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary-fixed animate-spring-bounce flex items-center justify-center">
            <img src={pebbleHandUp} alt="Pebble" className="w-10 h-10 object-contain" />
          </div>
          <p className="font-baloo text-headline-md text-primary">Pebble is preparing the ice...</p>
        </div>
      </div>
    )
  }

  const needsOnboarding = user && !user.displayName

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route
          path="/"
          element={
            !user
              ? <Landing onStart={login} />
              : needsOnboarding
              ? <Navigate to="/onboarding" />
              : <Navigate to="/home" />
          }
        />
        <Route path="/onboarding" element={<Onboarding user={user} updateUser={updateUser} />} />
        <Route path="/tutorial" element={<Tutorial user={user} updateUser={updateUser} />} />
        <Route path="/game" element={<GameScreen user={user} updateUser={updateUser} />} />
        <Route path="/games" element={<GameScreen user={user} updateUser={updateUser} />} />
        <Route path="/checklist" element={<Checklist user={user} updateUser={updateUser} />} />
        <Route path="/nest" element={<NestView user={user} updateUser={updateUser} onLogout={logout} />} />
        <Route path="/home" element={user ? <HomeScreen user={user} updateUser={updateUser} onLogout={logout} /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {user && <BottomNav />}
    </div>
  )
}
