import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ExecutivePlan from './components/ExecutivePlan';
import AIAssistantView from './components/AIAssistantView';
import CommandCenter from './components/CommandCenter';
import TaskListSection from './components/TaskListSection';
import ProductivityTwinPanel from './components/ProductivityTwinPanel';
import AmbientStarfield from './components/AmbientStarfield';
import RescueCockpit from './components/RescueCockpit';
import PredictiveRiskScoring from './components/PredictiveRiskScoring';
import GoogleCalendarSync from './components/GoogleCalendarSync';

// Import newly separated fullscreen features
import HealthPage from './components/HealthPage';
import SleepPage from './components/SleepPage';
import FitnessPage from './components/FitnessPage';
import NutritionPage from './components/NutritionPage';
import EnergyPage from './components/EnergyPage';
import GoalsPage from './components/GoalsPage';

// Import newly created premium features
import AuthPage from './components/AuthPage';
import OnboardingFlow from './components/OnboardingFlow';
import ProfilePage from './components/ProfilePage';

import { Task, GoalOrHabit, AIRecommendation, ProductivityTwin, EmergencyScheduleItem, ChatMessage } from './types';
import { initialTasks, initialHabits, initialRecommendations, initialProductivityTwin } from './data/mockData';
import { Loader2, RefreshCw, Sparkles, LayoutGrid, ListTodo, Calendar, Heart, Moon, Dumbbell, Apple, Zap, Scale, BarChart3, MessageSquare, Settings, User, Menu } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goalsOrHabits, setGoalsOrHabits] = useState<GoalOrHabit[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [twin, setTwin] = useState<ProductivityTwin>(initialProductivityTwin());
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeRescueTaskId, setActiveRescueTaskId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Premium Authentication & Onboarding state
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('actnow_is_logged_in') === 'true';
  });
  const [isOnboarded, setIsOnboarded] = useState(() => {
    return localStorage.getItem('actnow_is_onboarded') === 'true';
  });
  const [profile, setProfile] = useState(() => {
    const cached = localStorage.getItem('actnow_profile');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return {
      name: "Vyom Bhagat",
      email: "vyom.bhagat@iit.edu",
      badge: "Pro Pilot",
      role: "Premium Pilot OS",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
      profession: "Student",
      location: "Chicago, IL",
      goals: ["Crack Internship", "Improve CGPA", "Learn DSA"],
      productivity: {
        wakeUpTime: "07:00",
        sleepTime: "23:00",
        studyHours: 4,
        workHours: 6,
        workoutFrequency: 3,
        stressLevel: "Medium"
      }
    };
  });

  const handleLoginSuccess = (email: string, name: string) => {
    const updated = {
      ...profile,
      name: name || "Vyom Bhagat",
      email: email || "vyom.bhagat@iit.edu",
    };
    setProfile(updated);
    setIsLoggedIn(true);
    localStorage.setItem('actnow_profile', JSON.stringify(updated));
    localStorage.setItem('actnow_is_logged_in', 'true');
  };

  const handleOnboardingComplete = (data: any) => {
    const updated = {
      ...profile,
      profession: data.profession,
      goals: data.goals,
      productivity: data.productivity,
      role: `${data.profession} Pilot`,
    };
    setProfile(updated);
    setIsOnboarded(true);
    localStorage.setItem('actnow_profile', JSON.stringify(updated));
    localStorage.setItem('actnow_is_onboarded', 'true');

    // Also update main page state parameters based on onboarding metrics!
    setStressLevel(data.productivity.stressLevel);
    setSleepHours(data.productivity.workoutFrequency > 4 ? 7.8 : 7.2);
  };

  const handleUpdateProfile = (data: any) => {
    const updated = {
      ...profile,
      ...data
    };
    setProfile(updated);
    localStorage.setItem('actnow_profile', JSON.stringify(updated));
  };

  const handleResetOnboarding = () => {
    setIsOnboarded(false);
    localStorage.removeItem('actnow_is_onboarded');
  };

  // Left Sidebar active tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'executive' | 'tasks' | 'calendar' | 'health' | 'sleep' | 'fitness' | 'nutrition' | 'energy' | 'goals' | 'assistant' | 'settings'
  >('dashboard');

  // Shared Interactive Life OS States
  const [healthScore, setHealthScore] = useState(82);
  const [sleepHours, setSleepHours] = useState(7.2);
  const [waterIntake, setWaterIntake] = useState(2.4);
  const [workoutCompleted, setWorkoutCompleted] = useState(true);
  const [stressLevel, setStressLevel] = useState('Medium');
  const [heartRate, setHeartRate] = useState(72);
  const [steps, setSteps] = useState(8642);
  const [calories, setCalories] = useState(1842);

  const [sleepHistory, setSleepHistory] = useState([6.0, 5.8, 6.2, 7.0, 5.5, 6.0, 6.2]);
  const [requiredSleep, setRequiredSleep] = useState(8.0);
  const [actualSleepInput, setActualSleepInput] = useState(6.0);

  const [mood, setMood] = useState('Good');
  const [mindfulnessMinutes, setMindfulnessMinutes] = useState(12);

  const [proteinGoal, setProteinGoal] = useState(80);
  const [proteinConsumed, setProteinConsumed] = useState(55);

  const [energyMap, setEnergyMap] = useState([
    { hour: "6 AM", level: 40 },
    { hour: "9 AM", level: 75 },
    { hour: "12 PM", level: 60 },
    { hour: "3 PM", level: 40 },
    { hour: "6 PM", level: 90 },
    { hour: "9 PM", level: 80 },
    { hour: "12 AM", level: 30 }
  ]);

  const [goals, setGoals] = useState([
    { id: "g1", title: "Crack Google Internship", progress: 78, category: "Career", hours: 15 },
    { id: "g2", title: "Build AI Startup", progress: 62, category: "Career", hours: 20 },
    { id: "g3", title: "Financial Freedom", progress: 45, category: "Finance", hours: 5 },
    { id: "g4", title: "Personal Fitness", progress: 80, category: "Health", hours: 8 }
  ]);

  const [conflictHours, setConflictHours] = useState({
    hackathon: 40,
    gym: 8,
    exam: 25
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello Vyom! I am ActNow AI, your advanced life companion. I am synchronised with your physical health score, sleep debt calculator, workouts, and energy curves. How can I optimize your schedule today?",
      timestamp: new Date().toISOString()
    }
  ]);

  // Load initial dataset on mount
  useEffect(() => {
    setTasks(initialTasks());
    setGoalsOrHabits(initialHabits);
    setRecommendations(initialRecommendations);
  }, []);

  // Sync / Recalculate dynamic recommendations from server
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

  // Perform AI Prioritization & Breakdown generation for a single task
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

  // Add Task with automatic priority prediction callback
  const handleAddTask = async (newTaskData: any) => {
    const tempId = `task-${Date.now()}`;
    const newTask: Task = {
      ...newTaskData,
      id: tempId,
      ignoreCount: 0,
      urgency: 'medium',
      aiPriorityScore: 50,
      missRisk: 30,
      subSteps: newTaskData.subSteps ?? []
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

  // Chat message submission with full Life OS states sync
  const handleSendChatMessage = async (query: string) => {
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setIsSyncing(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          tasks,
          goalsOrHabits,
          lifeOSState: {
            healthScore,
            sleepHours,
            waterIntake,
            workoutCompleted,
            stressLevel,
            heartRate,
            steps,
            calories,
            sleepHistory,
            requiredSleep,
            actualSleepInput,
            mood,
            mindfulnessMinutes,
            proteinGoal,
            proteinConsumed,
            energyMap,
            goals,
            conflictHours
          },
          currentTime: new Date().toISOString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toISOString(),
          actionCard: data.actionCard,
          routedAgent: data.routedAgent
        };

        setChatMessages(prev => [...prev, aiMessage]);

        // Automatically update States based on chat actions
        if (data.action && data.action.type !== 'none') {
          handleExecuteAction(data.action.type, data.action.taskData);
        }
      }
    } catch (error) {
      console.error("Failed to fetch chat reply:", error);
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

  const handleCompleteTask = (id: string) => {
    const updated = tasks.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'completed' ? 'pending' as const : 'completed' as const;
        return {
          ...t,
          status: nextStatus,
          completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined
        };
      }
      return t;
    });
    setTasks(updated);
    syncRecommendations(updated);
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    syncRecommendations(updated);
  };

  const handleDismissRecommendation = (id: string) => {
    setRecommendations(prev => prev.filter(r => r.id !== id));
  };

  // Action interpreter
  const handleExecuteAction = async (actionType: string, taskData: any) => {
    let handled = false;
    let detailMsg = "";

    // Normalize actionType and handle payloads
    if (actionType === 'create_task') {
      const deadlineStr = taskData.deadline || new Date(Date.now() + 5 * 3600000).toISOString();
      handleAddTask({
        title: taskData.title || "Voice Capture task",
        description: "Created via autonomous Voice Assistant.",
        deadline: deadlineStr,
        category: taskData.category || "assignment",
        difficulty: 3,
        effort: taskData.effort || 1.5,
        status: 'pending'
      });
      handled = true;
      detailMsg = `Autonomously scheduled "${taskData.title || 'New Task'}" in your productivity queue.`;
    } else if (actionType === 'complete_task') {
      const matchingTask = tasks.find(t => 
        (taskData.taskId && t.id === taskData.taskId) || 
        t.title.toLowerCase().includes((taskData.title || "").toLowerCase())
      );
      if (matchingTask) {
        handleCompleteTask(matchingTask.id);
        handled = true;
        detailMsg = `Marked "${matchingTask.title}" as Completed! Dopamine score increased.`;
      }
    } else if (actionType === 'reschedule_task') {
      const matchingTask = tasks.find(t => t.id === taskData.taskId);
      if (matchingTask && taskData.deadline) {
        const updated = tasks.map(t => t.id === matchingTask.id ? { ...t, deadline: taskData.deadline } : t);
        setTasks(updated);
        syncRecommendations(updated);
        handled = true;
        detailMsg = `Rescheduled "${matchingTask.title}" to ${new Date(taskData.deadline).toLocaleDateString()}.`;
      }
    } else if (actionType.includes("Publish") || (taskData && taskData.type === 'publish_cos_schedule')) {
      // Create DSA and Hackathon tasks
      const dsaTask: Task = {
        id: `dsa-cos-${Date.now()}`,
        title: "DSA Assignment Coding",
        description: "Scheduled via Chief of Staff coordinated plan.",
        deadline: new Date(Date.now() + 24 * 3600000).toISOString(),
        category: "study",
        urgency: "critical",
        effort: 2.0,
        difficulty: 4,
        status: "pending",
        ignoreCount: 0,
        aiPriorityScore: 95
      };
      const hackathonTask: Task = {
        id: `hack-cos-${Date.now()}`,
        title: "Hackathon PPT Draft",
        description: "Scheduled via Chief of Staff coordinated plan.",
        deadline: new Date(Date.now() + 30 * 3600000).toISOString(),
        category: "project",
        urgency: "high",
        effort: 3.0,
        difficulty: 3,
        status: "pending",
        ignoreCount: 0,
        aiPriorityScore: 88
      };
      
      const newTasks = [...tasks, dsaTask, hackathonTask];
      setTasks(newTasks);
      syncRecommendations(newTasks);
      setWorkoutCompleted(true);
      setSleepHours(8.0);
      setStressLevel("Low");
      setHealthScore(88);
      
      handled = true;
      detailMsg = "Published the Coordinated Chief of Staff schedule to Google Calendar. Lock gym slot (4:30 PM) and Sleep guard (9:30 PM) active.";
    } else if (actionType.includes("Focus") || (taskData && taskData.type === 'start_focus')) {
      setActiveTab('executive');
      handled = true;
      detailMsg = "Navigated to Executive Action center. Launching a high-intensity focus block with ambient soundscapes.";
    } else if (actionType.includes("Pomodoro") || (taskData && taskData.type === 'start_pomodoro')) {
      setActiveTab('dashboard');
      if (taskData && taskData.taskId) {
        setActiveRescueTaskId(taskData.taskId);
      }
      handled = true;
      detailMsg = "Initiated 25-minute Pomodoro block on active workload. Focus metrics active.";
    } else if (actionType.includes("Mindfulness") || actionType.includes("Breathing") || (taskData && taskData.type === 'start_mindfulness')) {
      setMindfulnessMinutes(prev => prev + 15);
      setStressLevel("Low");
      setHealthScore(prev => Math.min(100, prev + 4));
      handled = true;
      detailMsg = "Completed 15-minute Guided Mindfulness deep breathing session. Cortisol reduced by 22%.";
    } else if (actionType.includes("Sleep") || (taskData && taskData.type === 'lock_sleep_guard')) {
      setSleepHours(8.0);
      setHealthScore(prev => Math.min(100, prev + 5));
      handled = true;
      detailMsg = "Sleep Protection Guardrail engaged! Restorative sleep locked for 10:15 PM.";
    } else if (actionType.includes("Friday") || (taskData && taskData.type === 'mitigate_burnout')) {
      // Find the first pending task and postpone it
      const pending = tasks.find(t => t.status !== 'completed');
      if (pending) {
        const updated = tasks.map(t => t.id === pending.id ? { ...t, deadline: new Date(Date.now() + 72 * 3600000).toISOString() } : t);
        setTasks(updated);
        syncRecommendations(updated);
      }
      setStressLevel("Low");
      setHealthScore(prev => Math.min(100, prev + 3));
      handled = true;
      detailMsg = "Tradeoff Negotiated: Postponed secondary workload to Friday to secure mental health buffer today.";
    } else if (actionType.includes("Protein") || (taskData && taskData.type === 'log_protein_shake')) {
      setProteinConsumed(80);
      setHealthScore(prev => Math.min(100, prev + 2));
      handled = true;
      detailMsg = "Logged 25g high-protein metabolic intake. Fulfill goal of 80g achieved!";
    } else if (actionType.includes("Gym") || (taskData && taskData.type === 'schedule_gym')) {
      setWorkoutCompleted(true);
      setHealthScore(prev => Math.min(100, prev + 4));
      handled = true;
      detailMsg = "Circadian Gym block locked for tomorrow at 4:30 PM. Auto-declining conflicting meetings.";
    }

    if (handled) {
      const confirmMsg: ChatMessage = {
        id: `action-confirm-${Date.now()}`,
        role: "assistant",
        content: `⚡ **ActNow Executive Action Logged**\n\n${detailMsg}\n\nAll real-time Life OS metrics and goals databases have been updated dynamically. Check your active dashboards!`,
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, confirmMsg]);
    }
  };

  const handleReplanSuccess = (replanned: Task[]) => {
    setTasks(replanned);
    syncRecommendations(replanned);
  };

  const triggerManualBulkReplan = () => {
    // Shifts overdue items safely to tomorrow's peak afternoon windows
    const now = Date.now();
    const updated = tasks.map(t => {
      if (t.status !== 'completed' && new Date(t.deadline).getTime() < now) {
        return {
          ...t,
          deadline: new Date(now + 24 * 3600000).toISOString(),
          aiRecommendation: "Rescheduled automatically by the Replanning Engine to tomorrow."
        };
      }
      return t;
    });
    setTasks(updated);
    syncRecommendations(updated);
  };

  const userProfile = profile;

  // Handle active Cockpit rescue override
  if (activeRescueTaskId) {
    const rescueTask = tasks.find(t => t.id === activeRescueTaskId);
    if (rescueTask) {
      return (
        <div className="min-h-screen bg-[#030712] relative pb-16 overflow-hidden flex flex-col justify-start p-4">
          <AmbientStarfield speedUp={true} />
          <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-rose-950/10 to-transparent pointer-events-none" />
          <main className="max-w-5xl mx-auto w-full relative z-10 pt-4">
            <RescueCockpit 
              task={rescueTask} 
              onCompleteStep={(taskId, stepId) => {
                handleToggleSubStep(taskId, stepId);
              }} 
              onExitRescue={() => {
                setActiveRescueTaskId(null);
              }} 
              onAddFuel={() => {}}
            />
          </main>
        </div>
      );
    }
  }

  if (!isLoggedIn) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  if (!isOnboarded) {
    return <OnboardingFlow onOnboardingComplete={handleOnboardingComplete} userName={profile.name} />;
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white flex overflow-hidden font-sans">
      <AmbientStarfield speedUp={tasks.some(t => t.rescueMode === true)} />
      
      {/* Absolute background glows */}
      <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Left Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userProfile={userProfile} 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* 2. Main content rendering viewport on right */}
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar p-4 sm:p-6 relative z-10">
        
        {/* Mobile/Tablet Header Bar */}
        <div className="flex xl:hidden items-center justify-between p-3.5 bg-[#070913]/90 border border-white/5 rounded-2xl mb-5 sticky top-0 backdrop-blur-md z-30 shadow-lg shadow-black/40">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all cursor-pointer"
              id="mobile-sidebar-toggle"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-6.5 h-6.5 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center border border-violet-400/20">
                <Zap className="w-3.5 h-3.5 text-white fill-white/10" />
              </div>
              <span className="text-xs font-black text-white tracking-widest font-mono">ActNow</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[8px] bg-violet-600/30 text-violet-300 font-extrabold px-1.5 py-0.5 rounded font-mono uppercase tracking-wider scale-90">
              {userProfile.badge}
            </span>
            <img 
              src={userProfile.avatar} 
              alt={userProfile.name} 
              className="w-7 h-7 rounded-full border border-violet-500/20 object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        
        {/* Global synchronization bar */}
        {isSyncing && (
          <div className="flex items-center gap-2 text-xs text-violet-400 bg-violet-500/10 border border-violet-500/15 px-4 py-2 rounded-xl mb-4 animate-pulse shrink-0">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
            <span className="font-bold">Syncing life data with Gemini AI and Cloud Database...</span>
          </div>
        )}

        {/* Multi-screen viewport routing */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <Dashboard 
                tasks={tasks}
                goalsOrHabits={goalsOrHabits}
                recommendations={recommendations}
                onCompleteTask={handleCompleteTask}
                onAddTask={handleAddTask}
                setActiveTab={setActiveTab}
                onEmergencyRescue={setActiveRescueTaskId}
                
                healthScore={healthScore} setHealthScore={setHealthScore}
                sleepHours={sleepHours} setSleepHours={setSleepHours}
                waterIntake={waterIntake} setWaterIntake={setWaterIntake}
                workoutCompleted={workoutCompleted} setWorkoutCompleted={setWorkoutCompleted}
                stressLevel={stressLevel} setStressLevel={setStressLevel}
                heartRate={heartRate} setHeartRate={setHeartRate}
                steps={steps} setSteps={setSteps}
                calories={calories} setCalories={setCalories}
                
                sleepHistory={sleepHistory} setSleepHistory={setSleepHistory}
                requiredSleep={requiredSleep} setRequiredSleep={setRequiredSleep}
                actualSleepInput={actualSleepInput} setActualSleepInput={setActualSleepInput}
                
                mood={mood} setMood={setMood}
                mindfulnessMinutes={mindfulnessMinutes} setMindfulnessMinutes={setMindfulnessMinutes}
                
                proteinGoal={proteinGoal}
                proteinConsumed={proteinConsumed} setProteinConsumed={setProteinConsumed}
                
                energyMap={energyMap}
                goals={goals} setGoals={setGoals}
                conflictHours={conflictHours} setConflictHours={setConflictHours}
                
                chatMessages={chatMessages}
                onSendChatMessage={handleSendChatMessage}
              />
            </motion.div>
          )}

          {activeTab === 'executive' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <ExecutivePlan 
                tasks={tasks}
                onAddTask={handleAddTask}
                onReplanAll={triggerManualBulkReplan}
                onEmergencyRescue={setActiveRescueTaskId}
                sleepHours={sleepHours}
              />
            </motion.div>
          )}

          {activeTab === 'tasks' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-6">
              <CommandCenter 
                tasks={tasks} 
                recommendations={recommendations}
                onCompleteTask={handleCompleteTask}
                onDismissRecommendation={handleDismissRecommendation}
              />
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
                onEnterRescueCockpit={setActiveRescueTaskId}
              />
            </motion.div>
          )}

          {activeTab === 'calendar' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="max-w-2xl mx-auto">
              <GoogleCalendarSync 
                tasks={tasks}
                onReplanSuccess={handleReplanSuccess}
              />
            </motion.div>
          )}

          {activeTab === 'health' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <HealthPage 
                healthScore={healthScore} setHealthScore={setHealthScore}
                waterIntake={waterIntake} setWaterIntake={setWaterIntake}
                heartRate={heartRate} setHeartRate={setHeartRate}
                steps={steps} setSteps={setSteps}
                calories={calories} setCalories={setCalories}
                mood={mood} setMood={setMood}
                mindfulnessMinutes={mindfulnessMinutes} setMindfulnessMinutes={setMindfulnessMinutes}
              />
            </motion.div>
          )}

          {activeTab === 'sleep' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <SleepPage 
                sleepHours={sleepHours} setSleepHours={setSleepHours}
                sleepHistory={sleepHistory} setSleepHistory={setSleepHistory}
                requiredSleep={requiredSleep} setRequiredSleep={setRequiredSleep}
                actualSleepInput={actualSleepInput} setActualSleepInput={setActualSleepInput}
                setHealthScore={setHealthScore}
              />
            </motion.div>
          )}

          {activeTab === 'fitness' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <FitnessPage 
                workoutCompleted={workoutCompleted} setWorkoutCompleted={setWorkoutCompleted}
                steps={steps} setSteps={setSteps}
                calories={calories} setCalories={setCalories}
                setHealthScore={setHealthScore}
              />
            </motion.div>
          )}

          {activeTab === 'nutrition' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <NutritionPage 
                proteinGoal={proteinGoal}
                proteinConsumed={proteinConsumed} setProteinConsumed={setProteinConsumed}
                setHealthScore={setHealthScore}
                calories={calories} setCalories={setCalories}
              />
            </motion.div>
          )}

          {activeTab === 'energy' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <EnergyPage 
                energyMap={energyMap}
              />
            </motion.div>
          )}

          {activeTab === 'goals' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <GoalsPage 
                goals={goals} setGoals={setGoals}
                conflictHours={conflictHours} setConflictHours={setConflictHours}
                sleepHours={sleepHours}
              />
            </motion.div>
          )}

          {activeTab === 'assistant' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <AIAssistantView 
                tasks={tasks}
                goalsOrHabits={goalsOrHabits}
                lifeOSState={{
                  healthScore, sleepHours, waterIntake, workoutCompleted, stressLevel,
                  heartRate, steps, calories, sleepHistory, requiredSleep, actualSleepInput,
                  mood, mindfulnessMinutes, proteinGoal, proteinConsumed, goals, conflictHours
                }}
                messages={chatMessages}
                onSendMessage={handleSendChatMessage}
                isLoading={isSyncing}
                onExecuteAction={handleExecuteAction}
              />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <ProfilePage 
                userProfile={userProfile}
                onUpdateProfile={handleUpdateProfile}
                onResetOnboarding={handleResetOnboarding}
              />
            </motion.div>
          )}
        </div>

      </main>
    </div>
  );
}
