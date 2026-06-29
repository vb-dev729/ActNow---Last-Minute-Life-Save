import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, RefreshCw, Check, Clock, AlertTriangle, ShieldCheck, Sparkles, LogIn, LogOut, ShieldAlert, Zap, Compass, RefreshCcw } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Task } from '../types';

// Initialize Firebase locally (or reuse existing)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/calendar');
provider.addScope('https://www.googleapis.com/auth/calendar.events');

interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
}

interface FreeSlot {
  start: string;
  end: string;
  label: string;
}

interface GoogleCalendarSyncProps {
  tasks: Task[];
  onReplanSuccess: (replannedTasks: Task[], summary: string) => void;
}

export default function GoogleCalendarSync({ tasks, onReplanSuccess }: GoogleCalendarSyncProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [freeSlots, setFreeSlots] = useState<FreeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Flagship Feature States
  const [autoProtectDeepWork, setAutoProtectDeepWork] = useState(true);
  const [replanLoading, setReplanLoading] = useState(false);
  const [replanBriefing, setReplanBriefing] = useState<string | null>(null);

  // Handle Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setToken(null);
        setEvents([]);
        setFreeSlots([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken || null;
      if (accessToken) {
        setToken(accessToken);
        fetchTodayEvents(accessToken);
      }
    } catch (error) {
      console.error("Google Calendar connection failed:", error);
      setSyncStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await auth.signOut();
    setToken(null);
    setEvents([]);
    setFreeSlots([]);
    setSyncStatus('idle');
  };

  const fetchTodayEvents = async (accessToken: string) => {
    setLoading(true);
    setSyncStatus('idle');
    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();

      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${startOfDay}&timeMax=${endOfDay}&orderBy=startTime&singleEvents=true`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!res.ok) throw new Error("Failed to load Google Calendar events");
      
      const data = await res.json();
      const fetchedEvents: CalendarEvent[] = data.items || [];
      setEvents(fetchedEvents);
      
      // Calculate Free slabs between events
      calculateFreeSlabs(fetchedEvents);
      setSyncStatus('success');
    } catch (error) {
      console.error(error);
      setSyncStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const calculateFreeSlabs = (todayEvents: CalendarEvent[]) => {
    const now = new Date();
    const workStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);
    const workEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0);

    const busyIntervals = todayEvents
      .map(ev => {
        const s = ev.start.dateTime ? new Date(ev.start.dateTime) : null;
        const e = ev.end.dateTime ? new Date(ev.end.dateTime) : null;
        return { start: s, end: e };
      })
      .filter(interval => interval.start && interval.end) as Array<{ start: Date; end: Date }>;

    const free: FreeSlot[] = [];
    let currentCursor = new Date(workStart);

    busyIntervals.forEach(busy => {
      if (busy.start > currentCursor) {
        const diffMin = (busy.start.getTime() - currentCursor.getTime()) / 60000;
        if (diffMin >= 60) {
          free.push({
            start: currentCursor.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            end: busy.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            label: `Focus Opportunity (${Math.round(diffMin)}m slot)`
          });
        }
      }
      if (busy.end > currentCursor) {
        currentCursor = new Date(busy.end);
      }
    });

    if (workEnd > currentCursor) {
      const diffMin = (workEnd.getTime() - currentCursor.getTime()) / 60000;
      if (diffMin >= 60) {
        free.push({
          start: currentCursor.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          end: workEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          label: `Late Focus Opportunity (${Math.round(diffMin)}m slot)`
        });
      }
    }

    setFreeSlots(free);
  };

  const scheduleFocusBlock = async (slot: FreeSlot) => {
    if (!token) return;

    const confirmed = window.confirm(
      `Do you confirm scheduling a 90-minute 'AI Focus Block' from ${slot.start} to ${slot.end} into your Google Calendar account?`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const now = new Date();
      const parseTimeStr = (timeStr: string) => {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
        return d.toISOString();
      };

      const startISO = parseTimeStr(slot.start);
      const startD = new Date(startISO);
      const endD = new Date(startD.getTime() + 90 * 60000);
      const endISO = endD.toISOString();

      const eventPayload = {
        summary: "⚡ ActNow AI Deep Focus Block",
        description: "Reserved deep work slot by ActNow Companion. External workspace distractions are muted.",
        start: { dateTime: startISO, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        end: { dateTime: endISO, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        reminders: { useDefault: true }
      };

      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(eventPayload)
        }
      );

      if (!res.ok) throw new Error("Calendar insert rejected");

      alert("Success! ⚡ ActNow AI Deep Focus Block booked.");
      fetchTodayEvents(token);
    } catch (error) {
      console.error(error);
      alert("Could not insert Focus block. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Flagship Feature 2 Trigger: Auto Replanning System
  const handleTriggerAutoReplan = async () => {
    setReplanLoading(true);
    setReplanBriefing(null);
    try {
      const res = await fetch("/api/replan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks })
      });

      if (!res.ok) throw new Error("Auto replan failed");
      const data = await res.json();

      // Map back to our full task objects
      const replannedList = tasks.map(orig => {
        const match = data.replannedTasks.find((r: any) => r.id === orig.id);
        if (match) {
          return {
            ...orig,
            deadline: match.deadline,
            aiPriorityScore: match.aiPriorityScore,
            urgency: match.urgency,
            aiRecommendation: match.aiRecommendation
          };
        }
        return orig;
      });

      onReplanSuccess(replannedList, data.reasoningSummary);
      setReplanBriefing(data.reasoningSummary);
    } catch (error) {
      console.error(error);
    } finally {
      setReplanLoading(false);
    }
  };

  // Calculate schedule conflicts: active tasks remaining hours vs available remaining hours today
  const activeTasks = tasks.filter(t => t.status !== 'completed');
  const totalEffort = activeTasks.reduce((sum, t) => sum + (t.effort || 1.5), 0);
  const now = new Date();
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 21, 0, 0); // Active work cap at 9pm
  const availableHoursLeft = Math.max(0, (endOfToday.getTime() - now.getTime()) / 3600000);
  const isConflicting = totalEffort > availableHoursLeft && activeTasks.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 rounded-2xl flex flex-col gap-5 relative overflow-hidden border border-white/5"
      id="google-calendar-companion"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider font-sans">Google Calendar Companion</h3>
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider font-mono">Autonomous Context Safeguard</span>
          </div>
        </div>

        {user && (
          <button
            onClick={handleSignOut}
            className="text-[10px] font-bold text-rose-400 flex items-center gap-1 hover:underline cursor-pointer font-mono"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>

      {/* Conflict Alarm Board */}
      {isConflicting && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex flex-col gap-2.5">
          <div className="flex items-start gap-2 text-rose-300">
            <ShieldAlert className="w-4.5 h-4.5 text-rose-400 flex-shrink-0 mt-0.5 animate-pulse" />
            <div className="text-xs">
              <span className="font-bold">Active Schedule Overload Warning.</span> You have {totalEffort.toFixed(1)} hrs of remaining effort scheduled but only {availableHoursLeft.toFixed(1)} focus hours left today. Complete collapse predicted.
            </div>
          </div>
          <button
            onClick={handleTriggerAutoReplan}
            disabled={replanLoading}
            className="w-full bg-rose-950/40 hover:bg-rose-900/40 border border-rose-500/30 text-rose-300 font-extrabold text-xs py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-40"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${replanLoading ? 'animate-spin' : ''}`} />
            <span>TRIGGER AI SCHEDULE REPLANNING</span>
          </button>
        </div>
      )}

      {/* Replan reasoning briefed overlay */}
      {replanBriefing && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-300"
        >
          <span className="font-extrabold flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider font-mono">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>AI Replanner Execution Brief</span>
          </span>
          <p className="leading-relaxed text-gray-300">{replanBriefing}</p>
        </motion.div>
      )}

      {/* Auth state wrapper */}
      {!user ? (
        <div className="py-6 flex flex-col items-center justify-center text-center gap-4 bg-black/45 border border-white/5 rounded-xl">
          <Calendar className="w-10 h-10 text-gray-600 animate-bounce" />
          <div>
            <h4 className="text-xs font-bold text-white">Authorize Google Calendar</h4>
            <p className="text-[10px] text-gray-500 max-w-xs mt-1">
              Links your real agenda to let our Auto-Replanning and Deep Work systems safeguard your study blocks.
            </p>
          </div>

          <button onClick={handleSignIn} disabled={loading} className="gsi-material-button cursor-pointer">
            <div className="gsi-material-button-state"></div>
            <div className="gsi-material-button-content-wrapper">
              <div className="gsi-material-button-icon">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: "block" }}>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
              </div>
              <span className="gsi-material-button-contents font-sans">Connect Google Account</span>
            </div>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Calendar status bar */}
          <div className="flex items-center justify-between bg-white/[0.01] border border-white/5 p-3 rounded-xl">
            <div className="flex items-center gap-2.5">
              {user.photoURL ? (
                <img src={user.photoURL} alt="profile" referrerPolicy="no-referrer" className="w-7 h-7 rounded-full border border-white/10" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs">U</div>
              )}
              <div className="min-w-0">
                <span className="text-xs font-black block text-white truncate">{user.displayName || 'Google Member'}</span>
                <span className="text-[9px] text-gray-500 truncate block mt-0.5">Primary agenda connected</span>
              </div>
            </div>

            <button
              onClick={() => token && fetchTodayEvents(token)}
              disabled={loading}
              className="bg-white/5 hover:bg-white/10 border border-white/5 p-1.5 rounded-lg text-gray-400 hover:text-white disabled:opacity-40 cursor-pointer"
              title="Resync events"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Today's schedule preview */}
          <div className="space-y-2.5">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-extrabold block font-mono">
              Today's Agenda ({events.length} events parsed)
            </span>

            {events.length > 0 ? (
              <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                {events.slice(0, 4).map((ev) => {
                  const sTime = ev.start.dateTime 
                    ? new Date(ev.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                    : 'All Day';
                  return (
                    <div key={ev.id} className="bg-white/[0.01] border border-white/5 p-2 rounded-lg flex items-center justify-between text-xs text-gray-300">
                      <span className="font-bold truncate max-w-[180px]">{ev.summary}</span>
                      <span className="text-[10px] font-mono text-gray-400 bg-black/30 px-2 py-0.5 rounded">
                        {sTime}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-emerald-400 bg-emerald-500/5 p-2.5 rounded-lg flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>No schedule conflicts detected. High capacity for deep focus.</span>
              </div>
            )}
          </div>

          {/* Deep Work Auto protection switch */}
          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-gray-200">Auto-Protect Deep Work</span>
              <span className="text-[10px] text-gray-400">Instantly reserve focus intervals during gaps</span>
            </div>
            <button
              onClick={() => setAutoProtectDeepWork(!autoProtectDeepWork)}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 ${autoProtectDeepWork ? 'bg-indigo-600' : 'bg-gray-700'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 transform ${autoProtectDeepWork ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Free Slabs recommendations */}
          <div className="space-y-2.5 border-t border-white/5 pt-3">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-extrabold block flex items-center gap-1 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Deep Focus Gaps Available</span>
            </span>

            {freeSlots.length > 0 ? (
              <div className="space-y-2">
                {freeSlots.slice(0, 2).map((slot, idx) => (
                  <div key={idx} className="bg-indigo-950/5 border border-indigo-500/10 p-3 rounded-xl flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-indigo-200 block truncate">{slot.label}</span>
                      <span className="text-[9px] text-gray-400 block mt-0.5 font-mono">
                        ⏰ {slot.start} - {slot.end}
                      </span>
                    </div>

                    <button
                      onClick={() => scheduleFocusBlock(slot)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1.5 px-3 rounded-lg text-[10px] cursor-pointer"
                    >
                      Reserve Slot
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[10px] text-gray-400 italic">
                No open focus gaps remaining today. Use AI Replanning to shift non-essential tasks.
              </div>
            )}
          </div>

        </div>
      )}
    </motion.div>
  );
}
