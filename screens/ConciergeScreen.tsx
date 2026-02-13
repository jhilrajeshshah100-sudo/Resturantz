
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
  sources?: { title: string; uri: string }[];
}

interface ConciergeScreenProps {
  onBack: () => void;
}

const SUGGESTIONS = [
  "What is the dress code?",
  "Forecast for the wedding day?",
  "Directions to The Estate Kitchen",
  "Is there a shuttle service?",
  "Nearby hotels with vacancies"
];

const ConciergeScreen: React.FC<ConciergeScreenProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Welcome to the Farm & Fork union. I'm your digital concierge. How can I assist with your stay, dining, or the wedding schedule today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingText, isLoading]);

  const handleSend = async (forcedInput?: string) => {
    const textToSend = forcedInput || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage = textToSend.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);
    setStreamingText('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Construct history for context
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const streamResponse = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: [...history, { role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: "You are the 'Farm & Fork' wedding union concierge. The wedding is in a beautiful valley with vineyards. Key events: Rehearsal dinner at 'The Estate Kitchen' on Friday at 7 PM. Vineyard Tour Friday at 2 PM. Morning Hike Saturday 8 AM. The main ceremony is Saturday at 4 PM. Use Google Search for weather, local travel, or general etiquette. Be elegant, warm, and helpful. Use emojis like 🥂, 💍, and 🌿 sparingly.",
          tools: [{ googleSearch: {} }],
        },
      });

      let fullText = '';
      let groundingChunks: any[] = [];

      for await (const chunk of streamResponse) {
        const textPart = chunk.text;
        if (textPart) {
          fullText += textPart;
          setStreamingText(fullText);
        }
        
        // Capture grounding metadata if available in any chunk
        const metadata = chunk.candidates?.[0]?.groundingMetadata;
        if (metadata?.groundingChunks) {
            groundingChunks = metadata.groundingChunks;
        }
      }

      const sources = groundingChunks
        .filter(c => c.web)
        .map(c => ({ title: c.web.title, uri: c.web.uri }));

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: fullText || "I'm sorry, I couldn't find an answer for that.",
        sources: sources.length > 0 ? sources : undefined
      }]);
      setStreamingText('');
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the union servers. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0E151B] text-white">
      {/* Premium Header */}
      <header className="px-6 py-10 flex items-center justify-between border-b border-white/5 bg-[#0E151B]/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 active:scale-90 transition-transform">
            <span className="material-icons-round text-lg">arrow_back_ios_new</span>
          </button>
          <div>
            <h1 className="font-display text-2xl text-primary font-bold">Union Concierge</h1>
            <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-primary animate-pulse' : 'bg-green-500'}`}></span>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{isLoading ? 'Processing...' : 'Online'}</p>
            </div>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
            <span className="material-icons-round text-primary animate-pulse">auto_awesome</span>
        </div>
      </header>

      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[90%] p-5 rounded-[24px] shadow-2xl ${
              m.role === 'user' 
              ? 'bg-gradient-to-br from-primary to-[#A68045] text-white rounded-tr-none' 
              : 'bg-[#1A252F] text-gray-100 rounded-tl-none border border-white/5'
            }`}>
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{m.text}</p>
              
              {/* Grounding Sources */}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2">Sources:</p>
                  <div className="flex flex-wrap gap-2">
                    {m.sources.map((source, idx) => (
                      <a 
                        key={idx} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full text-[11px] hover:bg-white/10 transition-colors"
                      >
                        <span className="material-icons-round text-[12px]">public</span>
                        <span className="truncate max-w-[120px]">{source.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <span className="text-[9px] text-gray-500 mt-2 px-2 uppercase font-bold tracking-widest">{m.role === 'user' ? 'You' : 'Concierge'}</span>
          </div>
        ))}

        {/* Streaming Buffer */}
        {streamingText && (
          <div className="flex flex-col items-start">
            <div className="max-w-[90%] p-5 rounded-[24px] rounded-tl-none bg-[#1A252F] text-gray-100 border border-white/5 shadow-2xl">
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{streamingText}</p>
            </div>
            <span className="text-[9px] text-primary mt-2 px-2 uppercase font-bold tracking-widest animate-pulse">Typing...</span>
          </div>
        )}
      </div>

      {/* Footer Area */}
      <div className="p-6 bg-[#0E151B] border-t border-white/5">
        {/* Suggestion Chips */}
        {!isLoading && !streamingText && (
          <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
            {SUGGESTIONS.map((s, i) => (
              <button 
                key={i}
                onClick={() => handleSend(s)}
                className="whitespace-nowrap px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[11px] font-medium text-gray-300 active:bg-primary/20 active:border-primary/50 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-3 items-center relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about the union..." 
            className="flex-1 bg-[#1A252F] border border-white/5 rounded-2xl py-5 px-6 shadow-inner focus:ring-1 focus:ring-primary/40 focus:border-primary/40 text-[15px] text-white placeholder-gray-500 outline-none transition-all"
          />
          <button 
            disabled={isLoading || !input.trim()}
            onClick={() => handleSend()}
            className={`p-4 rounded-2xl shadow-xl transition-all active:scale-90 ${
                isLoading || !input.trim() 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-primary text-white hover:shadow-primary/20'
            }`}
          >
            <span className="material-icons-round">{isLoading ? 'hourglass_top' : 'send'}</span>
          </button>
        </div>
        <p className="text-center text-[9px] text-gray-600 mt-4 uppercase tracking-[0.2em]">Wedding Concierge v2.0 • Est. 2025</p>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ConciergeScreen;
