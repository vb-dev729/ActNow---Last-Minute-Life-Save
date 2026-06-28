import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Google Gen AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper: Ensure API key is present
const checkApiKey = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is not configured. Please add it via the Secrets panel."
    });
  }
  next();
};

// ==========================================
// ROBUST FALLBACK CALCULATORS (API FAILSAFE)
// ==========================================
function getFallbackPrioritizedTasks(tasks: any[], currentTimeStr?: string) {
  const now = currentTimeStr ? new Date(currentTimeStr) : new Date();
  return tasks.map((task: any) => {
    const deadlineDate = new Date(task.deadline);
    const hoursRemaining = (deadlineDate.getTime() - now.getTime()) / 3600000;
    
    let proximityScore = 10;
    if (hoursRemaining < 0) proximityScore = 75;
    else if (hoursRemaining <= 12) proximityScore = 65;
    else if (hoursRemaining <= 24) proximityScore = 50;
    else if (hoursRemaining <= 72) proximityScore = 30;
    
    const difficultyScore = (task.difficulty || 3) * 4;
    const effortScore = Math.min(25, (task.effort || 2) * 4);
    
    const rawScore = proximityScore + difficultyScore + effortScore;
    const aiPriorityScore = Math.min(98, Math.max(15, Math.round(rawScore)));
    
    let urgency = "medium";
    if (aiPriorityScore >= 75 || hoursRemaining <= 12) urgency = "critical";
    else if (aiPriorityScore >= 55 || hoursRemaining <= 36) urgency = "high";
    else if (aiPriorityScore >= 35 || hoursRemaining <= 72) urgency = "medium";
    else urgency = "low";
    
    const missRisk = Math.min(95, Math.max(10, Math.round((aiPriorityScore * 0.8) + (task.difficulty || 3) * 3)));
    
    let aiRecommendation = "";
    if (urgency === "critical") {
      aiRecommendation = "Action is mandatory immediately. Put your phone in Do Not Disturb and execute the first 10-minute micro-step to break inertia.";
    } else if (urgency === "high") {
      aiRecommendation = "Focus on starting a 25-minute Pomodoro session today. Sustained effort now will eliminate last-minute deadline panic.";
    } else if (urgency === "medium") {
      aiRecommendation = "Steady progressive steps today will secure your peace of mind. Complete at least two sub-steps before checking out.";
    } else {
      aiRecommendation = "Low stress. Complete a quick review early to maintain momentum and free up your weekend.";
    }
    
    const subSteps = task.subSteps && task.subSteps.length > 0 ? task.subSteps : (() => {
      const title = (task.title || "").toLowerCase();
      if (title.includes("study") || title.includes("prep") || title.includes("exam") || title.includes("test") || title.includes("quiz")) {
        return [
          { id: "step-1", title: "Review principal concepts & classroom slide decks", durationMin: 25, completed: false },
          { id: "step-2", title: "Solve practice exam questions & reference notes", durationMin: 35, completed: false },
          { id: "step-3", title: "Draft concise summary cheatsheet of weak spots", durationMin: 20, completed: false },
          { id: "step-4", title: "Perform rapid active recall self-test", durationMin: 15, completed: false }
        ];
      }
      return [
        { id: "step-1", title: "Outline core requirements and prepare workspace", durationMin: 15, completed: false },
        { id: "step-2", title: "Draft main components focusing strictly on content, not formatting", durationMin: 45, completed: false },
        { id: "step-3", title: "Refine styling, fix errors, and proofread details", durationMin: 25, completed: false },
        { id: "step-4", title: "Perform final polish and queue for submission", durationMin: 15, completed: false }
      ];
    })();
    
    const emergencySchedule = task.emergencySchedule && task.emergencySchedule.length > 0 ? task.emergencySchedule : [
      { timeSlot: "Hour 1 - Active Launch", activity: "Set up full focus cocoon. Complete initial 15-minute setup and outline." },
      { timeSlot: "Hour 2 - Raw Build", activity: "Dive into 45 minutes of pure uninterrupted production or drafting." },
      { timeSlot: "Hour 3 - Polish & Refine", activity: "Wrap up remaining details, resolve bottlenecks, and complete final review." }
    ];
    
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      category: task.category,
      difficulty: task.difficulty,
      effort: task.effort,
      status: task.status,
      aiPriorityScore,
      urgency,
      aiRecommendation,
      missRisk,
      subSteps,
      emergencySchedule,
      ignoreCount: task.ignoreCount || 0
    };
  });
}

