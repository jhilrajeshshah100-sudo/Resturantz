
import React from 'react';
import { Screen } from '../types';

interface NavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onToggleAI: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentScreen, onNavigate, onToggleAI }) => {
  const NavItem: React.FC<{ screen: Screen; icon: string; label: string }> = ({ screen, icon, label }) => {
    const isActive = currentScreen === screen;
    return (
      <button
        onClick={() => onNavigate(screen)}
        className={`flex flex-col items-center gap-1 transition-colors ${
          isActive ? 'text-primary' : 'text-gray-400'
        }`}
      >
        <span className="material-icons-round">{icon}</span>
        <span className="text-[10px] font-medium">{label}</span>
      </button>
    );
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 glass-nav border-t border-white/10 px-6 pb-8 pt-4 flex justify-between items-center z-40 max-w-md mx-auto rounded-t-[32px]">
        <NavItem screen={Screen.HOME} icon="home" label="Home" />
        <NavItem screen={Screen.DINING} icon="restaurant" label="Dining" />
        
        <div className="relative -top-10">
          <button 
            onClick={onToggleAI}
            className="bg-primary text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center border-4 border-[#16212B] active:scale-95 transition-all hover:shadow-primary/40 group"
          >
            <span className="material-icons-round text-2xl group-hover:rotate-12 transition-transform">auto_awesome</span>
          </button>
        </div>

        <NavItem screen={Screen.GUESTS} icon="groups" label="Guests" />
        <NavItem screen={Screen.PROFILE} icon="person" label="Profile" />
      </nav>
      {/* iOS indicator bar placeholder */}
      <div className="fixed bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full pointer-events-none z-50 max-w-md"></div>
    </>
  );
};

export default Navigation;
