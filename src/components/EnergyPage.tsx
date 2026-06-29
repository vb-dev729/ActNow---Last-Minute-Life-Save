import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Play, Pause, RotateCcw, Sparkles, Coffee, Clock, Info, Volume2, VolumeX, Moon 
} from 'lucide-react';

interface EnergyPageProps {
  energyMap: { hour: string; level: number }[];
}

export default function EnergyPage({ energyMap: initialEnergyMap }: EnergyPageProps) {
  const [energyData, setEnergyData] = useState(initialEnergyMap);
  const [pomodoroTime, setPomodoroTime] = useState(1500); // 25 mins
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [ambientSound, setAmbientSound] = useState(false);

  // Energy click modification
  const handleModifyEnergy = (index: number, currentLevel: number) => {
    const updated = [...energyData];
    // Cycle levels 40 -> 60 -> 80 -> 100 -> 40
    let nextLevel = 40;
    if (currentLevel === 40) nextLevel = 60;
    else if (currentLevel === 60) nextLevel = 80;
    else if (currentLevel === 80) nextLevel = 100;
    
    updated[index] = { ...updated[index], level: nextLevel };
    setEnergyData(updated);
  };

  // Pomodoro countdown timer
  useEffect(() => {
    let interval: any;
    if (pomodoroRunning) {
      interval = setInterval(() => {
        setPomodoroTime(prev => {
          if (prev <= 1) {
            setPomodoroRunning(false);
            alert("Pomodoro session completed! Stand up, stretch, and grab a water refill.");
            return 1500;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pomodoroRunning]);

  const formatPomodoro = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Sound effect simulation
  const toggleAmbientSound = () => {
    setAmbientSound(!ambientSound);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white p-6 md:p-8 space-y-8" id="energy-page">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-yellow-400">BIORHYTHMIC FOCUS OSCILLATOR</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase font-sans">
            Energy & Focus
          </h1>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            Map cognitive performance windows. Align deep focus tasks with natural neural peak bands and buffer afternoon circadian lows.
          </p>
        </div>

        {/* Global state widget */}
        <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
            <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400/20" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Cognitive Peak Window</span>
            <span className="text-sm font-extrabold text-yellow-400 font-mono">
              6:00 PM - 9:00 PM (Optimal)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Energy Timeline Map */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Interactive timeline bar chart */}
          <div className="bg-[#090b14] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-yellow-500/10 transition-all duration-500" />
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-yellow-400" />
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Hourly Cognitive Power</h3>
                  <span className="text-[10px] text-gray-400 font-semibold font-mono">CLICK BARS TO TOGGLE ESTIMATES</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-gray-500 font-bold uppercase bg-white/5 px-2.5 py-1 rounded">
                CIRCADIAN ZONE
              </span>
            </div>

            {/* Interactive bar graph */}
            <div className="relative bg-black/40 border border-white/5 rounded-2xl p-6 h-56 flex items-end justify-between overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-yellow-950/10 to-transparent pointer-events-none" />
              
              <div className="relative z-10 w-full h-full flex items-end justify-between gap-2.5">
                {energyData.map((slot, i) => {
                  const percent = slot.level;
                  const isPeak = slot.level >= 80;
                  const isLow = slot.level <= 40;
                  return (
                    <div 
                      key={i} 
                      onClick={() => handleModifyEnergy(i, slot.level)}
                      className="flex-1 flex flex-col items-center group h-full justify-end cursor-pointer"
                    >
                      {/* Hover stats tooltip */}
                      <span className="opacity-0 group-hover:opacity-100 absolute bottom-36 bg-slate-900 border border-white/10 text-[9px] font-mono text-white font-bold py-1 px-2 rounded transition-opacity duration-200">
                        Level: {slot.level}%
                      </span>

                      {/* Bar fill */}
                      <motion.div 
                        className={`w-full max-w-[32px] rounded-t-lg relative transition-all duration-300 ${
                          isPeak 
                            ? 'bg-gradient-to-t from-amber-600 to-yellow-400' 
                            : isLow 
                              ? 'bg-gradient-to-t from-orange-950/40 to-orange-500/45'
                              : 'bg-gradient-to-t from-yellow-900/60 to-yellow-500/60'
                        }`}
                        initial={{ height: 0 }}
                        animate={{ height: `${percent * 0.7}%` }}
                        transition={{ duration: 0.8, delay: i * 0.05 }}
                      >
                        <div className="absolute top-1 inset-x-0 flex justify-center">
                          <span className="text-[8px] font-black font-mono text-white/50">{slot.level}</span>
                        </div>
                      </motion.div>

                      {/* Time Label */}
                      <span className="text-[9px] font-extrabold font-mono text-gray-500 mt-2.5 group-hover:text-white transition-colors">
                        {slot.hour}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-gray-400 font-semibold bg-white/[0.01] p-3 rounded-xl">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-yellow-400 shrink-0" />
                Peak Focus Window (80% - 100%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-orange-500/40 shrink-0" />
                Circadian Low Buffer
              </span>
            </div>
          </div>

          {/* Productivity highlights */}
          <div className="bg-[#090b14] border border-white/5 p-6 rounded-2xl">
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3.5">Circadian Efficiency Zones</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-yellow-950/10 border border-yellow-500/10 rounded-xl">
                <span className="text-[9px] font-black font-mono text-yellow-400 uppercase tracking-widest block mb-1">OPTIMAL BRAIN WINDOW</span>
                <h5 className="text-xs font-bold text-white mb-1">6 PM - 9 PM</h5>
                <p className="text-[11px] text-gray-400 leading-relaxed font-semibold">
                  Cortisol and focus markers are elevated. Best suited for complex logic, algorithms, or deep creative coding.
                </p>
              </div>

              <div className="p-3.5 bg-orange-950/10 border border-orange-500/10 rounded-xl">
                <span className="text-[9px] font-black font-mono text-orange-400 uppercase tracking-widest block mb-1">FATIGUE HAZARD ACCLAIM</span>
                <h5 className="text-xs font-bold text-white mb-1">2 PM - 4 PM</h5>
                <p className="text-[11px] text-gray-400 leading-relaxed font-semibold">
                  Circadian dip induces mental lag. Avoid deep focus work. Best for secondary emails, simple tasks, or quick walks.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Pomodoro timer & dynamic sound machine */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Orbital Focus Pomodoro */}
          <div className="bg-[#090b14] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Task Pacing Pomodoro</h4>
              </div>
              <span className="text-[10px] text-gray-500 font-black font-mono uppercase">INTERVALS: 25M / 5M</span>
            </div>

            {/* Glowing countdown circle */}
            <div className="relative h-44 flex flex-col items-center justify-center bg-black/40 border border-white/5 rounded-2xl overflow-hidden mb-4">
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none" />
              
              {/* Spinning / glowing border container */}
              <motion.div 
                className="w-28 h-28 rounded-full bg-gradient-to-tr from-yellow-600/10 to-amber-500/15 border border-yellow-400/20 flex flex-col items-center justify-center relative shadow-2xl"
                animate={{ 
                  boxShadow: pomodoroRunning
                    ? `0 0 ${15 + Math.sin(Date.now() / 200) * 8}px rgba(234, 179, 8, 0.2)`
                    : '0 0 10px rgba(234, 179, 8, 0.05)'
                }}
              >
                <span className="text-2xl font-black font-mono text-white tracking-tight">
                  {formatPomodoro(pomodoroTime)}
                </span>
                <span className="text-[8px] text-yellow-400 font-mono font-bold tracking-widest uppercase mt-1">
                  {pomodoroRunning ? 'FOCUS ACTIVE' : 'STANDING BY'}
                </span>
              </motion.div>

              {/* Sound visual waves if active */}
              {ambientSound && (
                <div className="absolute bottom-2 flex items-center gap-1.5">
                  <div className="w-1 h-3 bg-yellow-400 animate-pulse rounded" style={{ animationDelay: '0.1s' }} />
                  <div className="w-1 h-4 bg-yellow-400 animate-pulse rounded" style={{ animationDelay: '0.3s' }} />
                  <div className="w-1 h-2 bg-yellow-400 animate-pulse rounded" style={{ animationDelay: '0.5s' }} />
                  <span className="text-[8px] font-mono text-yellow-300 font-bold uppercase tracking-widest ml-1">Pink Noise Playing</span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="space-y-3">
              <div className="flex gap-2.5">
                <button
                  onClick={() => setPomodoroRunning(!pomodoroRunning)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs tracking-tight transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    pomodoroRunning 
                      ? 'bg-rose-500/20 border border-rose-500/30 text-rose-300' 
                      : 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-extrabold shadow-lg shadow-yellow-500/10'
                  }`}
                >
                  {pomodoroRunning ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause Focus Block</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-black" />
                      <span>Start 25-Min Block</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setPomodoroRunning(false);
                    setPomodoroTime(1500);
                  }}
                  className="p-2.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl transition-all cursor-pointer"
                  title="Reset Pacer"
                >
                  <RotateCcw className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Ambient Sound Trigger */}
              <button
                onClick={toggleAmbientSound}
                className={`w-full py-2 px-3 border rounded-xl text-[10px] font-bold tracking-tight transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  ambientSound 
                    ? 'bg-yellow-500/10 border-yellow-500/25 text-yellow-400' 
                    : 'bg-white/[0.01] border-white/5 text-gray-400 hover:text-gray-200'
                }`}
              >
                {ambientSound ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{ambientSound ? "Mute Cosmic Pink Noise" : "Play Cosmic Focus Noise (Pink Noise)"}</span>
              </button>
            </div>
          </div>

          {/* AI Focus Pacer */}
          <div className="bg-[#090b14] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">AI Sleep-Energy Integrator</h4>
            </div>
            <p className="text-xs text-gray-300 font-medium leading-relaxed">
              Your sleep deficit of <span className="text-rose-400">{(8 - 7.2).toFixed(1)}h</span> can cause cognitive lags during the afternoon. Take a 20-minute restorative power nap at 2 PM to preserve midnight focus capabilities.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
