import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Moon, Dumbbell, Apple, Zap, Scale, BarChart3, 
  MessageSquare, Sparkles, Clock, ShieldAlert, AlertCircle, Check, 
  Bell, Sun, CloudSun, User, Plus, Smile, Activity, ChevronRight, Play, Compass, Calendar
} from 'lucide-react';
import { Task, GoalOrHabit, AIRecommendation } from '../types';

interface DashboardProps {
  tasks: Task[];
  goalsOrHabits: GoalOrHabit[];
  recommendations: AIRecommendation[];
  onCompleteTask: (id: string) => void;
  onAddTask: (task: any) => void;
  setActiveTab: (tab: any) => void;
  onEmergencyRescue: (taskId: string) => void;
  
  // Interactive Life OS Shared States
  healthScore: number;
  setHealthScore: (val: number | ((prev: number) => number)) => void;
  sleepHours: number;
  setSleepHours: (val: number | ((prev: number) => number)) => void;
  waterIntake: number;
  setWaterIntake: (val: number | ((prev: number) => number)) => void;
  workoutCompleted: boolean;
  setWorkoutCompleted: (val: boolean) => void;
  stressLevel: string;
  setStressLevel: (val: string) => void;
  heartRate: number;
  setHeartRate: (val: number | ((prev: number) => number)) => void;
  steps: number;
  setSteps: (val: number | ((prev: number) => number)) => void;
  calories: number;
  setCalories: (val: number | ((prev: number) => number)) => void;
  
  sleepHistory: number[];
  setSleepHistory: (val: number[]) => void;
  requiredSleep: number;
  setRequiredSleep: (val: number) => void;
  actualSleepInput: number;
  setActualSleepInput: (val: number) => void;
  
  mood: string;
  setMood: (val: string) => void;
  mindfulnessMinutes: number;
  setMindfulnessMinutes: (val: number | ((prev: number) => number)) => void;
  
  proteinGoal: number;
  proteinConsumed: number;
  setProteinConsumed: (val: number | ((prev: number) => number)) => void;
  
  energyMap: { hour: string; level: number }[];
  
  goals: { id: string; title: string; progress: number; category: string; hours: number }[];
  setGoals: (val: any) => void;
  
  conflictHours: { hackathon: number; gym: number; exam: number };
  setConflictHours: (val: any) => void;

  chatMessages: any[];
  onSendChatMessage: (text: string) => void;
}

