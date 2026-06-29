import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Mail, Lock, Chrome, ArrowRight, Sparkles, Check, 
  ShieldCheck, BrainCircuit, ShieldAlert, Cpu 
} from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess: (email: string, name: string) => void;
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Please specify a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }
    if (isSignUp && !fullName) {
      setError("Please specify your full name.");
      return;
    }

    setLoading(true);
    // Simulate premium backend delay
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(email, isSignUp ? fullName : email.split('@')[0]);
    }, 1200);
  };

  const handleGoogleAuth = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess("vyombhagat04@gmail.com", "Vyom Bhagat");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-4 relative overflow-hidden" id="auth-page">
      {/* Background radial glows */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,#312e81_0%,transparent_50%)] opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_70%,#1e1b4b_0%,transparent_60%)] opacity-35 pointer-events-none" />

      {/* Decorative stars / energy lines */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="absolute rounded-full bg-violet-400"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
              animation: `pulse ${Math.random() * 3 + 2}s infinite`
            }}
          />
        ))}
      </div>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-[#090b14]/80 border border-white/5 rounded-[32px] overflow-hidden shadow-2xl backdrop-blur-xl relative z-10">
        
        {/* Left Section: Hero Illustration & App Branding */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#0b0f19] to-[#04060b] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5">
          {/* Animated mesh grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20 border border-violet-400/20">
              <Zap className="w-5 h-5 text-white fill-white/10" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white uppercase font-sans">
                ActNow <span className="text-violet-400 font-normal">AI</span>
              </h1>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-300">
                Last Minute Life Saver
              </span>
            </div>
          </div>

          {/* Premium Vector Hero Illustration */}
          <div className="relative my-12 h-64 flex items-center justify-center">
            {/* Outer rotating energy ring */}
            <motion.div 
              className="absolute w-52 h-52 rounded-full border border-dashed border-violet-500/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Inner pulsing cybernetic brain nodes */}
            <motion.div 
              className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-violet-600/10 to-fuchsia-600/15 border border-violet-500/30 flex items-center justify-center relative shadow-2xl"
              animate={{ 
                boxShadow: ['0 0 20px rgba(139, 92, 246, 0.1)', '0 0 40px rgba(139, 92, 246, 0.25)', '0 0 20px rgba(139, 92, 246, 0.1)']
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <BrainCircuit className="w-16 h-16 text-violet-400 drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]" />
            </motion.div>

            {/* Orbiting particles */}
            <motion.div 
              className="absolute w-4 h-4 rounded-full bg-fuchsia-500 border border-white/20 shadow-md"
              style={{ top: '20%', left: '30%' }}
              animate={{ 
                y: [0, -15, 0],
                scale: [1, 1.15, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div 
              className="absolute w-3 h-3 rounded-full bg-violet-400 border border-white/20 shadow-md"
              style={{ bottom: '25%', right: '28%' }}
              animate={{ 
                y: [0, 15, 0],
                scale: [1, 0.85, 1]
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            />
          </div>

          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-violet-300 font-bold">PREMIUM COGNITIVE PLATFORM</span>
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight leading-snug">
              Autonomous Life Operating System
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed font-semibold">
              Unlock actionable focus boards, preemptive schedule replanning engines, real-time stress telemetry, and deep-sleep biological protection blocks.
            </p>
          </div>
        </div>

        {/* Right Section: Authentication Form */}
        <div className="lg:col-span-6 p-8 md:p-12 flex flex-col justify-center space-y-8 bg-black/30">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight font-sans">
              {isSignUp ? "Create Pilot Account" : "Access Your System"}
            </h3>
            <p className="text-xs text-gray-400 font-semibold">
              {isSignUp 
                ? "Initiate credentials to customize your personalized cognitive scheduler." 
                : "Welcome back. Authenticate credentials or sync Google profile instantly."}
            </p>
          </div>

          {/* Social Google Auth Option */}
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 text-xs font-bold transition-all flex items-center justify-center gap-3 cursor-pointer group hover:shadow-lg hover:shadow-violet-500/5 disabled:opacity-50"
          >
            <Chrome className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-4 text-gray-600 my-1">
            <div className="flex-1 h-[1px] bg-white/5" />
            <span className="text-[9px] font-bold font-mono uppercase tracking-widest text-gray-500">OR WITH EMAIL</span>
            <div className="flex-1 h-[1px] bg-white/5" />
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 font-semibold flex items-start gap-2.5"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <Cpu className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="e.g. Vyom Bhagat"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#05060d]/60 border border-white/5 focus:border-violet-500 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="email" 
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#05060d]/60 border border-white/5 focus:border-violet-500 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Password</label>
                {!isSignUp && (
                  <button type="button" className="text-[10px] text-violet-400 hover:underline font-bold">
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#05060d]/60 border border-white/5 focus:border-violet-500 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-violet-500/10 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Synchronizing Node...</span>
                </>
              ) : (
                <>
                  <span>{isSignUp ? "Complete Credentials" : "Authorize Session"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                setError(null);
                setIsSignUp(!isSignUp);
              }}
              className="text-xs font-bold text-gray-400 hover:text-white transition-colors"
            >
              {isSignUp 
                ? "Already have an account? Sign In" 
                : "Don't have a system node yet? Register Node"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
