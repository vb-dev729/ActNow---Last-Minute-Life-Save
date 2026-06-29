import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertCircle, Zap, ShieldAlert, CheckCircle2, TrendingUp, Clock, Hourglass, 
  Sparkles, ListCollapse, ListTodo, Sun, Coffee, Lightbulb, Compass, ShieldAlert as AlertIcon
} from 'lucide-react';
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

  // Morning Mission Statement (AI Daily Command Center generated briefing)
  const [morningMission, setMorningMission] = useState({
    title: "Tackle Startup Friction",
    description: "Your priority is clearing mechanical milestones. Protect your high-focus deep work slots and defer personal routine loops.",
    estimatedHoursNeeded: 0,
    timeBudgetAlert: "Stable cognitive buffer remaining.",
    isRiskOverload: false
  });

  useEffect(() => {
    const totalEffort = activeTasks.reduce((sum, t) => sum + (t.effort || 1.5), 0);
    const closestTask = activeTasks
      .filter((t) => t.deadline)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0];

    let riskOverload = false;
    let budgetAlert = "Stable cognitive budget. Complete critical items early to prevent build-up.";

    if (closestTask) {
      const diffMs = new Date(closestTask.deadline).getTime() - Date.now();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (totalEffort > diffHours && diffHours > 0) {
        riskOverload = true;
        budgetAlert = `CRITICAL DEFICIT: You have ${totalEffort.toFixed(1)} hrs of pending work but only ${diffHours.toFixed(1)} hrs until your next milestone!`;
      } else if (diffHours > 0 && diffHours < 12) {
        budgetAlert = `HIGH TENSION: Next deadline is due in ${diffHours.toFixed(1)} hrs. Eliminate routine tabs.`;
      }
    }

    // Curated dynamic missions based on active queue types
    let missionTitle = "Secure Fundamental Milestones";
    let missionDesc = "You have a balanced workload. Start with a quick 5-minute easy win to build focus momentum before tackling complex assignments.";

    const highestUrgency = activeTasks.sort((a, b) => b.aiPriorityScore - a.aiPriorityScore)[0];
    if (highestUrgency) {
      if (highestUrgency.urgency === 'critical') {
        missionTitle = `Defuse: ${highestUrgency.title}`;
        missionDesc = `Immediate rescue actions required. Engage full deep-focus mode on this milestone. Postpone non-urgent check-ins.`;
      } else if (totalEffort > 6) {
        missionTitle = "Manage Congested Agenda";
        missionDesc = `High cognitive congestion ahead. Break larger items into bite-sized micro-steps to prevent mental friction and paralysis.`;
      }
    }

    setMorningMission({
      title: missionTitle,
      description: missionDesc,
      estimatedHoursNeeded: totalEffort,
      timeBudgetAlert: budgetAlert,
      isRiskOverload: riskOverload
    });
  }, [tasks]);

  const topPriorities = activeTasks
    .sort((a, b) => b.aiPriorityScore - a.aiPriorityScore)
    .slice(0, 3);

  return (
    <div className="space-y-6 mb-8" id="ai-daily-command-center">
      {/* Morning Greeting & Mission Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/20"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl">
              <Sun className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-bold tracking-widest text-indigo-400 uppercase">
                  AI DAILY BRIEFING
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
              </div>
              <h2 className="text-lg font-black text-white mt-1">Today's Mission: {morningMission.title}</h2>
              <p className="text-xs text-gray-400 mt-1.5 max-w-2xl leading-relaxed">
                {morningMission.description}
              </p>
            </div>
          </div>

          {/* Time Budget Status */}
          <div className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col justify-center min-w-[200px]">
            <span className="text-[9px] text-gray-500 font-extrabold uppercase tracking-wider font-mono flex items-center gap-1">
              <Coffee className="w-3.5 h-3.5 text-indigo-400" />
              <span>COGNITIVE BUDGET</span>
            </span>
            <div className="flex items-baseline gap-1 mt-1.5">
              <span className="text-xl font-black text-white font-mono">{morningMission.estimatedHoursNeeded.toFixed(1)}</span>
              <span className="text-xs text-gray-400">hours needed</span>
            </div>
            <p className={`text-[10px] mt-2 font-semibold leading-normal ${morningMission.isRiskOverload ? 'text-rose-400' : 'text-emerald-400'}`}>
              {morningMission.timeBudgetAlert}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Grid of Command Center Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Widget 1: Focus Score & Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[220px] relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Queue Efficiency</h3>
              <p className="text-2xl font-black mt-1 text-white">
                {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 100}%
              </p>
            </div>
            <span className="p-2 bg-violet-500/10 rounded-lg border border-violet-500/20 text-violet-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>

          <div className="my-3 flex items-center gap-4 bg-black/20 p-3 rounded-xl border border-white/5">
            <div className="flex flex-col gap-1 flex-1">
              <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                <span>Completed Tasks</span>
                <span className="text-white font-bold">{completedTasks.length} / {tasks.length}</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full bg-violet-500 rounded-full transition-all duration-500" 
                  style={{ width: `${tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="text-[10px] text-gray-500 font-medium">
            Completion velocity is computed in real-time. Boost your score by checking off substeps.
          </div>
        </motion.div>

        {/* Widget 2: Today's Top Priorities */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[220px] relative border border-white/5"
        >
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <ListTodo className="w-4 h-4 text-indigo-400" />
                <span>Top Priorities</span>
              </h3>
              <span className="text-[9px] font-mono text-gray-500">Auto-prioritized</span>
            </div>

            <div className="space-y-2.5">
              {topPriorities.length > 0 ? (
                topPriorities.map((task) => (
                  <div key={task.id} className="flex items-center justify-between text-xs bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 p-2 rounded-lg">
                    <span className="font-bold text-gray-200 truncate max-w-[160px]">{task.title}</span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      task.urgency === 'critical' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      Score {task.aiPriorityScore}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-emerald-400 bg-emerald-500/5 p-2 rounded-lg">
                  ✓ All targets secured! No pending high-stress tasks.
                </div>
              )}
            </div>
          </div>

          <div className="text-[10px] text-gray-500 font-medium mt-3">
            Tackle the highest priority score first to maximize study/work stamina.
          </div>
        </motion.div>

        {/* Widget 3: Live Companion Recommendations */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[220px] relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Lightbulb className="w-4 h-4 text-violet-400" />
              <span>Real-time Risk Alerts</span>
            </h3>
            <span className="text-[8px] bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-widest font-mono">
              Live
            </span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[110px] pr-1 space-y-2.5 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {recommendations.length > 0 ? (
                recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className={`p-2.5 rounded-xl border text-[11px] flex flex-col gap-1.5 relative ${
                      rec.type === 'danger'
                        ? 'bg-rose-500/5 border-rose-500/10 text-rose-200'
                        : rec.type === 'warning'
                        ? 'bg-amber-500/5 border-amber-500/10 text-amber-200'
                        : 'bg-white/5 border-white/5 text-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex items-center gap-1 font-extrabold">
                        <AlertCircle className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                        <span>{rec.title}</span>
                      </div>
                      <button
                        onClick={() => onDismissRecommendation(rec.id)}
                        className="text-gray-400 hover:text-white transition-colors cursor-pointer text-[9px]"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-normal font-medium">{rec.description}</p>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-4 text-center text-gray-500">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-1 opacity-60 animate-pulse" />
                  <p className="text-[10px]">No active congestion alerts.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