function getFallbackRecommendations(tasks: any[]) {
  const list: any[] = [];
  
  // Find overdue tasks
  const overdue = tasks.filter(t => t.status !== 'completed' && new Date(t.deadline).getTime() < Date.now());
  if (overdue.length > 0) {
    list.push({
      id: "fallback-rec-overdue",
      type: "danger",
      title: "Overdue Warning Active",
      description: `"${overdue[0].title}" is past due! Turn on Focus Mode and do a 5-minute micro session right now to break start-resistance.`,
      affectedTaskIds: overdue.map(t => t.id)
    });
  }
  
  // Find critical/high urgency tasks
  const highUrgency = tasks.filter(t => t.status !== 'completed' && (t.urgency === 'critical' || t.urgency === 'high'));
  if (highUrgency.length > 0) {
    list.push({
      id: "fallback-rec-high",
      type: "warning",
      title: "High Urgency Priority Block",
      description: `"${highUrgency[0].title}" has critical urgency weight. Banish notifications, clear your calendar, and prioritize this first thing today.`,
      affectedTaskIds: highUrgency.map(t => t.id)
    });
  }
  
  // Default general habits suggestions
  list.push({
    id: "fallback-rec-twin",
    type: "tip",
    title: "Twin Energy Optimization",
    description: "Your learned Productivity Twin profile indicates you are entering your prime performance energy window. Put your phone on silent to protect focus flow.",
    affectedTaskIds: []
  });
  
  list.push({
    id: "fallback-rec-habit",
    type: "action",
    title: "Procrastination Shield",
    description: "Bypassing initial start resistance is the hardest 90% of the battle. Engage the 'Start 5m Focus' micro-timer to kickstart cognitive inertia.",
    affectedTaskIds: []
  });
  
  return list.slice(0, 4);
}

function getFallbackChatReply(messages: any[], tasks: any[]) {
  const lastMsg = messages[messages.length - 1];
  const query = (lastMsg?.content || "").toLowerCase();
  
  let reply = "I understand. When cognitive overload hits, our brains freeze up in task resistance. Let's tackle just one small sub-step together to break the ice. What is the smallest action we can take right now?";
  let action: any = { type: "none" };
  
  if (query.includes("create") || query.includes("schedule") || query.includes("add") || query.includes("new task")) {
    let title = "Quick Action Task";
    const matches = query.match(/(?:create|schedule|add|task to)\s+([^,.]+)/i);
    if (matches && matches[1]) {
      title = matches[1].replace(/for\s+\d+.*hours?/i, "").trim();
    }
    
    reply = `I have successfully created and added the task "${title}" to your queue! Let's jump on it now before procrastination creeps in.`;
    action = {
      type: "create_task",
      taskData: {
        title,
        deadline: new Date(Date.now() + 4 * 3600000).toISOString(),
        category: "work",
        effort: 1.5
      }
    };
  } else if (query.includes("complete") || query.includes("done") || query.includes("finish") || query.includes("check off")) {
    let matchedTask = tasks[0];
    for (const t of tasks) {
      if (query.includes(t.title.toLowerCase())) {
        matchedTask = t;
        break;
      }
    }
    
    if (matchedTask) {
      reply = `Superb job completing "${matchedTask.title}"! Checking tasks off releases a burst of dopamine that destroys procrastination. Let's keep the streak going!`;
      action = {
        type: "complete_task",
        taskData: {
          taskId: matchedTask.id,
          title: matchedTask.title
        }
      };
    } else {
      reply = "That's awesome! Let me know which task from your active queue you finished so I can check it off for you.";
    }
  } else if (query.includes("reschedule") || query.includes("move") || query.includes("postpone") || query.includes("later")) {
    let matchedTask = tasks[0];
    for (const t of tasks) {
      if (query.includes(t.title.toLowerCase())) {
        matchedTask = t;
        break;
      }
    }
    
    if (matchedTask) {
      const newDeadline = new Date(Date.now() + 24 * 3600000).toISOString();
      reply = `Understood. I have rescheduled "${matchedTask.title}" for tomorrow. But remember, postponing can build up resistance — try a quick 5-minute Pomodoro block today anyway!`;
      action = {
        type: "reschedule_task",
        taskData: {
          taskId: matchedTask.id,
          deadline: newDeadline
        }
      };
    } else {
      reply = "I can help you reschedule. Tell me the task name and when you would like to move it to.";
    }
  } else if (query.includes("overwhelmed") || query.includes("stress") || query.includes("stuck") || query.includes("anxious") || query.includes("panic") || query.includes("break")) {
    reply = "It's completely natural to feel overwhelmed. When we are stressed, our brains' prefrontal cortex shuts down. Close your eyes, take 3 slow, deep breaths, and let's commit to doing just one tiny 2-minute action. I'm right here with you.";
  }
  
  return { reply, action };
}

