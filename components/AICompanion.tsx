
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

interface AICompanionProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const SPARKS = [
  "What is the dress code?",
  "Rehearsal dinner time?",
  "Is there a shuttle?",
  "Tomorrow's weather?",
  "Gift registry info"
];

const AICompanion: React.FC<AICompanionProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm Evelyn, your Farm & Fork companion. Ask me anything about the wedding weekend! 🥂" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingText, isOpen]);

  const handleSend = async (textOverride?: string) => {
    const textToSubmit = textOverride || input;
    if (!textToSubmit.trim() || isLoading) return;

    const userText = textToSubmit.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);
    setStreamingText('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: [...messages, { role: 'user', text: userText }].map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: "You are Evelyn, an elegant and warm digital assistant for the 'Farm & Fork' wedding. The wedding is at a vineyard valley. Schedule: Vineyard Tour Friday 2PM, Rehearsal Dinner Friday 7PM at The Estate Kitchen, Morning Hike Saturday 8AM, Wedding Ceremony Saturday 4PM. Dress code is Vineyard Chic. Be concise, helpful, and use occasional emojis. Always act like a high-end concierge.",
          tools: [{ googleSearch: {} }]
        }
      });

      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk.text || '';
        setStreamingText(fullText);
      }

      setMessages(prev => [...prev, { role: 'model', text: fullText }]);
      setStreamingText('');
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having a small technical glitch. Let's try that again in a moment! ✨" }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      ></div>

      {/* Chat Container */}
      <div className="relative w-full max-w-md bg-[#16212B] rounded-t-[32px] shadow-2xl flex flex-col h-[75vh] pointer-events-auto border-t border-white/10 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#1A252F]/50 backdrop-blur-md rounded-t-[32px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="material-icons-round text-primary animate-pulse">auto_awesome</span>
            </div>
            <div>
              <h3 className="font-display text-lg text-primary">Companion Evelyn</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Active Assistant</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <span className="material-icons-round">close</span>
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl ${
                m.role === 'user' 
                ? 'bg-primary text-white rounded-tr-none' 
                : 'bg-white/5 text-gray-200 rounded-tl-none border border-white/10'
              }`}>
                <p className="text-sm leading-relaxed">{m.text}</p>
              </div>
            </div>
          ))}
          {streamingText && (
            <div className="flex justify-start">
              <div className="max-w-[85%] p-4 rounded-2xl rounded-tl-none bg-white/5 text-gray-200 border border-white/10">
                <p className="text-sm leading-relaxed">{streamingText}</p>
              </div>
            </div>
          )}
          {isLoading && !streamingText && (
            <div className="flex justify-start">
              <div className="bg-white/5 p-3 rounded-2xl flex gap-1">
                <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-[#16212B] border-t border-white/5">
          {/* Sparks */}
          {!isLoading && (
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
              {SPARKS.map((s, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSend(s)}
                  className="whitespace-nowrap px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[11px] font-medium text-gray-400 hover:text-primary hover:border-primary/50 transition-all active:scale-95"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-3 items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="How can I help you, guest?" 
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all outline-none"
            />
            <button 
              disabled={isLoading || !input.trim()}
              onClick={() => handleSend()}
              className={`p-4 rounded-2xl transition-all active:scale-90 ${
                isLoading || !input.trim() ? 'bg-gray-800 text-gray-500' : 'bg-primary text-white shadow-lg shadow-primary/20'
              }`}
            >
              <span className="material-icons-round">{isLoading ? 'hourglass_top' : 'send'}</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AICompanion;
