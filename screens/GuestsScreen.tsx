
import React from 'react';
import { Screen } from '../types';

interface GuestsScreenProps {
  onNavigate: (screen: Screen) => void;
}

const GuestsScreen: React.FC<GuestsScreenProps> = ({ onNavigate }) => {
  const categories = ['All', 'Groom\'s Family', 'Bride\'s Family', 'Friends'];
  const guests = [
    { id: 1, name: 'Jonathan Thorne', relation: 'Best Man', avatar: 'https://picsum.photos/seed/j1/100/100', online: true },
    { id: 2, name: 'Isabella Ross', relation: 'Maid of Honor', avatar: 'https://picsum.photos/seed/j2/100/100', online: false },
    { id: 3, name: 'Marcus Chen', relation: 'College Friend', avatar: 'https://picsum.photos/seed/j3/100/100', online: true },
    { id: 4, name: 'Elena Varga', relation: 'Bride\'s Sister', avatar: 'https://picsum.photos/seed/j4/100/100', online: false },
    { id: 5, name: 'David Smith', relation: 'Cousin', avatar: 'https://picsum.photos/seed/j5/100/100', online: true },
  ];

  return (
    <div className="px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-4xl">The Guests</h1>
        <button 
          onClick={() => onNavigate(Screen.CHAT)}
          className="bg-primary/10 p-3 rounded-full text-primary"
        >
          <span className="material-icons-round">chat_bubble</span>
        </button>
      </div>

      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-icons-round text-gray-400">search</span>
        <input 
          type="text" 
          placeholder="Find a guest..." 
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-navy-800 border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 text-sm"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        {categories.map((cat, idx) => (
          <button 
            key={cat} 
            className={`whitespace-nowrap px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
              idx === 0 ? 'bg-primary text-white' : 'bg-white dark:bg-navy-800 text-gray-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {guests.map((guest) => (
          <div key={guest.id} className="flex items-center justify-between bg-white dark:bg-navy-800 p-4 rounded-2xl shadow-sm border border-gray-50 dark:border-navy-900/50">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={guest.avatar} alt={guest.name} className="w-12 h-12 rounded-full object-cover" />
                {guest.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
              </div>
              <div>
                <h4 className="font-bold text-sm">{guest.name}</h4>
                <p className="text-xs text-gray-500">{guest.relation}</p>
              </div>
            </div>
            <button className="text-primary p-2">
              <span className="material-icons-round">message</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuestsScreen;
