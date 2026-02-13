
import React, { useState } from 'react';
import { Screen } from '../types';

interface GuestsScreenProps {
  onNavigate: (screen: Screen) => void;
}

const GuestsScreen: React.FC<GuestsScreenProps> = ({ onNavigate }) => {
  const categories = ['All', "Groom's Family", "Bride's Family", 'Friends'];
  const [activeCategory, setActiveCategory] = useState('All');

  const allGuests = [
    // Groom's Family (Shah Family - matching Jhil Shah)
    { id: 1, name: 'Vikram Shah', relation: "Groom's Father", category: "Groom's Family", avatar: 'https://picsum.photos/seed/v1/100/100', online: true },
    { id: 2, name: 'Meena Shah', relation: "Groom's Mother", category: "Groom's Family", avatar: 'https://picsum.photos/seed/m1/100/100', online: false },
    { id: 3, name: 'Rohan Shah', relation: 'Brother', category: "Groom's Family", avatar: 'https://picsum.photos/seed/r1/100/100', online: true },
    
    // Bride's Family (Patel Family)
    { id: 4, name: 'Rajesh Patel', relation: "Bride's Father", category: "Bride's Family", avatar: 'https://picsum.photos/seed/rp/100/100', online: true },
    { id: 5, name: 'Sunita Patel', relation: "Bride's Mother", category: "Bride's Family", avatar: 'https://picsum.photos/seed/sp/100/100', online: false },
    { id: 6, name: 'Ananya Patel', relation: "Bride's Sister", category: "Bride's Family", avatar: 'https://picsum.photos/seed/ap/100/100', online: true },
    
    // Friends
    { id: 7, name: 'Siddharth Malhotra', relation: 'Best Man', category: 'Friends', avatar: 'https://picsum.photos/seed/sm/100/100', online: true },
    { id: 8, name: 'Priya Sharma', relation: 'Maid of Honor', category: 'Friends', avatar: 'https://picsum.photos/seed/ps/100/100', online: false },
    { id: 9, name: 'Arjun Mehta', relation: 'College Friend', category: 'Friends', avatar: 'https://picsum.photos/seed/am/100/100', online: true },
    { id: 10, name: 'Ishita Kapoor', relation: 'School Friend', category: 'Friends', avatar: 'https://picsum.photos/seed/ik/100/100', online: false },
  ];

  const filteredGuests = activeCategory === 'All' 
    ? allGuests 
    : allGuests.filter(guest => guest.category === activeCategory);

  return (
    <div className="px-6 py-12 pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display text-4xl">The Guests</h1>
          <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">126 Confirmed RSVPs</p>
        </div>
        <button 
          onClick={() => onNavigate(Screen.CHAT)}
          className="bg-primary/10 p-3 rounded-2xl text-primary active:scale-90 transition-transform"
        >
          <span className="material-icons-round">chat_bubble</span>
        </button>
      </div>

      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 material-icons-round text-gray-400">search</span>
        <input 
          type="text" 
          placeholder="Search by name or relation..." 
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-navy-800 border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-gray-300 outline-none"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {categories.map((cat) => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-sm ${
              activeCategory === cat 
                ? 'bg-primary text-white scale-105 shadow-primary/20' 
                : 'bg-white dark:bg-navy-800 text-gray-400 hover:text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredGuests.length > 0 ? (
          filteredGuests.map((guest) => (
            <div key={guest.id} className="flex items-center justify-between bg-white dark:bg-navy-800 p-4 rounded-3xl shadow-sm border border-orange-50/50 dark:border-navy-900/50 group hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={guest.avatar} alt={guest.name} className="w-14 h-14 rounded-2xl object-cover group-hover:scale-105 transition-transform" />
                  {guest.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-navy-800 rounded-full shadow-sm"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-navy-900 dark:text-white">{guest.name}</h4>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{guest.relation}</p>
                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                    <p className="text-[10px] text-primary/70 font-bold uppercase">{guest.category.split("'")[0]}</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onNavigate(Screen.CHAT)}
                className="w-10 h-10 rounded-xl bg-navy-50 dark:bg-navy-900 flex items-center justify-center text-primary active:scale-90 transition-all hover:bg-primary/10"
              >
                <span className="material-icons-round text-sm">message</span>
              </button>
            </div>
          ))
        ) : (
          <div className="py-20 text-center">
            <span className="material-icons-round text-gray-200 text-6xl mb-4">search_off</span>
            <p className="text-gray-400 text-sm">No guests found in this section.</p>
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default GuestsScreen;
