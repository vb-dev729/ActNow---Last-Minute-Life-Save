import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Brain, Sparkles, TrendingUp, ShieldAlert, CheckCircle2, ChevronRight, BarChart3, AlertCircle, Activity, Heart, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Task } from '../types';

interface PredictiveRiskScoringProps {
  tasks: Task[];
}

export default function PredictiveRiskScoring({ tasks }: PredictiveRiskScoringProps) {
  const [diagnostics, setDiagnostics] = useState({
    missProbability: 0,
    burnoutProbability: 0,
    collapseProbability: 0,
    predictedDelayHours: 0,
    completionVelocity: 0,
  });

  useEffect(() => {
    const activeTasks = tasks.filter(t => t.status !== 'completed');
    const completedTasks = tasks.filter(t => t.status === 'completed');
    
    // 1. Calculate Velocity
    const velocity = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 75;
    
    // 2. Calculate Total Active Cognitive Effort
    const totalEffort = activeTasks.reduce((sum, t) => sum + (t.effort || 1.5), 0);

    // 3. Task Miss Probability: Based on deadline proximity, difficulty, and ignore counts
    let proximityWeight = 0;
    activeTasks.forEach(task => {
      const hoursRemaining = (new Date(task.deadline).getTime() - Date.now()) / 3600000;
      if (hoursRemaining > 0) {
        if (hoursRemaining <= 12) proximityWeight += 35;
        else if (hoursRemaining <= 24) proximityWeight += 20;
        else if (hoursRemaining <= 48) proximityWeight += 10;
      } else {
        proximityWeight += 45; // Overdue items heavily inflate miss risk!
      }
    });

    const highestDifficulty = activeTasks.length > 0 ? Math.max(...activeTasks.map(t => t.difficulty || 3)) : 3;
    const ignoreWeight = activeTasks.reduce((sum, t) => sum + (t.ignoreCount || 0) * 12, 0);

    const calculatedMiss = Math.min(99, Math.max(10, Math.round(
      proximityWeight + (highestDifficulty * 6) + ignoreWeight - (completedTasks.length * 4)
    )));

    // 4. Burnout Probability: Based on extreme active effort, sleep/time buffers, and task density
    const concurrentCount = activeTasks.length;
    const calculatedBurnout = Math.min(99, Math.max(8, Math.round(
      (totalEffort * 6.5) + (concurrentCount * 8) - (velocity * 0.2)
    )));

    // 5. Schedule Collapse Probability: Based on remaining effort hours vs real remaining hours
    let hoursToNextDeadline = 48;
    const nextTask = activeTasks
      .filter(t => t.deadline)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0];

    if (nextTask) {
      const diffHrs = (new Date(nextTask.deadline).getTime() - Date.now()) / 3600000;
      if (diffHrs > 0) hoursToNextDeadline = diffHrs;
    }

    const ratio = hoursToNextDeadline > 0 ? totalEffort / hoursToNextDeadline : 1;
    const calculatedCollapse = Math.min(99, Math.max(5, Math.round(
      ratio * 45 + (calculatedMiss * 0.3) + (calculatedBurnout * 0.2)
    )));

    // Predicted delay time
    const delay = Number((activeTasks.length * 1.1 + (calculatedMiss / 25)).toFixed(1));

    setDiagnostics({
      missProbability: calculatedMiss,
      burnoutProbability: calculatedBurnout,
      collapseProbability: calculatedCollapse,
      predictedDelayHours: delay,
      completionVelocity: Math.round(velocity),
    });
  }, [tasks]);

  // Construct a 7-day projected Risk Trend dataset
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().getDay();
  
  const chartData = days.map((dayName, index) => {
    const offset = (index - today + 7) % 7;
    let baseRisk = diagnostics.collapseProbability;
    if (offset === 0) {
      // actual
    } else if (offset === 1) {
      baseRisk = Math.min(95, diagnostics.collapseProbability + 15);
    } else if (offset === 2) {
      baseRisk = Math.max(15, diagnostics.collapseProbability - 10);
    } else if (offset === 3) {
      baseRisk = Math.min(90, diagnostics.collapseProbability + 5);
    } else {
      baseRisk = Math.max(10, diagnostics.collapseProbability - (offset * 7));
    }

    return {
      day: dayName,
      "Schedule Collapse Risk": Math.round(baseRisk),
      "Optimal Stability": Math.max(10, Math.round(baseRisk * 0.35)),
    };
  });

  const getRiskLabel = (score: number) => {
    if (score < 35) return { label: 'STABLE BUFFER', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' };
    if (score < 65) return { label: 'ELEVATED TENSION', color: 'text-amber-400 border-amber-500/20 bg-amber-500/5' };
    return { label: 'CRITICAL COLLAPSE DANGER', color: 'text-rose-400 border-rose-500/20 bg-rose-500/5' };
  };

  const riskMeta = getRiskLabel(diagnostics.collapseProbability);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 rounded-2xl flex flex-col gap-6 relative overflow-hidden border border-white/5"
      id="deadline-failure-predictor"
    >
      {/* Background neon radial glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Header block */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-rose-400 animate-pulse" />
          <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider font-sans">Deadline Failure Predictor</h3>
        </div>
        <span className="flex items-center gap-1 text-[10px] text-rose-300 font-extrabold bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20 font-mono">
          <Activity className="w-3 h-3 text-rose-400" />
          <span>PREDICTIVE ML KERNEL</span>
        </span>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed font-medium">
        Analyzes active procrastination rates, task difficulty weights, and checklist completion patterns to model upcoming cognitive crash points.
      </p>

      {/* Flagship Predictor Metrics Bento Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Metric 1: Miss Probability */}
        <div className="bg-black/35 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center relative">
          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-2 font-mono">MISS PROBABILITY</span>
          <div className="text-3xl font-black text-rose-400 font-mono">{diagnostics.missProbability}%</div>
          <span className="text-[10px] text-gray-400 mt-1">Probability of missing next task</span>
          <div className="h-1 w-full bg-gray-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${diagnostics.missProbability}%` }} />
          </div>
        </div>

        {/* Metric 2: Burnout Index */}
        <div className="bg-black/35 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center relative">
          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-2 font-mono">BURNOUT INDEX</span>
          <div className="text-3xl font-black text-amber-400 font-mono">{diagnostics.burnoutProbability}%</div>
          <span className="text-[10px] text-gray-400 mt-1">Mental exhaustion quotient</span>
          <div className="h-1 w-full bg-gray-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${diagnostics.burnoutProbability}%` }} />
          </div>
        </div>

        {/* Metric 3: Schedule Collapse */}
        <div className="bg-black/35 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center relative">
          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-2 font-mono">COLLAPSE RISK</span>
          <div className="text-3xl font-black text-violet-400 font-mono">{diagnostics.collapseProbability}%</div>
          <span className="text-[10px] text-gray-400 mt-1">Agenda stability breakdown</span>
          <div className="h-1 w-full bg-gray-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-violet-400 rounded-full" style={{ width: `${diagnostics.collapseProbability}%` }} />
          </div>
        </div>

      </div>

      {/* Trend and Diagnostics Area Chart */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center mt-2">
        <div className="md:col-span-12 h-44 flex flex-col">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
            <span>Schedule Stability Forecaster (Upcoming 7 Days)</span>
          </span>

          <div className="w-full h-full text-xs" style={{ minHeight: '120px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="collapseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.01)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090514', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="Schedule Collapse Risk" 
                  stroke="#f43f5e" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#collapseGrad)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="Optimal Stability" 
                  stroke="rgba(16, 185, 129, 0.4)" 
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fill="none" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Diagnostics Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/5">
        <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl flex flex-col gap-0.5">
          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-mono">CONCURRENT OVERLAP</span>
          <span className="text-sm font-black text-white font-mono">{(tasks.filter(t => t.status !== 'completed').length * 1.5).toFixed(1)}x</span>
          <span className="text-[8px] text-gray-400 mt-0.5 leading-tight">Average mental context load</span>
        </div>
        <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl flex flex-col gap-0.5">
          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-mono">COMPLETION VELOCITY</span>
          <span className="text-sm font-black text-white font-mono">{diagnostics.completionVelocity}%</span>
          <span className="text-[8px] text-gray-400 mt-0.5 leading-tight font-sans">Milestones finished ratio</span>
        </div>
        <div className="bg-white/[0.01] border border-white/5 p-3 rounded-xl flex flex-col gap-0.5">
          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-mono">PROCRASTINATION DRIFT</span>
          <span className="text-sm font-black text-rose-300 font-mono">+{diagnostics.predictedDelayHours} hrs</span>
          <span className="text-[8px] text-gray-400 mt-0.5 leading-tight">Est. self-control delay barrier</span>
        </div>
      </div>

      {/* Intelligent Warnings */}
      {diagnostics.collapseProbability >= 60 && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 flex items-start gap-2.5 text-rose-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400 animate-bounce" />
          <p className="text-[11px] leading-relaxed font-semibold">
            <b>CRITICAL RISK DETECTED:</b> High density of effort slots preceding tight deadlines has triggered a collapse threat. We recommend immediately engaging the <b>Auto Replanning System</b> or entering <b>Rescue Mode</b>.
          </p>
        </div>
      )}
    </motion.div>
  );
}
