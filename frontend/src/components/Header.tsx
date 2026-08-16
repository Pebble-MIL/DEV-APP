interface HeaderProps {
  pebbles: number
  onLogout?: () => void
}

export default function Header({ pebbles, onLogout }: HeaderProps) {
  return (
    <header className="bg-surface border-b-4 border-surface-variant sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-5 py-4 max-w-7xl mx-auto">
        <div className="font-bold text-headline-md text-primary tracking-tighter">Pebble</div>
        <div className="flex items-center gap-3">
          <button className="text-on-surface-variant hover:text-primary transition-colors" title="Settings" aria-label="Settings">
            <span className="material-symbols-outlined" aria-hidden="true">settings</span>
          </button>
          <button onClick={onLogout} className="text-on-surface-variant hover:text-primary transition-colors" title="Log out" aria-label="Log out">
            <span className="material-symbols-outlined" aria-hidden="true">logout</span>
          </button>
          <div className="font-mono text-label-mono text-primary">{pebbles} 🪨</div>
        </div>
      </div>
    </header>
  )
}
