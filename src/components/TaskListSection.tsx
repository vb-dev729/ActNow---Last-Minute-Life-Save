import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ShieldAlert, CheckCircle2, Circle, Clock, Flame, Brain, 
  ListTodo, ChevronDown, ChevronUp, Play, Square, Pause, Plus, Trash2, 
  RotateCcw, AlertTriangle, Stars, Zap, Calendar, Hourglass 
} from 'lucide-react';
import { Task, TaskSubStep, EmergencyScheduleItem, GoalOrHabit } from '../types';

interface TaskListSectionProps {
  tasks: Task[];
  goalsOrHabits: GoalOrHabit[];
  onCompleteTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'aiPriorityScore' | 'missRisk' | 'subSteps' | 'ignoreCount' | 'urgency'>) => void;
  onToggleSubStep: (taskId: string, subStepId: string) => void;
  onToggleRescueMode: (taskId: string) => void;
  onUpdateRescueSchedule: (taskId: string, schedule: EmergencyScheduleItem[]) => void;
  onAnalyzeTask: (taskId: string) => void;
}

export default function TaskListSection({
  tasks,
  goalsOrHabits,
  onCompleteTask,
  onDeleteTask,
  onAddTask,
  onToggleSubStep,
  onToggleRescueMode,
  onUpdateRescueSchedule,
  onAnalyzeTask
}: TaskListSectionProps) {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>("task-1");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Aesthetic Completing Task Sparks Particles
  const [sparkParticles, setSparkParticles] = useState<Array<{
    id: string;
    x: number;
    y: number;
    color: string;
    size: number;
    vx: number;
    vy: number;
  }>>([]);

  const triggerCompletionBurst = (taskId: string) => {
    const colors = ['#8b5cf6', '#c084fc', '#10b981', '#34d399', '#f43f5e', '#fbbf24', '#38bdf8'];
    const newSparks = Array.from({ length: 15 }, (_, i) => ({
      id: `${taskId}-${i}-${Date.now()}`,
      x: 10, // approximate horizontal offset near the checkbox
      y: 30, // vertical alignment with the row head
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 4 + 2,
      vx: (Math.random() - 0.1) * 200, // burst outward to the right
      vy: (Math.random() - 0.5) * 150 - 30, // vertical blast range
    }));
    setSparkParticles(prev => [...prev, ...newSparks]);
    setTimeout(() => {
      setSparkParticles(prev => prev.filter(sp => !newSparks.find(nsp => nsp.id === sp.id)));
    }, 850);
  };
  
  // Quick Timer state for Smart Intervention (5-minute micro start)
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
  const [timerTaskTitle, setTimerTaskTitle] = useState("");

  // Task Creation states
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState<'work' | 'study' | 'personal' | 'finance' | 'other'>("work");
  const [difficulty, setDifficulty] = useState(3);
  const [effort, setEffort] = useState(2);

  // Focus Timer effect
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      alert("Congratulations! You did 5 minutes of focused work. The hardest part is over — you have bypassed start resistance!");
      setTimeLeft(5 * 60);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const startMicroFocus = (taskTitle: string) => {
    setTimerTaskTitle(taskTitle);
    setTimeLeft(5 * 60);
    setTimerActive(true);
  };

  const stopMicroFocus = () => {
    setTimerActive(false);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !deadline) return;

    onAddTask({
      title,
      description,
      deadline,
      category,
      difficulty,
      effort: Number(effort),
      status: 'pending'
    });

    // Reset Form
    setTitle("");
    setDescription("");
    setDeadline("");
    setCategory("work");
    setDifficulty(3);
    setEffort(2);
    setIsAdding(false);
  };

  // Live countdown remaining calculator
  const getRemainingTime = (isoString: string) => {
    const diffMs = new Date(isoString).getTime() - new Date().getTime();
    if (diffMs < 0) return { text: "Overdue", isPast: true, color: "text-rose-500" };
    
    const totalMin = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMin / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return { text: `${days}d ${hours % 24}h left`, isPast: false, color: "text-gray-400" };
    }
    if (hours > 0) {
      return { text: `${hours}h ${totalMin % 60}m left`, isPast: false, color: "text-amber-400 font-bold" };
    }
    return { text: `${totalMin}m left!`, isPast: false, color: "text-rose-400 font-black animate-pulse" };
  };

  const filteredTasks = tasks.filter(t => filterCategory === 'all' || t.category === filterCategory);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT COLUMN: The Task List & Filter */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        {/* Filter bar and Add task header */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 border border-white/5 p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Active Rescue Queue</h3>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg text-xs py-1 px-2.5 text-gray-300 focus:outline-none focus:border-violet-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="work">Work</option>
              <option value="study">Study</option>
              <option value="personal">Personal</option>
              <option value="finance">Finance</option>
            </select>

            <button
              onClick={() => setIsAdding(!isAdding)}
              className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-1 px-3 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Dynamic Task Creation Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleCreate}
              className="glass-panel p-5 rounded-xl border border-violet-500/20 flex flex-col gap-4 overflow-hidden"
            >
              <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <Stars className="w-4 h-4 text-violet-400" />
                <span>Launch New Rescue Task</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Task Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Chemistry Midterm Prep"
                    className="glass-input p-2 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="glass-input p-2 rounded-lg text-xs"
                    >
                      <option value="work">Work</option>
                      <option value="study">Study</option>
                      <option value="personal">Personal</option>
                      <option value="finance">Finance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Difficulty (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={difficulty}
                      onChange={(e) => setDifficulty(Number(e.target.value))}
                      className="glass-input p-2 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Detailed Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What needs to be done? Add requirements or links..."
                  rows={2}
                  className="glass-input p-2 rounded-lg text-xs resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Deadline Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="glass-input p-2 rounded-lg text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Estimated Effort (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    value={effort}
                    onChange={(e) => setEffort(Number(e.target.value))}
                    className="glass-input p-2 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 font-bold py-1.5 px-4 rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-1.5 px-4 rounded-lg text-xs flex items-center gap-1 shadow-lg shadow-violet-500/20 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Pre-Prioritize</span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Actual Tasks Feed */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => {
                const isExpanded = expandedTaskId === task.id;
                const countdown = getRemainingTime(task.deadline);

                // Risk Gradient Class
                const hasHighRisk = (task.missRisk || 0) >= 70;
                const riskBorderClass = hasHighRisk 
                  ? 'border-rose-500/25 bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/20'
                  : 'border-white/5 bg-slate-900/60';

                return (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`border rounded-2xl transition-all duration-300 relative overflow-hidden ${
                      isExpanded ? 'ring-1 ring-violet-500/30' : ''
                    } ${riskBorderClass}`}
                  >
                    {/* Urgency Progress Top-Line Indicator */}
                    <div className="absolute top-0 inset-x-0 h-[3px] bg-gray-800">
                      <div 
                        className={`h-full ${
                          task.urgency === 'critical' ? 'bg-rose-500' : task.urgency === 'high' ? 'bg-amber-400' : 'bg-violet-500'
                        }`}
                        style={{ width: `${task.aiPriorityScore}%` }}
                      />
                    </div>

                    {/* Completion Burst Particles */}
                    {sparkParticles.filter(sp => sp.id.startsWith(task.id)).map(sp => (
                      <motion.div
                        key={sp.id}
                        className="absolute rounded-full pointer-events-none z-50"
                        style={{
                          left: `${sp.x}%`,
                          top: `${sp.y}%`,
                          width: `${sp.size}px`,
                          height: `${sp.size}px`,
                          backgroundColor: sp.color,
                          boxShadow: `0 0 10px ${sp.color}, 0 0 4px #ffffff`,
                        }}
                        animate={{
                          x: sp.vx,
                          y: sp.vy,
                          opacity: [1, 0],
                          scale: [1, 0.2],
                        }}
                        transition={{
                          duration: 0.8,
                          ease: "easeOut",
                        }}
                      />
                    ))}

                    {/* Main Summary Panel */}
                    <div 
                      onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                      className="p-5 flex items-start gap-4 cursor-pointer relative z-10 hover:bg-white/[0.02]"
                    >
                      {/* Checkbox button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (task.status !== 'completed') {
                            triggerCompletionBurst(task.id);
                          }
                          onCompleteTask(task.id);
                        }}
                        className={`mt-1 flex-shrink-0 text-gray-500 hover:text-emerald-400 transition-colors cursor-pointer ${
                          task.status === 'completed' ? 'text-emerald-400' : ''
                        }`}
                      >
                        {task.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          {/* Title */}
                          <h4 className={`text-sm font-extrabold text-white truncate ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                          </h4>

                          {/* Category Badge */}
                          <span className="text-[9px] uppercase tracking-wider font-bold bg-white/5 text-gray-400 border border-white/5 px-2 py-0.5 rounded">
                            {task.category}
                          </span>

                          {/* Difficulty Indicators */}
                          <span className="flex items-center gap-0.5 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                            <span className="text-[8px] text-gray-400 font-bold mr-1">Diff:</span>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Stars 
                                key={i} 
                                className={`w-2.5 h-2.5 ${i < task.difficulty ? 'text-amber-400 fill-amber-400/30' : 'text-gray-700'}`} 
                              />
                            ))}
                          </span>
                        </div>

                        <p className="text-xs text-gray-400 line-clamp-2 pr-4 font-medium leading-relaxed">
                          {task.description}
                        </p>

                        {/* Interactive Footer badges */}
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                          <span className={`text-[11px] font-semibold flex items-center gap-1 ${countdown.color}`}>
                            <Clock className="w-3.5 h-3.5" />
                            <span>{countdown.text}</span>
                          </span>

                          <span className="text-xs font-semibold text-violet-300 font-mono flex items-center gap-1 bg-violet-500/10 px-2 py-0.5 rounded-lg border border-violet-500/20">
                            <Zap className="w-3 h-3 text-violet-400" />
                            <span>Score: {task.aiPriorityScore}/100</span>
                          </span>

                          {/* Predictor */}
                          {task.missRisk !== undefined && (
                            <span className={`text-xs font-semibold font-mono flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-lg border ${
                              hasHighRisk ? 'text-rose-400 border-rose-500/25' : 'text-gray-400 border-white/5'
                            }`}>
                              <Brain className="w-3 h-3 flex-shrink-0" />
                              <span>{task.missRisk}% Risk of Miss</span>
                            </span>
                          )}

                          {task.ignoreCount >= 3 && (
                            <span className="text-[10px] font-bold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/25 flex items-center gap-1 animate-pulse">
                              <AlertTriangle className="w-3 h-3 text-rose-400" />
                              <span>Resisted {task.ignoreCount}x</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Chevron Toggle */}
                      <div className="text-gray-400 hover:text-white mt-1 self-start">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>

                    {/* DETAILED EXPANDABLE TASK CONSOLE */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-white/5 bg-black/40 p-5 relative z-10 flex flex-col gap-5 overflow-hidden"
                        >
                          {/* AI Copilot recommendation block */}
                          {task.aiRecommendation && (
                            <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-3 flex items-start gap-2.5">
                              <Sparkles className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <span className="text-[10px] text-violet-300 uppercase font-extrabold tracking-wider block mb-0.5">Copilot Insight</span>
                                <p className="text-xs text-gray-300 leading-relaxed font-medium">{task.aiRecommendation}</p>
                              </div>
                            </div>
                          )}

                          {/* SMART BEHAVIORAL INTERVENTION BANNER */}
                          {task.ignoreCount >= 3 && (
                            <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                              <div className="flex items-start gap-2.5">
                                <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <h5 className="text-xs font-extrabold text-rose-300 uppercase tracking-wide">High Resistance Lockout</h5>
                                  <p className="text-xs text-gray-400 leading-relaxed mt-1 font-medium">
                                    You have skipped this task {task.ignoreCount} times. Procrastination psychology shows that starting is 90% of the battle. Let's do a micro-session of just 5 minutes now.
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => startMicroFocus(task.title)}
                                className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-1.5 px-4 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
                              >
                                <Play className="w-4 h-4" />
                                <span>Start 5m Focus</span>
                              </button>
                            </div>
                          )}

                          {/* AI BREAKDOWN ENGINE */}
                          {task.subSteps && task.subSteps.length > 0 ? (
                            <div className="flex flex-col gap-2.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                                  <Brain className="w-3.5 h-3.5 text-violet-400" />
                                  <span>AI Breakdown Sprints ({task.subSteps.reduce((sum, s) => sum + (s.completed ? 0 : s.durationMin), 0)}m remaining)</span>
                                </span>
                                <span className="text-[10px] text-gray-500 font-mono">
                                  {task.subSteps.filter(s => s.completed).length}/{task.subSteps.length} Complete
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                {task.subSteps.map((step) => (
                                  <div
                                    key={step.id}
                                    onClick={() => onToggleSubStep(task.id, step.id)}
                                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                                      step.completed 
                                        ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-300' 
                                        : 'bg-white/5 border-white/5 text-gray-200 hover:bg-white/[0.08]'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      {step.completed ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                      ) : (
                                        <Circle className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                      )}
                                      <span className={`text-xs truncate ${step.completed ? 'line-through text-gray-500' : ''}`}>
                                        {step.title}
                                      </span>
                                    </div>
                                    <span className="text-[10px] font-mono text-gray-400 bg-black/20 px-2 py-0.5 rounded flex-shrink-0">
                                      {step.durationMin}m
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="bg-white/5 p-3 rounded-xl flex items-center justify-between text-xs text-gray-400">
                              <span>No sub-step breakdown is generated yet for this task.</span>
                              <button
                                onClick={() => onAnalyzeTask(task.id)}
                                className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-1 px-2.5 rounded text-[10px] cursor-pointer"
                              >
                                Ask Gemini to Breakdown
                              </button>
                            </div>
                          )}

                          {/* DEADLINE RESCUE MODE */}
                          <div className="border-t border-white/5 pt-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <Flame className="w-4 h-4 text-rose-400" />
                                <span className="text-[10px] text-gray-300 uppercase font-extrabold tracking-wider">
                                  Deadline Rescue Mode
                                </span>
                              </div>

                              <button
                                onClick={() => onToggleRescueMode(task.id)}
                                className={`font-bold py-1 px-3 rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                                  task.rescueMode 
                                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/20 animate-pulse' 
                                    : 'bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300'
                                }`}
                              >
                                <Zap className="w-3.5 h-3.5" />
                                <span>{task.rescueMode ? 'Rescue Active' : 'Engage Rescue Mode'}</span>
                              </button>
                            </div>

                            {task.rescueMode && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-rose-950/10 border border-rose-500/20 rounded-xl p-4 flex flex-col gap-3"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] text-rose-300 font-extrabold uppercase tracking-wide">
                                    Emergency Hour-by-Hour completion schedule
                                  </span>
                                  <button
                                    onClick={() => onAnalyzeTask(task.id)}
                                    className="text-[10px] text-violet-300 hover:text-white underline cursor-pointer"
                                  >
                                    Regenerate Plan
                                  </button>
                                </div>

                                {task.emergencySchedule && task.emergencySchedule.length > 0 ? (
                                  <div className="space-y-2">
                                    {task.emergencySchedule.map((item, idx) => (
                                      <div key={idx} className="flex gap-3 text-xs items-center">
                                        <span className="text-rose-400 font-mono font-bold w-28 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/15 text-center flex-shrink-0">
                                          {item.timeSlot}
                                        </span>
                                        <span className="text-gray-300 font-medium truncate">{item.activity}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-rose-300 italic">
                                    Generating rescue plan. Tap 'Regenerate Plan' to fetch immediately.
                                  </p>
                                )}
                              </motion.div>
                            )}
                          </div>

                          {/* Control panel buttons */}
                          <div className="flex justify-between items-center border-t border-white/5 pt-4">
                            <button
                              onClick={() => onDeleteTask(task.id)}
                              className="text-gray-500 hover:text-rose-400 flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Task</span>
                            </button>

                            <button
                              onClick={() => {
                                if (task.status !== 'completed') {
                                  triggerCompletionBurst(task.id);
                                }
                                onCompleteTask(task.id);
                              }}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1 px-4 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Complete & Cleanse Queue</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <div className="bg-white/5 border border-white/5 p-8 rounded-2xl text-center text-gray-400 flex flex-col items-center justify-center gap-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-2 animate-bounce" />
                <h4 className="font-bold text-white">All Safe. No deadlines pending!</h4>
                <p className="text-xs">Your system stress score is zero. Tap Add Task to schedule more goals.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT COLUMN: Focus TimerWidget & Accountability Status */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* INTERACTIVE POMODORO FOCUS TIMER WIDGET */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[220px] relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Start-Resistance Breaker</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Beat procrastination using behavioral micro-habits</p>
            </div>
            <span className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/20 text-rose-400">
              <Hourglass className="w-5 h-5" />
            </span>
          </div>

          <div className="flex flex-col items-center my-2">
            {timerActive ? (
              <div className="text-center mb-3">
                <span className="text-[10px] text-rose-400 font-extrabold uppercase tracking-widest animate-pulse">Deep focus active</span>
                <p className="text-xs text-gray-300 truncate max-w-[200px] mt-0.5 italic">"{timerTaskTitle}"</p>
              </div>
            ) : (
              <span className="text-xs text-gray-400 mb-3 text-center px-4">Engage a quick 5-minute block to bypass cognitive friction</span>
            )}

            {/* Glowing Circular Timer Ring */}
            <div className="relative flex items-center justify-center w-32 h-32 mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="64"
                  cy="64"
                  r="45"
                  className="stroke-white/5"
                  strokeWidth="5"
                  fill="transparent"
                />
                {/* Dynamic Remaining Circle */}
                <motion.circle
                  cx="64"
                  cy="64"
                  r="45"
                  className={timerActive ? "stroke-rose-500" : "stroke-violet-500"}
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 45}
                  animate={{ strokeDashoffset: (2 * Math.PI * 45) - (timeLeft / 300) * (2 * Math.PI * 45) }}
                  transition={{ duration: 0.5, ease: 'linear' }}
                  strokeLinecap="round"
                  style={{ filter: timerActive ? 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.5))' : 'drop-shadow(0 0 6px rgba(139, 92, 246, 0.5))' }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-mono font-black text-white tracking-wider">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
                <span className="text-[8px] text-gray-400 font-bold uppercase mt-0.5 tracking-wider">Remaining</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {timerActive ? (
                <button
                  onClick={stopMicroFocus}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-1.5 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </button>
              ) : (
                <button
                  onClick={() => startMicroFocus("General Workspace Sprint")}
                  className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-1.5 px-5 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Initiate Sprint</span>
                </button>
              )}

              <button
                onClick={() => {
                  setTimerActive(false);
                  setTimeLeft(5 * 60);
                }}
                className="bg-white/5 hover:bg-white/10 border border-white/5 p-2 rounded-xl text-gray-400 hover:text-white cursor-pointer"
                title="Reset timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* GOAL AND HABIT ACCOUNTABILITY TRACKER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[260px] relative overflow-hidden"
        >
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">AI Accountability Coach</h3>
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-extrabold uppercase tracking-widest">
                Streaks
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Maintain daily routines to bolster your overall focus stamina.
            </p>
          </div>

          {/* Quick interactive lists of habits */}
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[160px] pr-1 custom-scrollbar">
            {goalsOrHabits.map((habit) => {
              const isCareer = habit.category === 'career';
              return (
                <div key={habit.id} className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block truncate">{habit.title}</span>
                      <span className="text-[9px] text-gray-400 uppercase tracking-wide font-medium">{habit.frequency} frequency</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-[10px] font-mono bg-orange-500/10 text-orange-400 border border-orange-500/15 px-2 py-0.5 rounded font-bold">
                      <Flame className="w-3 h-3 fill-orange-500/20" />
                      <span>{habit.streak} day streak</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-gray-500 mt-2 italic">
            "Your streak records demonstrate 45% better focus stamina when active. Keep it going!"
          </p>
        </motion.div>
      </div>
    </div>
  );
}
