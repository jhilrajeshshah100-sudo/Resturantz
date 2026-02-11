
import React, { useState } from 'react';
import { ChatMessage } from '../types';

interface ChatScreenProps {
  onBack: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'Jonathan', text: 'Anyone heading to the welcome drinks early?', avatar: 'https://picsum.photos/seed/j1/100/100', time: '2:15 PM', isMe: false },
    { id: '2', sender: 'Elena', text: 'I am! See you there in 15 mins?', avatar: 'https://picsum.photos/seed/j4/100/100', time: '2:16 PM', isMe: false },
    { id: '3', sender: 'Me', text: 'Count me in too!', avatar: 'https://picsum.photos/seed/me/100/100', time: '2:17 PM', isMe: true },
  ]);

  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'Me',
      text: inputText,
      avatar: 'https://picsum.photos/seed/me/100/100',
      time: 'Just now',
      isMe: true
    };
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="px-6 py-12 flex items-center gap-4 bg-background-light dark:bg-background-dark border-b border-gray-100 dark:border-navy-900/50">
        <button onClick={onBack} className="p-2 -ml-2">
          <span className="material-icons-round">arrow_back_ios_new</span>
        </button>
        <div>
          <h1 className="font-display text-2xl">Guest Lobby</h1>
          <p className="text-[10px] text-green-500 font-bold uppercase">12 active now</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
            {!msg.isMe && <img src={msg.avatar} alt={msg.sender} className="w-8 h-8 rounded-full" />}
            <div className={`max-w-[80%] ${msg.isMe ? 'items-end' : ''}`}>
              {!msg.isMe && <span className="text-[10px] text-gray-500 font-bold mb-1 block px-1">{msg.sender}</span>}
              <div className={`p-4 rounded-2xl text-sm ${
                msg.isMe 
                ? 'bg-primary text-white rounded-tr-none' 
                : 'bg-white dark:bg-navy-800 text-navy-900 dark:text-white rounded-tl-none shadow-sm'
              }`}>
                {msg.text}
              </div>
              <span className="text-[9px] text-gray-400 mt-1 block px-1">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-background-light dark:bg-background-dark border-t border-gray-100 dark:border-navy-900/50 flex gap-3 items-center">
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..." 
          className="flex-1 bg-white dark:bg-navy-800 border-none rounded-2xl py-4 px-6 shadow-sm focus:ring-primary/20"
        />
        <button 
          onClick={handleSend}
          className="bg-primary text-white p-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          <span className="material-icons-round">send</span>
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;
