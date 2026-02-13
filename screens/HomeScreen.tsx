
import React from 'react';
import { Screen } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  return (
    <div className="px-6">
      {/* Logo Header */}
      <header className="pt-12 pb-6 flex justify-center">
        <div className="w-32 h-32 relative">
          <img 
            alt="Farm & Fork Logo" 
            className="w-full h-full object-contain" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW60OEzm9qSNS_WCEz4vJbQlWpoAs3YeFLu_qvmkJtNTOz4mmUIu1F6BHAT7wAwvk5zUYa6AYAplXZJffSH4uSy_bVV8_bqEzTQ9khj6VCrPMsQ9lGC1PiLRZDupl9xAYRdDxBVbCXbCcQKn7LmZq4O4wtOkz-qLz8TDQa_jJcjqBwaNvZk95rT4Gly4Rzap9Mo6nrvW6QP8XJDMwI_KyljXxU8mPPWwVNYpFv1Ad3Ag580Cb03OpWTbgPDYFT4WhvtNurYiBPrrI"
          />
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative mb-12">
        <div className="relative h-[440px] rounded-3xl overflow-hidden shadow-2xl">
          <img 
            alt="Farm and Fork Culinary Experience" 
            className="absolute inset-0 w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1974"
          />
          <div className="absolute inset-0 hero-gradient flex flex-col justify-end p-8 text-white">
            <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2">Welcome to the Union</span>
            <h1 className="font-display text-4xl leading-tight mb-4">Celebrate Love, <br/>Curate Memories.</h1>
            <p className="text-gray-200 text-sm mb-6 max-w-xs leading-relaxed opacity-90">
              Join your fellow guests to plan dinners, coordinate activities, and connect before the big day.
            </p>
            <button 
              onClick={() => onNavigate(Screen.CONCIERGE)}
              className="bg-primary hover:bg-opacity-90 transition-all text-white py-4 px-8 rounded-full font-semibold text-sm shadow-lg flex items-center justify-center gap-2 group active:scale-95"
            >
              Ask AI Assistant
              <span className="material-icons-round text-lg group-hover:translate-x-1 transition-transform">auto_awesome</span>
            </button>
          </div>
        </div>
      </section>

      {/* Wedding Dining Section */}
      <section className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <h2 className="font-display text-2xl">Wedding Dining</h2>
          <button onClick={() => onNavigate(Screen.DINING)} className="text-primary text-sm font-medium">View All</button>
        </div>
        <div 
          onClick={() => onNavigate(Screen.DINING)}
          className="bg-white dark:bg-navy-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-navy-900/50 flex gap-4 cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
            <img 
              alt="Fine Dining" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOb-BQnM0vfqASfil5cw-5nxsL1VkgakbIc0c5IoHHyzyNOuxLH-DMVAZNJNCmHeAwpZXvxsEbZSzp2jIfX8DAo8_vpT4ijjon9h6pFlB8AhV0vtgq0jJywheWzxrvfunq0JJVg2zvY3YyNwTkljubTf821o5QPy95_KqYDE28aWZlulVx71tIlziFA4s0mpKCVYXS0YcQZaR_ZQmc85YBMfrCzAnD5uu0BZK6Bm8XECu0L_HgAVvrmaY3KdvaHkbwMPN8dBp_AVI"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="font-semibold text-lg">The Estate Kitchen</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Farm-to-table excellence for the rehearsal dinner.</p>
            <div className="flex items-center gap-1 text-primary">
              <span className="material-icons-round text-sm">stars</span>
              <span className="text-xs font-bold uppercase tracking-wider">TOP RATED</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Activities Section */}
      <section className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <h2 className="font-display text-2xl">Social Activities</h2>
          <span className="text-primary text-sm font-medium">Full Schedule</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-navy-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-navy-900/50">
            <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-3">
              <span className="material-icons-round text-primary">wine_bar</span>
            </div>
            <h3 className="font-semibold text-sm mb-1">Vineyard Tour</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Friday, 2:00 PM</p>
          </div>
          <div className="bg-white dark:bg-navy-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-navy-900/50">
            <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-3">
              <span className="material-icons-round text-primary">hiking</span>
            </div>
            <h3 className="font-semibold text-sm mb-1">Morning Hike</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Saturday, 8:00 AM</p>
          </div>
        </div>
      </section>

      {/* Guest Community Preview */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <h2 className="font-display text-2xl">Guest Community</h2>
          <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-[10px] font-bold uppercase">12 Online</span>
        </div>
        <div className="bg-primary rounded-2xl p-6 text-white shadow-xl shadow-primary/20">
          <div className="flex -space-x-3 mb-4">
            <img alt="Guest" className="w-10 h-10 rounded-full border-2 border-primary object-cover" src="https://picsum.photos/seed/guest1/100/100"/>
            <img alt="Guest" className="w-10 h-10 rounded-full border-2 border-primary object-cover" src="https://picsum.photos/seed/guest2/100/100"/>
            <img alt="Guest" className="w-10 h-10 rounded-full border-2 border-primary object-cover" src="https://picsum.photos/seed/guest3/100/100"/>
            <div className="w-10 h-10 rounded-full border-2 border-primary bg-navy-900 flex items-center justify-center text-[10px] font-bold">+42</div>
          </div>
          <h3 className="text-lg font-semibold mb-1">Meet the Guests</h3>
          <p className="text-white/80 text-sm mb-4 italic">"Anyone heading to the welcome drinks early?"</p>
          <button 
            onClick={() => onNavigate(Screen.CHAT)}
            className="w-full bg-white text-navy-900 py-3 rounded-xl font-bold text-sm active:bg-gray-100 transition-colors"
          >
            Open Chat
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
