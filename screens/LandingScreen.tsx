
import React from 'react';

interface LandingScreenProps {
  onEnter: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onEnter }) => {
  return (
    <div className="bg-navy-900 min-h-screen text-white selection:bg-primary/30">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&q=80&w=2070" 
            alt="Vineyard" 
            className="w-full h-full object-cover opacity-50 scale-110 animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900/60 via-transparent to-navy-900"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-2xl animate-fade-in">
          <span className="text-primary font-bold tracking-map uppercase text-[10px] mb-4 block">You are cordially invited</span>
          <h1 className="font-display text-6xl md:text-7xl mb-6 leading-tight">Farm and Fork</h1>
          <p className="text-xl font-light tracking-wide text-gray-300 mb-12 uppercase tracking-[0.5em]">Welcome</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                const el = document.getElementById('details');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              The Details
            </button>
            <button 
              onClick={onEnter}
              className="px-8 py-4 bg-primary text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all"
            >
              Enter the Union
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <span className="material-icons-round">keyboard_arrow_down</span>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="details" className="py-24 px-8 max-w-md mx-auto text-center border-b border-white/5">
        <div className="mb-12">
          <h2 className="font-display text-4xl mb-4">Our Story</h2>
          <div className="w-12 h-0.5 bg-primary mx-auto mb-8"></div>
          <p className="text-gray-400 leading-relaxed font-light italic">
            "It started with a chance meeting in a small bistro in Florence, and it continues this fall in the heart of Napa Valley. We can't wait to share our most special day with the people who mean the most to us."
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <img src="https://picsum.photos/seed/love1/400/500" className="rounded-2xl grayscale hover:grayscale-0 transition-all duration-700 aspect-[3/4] object-cover" alt="Couple 1" />
          <img src="https://picsum.photos/seed/love2/400/500" className="rounded-2xl grayscale hover:grayscale-0 transition-all duration-700 aspect-[3/4] object-cover translate-y-8" alt="Couple 2" />
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-24 px-8">
        <h2 className="font-display text-4xl text-center mb-16">The Weekend</h2>
        <div className="space-y-12">
          <div className="flex gap-6 group">
            <div className="text-primary font-display text-2xl pt-1">12</div>
            <div className="flex-1 border-l border-white/10 pl-6 pb-8">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Friday, Oct 12</p>
              <h3 className="text-lg font-bold mb-2">Welcome Vineyard Tour</h3>
              <p className="text-sm text-gray-400">Join us for a private tour of the Estate’s oldest vines followed by a sunset tasting.</p>
            </div>
          </div>
          <div className="flex gap-6 group">
            <div className="text-primary font-display text-2xl pt-1">13</div>
            <div className="flex-1 border-l border-white/10 pl-6 pb-8">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Saturday, Oct 13</p>
              <h3 className="text-lg font-bold mb-2">The Main Event</h3>
              <p className="text-sm text-gray-400">Ceremony at The Glass Chapel, followed by dinner and dancing under the stars.</p>
            </div>
          </div>
          <div className="flex gap-6 group">
            <div className="text-primary font-display text-2xl pt-1">14</div>
            <div className="flex-1 border-l border-white/10 pl-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Sunday, Oct 14</p>
              <h3 className="text-lg font-bold mb-2">Farewell Brunch</h3>
              <p className="text-sm text-gray-400">One last toast at The Terrace Kitchen before the journey home.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-white/5">
        <h2 className="font-display text-4xl text-center mb-12">The Venue</h2>
        <div className="flex overflow-x-auto gap-4 px-8 no-scrollbar snap-x">
          <div className="snap-center shrink-0 w-64 h-80 rounded-3xl overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Venue 1" />
          </div>
          <div className="snap-center shrink-0 w-64 h-80 rounded-3xl overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1505944357431-4206e1395643?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Venue 2" />
          </div>
          <div className="snap-center shrink-0 w-64 h-80 rounded-3xl overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Venue 3" />
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 px-8 text-center bg-primary">
        <h2 className="font-display text-4xl text-white mb-6">Ready to join us?</h2>
        <p className="text-white/80 text-sm mb-10 max-w-xs mx-auto">Access the exclusive guest portal to manage your schedule, connect with others, and chat with Evelyn.</p>
        <button 
          onClick={onEnter}
          className="w-full bg-navy-900 text-white py-5 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
        >
          Enter the Union
        </button>
      </section>

      <style>{`
        @keyframes ken-burns {
          0% { transform: scale(1); }
          100% { transform: scale(1.2) translate(-2%, -2%); }
        }
        .animate-ken-burns { animation: ken-burns 30s infinite alternate linear; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-fade-in { animation: fadeIn 1.5s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default LandingScreen;
