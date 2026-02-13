
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
  sources?: { uri: string; title: string }[];
}

interface ConciergeScreenProps {
  onBack: () => void;
}

const ConciergeScreen: React.FC<ConciergeScreenProps> = ({ onBack }) => {
  const [isLive, setIsLive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Welcome back. I am your Union Assistant. Would you like to chat via text or start a live voice session for hands-free help?" }
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
    if (!inputText.trim() || isTyping) return;
    const userMsg = inputText.trim();
    const currentMessages: Message[] = [...messages, { role: 'user', text: userMsg }];
    setMessages(currentMessages);
    setInputText('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      // CRITICAL: Filter out initial model message to start with 'user'
      const apiContents = currentMessages
        .filter((m, idx) => !(idx === 0 && m.role === 'model'))
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: apiContents,
        config: {
          systemInstruction: "You are the elegant Union Assistant for the Farm & Fork wedding. Be warm, helpful, and concise. Use Google Search for weather and local valley info.",
          tools: [{ googleSearch: {} }]
        }
      });

      const responseText = result.text || "I'm sorry, I couldn't process that.";
      
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
    } catch (err: any) {
      console.error(err);
      let errorDisplay = "I encountered an issue. Please try again.";
      if (err.message?.includes("Requested entity was not found") || err.message?.includes("API_KEY_INVALID")) {
        errorDisplay = "API connection failed. Please refresh your project key.";
        handleOpenKeySelector();
      }
      setMessages(prev => [...prev, { role: 'model', text: errorDisplay }]);
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
    <div className="flex flex-col h-screen bg-[#0E151B] text-white">
      <header className="p-6 flex items-center justify-between border-b border-white/5 bg-[#16212B]/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
            <span className="material-icons-round">arrow_back_ios_new</span>
          </button>
          <div>
            <h1 className="font-display text-2xl text-primary">Union Concierge</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{isLive ? 'Live Voice Active' : 'Text Mode'}</span>
            </div>
          </div>
        </div>
        <button onClick={toggleLive} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isLive ? 'bg-red-500' : 'bg-primary/10 text-primary border border-primary/20'}`}>
          <span className="material-icons-round">{isLive ? 'mic_off' : 'mic'}</span>
        </button>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col relative">
        {isLive ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[#0E151B]">
            <div className="relative mb-12">
               <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
               <svg className="w-48 h-48 relative z-10" viewBox="0 0 100 100">
                 <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/20" />
                 <circle cx="50" cy="50" r="30" fill="url(#orbGradient)" className="animate-pulse" />
                 <defs><radialGradient id="orbGradient"><stop offset="0%" stopColor="#C5A059" /><stop offset="100%" stopColor="#8B6B32" /></radialGradient></defs>
               </svg>
            </div>
            <h2 className="text-2xl font-display mb-4">Hands-Free Mode</h2>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">I'm listening. Speak naturally about your wedding needs.</p>
            <button onClick={toggleLive} className="mt-12 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/10">Switch to Text</button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-5 rounded-3xl shadow-xl ${m.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-[#1A252F] text-gray-100 rounded-tl-none border border-white/5'}`}>
                    <p className="text-[15px] leading-relaxed">{m.text}</p>
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-[9px] uppercase font-black text-primary/60 tracking-tighter mb-2">Validated Sources</p>
                        <div className="flex flex-wrap gap-2">
                          {m.sources.map((s, idx) => (
                            <a key={idx} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-white/5 hover:bg-white/10 text-primary border border-primary/20 px-3 py-1.5 rounded-xl transition-colors">
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
                  <div className="bg-[#1A252F] p-4 rounded-3xl rounded-tl-none flex gap-1">
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 bg-[#16212B] border-t border-white/5">
              <div className="flex gap-3 items-center">
                <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendText()} placeholder="Ask the Concierge..." className="flex-1 bg-[#0E151B] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:ring-1 focus:ring-primary/40" />
                <button disabled={isTyping || !inputText.trim()} onClick={handleSendText} className={`p-4 rounded-2xl shadow-xl transition-all ${isTyping || !inputText.trim() ? 'bg-gray-800 text-gray-500' : 'bg-primary text-white active:scale-95'}`}>
                  <span className="material-icons-round">{isTyping ? 'hourglass_top' : 'send'}</span>
                </button>
              </div>
              <div className="mt-4 text-center">
                <button onClick={handleOpenKeySelector} className="text-[9px] uppercase tracking-widest font-bold text-gray-600 hover:text-primary transition-colors">
                  System Settings: Configure API Access
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
