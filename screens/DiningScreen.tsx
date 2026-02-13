
import React from 'react';
import { DiningVenue } from '../types';

const DiningScreen: React.FC = () => {
  const venues: DiningVenue[] = [
    {
      id: '1',
      name: 'The Grand Darbar',
      description: 'Our flagship venue for the Sangeet and Reception. A royal culinary journey through the eras of the Maharajas, featuring slow-cooked delicacies and rare spice blends.',
      image: 'https://images.unsplash.com/photo-1585937421612-70a0f295561a?auto=format&fit=crop&q=80&w=800',
      rating: '4.9',
      type: 'Royal Fine Dining',
      menu: ['Dal Makhani Risotto', 'Smoked Galouti Kebab', 'Saffron Pulao', 'Truffle Naan']
    },
    {
      id: '2',
      name: 'Spice Courtyard',
      description: 'An vibrant open-air space celebrating India’s street food heritage. Live Chaat counters, Tandoors, and the sound of sizzling pans under the starlight.',
      image: 'https://images.unsplash.com/photo-1601050690597-df056fb01793?auto=format&fit=crop&q=80&w=800',
      rating: '4.8',
      type: 'Casual Street Food',
      menu: ['Pani Puri Shots', 'Amritsari Kulcha', 'Pav Bhaji Sliders', 'Masala Chai']
    },
    {
      id: '3',
      name: 'The Royal Patisserie',
      description: 'A botanical conservatory serving delicate fusion sweets and premium Indian coffee roasts. Perfect for a mid-day sugar rush or evening tea.',
      image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&q=80&w=800',
      rating: '4.7',
      type: 'Dessert & Chai Bar',
      menu: ['Rose Petal Kulfi', 'Motichoor Cheesecake', 'Filter Coffee', 'Jalebi with Rabri']
    },
    {
      id: '4',
      name: 'Saffron Lounge',
      description: 'An intimate, dimly lit sanctuary for bespoke cocktails infused with Indian botanicals and premium spirits.',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
      rating: '5.0',
      type: 'Bespoke Bar',
      menu: ['Tamarind Margarita', 'Cardamom Old Fashioned', 'Artisanal Bitters']
    }
  ];

  return (
    <div className="px-6 py-12 pb-32">
      <div className="mb-10">
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">The Gastronomy</h4>
        <h1 className="font-display text-4xl text-navy-900 dark:text-white leading-tight">Vibrant Indian <br/>Flavours</h1>
        <p className="text-gray-400 text-xs mt-3 max-w-[280px]">Curated menus for the Shah & Patel Union, celebrating the best of regional Indian cuisine.</p>
      </div>
      
      <div className="space-y-10">
        {venues.map((venue) => (
          <div key={venue.id} className="bg-white dark:bg-navy-800 rounded-[40px] overflow-hidden shadow-2xl shadow-orange-500/5 border border-orange-50 dark:border-navy-900/50 transition-all hover:shadow-orange-500/10">
            <div className="relative">
              <img src={venue.image} alt={venue.name} className="w-full h-64 object-cover" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-xl">
                <span className="material-icons-round text-primary text-sm">stars</span>
                <span className="font-bold text-xs text-navy-900">{venue.rating}</span>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-orange-100 dark:border-orange-900/50">{venue.type}</span>
              </div>

              <h3 className="font-display text-2xl text-navy-900 dark:text-white mb-3">{venue.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed font-medium">
                {venue.description}
              </p>
              
              {venue.menu && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="h-0.5 w-6 bg-primary/30"></span>
                    <h4 className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em]">Chef's Specials</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {venue.menu.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full"></span>
                        <span className="text-xs text-navy-800 dark:text-gray-200 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <button className="bg-primary hover:bg-navy-900 transition-colors text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95">
                  Book Table
                </button>
                <button className="bg-orange-50 dark:bg-navy-900 text-orange-600 dark:text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest active:scale-95 transition-transform border border-orange-100 dark:border-white/5">
                  Menu
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiningScreen;