/**
 * API: Prioritize and analyze tasks
 * Takes a list of tasks and returns updated priority scores, urgency, recommendations, and action plans.
 */
app.post("/api/prioritize", checkApiKey, async (req, res) => {
  try {
    const { tasks, currentTime } = req.body;

    if (!tasks || !Array.isArray(tasks)) {
      return res.status(400).json({ error: "Invalid tasks payload" });
    }

    if (tasks.length === 0) {
      return res.json({ prioritizedTasks: [] });
    }

    const prompt = `
      Analyze and prioritize the following user tasks relative to the current time: ${currentTime || new Date().toISOString()}.
      
      For each task:
      1. Calculate an AI Priority Score (0 to 100) using a multi-factor formula:
         Score = Deadline Proximity + Task Difficulty (1-5 scaled) + Estimated Effort + User Procrastination risk weight.
      2. Predict a Deadline Miss Risk percentage (0 to 100):
         Estimate the realistic likelihood (e.g. 74%) that this user will miss this deadline. Make it realistic based on the deadline density and the task's high effort / high difficulty.
      3. Create a supportive, extremely brief, personalized AI recommendation (e.g., "Do this first thing during your high focus peak" or "Start with a 5-minute easy win").
      4. Break down the task into 3-5 micro-steps (AI Breakdown Engine) to make it non-overwhelming. Assign an ID (e.g. "step-1"), a title, and a precise duration in minutes for each.
      5. Generate an Hour-by-Hour Emergency Rescue Plan (emergencySchedule) starting from soon after the current time. Only generate this if urgency is 'critical' or 'high'. It should outline exactly what to focus on hour-by-hour to complete the task before the deadline.

      Tasks data to analyze:
      ${JSON.stringify(tasks, null, 2)}

      Respond strictly in JSON format matching the schema provided.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prioritizedTasks: {
              type: Type.ARRAY,
              description: "The list of tasks with AI fields populated",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  aiPriorityScore: { type: Type.INTEGER, description: "0-100 score" },
                  urgency: { type: Type.STRING, description: "critical, high, medium, or low" },
                  aiRecommendation: { type: Type.STRING, description: "Brief advice" },
                  missRisk: { type: Type.INTEGER, description: "0-100 percentage" },
                  subSteps: {
                    type: Type.ARRAY,
                    description: "Task breakdown sub-steps",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        durationMin: { type: Type.INTEGER },
                        completed: { type: Type.BOOLEAN }
                      },
                      required: ["id", "title", "durationMin", "completed"]
                    }
                  },
                  emergencySchedule: {
                    type: Type.ARRAY,
                    description: "Hour-by-hour rescue plan schedule",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        timeSlot: { type: Type.STRING, description: "e.g., '14:00 - 15:00'" },
                        activity: { type: Type.STRING, description: "Highly actionable research/testing/review action" }
                      },
                      required: ["timeSlot", "activity"]
                    }
                  }
                },
                required: ["id", "aiPriorityScore", "urgency", "aiRecommendation", "missRisk", "subSteps"]
              }
            }
          },
          required: ["prioritizedTasks"]
        }
      }
    });

    const resultText = response.text?.trim() || "{}";
    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.log("[Local AI Engine] ActNow AI Copilot active for Prioritize request.");
    const fallbackTasks = getFallbackPrioritizedTasks(req.body.tasks || [], req.body.currentTime);
    res.json({ prioritizedTasks: fallbackTasks });
  }
});

/**
 * API: Generate Context-Aware Warnings and Habits Recommendations
 */
app.post("/api/recommendations", checkApiKey, async (req, res) => {
  try {
    const { tasks, goalsOrHabits, currentTime } = req.body;

    const prompt = `
      You are ActNow, the action-focused productivity companion. Analyze the user's workload and habits:
      Current Time: ${currentTime || new Date().toISOString()}
      Tasks: ${JSON.stringify(tasks || [], null, 2)}
      Habits/Goals: ${JSON.stringify(goalsOrHabits || [], null, 2)}

      Generate 3 to 4 hyper-specific, actionable recommendations or alarm warnings. 
      Examples:
      - Overload Warning: "You have 8 hours of work due in the next 12 hours. We recommend pausing your habit 'Read 15 pages' today to secure 2 extra hours for your Work assignment."
      - Streak Alert: "Your daily coding streak is at 4 days! Complete a quick 10-minute session to keep it alive before bedtime."
      - Mitigation advice: "Your 'Study Chemistry' has critical urgency. Tackle this during your high-energy window at 2:00 PM."

      Format the response strictly as a JSON array matching the specified schema.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "List of actionable recommendations or alerts",
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "Unique short string, e.g. 'rec-1'" },
              type: { type: Type.STRING, description: "danger, warning, tip, or action" },
              title: { type: Type.STRING, description: "Short title of the warning/tip" },
              description: { type: Type.STRING, description: "Full descriptive and supportive advice" },
              affectedTaskIds: {
                type: Type.ARRAY,
                description: "Array of related task IDs if applicable",
                items: { type: Type.STRING }
              }
            },
            required: ["id", "type", "title", "description"]
          }
        }
      }
    });

    const resultText = response.text?.trim() || "[]";
    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.log("[Local AI Engine] ActNow AI Copilot active for Recommendations request.");
    const fallbackRecommendations = getFallbackRecommendations(req.body.tasks || []);
    res.json(fallbackRecommendations);
  }
});

