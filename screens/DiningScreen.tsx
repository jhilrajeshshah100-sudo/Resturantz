
import React from 'react';
import { DiningVenue } from '../types';

const DiningScreen: React.FC = () => {
  const venues: DiningVenue[] = [
    {
      id: '1',
      name: 'The Estate Kitchen',
      description: 'The venue for our Rehearsal Dinner. Offering fresh farm-to-table delicacies from the surrounding valley.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOb-BQnM0vfqASfil5cw-5nxsL1VkgakbIc0c5IoHHyzyNOuxLH-DMVAZNJNCmHeAwpZXvxsEbZSzp2jIfX8DAo8_vpT4ijjon9h6pFlB8AhV0vtgq0jJywheWzxrvfunq0JJVg2zvY3YyNwTkljubTf821o5QPy95_KqYDE28aWZlulVx71tIlziFA4s0mpKCVYXS0YcQZaR_ZQmc85YBMfrCzAnD5uu0BZK6Bm8XECu0L_HgAVvrmaY3KdvaHkbwMPN8dBp_AVI',
      rating: '4.9',
      type: 'Fine Dining',
      menu: ['Roasted Beet Salad', 'Braised Short Ribs', 'Lemon Posset']
    },
    {
      id: '2',
      name: 'Vineyard Terrace',
      description: 'Enjoy casual brunch with a view of the sprawling vineyards.',
      image: 'https://picsum.photos/seed/terrace/800/600',
      rating: '4.7',
      type: 'Casual Dining'
    }
  ];

  return (
    <div className="px-6 py-12">
      <h1 className="font-display text-4xl mb-8">Curated Dining</h1>
      
      <div className="space-y-8">
        {venues.map((venue) => (
          <div key={venue.id} className="bg-white dark:bg-navy-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-navy-900/50">
            <img src={venue.image} alt={venue.name} className="w-full h-48 object-cover" />
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-display text-2xl">{venue.name}</h3>
                <div className="flex items-center gap-1 text-primary">
                  <span className="material-icons-round text-sm">star</span>
                  <span className="font-bold text-sm">{venue.rating}</span>
                </div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                {venue.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{venue.type}</span>
                <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Table Available</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="bg-primary text-white py-3 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-transform">
                  Book Table
                </button>
                <button className="bg-navy-50 dark:bg-navy-900 text-navy-900 dark:text-white py-3 rounded-xl font-bold text-sm active:scale-95 transition-transform">
                  View Menu
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
