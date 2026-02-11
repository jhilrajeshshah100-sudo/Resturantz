
import React, { useState } from 'react';
import { Screen } from './types';
import HomeScreen from './screens/HomeScreen';
import DiningScreen from './screens/DiningScreen';
import GuestsScreen from './screens/GuestsScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChatScreen from './screens/ChatScreen';
import ConciergeScreen from './screens/ConciergeScreen';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.HOME);

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.HOME:
        return <HomeScreen onNavigate={setCurrentScreen} />;
      case Screen.DINING:
        return <DiningScreen />;
      case Screen.GUESTS:
        return <GuestsScreen onNavigate={setCurrentScreen} />;
      case Screen.PROFILE:
        return <ProfileScreen />;
      case Screen.CHAT:
        return <ChatScreen onBack={() => setCurrentScreen(Screen.HOME)} />;
      case Screen.CONCIERGE:
        return <ConciergeScreen onBack={() => setCurrentScreen(Screen.HOME)} />;
      default:
        return <HomeScreen onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-navy-900 dark:text-white transition-colors duration-300">
      {/* Dynamic Screen Content */}
      <div className="max-w-md mx-auto relative min-h-screen pb-24">
        {renderScreen()}
      </div>

      {/* Floating Navigation */}
      <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />
    </div>
  );
};

export default App;
