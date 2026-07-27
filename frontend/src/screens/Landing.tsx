interface LandingProps {
  onStart: () => void
}

export default function Landing({ onStart }: LandingProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative px-margin-mobile md:px-margin-desktop py-12 md:py-24 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-xl min-h-screen">
        <div className="w-full md:w-1/2 space-y-md animate-spring-in">
          <span className="font-mono text-label-mono text-primary bg-primary-fixed px-3 py-1 rounded-full uppercase tracking-widest">
            Alfabetización Digital para Niños
          </span>
          <h1 className="font-baloo text-display-lg-mobile md:text-display-lg text-primary leading-none">
            Ayuda a <span className="text-secondary">Pebble</span> a construir su nido
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-lg">
            Aprende a cuidar tu información mientras juegas. Pebble te guía en una aventura
            por islas de hielo buscando pistas y recolectando piedritas mágicas.
          </p>
          <div className="pt-md flex flex-wrap gap-md">
            <button
              onClick={onStart}
              className="tactile-btn bg-secondary-container text-on-secondary-container font-bold py-4 px-10 rounded-2xl text-headline-md hover:brightness-110"
            >
              ¡Comienza gratis!
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 relative animate-spring-in" style={{ animationDelay: '0.2s' }}>
          <div className="aspect-square bg-surface-container-low rounded-[40px] flex items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute top-10 right-10 w-24 h-24 bg-primary-fixed opacity-50 blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-secondary-fixed-dim opacity-30 blur-3xl" />
            <div className="text-9xl drop-shadow-2xl hover:rotate-3 transition-transform duration-500">
              🐧
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-surface-container-low py-12 border-y-2 border-surface-variant">
        <div className="max-w-7xl mx-auto px-margin-mobile flex flex-wrap justify-center gap-xl md:gap-32">
          {[
            { value: '10k+', label: 'Aventureros' },
            { value: '24', label: 'Misiones' },
            { value: '4.9/5', label: 'Valoración' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-display-lg-mobile text-primary">{s.value}</div>
              <div className="font-mono text-label-mono text-on-surface-variant uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-sm">
          <h2 className="font-baloo text-display-lg-mobile md:text-display-lg text-primary">¿Cómo funciona?</h2>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Tres simples pasos para convertirte en un guardián de tu información.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {[
            { icon: 'nest_eco_leaf', title: 'Conoce a Pebble', desc: 'Ayuda a este pingüino torpe a aprender sobre qué compartir en línea.' },
            { icon: 'explore', title: 'Busca Pistas', desc: 'Encuentra información escondida en fotos y mensajes antes de publicar.' },
            { icon: 'auto_awesome', title: 'Construye tu Nido', desc: 'Cada acierto es una piedrita que desbloquea nuevas islas y aventuras.' },
          ].map((card) => (
            <div
              key={card.title}
              className="tactile-card bg-surface p-8 flex flex-col items-center text-center space-y-md hover:-translate-y-1 transition-transform"
            >
              <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-2xl flex items-center justify-center pebble-shadow">
                <span className="text-3xl">{card.icon === 'nest_eco_leaf' ? '🏠' : card.icon === 'explore' ? '🧭' : '✨'}</span>
              </div>
              <h3 className="font-bold text-headline-md text-primary">{card.title}</h3>
              <p className="text-body-md text-on-surface-variant">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 px-margin-mobile text-center">
        <div className="max-w-3xl mx-auto bg-surface-container rounded-[40px] p-xl border-2 border-white shadow-xl">
          <h2 className="font-baloo text-display-lg-mobile md:text-headline-lg text-primary mb-6">
            ¿Listo para la aventura?
          </h2>
          <p className="text-body-lg text-on-surface-variant mb-10">
            Únete a miles de aventureros y empieza tu viaje con Pebble.
          </p>
          <button
            onClick={onStart}
            className="tactile-btn bg-secondary-container text-on-secondary-container font-bold py-6 px-16 rounded-2xl hover:scale-105 active:scale-95 text-headline-md"
          >
            ¡Comienza mi Aventura!
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-dim pt-16 pb-32 md:pb-16 px-margin-mobile border-t-4 border-surface-variant">
        <div className="max-w-7xl mx-auto text-center">
          <div className="font-bold text-headline-md text-primary tracking-tighter mb-4">Pebble</div>
          <p className="text-on-surface-variant text-body-md">
            Haciendo que aprender sobre información digital sea tan divertido como una aventura en el hielo.
          </p>
          <div className="mt-8 pt-8 border-t border-outline-variant text-center text-on-surface-variant text-xs">
            © 2024 Pebble. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
