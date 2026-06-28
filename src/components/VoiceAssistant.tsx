import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Mic, Send, Volume2, VolumeX, ShieldAlert, Zap, Loader2, Play, CircleDot } from 'lucide-react';
import { ChatMessage, Task, GoalOrHabit } from '../types';

interface VoiceAssistantProps {
  tasks: Task[];
  goalsOrHabits: GoalOrHabit[];
  onExecuteAction: (actionType: string, taskData: any) => void;
}

export default function VoiceAssistant({ tasks, goalsOrHabits, onExecuteAction }: VoiceAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I am ActNow AI, your action-focused productivity coach. Tell me if you are stuck, or say 'Create task to study math' and I will schedule it.",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [useRealAudio, setUseRealAudio] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Supportive Speech synthesis using our real /api/tts OR Web Speech API fallback
  const speakText = async (text: string) => {
    if (!text) return;
    setIsSpeaking(true);

    if (useRealAudio) {
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text })
        });

        if (!res.ok) throw new Error("TTS endpoint error");

        const data = await res.json();
        if (data.audio) {
          if (audioRef.current) {
            audioRef.current.pause();
          }
          const audioBlobUrl = `data:audio/mp3;base64,${data.audio}`;
          const audio = new Audio(audioBlobUrl);
          audioRef.current = audio;
          audio.onended = () => setIsSpeaking(false);
          await audio.play();
          return;
        }
      } catch (error) {
        console.warn("Server TTS failed, falling back to browser synthesis.", error);
      }
    }

    // Fallback: Browser Web Speech API
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      // Try to find a supportive female/male English voice
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) || voices.find(v => v.lang.startsWith('en'));
      if (naturalVoice) utterance.voice = naturalVoice;
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
    }
  };

  // Submit Text/Voice command to AI
  const handleSubmit = async (e?: React.FormEvent, overrideText?: string) => {
    if (e) e.preventDefault();
    const query = overrideText || inputText;
    if (!query.trim() || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          tasks,
          goalsOrHabits,
          currentTime: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const data = await response.json();
      
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      speakText(data.reply);

      // Execute autonomous action if detected by Gemini
      if (data.action && data.action.type !== 'none') {
        onExecuteAction(data.action.type, data.action.taskData);
      }

    } catch (error: any) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: "Sorry, I lost my uplink to the deadline database. Please try saying that again.",
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Preset triggers for Quick Hackathon Testing
  const shortcuts = [
    { label: "Create Work Task: Pitch Deck", prompt: "Create a work task to edit pitch deck slides for 2.5 hours" },
    { label: "Check nearest deadline", prompt: "What is my nearest critical deadline and how should I start?" },
    { label: "Reschedule slides", prompt: "Reschedule deliver investment pitch slides by 3 hours" },
    { label: "Trigger study break", prompt: "I am feeling too overwhelmed with my Organic Chemistry exam, what should I do?" }
  ];

  // Simulating micro voice activation
  const toggleVoiceMode = () => {
    if (isVoiceActive) {
      setIsVoiceActive(false);
    } else {
      setIsVoiceActive(true);
      // Give a friendly starting message
      speakText("Awaiting voice instruction. Tell me your task details.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-2xl flex flex-col h-[520px] relative overflow-hidden"
    >
      {/* Decorative Title/Status */}
      <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Sparkles className="w-4 h-4 text-violet-400" />
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-violet-500 animate-ping" />
            )}
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest">Autonomous ActNow AI</h3>
            <span className="text-[9px] text-gray-400 font-medium">Full Voice Synthesis Online</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio toggle */}
          <button
            onClick={() => setUseRealAudio(!useRealAudio)}
            title={useRealAudio ? "Using server-side Gemini audio" : "Using native browser voice"}
            className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
              useRealAudio 
                ? 'bg-violet-500/10 border-violet-500/20 text-violet-300' 
                : 'bg-white/5 border-white/5 text-gray-400'
            }`}
          >
            {useRealAudio ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
          
          <span className="flex items-center gap-1.5 text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Autonomous Mode</span>
          </span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar bg-black/20">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
            >
              <div
                className={`p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-violet-600 text-white rounded-br-none'
                    : 'bg-white/10 text-gray-100 rounded-bl-none border border-white/5'
                }`}
              >
                {msg.content}
              </div>
              <span className="text-[8px] text-gray-500 mt-1 font-mono">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-gray-400 pl-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
            <span>ActNow AI is analyzing cognitive load...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Speech Audio Wave Visualizer Block (displays when speaking or voice mode is active) */}
      {(isSpeaking || isVoiceActive) && (
        <div className="absolute inset-x-0 bottom-[140px] bg-violet-950/90 border-t border-b border-violet-500/20 py-2 flex items-center justify-center gap-4 z-20 backdrop-blur-md">
          <div className="flex items-center gap-1.5 h-8">
            <div className="w-1 bg-violet-400 rounded-full audio-bar" />
            <div className="w-1 bg-violet-300 rounded-full audio-bar" />
            <div className="w-1 bg-indigo-400 rounded-full audio-bar" />
            <div className="w-1 bg-indigo-300 rounded-full audio-bar" />
            <div className="w-1 bg-violet-500 rounded-full audio-bar" />
            <div className="w-1 bg-violet-400 rounded-full audio-bar" />
            <div className="w-1 bg-indigo-400 rounded-full audio-bar" />
          </div>
          <span className="text-[10px] text-violet-200 font-bold uppercase tracking-widest animate-pulse flex items-center gap-1.5">
            <CircleDot className="w-3.5 h-3.5 text-violet-400 animate-ping" />
            {isSpeaking ? "Broadcasting rescue advice" : "Listening for voice trigger..."}
          </span>
        </div>
      )}

      {/* Preset Testing Shortcuts Panel */}
      <div className="p-3 bg-white/5 border-t border-white/5 flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto">
        <span className="text-[9px] text-gray-400 w-full font-bold uppercase tracking-wider mb-0.5">Quick Voice Test Actions:</span>
        {shortcuts.map((sc, index) => (
          <button
            key={index}
            onClick={() => handleSubmit(undefined, sc.prompt)}
            className="text-[10px] bg-white/5 hover:bg-violet-600/20 hover:text-violet-300 border border-white/5 text-gray-300 rounded-lg py-1 px-2.5 transition-colors text-left truncate max-w-full cursor-pointer font-medium"
          >
            🎯 {sc.label}
          </button>
        ))}
      </div>

      {/* Input panel */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-white/5 bg-white/5 flex items-center gap-2 relative z-10">
        <button
          type="button"
          onClick={toggleVoiceMode}
          className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
            isVoiceActive 
              ? 'bg-rose-500 text-white border-rose-400 animate-pulse' 
              : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
          }`}
          title="Toggle Mic Capture mode"
        >
          <Mic className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a rescue task or ask for help..."
          className="flex-1 glass-input py-2 px-3 rounded-xl text-xs"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-40 flex items-center justify-center transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </motion.div>
  );
}
