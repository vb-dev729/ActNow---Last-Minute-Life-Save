import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, MapPin, Briefcase, Award, Shield, Sparkles, Target, 
  Clock, ShieldCheck, Heart, Cpu, Edit3, Trash2, Check, RefreshCw 
} from 'lucide-react';

interface ProfilePageProps {
  userProfile: {
    name: string;
    email: string;
    badge: string;
    role: string;
    avatar: string;
    profession: string;
    location: string;
    goals: string[];
    productivity: {
      wakeUpTime: string;
      sleepTime: string;
      studyHours: number;
      workHours: number;
      workoutFrequency: number;
      stressLevel: string;
    };
  };
  onUpdateProfile: (updated: any) => void;
  onResetOnboarding: () => void;
}

export default function ProfilePage({ userProfile, onUpdateProfile, onResetOnboarding }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userProfile.name);
  const [editedProfession, setEditedProfession] = useState(userProfile.profession);
  const [editedLocation, setEditedLocation] = useState(userProfile.location || 'San Francisco, CA');
  const [editedRole, setEditedRole] = useState(userProfile.role);

  const handleSave = () => {
    onUpdateProfile({
      name: editedName,
      profession: editedProfession,
      location: editedLocation,
      role: editedRole
    });
    setIsEditing(false);
  };

  const totalProductivityHours = userProfile.productivity.studyHours + userProfile.productivity.workHours;

  return (
    <div className="min-h-screen bg-[#030712] text-white p-6 md:p-8 space-y-8" id="profile-page">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-violet-400">BIOLOGICAL IDENTITY & BLUEPRINT NODE</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase font-sans">
            AI Life Profile
          </h1>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            Review your dynamic credential matrix, customize identity flags, and optimize your biological blueprint.
          </p>
        </div>

        {/* Sync Status Badge */}
        <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-violet-500/10 rounded-xl border border-violet-500/20">
            <Cpu className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Cognitive Node Status</span>
            <span className="text-sm font-extrabold text-violet-400 font-mono">
              SECURE SYNCED (100%)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Basic Identity & Edit Form */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Identity Card */}
          <div className="bg-[#090b14] border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
            {/* Ambient subtle backglow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-violet-500/10 transition-all duration-500" />
            
            <div className="flex flex-col items-center text-center space-y-4 pb-6 border-b border-white/5">
              <div className="relative">
                <img 
                  src={userProfile.avatar} 
                  alt={userProfile.name} 
                  className="w-24 h-24 rounded-full border-2 border-violet-500/30 object-cover shadow-2xl bg-violet-950/40"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-4 border-[#090b14] flex items-center justify-center" />
              </div>

              <div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">{userProfile.name}</h3>
                  <span className="text-[9px] bg-violet-600/30 text-violet-300 font-extrabold px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
                    {userProfile.badge}
                  </span>
                </div>
                <span className="text-xs text-gray-400 font-bold block uppercase tracking-wide">{userProfile.role}</span>
              </div>
            </div>

            {/* Core details mapping list */}
            <div className="py-6 space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  {/* Edit Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Full Name</label>
                    <input 
                      type="text" 
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  {/* Edit Role */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Custom Role Badge</label>
                    <input 
                      type="text" 
                      value={editedRole}
                      onChange={(e) => setEditedRole(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  {/* Edit Profession */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Profession Context</label>
                    <select
                      value={editedProfession}
                      onChange={(e) => setEditedProfession(e.target.value)}
                      className="w-full bg-[#05060d] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                    >
                      <option value="Student">Student</option>
                      <option value="Working Professional">Working Professional</option>
                      <option value="Entrepreneur">Entrepreneur</option>
                      <option value="Freelancer">Freelancer</option>
                    </select>
                  </div>

                  {/* Edit Location */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Physical Location</label>
                    <input 
                      type="text" 
                      value={editedLocation}
                      onChange={(e) => setEditedLocation(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSave}
                      className="flex-1 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-gray-400 hover:text-gray-200 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Profession Field */}
                  <div className="flex items-center gap-3.5 text-xs">
                    <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400 border border-violet-500/15">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Profession Context</span>
                      <span className="font-extrabold text-white">{userProfile.profession}</span>
                    </div>
                  </div>

                  {/* Location Field */}
                  <div className="flex items-center gap-3.5 text-xs">
                    <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400 border border-sky-500/15">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Physical Location</span>
                      <span className="font-extrabold text-white">{userProfile.location || 'San Francisco, CA'}</span>
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="flex items-center gap-3.5 text-xs">
                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/15">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Secure Node Address</span>
                      <span className="font-mono text-indigo-300 truncate block max-w-[200px]">{userProfile.email}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-gray-300 hover:text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Configure Identity</span>
                    </button>

                    <button
                      onClick={onResetOnboarding}
                      className="py-2.5 px-4 rounded-xl bg-violet-500/10 hover:bg-violet-500/15 border border-violet-500/20 text-violet-300 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Re-run Smart Onboarding Blueprint Generator"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Re-run Onboarding</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: AI Blueprint Metrics, Goals, & Analysis */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Productivity Baseline Diagnostic */}
          <div className="bg-[#090b14] border border-white/5 rounded-3xl p-6">
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-violet-400" />
              <span>Calibrated Productivity Profiles</span>
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">PHYSIOLOGICAL CYCLE</span>
                <p className="text-xs text-gray-300 font-bold mb-1">
                  Sleep Period: <span className="text-violet-400 font-mono">{userProfile.productivity.sleepTime} - {userProfile.productivity.wakeUpTime}</span>
                </p>
                <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                  Dynamic sleep latency calculation automatically aligns focus oscillators after physical workouts.
                </p>
              </div>

              <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">ACTIVE TARGET LOADS</span>
                <p className="text-xs text-gray-300 font-bold mb-1">
                  Active Hours: <span className="text-emerald-400 font-mono">{totalProductivityHours}h / day</span>
                </p>
                <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                  Committed: {userProfile.productivity.studyHours}h Study, {userProfile.productivity.workHours}h Work tasks.
                </p>
              </div>

              <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">METABOLIC EXERTION</span>
                <p className="text-xs text-gray-300 font-bold mb-1">
                  Gym Target: <span className="text-amber-400 font-mono">{userProfile.productivity.workoutFrequency} days / week</span>
                </p>
                <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                  Dumbbell and posterior chain movements automatically added with 90s rest metrics.
                </p>
              </div>

              <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-1">ESTIMATED MENTAL STRESS</span>
                <p className="text-xs text-gray-300 font-bold mb-1">
                  Mental Index: <span className="text-rose-400 font-mono">{userProfile.productivity.stressLevel}</span>
                </p>
                <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                  Preemptive rescue shields automatically suppress notifications if task overload occurs.
                </p>
              </div>
            </div>
          </div>

          {/* Active Goals Section */}
          <div className="bg-[#090b14] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
            <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-fuchsia-400" />
              <span>Active Blueprint Objectives</span>
            </h4>

            <div className="flex flex-wrap gap-2.5">
              {userProfile.goals && userProfile.goals.map((g, idx) => (
                <div 
                  key={idx}
                  className="px-3.5 py-2 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-xs font-bold flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
                  <span>{g}</span>
                </div>
              ))}
              {(!userProfile.goals || userProfile.goals.length === 0) && (
                <span className="text-xs text-gray-500 font-semibold italic">No active objectives established yet.</span>
              )}
            </div>
          </div>

          {/* AI Blueprint Strategy Advice */}
          <div className="bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 border border-white/5 p-6 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider">AI Life Blueprint Summary</h4>
            </div>

            <p className="text-xs text-gray-300 font-medium leading-relaxed">
              Based on your profile as a <span className="text-violet-400 font-bold">{userProfile.profession}</span>, the ActNow AI engine has configured a custom cognitive scheduling template. Because your target stress index is <span className="text-rose-400 font-bold">{userProfile.productivity.stressLevel}</span>, we have calibrated passive sleep protection shields and study slots to align with your {userProfile.productivity.wakeUpTime} wake time. Focus windows will be routed automatically.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
