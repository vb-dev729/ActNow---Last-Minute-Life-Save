import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dumbbell, Flame, Footprints, Sparkles, Plus, Check, Play, 
  Pause, RotateCcw, Award, Zap, Compass, CheckCircle2, ChevronRight, AlertCircle 
} from 'lucide-react';

interface FitnessPageProps {
  workoutCompleted: boolean;
  setWorkoutCompleted: (val: boolean) => void;
  steps: number;
  setSteps: (val: number | ((prev: number) => number)) => void;
  calories: number;
  setCalories: (val: number | ((prev: number) => number)) => void;
  setHealthScore: (val: number | ((prev: number) => number)) => void;
}

export default function FitnessPage({
  workoutCompleted, setWorkoutCompleted,
  steps, setSteps,
  calories, setCalories,
  setHealthScore
}: FitnessPageProps) {
  // Weekly Workout Days check state
  const [workoutDays, setWorkoutDays] = useState([
    { day: "Mon", completed: true },
    { day: "Tue", completed: false },
    { day: "Wed", completed: true },
    { day: "Thu", completed: false },
    { day: "Fri", completed: true },
    { day: "Sat", completed: false },
    { day: "Sun", completed: false }
  ]);

  // Workout Timer state
  const [exerciseTimer, setExerciseTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);

  // Target values
  const [targetWeight, setTargetWeight] = useState(74.5);
  const [currentWeight, setCurrentWeight] = useState(75.8);

  const toggleWorkoutDay = (idx: number) => {
    const updated = [...workoutDays];
    updated[idx].completed = !updated[idx].completed;
    setWorkoutDays(updated);
    
    // Recalculate workout completed today (Sunday for example) or general state
    const trueCount = updated.filter(d => d.completed).length;
    setWorkoutCompleted(trueCount > 3);
    setHealthScore(prev => Math.min(100, prev + 3));
  };

  const exerciseRoutine = [
    { name: "Dynamic Warmup", duration: 180, desc: "Arm swings, high knees, light stretching" },
    { name: "Deadlifts (Warmup & Work Sets)", duration: 600, desc: "3 sets x 5 reps to build baseline physical strength" },
    { name: "Weighted Pull-ups", duration: 420, desc: "3 sets x 8 reps for upper body posterior chain strength" },
    { name: "Dumbbell Overhead Press", duration: 420, desc: "3 sets x 10 reps targeting shoulder mobility" },
    { name: "Core Planks", duration: 180, desc: "2 sets x 90 seconds static stabilization hold" },
    { name: "Cool Down Foam Rolling", duration: 240, desc: "Promote blood flow, trigger lactic flushing" }
  ];

  // Workout timer engine
  useEffect(() => {
    let interval: any;
    if (timerRunning) {
      interval = setInterval(() => {
        setExerciseTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleLogActiveWorkout = () => {
    setCalories(prev => prev + 420);
    setSteps(prev => prev + 3000);
    setHealthScore(s => Math.min(100, s + 10));
    
    // Toggle today's workout
    const todayIndex = new Date().getDay(); // 0 is Sun, 1 is Mon...
    const adjustedIdx = todayIndex === 0 ? 6 : todayIndex - 1; // Map Sunday to 6, Mon to 0...
    const updated = [...workoutDays];
    updated[adjustedIdx].completed = true;
    setWorkoutDays(updated);
    setWorkoutCompleted(true);

    alert("Workout successfully logged! Burned 420 calories, added 3,000 steps, and boosted your biological score!");
  };

  const completedWorkouts = workoutDays.filter(d => d.completed).length;

  return (
    <div className="min-h-screen bg-[#030712] text-white p-6 md:p-8 space-y-8" id="fitness-page">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">PHYSICAL EXERTION & PERFORMANCE GRID</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase font-sans">
            Fitness & Gym
          </h1>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            Build raw physical resilience. Track workout volume, muscle group activation, consistency chains, and metabolic metrics.
          </p>
        </div>

        {/* Global Progress */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <Dumbbell className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Weekly Consistency</span>
            <span className="text-sm font-extrabold text-emerald-400 font-mono">
              {completedWorkouts} / 7 Workouts Logged
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Workout Plan & Timer */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active Workout Timer Panel */}
          <div className="bg-[#090b14] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-500" />
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Dumbbell className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Gym Performance Engine</h3>
                  <span className="text-[10px] text-gray-400 font-semibold font-mono">ACTIVE TIMER & RECOVERY PACER</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black font-mono text-emerald-400">{formatTimer(exerciseTimer)}</span>
                <span className="text-[10px] text-gray-500 font-bold block">Elapsed Time</span>
              </div>
            </div>

            {/* Current exercise details */}
            <div className="bg-black/40 border border-white/5 p-4 rounded-xl mb-4">
              <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                EXERCISE {activeExerciseIndex + 1} OF {exerciseRoutine.length}
              </span>
              <h4 className="text-sm font-bold text-white mb-1">
                {exerciseRoutine[activeExerciseIndex].name}
              </h4>
              <p className="text-[11px] text-gray-400 leading-relaxed font-semibold">
                {exerciseRoutine[activeExerciseIndex].desc}
              </p>
            </div>

            {/* Carousel navigation */}
            <div className="flex items-center gap-2 mb-6">
              {exerciseRoutine.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveExerciseIndex(idx);
                    setExerciseTimer(0);
                  }}
                  className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeExerciseIndex 
                      ? 'bg-emerald-500' 
                      : idx < activeExerciseIndex 
                        ? 'bg-emerald-500/30' 
                        : 'bg-white/10'
                  }`}
                  title={ex.name}
                />
              ))}
            </div>

            {/* Timer controls */}
            <div className="flex gap-3">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className={`flex-1 py-3 rounded-xl font-bold text-xs tracking-tight transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  timerRunning 
                    ? 'bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:bg-rose-500/30' 
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                }`}
              >
                {timerRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-white/10" />
                    <span>Pause Exercise Set</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white/10" />
                    <span>Resume Exercise Set</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  setExerciseTimer(0);
                  setTimerRunning(false);
                }}
                className="p-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-xl transition-all cursor-pointer"
                title="Reset Set Timer"
              >
                <RotateCcw className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => {
                  if (activeExerciseIndex < exerciseRoutine.length - 1) {
                    setActiveExerciseIndex(prev => prev + 1);
                    setExerciseTimer(0);
                  } else {
                    handleLogActiveWorkout();
                  }
                }}
                className="py-3 px-4 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-300 transition-all cursor-pointer"
              >
                {activeExerciseIndex < exerciseRoutine.length - 1 ? "Next Set ➔" : "Complete & Log Workout"}
              </button>
            </div>
          </div>

          {/* Muscle Group Activation Matrix */}
          <div className="bg-[#090b14] border border-white/5 rounded-2xl p-6">
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4">Muscle Stimulation Map</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {[
                { name: "Posterior Chain (Back)", level: 85, color: "bg-emerald-500" },
                { name: "Quads & Glutes (Legs)", level: 60, color: "bg-teal-500" },
                { name: "Chest & Triceps (Push)", level: 45, color: "bg-indigo-500" },
                { name: "Shoulders & Core", level: 90, color: "bg-violet-500" }
              ].map((m, i) => (
                <div key={i} className="bg-white/[0.01] border border-white/5 p-3 rounded-xl flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-gray-400 block mb-1.5">{m.name}</span>
                  <div className="flex items-end gap-2">
                    <span className="text-sm font-black font-mono text-white">{m.level}%</span>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden mb-1">
                      <div className={`h-full ${m.color}`} style={{ width: `${m.level}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Weekly checks, metrics slider, AI recommendations */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Workouts This Week Interactive Tracker */}
          <div className="bg-[#090b14] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Consistency Logs</span>
              </h4>
              <span className="text-[9px] font-mono text-gray-500 font-bold uppercase">Click days to log retrospectively</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {workoutDays.map((wd, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleWorkoutDay(idx)}
                  className={`py-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-2 ${
                    wd.completed 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-md shadow-emerald-500/5' 
                      : 'bg-white/[0.01] border-white/5 text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <span className="text-[9px] font-bold font-mono">{wd.day}</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    wd.completed ? 'bg-emerald-500 border-transparent text-black' : 'border-white/10 text-transparent'
                  }`}>
                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Weight Tracker */}
          <div className="bg-[#090b14] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Footprints className="w-4 h-4 text-emerald-400" />
                <span>Weight & Body Mass</span>
              </h4>
              <span className="text-[10px] font-mono font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                BMI: 23.4 (Normal)
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-300">
                <span>Current Weight:</span>
                <div className="flex items-center gap-1">
                  <input 
                    type="number" 
                    step="0.1" 
                    value={currentWeight} 
                    onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 0)}
                    className="w-16 bg-white/5 border border-white/10 rounded font-mono px-1.5 py-0.5 text-center text-white"
                  />
                  <span>kg</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-gray-300">
                <span>Target Weight:</span>
                <div className="flex items-center gap-1">
                  <input 
                    type="number" 
                    step="0.1" 
                    value={targetWeight} 
                    onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 0)}
                    className="w-16 bg-white/5 border border-white/10 rounded font-mono px-1.5 py-0.5 text-center text-white"
                  />
                  <span>kg</span>
                </div>
              </div>

              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                  style={{ width: `${Math.max(10, Math.min(100, (targetWeight / currentWeight) * 100))}%` }}
                />
              </div>

              <div className="text-[10px] text-gray-500 font-semibold leading-relaxed">
                You are currently <span className="text-emerald-400 font-bold">{(currentWeight - targetWeight).toFixed(1)}kg</span> away from your cut target. Physical exertion logs help adjust calorie burn pacing dynamically.
              </div>
            </div>
          </div>

          {/* AI Gym coach & recommendations */}
          <div className="bg-[#090b14] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">AI Physical Planner</h4>
            </div>
            <p className="text-xs text-gray-300 font-medium leading-relaxed mb-3">
              Your physiological stress level is medium-high. We recommend prioritizing high-intensity posterior chain movements rather than aerobic fatigue loops.
            </p>
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/10 rounded-xl flex items-start gap-2.5">
              <Award className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest block">DAILY RESILIENCE TARGET</span>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5 leading-relaxed">
                  Focus on complete muscle contractions, dynamic breathing, and rest 90s between lifts. Hydration targets are synced.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
