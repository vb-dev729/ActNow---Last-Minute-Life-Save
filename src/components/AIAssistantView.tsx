import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Mic, Send, Volume2, VolumeX, ShieldAlert, Zap, 
  Loader2, CircleDot, Play, Brain, HelpCircle, CornerDownLeft, Database, Terminal,
  CheckCircle, Clock, Calendar, Dumbbell, Apple, AlertTriangle, Award, Target, BookOpen, Heart, Activity, ArrowRight, TrendingUp, RefreshCw
} from 'lucide-react';
import { ChatMessage, Task, GoalOrHabit, ActionCardData } from '../types';

interface AIAssistantViewProps {
  tasks: Task[];
  goalsOrHabits: GoalOrHabit[];
  lifeOSState: any;
  messages: ChatMessage[];
  onSendMessage: (query: string) => void;
  isLoading: boolean;
  onExecuteAction: (actionType: string, taskData: any) => void;
}

export default function AIAssistantView({ 
  tasks, 
  goalsOrHabits, 
  lifeOSState,
  messages,
  onSendMessage,
  isLoading,
  onExecuteAction
}: AIAssistantViewProps) {
  const [inputText, setInputText] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [useRealAudio, setUseRealAudio] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant') {
        speakText(lastMsg.content);
      }
    }
  }, [messages]);

  const speakText = async (text: string) => {
    if (!text) return;
    setIsSpeaking(true);

    if (useRealAudio) {
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: text.replace(/[#*_]/g, '') })
        });

        if (res.ok) {
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
        }
      } catch (error) {
        console.warn("Gemini Premium TTS failed, falling back to Browser instant speech.", error);
      }
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      const voices = window.speechSynthesis.getVoices();
      const EnglishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) || voices.find(v => v.lang.startsWith('en'));
      if (EnglishVoice) utterance.voice = EnglishVoice;
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText("");
  };

  const handleToggleVoiceMic = () => {
    if (isVoiceActive) {
      setIsVoiceActive(false);
    } else {
      setIsVoiceActive(true);
      speakText("Zero-latency Mic Capture online. Speak your command, like: I have a DSA assignment tomorrow, a Hackathon slides draft, and Gym.");
    }
  };

  // Proactive interactive conversation triggers (Feature 3)
  const proactiveTriggers = [
    {
      title: "🚨 Overloaded Day Tomorrow?",
      subtitle: "Negotiate tradeoffs for DSA, Hackathon & Gym",
      prompt: "I have a DSA assignment, Hackathon PPT and Gym tomorrow."
    },
    {
      title: "🛌 High Sleep Debt detected",
      subtitle: "Activate sleep-protection guardrail",
      prompt: "How is my sleep debt and focus loss?"
    },
    {
      title: "🔥 Burnout Assessment",
      subtitle: "Analyze stress and defer secondary tasks",
      prompt: "Am I at burnout risk? Optimize my timeline"
    }
  ];

  // Quick Command Suggestions (Feature 7)
  const quickCommands = [
    { label: "Plan my day", query: "Plan my day" },
    { label: "Prepare for exam", query: "Prepare for exam" },
    { label: "Optimize my week", query: "Optimize my week" },
    { label: "Balance gym and study", query: "Balance gym and study" },
    { label: "Hackathon planning", query: "Hackathon planning" }
  ];

  // Active Specialist Agent Tracker state
  const activeAgent = messages[messages.length - 1]?.routedAgent || 'productivity';

  // RENDER DETAILED INTERACTIVE ACTION CARDS (Feature 5)
  const renderActionCard = (card: ActionCardData) => {
    if (!card) return null;

    return (
      <div className="mt-3 bg-[#0d1020]/95 border border-violet-500/15 rounded-xl overflow-hidden shadow-xl max-w-full">
        {/* Card Header Banner */}
        <div className="bg-gradient-to-r from-violet-600/10 via-indigo-600/10 to-transparent p-3.5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-violet-500/10 border border-violet-500/20 rounded-lg text-violet-300">
              {card.type === 'task' && <BookOpen className="w-3.5 h-3.5" />}
              {card.type === 'schedule' && <Clock className="w-3.5 h-3.5" />}
              {card.type === 'risk_alert' && <AlertTriangle className="w-3.5 h-3.5" />}
              {card.type === 'burnout_alert' && <Activity className="w-3.5 h-3.5" />}
              {card.type === 'workout_rec' && <Dumbbell className="w-3.5 h-3.5" />}
              {card.type === 'sleep_rec' && <Heart className="w-3.5 h-3.5" />}
              {card.type === 'goal_progress' && <Target className="w-3.5 h-3.5" />}
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider font-sans">{card.title}</h4>
              {card.subtitle && <p className="text-[9px] text-gray-400 font-semibold mt-0.5">{card.subtitle}</p>}
            </div>
          </div>

          {card.alertLevel && (
            <span className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded border uppercase tracking-wider ${
              card.alertLevel === 'danger' ? 'bg-rose-500/10 border-rose-500/20 text-rose-300' :
              card.alertLevel === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' :
              'bg-violet-500/10 border-violet-500/20 text-violet-300'
            }`}>
              {card.alertLevel}
            </span>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          {/* Progress Indicator for Burnout or Goal Cards */}
          {card.value !== undefined && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-gray-400">Progression / Risk Level:</span>
                <span className="text-white font-mono">{card.value}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    card.type === 'burnout_alert' && card.value > 70 ? 'bg-rose-500' :
                    card.type === 'burnout_alert' ? 'bg-amber-500' : 'bg-gradient-to-r from-violet-500 to-indigo-500'
                  }`} 
                  style={{ width: `${card.value}%` }} 
                />
              </div>
            </div>
          )}

          {/* Key Metric Tags (Bento Grid Style) */}
          {card.metrics && card.metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {card.metrics.map((m, idx) => (
                <div key={idx} className="bg-white/[0.02] border border-white/5 p-2 rounded-lg">
                  <span className="text-[8px] text-gray-500 font-black uppercase block tracking-wider">{m.label}</span>
                  <span className={`text-[10.5px] font-black block mt-0.5 font-mono ${m.color || 'text-white'}`}>{m.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Chronological Schedule Items */}
          {card.scheduleItems && card.scheduleItems.length > 0 && (
            <div className="space-y-1.5 border-t border-white/5 pt-3">
              <span className="text-[9px] text-violet-300 font-black uppercase tracking-wider block mb-1">Chronological Plan Layout</span>
              <div className="space-y-1">
                {card.scheduleItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[10.5px] bg-white/[0.01] hover:bg-white/[0.02] p-2 rounded-lg border border-white/5 font-semibold">
                    <span className="text-violet-400 font-bold font-mono text-[9px] shrink-0 w-28 border-r border-white/5 pr-1.5">{item.time}</span>
                    <span className="text-gray-200 truncate flex-1">{item.activity}</span>
                    {item.badge && (
                      <span className="text-[7.5px] bg-white/5 border border-white/10 px-1 py-0.5 rounded font-mono text-gray-400 font-bold uppercase">{item.badge}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Recommendation Alert */}
          {card.recommendation && (
            <div className="p-3 bg-violet-950/15 border border-violet-500/10 rounded-lg text-[10.5px] text-gray-300 leading-relaxed font-semibold">
              <span className="text-violet-400 font-bold uppercase tracking-wider text-[9px] block mb-0.5">ActNow Safeguard Recommendation:</span>
              {card.recommendation}
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        {(card.primaryActionLabel || card.secondaryActionLabel) && (
          <div className="bg-white/[0.01] border-t border-white/5 p-3 flex gap-2">
            {card.secondaryActionLabel && (
              <button 
                onClick={() => onExecuteAction(card.secondaryActionLabel || 'secondary_click', card.actionPayload)}
                className="flex-1 py-1.5 px-3 rounded-lg border border-white/5 hover:border-white/15 bg-white/[0.01] hover:bg-white/[0.03] text-[10px] font-bold text-gray-300 transition-colors cursor-pointer"
              >
                {card.secondaryActionLabel}
              </button>
            )}
            {card.primaryActionLabel && (
              <button 
                onClick={() => onExecuteAction(card.primaryActionLabel || 'primary_click', card.actionPayload)}
                className="flex-1 py-1.5 px-3 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-[10px] font-extrabold tracking-wide flex items-center justify-center gap-1 transition-colors shadow-md shadow-violet-950 cursor-pointer"
              >
                <span>{card.primaryActionLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 min-h-[660px]">
      
      {/* LEFT PANE: Large Chat Area (xl:col-span-8) */}
      <div className="bg-[#090b14] border border-white/5 rounded-2xl flex flex-col h-[700px] relative overflow-hidden xl:col-span-8 shadow-2xl">
        
        {/* Chat Header with Branding */}
        <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl">
              <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-sans">ActNow AI Companion</h3>
              <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">Gemini 3.5-Flash Orchestrator • Deep Reasoning</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/10 px-2.5 py-1 rounded-xl text-[9px] text-emerald-300 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Voice 2.0 Mic Ready</span>
            </div>

            <button
              onClick={() => {
                const nextVal = !useRealAudio;
                setUseRealAudio(nextVal);
                speakText(nextVal ? "Premium voice synthesis online." : "Instant Voice engine activated.");
              }}
              className={`py-1 px-2.5 rounded-xl border text-[10px] font-black cursor-pointer transition-all ${
                useRealAudio 
                  ? 'bg-violet-500/20 border-violet-500/30 text-violet-300 shadow-md' 
                  : 'bg-white/5 border-white/5 text-gray-400'
              }`}
            >
              {useRealAudio ? "🔊 Premium AI TTS" : "⚡ Instant TTS"}
            </button>
          </div>
        </div>

        {/* Proactive Trigger Recommendation Feed (Feature 3) */}
        <div className="p-3 bg-violet-950/10 border-b border-white/5 space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-violet-300 font-black uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-violet-400" />
              Proactive AI Interventions
            </span>
            <span className="text-[8px] bg-violet-500/20 text-violet-300 font-bold px-1.5 py-0.5 rounded font-mono">3 Live Recommendations</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {proactiveTriggers.map((trig, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSendMessage(trig.prompt);
                  speakText(`Executing proactive target: ${trig.title}`);
                }}
                className="p-2 bg-[#0c0f1e]/85 hover:bg-violet-600/15 border border-violet-500/10 hover:border-violet-500/25 rounded-xl text-left transition-all cursor-pointer font-semibold"
              >
                <div className="text-[10px] text-white font-extrabold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping" />
                  {trig.title}
                </div>
                <div className="text-[8.5px] text-gray-400 truncate mt-0.5 font-medium">{trig.subtitle}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat message list area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-[#05060d]/50">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <div
                  className={`p-4 rounded-2xl text-[12.5px] leading-relaxed font-semibold shadow-md border ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white border-violet-500/20 rounded-br-none'
                      : 'bg-white/[0.04] text-gray-100 border-white/5 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Render the custom Action Card inline if present in message data */}
                  {msg.actionCard && renderActionCard(msg.actionCard)}

                  {/* Dynamic Tool Cards - AI Operating System Buttons (Fix 6) */}
                  {msg.role === 'assistant' && (
                    msg.content.toLowerCase().includes("plan") ||
                    msg.content.toLowerCase().includes("schedule") ||
                    msg.content.toLowerCase().includes("priority") ||
                    msg.content.toLowerCase().includes("situation") ||
                    msg.content.toLowerCase().includes("exam") ||
                    msg.content.toLowerCase().includes("gym") ||
                    msg.actionCard
                  ) && (
                    <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                      <p className="text-[10px] text-violet-400 font-extrabold uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-ping" />
                        ActNow AI OS Quick Tools:
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => {
                            onSendMessage("Plan my day");
                            speakText("Activating Coordinated Schedule Planner");
                          }}
                          className="flex items-center gap-2 text-left bg-violet-600/10 hover:bg-violet-600/30 border border-violet-500/25 text-violet-200 rounded-xl p-2.5 transition-all cursor-pointer font-bold text-[10.5px]"
                        >
                          <Calendar className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                          <span>Create Schedule</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onSendMessage("Schedule gym tomorrow");
                            speakText("Rescheduling gym block");
                          }}
                          className="flex items-center gap-2 text-left bg-emerald-600/10 hover:bg-emerald-600/30 border border-emerald-500/25 text-emerald-200 rounded-xl p-2.5 transition-all cursor-pointer font-bold text-[10.5px]"
                        >
                          <Dumbbell className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Reschedule Gym</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onExecuteAction("start_focus", {});
                            speakText("Launching Deep Focus Block");
                          }}
                          className="flex items-center gap-2 text-left bg-indigo-600/10 hover:bg-indigo-600/30 border border-indigo-500/25 text-indigo-200 rounded-xl p-2.5 transition-all cursor-pointer font-bold text-[10.5px]"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>Focus Mode</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onSendMessage("Prepare for exam");
                            speakText("Optimizing schedule for Exam Preparation");
                          }}
                          className="flex items-center gap-2 text-left bg-rose-600/10 hover:bg-rose-600/30 border border-rose-500/25 text-rose-200 rounded-xl p-2.5 transition-all cursor-pointer font-bold text-[10.5px]"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span>Exam Plan</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1">
                  {msg.role === 'assistant' && msg.routedAgent && (
                    <span className="text-[8px] font-bold font-mono px-1.5 py-0.2 rounded bg-violet-500/10 border border-violet-500/20 text-violet-300 capitalize">
                      {msg.routedAgent} Agent
                    </span>
                  )}
                  <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider font-bold">
                    {msg.role === 'user' ? 'You' : 'ActNow AI'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <div className="flex items-center gap-2.5 text-[11px] text-gray-400 font-bold pl-2">
              <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
              <span>Orchestrating specialist agent cognitive queries...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Dynamic speech soundwave visualization overlay */}
        {(isSpeaking || isVoiceActive) && (
          <div className="absolute inset-x-0 bottom-[125px] bg-violet-950/95 border-t border-b border-violet-500/20 py-2.5 flex items-center justify-center gap-4 z-20 backdrop-blur-md">
            <div className="flex items-center gap-1 h-6">
              <span className="w-1 bg-violet-400 rounded-full animate-pulse h-3" />
              <span className="w-1 bg-violet-300 rounded-full animate-pulse h-5 delay-75" />
              <span className="w-1 bg-indigo-400 rounded-full animate-pulse h-4 delay-150" />
              <span className="w-1 bg-violet-500 rounded-full animate-pulse h-6 delay-300" />
              <span className="w-1 bg-indigo-300 rounded-full animate-pulse h-3 delay-100" />
            </div>
            <span className="text-[10px] text-violet-200 font-extrabold uppercase tracking-widest animate-pulse flex items-center gap-1.5 font-mono">
              <CircleDot className="w-4 h-4 text-violet-400 animate-ping" />
              {isSpeaking ? "ActNow AI is speaking..." : "ActNow Zero-latency mic is active..."}
            </span>
          </div>
        )}

        {/* Quick Voice/Text Command mapping shortcuts (Feature 7) */}
        <div className="p-3 bg-white/[0.02] border-t border-white/5 flex flex-wrap gap-2 max-h-[115px] overflow-y-auto shrink-0">
          <span className="text-[9px] text-gray-400 w-full font-bold uppercase tracking-wider mb-0.5 block">Quick Commands:</span>
          {quickCommands.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                onSendMessage(item.query);
                speakText(`Processing command: ${item.label}`);
              }}
              className="text-[10px] bg-[#0c0f1e] hover:bg-violet-600/20 hover:text-violet-300 border border-white/5 text-gray-300 rounded-xl py-1 px-3 transition-colors text-left truncate max-w-full cursor-pointer font-bold"
            >
              🎤 {item.label}
            </button>
          ))}
        </div>

        {/* Chat input box form */}
        <form onSubmit={handleTextSubmit} className="p-3 border-t border-white/5 bg-white/[0.01] flex items-center gap-2.5 relative z-10 shrink-0">
          <button
            type="button"
            onClick={handleToggleVoiceMic}
            className={`p-3 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
              isVoiceActive 
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse' 
                : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle Mic Capture"
          >
            <Mic className="w-4.5 h-4.5" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your overloading targets, ask for meal plans, sleep details or burnout advice..."
            className="flex-1 bg-[#05060d]/60 border border-white/5 py-2.5 px-4 rounded-xl text-xs font-semibold text-white outline-none focus:border-violet-500/40"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-40 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
      </div>

      {/* RIGHT PANE: System Status & Logs (xl:col-span-4) */}
      <div className="bg-[#090b14] border border-white/5 rounded-2xl p-5 flex flex-col justify-between h-[700px] xl:col-span-4 shadow-2xl relative overflow-hidden">
        <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-1">
          
          <div className="flex items-center gap-2 border-b border-white/5 pb-2 justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-4.5 h-4.5 text-violet-400" />
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-sans">Cognitive Memory Engine</h3>
            </div>
            <Database className="w-4 h-4 text-gray-500" />
          </div>

          {/* Feature 4: Active Routing Status */}
          <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-2.5">
            <span className="text-[9px] text-gray-500 font-black uppercase tracking-wider block">Specialist Agent Routing Pipeline</span>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className={`p-2 rounded-lg border transition-all ${activeAgent === 'productivity' ? 'bg-violet-500/10 border-violet-500/30 text-white font-bold' : 'bg-black/20 border-white/5 text-gray-500'}`}>
                <div className="flex items-center gap-1.5">
                  <Clock className={`w-3.5 h-3.5 ${activeAgent === 'productivity' ? 'text-violet-400' : 'text-gray-500'}`} />
                  <span>Productivity</span>
                </div>
                {activeAgent === 'productivity' && <span className="text-[7.5px] text-violet-300 block mt-1 font-mono uppercase tracking-widest font-extrabold animate-pulse">thinking...</span>}
              </div>

              <div className={`p-2 rounded-lg border transition-all ${activeAgent === 'health' ? 'bg-emerald-500/10 border-emerald-500/30 text-white font-bold' : 'bg-black/20 border-white/5 text-gray-500'}`}>
                <div className="flex items-center gap-1.5">
                  <Activity className={`w-3.5 h-3.5 ${activeAgent === 'health' ? 'text-emerald-400' : 'text-gray-500'}`} />
                  <span>Health & Sleep</span>
                </div>
                {activeAgent === 'health' && <span className="text-[7.5px] text-emerald-300 block mt-1 font-mono uppercase tracking-widest font-extrabold animate-pulse">thinking...</span>}
              </div>

              <div className={`p-2 rounded-lg border transition-all ${activeAgent === 'goal' ? 'bg-indigo-500/10 border-indigo-500/30 text-white font-bold' : 'bg-black/20 border-white/5 text-gray-500'}`}>
                <div className="flex items-center gap-1.5">
                  <Target className={`w-3.5 h-3.5 ${activeAgent === 'goal' ? 'text-indigo-400' : 'text-gray-500'}`} />
                  <span>Goal / Career</span>
                </div>
                {activeAgent === 'goal' && <span className="text-[7.5px] text-indigo-300 block mt-1 font-mono uppercase tracking-widest font-extrabold animate-pulse">thinking...</span>}
              </div>

              <div className={`p-2 rounded-lg border transition-all ${activeAgent === 'balance' ? 'bg-rose-500/10 border-rose-500/30 text-white font-bold' : 'bg-black/20 border-white/5 text-gray-500'}`}>
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className={`w-3.5 h-3.5 ${activeAgent === 'balance' ? 'text-rose-400' : 'text-gray-500'}`} />
                  <span>Life Balance</span>
                </div>
                {activeAgent === 'balance' && <span className="text-[7.5px] text-rose-300 block mt-1 font-mono uppercase tracking-widest font-extrabold animate-pulse">thinking...</span>}
              </div>
            </div>
          </div>

          {/* Feature 1: Context Memory Panel */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-gray-500 font-black uppercase tracking-wider block">Context Memory Variables</span>
              <TrendingUp className="w-3.5 h-3.5 text-gray-500" />
            </div>
            
            <div className="p-3.5 bg-black/50 border border-white/5 rounded-xl space-y-2.5 text-[11px]">
              <div className="flex justify-between items-center text-gray-400 font-bold">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-violet-400" /> Pending Workload:</span>
                <span className="text-white font-mono">{tasks.filter(t => t.status !== 'completed').length} Tasks</span>
              </div>
              <div className="flex justify-between items-center text-gray-400 font-bold">
                <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Academic Target:</span>
                <span className="text-white">DSA Assignment (Due)</span>
              </div>
              <div className="flex justify-between items-center text-gray-400 font-bold">
                <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-amber-400" /> Career Target:</span>
                <span className="text-white">Hackathon PPT & Application</span>
              </div>
              <div className="flex justify-between items-center text-gray-400 font-bold">
                <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-400" /> Sleep Debt Buffer:</span>
                <span className="text-rose-300 font-mono">{lifeOSState.sleepHours ? Math.max(0, 8 - lifeOSState.sleepHours).toFixed(1) : "1.8"} Hours</span>
              </div>
              <div className="flex justify-between items-center text-gray-400 font-bold">
                <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-emerald-400" /> Burnout Risk:</span>
                <span className="text-amber-400 font-mono">78% (Elevated)</span>
              </div>
            </div>
          </div>

          {/* Database & Memory Retrieval Log Visualization */}
          <div className="space-y-3.5">
            <span className="text-[9px] text-gray-500 font-black uppercase block tracking-wider flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5" />
              Memory Retrieval Logs
            </span>
            <div className="p-3 bg-black/60 border border-white/5 rounded-xl font-mono text-[9px] space-y-1.5 leading-relaxed text-gray-400">
              <p className="text-emerald-400 font-bold">• [SUCCESS] RETRIEVED_USER_TASKS_DATABASE</p>
              <p className="text-violet-300">• [MEM_INJECT] Injecting SleepScore: 68 & StressIndex: High</p>
              <p className="text-indigo-400">• [ROUTING] Query matched "DSA, Hackathon, Gym" → BalanceAgent</p>
              <p className="text-emerald-400">• [AUTONOMOUS] Negotiating schedule: Gym protected at 4:30 PM</p>
            </div>
          </div>
        </div>

        {/* Clear instruction footer */}
        <div className="p-3.5 bg-violet-950/20 border border-violet-500/10 rounded-xl flex items-start gap-2.5">
          <Brain className="w-5 h-5 text-violet-400 shrink-0 mt-0.5 animate-pulse" />
          <p className="text-[10.5px] text-gray-300 leading-relaxed font-semibold">
            <span className="text-violet-300 font-black">ActNow AI Voice Command:</span> Click the microphone or type any prompt. The companion will analyze your workload, calculate focus/stress, and build structured, interactive schedules.
          </p>
        </div>
      </div>

    </div>
  );
}
