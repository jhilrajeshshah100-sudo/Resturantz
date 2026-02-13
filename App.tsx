
import React, { useState } from 'react';
import { Screen } from './types';
import HomeScreen from './screens/HomeScreen';
import DiningScreen from './screens/DiningScreen';
import GuestsScreen from './screens/GuestsScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChatScreen from './screens/ChatScreen';
import ConciergeScreen from './screens/ConciergeScreen';
import Navigation from './components/Navigation';
import AICompanion from './components/AICompanion';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.HOME);
  const [isAICompanionOpen, setIsAICompanionOpen] = useState(false);

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

      {/* Floating Navigation (hidden on Concierge screen for focus) */}
      {currentScreen !== Screen.CONCIERGE && (
        <Navigation 
          currentScreen={currentScreen} 
          onNavigate={setCurrentScreen} 
          onToggleAI={() => setIsAICompanionOpen(true)}
        />
      )}

      {/* Global AI Chatbot Overlay */}
      <AICompanion 
        isOpen={isAICompanionOpen} 
        onClose={() => setIsAICompanionOpen(false)} 
      />
    </div>
  );
};

export default App;
