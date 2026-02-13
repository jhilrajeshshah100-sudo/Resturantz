
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

  const handleOpenKeySelector = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
    }
  };

  const handleSend = async (textOverride?: string) => {
    const textToSubmit = textOverride || input;
    if (!textToSubmit.trim() || isLoading) return;

    const userText = textToSubmit.trim();
    const currentMessages = [...messages, { role: 'user' as const, text: userText }];
    setMessages(currentMessages);
    setInput('');
    setIsLoading(true);
    setStreamingText('');

    try {
      // Create a fresh instance to ensure we use the most up-to-date key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      // CRITICAL: Gemini history must start with 'user' and roles must alternate.
      // We strip the initial greeting from the context sent to the API.
      const apiHistory = currentMessages
        .filter((m, i) => !(i === 0 && m.role === 'model'))
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: apiHistory,
        config: {
          systemInstruction: "You are Evelyn, an elegant digital assistant for the 'Farm & Fork' wedding. Schedule: Vineyard Tour Fri 2PM, Rehearsal Dinner Fri 7PM, Hike Sat 8AM, Wedding Sat 4PM. Dress code: Vineyard Chic. Use Google Search for real-time info like weather.",
          tools: [{ googleSearch: {} }]
        }
      });

      const responseText = result.text || "I'm sorry, I couldn't generate a response.";
      
      // Extract grounding sources as required by Search Grounding rules
      const sources: { uri: string; title: string }[] = [];
      const chunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach((chunk: any) => {
          if (chunk.web && chunk.web.uri) {
            sources.push({ uri: chunk.web.uri, title: chunk.web.title || chunk.web.uri });
          }
        });
      }

      setMessages(prev => [...prev, { role: 'model', text: responseText, sources }]);
      setStreamingText('');
    } catch (error: any) {
      console.error("AI Error:", error);
      let errorMessage = "Technical glitch. Please try again.";
      
      if (error.message?.includes("Requested entity was not found") || error.message?.includes("API_KEY_INVALID")) {
        errorMessage = "API key is invalid or missing. Please refresh your connection.";
        // Offer key selection as a fallback
        handleOpenKeySelector();
      } else if (error.message?.includes("User location")) {
        errorMessage = "I need location permissions to answer that accurately.";
      }

      setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-[#16212B] rounded-t-[32px] shadow-2xl flex flex-col h-[75vh] pointer-events-auto border-t border-white/10 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#1A252F]/50 backdrop-blur-md rounded-t-[32px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="material-icons-round text-primary">auto_awesome</span>
            </div>
            <div>
              <h3 className="font-display text-lg text-primary">Companion Evelyn</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Digital Concierge</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white">
            <span className="material-icons-round">close</span>
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl ${
                m.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white/5 text-gray-200 rounded-tl-none border border-white/10'
              }`}>
                <p className="text-sm leading-relaxed">{m.text}</p>
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Sources:</p>
                    <div className="flex flex-wrap gap-2">
                      {m.sources.map((s, idx) => (
                        <a key={idx} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline bg-primary/10 px-2 py-1 rounded">
                          {s.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
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
        </div>

        {/* Footer */}
        <div className="p-6 bg-[#16212B] border-t border-white/5">
          {!isLoading && (
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
              {SPARKS.map((s, idx) => (
                <button key={idx} onClick={() => handleSend(s)} className="whitespace-nowrap px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[11px] font-medium text-gray-400 hover:text-primary transition-all active:scale-95">
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
              placeholder="How can I help you?" 
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:ring-1 focus:ring-primary/40 outline-none transition-all"
            />
            <button disabled={isLoading || !input.trim()} onClick={() => handleSend()} className={`p-4 rounded-2xl transition-all active:scale-90 ${isLoading || !input.trim() ? 'bg-gray-800 text-gray-500' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}>
              <span className="material-icons-round">{isLoading ? 'hourglass_top' : 'send'}</span>
            </button>
          </div>
          {/* Subtle Key Link if issues persist */}
          <div className="mt-4 text-center">
             <button onClick={handleOpenKeySelector} className="text-[10px] text-gray-500 hover:text-primary transition-colors">
               Trouble connecting? Refresh API Key
             </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AICompanion;
