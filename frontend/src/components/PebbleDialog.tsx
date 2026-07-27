interface PebbleDialogProps {
  message: string
  className?: string
  delay?: number
}

export default function PebbleDialog({ message, className = '', delay = 0 }: PebbleDialogProps) {
  return (
    <div
      className={`flex flex-col items-center mb-8 ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="relative w-24 h-24 mb-4">
        <div className="absolute inset-0 bg-primary-fixed rounded-full animate-pulse-slow opacity-40" />
        <div className="w-full h-full relative z-10 flex items-center justify-center text-5xl drop-shadow-lg">
          🐧
        </div>
      </div>
      <div className="dialog-bubble max-w-lg mx-auto">
        <p className="font-baloo text-headline-md text-deep-ink text-center leading-tight">
          {message}
        </p>
      </div>
    </div>
  )
}
