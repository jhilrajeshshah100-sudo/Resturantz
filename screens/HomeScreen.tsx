
import React from 'react';
import { Screen } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#FFFDF5] dark:bg-navy-900 transition-colors duration-500 pb-32">
      {/* Top Branding & Header */}
      <div className="px-6 pt-12 pb-6 flex flex-col items-center animate-fade-in">
        {/* Shield Emblem Monogram */}
        <div className="mb-6 relative group">
          <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <img 
            src="https://i.ibb.co/7JM7wRgG/Farm-Fork-Variant-4-Shield-Emblem-1.png" 
            alt="Farm & Fork Emblem" 
            className="w-20 h-20 object-contain relative z-10 drop-shadow-lg"
          />
        </div>

        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src="https://picsum.photos/seed/me/100/100" 
                alt="Jhil" 
                className="w-14 h-14 rounded-2xl object-cover border-2 border-primary/20 p-0.5"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#FFFDF5] rounded-full"></div>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-0.5">Welcome Back</h4>
              <h2 className="font-display text-2xl text-navy-900 dark:text-white">Namaste, Jhil</h2>
              <p className="text-[9px] text-primary font-bold uppercase tracking-widest mt-0.5">Groom's Family Member</p>
            </div>
          </div>
          <button className="w-12 h-12 bg-white dark:bg-navy-800 rounded-2xl shadow-sm border border-orange-50 dark:border-navy-900/50 flex items-center justify-center text-navy-900 dark:text-white">
            <span className="material-icons-round">notifications_none</span>
          </button>
        </div>
      </div>

      {/* Hero Experience Card - Indian Wedding Themed */}
      <section className="px-6 mb-8">
        <div className="relative h-[440px] rounded-[40px] overflow-hidden shadow-2xl shadow-orange-500/10 group">
          <img 
            alt="Indian Wedding Mandap" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" 
            src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1974"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full">Coming Up Next</span>
              <span className="text-white/80 text-[10px] font-bold">The Royal Courtyard</span>
            </div>
            <h1 className="font-display text-4xl leading-tight mb-4 text-orange-200">The Sangeet <br/>& Mehendi Gala</h1>
            <p className="text-white/70 text-sm mb-8 max-w-xs leading-relaxed font-medium">
              Join us for an evening of music, dance, and henna as we celebrate the union of two hearts.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => onNavigate(Screen.CONCIERGE)}
                className="flex-1 bg-white text-navy-900 py-4 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                Event Map
                <span className="material-icons-round text-sm">near_me</span>
              </button>
              <button className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all">
                <span className="material-icons-round">camera_alt</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Family Quick Links */}
      <section className="px-6 mb-10">
        <div className="grid grid-cols-2 gap-4">
          <div 
            onClick={() => onNavigate(Screen.GUESTS)}
            className="bg-orange-50 dark:bg-navy-800 p-6 rounded-[32px] border border-orange-100 dark:border-navy-900/50 cursor-pointer active:scale-95 transition-all group"
          >
            <div className="w-10 h-10 bg-orange-200 rounded-xl flex items-center justify-center text-orange-600 mb-4 group-hover:rotate-6 transition-transform">
              <span className="material-icons-round">groups</span>
            </div>
            <h3 className="font-display text-lg text-navy-900 dark:text-white">Groom's Family</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Shah Parivaar</p>
          </div>
          <div 
            onClick={() => onNavigate(Screen.GUESTS)}
            className="bg-red-50 dark:bg-navy-800 p-6 rounded-[32px] border border-red-100 dark:border-navy-900/50 cursor-pointer active:scale-95 transition-all group"
          >
            <div className="w-10 h-10 bg-red-200 rounded-xl flex items-center justify-center text-red-600 mb-4 group-hover:rotate-6 transition-transform">
              <span className="material-icons-round">favorite</span>
            </div>
            <h3 className="font-display text-lg text-navy-900 dark:text-white">Bride's Family</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Patel Parivaar</p>
          </div>
        </div>
      </section>

      {/* Weekend Live Timeline - Traditional Events */}
      <section className="px-6 mb-10">
        <div className="flex justify-between items-end mb-6">
          <h2 className="font-display text-3xl text-navy-900 dark:text-white">Wedding Live</h2>
          <span className="text-primary font-bold text-xs uppercase tracking-widest pb-1 border-b-2 border-primary/10">Full Itinerary</span>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white dark:bg-navy-800 p-6 rounded-[32px] border border-orange-100/50 flex gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
            <div className="flex flex-col items-center gap-1 border-r border-gray-100 pr-6">
              <span className="text-2xl font-display text-primary">04</span>
              <span className="text-[9px] font-black uppercase text-gray-400">PM</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-navy-900 dark:text-white">Mehendi & High Tea</h3>
                <span className="material-icons-round text-primary text-sm">brush</span>
              </div>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">Traditional henna artistry with seasonal snacks.</p>
              <div className="mt-3 flex items-center gap-2">
                 <span className="px-2 py-0.5 bg-green-50 rounded-md text-[8px] font-black text-green-600 uppercase">Dress: Floral Ethnic</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-navy-800 p-6 rounded-[32px] border border-orange-100/50 flex gap-6 relative overflow-hidden group">
            <div className="flex flex-col items-center gap-1 border-r border-gray-100 pr-6">
              <span className="text-2xl font-display text-primary">08</span>
              <span className="text-[9px] font-black uppercase text-gray-400">PM</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-navy-900 dark:text-white">The Sangeet Night</h3>
                <span className="material-icons-round text-primary text-sm">music_note</span>
              </div>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">Prepare your moves! A night of music and family performances.</p>
              <div className="mt-3 flex items-center gap-2">
                 <span className="px-2 py-0.5 bg-blue-50 rounded-md text-[8px] font-black text-blue-600 uppercase">Dress: Royal Glitter</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gastronomy Card - Updated for Indian theme */}
      <section className="px-6 mb-10">
        <div className="bg-white dark:bg-navy-800 rounded-[40px] p-2 shadow-xl border border-orange-50">
          <div 
            onClick={() => onNavigate(Screen.DINING)}
            className="relative h-48 rounded-[36px] overflow-hidden cursor-pointer"
          >
            <img 
              alt="Indian Cuisine" 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
               <span className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest border border-white/30">View Menus</span>
            </div>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-display text-2xl text-navy-900 dark:text-white">The Flavours of India</h3>
                <p className="text-xs text-gray-500 mt-1">From Royal Thalis to Courtyard Chaats.</p>
              </div>
              <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center text-primary">
                <span className="material-icons-round">restaurant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lobby Teaser */}
      <section className="px-6 mb-12">
        <div className="bg-primary rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-primary/30 group cursor-pointer" onClick={() => onNavigate(Screen.CHAT)}>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-700"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex -space-x-3">
                <img className="w-10 h-10 rounded-full border-2 border-primary object-cover" src="https://picsum.photos/seed/u1/100/100" alt="u1" />
                <img className="w-10 h-10 rounded-full border-2 border-primary object-cover" src="https://picsum.photos/seed/u2/100/100" alt="u2" />
                <img className="w-10 h-10 rounded-full border-2 border-primary object-cover" src="https://picsum.photos/seed/u3/100/100" alt="u3" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80">42 Guests Online</span>
            </div>
            <h3 className="font-display text-3xl mb-2">Guest Lobby</h3>
            <p className="text-white/70 text-sm mb-8 leading-relaxed italic">"Has everyone seen the stage decor? It's breathtaking!"</p>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              Join Conversation <span className="material-icons-round text-sm">arrow_forward</span>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default HomeScreen;
