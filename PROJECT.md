# ActNow AI: The Last-Minute Life Saver

An autonomous, multi-agent AI executive assistant designed to safeguard schedules, mental wellbeing, sleep buffers, and health priorities before critical deadlines are missed.

---

## 📌 1. Problem Statement Selected
**Student, Professional, and Entrepreneurial Burnout & Deadline Misses**

### Background
Modern students, professionals, and entrepreneurs operate in a high-cognitive-load environment. They are constantly bombarded with assignments, hackathons, meetings, career milestones, workouts, and personal commitments. 

### The Challenge with Existing Tools
Existing productivity platforms (like Todoist, Google Tasks, or standard calendar reminders) are **passive**. They send static, easy-to-dismiss notifications like *"DSA Assignment tomorrow at 11:59 PM"*. These alerts fail to solve the actual barrier to execution:
* **Task Inertia & Start Resistance:** Passive reminders do not break down complex workloads or solve cognitive overwhelm.
* **Lack of Context Awareness:** Traditional tools do not understand the user's real-time physical states—such as acute sleep debt, workout lapses, high burnout indices, or daily mental fatigue levels.
* **Zero Tradeoff Negotiation:** When an overloaded user says, *"I have a DSA assignment, Hackathon PPT, and Gym tomorrow,"* traditional systems merely display all three tasks side-by-side, contributing to cognitive lock and ultimate failure.

---

## 🚀 2. Solution Overview: ActNow AI
**ActNow AI** is an autonomous, full-stack **Autonomous Life OS & Companion** that shifts the paradigm from *passive reminders* to *active, executive schedule protection*. 

By integrating a state-of-the-art **Multi-Agent Orchestration Pipeline**, ActNow AI acts as a **Chief of Staff** that proactively coordinates schedule blocks, protects circadian sleep windows, logs high-protein nutritional recoveries, locks gym times, and negotiates tradeoffs to mitigate burnout. 

Through its interactive **Action-Based Chat Interface** and **Voice Assistant 2.0 Command System**, users can speak or type conversational commands, and the system autonomously executes backend calendar syncing, task creation, and cognitive relief plans in real-time.

---

## 🛠️ 3. System Architecture & Workflows (Visualized)

### High-Level Multi-Agent Routing Workflow
```
                  [ User Input: Voice / Text ]
                               │
                               ▼
                   [ ActNow AI Orchestrator ]
                     (Gemini 3.5-Flash)
                               │
            ┌──────────────────┼──────────────────┬──────────────────┐
            │                  │                  │                  │
            ▼                  ▼                  ▼                  ▼
     [ Productivity ]       [ Health ]         [ Goal ]          [ Balance ]
      • Task Queue       • Sleep Score     • Career Goals     • Burnout Meter
      • Calendar Sync    • Diet/Protein    • Academics        • Stress Mitigator
      • Chrono Plans     • Gym Circadian   • Internships      • Sleep Guardrails
            │                  │                  │                  │
            └──────────────────┼──────────────────┴──────────────────┘
                               │
                               ▼
             [ Context-Aware Memory Synthesis ]
                   (Combines Live States)
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
 [ Conversational Voice Reply ]         [ Interactive Action Card ]
  - Direct Synthesis                     - Action Buttons (Publish, Lock, etc.)
  - Supported Speech-to-Text             - Chronological Plan Arrays
```

---

## 🌟 4. Key Features

### Feature 1: Context-Aware AI Memory
The AI is completely synchronized with your real-time database parameters. It maintains a constant live awareness of:
* **Productivity Logs:** Pending workloads, upcoming deadlines, and effort estimations.
* **Health Metrics:** Sleep scores, calculated sleep debt, workout completions, and protein logs.
* **Stress Indicators:** Live Burnout Risk indices and Mental Wellbeing state checks.

### Feature 2: Proactive AI Chief of Staff
Instead of waiting for the user to make decisions, ActNow AI acts as a proactive Chief of Staff.
* **Example:** When you say, *"I have a DSA assignment, Hackathon PPT, and Gym tomorrow,"* the AI doesn't just list them. It estimates effort hours, calculates conflict risks, builds a structured chronological plan protecting your sleep, and offers a single-click button to publish it all to your Google Calendar.

### Feature 3: Action-Based Chat Interface
No more plain-text robotic replies. The assistant returns **Interactive Action Cards** tailored to your status:
* **Task & Schedule Cards:** Stating difficulty, effort, and chronological timelines.
* **Burnout & Risk Alerts:** Dynamic warning meters showing acute fatigue levels.
* **Workout & Sleep Recommendation Cards:** Suggesting protein intakes or locking your bedtime.

### Feature 4: Autonomous Voice Assistant 2.0
Upgraded from a simple voice visualizer to a true voice execution agent. Using an instant Speech Synthesis and Microphone Capture Pipeline, users can interact completely hands-free to ask, *"Am I at burnout risk?"* or *"Schedule DSA study tomorrow,"* and watch the system execute state changes instantly.

---

## 💾 5. Tech Stack & Technologies Used

* **Frontend:**
  * **React 18** with **Vite** (for high-speed single-page rendering)
  * **TypeScript** (for strict, bug-free type-safety contracts)
  * **Tailwind CSS** (for a polished, high-contrast Cosmic Slate dark interface)
  * **Framer Motion** (for smooth micro-interactions, layout transitions, and soundwave voice animations)
  * **Lucide React** (for vector system icons)
* **Backend:**
  * **Express (Node.js)** (for full-stack API proxying)
  * **TSX & Esbuild** (for compilation and native ESM/CJS bundling)

---

## ⚡ 6. Google Technologies Utilized

### 1. Google Gemini 3.5-Flash Model
* **Role:** The cognitive core of the app.
* **Implementation:** Leverages the modern `@google/genai` TypeScript SDK on the server side (`server.ts`).
* **Usage:**
  * **Strict Structured JSON Outputs:** The orchestrator enforces strict schema-based outputs containing the voice reply, agent routing metrics, task actions, and detailed interactive action cards.
  * **Multi-Agent Persona Logic:** Directs instructions to specialize the generative reasoning for the Productivity, Health, Goal, and Balance sub-agents.

### 2. Google Calendar Integration API
* **Role:** Syncing tasks and schedules to your real Google Calendar account.
* **Implementation:** Uses a secure OAuth flow to request calendar modification permissions and sync deep-focus intervals, workout buffers, and sleep protection blocks autonomously.

### 3. Google Text-to-Speech (TTS) & Speech API
* **Role:** Audio generation and voice synthesis for Voice Assistant 2.0.
* **Implementation:** Integrated into the assistant dashboard to provide seamless voice feedback for hands-free interactions.

### 4. Google Cloud Run (Hosting & Deployment)
* **Role:** Secure container execution environment.
* **Implementation:** The entire application is deployed as a Docker container on Cloud Run, securing server-side API keys and ensuring zero latency for multi-user demands.

---

## 💎 7. Is This Project Free to Use? (Yes!)
All tools, libraries, and Google APIs integrated into this ActNow AI hackathon submission are fully **free of cost**:
1. **Google Gemini API Key:** Fully free-tier enabled on Google AI Studio for developers, utilizing Gemini 3.5-Flash with generous free rate limits.
2. **Google Cloud Run & APIs:** Includes Google Calendar and Google TTS APIs which provide robust free-tier usage tiers that are more than sufficient for high-concurrency hackathon presentations and active live usage.
3. **Open-Source Stack:** React, Tailwind CSS, Vite, and Framer Motion are fully open-source with MIT licenses.

---
*Created with passion for the Google AI Hackathon. Run `ActNow AI` today and safeguard your focus and health!*
