interface LandingProps {
  onStart: () => void
}

import pebbleHandUp from '../assets/pebble_hand_up.png'

export default function Landing({ onStart }: LandingProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative px-margin-mobile md:px-margin-desktop py-12 md:py-24 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-xl min-h-screen">
        <div className="w-full md:w-1/2 space-y-md animate-spring-in">
          <span className="font-mono text-label-mono text-primary bg-primary-fixed px-3 py-1 rounded-full uppercase tracking-widest">
            Digital Literacy for Kids
          </span>
          <h1 className="font-baloo text-display-lg-mobile md:text-display-lg text-primary leading-none">
            Help <span className="text-secondary">Pebble</span> build his nest
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-lg">
            Learn to protect your information while playing. Pebble guides you through an adventure across ice islands, searching for clues and collecting magical pebbles.
          </p>
          <div className="pt-md flex flex-wrap gap-md">
            <button
              onClick={onStart}
              className="tactile-btn bg-secondary-container text-on-secondary-container font-bold py-4 px-10 rounded-2xl text-headline-md hover:brightness-110"
            >
              Start Free!
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 relative animate-spring-in" style={{ animationDelay: '0.2s' }}>
          <div className="aspect-square bg-surface-container-low rounded-[40px] flex items-center justify-center relative overflow-hidden animate-float">
            <div className="absolute top-10 right-10 w-32 h-32 bg-primary-fixed opacity-60 blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-secondary-fixed-dim opacity-40 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-tertiary-fixed opacity-30 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
            <div className="drop-shadow-2xl hover:rotate-6 transition-transform duration-500 w-full h-full flex items-center justify-center relative z-10">
              <img src={pebbleHandUp} alt="Pebble" className="w-10/12 h-10/12 object-contain hover:scale-105 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-surface-container-low py-12 border-y-2 border-surface-variant relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 island-path" />
        <div className="max-w-7xl mx-auto px-margin-mobile flex flex-wrap justify-center gap-xl md:gap-32">
          {[
            { value: '10k+', label: 'Adventurers' },
            { value: '24', label: 'Missions' },
            { value: '4.9/5', label: 'Rating' },
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
          <h2 className="font-baloo text-display-lg-mobile md:text-display-lg text-primary">How it works?</h2>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Three simple steps to become a guardian of your information.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {[
            { icon: 'nest_eco_leaf', title: 'Meet Pebble', desc: 'Help this clumsy penguin learn about what to share online.' },
            { icon: 'explore', title: 'Find Clues', desc: 'Find hidden information in photos and messages before posting.' },
            { icon: 'auto_awesome', title: 'Build your Nest', desc: 'Every correct answer is a pebble that unlocks new islands and adventures.' },
          ].map((card) => (
            <div
              key={card.title}
              className="tactile-card bg-surface p-8 flex flex-col items-center text-center space-y-md hover:-translate-y-1 transition-transform"
            >
              <div className="w-20 h-20 bg-primary-container text-on-primary-container rounded-[24px] flex items-center justify-center pebble-shadow mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3 group-hover:bg-primary group-hover:text-white">
                <span className="text-4xl">{card.icon === 'nest_eco_leaf' ? '🏠' : card.icon === 'explore' ? '🧭' : '✨'}</span>
              </div>
              <h3 className="font-bold text-headline-md text-primary">{card.title}</h3>
              <p className="text-body-md text-on-surface-variant">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-surface-container-low border-y-2 border-surface-variant">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16">
            <h2 className="font-baloo text-display-lg-mobile md:text-display-lg text-primary">What parents say</h2>
            <p className="text-body-lg text-on-surface-variant mt-4">Trusted by families everywhere</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg max-w-4xl mx-auto">
            <div className="bg-surface p-8 rounded-[32px] border-2 border-surface-variant relative">
              <div className="text-4xl absolute -top-4 -left-2">⭐️</div>
              <p className="text-body-lg italic text-on-surface-variant mb-6 mt-2">"Finally, a game that teaches my kids about online safety in a way they actually understand and enjoy. Pebble is a lifesaver!"</p>
              <div className="font-bold text-primary">- Sarah M., Parent of 2</div>
            </div>
            <div className="bg-surface p-8 rounded-[32px] border-2 border-surface-variant relative mt-8 md:mt-0">
              <div className="text-4xl absolute -top-4 -left-2">⭐️</div>
              <p className="text-body-lg italic text-on-surface-variant mb-6 mt-2">"The scenarios are incredibly realistic but presented in such a safe, fun environment. My students love building their nests."</p>
              <div className="font-bold text-primary">- David L., 3rd Grade Teacher</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-baloo text-display-lg-mobile md:text-display-lg text-primary">Got Questions?</h2>
        </div>
        <div className="space-y-6">
          {[
            { q: 'Is it completely free?', a: 'Yes! Our core mission is to make digital literacy accessible to all children. The main adventure is completely free.' },
            { q: 'What age group is this for?', a: 'Pebble is designed primarily for kids ages 6-11, but the lessons are valuable for beginners of any age.' },
            { q: 'Is my childs data safe?', a: 'Absolutely. We collect zero personal information from children playing the game. Safety is our #1 priority.' }
          ].map((faq, i) => (
            <div key={i} className="bg-surface p-6 rounded-2xl border-2 border-surface-variant">
              <h3 className="font-bold text-headline-md text-primary mb-2 flex items-center gap-2">
                <span className="text-secondary">?</span> {faq.q}
              </h3>
              <p className="text-body-md text-on-surface-variant ml-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 px-margin-mobile text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-fixed opacity-30 blur-[100px]" />
        <div className="max-w-3xl mx-auto bg-surface-container rounded-[40px] p-xl border-2 border-white shadow-xl">
          <h2 className="font-baloo text-display-lg-mobile md:text-headline-lg text-primary mb-6">
            Ready for the adventure?
          </h2>
          <p className="text-body-lg text-on-surface-variant mb-10">
            Join thousands of adventurers and start your journey with Pebble.
          </p>
          <button
            onClick={onStart}
            className="tactile-btn bg-secondary-container text-on-secondary-container font-bold py-6 px-16 rounded-2xl hover:scale-105 active:scale-95 text-headline-md"
          >
            Start my Adventure!
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-dim pt-16 pb-32 md:pb-16 px-margin-mobile border-t-4 border-surface-variant">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="font-bold text-display-lg-mobile text-primary tracking-tighter mb-2 font-baloo">Pebble</div>
            <p className="text-on-surface-variant text-body-md max-w-sm">
              Making learning about digital information as fun as an ice adventure.
            </p>
          </div>
          <div className="flex gap-4">
             <a href="#" className="text-primary font-bold hover:text-secondary transition-colors">Privacy Policy</a>
             <a href="#" className="text-primary font-bold hover:text-secondary transition-colors">Terms of Service</a>
             <a href="#" className="text-primary font-bold hover:text-secondary transition-colors">Contact</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t-2 border-outline-variant/30 text-center text-on-surface-variant font-mono text-sm">
          © 2024 Pebble Education. All rights reserved. Built with ❤️ for kids everywhere.
        </div>
      </footer>
    </div>
  )
}
