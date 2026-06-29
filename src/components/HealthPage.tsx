import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Activity, Droplet, Footprints, Flame, Smile, 
  Timer, Sparkles, Play, Pause, RotateCcw, AlertCircle, Plus 
} from 'lucide-react';

interface HealthPageProps {
  healthScore: number;
  setHealthScore: (val: number | ((prev: number) => number)) => void;
  waterIntake: number;
  setWaterIntake: (val: number | ((prev: number) => number)) => void;
  heartRate: number;
  setHeartRate: (val: number | ((prev: number) => number)) => void;
  steps: number;
  setSteps: (val: number | ((prev: number) => number)) => void;
  calories: number;
  setCalories: (val: number | ((prev: number) => number)) => void;
  mood: string;
  setMood: (val: string) => void;
  mindfulnessMinutes: number;
  setMindfulnessMinutes: (val: number | ((prev: number) => number)) => void;
}

export default function HealthPage({
  healthScore, setHealthScore,
  waterIntake, setWaterIntake,
  heartRate, setHeartRate,
  steps, setSteps,
  calories, setCalories,
  mood, setMood,
  mindfulnessMinutes, setMindfulnessMinutes
}: HealthPageProps) {
  // Mindfulness state
  const [timerRunning, setTimerRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 mins default
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Hold-out'>('Inhale');
  const [breathProgress, setBreathProgress] = useState(0);

  // Heart rate canvas animation
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mindfulness Timer and Breathing Cycle
  useEffect(() => {
    let interval: any;
    if (timerRunning) {
      interval = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            setMindfulnessMinutes(m => m + 5);
            setHealthScore(s => Math.min(100, s + 3));
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, setMindfulnessMinutes, setHealthScore]);

  // Breathing Loop (4s inhale, 4s hold, 4s exhale, 4s hold-out)
  useEffect(() => {
    let breathInterval: any;
    if (timerRunning) {
      let tick = 0;
      breathInterval = setInterval(() => {
        tick = (tick + 1) % 16;
        if (tick < 4) {
          setBreathPhase('Inhale');
          setBreathProgress(tick / 4);
        } else if (tick < 8) {
          setBreathPhase('Hold');
          setBreathProgress(1);
        } else if (tick < 12) {
          setBreathPhase('Exhale');
          setBreathProgress((12 - tick) / 4);
        } else {
          setBreathPhase('Hold-out');
          setBreathProgress(0);
        }
      }, 1000);
    } else {
      setBreathPhase('Inhale');
      setBreathProgress(0.1);
    }
    return () => clearInterval(breathInterval);
  }, [timerRunning]);

  // Heart Rate Pulse Line SVG or Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let x = 0;
    const points: number[] = [];
    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      ctx.fillStyle = 'rgba(7, 9, 19, 0.2)';
      ctx.fillRect(0, 0, width, height);

      ctx.beginPath();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#f87171';

      // Draw standard ECG rhythm line
      for (let i = 0; i < width; i++) {
        const offset = (x + i) % 150;
        let y = height / 2;
        
        // Simulating ventricular depolarization pulse
        if (offset > 40 && offset < 44) {
          y -= (offset - 40) * 8; // R peak
        } else if (offset >= 44 && offset < 48) {
          y += (offset - 44) * 10; // S wave deep
        } else if (offset >= 48 && offset < 54) {
          y -= (offset - 48) * 3; // return to normal
        } else if (offset > 80 && offset < 95) {
          y -= Math.sin((offset - 80) / 15 * Math.PI) * 6; // T wave
        }

        if (i === 0) {
          ctx.moveTo(i, y);
        } else {
          ctx.lineTo(i, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow

      x = (x + 2) % 3000;
      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [heartRate]);

  const addWater = (amount: number) => {
    setWaterIntake(prev => {
      const next = Math.round((prev + amount) * 10) / 10;
      return next > 6.0 ? 6.0 : next;
    });
    setHealthScore(prev => Math.min(100, prev + 1));
  };

  const addSteps = () => {
    setSteps(prev => prev + 1500);
    setCalories(prev => prev + 85);
    setHealthScore(prev => Math.min(100, prev + 2));
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white p-6 md:p-8 space-y-8" id="health-page">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-400">BIOMETRIC ANALYSIS HUB</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase font-sans">
            Health & Wellbeing
          </h1>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            Real-time physical buffers, dynamic hydration telemetry, cardiovascular resonance, and mental state monitors.
          </p>
        </div>

        {/* Global Score Indicator */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-rose-500/10 to-violet-500/10 border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-xl"
        >
          <div className="relative flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="28" className="stroke-white/5" strokeWidth="4" fill="transparent" />
              <motion.circle 
                cx="32" cy="32" r="28" 
                className="stroke-rose-500" 
                strokeWidth="4" 
                fill="transparent"
                strokeDasharray={175}
                initial={{ strokeDashoffset: 175 }}
                animate={{ strokeDashoffset: 175 - (175 * healthScore) / 100 }}
                transition={{ duration: 1 }}
              />
            </svg>
            <span className="absolute text-sm font-black font-mono text-white">{healthScore}%</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Bio-Harmony Score</span>
            <span className="text-sm font-extrabold text-white">System Synchronized</span>
          </div>
        </motion.div>
      </div>

      {/* Grid of Interactive Health Subcomponents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Hydration & Cardiac Rhythm */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Hydration Telemetry */}
          <div className="bg-[#090b14] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/10 transition-all duration-500" />
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <Droplet className="w-5 h-5 text-blue-400 fill-blue-400/20" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Hydration Monitor</h3>
                  <span className="text-[10px] text-gray-400 font-semibold font-mono">WATER BUFFER & OSMOTIC METRIC</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black font-mono text-blue-400">{waterIntake.toFixed(1)}L</span>
                <span className="text-xs text-gray-500 font-bold font-mono"> / 3.0L</span>
              </div>
            </div>

            {/* Hydration Animation Tube */}
            <div className="relative h-28 bg-white/[0.02] border border-white/5 rounded-2xl mb-6 flex flex-col justify-end overflow-hidden">
              <motion.div 
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-600/30 to-sky-500/20 border-t border-sky-400/30"
                style={{ height: `${(waterIntake / 3.0) * 100}%` }}
                layout
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
              >
                {/* Floating Bubbles */}
                <div className="absolute inset-0 overflow-hidden opacity-40">
                  {[...Array(6)].map((_, i) => (
                    <span 
                      key={i} 
                      className="absolute bg-blue-300 rounded-full animate-pulse"
                      style={{
                        width: `${Math.random() * 8 + 4}px`,
                        height: `${Math.random() * 8 + 4}px`,
                        bottom: `${Math.random() * 80}%`,
                        left: `${Math.random() * 90}%`,
                        animationDelay: `${i * 0.4}s`
                      }}
                    />
                  ))}
                </div>
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-xs font-bold text-sky-200 tracking-wider font-mono bg-[#030712]/60 px-3 py-1 rounded-full border border-sky-500/10 shadow-lg">
                  {Math.round((waterIntake / 3.0) * 100)}% HYDRATED
                </span>
              </div>
            </div>

            {/* Quick Intake Controls */}
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => addWater(0.25)}
                className="py-2.5 px-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-[11px] font-bold text-gray-300 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-sky-400" />
                <span>+250ml Glass</span>
              </button>
              <button 
                onClick={() => addWater(0.5)}
                className="py-2.5 px-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-[11px] font-bold text-gray-300 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-sky-400" />
                <span>+500ml Bottle</span>
              </button>
              <button 
                onClick={() => setWaterIntake(0)}
                className="py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/15 border border-rose-500/15 text-[11px] font-bold text-rose-300 transition-all cursor-pointer"
              >
                Reset Daily
              </button>
            </div>
          </div>

          {/* 2. Cardiac Rhythm Monitor */}
          <div className="bg-[#090b14] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-rose-500/10 transition-all duration-500" />
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                  <Activity className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Cardiovascular Resonance</h3>
                  <span className="text-[10px] text-gray-400 font-semibold font-mono">HRV BUFFER & PULSE FREQUENCY</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.div 
                  animate={{ scale: [1, 1.25, 1] }} 
                  transition={{ repeat: Infinity, duration: 60 / heartRate }}
                  className="w-4 h-4 text-rose-500 fill-rose-500"
                >
                  <Heart className="w-4 h-4" />
                </motion.div>
                <span className="text-2xl font-black font-mono text-rose-500">{heartRate}</span>
                <span className="text-[10px] text-gray-500 font-bold font-mono">BPM</span>
              </div>
            </div>

            {/* ECG Animated Canvas */}
            <div className="relative bg-black/40 border border-white/5 rounded-2xl overflow-hidden mb-6 h-28">
              <canvas ref={canvasRef} width="600" height="110" className="w-full h-full" />
              <div className="absolute bottom-2 left-3 bg-[#030712]/80 border border-white/5 rounded-md px-2 py-0.5 text-[9px] font-mono text-gray-400">
                PULSE TELEMETRY: GREEN ZONE
              </div>
            </div>

            {/* Cardiac Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.01] border border-white/5 p-3.5 rounded-xl">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Pulse Modifier</span>
                <span className="text-[11px] text-gray-500 font-semibold leading-relaxed">Simulate a high-stress moment or log current physical status.</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setHeartRate(prev => Math.max(50, prev - 5))}
                  className="px-2.5 py-1 rounded bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-[10px] font-bold text-gray-400 hover:text-white transition-all cursor-pointer"
                >
                  Lower BPM
                </button>
                <button 
                  onClick={() => setHeartRate(prev => Math.min(150, prev + 5))}
                  className="px-2.5 py-1 rounded bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-[10px] font-bold text-gray-400 hover:text-white transition-all cursor-pointer"
                >
                  Raise BPM
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Step Tracking, Mood, Mindfulness Timer */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 3. Physical Steps & Calories */}
          <div className="bg-[#090b14] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <Footprints className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Step Telemetry</h4>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                Daily Goal: 10,000
              </span>
            </div>

            <div className="flex items-end justify-between mb-3.5">
              <div>
                <span className="text-2xl font-black font-mono text-white">{steps.toLocaleString()}</span>
                <span className="text-xs text-gray-400 font-bold font-mono"> steps today</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-amber-400 font-mono flex items-center gap-1 justify-end">
                  <Flame className="w-3.5 h-3.5 fill-amber-500/20" />
                  {calories} kcal
                </span>
                <span className="text-[9px] text-gray-500 font-bold block">Estimated MetBurn</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-white/[0.03] border border-white/5 rounded-full overflow-hidden mb-4 relative">
              <motion.div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                style={{ width: `${Math.min(100, (steps / 10000) * 100)}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (steps / 10000) * 100)}%` }}
                transition={{ duration: 1 }}
              />
            </div>

            <button 
              onClick={addSteps}
              className="w-full py-2 px-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-[11px] font-bold text-gray-300 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Log +1,500 Steps (Walking Session)</span>
            </button>
          </div>

          {/* 4. Mood & Resonance Selector */}
          <div className="bg-[#090b14] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3.5 flex items-center gap-2">
              <Smile className="w-4 h-4 text-violet-400" />
              <span>Mind Resonance (Mood)</span>
            </h4>
            <div className="grid grid-cols-4 gap-2.5 mb-4">
              {['Excellent', 'Good', 'Stressed', 'Exhausted'].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMood(m);
                    if (m === 'Excellent') setHealthScore(s => Math.min(100, s + 2));
                  }}
                  className={`py-2 px-1 rounded-xl border text-[10px] font-bold tracking-tight transition-all text-center cursor-pointer ${
                    mood === m 
                      ? 'bg-violet-500/20 border-violet-400 text-white shadow-lg' 
                      : 'bg-white/[0.01] border-white/5 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {m === 'Excellent' && '🌟 '}
                  {m === 'Good' && '😊 '}
                  {m === 'Stressed' && '⚡ '}
                  {m === 'Exhausted' && '💤 '}
                  {m}
                </button>
              ))}
            </div>
            <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl text-[10px] text-gray-400 leading-relaxed font-semibold">
              Current state logged as <span className="text-violet-400 font-extrabold font-mono uppercase">{mood}</span>. Syncing real-time neurological fatigue scores with the AI Schedule engine.
            </div>
          </div>

          {/* 5. Mindfulness Breathing Engine */}
          <div className="bg-[#090b14] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-violet-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Mindfulness Breathing Engine</h4>
              </div>
              <span className="text-[10px] text-gray-500 font-black font-mono uppercase">{mindfulnessMinutes} min logged today</span>
            </div>

            {/* Floating Breath Ball Visualizer */}
            <div className="relative h-44 flex flex-col items-center justify-center bg-black/40 border border-white/5 rounded-2xl overflow-hidden mb-4">
              <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent pointer-events-none" />
              
              {/* Dynamic Breathing Bubble */}
              <motion.div 
                className="rounded-full bg-gradient-to-tr from-violet-600/30 to-fuchsia-500/30 border border-violet-400/30 flex items-center justify-center relative shadow-2xl"
                style={{ width: 100, height: 100 }}
                animate={{ 
                  scale: timerRunning 
                    ? (breathPhase === 'Inhale' ? 1.6 : breathPhase === 'Hold' ? 1.6 : breathPhase === 'Exhale' ? 0.9 : 0.9) 
                    : 1.0,
                  boxShadow: timerRunning
                    ? `0 0 ${breathProgress * 30 + 10}px rgba(139, 92, 246, 0.3)`
                    : '0 0 10px rgba(139, 92, 246, 0.1)'
                }}
                transition={{ duration: 4, ease: "easeInOut" }}
              >
                <div className="text-center">
                  <span className="text-[11px] font-black tracking-widest text-white uppercase font-mono block">
                    {timerRunning ? breathPhase : 'Ready'}
                  </span>
                  {timerRunning && (
                    <span className="text-[8px] text-violet-300 font-semibold uppercase tracking-wider block">
                      {breathPhase === 'Inhale' ? 'Breathe In' : breathPhase === 'Hold' ? 'Hold Breath' : breathPhase === 'Exhale' ? 'Exhale' : 'Hold'}
                    </span>
                  )}
                </div>
              </motion.div>
              
              <div className="absolute bottom-3 text-[10px] font-mono text-gray-400 font-bold tracking-tight">
                {formatTime(secondsLeft)} Remaining
              </div>
            </div>

            {/* Mindfulness controls */}
            <div className="flex gap-2.5">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs tracking-tight transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  timerRunning 
                    ? 'bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:bg-rose-500/30' 
                    : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/10'
                }`}
              >
                {timerRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-white/10" />
                    <span>Pause Exercise</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white/10" />
                    <span>Start 5-Min Breathing</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  setTimerRunning(false);
                  setSecondsLeft(300);
                }}
                className="p-2.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl transition-all cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
