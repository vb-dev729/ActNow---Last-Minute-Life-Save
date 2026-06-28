import { motion } from 'motion/react';
import { Brain, Flame, Calendar, Sparkles, Zap } from 'lucide-react';
import { Task, ProductivityTwin } from '../types';

interface ProductivityTwinPanelProps {
  tasks: Task[];
  twin: ProductivityTwin;
}

export default function ProductivityTwinPanel({ tasks, twin }: ProductivityTwinPanelProps) {
  // Calculate Deadline Heat Map for the upcoming days
  const activeTasks = tasks.filter(t => t.status !== 'completed');
  
  // Group tasks by upcoming days
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayIndex = new Date().getDay();

  // Create an array of next 5 days
  const nextDays = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : daysOfWeek[d.getDay()],
      dateStr: d.toDateString(),
      rawDate: d,
      tasksCount: 0,
      totalWeight: 0, // based on urgency/effort
    };
  });

  activeTasks.forEach(task => {
    if (!task.deadline) return;
    const taskDate = new Date(task.deadline);
    
    // Find matching day in our 5 days list
    const dayMatch = nextDays.find(d => d.rawDate.toDateString() === taskDate.toDateString());
    if (dayMatch) {
      dayMatch.tasksCount += 1;
      // Calculate a pressure weight
      let weight = 1;
      if (task.urgency === 'critical') weight = 4;
      else if (task.urgency === 'high') weight = 3;
      else if (task.urgency === 'medium') weight = 2;
      dayMatch.totalWeight += weight * (task.effort || 1);
    }
  });

  // Find max pressure to scale the heat map heights
  const maxWeight = Math.max(...nextDays.map(d => d.totalWeight), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
      {/* Learned Productivity Twin Profile */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-panel p-5 rounded-2xl lg:col-span-7 flex flex-col justify-between relative overflow-hidden group"
      >
        {/* Animated AI Scanner laser bar */}
        <motion.div
          className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-violet-400/50 to-transparent pointer-events-none"
          animate={{
            top: ["0%", "100%", "0%"]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Hover accent decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/15 transition-all pointer-events-none" />

        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-violet-400" />
              <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Your Productivity Twin Profile</h3>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] text-violet-300 font-bold bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span>Learned Behavior model</span>
            </span>
          </div>

          <p className="text-xs text-gray-400 mb-5 leading-relaxed">
            Our autonomous twin model analyzes your active completion schedules, focus durations, and task start latencies to identify peak performance windows.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/5 border border-white/5 p-3 rounded-xl flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Peak Energy Window</span>
              <span className="text-sm font-bold text-violet-200 font-mono">{twin.bestStudyHours}</span>
            </div>
            <div className="bg-white/5 border border-white/5 p-3 rounded-xl flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Avg Focus Sprint</span>
              <span className="text-sm font-bold text-indigo-200 font-mono">{twin.avgFocusDuration} minutes</span>
            </div>
            <div className="bg-white/5 border border-white/5 p-3 rounded-xl flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Procrastination Factor</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-rose-300 font-mono">{twin.procrastinationIndex}%</span>
                <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full" 
                    style={{ width: `${twin.procrastinationIndex}%` }} 
                  />
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/5 p-3 rounded-xl flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Most Productive Day</span>
              <span className="text-sm font-bold text-emerald-300">{twin.mostProductiveDay}s</span>
            </div>
          </div>
        </div>

        <div className="mt-2 bg-violet-950/20 border border-violet-500/10 rounded-xl p-3 flex items-start gap-2.5">
          <Zap className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5 animate-pulse" />
          <p className="text-xs text-gray-300 leading-relaxed font-medium">
            <span className="text-violet-300 font-bold">Twin Tip:</span> {twin.dynamicAdvice}
          </p>
        </div>
      </motion.div>

      {/* Visual Deadline Heat Map (Visual Deadline Pressure) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-panel p-5 rounded-2xl lg:col-span-5 flex flex-col justify-between relative overflow-hidden"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Deadline Heat Map</h3>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Visual distribution of urgent deadline pressure over the next 5 days.
          </p>
        </div>

        {/* Heatmap Bars */}
        <div className="flex items-end justify-between gap-2 h-28 my-2 px-2 relative">
          {/* Overlay grid lines */}
          <div className="absolute inset-x-0 top-0 h-px bg-white/5" />
          <div className="absolute inset-x-0 top-1/2 h-px bg-white/5" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />

          {nextDays.map((day, idx) => {
            // Calculate height percentage
            const heightPercent = Math.max(10, Math.round((day.totalWeight / maxWeight) * 100));
            // Color based on pressure level
            const isCritical = day.totalWeight > 8;
            const isMedium = day.totalWeight > 3;
            
            const barGradientClass = isCritical
              ? 'from-rose-500 to-amber-500 shadow-rose-500/20'
              : isMedium
              ? 'from-violet-500 to-indigo-500 shadow-indigo-500/20'
              : 'from-blue-500 to-emerald-400 shadow-emerald-500/10';

            return (
              <motion.div 
                key={day.dateStr} 
                whileHover={{ y: -3, scale: 1.03 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col items-center gap-2 relative z-10 cursor-pointer"
              >
                {/* Micro tooltip with tasks count */}
                {day.tasksCount > 0 && (
                  <span className="absolute -top-6 text-[9px] font-mono font-bold text-white px-1 py-0.5 rounded bg-black/80 border border-white/10">
                    {day.tasksCount} task{day.tasksCount > 1 ? 's' : ''}
                  </span>
                )}

                {/* Animated visual pressure bar */}
                <div className="w-full bg-white/5 rounded-t-lg h-24 flex items-end overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                    className={`w-full bg-gradient-to-t rounded-t-md shadow-lg ${barGradientClass}`}
                  />
                </div>

                {/* Day label */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-gray-300 font-bold truncate max-w-full text-center">
                    {day.dayName}
                  </span>
                  <span className="text-[8px] text-gray-500 uppercase tracking-widest">
                    {day.rawDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-between text-[10px] text-gray-500 mt-2 px-1">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-emerald-400 inline-block" /> Low weight
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-violet-500 inline-block" /> Medium weight
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block animate-pulse" /> Crisis pressure
          </span>
        </div>
      </motion.div>
    </div>
  );
}
