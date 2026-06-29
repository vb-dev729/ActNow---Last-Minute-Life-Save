/**
 * Types for The Last-Minute Life Saver
 */

export interface TaskSubStep {
  id: string;
  title: string;
  durationMin: number;
  completed: boolean;
}

export interface EmergencyScheduleItem {
  timeSlot: string;
  activity: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string; // ISO string
  category: 'goal' | 'assignment' | 'project' | 'exam' | 'interview' | 'work' | 'study' | 'personal' | 'finance' | 'other';
  urgency: 'critical' | 'high' | 'medium' | 'low';
  effort: number; // estimated hours to complete
  difficulty: number; // 1 to 5
  status: 'pending' | 'in_progress' | 'completed';
  actionPlan?: string[]; // step-by-step recovery/action plan from AI
  aiPriorityScore: number; // 0-100 (higher = more critical/urgent)
  aiRecommendation?: string; // custom tip from Gemini
  completedAt?: string; // ISO string
  
  // Hackathon Winner Features
  missRisk?: number; // 0-100 predicted chance of missing deadline
  ignoreCount: number; // times the user didn't start or postponed
  subSteps?: TaskSubStep[]; // AI breakdown engine
  rescueMode?: boolean; // True if "Deadline Rescue Mode" is engaged
  emergencySchedule?: EmergencyScheduleItem[]; // Hourly backup schedule
}

export interface ProductivityTwin {
  bestStudyHours: string;
  avgFocusDuration: number;
  procrastinationIndex: number;
  mostProductiveDay: string;
  dynamicAdvice: string;
}

export interface GoalOrHabit {
  id: string;
  title: string;
  frequency: 'daily' | 'weekly';
  streak: number;
  lastCompleted?: string; // ISO string (just date or complete ISO)
  category: 'health' | 'learning' | 'routine' | 'career';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  audioUrl?: string; // base64-encoded audio if generated
  actionCard?: ActionCardData;
  routedAgent?: 'productivity' | 'health' | 'goal' | 'balance';
}

export interface ActionCardData {
  type: 'task' | 'schedule' | 'risk_alert' | 'burnout_alert' | 'workout_rec' | 'sleep_rec' | 'goal_progress';
  title: string;
  subtitle?: string;
  metrics?: { label: string; value: string | number; color?: string }[];
  scheduleItems?: { time: string; activity: string; badge?: string }[];
  alertLevel?: 'danger' | 'warning' | 'info' | 'success';
  value?: number; // e.g., burnout score, goal percentage
  recommendation?: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  actionPayload?: any;
}

export interface AIRecommendation {
  id: string;
  type: 'danger' | 'warning' | 'tip' | 'action';
  title: string;
  description: string;
  affectedTaskIds?: string[];
}