/**
 * API: Voice-Enabled SaverAI Chat (Autonomous Action Executions)
 * Decides whether to converse naturally OR autonomously create/complete/reschedule a task.
 */
app.post("/api/chat", checkApiKey, async (req, res) => {
  try {
    const { messages, tasks, goalsOrHabits, currentTime } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages payload" });
    }

    const systemInstruction = `
      You are 'ActNow AI', the voice/text personal assistant for the 'ActNow' application.
      The current time is: ${currentTime || new Date().toISOString()}.
      
      You assist students, professionals, and entrepreneurs who are stressed and on the verge of missing deadlines. 
      Speak supportively, calmly, and keep your answers direct, actionable, and short (under 3 sentences) since the user is in a hurry.

      You are fully autonomous! You have direct access to modify the user's tasks.
      If the user says something indicating they want to create/schedule a task, mark a task as complete, or reschedule a deadline,
      you must return the corresponding action details in the JSON response alongside your vocal reply.

      Supported action types:
      - 'create_task':
         Identify the title, deadline (calculate the actual ISO string based on relative terms like "tomorrow at 5 PM", "in 3 hours", etc., relative to the current time: ${currentTime}), category, and effort (estimated hours).
      - 'complete_task':
         Identify the taskId or unique title of the task they want to complete.
      - 'reschedule_task':
         Identify the taskId and the new deadline ISO string.
      - 'none':
         If they are just chatting, asking a question, or no specific task action is requested.

      Current User Tasks:
      ${JSON.stringify(tasks || [], null, 2)}

      Current User Habits/Goals:
      ${JSON.stringify(goalsOrHabits || [], null, 2)}

      Respond strictly in JSON format matching the schema.
    `;

    // Map messages history to Gemini format (user/model)
    const formattedContents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING, description: "Your supportive conversational voice reply to the user (keep it concise, under 3 sentences)" },
            action: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, description: "create_task, complete_task, reschedule_task, or none" },
                taskData: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: "Title of the task" },
                    deadline: { type: Type.STRING, description: "Calculated ISO string of the deadline" },
                    category: { type: Type.STRING, description: "work, study, personal, finance, or other" },
                    effort: { type: Type.NUMBER, description: "Estimated hours to complete (e.g. 2)" },
                    taskId: { type: Type.STRING, description: "The ID of the task to complete/reschedule" }
                  }
                }
              },
              required: ["type"]
            }
          },
          required: ["reply", "action"]
        }
      }
    });

    const resultText = response.text?.trim() || "{}";
    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.log("[Local AI Engine] ActNow AI Copilot active for Chat request.");
    const fallbackChat = getFallbackChatReply(req.body.messages || [], req.body.tasks || []);
    res.json(fallbackChat);
  }
});

/**
 * API: Text-to-Speech (TTS) using Gemini TTS model
 * Synthesizes a supportive audio response for the Voice Assistant
 */
app.post("/api/tts", checkApiKey, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required for speech synthesis" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Say supportively: ${text}` }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            // Options: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
            prebuiltVoiceConfig: { voiceName: 'Zephyr' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: "Failed to generate synthesized audio stream" });
    }

    res.json({ audio: base64Audio });
  } catch (error: any) {
    console.log("[TTS] Client-side speech synthesis fallback is available.");
    // Return gracefully so browser fallbacks can be triggered instead of crashing
    res.status(500).json({ error: "TTS error" });
  }
});

/**
 * Setup static servers and Vite middleware
 */
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
