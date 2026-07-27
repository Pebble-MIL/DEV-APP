interface ProgressBarProps {
  current: number
  total: number
  label?: string
}

export default function ProgressBar({ current, total, label }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className="w-full space-y-2">
      {label && (
        <div className="flex justify-between items-end">
          <span className="font-mono text-label-mono text-deep-ink uppercase tracking-widest">{label}</span>
          <span className="font-mono text-label-mono text-primary font-black">{current} de {total}</span>
        </div>
      )}
      <div className="h-4 w-full bg-surface-variant rounded-full border-2 border-outline-variant p-0.5 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3)' }}
        />
      </div>
    </div>
  )
}
