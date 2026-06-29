import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Moon, Star, Clock, Calculator, ShieldAlert, Sparkles, 
  Check, Play, Coffee, Volume2, Info, BellOff 
} from 'lucide-react';

interface SleepPageProps {
  sleepHours: number;
  setSleepHours: (val: number | ((prev: number) => number)) => void;
  sleepHistory: number[];
  setSleepHistory: (val: number[]) => void;
  requiredSleep: number;
  setRequiredSleep: (val: number) => void;
  actualSleepInput: number;
  setActualSleepInput: (val: number) => void;
  setHealthScore: (val: number | ((prev: number) => number)) => void;
}

export default function SleepPage({
  sleepHours, setSleepHours,
  sleepHistory, setSleepHistory,
  requiredSleep, setRequiredSleep,
  actualSleepInput, setActualSleepInput,
  setHealthScore
}: SleepPageProps) {
  const [showCalculator, setShowCalculator] = useState(true);
  const [protectionActive, setProtectionActive] = useState(false);
  const [protectionOutput, setProtectionOutput] = useState<string | null>(null);
  const [simulatingAlert, setSimulatingAlert] = useState(false);

  // Computed sleep debt metrics
  const dailySleepDebt = Math.max(0, requiredSleep - actualSleepInput);
  const weeklySleepDebt = Math.round(dailySleepDebt * 7);

  // Trigger test for sleep protection mode
  const handleActivateProtection = () => {
    setSimulatingAlert(true);
    setProtectionOutput("Analyzing incoming task load and cortisol trends...");
    
    setTimeout(() => {
      setProtectionActive(true);
      setProtectionOutput("⚠ CRITICAL THRESHOLD TRIGGERED: Midnight exam prep and high fatigue indexes. ActNow has routed sleep blocks automatically. Google Calendar holds generated: Sleep locked 11 PM - 7 AM.");
      setSimulatingAlert(false);
      setHealthScore(prev => Math.min(100, prev + 5));
    }, 1500);
  };

  const handleDeactivateProtection = () => {
    setProtectionActive(false);
    setProtectionOutput(null);
  };

  const handleUpdateSleep = (val: number) => {
    setActualSleepInput(val);
    setSleepHours(val);
    // Update last day of sleep history
    const updated = [...sleepHistory];
    updated[updated.length - 1] = val;
    setSleepHistory(updated);
  };

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="min-h-screen bg-[#030712] text-white p-6 md:p-8 space-y-8" id="sleep-page">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-400">REST & AMBIENT PROTECTION MATRIX</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase font-sans">
            Sleep Protection
          </h1>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            Mitigate cumulative sleep debt, calculate cognitive fatigue indexes, and trigger passive shielding to safeguard deep sleep windows.
          </p>
        </div>

        {/* Dynamic sleep quality card */}
        <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Moon className="w-6 h-6 text-blue-400 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Sleep Quality Index</span>
            <span className="text-sm font-extrabold text-blue-400 font-mono">
              {actualSleepInput >= requiredSleep ? 'EXCELLENT (100%)' : `${Math.round((actualSleepInput / requiredSleep) * 100)}% Optimal`}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Column Left: Sleep Debt Calculator & Controls */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Interactive Sleep Debt Calculator */}
          <div className="bg-[#090b14] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Sleep Debt Engine</h3>
                  <span className="text-[10px] text-gray-400 font-semibold font-mono">DYNAMIC REST OVERHEAD RATIOS</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Target/Required Sleep */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                  <span>Required Target Sleep:</span>
                  <span className="text-blue-400 font-mono text-sm">{requiredSleep} hours</span>
                </div>
                <input 
                  type="range" 
                  min="6" 
                  max="10" 
                  step="0.5"
                  value={requiredSleep}
                  onChange={(e) => setRequiredSleep(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-bold font-mono">
                  <span>6.0h (Minimum)</span>
                  <span>8.0h (Recommended)</span>
                  <span>10.0h (High-Physical)</span>
                </div>
              </div>

              {/* Actual Rest Logged */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                  <span>Actual Sleep (Last Night):</span>
                  <span className="text-indigo-400 font-mono text-sm">{actualSleepInput} hours</span>
                </div>
                <input 
                  type="range" 
                  min="3" 
                  max="10" 
                  step="0.1"
                  value={actualSleepInput}
                  onChange={(e) => handleUpdateSleep(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-bold font-mono">
                  <span>3.0h (Severe Deprivation)</span>
                  <span>7.0h (Average)</span>
                  <span>10.0h (Fully Recharged)</span>
                </div>
              </div>

              {/* dynamic score calculation panel */}
              <div className="p-4 bg-blue-950/20 border border-blue-500/10 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-blue-300 font-black tracking-widest uppercase block mb-1">CUMULATIVE SLEEP DEBT</span>
                  {dailySleepDebt > 0 ? (
                    <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                      You are operating under a deficit of <span className="text-rose-400 font-extrabold">{dailySleepDebt.toFixed(1)}h</span> daily.
                    </p>
                  ) : (
                    <p className="text-xs text-emerald-400 leading-relaxed font-extrabold">
                      No current sleep debt! Excellent biological recovery.
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black font-mono text-rose-400">{weeklySleepDebt}h</span>
                  <span className="text-[9px] text-gray-500 font-bold block">Deficit / Week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sleep Protection Mode Shield */}
          <div className="bg-[#090b14] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <BellOff className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Passive Shielding Engine</h4>
              </div>
              <span className="text-[10px] font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold">
                PRO ACTIVE
              </span>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed font-semibold mb-4">
              When enabled, our autonomous scheduler intercepts work commands during circadian low points and forces deep sleep protection blocks onto Google Calendar.
            </p>

            <AnimatePresence mode="wait">
              {protectionOutput && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="p-3.5 bg-blue-950/40 border border-blue-500/20 rounded-xl text-[11px] font-semibold leading-relaxed text-blue-300 mb-4"
                >
                  {protectionOutput}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-2.5">
              {!protectionActive ? (
                <button
                  onClick={handleActivateProtection}
                  disabled={simulatingAlert}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs tracking-tight transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/10 disabled:opacity-50"
                >
                  {simulatingAlert ? "Running Diagnostics..." : "Activate Sleep Shield (Test Mode)"}
                </button>
              ) : (
                <button
                  onClick={handleDeactivateProtection}
                  className="flex-1 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 font-extrabold text-xs tracking-tight transition-all cursor-pointer"
                >
                  Deactivate Sleep Shield
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Column Right: Animated Sleep Quality Graphs & Sleep Coaching */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Animated Sleep history Visualizer */}
          <div className="bg-[#090b14] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Weekly Circadian Log</span>
            </h4>

            {/* Beautiful SVG animated graph with star background */}
            <div className="relative bg-black/40 border border-white/5 rounded-2xl p-5 h-48 flex items-end justify-between overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/10 to-transparent pointer-events-none" />
              
              {/* Star fields inside graph */}
              <div className="absolute inset-0 overflow-hidden opacity-35">
                {[...Array(12)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="absolute text-blue-200 fill-blue-300/10"
                    style={{
                      width: `${Math.random() * 6 + 4}px`,
                      height: `${Math.random() * 6 + 4}px`,
                      top: `${Math.random() * 70}%`,
                      left: `${Math.random() * 90}%`,
                      animation: `pulse ${Math.random() * 3 + 2}s infinite`
                    }}
                  />
                ))}
              </div>

              {/* Bar charts with hover effect and text inside */}
              <div className="relative z-10 w-full h-full flex items-end justify-between gap-1">
                {sleepHistory.map((val, i) => {
                  const percent = (val / 10) * 100;
                  const isLow = val < requiredSleep;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end cursor-pointer">
                      {/* Floating tooltip */}
                      <span className="opacity-0 group-hover:opacity-100 absolute bottom-32 bg-slate-900 border border-white/10 text-[9px] font-mono text-white font-bold py-1 px-2 rounded transition-opacity duration-200">
                        {val.toFixed(1)}h
                      </span>

                      {/* Bar fill */}
                      <motion.div 
                        className={`w-full max-w-[24px] rounded-t-md relative transition-colors duration-300 ${
                          isLow 
                            ? 'bg-gradient-to-t from-indigo-950 to-indigo-500/80 group-hover:to-indigo-400' 
                            : 'bg-gradient-to-t from-blue-900 to-blue-400 group-hover:to-blue-300'
                        }`}
                        initial={{ height: 0 }}
                        animate={{ height: `${percent * 0.7}%` }}
                        transition={{ duration: 1, delay: i * 0.08 }}
                      >
                        <div className="absolute top-1 inset-x-0 flex justify-center">
                          <span className="text-[8px] font-black font-mono text-white/50">{val.toFixed(0)}</span>
                        </div>
                      </motion.div>

                      {/* Day Label */}
                      <span className="text-[9px] font-bold font-mono text-gray-500 mt-2 group-hover:text-white transition-colors">
                        {daysOfWeek[i]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-gray-400 font-semibold bg-white/[0.01] p-3 rounded-xl">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-blue-500 shrink-0" />
                Optimal Rest ({requiredSleep}h)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-indigo-500/80 shrink-0" />
                Sleep Depleted
              </span>
            </div>
          </div>

          {/* Restorative Sleep Coach tips */}
          <div className="bg-[#090b14] border border-white/5 rounded-2xl p-6 space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Coffee className="w-4 h-4 text-amber-400" />
              <span>Sleep Coach Dynamic Advice</span>
            </h4>
            <div className="space-y-3 text-xs leading-relaxed text-gray-400 font-semibold">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>Avoid taking caffeine after 2:30 PM today to safeguard your sleep latency buffer.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>Since your average sleep quality is <span className="text-indigo-400">72%</span> this week, scheduling an evening meditation before 10 PM is highly recommended.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>Keep your workspace lighting dim after 9 PM. Melatonin production is highly sensitive to blue screens.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
