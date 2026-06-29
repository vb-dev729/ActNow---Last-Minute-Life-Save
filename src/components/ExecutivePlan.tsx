import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, AlertTriangle, ShieldAlert, CheckSquare, Clock, 
  RotateCcw, RefreshCw, BarChart2, Plus, Calendar, ListTodo, Sliders, Zap
} from 'lucide-react';
import { Task } from '../types';

interface ExecutivePlanProps {
  tasks: Task[];
  onAddTask: (task: any) => void;
  onReplanAll: () => void;
  onEmergencyRescue: (taskId: string) => void;
  sleepHours: number;
}

export default function ExecutivePlan({ tasks, onAddTask, onReplanAll, onEmergencyRescue, sleepHours }: ExecutivePlanProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "assignment",
    deadline: "",
    urgency: "high",
    difficulty: 3,
    effort: 2,
    substepsCount: 3
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [replanningLog, setReplanningLog] = useState<string[]>([]);
  const [isReplanning, setIsReplanning] = useState(false);

  // Derived predictive scoring based on current parameters
  const activeTasks = tasks.filter(t => t.status !== 'completed');
  const criticalTasks = activeTasks.filter(t => t.urgency === 'critical');
  const highTasks = activeTasks.filter(t => t.urgency === 'high');
  const overdueCount = activeTasks.filter(t => new Date(t.deadline).getTime() < Date.now()).length;

  // Predictor calculations
  const sleepDebtHours = Math.max(0, 8 - sleepHours);
  const averageComplexity = tasks.length > 0 ? (tasks.reduce((acc, t) => acc + (t.difficulty || 3), 0) / tasks.length) : 3;

  // Probabilities
  const probabilityMissingTask = Math.round(
    Math.min(98, Math.max(5, (activeTasks.length * 8) + (overdueCount * 25) + (averageComplexity * 6)))
  );

  const probabilityBurnout = Math.round(
    Math.min(95, Math.max(8, (activeTasks.length * 7) + (sleepDebtHours * 10) + (criticalTasks.length * 15)))
  );

  const probabilityScheduleCollapse = Math.round(
    Math.min(99, Math.max(4, (overdueCount * 30) + (highTasks.length * 10) + (probabilityBurnout / 3)))
  );

  const handleCreateExecutionPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      // Simulate breaking down task with sub-steps based on selections
      const generatedSubsteps = [];
      const keywords = formData.description.split(" ");
      
      for (let i = 1; i <= formData.substepsCount; i++) {
        generatedSubsteps.push({
          id: `sub-${Date.now()}-${i}`,
          title: `Phase ${i}: ${i === 1 ? 'Research & Setup' : i === formData.substepsCount ? 'Final testing & Submission' : 'Core Implementation work'}`,
          completed: false,
          allocatedSlot: `Day ${i} Peak Energy Window`
        });
      }

      // Priority AI Score
      const urgencyMultiplier = formData.urgency === 'critical' ? 35 : formData.urgency === 'high' ? 25 : 15;
      const computedPriorityScore = Math.min(100, Math.round(urgencyMultiplier + (formData.difficulty * 8) + (formData.effort * 3)));

      onAddTask({
        title: formData.title,
        description: formData.description || "Synthesised by AI Executive Plan Engine.",
        category: formData.category,
        deadline: formData.deadline || new Date(Date.now() + 86400000 * 2).toISOString(),
        urgency: formData.urgency,
        difficulty: formData.difficulty,
        effort: formData.effort,
        subSteps: generatedSubsteps,
        aiPriorityScore: computedPriorityScore,
        missRisk: Math.min(95, Math.round(computedPriorityScore * 0.95)),
        status: "pending"
      });

      setIsGenerating(false);
      setFormData({
        title: "",
        description: "",
        category: "assignment",
        deadline: "",
        urgency: "high",
        difficulty: 3,
        effort: 2,
        substepsCount: 3
      });

      alert(`AI Execution Engine successfully compiled plan for "${formData.title}" with ${formData.substepsCount} segmented sub-steps! Check it in Tasks & Projects.`);
    }, 1500);
  };

  const triggerEmergencyReplan = () => {
    setIsReplanning(true);
    setReplanningLog([]);

    const steps = [
      "🔍 [SCANNING] Initializing Auto Replanning Engine...",
      "⚠️ [ALERT] Found 1 missed schedule block & 2 imminent deadline risks.",
      "📅 [SYNC] Fetching Google Calendar free spaces...",
      "⚡ [COMPUTING] Allocating Deep Work blocks in peak 6 PM-9 PM Energy windows...",
      "📝 [SCHEDULING] Shifted 'ML Assignment' deadline safely to Friday 2:00 PM.",
      "🛡️ [COMPLETE] Schedule rebuilt successfully. Productivity score balanced."
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setReplanningLog(prev => [...prev, step]);
        if (index === steps.length - 1) {
          setIsReplanning(false);
          onReplanAll();
        }
      }, (index + 1) * 600);
    });
  };

  return (
    <div className="space-y-6">
      
      {/* View Title */}
      <div className="pb-3 border-b border-white/5">
        <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2 tracking-tight">
          <Sparkles className="w-5.5 h-5.5 text-violet-400" />
          <span>AI Executive Scheduler</span>
        </h2>
        <p className="text-xs text-gray-400 font-medium mt-0.5">
          Automatic breakdowns, replanning logs, and risk calculations.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        
        {/* Left Side: Input form for AI Execution Engine (xl:col-span-8) */}
        <div className="bg-[#090b14] border border-white/5 rounded-2xl p-5 xl:col-span-8 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
            <div className="flex items-center gap-2 text-violet-400">
              <Zap className="w-4.5 h-4.5" />
              <h3 className="text-xs font-black uppercase tracking-wider text-white">AI Execution Plan Creator</h3>
            </div>
          </div>

          <form onSubmit={handleCreateExecutionPlan} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Goal / Assignment / Exam Title</label>
                <input 
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Crack Board Chemistry Exam"
                  className="w-full bg-[#05060d] border border-white/5 rounded-xl p-3 text-xs text-white outline-none focus:border-violet-500/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Type Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#05060d] border border-white/5 rounded-xl p-3 text-xs text-white outline-none focus:border-violet-500/40"
                >
                  <option value="goal">Goal / Target</option>
                  <option value="assignment">Assignment / Project</option>
                  <option value="exam">Exam Prep</option>
                  <option value="interview">Interview Practice</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Description & Details</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                placeholder="List chapters, sub-tasks, or topics. The AI will segment them automatically."
                className="w-full bg-[#05060d] border border-white/5 rounded-xl p-3 text-xs text-white outline-none focus:border-violet-500/40"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Target Deadline</label>
                <input 
                  type="datetime-local"
                  required
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full bg-[#05060d] border border-white/5 rounded-xl p-3 text-xs text-white outline-none focus:border-violet-500/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Priority Urgency</label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  className="w-full bg-[#05060d] border border-white/5 rounded-xl p-3 text-xs text-white outline-none focus:border-violet-500/40"
                >
                  <option value="critical">🚨 Critical / High Risk</option>
                  <option value="high">🟠 High Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="low">🟢 Low Priority</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Target Substeps Count</label>
                <input 
                  type="number"
                  min="2"
                  max="6"
                  value={formData.substepsCount}
                  onChange={(e) => setFormData({ ...formData, substepsCount: parseInt(e.target.value) })}
                  className="w-full bg-[#05060d] border border-white/5 rounded-xl p-3 text-xs text-white outline-none focus:border-violet-500/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  <span>Task Complexity</span>
                  <span className="text-violet-400 font-mono">Level {formData.difficulty}/5</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="5"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: parseInt(e.target.value) })}
                  className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  <span>Effort Needed</span>
                  <span className="text-sky-400 font-mono">{formData.effort} Hours estimated</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="8"
                  value={formData.effort}
                  onChange={(e) => setFormData({ ...formData, effort: parseInt(e.target.value) })}
                  className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-violet-500/10 mt-4"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing Sub-steps & Optimizing Schedules...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4.5 h-4.5 text-white" />
                  <span>Generate Intelligent Execution Plan & Schedule</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Failure Predictor & Re-planner (xl:col-span-4) */}
        <div className="space-y-5 xl:col-span-4">
          
          {/* Card 1: Deadline Failure Predictor */}
          <div className="bg-[#090b14] border border-white/5 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-white/5">
              <BarChart2 className="w-4.5 h-4.5 text-rose-400" />
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Deadline Failure Predictor</h3>
            </div>

            <div className="space-y-4">
              {/* Prediction 1: Task Missing */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10.5px] font-bold text-gray-400">
                  <span>Task Miss Probability</span>
                  <span className={`font-mono font-black ${probabilityMissingTask > 60 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                    {probabilityMissingTask}%
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${probabilityMissingTask > 60 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${probabilityMissingTask}%` }} 
                  />
                </div>
              </div>

              {/* Prediction 2: Burnout */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10.5px] font-bold text-gray-400">
                  <span>Burnout Probability</span>
                  <span className={`font-mono font-black ${probabilityBurnout > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {probabilityBurnout}%
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${probabilityBurnout > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${probabilityBurnout}%` }} 
                  />
                </div>
              </div>

              {/* Prediction 3: Schedule Collapse */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10.5px] font-bold text-gray-400">
                  <span>Schedule Collapse</span>
                  <span className={`font-mono font-black ${probabilityScheduleCollapse > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {probabilityScheduleCollapse}%
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${probabilityScheduleCollapse > 50 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${probabilityScheduleCollapse}%` }} 
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl space-y-1.5 text-[10px] text-rose-300 font-semibold">
              <span className="font-extrabold uppercase text-[8px] text-rose-400 tracking-wider">Predictor Metrics used:</span>
              <div className="grid grid-cols-2 gap-1.5 text-gray-400 font-medium font-mono text-[9px]">
                <div>• Proximity: 2 active</div>
                <div>• Complexity: {averageComplexity.toFixed(1)}/5</div>
                <div>• Behavior: 76% rate</div>
                <div>• Deficits: {sleepDebtHours.toFixed(1)}h sleep</div>
              </div>
            </div>
          </div>

          {/* Card 2: FLAGSHIP AUTO REPLANNING CONTROL CENTER */}
          <div className="bg-[#090b14] border border-white/5 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-white/5">
              <RotateCcw className="w-4.5 h-4.5 text-amber-400" />
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Auto Replanning Command</h3>
            </div>

            <p className="text-[10px] text-gray-400 leading-relaxed font-medium mb-4">
              If deadlines are missed, the system shifts tasks and updates calendar schedules.
            </p>

            <button 
              onClick={triggerEmergencyReplan}
              disabled={isReplanning}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReplanning ? 'animate-spin' : ''}`} />
              <span>Activate Emergency Auto-Replanning</span>
            </button>

            {/* Replanning terminal simulation logs */}
            {replanningLog.length > 0 && (
              <div className="mt-3.5 bg-black/60 border border-white/5 rounded-xl p-3 font-mono text-[9px] text-gray-300 space-y-1.5 leading-relaxed max-h-[160px] overflow-y-auto custom-scrollbar">
                {replanningLog.map((log, idx) => (
                  <p key={idx} className={log.includes("COMPLETE") || log.includes("SUCCESS") ? "text-emerald-400" : ""}>
                    {log}
                  </p>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
