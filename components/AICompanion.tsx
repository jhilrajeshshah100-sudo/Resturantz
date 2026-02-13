
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

interface AICompanionProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
  sources?: { uri: string; title: string }[];
}

const SPARKS = [
  "What's the dress code?",
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  const handleOpenKeySelector = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
    }
  };

  const handleSend = async (textOverride?: string) => {
    const textToSubmit = textOverride || input;
    if (!textToSubmit.trim() || isLoading) return;

    const userText = textToSubmit.trim();
    const currentMessages: Message[] = [...messages, { role: 'user', text: userText }];
    setMessages(currentMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Create fresh instance to ensure we use the latest injected API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      // Filter history: Must start with 'user' and roles must alternate
      const apiHistory = currentMessages
        .filter((m, i) => !(i === 0 && m.role === 'model'))
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: apiHistory,
        config: {
          systemInstruction: `You are Evelyn, the elegant and highly-personalized concierge for the 'Farm & Fork' wedding. 
          WEDDING DETAILS:
          - Venue: The Vineyard Valley Estate.
          - Dress Code: 'Vineyard Chic' (Think elegant summer fabrics, block heels for grass, light suits).
          - Friday: Vineyard Tour @ 2PM, Rehearsal Dinner @ 7PM (The Estate Kitchen).
          - Saturday: Morning Hike @ 8AM, Wedding Ceremony @ 4PM, Reception follows.
          - Logistics: Shuttles run every 30 mins from The Valley Inn.
          - Registry: Online at 'The Union Registry'.
          BEHAVIOR:
          - Be warm, sophisticated, and concise. 
          - Use emojis like 🥂, ✨, 🍷 sparingly.
          - If asked about weather or local events, use the googleSearch tool.`,
          tools: [{ googleSearch: {} }]
        }
      });

      const responseText = response.text || "I'm sorry, I couldn't formulate a response. Please try again.";
      const sources: { uri: string; title: string }[] = [];
      
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach((chunk: any) => {
          if (chunk.web) sources.push({ uri: chunk.web.uri, title: chunk.web.title || chunk.web.uri });
        });
      }

      setMessages(prev => [...prev, { role: 'model', text: responseText, sources }]);
    } catch (error: any) {
      console.error("AI Concierge Error:", error);
      
      // If the error suggests an API key issue, prompt the user to fix it
      if (error.message?.includes("API_KEY_INVALID") || error.message?.includes("Requested entity was not found")) {
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: "I'm having trouble connecting to my brain! Please select a valid API Key to continue assisting you. ✨" 
        }]);
        handleOpenKeySelector();
      } else {
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: "Oh dear, a small technical hiccup. Could you try asking me that again? 🍷" 
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-[#16212B] rounded-t-[32px] shadow-2xl flex flex-col h-[80vh] pointer-events-auto border-t border-white/10 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-[#1A252F]/50 backdrop-blur-md rounded-t-[32px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="material-icons-round text-primary animate-pulse">auto_awesome</span>
            </div>
            <div>
              <h3 className="font-display text-lg text-primary">Companion Evelyn</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Digital Concierge</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <span className="material-icons-round">close</span>
          </button>
        </div>

        {/* Chat Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl ${
                m.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white/5 text-gray-200 rounded-tl-none border border-white/10 shadow-sm'
              }`}>
                <p className="text-sm leading-relaxed">{m.text}</p>
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                    <p className="text-[9px] uppercase font-black text-gray-500 tracking-tighter">Verified References</p>
                    <div className="flex flex-wrap gap-2">
                      {m.sources.map((s, idx) => (
                        <a key={idx} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-md hover:bg-primary/20 transition-colors inline-block max-w-full truncate">
                          {s.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-[10px] text-gray-500 font-bold uppercase ml-2 tracking-widest">Consulting the Registry...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-[#16212B] border-t border-white/5">
          {!isLoading && (
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
              {SPARKS.map((s, idx) => (
                <button key={idx} onClick={() => handleSend(s)} className="whitespace-nowrap px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[11px] font-medium text-gray-400 hover:text-primary hover:border-primary/40 transition-all active:scale-95">
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
              placeholder="Ask Evelyn anything..." 
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:ring-1 focus:ring-primary/40 outline-none transition-all placeholder:text-gray-600"
            />
            <button 
              disabled={isLoading || !input.trim()} 
              onClick={() => handleSend()} 
              className={`p-4 rounded-2xl transition-all active:scale-90 shadow-xl ${
                isLoading || !input.trim() ? 'bg-gray-800 text-gray-500' : 'bg-primary text-white shadow-primary/20'
              }`}
            >
              <span className="material-icons-round">{isLoading ? 'hourglass_empty' : 'send'}</span>
            </button>
          </div>
          <div className="mt-4 flex justify-center">
             <button onClick={handleOpenKeySelector} className="text-[9px] text-gray-600 hover:text-primary uppercase tracking-[0.2em] font-black transition-colors">
               Connection Settings
             </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AICompanion;
