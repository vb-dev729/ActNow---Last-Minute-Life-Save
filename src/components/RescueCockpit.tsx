import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Clock, Play, Pause, ChevronRight, Volume2, VolumeX, ShieldCheck, HelpCircle, ArrowLeft, Zap, Sparkles } from 'lucide-react';
import { Task, TaskSubStep } from '../types';

interface RescueCockpitProps {
  task: Task;
  onCompleteStep: (taskId: string, stepId: string) => void;
  onExitRescue: () => void;
  onAddFuel: (amount: number) => void;
}

export default function RescueCockpit({ task, onCompleteStep, onExitRescue, onAddFuel }: RescueCockpitProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 min default per milestone
  const [timerRunning, setTimerRunning] = useState(false);
  const [synthPlaying, setSynthPlaying] = useState(false);
  const [vocalsEnabled, setVocalsEnabled] = useState(true);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorLRef = useRef<OscillatorNode | null>(null);
  const oscillatorRRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const steps: TaskSubStep[] = task.subSteps && task.subSteps.length > 0 
    ? task.subSteps 
    : [
        { id: 'rs-1', title: 'Deep purge of distraction: close all tabs, silent phone', durationMin: 15, completed: false },
        { id: 'rs-2', title: 'Draft the core foundation of requirements on paper', durationMin: 25, completed: false },
        { id: 'rs-3', title: 'Produce raw output without self-editing', durationMin: 25, completed: false },
        { id: 'rs-4', title: 'Verify spelling, compile final revision, submit', durationMin: 15, completed: false }
      ];

  const currentStep = steps[activeStepIndex] || steps[0];

  // Sync remaining countdown when step changes
  useEffect(() => {
    setTimeLeft((steps[activeStepIndex]?.durationMin || 25) * 60);
    setTimerRunning(false);
    
    // Vocal Callout
    if (vocalsEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `Initiating Step ${activeStepIndex + 1}: ${steps[activeStepIndex]?.title}. Prepare your workspace.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }, [activeStepIndex, vocalsEnabled]);

  // Timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            onAddFuel(150); // Massive fuel boost on completing a full timer block!
            // Vocal Alarm
            if ('speechSynthesis' in window) {
              window.speechSynthesis.speak(new SpeechSynthesisUtterance("Time is up! Outstanding work. You earned 150 Megawatts. Advance to the next block!"));
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning]);

  // Synthesis Audio Engine using HTML5 Web Audio API
  const toggleSynthMusic = () => {
    if (synthPlaying) {
      // Stop Synth
      if (oscillatorLRef.current) {
        try { oscillatorLRef.current.stop(); } catch(e){}
        oscillatorLRef.current.disconnect();
        oscillatorLRef.current = null;
      }
      if (oscillatorRRef.current) {
        try { oscillatorRRef.current.stop(); } catch(e){}
        oscillatorRRef.current.disconnect();
        oscillatorRRef.current = null;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
      setSynthPlaying(false);
    } else {
      // Start Binaural Space Drone
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Gain node for smooth fade and volume management
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.04, ctx.currentTime); // Low non-intrusive volume
        gainNode.connect(ctx.destination);
        gainNodeRef.current = gainNode;

        // Left Ear: Carrier Frequency (140 Hz)
        const oscL = ctx.createOscillator();
        oscL.type = 'sine';
        oscL.frequency.setValueAtTime(140, ctx.currentTime);
        
        // Right Ear: Carrier Frequency + Offset (148 Hz -> 8Hz Theta waves)
        const oscR = ctx.createOscillator();
        oscR.type = 'sine';
        oscR.frequency.setValueAtTime(148, ctx.currentTime);

        // Simple stereo panning simulation
        const merger = ctx.createChannelMerger(2);
        oscL.connect(merger, 0, 0);
        oscR.connect(merger, 0, 1);
        merger.connect(gainNode);

        oscL.start();
        oscR.start();

        oscillatorLRef.current = oscL;
        oscillatorRRef.current = oscR;
        setSynthPlaying(true);
      } catch (error) {
        console.error("Web Audio API not supported or user gesture required:", error);
      }
    }
  };

  // Cleanup Web Audio nodes on unmount
  useEffect(() => {
    return () => {
      if (oscillatorLRef.current) {
        try { oscillatorLRef.current.stop(); } catch(e){}
        oscillatorLRef.current.disconnect();
      }
      if (oscillatorRRef.current) {
        try { oscillatorRRef.current.stop(); } catch(e){}
        oscillatorRRef.current.disconnect();
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
      }
    };
  }, []);

  const handleStepComplete = () => {
    onCompleteStep(task.id, currentStep.id);
    onAddFuel(80); // Award fuel
    
    // Stagger forward to next step if available
    if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex(prev => prev + 1);
    } else {
      // Completed last step! Trigger major workspace finish
      if ('speechSynthesis' in window) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance("Sensational! You have completed all rescue blocks for this task. You cleared your stress queue!"));
      }
      onAddFuel(250); // Mega reactor boost
      onExitRescue();
    }
  };

  const getPercentageDone = () => {
    const totalSecs = (steps[activeStepIndex]?.durationMin || 25) * 60;
    return ((totalSecs - timeLeft) / totalSecs) * 100;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="bg-gradient-to-b from-slate-950 via-[#0a050f] to-black border-2 border-rose-500/20 rounded-3xl p-6 relative overflow-hidden shadow-2xl shadow-rose-950/20"
      id="rescue-mode-cockpit"
    >
      {/* Decorative Warning Lights */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-rose-500/60 to-transparent animate-pulse" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl animate-pulse pointer-events-none" />

      {/* Cockpit Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4 mb-6">
        <button
          onClick={onExitRescue}
          className="bg-white/5 hover:bg-white/10 text-gray-300 font-bold py-1.5 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Focus Cockpit</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <h2 className="text-xs font-black tracking-widest text-rose-400 uppercase font-mono">Panic Rescue Cockpit Active</h2>
        </div>

        {/* Audio companions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setVocalsEnabled(!vocalsEnabled)}
            className={`p-2 rounded-xl text-xs flex items-center gap-1.5 font-bold border transition-all cursor-pointer ${
              vocalsEnabled 
                ? 'bg-violet-500/10 border-violet-500/20 text-violet-300' 
                : 'bg-white/5 border-white/5 text-gray-400'
            }`}
            title="Toggle Hands-Free Voice Guidelines"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">Voice: {vocalsEnabled ? 'On' : 'Off'}</span>
          </button>

          <button
            onClick={toggleSynthMusic}
            className={`p-2 rounded-xl text-xs flex items-center gap-1.5 font-bold border transition-all cursor-pointer ${
              synthPlaying 
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 animate-pulse' 
                : 'bg-white/5 border-white/5 text-gray-400'
            }`}
            title="Generate Theta-Wave Audio Synth"
          >
            {synthPlaying ? <Volume2 className="w-4 h-4 text-rose-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">Sound: {synthPlaying ? 'Drone Active' : 'Off'}</span>
          </button>
        </div>
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN: Focus Countdown Timer */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-black/40 border border-white/5 rounded-2xl p-6 relative">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-4">Milestone Timer</span>
          
          <div className="relative w-48 h-48 flex items-center justify-center mb-6">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="78"
                className="stroke-white/5"
                strokeWidth="6"
                fill="transparent"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="78"
                className="stroke-rose-500"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 78}
                animate={{ strokeDashoffset: (2 * Math.PI * 78) - (timeLeft / ((steps[activeStepIndex]?.durationMin || 25) * 60)) * (2 * Math.PI * 78) }}
                transition={{ duration: 1, ease: 'linear' }}
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.4))' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center text-center">
              <span className="text-4xl font-mono font-black text-white tracking-widest">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
              <span className="text-[9px] text-rose-400 font-extrabold uppercase mt-1 tracking-widest animate-pulse">
                {timerRunning ? 'CRUSHING FOCUS' : 'PAUSED'}
              </span>
            </div>
          </div>

          <div className="flex gap-3 justify-center w-full">
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className={`flex-1 py-3 px-5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                timerRunning 
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/10' 
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/15'
              }`}
            >
              {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{timerRunning ? 'PAUSE CLOCK' : 'START SPRINT'}</span>
            </button>

            <button
              onClick={() => {
                setTimerRunning(false);
                setTimeLeft((steps[activeStepIndex]?.durationMin || 25) * 60);
              }}
              className="bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 font-bold p-3 rounded-xl text-xs cursor-pointer"
              title="Reset clock"
            >
              Reset
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Action Steps Cockpit Console */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-[9px] bg-rose-500/15 text-rose-300 border border-rose-500/20 px-2 py-0.5 rounded font-black tracking-widest uppercase">
                Active Rescue Task
              </span>
              <h3 className="text-lg font-black text-white mt-1.5">{task.title}</h3>
              <p className="text-xs text-gray-400 font-medium leading-relaxed mt-1">
                {task.description || "Take control. Do not think about the outcome. Just do the immediate physical steps below."}
              </p>
            </div>

            {/* Steps Navigation list */}
            <div className="space-y-3">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-extrabold block">
                Rescue Progression Map ({steps.length} milestones)
              </span>

              <div className="flex flex-col gap-2.5">
                {steps.map((step, idx) => {
                  const isActive = idx === activeStepIndex;
                  const isFinished = idx < activeStepIndex;
                  
                  return (
                    <div
                      key={step.id}
                      onClick={() => !isFinished && setActiveStepIndex(idx)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                        isActive
                          ? 'bg-rose-500/5 border-rose-500/30 text-white ring-1 ring-rose-500/20'
                          : isFinished
                          ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-300 opacity-60'
                          : 'bg-white/5 border-white/5 text-gray-400 cursor-pointer hover:bg-white/[0.08]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                          isActive 
                            ? 'bg-rose-500 text-white shadow-md shadow-rose-500/35' 
                            : isFinished 
                            ? 'bg-emerald-500/20 text-emerald-300' 
                            : 'bg-white/5 text-gray-400'
                        }`}>
                          {isFinished ? '✓' : idx + 1}
                        </div>
                        <span className={`text-xs font-bold truncate ${isActive ? 'text-white' : isFinished ? 'line-through text-gray-500' : ''}`}>
                          {step.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-gray-400 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                          {step.durationMin}m
                        </span>
                        {isActive && (
                          <ChevronRight className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Large Action trigger */}
          <div className="mt-6 border-t border-white/5 pt-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <span className="text-[11px] text-gray-400 font-mono">
                Award on completion: <b className="text-white">+80 MW</b> Fuel
              </span>
            </div>

            <button
              onClick={handleStepComplete}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2.5 px-6 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>MARK SPRINT AS DONE</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
