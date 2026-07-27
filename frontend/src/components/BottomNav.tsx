import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  { path: '/nest', icon: 'home', label: 'Nido' },
  { path: '/game', icon: 'sports_esports', label: 'Aventura' },
  { path: '/tutorial', icon: 'explore', label: 'Mapa' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname

  const hiddenPaths = ['/', '/onboarding']
  if (hiddenPaths.includes(currentPath)) return null

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface border-t-4 border-surface-variant flex justify-around items-center px-4 pb-8 pt-4 shadow-[0_-4px_0_0_rgba(0,0,0,0.05)]">
      {tabs.map((tab) => {
        const isActive = currentPath === tab.path
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all active:translate-y-1 ${
              isActive
                ? 'bg-primary-container text-on-primary-container border-b-4 border-on-primary-fixed-variant -translate-y-1'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
              {tab.icon}
            </span>
            <span className="text-xs font-mono font-semibold mt-1">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
