
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ConciergeScreenProps {
  onBack: () => void;
}

const ConciergeScreen: React.FC<ConciergeScreenProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Welcome to the Farm & Fork union. I'm your digital concierge. How can I assist with your stay, dining, or the wedding schedule today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...messages, { role: 'user', text: userMessage }].map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: "You are the 'Farm & Fork' wedding union concierge. The wedding is in a beautiful valley with vineyards. Key events: Rehearsal dinner at 'The Estate Kitchen' on Friday at 7 PM. Vineyard Tour Friday at 2 PM. Morning Hike Saturday 8 AM. The main ceremony is Saturday at 4 PM. Be elegant, warm, and helpful. Use emojis like 🥂, 💍, and 🌿 sparingly but effectively.",
        },
      });

      const aiText = response.text || "I'm sorry, I couldn't process that. How else can I help with the wedding?";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the union servers. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-navy-900 text-white">
      <header className="px-6 py-12 flex items-center justify-between border-b border-white/10 bg-navy-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2">
            <span className="material-icons-round">arrow_back_ios_new</span>
          </button>
          <div>
            <h1 className="font-display text-2xl text-primary">Union Concierge</h1>
            <p className="text-[10px] text-primary/60 font-bold uppercase tracking-widest">Powered by AI</p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 animate-pulse">
            <span className="material-icons-round text-primary">auto_awesome</span>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-3xl ${
              m.role === 'user' 
              ? 'bg-primary text-white rounded-tr-none' 
              : 'bg-navy-800 text-gray-100 rounded-tl-none border border-white/5 shadow-xl'
            }`}>
              <p className="text-sm leading-relaxed">{m.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-navy-800 p-4 rounded-2xl rounded-tl-none flex gap-1">
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-navy-900 border-t border-white/10">
        <div className="flex gap-3 items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about schedule, dress code..." 
            className="flex-1 bg-navy-800 border-none rounded-2xl py-4 px-6 shadow-inner focus:ring-primary/40 text-sm text-white placeholder-gray-500"
          />
          <button 
            disabled={isLoading}
            onClick={handleSend}
            className={`p-4 rounded-2xl shadow-lg transition-all active:scale-95 ${isLoading ? 'bg-gray-700 opacity-50' : 'bg-primary text-white'}`}
          >
            <span className="material-icons-round">{isLoading ? 'hourglass_top' : 'send'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConciergeScreen;