export default function Dashboard({
  tasks,
  goalsOrHabits,
  recommendations,
  onCompleteTask,
  onAddTask,
  setActiveTab,
  onEmergencyRescue,
  
  healthScore, setHealthScore,
  sleepHours, setSleepHours,
  waterIntake, setWaterIntake,
  workoutCompleted, setWorkoutCompleted,
  stressLevel, setStressLevel,
  heartRate, setHeartRate,
  steps, setSteps,
  calories, setCalories,
  
  sleepHistory, setSleepHistory,
  requiredSleep, setRequiredSleep,
  actualSleepInput, setActualSleepInput,
  
  mood, setMood,
  mindfulnessMinutes, setMindfulnessMinutes,
  
  proteinGoal, proteinConsumed, setProteinConsumed,
  energyMap,
  goals, setGoals,
  conflictHours, setConflictHours,
  chatMessages, onSendChatMessage
}: DashboardProps) {
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSleepCalc, setShowSleepCalc] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [mindfulnessPlaying, setMindfulnessPlaying] = useState(false);
  const [mindfulnessSeconds, setMindfulnessSeconds] = useState(300); // 5 min
  const [assistantInput, setAssistantInput] = useState("");
  
  // Night task indicator for Sleep Protection activation
  const [nightTaskTitle, setNightTaskTitle] = useState("");
  const [showNightTaskBlock, setShowNightTaskBlock] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mindfulness Session breathing loop
  useEffect(() => {
    let interval: any;
    if (mindfulnessPlaying && mindfulnessSeconds > 0) {
      interval = setInterval(() => {
        setMindfulnessSeconds(p => p - 1);
        if (mindfulnessSeconds % 60 === 0) {
          setMindfulnessMinutes(m => m + 1);
        }
      }, 1000);
    } else if (mindfulnessSeconds === 0) {
      setMindfulnessPlaying(false);
      setMindfulnessSeconds(300);
    }
    return () => clearInterval(interval);
  }, [mindfulnessPlaying, mindfulnessSeconds]);

  // Derived metrics
  const activeTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const totalTasksCount = tasks.length || 10;
  const taskProgressPct = Math.round((completedTasksCount / totalTasksCount) * 100);

  // Focus time calculation
  const focusTimeHours = 4;
  const focusTimeMins = 28;

  // Sleep Debt Formula
  const sleepDebtHours = Math.max(0, requiredSleep - actualSleepInput);
  const calculatedSleepDebtWeek = Math.round(sleepDebtHours * 7 + 3);

  // Burnout Risk calculation based on Formula
  const workloadScore = activeTasks.length * 15;
  const missedTasksScore = tasks.filter(t => t.status === 'pending' && new Date(t.deadline).getTime() < Date.now()).length * 20;
  const stressWeight = stressLevel === 'Critical' ? 40 : stressLevel === 'High' ? 30 : stressLevel === 'Medium' ? 15 : 5;
  const sleepDebtWeight = Math.round(sleepDebtHours * 8);
  const recoveryActivitiesScore = (workoutCompleted ? 15 : 0) + Math.min(20, mindfulnessMinutes * 2.5);
  
  const rawBurnoutScore = workloadScore + missedTasksScore + stressWeight + sleepDebtWeight - recoveryActivitiesScore;
  const burnoutScore = Math.max(5, Math.min(100, Math.round(rawBurnoutScore)));
  
  const burnoutLevel = burnoutScore > 75 ? 'CRITICAL' : burnoutScore > 50 ? 'HIGH' : burnoutScore > 25 ? 'MEDIUM' : 'LOW';

  // Dynamic Life Performance Score based on core dashboards
  const productivityMetric = taskProgressPct;
  const sleepMetric = Math.round(Math.max(15, 100 - (sleepDebtHours * 15)));
  const fitnessMetric = Math.round(Math.max(20, (workoutCompleted ? 85 : 45) + (steps > 8000 ? 15 : 0)));
  const mentalMetric = Math.round(Math.max(10, 100 - stressWeight - (burnoutScore / 3)));
  const nutritionalMetric = Math.round(Math.max(20, Math.min(100, (proteinConsumed / proteinGoal) * 50 + (waterIntake / 3) * 50)));

  const computedLifePerformanceScore = Math.round(
    (productivityMetric * 0.35) + 
    (sleepMetric * 0.15) + 
    (fitnessMetric * 0.15) + 
    (mentalMetric * 0.20) + 
    (nutritionalMetric * 0.15)
  );

  const formatTimeStr = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Workout Consistency Days (Mon ✅, Tue ❌, Wed ✅, Thu ❌, Fri ✅)
  const [workoutDays, setWorkoutDays] = useState([
    { day: 'Thu', completed: true, label: 'T' },
    { day: 'Fri', completed: false, label: 'F' },
    { day: 'Sat', completed: true, label: 'S' },
    { day: 'Sun', completed: false, label: 'S' },
    { day: 'Mon', completed: true, label: 'M' },
    { day: 'Tue', completed: false, label: 'T' },
    { day: 'Wed', completed: true, label: 'W' }
  ]);

  const toggleWorkoutDay = (idx: number) => {
    const updated = [...workoutDays];
    updated[idx].completed = !updated[idx].completed;
    setWorkoutDays(updated);
    
    const trueCount = updated.filter(d => d.completed).length;
    setWorkoutCompleted(trueCount > 3);
  };

  const handleLogWater = () => {
    setWaterIntake(prev => {
      const next = Math.round((prev + 0.25) * 100) / 100;
      return next > 4 ? 4 : next;
    });
    setCalories(prev => prev + 10);
  };

  const handleLogSteps = () => {
    setSteps(prev => prev + 1500);
    setCalories(prev => prev + 120);
    setHeartRate(prev => Math.min(140, Math.round(prev + 12)));
  };

  const handleLogProtein = (amount: number) => {
    setProteinConsumed(prev => {
      const next = prev + amount;
      return next > proteinGoal + 20 ? proteinGoal + 20 : next;
    });
    setCalories(prev => prev + amount * 4 + 180);
  };

  // Goal Conflict Detection Logic
  const totalAllocatedHours = conflictHours.hackathon + conflictHours.gym + conflictHours.exam;
  const isConflictDetected = totalAllocatedHours > 65; // High stress conflict if sum exceeds 65 hours
  const recommendedHackathonHours = Math.max(10, conflictHours.hackathon - 10);
  const recommendedGymSessions = 2;

  // Sleep protection alert checker
  const handleTestSleepProtection = (e: React.FormEvent) => {
    e.preventDefault();
    if (nightTaskTitle.trim()) {
      setShowNightTaskBlock(true);
    }
  };

  // Quick Action Chat inside Bento Grid
  const handleSendMessage = () => {
    if (!assistantInput.trim()) return;
    onSendChatMessage(assistantInput);
    setAssistantInput("");
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header with greeting, weather, notification badge and time */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 pb-3 border-b border-white/5">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2 font-sans tracking-tight">
            Good evening, Vyom <span className="animate-bounce">👋</span>
          </h2>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            Here's how your life is operating today. AI status is <span className="text-emerald-400 font-bold">Active</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Voice Command triggers chat */}
          <button
            onClick={() => setActiveTab('assistant')}
            id="voice-command-header-btn"
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg shadow-violet-500/10 cursor-pointer group transition-all"
          >
            <div className="flex items-center gap-0.5 h-3">
              <span className="w-0.5 h-2 bg-white rounded-full animate-pulse" />
              <span className="w-0.5 h-3 bg-white rounded-full animate-pulse delay-75" />
              <span className="w-0.5 h-1.5 bg-white rounded-full animate-pulse delay-150" />
            </div>
            <span>Voice Command</span>
          </button>

          {/* Notification bell */}
          <div className="relative p-2.5 rounded-xl bg-[#090b14] border border-white/5 text-gray-400 cursor-pointer hover:text-white transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[8px] font-black font-mono text-white flex items-center justify-center">
              3
            </span>
          </div>

          {/* Time & Date Display */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#090b14] border border-white/5">
            <Clock className="w-4 h-4 text-violet-400" />
            <div className="text-right">
              <span className="text-xs font-black text-white font-mono tracking-widest block">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
              </span>
              <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">
                {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Weather Widget */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#090b14] border border-white/5">
            <CloudSun className="w-4 h-4 text-amber-400 animate-pulse" />
            <div>
              <span className="text-xs font-black text-white font-mono block">27°C</span>
              <span className="text-[9px] text-gray-400 tracking-wider block font-bold">Clear Sky</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top row of five micro-metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* Life Performance Card */}
        <div 
          onClick={() => setShowScoreModal(true)}
          className="bg-[#090b14] border border-white/5 hover:border-violet-500/30 rounded-2xl p-4 cursor-pointer transition-all hover:-translate-y-0.5 relative overflow-hidden group shadow-lg"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-violet-600/5 rounded-full blur-xl group-hover:bg-violet-600/10 transition-all" />
          <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Life Performance</span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-xl md:text-2xl font-black text-white font-mono">{computedLifePerformanceScore}</span>
            <span className="text-[10px] text-gray-500 font-bold">/100</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-emerald-400 font-bold font-mono">
            <span className="text-xs">▲</span> 
            <span>8 from yesterday</span>
          </div>
        </div>

        {/* Tasks Progress Card */}
        <div 
          onClick={() => setActiveTab('tasks')}
          className="bg-[#090b14] border border-white/5 hover:border-sky-500/30 rounded-2xl p-4 cursor-pointer transition-all hover:-translate-y-0.5 relative overflow-hidden group shadow-lg"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-sky-500/5 rounded-full blur-xl group-hover:bg-sky-500/10" />
          <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Tasks Progress</span>
          <div className="flex items-center justify-between mt-1.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl md:text-2xl font-black text-white font-mono">{taskProgressPct}%</span>
            </div>
            
            {/* SVG Mini Ring */}
            <svg className="w-8 h-8 transform -rotate-90">
              <circle cx="16" cy="16" r="12" fill="transparent" stroke="#1f2937" strokeWidth="2.5" />
              <circle cx="16" cy="16" r="12" fill="transparent" stroke="#0ea5e9" strokeWidth="2.5" 
                strokeDasharray={`${2 * Math.PI * 12}`}
                strokeDashoffset={`${2 * Math.PI * 12 * (1 - taskProgressPct / 100)}`}
              />
            </svg>
          </div>
          <span className="text-[10px] text-gray-500 mt-2 block font-medium">
            {completedTasksCount} of {totalTasksCount} completed
          </span>
        </div>

        {/* Focus Time Card */}
        <div 
          onClick={() => setActiveTab('executive')}
          className="bg-[#090b14] border border-white/5 hover:border-violet-500/30 rounded-2xl p-4 cursor-pointer transition-all hover:-translate-y-0.5 relative overflow-hidden group shadow-lg"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-violet-600/5 rounded-full blur-xl group-hover:bg-violet-600/10" />
          <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Focus Time Today</span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-xl md:text-2xl font-black text-white font-mono">{focusTimeHours}h {focusTimeMins}m</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-emerald-400 font-bold font-mono">
            <span className="text-xs">▲</span> 
            <span>18% from yesterday</span>
          </div>
        </div>

        {/* Upcoming Deadlines Card */}
        <div 
          onClick={() => setActiveTab('tasks')}
          className="bg-[#090b14] border border-white/5 hover:border-rose-500/30 rounded-2xl p-4 cursor-pointer transition-all hover:-translate-y-0.5 relative overflow-hidden group shadow-lg"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10" />
          <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Upcoming Deadlines</span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-xl md:text-2xl font-black text-rose-400 font-mono">{activeTasks.length}</span>
          </div>
          <span className="text-[10px] text-rose-300 mt-2 block font-extrabold flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
            <span>{activeTasks.filter(t => t.urgency === 'critical' || t.urgency === 'high').length} High Priority</span>
          </span>
        </div>

        {/* AI Risk Alerts Card */}
        <div 
          onClick={() => setActiveTab('analytics')}
          className="bg-[#090b14] border border-white/5 hover:border-amber-500/30 rounded-2xl p-4 cursor-pointer transition-all hover:-translate-y-0.5 relative overflow-hidden group col-span-2 lg:col-span-1 shadow-lg"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10" />
          <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">AI Risk Alerts</span>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-xl md:text-2xl font-black text-amber-400 font-mono">
              {recommendations.filter(r => r.type === 'danger' || r.type === 'warning').length}
            </span>
          </div>
          <span className="text-[10px] text-amber-300 mt-2 block font-extrabold flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-400" />
            <span>Action Needed</span>
          </span>
        </div>
      </div>

      {/* 3. Middle Bento Grid Layout (Executive Plan, Life Balance spider, ActNow AI conversational board, Calendar Connected slots) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        
        {/* Card 1: AI Executive Plan (xl:col-span-4) */}
        <div className="bg-[#090b14] border border-white/5 rounded-2xl p-5 xl:col-span-4 flex flex-col justify-between relative shadow-lg group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">AI Executive Plan For You</h3>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed font-medium mb-4">
              Your day is intelligently planned based on energy, priorities & deadlines.
            </p>

            <div className="flex items-center gap-5 my-4">
              {/* Pie/Donut Chart representation */}
              <div className="relative w-24 h-24 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Deep work 3h 15m (approx 45%) */}
                  <circle cx="48" cy="48" r="36" fill="transparent" stroke="#1f2937" strokeWidth="8" />
                  <circle cx="48" cy="48" r="36" fill="transparent" stroke="#8b5cf6" strokeWidth="8" 
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - 0.45)}`}
                  />
                  {/* Focused work 2h 05m (approx 30%) */}
                  <circle cx="48" cy="48" r="36" fill="transparent" stroke="#0ea5e9" strokeWidth="8" 
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - 0.30)}`}
                    className="origin-center rotate-[162deg]"
                  />
                  {/* Light work 1h 10m */}
                  <circle cx="48" cy="48" r="36" fill="transparent" stroke="#f59e0b" strokeWidth="8" 
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - 0.15)}`}
                    className="origin-center rotate-[270deg]"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[11px] font-black text-white font-mono">6h 48m</span>
                  <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider scale-95">Planned</span>
                </div>
              </div>

              {/* Legend with times */}
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5 font-bold text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-violet-500" />
                    <span>Deep Work</span>
                  </div>
                  <span className="font-mono text-gray-400">3h 15m</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5 font-bold text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                    <span>Focused Work</span>
                  </div>
                  <span className="font-mono text-gray-400">2h 05m</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5 font-bold text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Light Work</span>
                  </div>
                  <span className="font-mono text-gray-400">1h 10m</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5 font-bold text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-[#111827] border border-gray-700" />
                    <span>Breaks</span>
                  </div>
                  <span className="font-mono text-gray-400">0h 48m</span>
                </div>
              </div>
            </div>

            {/* List of planned tasks slots */}
            <div className="space-y-2 mt-4">
              <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
                <div className="min-w-0">
                  <span className="text-[9px] font-bold text-violet-400 font-mono block">08:00 AM - 09:30 AM</span>
                  <span className="text-[11px] font-bold text-white block truncate">DSA - Graph Algorithms</span>
                </div>
                <span className="text-[8px] bg-violet-600/20 text-violet-300 font-bold px-2 py-0.5 rounded-md">Deep Focus</span>
              </div>
              <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
                <div className="min-w-0">
                  <span className="text-[9px] font-bold text-sky-400 font-mono block">09:45 AM - 10:30 AM</span>
                  <span className="text-[11px] font-bold text-white block truncate">ML Assignment</span>
                </div>
                <span className="text-[8px] bg-sky-600/20 text-sky-300 font-bold px-2 py-0.5 rounded-md">Focused Work</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[8px] text-gray-500 font-bold tracking-widest uppercase block">PLAN EFFICIENCY</span>
              <span className="text-xs font-black text-white font-mono">92% Optimal</span>
            </div>
            <button 
              onClick={() => setActiveTab('executive')}
              className="py-1.5 px-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] text-gray-300 font-bold cursor-pointer"
            >
              View Full Plan
            </button>
          </div>
        </div>

        {/* Card 2: Life Balance Overview spider map (xl:col-span-4) */}
        <div className="bg-[#090b14] border border-white/5 rounded-2xl p-5 xl:col-span-4 flex flex-col justify-between relative shadow-lg group">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Scale className="w-4 h-4 text-violet-400" />
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Life Balance Overview</h3>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed font-medium mb-3">
              Your life in perfect harmony.
            </p>

            {/* Radar spider web graphics */}
            <div className="relative w-44 h-44 mx-auto my-3 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 160 160">
                {/* Webs */}
                <polygon points="80,15 136,47 136,112 80,145 24,112 24,47" fill="none" stroke="#1f2937" strokeWidth="1" />
                <polygon points="80,35 120,58 120,102 80,125 40,102 40,58" fill="none" stroke="#374151" strokeWidth="1" />
                <polygon points="80,55 104,69 104,91 80,105 56,91 56,69" fill="none" stroke="#4b5563" strokeWidth="1" />
                {/* Axis lines */}
                <line x1="80" y1="80" x2="80" y2="15" stroke="#1f2937" strokeWidth="1" />
                <line x1="80" y1="80" x2="136" y2="47" stroke="#1f2937" strokeWidth="1" />
                <line x1="80" y1="80" x2="136" y2="112" stroke="#1f2937" strokeWidth="1" />
                <line x1="80" y1="80" x2="80" y2="145" stroke="#1f2937" strokeWidth="1" />
                <line x1="80" y1="80" x2="24" y2="112" stroke="#1f2937" strokeWidth="1" />
                <line x1="80" y1="80" x2="24" y2="47" stroke="#1f2937" strokeWidth="1" />

                {/* Score polygon (Career, Health, Fitness, Personal, Mental, Academics) */}
                {/* Values scaled: 100% = radius 65. Center (80,80) */}
                {/* Career: 88, Health: 76, Fitness: 81, Personal: 74, Mental: 79, Academics: 87 */}
                <polygon 
                  points="80,23 125,55 124,103 80,128 39,101 32,53" 
                  fill="rgba(139, 92, 246, 0.15)" 
                  stroke="#8b5cf6" 
                  strokeWidth="2" 
                />
                
                {/* Data point dots */}
                <circle cx="80" cy="23" r="3" fill="#a78bfa" />
                <circle cx="125" cy="55" r="3" fill="#a78bfa" />
                <circle cx="124" cy="103" r="3" fill="#a78bfa" />
                <circle cx="80" cy="128" r="3" fill="#a78bfa" />
                <circle cx="39" cy="101" r="3" fill="#a78bfa" />
                <circle cx="32" cy="53" r="3" fill="#a78bfa" />

                {/* Labels */}
                <text x="80" y="11" textAnchor="middle" fill="#9ca3af" fontSize="7" fontWeight="bold">Career 88</text>
                <text x="144" y="47" textAnchor="start" fill="#f43f5e" fontSize="7" fontWeight="bold">Health 76</text>
                <text x="144" y="115" textAnchor="start" fill="#10b981" fontSize="7" fontWeight="bold">Fitness 81</text>
                <text x="80" y="155" textAnchor="middle" fill="#9ca3af" fontSize="7" fontWeight="bold">Personal 74</text>
                <text x="16" y="115" textAnchor="end" fill="#6366f1" fontSize="7" fontWeight="bold">Mental 79</text>
                <text x="16" y="47" textAnchor="end" fill="#9ca3af" fontSize="7" fontWeight="bold">Academics 87</text>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent pointer-events-none">
                <span className="text-lg font-black text-white font-mono">84</span>
                <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">Score</span>
              </div>
            </div>

            {/* Side insights list */}
            <div className="mt-2 space-y-2">
              <div className="flex items-start gap-2 text-[10px] text-emerald-400 font-semibold">
                <span className="p-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">✅</span>
                <span>Great balance: You're maintaining a high balance across all areas.</span>
              </div>
              <div className="flex items-start gap-2 text-[10px] text-amber-400 font-semibold">
                <span className="p-0.5 rounded bg-amber-500/10 border border-amber-500/20">⚠️</span>
                <span>Sleep can improve: Try extending sleep by 30-45 mins.</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('goals')}
            className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] text-gray-300 font-bold text-center mt-4 cursor-pointer"
          >
            View Full Insights
          </button>
        </div>

        {/* Card 3: ActNow AI conversation box (xl:col-span-4) */}
        <div className="bg-[#090b14] border border-white/5 rounded-2xl p-5 xl:col-span-4 flex flex-col justify-between relative shadow-lg group">
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-violet-400" />
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">ActNow AI</h3>
                </div>
                <span className="flex items-center gap-1 text-[8px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Active</span>
                </span>
              </div>

              {/* Chat Feed */}
              <div className="space-y-3 max-h-[220px] overflow-y-auto custom-scrollbar p-1">
                {chatMessages.slice(-2).map((msg, i) => (
                  <div 
                    key={i} 
                    className={`p-3 rounded-2xl text-[11px] leading-relaxed font-semibold flex flex-col ${
                      msg.role === 'user' 
                        ? 'bg-violet-600/20 border border-violet-500/20 text-violet-100 ml-4 rounded-tr-none' 
                        : 'bg-white/[0.03] border border-white/5 text-gray-200 mr-4 rounded-tl-none'
                    }`}
                  >
                    <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                      {msg.role === 'user' ? 'You' : 'AI Assistant'}
                    </span>
                    <p>{msg.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Input field */}
            <div className="mt-4">
              <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-xl p-1.5 focus-within:border-violet-500/30">
                <input 
                  type="text"
                  value={assistantInput}
                  onChange={(e) => setAssistantInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask any question on schedule or wellbeing..."
                  className="flex-1 bg-transparent border-none text-[11px] text-white px-2.5 outline-none focus:ring-0 placeholder:text-gray-500"
                />
                <button 
                  onClick={handleSendMessage}
                  className="py-1.5 px-3 bg-violet-600 hover:bg-violet-500 rounded-lg text-[10px] text-white font-bold cursor-pointer"
                >
                  Ask
                </button>
              </div>

              <div className="flex gap-2.5 mt-3 justify-end">
                <button 
                  onClick={() => setActiveTab('assistant')}
                  className="text-[9px] text-violet-400 font-bold hover:underline"
                >
                  Open Full Assistant Screen
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Calendar Overview (xl:col-span-4) */}
        <div className="bg-[#090b14] border border-white/5 rounded-2xl p-5 xl:col-span-4 flex flex-col justify-between shadow-lg group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-sans">Calendar Overview</h3>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed font-medium mb-3">
              Google Calendar Connected
            </p>

            <div className="space-y-2 mt-2">
              {[
                { time: "08:00 AM", title: "DSA - Graph Algorithms", cat: "Deep Work", color: "bg-violet-500" },
                { time: "10:45 AM", title: "Workout", cat: "Health", color: "bg-rose-500" },
                { time: "02:00 PM", title: "Team Standup", cat: "Work", color: "bg-blue-500" },
                { time: "06:00 PM", title: "ML Assignment", cat: "Focused Work", color: "bg-sky-500" },
                { time: "08:00 PM", title: "Reading", cat: "Personal", color: "bg-amber-500" },
              ].map((slot, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 rounded-xl text-[11px] transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`${slot.color} w-1.5 h-1.5 rounded-full shrink-0`} />
                    <span className="font-mono text-gray-400 text-[10px] shrink-0">{slot.time}</span>
                    <span className="font-bold text-white truncate">{slot.title}</span>
                  </div>
                  <span className="text-[9px] text-gray-400 font-semibold">{slot.cat}</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('calendar')}
            className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] text-gray-300 font-bold text-center mt-4 cursor-pointer"
          >
            Open Calendar
          </button>
        </div>

      </div>

      {/* 4. Bottom Row Bento Grid (Interactive health dashboards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        
        {/* Card 1: HEALTH SCORE COMMAND CENTER */}
        <div className="bg-[#090b14] border border-white/5 rounded-2xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-sans">Health Score</h3>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">Good</span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium mb-3">Physical well-being at a glance.</p>
            
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-white font-mono">{healthScore}</span>
              <span className="text-xs text-gray-400">/100</span>
            </div>

            {/* Sparkline simulation using SVG */}
            <div className="h-10 my-4 bg-white/[0.01] rounded-xl flex items-end">
              <svg className="w-full h-full" viewBox="0 0 140 40">
                <path d="M0,35 Q10,15 20,25 T40,15 T60,30 T80,18 T100,25 T120,10 T140,8" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
                <path d="M0,35 Q10,15 20,25 T40,15 T60,30 T80,18 T100,25 T120,10 T140,8 L140,40 L0,40 Z" fill="rgba(244, 63, 94, 0.05)" />
              </svg>
            </div>

            {/* Interactive Metrics */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col justify-between relative group/metric">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Heart Rate</span>
                <span className="text-xs font-black text-white font-mono mt-0.5">{heartRate} bpm</span>
              </div>
              <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col justify-between relative group/metric">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Steps</span>
                  <button 
                    onClick={handleLogSteps} 
                    className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-[8px] cursor-pointer"
                  >
                    +1.5K
                  </button>
                </div>
                <span className="text-xs font-black text-white font-mono mt-0.5">{steps.toLocaleString()} / 10K</span>
              </div>
              <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col justify-between relative group/metric">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Water Intake</span>
                  <button 
                    onClick={handleLogWater} 
                    className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-[8px] cursor-pointer"
                  >
                    +250ml
                  </button>
                </div>
                <span className="text-xs font-black text-white font-mono mt-0.5">{waterIntake.toFixed(1)} / 3.0 L</span>
              </div>
              <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col justify-between relative group/metric">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Calories</span>
                <span className="text-xs font-black text-white font-mono mt-0.5">{calories.toLocaleString()} / 2,400 kcal</span>
              </div>
            </div>

            <div className="mt-4 p-2.5 bg-rose-500/5 border border-rose-500/10 rounded-xl text-[10px] text-rose-300 font-medium">
              <span className="font-bold">AI Insight:</span> Your focus performance is 18% higher on days you sleep 8 hours.
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('health')}
            className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] text-gray-300 font-bold text-center mt-4 cursor-pointer"
          >
            View Health Dashboard
          </button>
        </div>

        {/* Card 2: SLEEP PROTECTION SYSTEM */}
        <div className="bg-[#090b14] border border-white/5 rounded-2xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-sans">Sleep Protection</h3>
              </div>
              <button 
                onClick={() => setShowSleepCalc(true)}
                className="text-[9px] text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold cursor-pointer"
              >
                Calculator
              </button>
            </div>
            <p className="text-[10px] text-gray-400 font-medium mb-3">You need {sleepDebtHours > 0 ? `${sleepDebtHours.toFixed(1)}h` : 'no'} more sleep.</p>
            
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-white font-mono">{sleepHours.toFixed(1)}h</span>
              <span className="text-xs text-gray-400">Sleep Time</span>
            </div>

            {/* Weekly Bar Chart */}
            <div className="flex items-end justify-between h-14 my-4 px-1 gap-2.5 relative">
              <div className="absolute inset-x-0 h-px bg-white/5 top-1/2" />
              {['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'].map((day, idx) => {
                const isToday = idx === 6;
                const hVal = isToday ? (sleepHours / 9) * 100 : (sleepHistory[idx] / 9) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5 relative z-10">
                    <div className="w-full bg-white/5 rounded-t-md h-full flex items-end">
                      <div 
                        className={`w-full rounded-t-md bg-gradient-to-t ${isToday ? 'from-blue-600 to-indigo-500' : 'from-blue-500/60 to-indigo-400/40'}`}
                        style={{ height: `${Math.max(10, Math.min(100, hVal))}%` }}
                      />
                    </div>
                    <span className="text-[8px] font-mono text-gray-400">{day}</span>
                  </div>
                );
              })}
            </div>

            {/* Sleep Stats */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Sleep Quality</span>
                <span className="text-xs font-black text-white font-mono mt-0.5">78%</span>
              </div>
              <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Sleep Debt</span>
                <span className="text-xs font-black text-rose-400 font-mono mt-0.5">{calculatedSleepDebtWeek}h this week</span>
              </div>
            </div>

            {/* Sleep Protection Activation Demo */}
            <form onSubmit={handleTestSleepProtection} className="mt-3 bg-blue-950/20 border border-blue-500/10 p-2.5 rounded-xl">
              <span className="text-[8px] text-blue-400 font-black uppercase block tracking-wider mb-1">AI PROTECTION LAYER INTERCEPT</span>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={nightTaskTitle}
                  onChange={(e) => setNightTaskTitle(e.target.value)}
                  placeholder="Schedule midnight task title..."
                  className="flex-1 bg-black/45 border border-white/5 text-[10px] p-1.5 rounded outline-none text-white focus:border-blue-500/30"
                />
                <button 
                  type="submit" 
                  className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-[9px] font-black text-white rounded cursor-pointer shrink-0"
                >
                  Schedule (12 AM - 4 AM)
                </button>
              </div>
            </form>

            {/* Simulated Active Blocker */}
            <AnimatePresence>
              {showNightTaskBlock && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 bg-black/95 backdrop-blur-md p-5 flex flex-col justify-between z-20 border border-blue-500/30 rounded-2xl"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-rose-400 font-black text-xs uppercase tracking-widest animate-pulse">
                      <ShieldAlert className="w-4 h-4" />
                      <span>⚠ Sleep Protection Activated</span>
                    </div>
                    <p className="text-[11px] text-gray-300 leading-relaxed font-semibold">
                      Your calendar scheduler intercepted a midnight slot for <span className="text-blue-300">"{nightTaskTitle}"</span>.
                    </p>
                    <div className="p-3 bg-red-950/20 border border-red-500/10 rounded-xl">
                      <span className="text-[9px] text-red-400 font-bold block">PREDICTED PRODUCTIVITY LOSS</span>
                      <span className="text-base font-black font-mono text-red-300">24% Decreased Focus</span>
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <span className="text-[10px] text-gray-400 block font-semibold">Suggested Alternative:</span>
                    <p className="text-[11px] text-emerald-400 font-bold">Sleep now. Resume task at 6:00 AM.</p>
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => {
                          setShowNightTaskBlock(false);
                          setNightTaskTitle("");
                          // Automatically schedule safely
                          onAddTask({
                            title: nightTaskTitle,
                            description: "Slipped into a safe daylight morning focus slot.",
                            deadline: new Date(Date.now() + 20 * 3600000).toISOString(),
                            category: "study",
                            urgency: "medium",
                            difficulty: 3,
                            effort: 1.5,
                            status: "pending"
                          });
                        }}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-[10px] font-bold text-white rounded-lg cursor-pointer"
                      >
                        Accept Alternative (6 AM)
                      </button>
                      <button 
                        onClick={() => setShowNightTaskBlock(false)}
                        className="py-1.5 px-3 bg-white/5 hover:bg-white/10 text-[10px] font-bold text-gray-400 rounded-lg cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setActiveTab('sleep')}
            className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] text-gray-300 font-bold text-center mt-4 cursor-pointer"
          >
            Sleep Coach
          </button>
        </div>

        {/* Card 3: FITNESS TRACKER (xl:col-span-1) */}
        <div className="bg-[#090b14] border border-white/5 rounded-2xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-sans">Fitness Tracker</h3>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">Active</span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium mb-3">Keep your body strong.</p>
            
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-white font-mono">
                {workoutDays.filter(d => d.completed).length}/6
              </span>
              <span className="text-xs text-gray-400">Workouts This Week</span>
            </div>

            {/* Interactive Day Checkboxes */}
            <div className="flex items-center justify-between my-4 bg-white/[0.01] p-2 border border-white/5 rounded-xl">
              {workoutDays.map((wd, idx) => (
                <button 
                  key={idx}
                  onClick={() => toggleWorkoutDay(idx)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono transition-all cursor-pointer ${
                    wd.completed 
                      ? 'bg-emerald-500 text-black border border-emerald-400' 
                      : 'bg-[#0f111a] text-gray-500 border border-white/5 hover:border-gray-700'
                  }`}
                  title={`Toggle workout for ${wd.day}`}
                >
                  {wd.completed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : wd.label}
                </button>
              ))}
            </div>

            {/* Workout details */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Muscle Recovery</span>
                <span className="text-xs font-black text-white font-mono mt-0.5">85%</span>
              </div>
              <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">VO2 Max Trend</span>
                <span className="text-xs font-black text-emerald-400 font-mono mt-0.5">+6%</span>
              </div>
            </div>

            <div className="mt-4 p-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-[10px] text-emerald-300 font-medium">
              <span className="font-bold">AI Recommendation:</span> Energy low. Schedule: 20 min mobility workout.
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('fitness')}
            className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] text-gray-300 font-bold text-center mt-4 cursor-pointer"
          >
            Fitness Plan
          </button>
        </div>

        {/* Card 4: NUTRITION & DIET */}
        <div className="bg-[#090b14] border border-white/5 rounded-2xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Apple className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-sans">Nutrition & Diet</h3>
              </div>
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 font-bold">Stable</span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium mb-3">Fuel your body right.</p>

            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-white font-mono">74</span>
              <span className="text-xs text-gray-400">/100 Nutrition Score</span>
            </div>

            {/* Protein tracker with logging shortcuts */}
            <div className="my-4 bg-white/[0.01] border border-white/5 p-3 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-gray-300">Protein Target</span>
                <span className="text-white font-mono">{proteinConsumed}g / {proteinGoal}g</span>
              </div>
              
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (proteinConsumed / proteinGoal) * 100)}%` }}
                />
              </div>

              {/* Logger Shortcuts */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider shrink-0">Log protein:</span>
                <button 
                  onClick={() => handleLogProtein(12)}
                  className="px-1.5 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[8px] border border-amber-500/20 rounded cursor-pointer font-bold"
                >
                  +12g (Eggs)
                </button>
                <button 
                  onClick={() => handleLogProtein(15)}
                  className="px-1.5 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[8px] border border-amber-500/20 rounded cursor-pointer font-bold"
                >
                  +15g (Milk)
                </button>
                <button 
                  onClick={() => handleLogProtein(20)}
                  className="px-1.5 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[8px] border border-amber-500/20 rounded cursor-pointer font-bold"
                >
                  +20g (Paneer)
                </button>
              </div>
            </div>

            {/* Micro progress tags for Carb/Fat/Water */}
            <div className="grid grid-cols-3 gap-2 mt-4 text-[10px]">
              <div className="p-2 bg-white/[0.01] border border-white/5 rounded-lg flex flex-col text-center">
                <span className="text-gray-400">Carbs</span>
                <span className="text-white font-mono font-bold mt-0.5">120 / 200g</span>
              </div>
              <div className="p-2 bg-white/[0.01] border border-white/5 rounded-lg flex flex-col text-center">
                <span className="text-gray-400">Fats</span>
                <span className="text-white font-mono font-bold mt-0.5">48 / 70g</span>
              </div>
              <div className="p-2 bg-white/[0.01] border border-white/5 rounded-lg flex flex-col text-center">
                <span className="text-gray-400">Water</span>
                <span className="text-white font-mono font-bold mt-0.5">{waterIntake.toFixed(1)} / 3.0 L</span>
              </div>
            </div>

            <div className="mt-4 p-2.5 bg-amber-500/5 border border-amber-500/10 rounded-xl text-[10px] text-amber-300 font-medium">
              <span className="font-bold">AI Suggestion:</span> Eat Eggs/Milk/Paneer to hit today's target.
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('nutrition')}
            className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] text-gray-300 font-bold text-center mt-4 cursor-pointer"
          >
            Diet Plan
          </button>
        </div>

        {/* Card 5: MENTAL WELLBEING ENGINE */}
        <div className="bg-[#090b14] border border-white/5 rounded-2xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-violet-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-sans">Mental Wellbeing</h3>
              </div>
              <span className="text-[10px] text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20 font-bold">Active</span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium mb-3">A healthy mind matters.</p>

            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-white font-mono">70</span>
              <span className="text-xs text-gray-400">/100 Wellbeing Score</span>
            </div>

            {/* Interactive Mood Logger Selector */}
            <div className="my-4 space-y-1.5">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">How is your mood?</span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { name: 'Good', emoji: '😊', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
                  { name: 'Neutral', emoji: '😐', color: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
                  { name: 'Anxious', emoji: '😰', color: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
                  { name: 'Exhausted', emoji: '😴', color: 'bg-rose-500/10 border-rose-500/20 text-rose-400' },
                ].map((m) => {
                  const isSelected = mood === m.name;
                  return (
                    <button 
                      key={m.name}
                      onClick={() => {
                        setMood(m.name);
                        if (m.name === 'Exhausted') {
                          setStressLevel('High');
                        } else if (m.name === 'Good') {
                          setStressLevel('Low');
                        }
                      }}
                      className={`py-1.5 rounded-lg border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        isSelected 
                          ? 'bg-violet-600 border-violet-400 text-white' 
                          : 'bg-[#0f111a] border-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="text-sm">{m.emoji}</span>
                      <span className="text-[8px] scale-90">{m.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Burnout Formula Meter Display */}
            <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-2 relative overflow-hidden">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-gray-400">BURNOUT INDEX</span>
                <span className={`font-mono text-[9px] font-black px-1.5 py-0.5 rounded ${
                  burnoutLevel === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400' :
                  burnoutLevel === 'HIGH' ? 'bg-rose-400/10 text-rose-300' :
                  burnoutLevel === 'MEDIUM' ? 'bg-amber-400/10 text-amber-300' :
                  'bg-emerald-500/10 text-emerald-400'
                }`}>
                  {burnoutLevel} ({burnoutScore}%)
                </span>
              </div>
              
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full"
                  style={{ width: `${burnoutScore}%` }}
                />
              </div>

              {/* Stress, Mood, Mindfulness mini summary */}
              <div className="grid grid-cols-3 gap-1.5 pt-1 text-[10px] text-gray-300 font-bold">
                <div>Stress: <span className="text-amber-400">{stressLevel}</span></div>
                <div>Mood: <span className="text-violet-400">{mood}</span></div>
                <div>Mind: <span className="text-sky-400">{mindfulnessMinutes} min</span></div>
              </div>

              {/* Inline Breathing Exercise overlay */}
              <AnimatePresence>
                {mindfulnessPlaying && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/95 backdrop-blur-sm p-3.5 flex flex-col justify-between z-10"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-black text-violet-400 uppercase tracking-widest animate-pulse">Deep Breathing Exercise</span>
                      <span className="font-mono text-xs font-bold text-white">{formatTimeStr(mindfulnessSeconds)}</span>
                    </div>

                    <div className="my-1.5 flex justify-center">
                      {/* Interactive visual breathing bubble */}
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.45, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600/60 to-indigo-500/60 flex items-center justify-center border border-violet-400/30"
                      >
                        <span className="text-[10px] font-black text-white font-sans">Breathe</span>
                      </motion.div>
                    </div>

                    <button 
                      onClick={() => setMindfulnessPlaying(false)}
                      className="w-full py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-bold text-gray-400 cursor-pointer"
                    >
                      Stop Session
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick access to mindfulness session */}
            {!mindfulnessPlaying && (
              <button 
                onClick={() => setMindfulnessPlaying(true)}
                className="w-full mt-3 p-2 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/20 rounded-xl text-[10px] text-violet-300 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3 h-3 text-violet-400 fill-violet-400/35" />
                <span>Start 5-min Mindfulness Box-Breathing</span>
              </button>
            )}
          </div>

          <button 
            onClick={() => setActiveTab('health')}
            className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] text-gray-300 font-bold text-center mt-4 cursor-pointer"
          >
            Wellbeing Hub
          </button>
        </div>

        {/* Card 6: ENERGY TIMELINE */}
        <div className="bg-[#090b14] border border-white/5 rounded-2xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-sans">Energy Timeline</h3>
              </div>
              <span className="text-[10px] text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/20 font-bold">Synchronized</span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium mb-3">Your energy throughout the day. Now: 7:45 PM</p>

            {/* Area Curve Chart utilizing hand-drawn responsive SVG path */}
            <div className="h-20 my-3 flex items-end relative bg-white/[0.01] rounded-xl p-1">
              <svg className="w-full h-full" viewBox="0 0 200 60">
                {/* Underlay Grid lines */}
                <line x1="0" y1="30" x2="200" y2="30" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                
                {/* Curve Area gradient */}
                <path d="M0,50 L0,40 Q20,10 40,25 T80,45 T120,15 T160,20 T200,50 Z" fill="rgba(234, 179, 8, 0.05)" />
                {/* Curve Stroke */}
                <path d="M0,40 Q20,10 40,25 T80,45 T120,15 T160,20 T200,50" fill="none" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />
                
                {/* Active glow pointer at 7:45 PM (around x=140) */}
                <circle cx="140" cy="23" r="4.5" fill="#eab308" className="animate-pulse" />
                <circle cx="140" cy="23" r="2" fill="#000" />
              </svg>
            </div>

            {/* Energy Map legend with hours */}
            <div className="flex justify-between text-[9px] text-gray-500 font-mono">
              <span>6 AM</span>
              <span>12 PM</span>
              <span>6 PM</span>
              <span>12 AM</span>
            </div>

            {/* Peak Energy / Low Energy info */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Peak Energy</span>
                <span className="text-xs font-black text-yellow-300 font-mono mt-0.5">6 PM - 9 PM</span>
              </div>
              <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Low Energy</span>
                <span className="text-xs font-black text-red-300 font-mono mt-0.5">2 PM - 4 PM</span>
              </div>
            </div>

            <div className="mt-4 p-2.5 bg-yellow-500/5 border border-yellow-500/10 rounded-xl text-[10px] text-yellow-300 font-medium">
              <span className="font-bold">AI Schedulers:</span> Hard tasks are dynamically aligned to your peak 6 PM focus window.
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('energy')}
            className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] text-gray-300 font-bold text-center mt-4 cursor-pointer"
          >
            Energy Insights
          </button>
        </div>

      </div>

      {/* 5. Sub-Bottom Row (Goals & Balance progress, AI recommendations, Streaks & Habits badges) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        
        {/* Card 1: GOALS & BALANCE (xl:col-span-4) */}
        <div className="bg-[#090b14] border border-white/5 rounded-2xl p-5 xl:col-span-4 flex flex-col justify-between shadow-lg group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-fuchsia-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-sans">Goals & Balance</h3>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed font-medium mb-4">
              Track progress towards your life goals.
            </p>

            <div className="space-y-3">
              {goals.map((g) => (
                <div key={g.id} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-bold">
                    <span className="text-gray-300">{g.title}</span>
                    <span className="text-fuchsia-400 font-mono">{g.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-fuchsia-500 to-violet-500 rounded-full"
                      style={{ width: `${g.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Goal Conflict Detection Block */}
            <div className="mt-4 p-3 bg-fuchsia-950/20 border border-fuchsia-500/15 rounded-xl space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-[8px] text-fuchsia-400 font-black uppercase tracking-wider">Goal Conflict Checker</span>
                <button 
                  onClick={() => setShowConflictModal(true)}
                  className="text-[8px] bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-300 font-extrabold px-1.5 py-0.5 rounded border border-fuchsia-500/20 cursor-pointer"
                >
                  Configure
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-gray-300 font-bold">
                <span>Allocated hours:</span>
                <span className="font-mono text-white">{totalAllocatedHours} hrs total</span>
              </div>

              {isConflictDetected ? (
                <div className="space-y-1 text-rose-300 font-bold text-[10px]">
                  <p className="flex items-center gap-1 text-rose-400 animate-pulse">
                    <span>⚠️ Conflict detected. Resources insufficient.</span>
                  </p>
                  <p className="text-gray-400 font-medium">
                    Reduce: Hackathon by 10h OR Gym by 2 sessions.
                  </p>
                </div>
              ) : (
                <p className="text-[9px] text-emerald-400 font-bold">
                  ✅ Clear buffer: Time reserves are balanced.
                </p>
              )}
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('goals')}
            className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] text-gray-300 font-bold text-center mt-4 cursor-pointer"
          >
            View All Goals
          </button>
        </div>

        {/* Card 2: AI RECOMMENDATION FOR YOU (xl:col-span-4) */}
        <div className="bg-[#090b14] border border-white/5 rounded-2xl p-5 xl:col-span-4 flex flex-col justify-between shadow-lg relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-sans">AI Recommendation</h3>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed font-medium mb-4">
              Your personalized action for today.
            </p>

            <div className="p-4 bg-violet-600/10 border border-violet-500/20 rounded-2xl flex items-start gap-3 relative overflow-hidden">
              <div className="p-2.5 bg-violet-600/20 border border-violet-500/25 text-violet-300 rounded-xl shrink-0 mt-0.5 animate-pulse">
                <Zap className="w-4 h-4" />
              </div>
              <div className="space-y-2 min-w-0">
                <span className="text-[9px] text-violet-300 font-black tracking-widest uppercase block">Energy Window Peak Optimal</span>
                <p className="text-[11px] text-white leading-relaxed font-semibold">
                  You are working at peak efficiency. Consider taking a 15 min walk after 8 PM to improve sleep quality.
                </p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => {
              // Action triggers a custom log
              alert("Suggestion accepted! Logged a 15-minute relaxation slot in your planner.");
            }}
            className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-[10px] font-bold text-center mt-4 cursor-pointer transition-colors"
          >
            Accept Suggestion
          </button>
        </div>

        {/* Card 3: STREAKS & HABITS BADGES (xl:col-span-4) */}
        <div className="bg-[#090b14] border border-white/5 rounded-2xl p-5 xl:col-span-4 flex flex-col justify-between shadow-lg group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-sans">Streaks & Habits</h3>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed font-medium mb-5">
              Small habits. Big transformation.
            </p>

            <div className="grid grid-cols-5 gap-2.5">
              {[
                { label: "Study", count: "12 days", emoji: "📚", color: "from-amber-500 to-orange-500" },
                { label: "Workout", count: "4 days", emoji: "🏃", color: "from-emerald-500 to-teal-500" },
                { label: "Meditation", count: "7 days", emoji: "🧘", color: "from-violet-500 to-purple-500" },
                { label: "No Sugar", count: "5 days", emoji: "🚫", color: "from-rose-500 to-red-500" },
                { label: "Reading", count: "8 days", emoji: "📖", color: "from-sky-500 to-indigo-500" },
              ].map((hab, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center text-center group/hab hover:scale-105 transition-transform">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${hab.color} p-[1px] shadow-lg shadow-black/20`}>
                    <div className="w-full h-full rounded-full bg-[#090b14] flex items-center justify-center text-lg">
                      {hab.emoji}
                    </div>
                  </div>
                  <span className="text-[9px] text-gray-300 font-bold block mt-2 truncate w-full">{hab.label}</span>
                  <span className="text-[8px] text-gray-500 font-mono uppercase font-bold mt-0.5 truncate w-full">{hab.count}</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('tasks')}
            className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] text-gray-300 font-bold text-center mt-4 cursor-pointer"
          >
            View All Habits
          </button>
        </div>

      </div>

      {/* Popups & Modals */}
      
      {/* Modal 1: Sleep Debt Calculator popup */}
      <AnimatePresence>
        {showSleepCalc && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0d19] border border-white/5 p-6 rounded-2xl max-w-sm w-full space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h4 className="text-sm font-black text-white uppercase tracking-wider">Sleep Debt Calculator</h4>
                <button 
                  onClick={() => setShowSleepCalc(false)}
                  className="text-gray-500 hover:text-white font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                Most students ruin productivity through sleep. Calculate your cognitive debt:
              </p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-gray-300">
                    <span>Required Sleep:</span>
                    <span className="text-blue-400 font-mono">{requiredSleep}h</span>
                  </div>
                  <input 
                    type="range" 
                    min="6" 
                    max="9" 
                    step="0.5" 
                    value={requiredSleep}
                    onChange={(e) => setRequiredSleep(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-gray-300">
                    <span>Actual Sleep:</span>
                    <span className="text-violet-400 font-mono">{actualSleepInput}h</span>
                  </div>
                  <input 
                    type="range" 
                    min="4" 
                    max="9" 
                    step="0.5" 
                    value={actualSleepInput}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setActualSleepInput(val);
                      setSleepHours(val);
                    }}
                    className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                </div>

                <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl space-y-2">
                  <span className="text-[8px] text-gray-500 font-black uppercase block tracking-wider">Sleep Debt Formula</span>
                  <div className="text-xs text-gray-300 font-bold flex justify-between">
                    <span>Daily Debt:</span>
                    <span className="text-rose-400 font-mono">{sleepDebtHours.toFixed(1)}h</span>
                  </div>
                  <div className="text-xs text-gray-300 font-bold flex justify-between">
                    <span>Weekly Debt:</span>
                    <span className="text-rose-400 font-mono">{calculatedSleepDebtWeek}h</span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowSleepCalc(false)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Save and Sync Debt
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 2: Life Performance breakdown popup */}
      <AnimatePresence>
        {showScoreModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0d19] border border-white/5 p-6 rounded-2xl max-w-sm w-full space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h4 className="text-sm font-black text-white uppercase tracking-wider">Life Performance Breakdown</h4>
                <button 
                  onClick={() => setShowScoreModal(false)}
                  className="text-gray-500 hover:text-white font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3.5">
                {[
                  { name: 'Productivity', score: productivityMetric, desc: 'Based on Task progress', color: 'bg-violet-500' },
                  { name: 'Health', score: healthScore, desc: 'Water intake, HRV buffers', color: 'bg-rose-500' },
                  { name: 'Sleep', score: sleepMetric, desc: 'Calculated via sleep debt ratio', color: 'bg-blue-500' },
                  { name: 'Fitness', score: fitnessMetric, desc: 'Based on steps & consistency', color: 'bg-emerald-500' },
                  { name: 'Mental', score: mentalMetric, desc: 'Mood, Burnout risks indices', color: 'bg-indigo-500' }
                ].map((item) => (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span>{item.name}</span>
                      <span className="font-mono">{item.score}/100</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}

                <div className="p-3.5 bg-white/[0.01] border border-white/5 rounded-xl space-y-1 mt-2">
                  <span className="text-[8px] text-violet-400 font-bold block uppercase tracking-wider">AI SYSTEM EXECUTIVE REPORT</span>
                  <p className="text-[10.5px] text-gray-300 leading-relaxed font-semibold">
                    Your productivity is excellent. However, sleep debt has increased. If continued, focus performance may drop <span className="text-rose-400 font-black">15%</span> next week.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 3: Goal Conflict detection details configuration */}
      <AnimatePresence>
        {showConflictModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b0d19] border border-white/5 p-6 rounded-2xl max-w-sm w-full space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h4 className="text-sm font-black text-white uppercase tracking-wider">Configure Goal Allocations</h4>
                <button 
                  onClick={() => setShowConflictModal(false)}
                  className="text-gray-500 hover:text-white font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-gray-300">
                    <span>National Hackathon hours:</span>
                    <span className="text-fuchsia-400 font-mono">{conflictHours.hackathon}h</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="60" 
                    value={conflictHours.hackathon}
                    onChange={(e) => setConflictHours((prev: any) => ({ ...prev, hackathon: parseInt(e.target.value) }))}
                    className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-gray-300">
                    <span>Gym Session hours:</span>
                    <span className="text-emerald-400 font-mono">{conflictHours.gym}h</span>
                  </div>
                  <input 
                    type="range" 
                    min="2" 
                    max="15" 
                    value={conflictHours.gym}
                    onChange={(e) => setConflictHours((prev: any) => ({ ...prev, gym: parseInt(e.target.value) }))}
                    className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-gray-300">
                    <span>IIT-JEE/Board Exams preparation:</span>
                    <span className="text-sky-400 font-mono">{conflictHours.exam}h</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="50" 
                    value={conflictHours.exam}
                    onChange={(e) => setConflictHours((prev: any) => ({ ...prev, exam: parseInt(e.target.value) }))}
                    className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                </div>

                <button 
                  onClick={() => setShowConflictModal(false)}
                  className="w-full py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Save Allocation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
