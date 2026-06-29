import { Task, GoalOrHabit, AIRecommendation, ProductivityTwin } from '../types';

export const initialTasks = (): Task[] => {
  const now = new Date();
  
  // Task 1: Due in 3 hours (Critical)
  const deadline1 = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  // Task 2: Due in 14 hours (High)
  const deadline2 = new Date(now.getTime() + 14 * 60 * 60 * 1000);
  // Task 3: Due in 28 hours (Medium)
  const deadline3 = new Date(now.getTime() + 28 * 60 * 60 * 1000);
  // Task 4: Due in 5 days (Low)
  const deadline4 = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

  return [
    {
      id: "task-1",
      title: "Deliver Hackathon National Level Pitch Slides",
      description: "Complete and polish the pitch deck for tomorrow morning's National Hackathon presentation. Needs financial charts, product demo link, and final roadmap validation.",
      deadline: deadline1.toISOString(),
      category: "work",
      urgency: "critical",
      difficulty: 4,
      effort: 2.5,
      status: "in_progress",
      aiPriorityScore: 94,
      missRisk: 86,
      ignoreCount: 3, // Ignored 3 times! Triggers behavioral intervention
      aiRecommendation: "⚠️ Extreme risk (86%). You have ignored this task 3 times. Let's spend just 5 minutes on it now in Rescue Mode to bypass start-resistance.",
      subSteps: [
        { id: "step-1", title: "Verify 3-year revenue growth chart calculations (INR)", durationMin: 15, completed: false },
        { id: "step-2", title: "Record 1-minute YouTube/Vimeo demo walk-through clip", durationMin: 25, completed: false },
        { id: "step-3", title: "Refine 'Why Now' India growth & UPI integration slide", durationMin: 20, completed: false },
        { id: "step-4", title: "Perform one rapid verbal speech practice run-through", durationMin: 15, completed: false }
      ],
      rescueMode: true,
      emergencySchedule: [
        { timeSlot: "18:00 - 18:30", activity: "Lock in core deck metrics & save slides" },
        { timeSlot: "18:30 - 19:15", activity: "Integrate video demonstration element" },
        { timeSlot: "19:15 - 19:45", activity: "Dry-run speech with timer & sync backups" }
      ]
    },
    {
      id: "task-2",
      title: "Organic Chemistry & JEE Exam Prep",
      description: "Study key nucleophilic substitution mechanisms and prepare reference card sheets for the upcoming Indian board and exam papers.",
      deadline: deadline2.toISOString(),
      category: "study",
      urgency: "high",
      difficulty: 5,
      effort: 4.0,
      status: "pending",
      aiPriorityScore: 82,
      missRisk: 72,
      ignoreCount: 1,
      aiRecommendation: "Midterm chemistry exam is in 14 hours. High cognitive weight. Study the SN1/SN2 speed rules and sample solutions first.",
      subSteps: [
        { id: "step-2-1", title: "Compare rate laws for SN1 vs SN2 processes", durationMin: 30, completed: false },
        { id: "step-2-2", title: "Solve practice quiz diagrams in IIT-JEE Chapter 8", durationMin: 45, completed: false },
        { id: "step-2-3", title: "Write physical mechanism cheat sheet on paper", durationMin: 25, completed: false }
      ],
      rescueMode: false
    },
    {
      id: "task-3",
      title: "Auto-Pay Indian Hosting Instance Bill (via UPI)",
      description: "Transfer buffer funds and pay AWS/Google Cloud instance invoices to prevent sudden database suspension.",
      deadline: deadline3.toISOString(),
      category: "finance",
      urgency: "medium",
      difficulty: 1,
      effort: 0.2,
      status: "pending",
      aiPriorityScore: 52,
      missRisk: 44,
      ignoreCount: 0,
      aiRecommendation: "Extremely low effort (10 mins). Clear Indian cloud invoices immediately to free your brain from micro-stressors.",
      subSteps: [
        { id: "step-3-1", title: "Verify hosting service statement details & tax rates", durationMin: 5, completed: false },
        { id: "step-3-2", title: "Confirm quick NetBanking or UPI authorization receipt", durationMin: 5, completed: false }
      ],
      rescueMode: false
    },
    {
      id: "task-4",
      title: "Renew Passport & Aadhaar verification",
      description: "Submit online questionnaire, print photograph rules, and pay renewal processing fees on Government of India portal.",
      deadline: deadline4.toISOString(),
      category: "personal",
      urgency: "low",
      difficulty: 2,
      effort: 1.5,
      status: "pending",
      aiPriorityScore: 18,
      missRisk: 12,
      ignoreCount: 0,
      aiRecommendation: "Safe buffer (5 days). Postpone to Saturday morning so you can crush your pitch and chemistry exam today.",
      subSteps: [
        { id: "step-4-1", title: "Fill in legal digital passport questionnaire", durationMin: 40, completed: false },
        { id: "step-4-2", title: "Locate physical Aadhaar card and utility bills for address proof", durationMin: 15, completed: false }
      ],
      rescueMode: false
    }
  ];
};

export const initialHabits: GoalOrHabit[] = [
  {
    id: "habit-1",
    title: "Deep Focus Sprints (90 min)",
    frequency: "daily",
    streak: 6,
    category: "career"
  },
  {
    id: "habit-2",
    title: "Morning Habit Stack review",
    frequency: "daily",
    streak: 15,
    category: "routine"
  },
  {
    id: "habit-3",
    title: "Product Design portfolio update",
    frequency: "weekly",
    streak: 2,
    category: "learning"
  }
];

export const initialRecommendations: AIRecommendation[] = [
  {
    id: "rec-1",
    type: "danger",
    title: "Task Overlap Congestion",
    description: "You have 6.5 hours of high cognitive work due in the next 15 hours. We highly recommend pausing 'Product Design portfolio' this week to secure sleep before your presentation.",
    affectedTaskIds: ["task-1", "task-2"]
  },
  {
    id: "rec-2",
    type: "warning",
    title: "Postponement Risk detected",
    description: "You have ignored 'Investment Pitch Slides' 3 times! Our model estimates an 86% failure rate if start delay exceeds 2 hours.",
    affectedTaskIds: ["task-1"]
  },
  {
    id: "rec-3",
    type: "tip",
    title: "Perfect Peak Window Active",
    description: "Your Productivity Twin profile shows your maximum deep focus flow occurs between 6 PM and 9 PM. Tap 'Start Rescue Mode' on task 1 to leverage this energy.",
    affectedTaskIds: ["task-1"]
  }
];

export const initialProductivityTwin = (): ProductivityTwin => {
  return {
    bestStudyHours: "18:00 - 21:00",
    avgFocusDuration: 45, // minutes
    procrastinationIndex: 72, // out of 100
    mostProductiveDay: "Tuesday",
    dynamicAdvice: "You are highly prone to start-resistance during early afternoon, but experience a major surge in output after 6:00 PM. Schedule complex writing and coding tasks for this late window."
  };
};
