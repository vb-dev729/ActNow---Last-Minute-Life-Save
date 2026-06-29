import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ShieldAlert, CheckCircle2, Circle, Clock, Flame, Brain, 
  ListTodo, ChevronDown, ChevronUp, Play, Square, Pause, Plus, Trash2, 
  RotateCcw, AlertTriangle, Stars, Zap, Calendar, Hourglass, Target, 
  FileText, Briefcase, Award, GraduationCap, CheckCircle 
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
  onEnterRescueCockpit?: (taskId: string) => void;
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
  onAnalyzeTask,
  onEnterRescueCockpit
}: TaskListSectionProps) {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>("task-1");
  const [filterCategory, setFilterCategory] = useState<string>("all");

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
      x: 10,
      y: 30,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 4 + 2,
      vx: (Math.random() - 0.1) * 200,
      vy: (Math.random() - 0.5) * 150 - 30,
    }));
    setSparkParticles(prev => [...prev, ...newSparks]);
    setTimeout(() => {
      setSparkParticles(prev => prev.filter(sp => !newSparks.find(nsp => nsp.id === sp.id)));
    }, 850);
  };
  
  // Quick Timer state for Smart Intervention (5-minute micro start)
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5 * 60); 
  const [timerTaskTitle, setTimerTaskTitle] = useState("");

  // Task Creation states
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState<Task['category']>("assignment");
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
      alert("Congratulations! You completed 5 minutes of focused effort. Start resistance bypassed!");
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
    setCategory("assignment");
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

  // Return elegant category indicator icons
  const getCategoryIcon = (cat: Task['category']) => {
    switch(cat) {
      case 'goal': return <Target className="w-3.5 h-3.5 text-emerald-400" />;
      case 'assignment': return <FileText className="w-3.5 h-3.5 text-blue-400" />;
      case 'project': return <Briefcase className="w-3.5 h-3.5 text-violet-400" />;
      case 'exam': return <GraduationCap className="w-3.5 h-3.5 text-rose-400" />;
      case 'interview': return <Award className="w-3.5 h-3.5 text-amber-400" />;
      default: return <ListTodo className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT COLUMN: The Task List & Filter */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        
        {/* Filter bar and Add task header */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 border border-white/5 p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Workspace Queue</h3>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg text-xs py-1 px-2.5 text-gray-300 focus:outline-none focus:border-violet-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="goal">Goals</option>
              <option value="assignment">Assignments</option>
              <option value="project">Projects</option>
              <option value="exam">Exams</option>
              <option value="interview">Interviews</option>
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
              <span>Add Target</span>
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
                <span>AI Execution Engine — Map Target</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Target Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., IIT-JEE Physics Practice or ML Interview Prep"
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
                      <option value="goal">Goal</option>
                      <option value="assignment">Assignment</option>
                      <option value="project">Project</option>
                      <option value="exam">Exam</option>
                      <option value="interview">Interview</option>
                      <option value="work">Work</option>
                      <option value="study">Study</option>
                      <option value="personal">Personal</option>
                      <option value="finance">Finance</option>
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
                <label className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Requirements / Notes</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Paste rules, requirements, links..."
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
                  <span>Map & Auto-Breakdown</span>
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

                const hasHighRisk = (task.missRisk || 0) >= 70;
                const riskBorderClass = hasHighRisk 
                  ? 'border-rose-500/25 bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/15'
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

                    {/* Checkbox and main row info */}
                    <div className="p-4 flex items-start gap-3.5">
                      <button
                        onClick={() => {
                          triggerCompletionBurst(task.id);
                          onCompleteTask(task.id);
                        }}
                        className="mt-1 flex-shrink-0 text-gray-500 hover:text-violet-400 transition-colors cursor-pointer"
                      >
                        {task.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0" onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-black/40 text-gray-300 border border-white/5 flex items-center gap-1 font-mono">
                            {getCategoryIcon(task.category)}
                            <span>{task.category}</span>
                          </span>

                          <span className={`text-[9px] uppercase tracking-wider font-mono font-bold px-1.5 py-0.5 rounded ${
                            task.urgency === 'critical' 
                              ? 'text-rose-400 bg-rose-500/10' 
                              : task.urgency === 'high' 
                              ? 'text-amber-400 bg-amber-500/10' 
                              : 'text-gray-400 bg-gray-500/10'
                          }`}>
                            Urgency: {task.urgency} ({task.aiPriorityScore}%)
                          </span>

                          <span className={`text-[9px] font-mono font-semibold ml-auto ${countdown.color}`}>
                            {countdown.text}
                          </span>
                        </div>

                        <h4 className={`text-sm font-bold mt-1.5 ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-white'}`}>
                          {task.title}
                        </h4>

                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                          {task.description}
                        </p>
                      </div>

                      <button
                        onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                        className="text-gray-500 hover:text-white transition-colors cursor-pointer mt-1"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* EXPANDED AREA DETAILS */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-white/5 bg-black/10 flex flex-col gap-4">
                        <div className="text-xs text-gray-300 leading-relaxed bg-black/25 p-3 rounded-xl border border-white/5">
                          <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider font-mono mb-1">Target Description</span>
                          {task.description || "No deep description attached."}
                        </div>

                        {/* AI EXECUTION ENGINE: Interactive Sub-steps breakdown */}
                        {task.subSteps && task.subSteps.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider flex items-center gap-1 font-mono">
                                <Brain className="w-3.5 h-3.5 text-violet-400" />
                                <span>AI EXECUTION STEPS</span>
                              </span>
                              <span className="text-[9px] text-gray-500 font-semibold">
                                {task.subSteps.filter(s => s.completed).length}/{task.subSteps.length} cleared
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {task.subSteps.map((step) => (
                                <button
                                  key={step.id}
                                  onClick={() => onToggleSubStep(task.id, step.id)}
                                  className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                                    step.completed 
                                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300' 
                                      : 'bg-black/35 border-white/5 hover:border-white/10 text-gray-300'
                                  }`}
                                >
                                  <div className="mt-0.5">
                                    {step.completed ? (
                                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    ) : (
                                      <Circle className="w-4 h-4 text-gray-600" />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <span className={`text-[11px] font-semibold block leading-tight ${step.completed ? 'line-through text-emerald-400' : 'text-gray-200'}`}>
                                      {step.title}
                                    </span>
                                    <span className="text-[8px] text-gray-500 font-mono block mt-0.5">Duration: {step.durationMin} min</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* AI Tips Card */}
                        {task.aiRecommendation && (
                          <div className="bg-violet-500/5 border border-violet-500/10 p-3 rounded-xl flex items-start gap-2 text-violet-300">
                            <Sparkles className="w-4 h-4 flex-shrink-0 text-violet-400 mt-0.5" />
                            <p className="text-[11px] leading-relaxed font-semibold">
                              {task.aiRecommendation}
                            </p>
                          </div>
                        )}

                        {/* Contextual actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
                          <div className="flex items-center gap-2">
                            {task.status !== 'completed' && onEnterRescueCockpit && (
                              <button
                                onClick={() => onEnterRescueCockpit(task.id)}
                                className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-[10px] tracking-wider py-1.5 px-3.5 rounded-lg flex items-center gap-1.5 shadow-lg shadow-rose-600/15 cursor-pointer"
                              >
                                <Flame className="w-3.5 h-3.5 text-rose-100 animate-pulse" />
                                <span>RESCUE THIS TARGET</span>
                              </button>
                            )}

                            {task.status !== 'completed' && (
                              <button
                                onClick={() => startMicroFocus(task.title)}
                                className="bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 font-bold py-1.5 px-3 rounded-lg text-[10px] flex items-center gap-1.5 cursor-pointer"
                              >
                                <Play className="w-3.5 h-3.5 text-gray-400" />
                                <span>Start 5m Focus</span>
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onAnalyzeTask(task.id)}
                              className="bg-black/30 hover:bg-black/50 border border-white/5 p-1.5 rounded-lg text-gray-400 hover:text-white cursor-pointer"
                              title="Re-run AI breakdown"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteTask(task.id)}
                              className="bg-black/30 hover:bg-rose-950/20 border border-white/5 p-1.5 rounded-lg text-gray-400 hover:text-rose-400 cursor-pointer"
                              title="Delete task"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-10 bg-black/20 rounded-2xl border border-white/5">
                <ListTodo className="w-10 h-10 text-gray-600 mx-auto mb-3 animate-bounce" />
                <p className="text-xs text-gray-400 font-semibold">Your selected queue filter has 0 targets scheduled.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT COLUMN: Quick Micro-Focus HUD & Habits */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Quick Micro-Focus Timer Widget */}
        <AnimatePresence>
          {timerActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel p-5 rounded-2xl border border-rose-500/20 bg-gradient-to-tr from-slate-950 via-slate-900 to-rose-950/10 flex flex-col gap-3 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/[0.03] rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-rose-400 tracking-wider uppercase font-mono">
                    ACTIVE MICRO SPRINT
                  </span>
                </div>
                <button
                  onClick={stopMicroFocus}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer text-xs"
                >
                  ✕
                </button>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white truncate max-w-[220px]">
                  {timerTaskTitle}
                </h4>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Bypassing startup friction. Just stay here for 5 minutes.
                </p>
              </div>

              <div className="flex items-center justify-between mt-1">
                <div className="text-3xl font-black text-rose-400 font-mono tracking-widest">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>

                <button
                  onClick={stopMicroFocus}
                  className="bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Square className="w-3 h-3 fill-rose-300" />
                  <span>Conclude</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Habits Stack list */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
          <div>
            <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <Stars className="w-4 h-4 text-violet-400" />
              <span>Deep Work Habits</span>
            </h3>
            <p className="text-[10px] text-gray-500 mt-1">
              Solidify focus resilience by stacking daily and weekly habits.
            </p>
          </div>

          <div className="space-y-2.5">
            {goalsOrHabits.map((habit) => (
              <div key={habit.id} className="bg-white/[0.01] border border-white/5 p-3 rounded-xl flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-gray-200 block truncate">{habit.title}</span>
                  <span className="text-[9px] text-gray-500 block mt-0.5 uppercase font-mono">
                    Frequency: {habit.frequency}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-violet-400 font-bold bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/25">
                    🔥 {habit.streak} days
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
