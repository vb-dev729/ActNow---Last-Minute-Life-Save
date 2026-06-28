import { useState, useEffect } from 'react';
import Header from './components/Header';
import CommandCenter from './components/CommandCenter';
import ProductivityTwinPanel from './components/ProductivityTwinPanel';
import TaskListSection from './components/TaskListSection';
import VoiceAssistant from './components/VoiceAssistant';
import AmbientStarfield from './components/AmbientStarfield';
import { Task, GoalOrHabit, AIRecommendation, ProductivityTwin, EmergencyScheduleItem } from './types';
import { initialTasks, initialHabits, initialRecommendations, initialProductivityTwin } from './data/mockData';
import { Loader2, Sparkles, Brain, RefreshCw, Volume2 } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goalsOrHabits, setGoalsOrHabits] = useState<GoalOrHabit[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [twin, setTwin] = useState<ProductivityTwin>(initialProductivityTwin());
  const [isSyncing, setIsSyncing] = useState(false);

  // Load initial dataset on mount
  useEffect(() => {
    setTasks(initialTasks());
    setGoalsOrHabits(initialHabits);
    setRecommendations(initialRecommendations);
  }, []);

  // Sync / Recalculate dynamic recommendations whenever tasks list updates
  const syncRecommendations = async (currentTasks: Task[]) => {
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks: currentTasks,
          goalsOrHabits,
          currentTime: new Date().toISOString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setRecommendations(data);
        }
      }
    } catch (error) {
      console.error("Failed to sync fresh alerts from server:", error);
    }
  };

  // Perform complete AI Prioritization & Breakdown generation for a single task or entire queue
  const handleAnalyzeTask = async (taskId: string) => {
    setIsSyncing(true);
    try {
      const targetTask = tasks.find(t => t.id === taskId);
      if (!targetTask) return;

      const response = await fetch("/api/prioritize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks: [targetTask],
          currentTime: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error("AI analysis query failed");
      const data = await response.json();

      if (data.prioritizedTasks && data.prioritizedTasks.length > 0) {
        const result = data.prioritizedTasks[0];
        
        const updatedTasks = tasks.map(t => {
          if (t.id === taskId) {
            return {
              ...t,
              aiPriorityScore: result.aiPriorityScore ?? t.aiPriorityScore,
              urgency: result.urgency ?? t.urgency,
              aiRecommendation: result.aiRecommendation ?? t.aiRecommendation,
              missRisk: result.missRisk ?? t.missRisk,
              subSteps: result.subSteps ?? t.subSteps,
              emergencySchedule: result.emergencySchedule ?? t.emergencySchedule
            };
          }
          return t;
        });

        setTasks(updatedTasks);
        syncRecommendations(updatedTasks);
      }
    } catch (error) {
      console.error("Task analysis failed:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Completely recalculate all priorities in real-time
  const handleRecalculateAll = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch("/api/prioritize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks,
          currentTime: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error("Bulk prioritization failed");
      const data = await response.json();

      if (data.prioritizedTasks && Array.isArray(data.prioritizedTasks)) {
        const updatedTasks = tasks.map(t => {
          const matched = data.prioritizedTasks.find((p: any) => p.id === t.id);
          if (matched) {
            return {
              ...t,
              aiPriorityScore: matched.aiPriorityScore ?? t.aiPriorityScore,
              urgency: matched.urgency ?? t.urgency,
              aiRecommendation: matched.aiRecommendation ?? t.aiRecommendation,
              missRisk: matched.missRisk ?? t.missRisk,
              subSteps: matched.subSteps ?? t.subSteps,
              emergencySchedule: matched.emergencySchedule ?? t.emergencySchedule
            };
          }
          return t;
        });

        setTasks(updatedTasks);
        syncRecommendations(updatedTasks);
      }
    } catch (error) {
      console.error("Bulk prioritization failed:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Add Task with automatic Gemini prediction callback
  const handleAddTask = async (newTaskData: Omit<Task, 'id' | 'aiPriorityScore' | 'missRisk' | 'subSteps' | 'ignoreCount' | 'urgency'>) => {
    const tempId = `task-${Date.now()}`;
    const newTask: Task = {
      ...newTaskData,
      id: tempId,
      ignoreCount: 0,
      urgency: 'medium', // Default before Gemini calculates precise stress level
      aiPriorityScore: 50, // default placeholder
      missRisk: 30, // default placeholder
      subSteps: []
    };

    const newTasksList = [...tasks, newTask];
    setTasks(newTasksList);
    setIsSyncing(true);

    try {
      const response = await fetch("/api/prioritize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks: [newTask],
          currentTime: new Date().toISOString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.prioritizedTasks && data.prioritizedTasks.length > 0) {
          const aiResult = data.prioritizedTasks[0];
          const finalizedTasks = newTasksList.map(t => {
            if (t.id === tempId) {
              return {
                ...t,
                aiPriorityScore: aiResult.aiPriorityScore ?? 65,
                urgency: aiResult.urgency ?? 'medium',
                aiRecommendation: aiResult.aiRecommendation ?? 'Get started soon.',
                missRisk: aiResult.missRisk ?? 45,
                subSteps: aiResult.subSteps ?? []
              };
            }
            return t;
          });
          setTasks(finalizedTasks);
          syncRecommendations(finalizedTasks);
          return;
        }
      }
      syncRecommendations(newTasksList);
    } catch (error) {
      console.error("Failed to analyze added task:", error);
      syncRecommendations(newTasksList);
    } finally {
      setIsSyncing(false);
    }
  };

  // Toggle checklist sub-step
  const handleToggleSubStep = (taskId: string, subStepId: string) => {
    const updated = tasks.map(t => {
      if (t.id === taskId && t.subSteps) {
        return {
          ...t,
          subSteps: t.subSteps.map(s => s.id === subStepId ? { ...s, completed: !s.completed } : s)
        };
      }
      return t;
    });
    setTasks(updated);
    syncRecommendations(updated);
  };

  // Toggle "Deadline Rescue Mode"
  const handleToggleRescueMode = (taskId: string) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          rescueMode: !t.rescueMode
        };
      }
      return t;
    });
    setTasks(updated);
    syncRecommendations(updated);
  };

  const handleUpdateRescueSchedule = (taskId: string, schedule: EmergencyScheduleItem[]) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          emergencySchedule: schedule
        };
      }
      return t;
    });
    setTasks(updated);
  };

  // Complete a task
  const handleCompleteTask = (id: string) => {
    const updated = tasks.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: t.status === 'completed' ? 'pending' as const : 'completed' as const,
          completedAt: t.status === 'completed' ? undefined : new Date().toISOString()
        };
      }
      return t;
    });
    setTasks(updated);
    syncRecommendations(updated);
  };

  // Delete a task
  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    syncRecommendations(updated);
  };

  // Dismiss recommendation
  const handleDismissRecommendation = (id: string) => {
    setRecommendations(prev => prev.filter(r => r.id !== id));
  };

  // Executing autonomous commands from the Voice Assistant (SaverAI)
  const handleExecuteAction = async (actionType: string, taskData: any) => {
    if (actionType === 'create_task') {
      const deadlineStr = taskData.deadline || new Date(Date.now() + 5 * 3600000).toISOString();
      handleAddTask({
        title: taskData.title || "Voice Capture task",
        description: "Created via autonomous Voice Assistant.",
        deadline: deadlineStr,
        category: taskData.category || "work",
        difficulty: 3,
        effort: taskData.effort || 1.5,
        status: 'pending'
      });
    } else if (actionType === 'complete_task') {
      // Find matching task by ID or by finding the closest title match
      const matchingTask = tasks.find(t => 
        (taskData.taskId && t.id === taskData.taskId) || 
        t.title.toLowerCase().includes((taskData.title || "").toLowerCase())
      );
      if (matchingTask) {
        handleCompleteTask(matchingTask.id);
      }
    } else if (actionType === 'reschedule_task') {
      const matchingTask = tasks.find(t => t.id === taskData.taskId);
      if (matchingTask && taskData.deadline) {
        const updated = tasks.map(t => t.id === matchingTask.id ? { ...t, deadline: taskData.deadline } : t);
        setTasks(updated);
        syncRecommendations(updated);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] relative pb-16 overflow-hidden">
      <AmbientStarfield />
      {/* Decorative radial gradients for a beautiful futuristic look */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50vw] h-[50vw] bg-fuchsia-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main container */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-6 relative z-10">
        
        {/* Dynamic header panel */}
        <Header tasks={tasks} />

        {/* Global Synchronization indicator */}
        {isSyncing && (
          <div className="flex items-center gap-2 text-xs text-violet-400 bg-violet-500/10 border border-violet-500/20 px-4 py-2.5 rounded-xl mb-6 justify-center animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
            <span className="font-bold">Syncing live analytics with Gemini API server...</span>
          </div>
        )}

        {/* Action center stats row */}
        <CommandCenter 
          tasks={tasks} 
          recommendations={recommendations}
          onCompleteTask={handleCompleteTask}
          onDismissRecommendation={handleDismissRecommendation}
        />

        {/* Custom bulk action row to re-trigger analysis manually */}
        <div className="flex justify-end gap-3 mb-6">
          <button
            onClick={handleRecalculateAll}
            disabled={isSyncing}
            className="text-xs bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 font-bold py-2 px-4 rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-40 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Recalculate Urgency Weights</span>
          </button>
        </div>

        {/* Productivity Twin side-by-side with Heat Map */}
        <ProductivityTwinPanel tasks={tasks} twin={twin} />

        {/* Main Grid: Workspaces on left vs Voice assistant on right */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Main workspace (Tasks, timers, habits) */}
          <div className="xl:col-span-8">
            <TaskListSection 
              tasks={tasks}
              goalsOrHabits={goalsOrHabits}
              onCompleteTask={handleCompleteTask}
              onDeleteTask={handleDeleteTask}
              onAddTask={handleAddTask}
              onToggleSubStep={handleToggleSubStep}
              onToggleRescueMode={handleToggleRescueMode}
              onUpdateRescueSchedule={handleUpdateRescueSchedule}
              onAnalyzeTask={handleAnalyzeTask}
            />
          </div>

          {/* Autonomous Voice Copilot */}
          <div className="xl:col-span-4">
            <VoiceAssistant 
              tasks={tasks}
              goalsOrHabits={goalsOrHabits}
              onExecuteAction={handleExecuteAction}
            />
          </div>
        </div>

      </main>
    </div>
  );
}
