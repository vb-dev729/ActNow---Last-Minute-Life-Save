import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, ShieldAlert, Flame, Zap, AlertOctagon } from 'lucide-react';
import { Task } from '../types';

interface HeaderProps {
  tasks: Task[];
  onEmergencyRescue?: (taskId: string) => void;
}

export default function Header({ tasks, onEmergencyRescue }: HeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const totalCount = tasks.length;
  const adherenceRate = totalCount > 0 ? Math.round((completedTasks.length / totalCount) * 100) : 100;

  const highestUrgencyTask = activeTasks
    .sort((a, b) => b.aiPriorityScore - a.aiPriorityScore)[0];

  const criticalTasks = activeTasks.filter(t => t.urgency === 'critical');
  const highTasks = activeTasks.filter(t => t.urgency === 'high');

  let stressScore = 0;
  if (activeTasks.length > 0) {
    stressScore = Math.min(
      100,
      criticalTasks.length * 35 + highTasks.length * 15 + activeTasks.length * 5
    );
  }

  const getStressDetails = (score: number) => {
    if (score === 0) return { label: "All Safe", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: Zap };
    if (score < 30) return { label: "Stable Buffer", color: "text-blue-400 bg-blue-500/10 border-blue-500/20", icon: Clock };
    if (score < 60) return { label: "Elevated Pressure", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", icon: Flame };
    return { label: "Deadline Crisis!", color: "text-rose-400 bg-rose-500/10 border-rose-500/20 animate-pulse", icon: ShieldAlert };
  };

  const stressInfo = getStressDetails(stressScore);
  const StressIcon = stressInfo.icon;

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const formattedDate = time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, cubicBezier: [0.16, 1, 0.3, 1] }}
      className="w-full flex flex-col md:flex-row items-center justify-between p-6 glass-panel border-b border-white/5 rounded-2xl mb-6 relative overflow-hidden"
    >
      {/* Background gradients for aesthetics */}
      <div className="absolute top-0 left-0 w-64 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-32 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Title & Brand */}
      <div className="flex items-center gap-3 mb-4 md:mb-0 relative z-10">
        <div className="p-3 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl shadow-lg shadow-violet-500/20 border border-violet-400/20">
          <Flame className="w-6 h-6 text-violet-100 animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-violet-100 via-violet-300 to-white bg-clip-text text-transparent">
            ActNow <span className="text-xs font-semibold px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-300">Companion</span>
          </h1>
          <p className="text-xs text-gray-400 font-medium">Real-time schedule protection and auto-replanning</p>
        </div>
      </div>

      {/* Clock, Fuel, & Real-time Info */}
      <div className="flex flex-wrap items-center gap-4 md:gap-6 relative z-10">
        
        {/* Schedule Adherence Meter (replaces fuel) */}
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-violet-500/5 border border-violet-500/15 text-violet-400 shadow-md">
          <Zap className="w-4 h-4 fill-violet-500/20 animate-bounce text-violet-400" />
          <div className="flex flex-col">
            <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">ADHERENCE RATE</span>
            <span className="text-xs font-black font-mono tracking-wide">{adherenceRate}% completed</span>
          </div>
        </div>

        {/* Real-time Clock */}
        <div className="flex flex-col items-end px-4 py-1.5 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-2 text-violet-300 font-mono text-base md:text-lg font-semibold tracking-widest">
            <Clock className="w-4 h-4 text-violet-400" />
            <span>{formattedTime}</span>
          </div>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{formattedDate}</span>
        </div>

        {/* Dread / Stress Meter */}
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${stressInfo.color}`}>
          <StressIcon className="w-5 h-5" />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold">System stress index</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight">{stressInfo.label}</span>
              <span className="text-xs font-mono font-semibold bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                {stressScore}%
              </span>
            </div>
          </div>
        </div>

        {/* Global Emergency Rescue Shortcut */}
        {highestUrgencyTask && onEmergencyRescue && (
          <button
            onClick={() => onEmergencyRescue(highestUrgencyTask.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/20 border border-rose-400/30 cursor-pointer animate-pulse transition-all duration-300"
            title={`Rescue: ${highestUrgencyTask.title}`}
          >
            <AlertOctagon className="w-4 h-4 text-white" />
            <span>RESCUE ME</span>
          </button>
        )}
      </div>
    </motion.header>
  );
}
