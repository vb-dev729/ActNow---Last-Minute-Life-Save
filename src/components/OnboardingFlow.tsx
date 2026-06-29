import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, Briefcase, Rocket, Laptop, Target, Clock, 
  Moon, Dumbbell, Apple, Heart, Compass, Sparkles, Check, ChevronRight, 
  BrainCircuit, ShieldAlert, CheckCircle2, RotateCcw, AlertTriangle 
} from 'lucide-react';

interface OnboardingFlowProps {
  onOnboardingComplete: (profileData: {
    profession: string;
    goals: string[];
    productivity: {
      wakeUpTime: string;
      sleepTime: string;
      studyHours: number;
      workHours: number;
      workoutFrequency: number;
      stressLevel: string;
    }
  }) => void;
  userName: string;
}

export default function OnboardingFlow({ onOnboardingComplete, userName }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [profession, setProfession] = useState<string>('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  
  // Productivity Profile questions state
  const [wakeUpTime, setWakeUpTime] = useState('07:00');
  const [sleepTime, setSleepTime] = useState('23:00');
  const [studyHours, setStudyHours] = useState(4);
  const [workHours, setWorkHours] = useState(6);
  const [workoutFrequency, setWorkoutFrequency] = useState(3);
  const [stressLevel, setStressLevel] = useState('Medium');

  // AI Blueprint Loading States
  const [blueprintProgress, setBlueprintProgress] = useState(0);
  const [analysisLogs, setAnalysisLogs] = useState<string[]>([]);
  const [currentLogIdx, setCurrentLogIdx] = useState(0);

  const goalOptions = [
    "Crack Internship",
    "Improve CGPA",
    "Gain Muscle",
    "Improve Sleep",
    "Build Startup",
    "Learn DSA",
    "Become Consistent"
  ];

  const professions = [
    { id: 'Student', label: 'Student', desc: 'Managing lectures, assignments, and exams', icon: GraduationCap, color: 'text-sky-400 border-sky-500/20 bg-sky-500/5' },
    { id: 'Working Professional', label: 'Working Professional', desc: 'Balancing corporate targets and personal sanity', icon: Briefcase, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
    { id: 'Entrepreneur', label: 'Entrepreneur', desc: 'Building high-growth ventures under extreme stress', icon: Rocket, color: 'text-fuchsia-400 border-fuchsia-500/20 bg-fuchsia-500/5' },
    { id: 'Freelancer', label: 'Freelancer', desc: 'Structuring self-directed cognitive output hours', icon: Laptop, color: 'text-amber-400 border-amber-500/20 bg-amber-500/5' }
  ];

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const logs = [
    "Initiating high-fidelity biological analysis...",
    "Scanning daily study and work schedules...",
    "Mapping sleep cycles and identifying late-night study stress spikes...",
    "Evaluating workout frequency and muscle protein synthesis windows...",
    "Optimizing circadian rhythm peaks (estimating optimal 6 PM - 9 PM band)...",
    "Preemptively routing micro-breaks to mitigate cognitive load...",
    "Applying ActNow autonomous rules matrix and Google Calendar hooks...",
    "Generating custom life blueprint dashboard for Vyom..."
  ];

  // AI analysis simulation in Step 4
  useEffect(() => {
    if (currentStep === 4) {
      setAnalysisLogs([logs[0]]);
      
      const progressInterval = setInterval(() => {
        setBlueprintProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 1;
        });
      }, 50);

      const logInterval = setInterval(() => {
        setCurrentLogIdx(prev => {
          const next = prev + 1;
          if (next < logs.length) {
            setAnalysisLogs(current => [...current, logs[next]]);
            return next;
          }
          clearInterval(logInterval);
          return prev;
        });
      }, 600);

      return () => {
        clearInterval(progressInterval);
        clearInterval(logInterval);
      };
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep === 1 && !profession) {
      alert("Please select your primary profession role to proceed.");
      return;
    }
    if (currentStep === 2 && selectedGoals.length === 0) {
      alert("Please establish at least one key life objective.");
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleComplete = () => {
    onOnboardingComplete({
      profession,
      goals: selectedGoals,
      productivity: {
        wakeUpTime,
        sleepTime,
        studyHours,
        workHours,
        workoutFrequency,
        stressLevel
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col justify-center items-center p-6 relative overflow-hidden" id="onboarding-flow">
      {/* Background radial glows */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-violet-950/10 to-transparent pointer-events-none" />
      
      {/* Step Tracker Indicator */}
      {currentStep < 4 && (
        <div className="max-w-md w-full flex items-center justify-between mb-8 relative z-10 px-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold font-mono text-xs transition-all duration-300 ${
                currentStep === step 
                  ? 'bg-violet-600 border-transparent text-white shadow-lg shadow-violet-500/20 scale-110' 
                  : currentStep > step 
                    ? 'bg-violet-500/10 border-violet-500/30 text-violet-400' 
                    : 'bg-white/[0.02] border-white/5 text-gray-500'
              }`}>
                {currentStep > step ? <Check className="w-4 h-4" /> : step}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest hidden sm:inline ${
                currentStep === step ? 'text-white' : 'text-gray-500'
              }`}>
                {step === 1 ? 'Role' : step === 2 ? 'Goals' : 'Profile'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Main onboarding card container */}
      <div className="max-w-2xl w-full bg-[#090b14] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 overflow-hidden">
        <AnimatePresence mode="wait">
          
          {/* Step 1: Who are you? */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-violet-400">Step 1 of 3</span>
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight font-sans">
                  Who Are You?
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                  Hello {userName}! Select your primary professional context. This calibrates our cognitive workload buffers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {professions.map((p) => {
                  const Icon = p.icon;
                  const isSelected = profession === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setProfession(p.id)}
                      className={`p-5 rounded-2xl border text-left transition-all duration-300 flex items-start gap-4 cursor-pointer relative group ${
                        isSelected 
                          ? 'border-violet-500/40 bg-violet-500/10 shadow-lg shadow-violet-500/5' 
                          : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/10'
                      }`}
                    >
                      <div className={`p-3 rounded-xl border ${p.color} shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white group-hover:text-violet-400 transition-colors uppercase tracking-wider">{p.label}</h4>
                        <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">{p.desc}</p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end">
                <button
                  onClick={handleNext}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-violet-500/10"
                >
                  <span>Select Role</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Life Goals */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-fuchsia-400" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-fuchsia-400">Step 2 of 3</span>
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight font-sans">
                  Define Your Primary Targets
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                  Select the key objectives you are actively executing. Our engine tracks time overlap and potential over-commitment bounds.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 py-2">
                {goalOptions.map((goal) => {
                  const isSelected = selectedGoals.includes(goal);
                  return (
                    <button
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        isSelected 
                          ? 'bg-fuchsia-500/15 border-fuchsia-500/40 text-fuchsia-300' 
                          : 'bg-white/[0.01] border-white/5 text-gray-400 hover:border-white/10 hover:text-gray-200'
                      }`}
                    >
                      <span>{goal}</span>
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-fuchsia-400" strokeWidth={3} />
                      ) : (
                        <span className="text-gray-600">+</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-between">
                <button
                  onClick={handleBack}
                  className="py-3 px-5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 text-gray-400 hover:text-gray-200 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <span>Lock Life Goals</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Productivity Profile */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">Step 3 of 3</span>
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight font-sans">
                  Productivity Telemetry
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                  Specify your typical physiological baseline and hourly parameters to fine-tune energy oscillators.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Wake Up Time */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Wake Up Hour</label>
                  <input 
                    type="time" 
                    value={wakeUpTime}
                    onChange={(e) => setWakeUpTime(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* Sleep Time */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Target Sleep Hour</label>
                  <input 
                    type="time" 
                    value={sleepTime}
                    onChange={(e) => setSleepTime(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* Study / Work Hours Sliders */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    <span>Target Study Hours</span>
                    <span className="text-amber-400 font-mono">{studyHours}h / day</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="12" 
                    value={studyHours}
                    onChange={(e) => setStudyHours(parseInt(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    <span>Target Work / Freelance Hours</span>
                    <span className="text-amber-400 font-mono">{workHours}h / day</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="12" 
                    value={workHours}
                    onChange={(e) => setWorkHours(parseInt(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Workout Frequency */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    <span>Workout Frequency</span>
                    <span className="text-amber-400 font-mono">{workoutFrequency} days / week</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="7" 
                    value={workoutFrequency}
                    onChange={(e) => setWorkoutFrequency(parseInt(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Stress Level Select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Estimated Mental Load</label>
                  <select
                    value={stressLevel}
                    onChange={(e) => setStressLevel(e.target.value)}
                    className="w-full bg-[#05060d] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                  >
                    <option value="Low">Low Stress (Calm Baseline)</option>
                    <option value="Medium">Medium Stress (Active Load)</option>
                    <option value="High">High Stress (Exams, Deadlines)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-between">
                <button
                  onClick={handleBack}
                  className="py-3 px-5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 text-gray-400 hover:text-gray-200 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/10"
                >
                  <span>Run AI Engine</span>
                  <ChevronRight className="w-4 h-4 stroke-[3px]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: AI Analysis & Blueprint Screen */}
          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="text-center space-y-3 pb-4">
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-violet-500/10 rounded-2xl border border-violet-500/20">
                  <BrainCircuit className="w-8 h-8 text-violet-400 animate-pulse" />
                </div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight font-sans">
                  Creating Your Life Blueprint...
                </h2>
                <p className="text-xs text-gray-400">
                  ActNow neural processor is configuring your dynamic Life Balance index.
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-gray-400 font-bold font-mono">
                  <span>ANALYSIS SYNTHESIS:</span>
                  <span>{blueprintProgress}% COMPLETE</span>
                </div>
                <div className="h-2 bg-white/5 border border-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-emerald-400 rounded-full transition-all duration-300"
                    style={{ width: `${blueprintProgress}%` }}
                  />
                </div>
              </div>

              {/* Rolling AI terminal log feedback */}
              <div className="bg-[#05060d] border border-white/5 rounded-2xl p-5 h-44 overflow-y-auto font-mono text-[10px] text-gray-400 space-y-2.5 custom-scrollbar">
                {analysisLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-gray-300">
                    <span className="text-violet-400 font-bold">{`>`}</span>
                    <p className="leading-relaxed font-medium">{log}</p>
                  </div>
                ))}
                {blueprintProgress < 100 && (
                  <div className="w-2.5 h-4 bg-violet-400 animate-pulse inline-block" />
                )}
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-center">
                <button
                  onClick={handleComplete}
                  disabled={blueprintProgress < 100}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-emerald-500 hover:from-violet-500 hover:to-emerald-400 text-white font-black text-xs uppercase tracking-widest transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Activate System Dashboard</span>
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
