
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

interface AICompanionProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
  image?: string;
  sources?: { uri: string; title: string }[];
}

const SPARKS = [
  "Visual of the venue",
  "Wedding dress code",
  "Shuttle times",
  "Napa weather",
  "The menu"
];

const AICompanion: React.FC<AICompanionProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm Evelyn, your personalized Farm & Fork companion. I can help with wedding details or even visualize the estate for you. What's on your mind? 🥂" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading, isOpen]);

  const handleOpenKeySelector = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
    }
  };

  const handleSend = async (textOverride?: string) => {
    const textToSubmit = (textOverride || input).trim();
    if (!textToSubmit || isLoading) return;

    const currentMessages: Message[] = [...messages, { role: 'user', text: textToSubmit }];
    setMessages(currentMessages);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = process.env.API_KEY || '';
      if (!apiKey) {
        throw new Error("API_KEY_INVALID");
      }

      const ai = new GoogleGenAI({ apiKey });
      const isImageRequest = /generate|image|picture|photo|show me|look like|visual/i.test(textToSubmit);

      // HISTORY FILTER: Must start with 'user' and roles must alternate.
      const apiHistory = currentMessages
        .filter((m, i) => !(i === 0 && m.role === 'model'))
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      if (isImageRequest) {
        // IMAGE GENERATION
        const imgResult = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: apiHistory,
          config: {
            imageConfig: { aspectRatio: "16:9" }
          }
        });

        let generatedImage = '';
        let caption = '';

        for (const part of imgResult.candidates[0].content.parts) {
          if (part.inlineData) {
            generatedImage = `data:image/png;base64,${part.inlineData.data}`;
          } else if (part.text) {
            caption = part.text;
          }
        }

        setMessages(prev => [...prev, { 
          role: 'model', 
          text: caption || "Here's a glimpse of the beautiful Vineyard Valley Estate. ✨", 
          image: generatedImage 
        }]);
      } else {
        // TEXT GENERATION
        const textResult = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: apiHistory,
          config: {
            systemInstruction: `You are Evelyn, the sophisticated and highly-personalized concierge for Sarah & James' wedding at Vineyard Valley Estate.
            
            WEDDING FACTS:
            - Location: Vineyard Valley Estate, Napa Valley.
            - Date: October 12-14, 2024.
            - Dress Code: 'Vineyard Chic' (Elegant summer attire, block heels for grass).
            - Friday: Private Vineyard Tour (2 PM), Rehearsal Dinner at The Estate Kitchen (7 PM).
            - Saturday: Morning Hike (8 AM), Ceremony at The Glass Chapel (4 PM), Reception follows.
            - Sunday: Farewell Brunch at The Terrace Kitchen (10 AM).
            - Logistics: Shuttles run every 30 mins from The Valley Inn.
            - Registry: 'The Union Registry'.
            
            BEHAVIOR:
            - Provide detailed, customized answers based on the facts above.
            - If asked about local conditions (weather, flights), use the googleSearch tool.
            - Be warm, elegant, and concise. Use wine or wedding emojis sparingly.`,
            tools: [{ googleSearch: {} }]
          }
        });

        const responseText = textResult.text || "I apologize, but I couldn't quite retrieve that information for you. Shall we try another question? 🍷";
        const sources: { uri: string; title: string }[] = [];
        const chunks = textResult.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
          chunks.forEach((c: any) => { 
            if (c.web) sources.push({ uri: c.web.uri, title: c.web.title || c.web.uri }); 
          });
        }

        setMessages(prev => [...prev, { role: 'model', text: responseText, sources }]);
      }
    } catch (error: any) {
      console.error("AI Concierge Error:", error);
      const isKeyError = error.message?.includes("API_KEY_INVALID") || error.message?.includes("Requested entity was not found");
      
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: isKeyError 
          ? "I seem to be having trouble connecting to the Union network. Please check your API settings to continue. 🥂" 
          : "Pardon me, a small technical hiccup occurred at the Estate. Could you try asking me that again? ✨" 
      }]);
      
      if (isKeyError) handleOpenKeySelector();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-[#16212B] rounded-t-[40px] shadow-2xl flex flex-col h-[85vh] pointer-events-auto border-t border-white/10 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-[#1A252F]/80 backdrop-blur-xl rounded-t-[40px]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 rotate-3 shadow-lg">
              <span className="material-icons-round text-primary text-2xl animate-pulse">auto_awesome</span>
            </div>
            <div>
              <h3 className="font-display text-xl text-primary">Companion Evelyn</h3>
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">Personalized Guest Concierge</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90">
            <span className="material-icons-round">close</span>
          </button>
        </div>

        {/* Chat Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[90%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-5 rounded-3xl shadow-lg transition-all ${
                  m.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white/5 text-gray-200 rounded-tl-none border border-white/10'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  
                  {m.image && (
                    <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-navy-800">
                      <img src={m.image} alt="Generated Visual" className="w-full object-cover animate-fade-in" />
                    </div>
                  )}

                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                      <p className="text-[9px] uppercase font-black text-gray-500 tracking-tighter">Verified Context</p>
                      <div className="flex flex-wrap gap-2">
                        {m.sources.map((s, idx) => (
                          <a key={idx} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-primary/10 text-primary px-3 py-1.5 rounded-xl border border-primary/20 hover:bg-primary/20 transition-all truncate max-w-full">
                            {s.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/5 p-5 rounded-3xl rounded-tl-none flex gap-2 items-center border border-white/5">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-[10px] text-gray-500 font-bold uppercase ml-2 tracking-widest">Consulting Evelyn...</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Area */}
        <div className="p-8 bg-[#16212B] border-t border-white/5">
          {!isLoading && (
            <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
              {SPARKS.map((s, idx) => (
                <button key={idx} onClick={() => handleSend(s)} className="whitespace-nowrap px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-[11px] font-medium text-gray-400 hover:text-primary hover:border-primary/40 transition-all active:scale-95">
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-4 items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Evelyn anything..." 
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-sm text-white focus:ring-1 focus:ring-primary/40 outline-none transition-all placeholder:text-gray-600 shadow-inner"
            />
            <button 
              disabled={isLoading || !input.trim()} 
              onClick={() => handleSend()} 
              className={`p-5 rounded-2xl transition-all active:scale-90 shadow-2xl ${
                isLoading || !input.trim() ? 'bg-gray-800 text-gray-500' : 'bg-primary text-white shadow-primary/20'
              }`}
            >
              <span className="material-icons-round text-2xl">{isLoading ? 'hourglass_empty' : 'send'}</span>
            </button>
          </div>
          <div className="mt-6 flex justify-center">
             <button onClick={handleOpenKeySelector} className="text-[9px] text-gray-700 hover:text-primary uppercase tracking-[0.4em] font-black transition-colors border-b border-transparent hover:border-primary">
               System Configuration
             </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AICompanion;
