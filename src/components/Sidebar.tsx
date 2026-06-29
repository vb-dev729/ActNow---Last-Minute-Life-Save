import { motion } from 'motion/react';
import { 
  LayoutGrid, Sparkles, ListTodo, Calendar, Heart, Moon, 
  Dumbbell, Apple, Zap, Scale, BarChart3, MessageSquare, Settings, Award, User, X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  userProfile: {
    name: string;
    email: string;
    badge: string;
    role: string;
    avatar: string;
  };
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ activeTab, setActiveTab, userProfile, isOpen, setIsOpen }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutGrid, color: 'text-violet-400' },
    { id: 'executive', label: 'AI Executive Plan', icon: Sparkles, color: 'text-violet-400' },
    { id: 'tasks', label: 'Tasks & Projects', icon: ListTodo, color: 'text-sky-400' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, color: 'text-indigo-400' },
    { id: 'health', label: 'Health & Wellbeing', icon: Heart, color: 'text-rose-400' },
    { id: 'sleep', label: 'Sleep Protection', icon: Moon, color: 'text-blue-400' },
    { id: 'fitness', label: 'Fitness & Gym', icon: Dumbbell, color: 'text-emerald-400' },
    { id: 'nutrition', label: 'Nutrition & Diet', icon: Apple, color: 'text-amber-400' },
    { id: 'energy', label: 'Energy & Focus', icon: Zap, color: 'text-yellow-400' },
    { id: 'goals', label: 'Goals & Balance', icon: Scale, color: 'text-fuchsia-400' },
    { id: 'assistant', label: 'AI Assistant', icon: MessageSquare, color: 'text-violet-400' },
    { id: 'settings', label: 'AI Life Profile', icon: User, color: 'text-fuchsia-400' },
  ];

  return (
    <>
      {/* Backdrop overlay for mobile/tablet when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 xl:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`w-64 flex-shrink-0 bg-[#070913] border-r border-white/5 flex flex-col justify-between h-screen fixed xl:sticky top-0 left-0 overflow-y-auto custom-scrollbar z-50 transition-transform duration-300 xl:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Top Brand Logo */}
        <div>
          <div className="p-6 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20 border border-violet-400/20">
                <Zap className="w-4 h-4 text-white fill-white/10" />
              </div>
              <div>
                <h1 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5 font-sans">
                  ActNow
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-300">
                    Last Minute Life Saver
                  </span>
                </h1>
              </div>
            </div>

            {/* Mobile close trigger button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="xl:hidden p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-link-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all relative duration-200 cursor-pointer ${
                    isActive 
                      ? 'text-white bg-white/[0.04] border border-white/5 shadow-md shadow-violet-500/5' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.01] border border-transparent'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active-glow"
                      className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent rounded-xl -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 ${isActive ? item.color : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                  {item.id === 'assistant' && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile & upgrade plan footer */}
        <div className="p-4 border-t border-white/5 bg-[#05060d]">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3.5 flex flex-col gap-3.5 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={userProfile.avatar} 
                  alt={userProfile.name} 
                  className="w-10 h-10 rounded-full border border-violet-500/30 object-cover bg-violet-950/40"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#05060d]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white truncate block">{userProfile.name}</span>
                  <span className="text-[8px] bg-violet-600/30 text-violet-300 font-extrabold px-1.5 py-0.5 rounded font-mono uppercase tracking-wider scale-90 origin-left">
                    {userProfile.badge}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 block truncate font-medium">{userProfile.role}</span>
              </div>
            </div>

            <button 
              id="sidebar-upgrade-btn"
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-violet-600/20 to-indigo-600/25 hover:from-violet-600/30 hover:to-indigo-600/35 border border-violet-500/20 hover:border-violet-500/30 text-[10px] text-violet-300 font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-violet-400" />
              <span>Upgrade to Ultra Pilot</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
