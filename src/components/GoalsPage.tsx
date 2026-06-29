import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scale, Plus, Trash2, Sparkles, Award, Target, AlertTriangle, ShieldCheck, Dumbbell, GraduationCap, Laptop 
} from 'lucide-react';

interface GoalsPageProps {
  goals: { id: string; title: string; progress: number; category: string; hours: number }[];
  setGoals: (val: any) => void;
  conflictHours: { hackathon: number; gym: number; exam: number };
  setConflictHours: (val: any) => void;
  sleepHours: number;
}

export default function GoalsPage({
  goals, setGoals,
  conflictHours, setConflictHours,
  sleepHours
}: GoalsPageProps) {
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('Career');
  const [newGoalHours, setNewGoalHours] = useState(10);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    const newGoal = {
      id: `goal-${Date.now()}`,
      title: newGoalTitle,
      progress: 0,
      category: newGoalCategory,
      hours: newGoalHours
    };

    setGoals([...goals, newGoal]);
    setNewGoalTitle('');
    setNewGoalHours(10);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter((g: any) => g.id !== id));
  };

  const handleUpdateProgress = (id: string, amount: number) => {
    setGoals(goals.map((g: any) => {
      if (g.id === id) {
        const next = Math.max(0, Math.min(100, g.progress + amount));
        return { ...g, progress: next };
      }
      return g;
    }));
  };

  const handleUpdateConflictHours = (key: 'hackathon' | 'gym' | 'exam', val: number) => {
    setConflictHours({
      ...conflictHours,
      [key]: val
    });
  };

  const totalAllocatedHours = conflictHours.hackathon + conflictHours.gym + conflictHours.exam;
  const isOverallocated = totalAllocatedHours > 70;

  return (
    <div className="min-h-screen bg-[#030712] text-white p-6 md:p-8 space-y-8" id="goals-page">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-fuchsia-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-fuchsia-400">STRUCTURAL GOAL & COLLISION DETECTOR</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase font-sans">
            Goals & Balance
          </h1>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            Audit study plans against athletic and personal objectives. Track collision points, over-commitment indexes, and progress streaks.
          </p>
        </div>

        {/* Over-commitment gauge */}
        <div className="bg-gradient-to-br from-fuchsia-500/10 to-violet-500/10 border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-fuchsia-500/10 rounded-xl border border-fuchsia-500/20">
            <Scale className="w-6 h-6 text-fuchsia-400" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Time Allocation Balance</span>
            <span className={`text-sm font-extrabold font-mono ${isOverallocated ? 'text-rose-400' : 'text-emerald-400'}`}>
              {totalAllocatedHours}h / 70h Allocated {isOverallocated ? '(Overloaded!)' : '(Balanced)'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Goal Manager & Form */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Quick Add Goal Card */}
          <div className="bg-[#090b14] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-fuchsia-500/10 transition-all duration-500" />
            
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-5 h-5 text-fuchsia-400" />
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Goal Planner Engine</h3>
                <span className="text-[10px] text-gray-400 font-semibold font-mono">ESTABLISH PERSISTENT LONG-TERM OBJECTIVES</span>
              </div>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Objective Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Finish Stanford Algorithms Course"
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-fuchsia-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Domain</label>
                  <select
                    value={newGoalCategory}
                    onChange={(e) => setNewGoalCategory(e.target.value)}
                    className="w-full bg-[#05060d] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-fuchsia-500 transition-colors"
                  >
                    <option value="Career">Career</option>
                    <option value="Health">Health</option>
                    <option value="Finance">Finance</option>
                    <option value="Learning">Learning</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  <span>Weekly Committed Hours Target</span>
                  <span className="text-fuchsia-400 font-mono">{newGoalHours} hours</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="40" 
                  step="1"
                  value={newGoalHours}
                  onChange={(e) => setNewGoalHours(parseInt(e.target.value))}
                  className="w-full accent-fuchsia-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Establish Objective</span>
              </button>
            </form>
          </div>

          {/* Goal Progress Board */}
          <div className="bg-[#090b14] border border-white/5 rounded-2xl p-6">
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4">Active Milestones</h4>
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {goals.map((g) => (
                  <motion.div 
                    key={g.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 bg-white/[0.01] border border-white/5 rounded-xl space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-mono font-bold bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 px-2 py-0.5 rounded-md uppercase">
                          {g.category}
                        </span>
                        <h5 className="text-xs font-bold text-white">{g.title}</h5>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleUpdateProgress(g.id, -10)}
                          className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[10px] font-mono font-bold text-gray-400 cursor-pointer"
                        >
                          -10%
                        </button>
                        <button 
                          onClick={() => handleUpdateProgress(g.id, 10)}
                          className="px-2 py-0.5 rounded bg-fuchsia-500/10 hover:bg-fuchsia-500/15 text-[10px] font-mono font-bold text-fuchsia-400 cursor-pointer"
                        >
                          +10%
                        </button>
                        <button 
                          onClick={() => handleDeleteGoal(g.id)}
                          className="p-1 text-gray-500 hover:text-rose-400 rounded transition-colors cursor-pointer ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] text-gray-400 font-bold font-mono">
                        <span>Milestone Progress:</span>
                        <span>{g.progress}% Complete ({g.hours}h/week allocated)</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-fuchsia-500 to-violet-500"
                          style={{ width: `${g.progress}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {goals.length === 0 && (
                <div className="text-center py-6 text-xs text-gray-500 font-semibold">
                  No active milestones tracked yet. Complete the form above to add your primary targets.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Hour Conflict Board */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Conflict Allocator Box */}
          <div className="bg-[#090b14] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Scale className="w-4 h-4 text-fuchsia-400" />
                <span>Collision Allocation Map</span>
              </h4>
              <span className="text-[9px] font-mono text-gray-500 font-bold uppercase">Dynamic Hour Spans</span>
            </div>

            <div className="space-y-5">
              {/* Hackathon hours slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-300">
                  <span className="flex items-center gap-2">
                    <Laptop className="w-3.5 h-3.5 text-violet-400" />
                    AI Hackathon Startup:
                  </span>
                  <span className="text-violet-400 font-mono">{conflictHours.hackathon}h/wk</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="60" 
                  value={conflictHours.hackathon}
                  onChange={(e) => handleUpdateConflictHours('hackathon', parseInt(e.target.value))}
                  className="w-full accent-violet-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Gym hours slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-300">
                  <span className="flex items-center gap-2">
                    <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                    Gym Resistance Training:
                  </span>
                  <span className="text-emerald-400 font-mono">{conflictHours.gym}h/wk</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="20" 
                  value={conflictHours.gym}
                  onChange={(e) => handleUpdateConflictHours('gym', parseInt(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Exam prep hours slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-300">
                  <span className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
                    University Exam Studies:
                  </span>
                  <span className="text-sky-400 font-mono">{conflictHours.exam}h/wk</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="40" 
                  value={conflictHours.exam}
                  onChange={(e) => handleUpdateConflictHours('exam', parseInt(e.target.value))}
                  className="w-full accent-sky-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* dynamic alert flags based on allocation levels */}
              <div className="pt-3 border-t border-white/5">
                {isOverallocated ? (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2 text-xs text-rose-300 leading-relaxed font-semibold">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <p>
                      CRITICAL TIME COLLISION! Your targets exceed safe sustainable workload rates. At {totalAllocatedHours} hours, you are cutting into sleep and physical recovery. Reduce Hackathon or Exam overhead.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-2 text-xs text-emerald-300 leading-relaxed font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p>
                      Balanced. Your active goals fit safely within circadian parameters, leaving sufficient buffers for your daily {sleepHours} hours of sleep protection.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Advisor Card */}
          <div className="bg-[#090b14] border border-white/5 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-fuchsia-400" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">AI Collision Advice</h4>
            </div>
            <p className="text-xs text-gray-300 font-medium leading-relaxed">
              We identified a potential 12-hour overlap collision on Friday between your Exam preparation and Hackathon milestone checkpoints. ActNow has scheduled study intervals during early morning focus windows to prevent late-night stress spikes.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
