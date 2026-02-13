
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

// Audio Helpers
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface Message {
  role: 'user' | 'model';
  text: string;
  image?: string;
  sources?: { uri: string; title: string }[];
}

interface ConciergeScreenProps {
  onBack: () => void;
}

const ConciergeScreen: React.FC<ConciergeScreenProps> = ({ onBack }) => {
  const [isLive, setIsLive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Welcome to the Grand Concierge. I can handle text inquiries, live voice coordination, or even generate visuals of the Estate. How can I assist? 🥂" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleOpenKeySelector = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
    }
  };

  const handleSendText = async () => {
    const userMsg = inputText.trim();
    if (!userMsg || isTyping) return;
    
    const currentMessages: Message[] = [...messages, { role: 'user', text: userMsg }];
    setMessages(currentMessages);
    setInputText('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const isImageRequest = /generate|image|picture|photo|show me|look like/i.test(userMsg);

      const apiContents = currentMessages
        .filter((m, idx) => !(idx === 0 && m.role === 'model'))
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      if (isImageRequest) {
        const result = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: apiContents,
          config: { imageConfig: { aspectRatio: "16:9" } }
        });

        let img = '';
        let txt = '';
        for (const p of result.candidates[0].content.parts) {
          if (p.inlineData) img = `data:image/png;base64,${p.inlineData.data}`;
          else if (p.text) txt = p.text;
        }

        setMessages(prev => [...prev, { role: 'model', text: txt || "Visualizing that for you now...", image: img }]);
      } else {
        const result = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: apiContents,
          config: {
            systemInstruction: "You are the elegant Union Concierge. Be sophisticated and helpful. Friday tour 2pm, dinner 7pm. Saturday ceremony 4pm. Use Google search grounding for weather.",
            tools: [{ googleSearch: {} }]
          }
        });

        const responseText = result.text || "Pardon me, I couldn't process that request.";
        const sources: { uri: string; title: string }[] = [];
        const chunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
          chunks.forEach((chunk: any) => {
            if (chunk.web) sources.push({ uri: chunk.web.uri, title: chunk.web.title || chunk.web.uri });
          });
        }
        setMessages(prev => [...prev, { role: 'model', text: responseText, sources }]);
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("API_KEY_INVALID") || err.message?.includes("entity was not found")) {
        setMessages(prev => [...prev, { role: 'model', text: "API connection failed. Please re-authenticate your key below to resume. ✨" }]);
        handleOpenKeySelector();
      } else {
        setMessages(prev => [...prev, { role: 'model', text: "The Estate connection is a bit slow today. Please try again. 🥂" }]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const toggleLive = async () => {
    if (isLive) {
      if (sessionRef.current) sessionRef.current.close();
      if (audioContextRef.current) audioContextRef.current.close();
      setIsLive(false);
      return;
    }

    try {
      setIsLive(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const inputCtx = new AudioContext({ sampleRate: 16000 });
      const outputCtx = new AudioContext({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) { int16[i] = inputData[i] * 32768; }
              const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              const buf = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const src = outputCtx.createBufferSource();
              src.buffer = buf;
              src.connect(outputCtx.destination);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              src.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buf.duration;
              sourcesRef.current.add(src);
              src.onended = () => sourcesRef.current.delete(src);
            }
            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => setIsLive(false),
          onerror: (e) => {
            console.error("Live Error", e);
            setIsLive(false);
            handleOpenKeySelector();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
          systemInstruction: "You are the live voice assistant for the Farm & Fork wedding. Be brief, elegant, and witty."
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsLive(false);
      handleOpenKeySelector();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0E151B] text-white selection:bg-primary/20">
      <header className="p-8 flex items-center justify-between border-b border-white/5 bg-[#16212B]/90 backdrop-blur-2xl">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-3 -ml-3 text-gray-400 hover:text-white transition-all hover:scale-110">
            <span className="material-icons-round">arrow_back_ios_new</span>
          </button>
          <div>
            <h1 className="font-display text-3xl text-primary">Union Concierge</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-700'}`}></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{isLive ? 'Live Connection Active' : 'Standard Inquiry Mode'}</span>
            </div>
          </div>
        </div>
        <button onClick={toggleLive} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-2xl active:scale-90 ${isLive ? 'bg-red-500 shadow-red-500/20' : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'}`}>
          <span className="material-icons-round text-3xl">{isLive ? 'mic_off' : 'mic'}</span>
        </button>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col relative">
        {isLive ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[#0E151B]">
            <div className="relative mb-16">
               <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
               <div className="relative z-10 w-64 h-64 flex items-center justify-center">
                 <div className="absolute inset-0 border border-primary/10 rounded-full animate-ping"></div>
                 <div className="absolute inset-8 border border-primary/20 rounded-full animate-ping [animation-delay:0.5s]"></div>
                 <svg className="w-48 h-48 relative z-10" viewBox="0 0 100 100">
                   <circle cx="50" cy="50" r="35" fill="url(#orbGradient)" className="animate-pulse" />
                   <defs><radialGradient id="orbGradient"><stop offset="0%" stopColor="#C5A059" /><stop offset="100%" stopColor="#8B6B32" /></radialGradient></defs>
                 </svg>
               </div>
            </div>
            <h2 className="text-3xl font-display mb-6 tracking-wide">Live Voice Mode</h2>
            <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">I am monitoring the audio stream. Ask me anything about the wedding schedule or logistics.</p>
            <button onClick={toggleLive} className="mt-16 px-10 py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all">Switch to Text</button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-6 rounded-3xl shadow-2xl ${m.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-[#1A252F] text-gray-100 rounded-tl-none border border-white/5'}`}>
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{m.text}</p>
                    {m.image && (
                      <div className="mt-6 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                        <img src={m.image} alt="Concierge Visual" className="w-full object-cover" />
                      </div>
                    )}
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-white/5">
                        <p className="text-[9px] uppercase font-black text-primary/60 tracking-[0.2em] mb-3">Grounding Sources</p>
                        <div className="flex flex-wrap gap-2">
                          {m.sources.map((s, idx) => (
                            <a key={idx} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-white/5 hover:bg-white/10 text-primary border border-primary/20 px-4 py-2 rounded-2xl transition-all">
                              {s.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#1A252F] p-6 rounded-3xl rounded-tl-none flex gap-2 items-center border border-white/5 shadow-xl">
                    <div className="w-2.5 h-2.5 bg-primary/40 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2.5 h-2.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-8 bg-[#16212B] border-t border-white/5">
              <div className="flex gap-4 items-center">
                <input 
                  type="text" 
                  value={inputText} 
                  onChange={(e) => setInputText(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && handleSendText()} 
                  placeholder="Inquire with the concierge..." 
                  className="flex-1 bg-[#0E151B] border border-white/5 rounded-2xl py-5 px-8 text-sm text-white outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-gray-700" 
                />
                <button 
                  disabled={isTyping || !inputText.trim()} 
                  onClick={handleSendText} 
                  className={`p-5 rounded-2xl shadow-2xl transition-all ${isTyping || !inputText.trim() ? 'bg-gray-800 text-gray-500' : 'bg-primary text-white active:scale-95 shadow-primary/20'}`}
                >
                  <span className="material-icons-round text-2xl">{isTyping ? 'hourglass_top' : 'send'}</span>
                </button>
              </div>
              <div className="mt-6 text-center">
                <button onClick={handleOpenKeySelector} className="text-[9px] uppercase tracking-[0.5em] font-black text-gray-700 hover:text-primary transition-all">
                  Concierge System & API Configuration
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConciergeScreen;
