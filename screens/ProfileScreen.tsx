
import React from 'react';

const ProfileScreen: React.FC = () => {
  return (
    <div className="px-6 py-12">
      <header className="flex flex-col items-center mb-12">
        <div className="relative mb-4">
          <img 
            src="https://picsum.photos/seed/me/200/200" 
            alt="My Profile" 
            className="w-32 h-32 rounded-full border-4 border-primary p-1 object-cover" 
          />
          <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg">
            <span className="material-icons-round text-sm">edit</span>
          </button>
        </div>
        <h1 className="font-display text-3xl">Alex Rivers</h1>
        <p className="text-gray-500 text-sm uppercase font-bold tracking-widest mt-1">Groom's Side • Guest</p>
      </header>

      <div className="space-y-4">
        <section className="bg-white dark:bg-navy-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-navy-900/50">
          <h3 className="font-bold text-xs uppercase text-gray-400 mb-4 tracking-widest">Your Union Agenda</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <span className="material-icons-round">restaurant</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold">Rehearsal Dinner</h4>
                <p className="text-[10px] text-gray-500">Friday, 7:00 PM • The Estate Kitchen</p>
              </div>
              <span className="material-icons-round text-gray-300">chevron_right</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <span className="material-icons-round">wine_bar</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold">Vineyard Tour</h4>
                <p className="text-[10px] text-gray-500">Friday, 2:00 PM • Main Gate</p>
              </div>
              <span className="material-icons-round text-gray-300">chevron_right</span>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-navy-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-navy-900/50">
          <h3 className="font-bold text-xs uppercase text-gray-400 mb-4 tracking-widest">Settings</h3>
          <ul className="space-y-4">
            <li className="flex justify-between items-center text-sm font-medium">
              <div className="flex items-center gap-3">
                <span className="material-icons-round text-gray-400">notifications</span>
                <span>Push Notifications</span>
              </div>
              <div className="w-10 h-5 bg-primary rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </li>
            <li className="flex justify-between items-center text-sm font-medium">
              <div className="flex items-center gap-3">
                <span className="material-icons-round text-gray-400">language</span>
                <span>Language</span>
              </div>
              <span className="text-xs text-gray-400">English (US)</span>
            </li>
            <li className="flex items-center gap-3 text-red-500 text-sm font-bold pt-2 cursor-pointer">
              <span className="material-icons-round">logout</span>
              <span>Leave the Union</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ProfileScreen;
