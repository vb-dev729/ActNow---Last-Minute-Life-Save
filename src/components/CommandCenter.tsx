import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Zap, ShieldAlert, CheckCircle2, TrendingUp, Clock, Hourglass } from 'lucide-react';
import { Task, AIRecommendation } from '../types';

interface CommandCenterProps {
  tasks: Task[];
  recommendations: AIRecommendation[];
  onCompleteTask: (id: string) => void;
  onDismissRecommendation: (id: string) => void;
}

export default function CommandCenter({
  tasks,
  recommendations,
  onCompleteTask,
  onDismissRecommendation,
}: CommandCenterProps) {
  const activeTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  // 1. Calculate overall progress percentage
  const totalTasksCount = tasks.length;
  const completionPercentage =
    totalTasksCount > 0 ? Math.round((completedTasks.length / totalTasksCount) * 100) : 100;

  // 2. Calculate Total Active Cognitive Effort
  const activeEffortHours = activeTasks.reduce((sum, t) => sum + t.effort, 0);

  // 3. Find closest deadline and time remaining
  const closestTask = activeTasks
    .filter((t) => t.deadline)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0];

  let timeRemainingLabel = 'No immediate threats';
  let isOverloadWarning = false;

  if (closestTask) {
    const diffMs = new Date(closestTask.deadline).getTime() - new Date().getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 0) {
      timeRemainingLabel = `Overdue: ${closestTask.title}`;
    } else {
      const hours = Math.floor(diffHours);
      const minutes = Math.floor((diffHours - hours) * 60);
      timeRemainingLabel = `${hours}h ${minutes}m left for: ${closestTask.title}`;

      // Overload check: if active effort exceeds remaining time before the next deadline
      if (activeEffortHours > diffHours) {
        isOverloadWarning = true;
      }
    }
  }

  // Circular gauge calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Visual Widget 1: Dread & Threat level Gauge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[220px] relative overflow-hidden"
      >
        {/* Calming deep space glow */}
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-violet-600/10 to-indigo-600/10 rounded-2xl blur-xl -z-10"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Mission Progress</h3>
            <p className="text-2xl font-black mt-1 text-white">{completionPercentage}% Completed</p>
          </div>
          <span className="p-2 bg-violet-500/10 rounded-lg border border-violet-500/20 text-violet-400">
            <TrendingUp className="w-5 h-5" />
          </span>
        </div>

        {/* Dynamic Interactive Progress Visual */}
        <div className="flex items-center gap-6 my-2">
          <div className="relative flex items-center justify-center w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-gray-800"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Active animated stroke */}
              <motion.circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-violet-500"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-lg font-mono font-bold text-violet-200">
              {completedTasks.length}/{totalTasksCount}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-gray-400">Active Tasks:</span>
              <span className="font-bold font-mono text-white">{activeTasks.length}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-gray-400">Beaten:</span>
              <span className="font-bold font-mono text-white">{completedTasks.length}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-2 italic">
          {activeTasks.length > 0
            ? `Optimize your schedule to secure those remaining ${activeTasks.length} tasks.`
            : 'Excellent work! No threats remaining in queue.'}
        </p>
      </motion.div>

      {/* Visual Widget 2: Overload & Buffer Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[220px] relative overflow-hidden border ${
          isOverloadWarning ? 'border-rose-500/30 bg-rose-950/10' : 'border-white/5'
        }`}
      >
        {/* Dynamic alarm pulse or stability glow */}
        <motion.div
          className={`absolute -inset-1 rounded-2xl blur-xl -z-10 bg-gradient-to-r ${
            isOverloadWarning 
              ? 'from-rose-600/20 to-red-600/20' 
              : 'from-indigo-600/10 to-violet-600/10'
          }`}
          animate={{
            opacity: isOverloadWarning ? [0.4, 0.9, 0.4] : [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: isOverloadWarning ? 1.5 : 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Effort vs. Buffer</h3>
            <p className="text-2xl font-black mt-1 text-white">
              {activeEffortHours.toFixed(1)} <span className="text-sm font-medium text-gray-400">Est. Hours</span>
            </p>
          </div>
          <span
            className={`p-2 rounded-lg border ${
              isOverloadWarning
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
            }`}
          >
            {isOverloadWarning ? <ShieldAlert className="w-5 h-5" /> : <Hourglass className="w-5 h-5" />}
          </span>
        </div>

        {/* Live warnings / Info block */}
        <div className="flex flex-col gap-2 my-2 bg-black/20 p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-xs">
            <Clock className="w-4 h-4 text-violet-400" />
            <span className="text-gray-400 font-medium">Nearest deadline:</span>
          </div>
          <span className="text-xs font-semibold text-violet-200 truncate">{timeRemainingLabel}</span>
        </div>

        {isOverloadWarning ? (
          <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2 mt-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <p className="text-[10px] text-rose-300 font-bold leading-normal">
              CRITICAL: Active effort hours exceed available time buffer! Reschedule low-priority items now.
            </p>
          </div>
        ) : (
          <p className="text-xs text-gray-400 mt-2">
            You have safe cognitive buffer. Maintain focus sprints to complete tasks without rush.
          </p>
        )}
      </motion.div>

      {/* Visual Widget 3: Live AI Recommendation Feed */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[220px] lg:col-span-1 relative overflow-hidden"
      >
        {/* Subtle recommendation beacon */}
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-fuchsia-600/5 to-pink-600/5 rounded-2xl blur-xl -z-10"
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">AI Copilot Recommendations</h3>
          <span className="text-[10px] bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Live
          </span>
        </div>

        {/* Recommendations Scroll Container */}
        <div className="flex-1 overflow-y-auto max-h-[140px] pr-1 space-y-3.5 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {recommendations.length > 0 ? (
              recommendations.map((rec) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`p-3 rounded-xl border text-xs flex flex-col gap-2 relative ${
                    rec.type === 'danger'
                      ? 'bg-rose-500/5 border-rose-500/20 text-rose-200'
                      : rec.type === 'warning'
                      ? 'bg-amber-500/5 border-amber-500/20 text-amber-200'
                      : 'bg-white/5 border-white/5 text-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Zap className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                      <span>{rec.title}</span>
                    </div>
                    <button
                      onClick={() => onDismissRecommendation(rec.id)}
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-medium">{rec.description}</p>

                  {/* Contextual Interactive Actions */}
                  {rec.affectedTaskIds && rec.affectedTaskIds.length > 0 && (
                    <div className="flex justify-end gap-2 mt-1">
                      {rec.affectedTaskIds.map((taskId) => {
                        const targetTask = tasks.find((t) => t.id === taskId);
                        if (!targetTask || targetTask.status === 'completed') return null;
                        return (
                          <button
                            key={taskId}
                            onClick={() => onCompleteTask(taskId)}
                            className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-1 px-2.5 rounded text-[10px] transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Mark Beaten</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-6 text-center text-gray-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2 opacity-60 animate-bounce" />
                <p className="text-xs">No stress alerts currently triggered.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
