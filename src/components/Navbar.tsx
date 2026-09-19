import React from 'react';
import { GitCompare, Search, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'profile' | 'compare';
  onSelectTab: (tab: 'profile' | 'compare') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#07090e]/85 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-2">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onSelectTab('profile')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group flex-shrink-0"
          id="nav-brand-logo"
        >
          {/* Custom Talent Nexus Geometric Icon */}
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-500 to-cyan-400 p-[1.5px] shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/50 transition-all duration-200">
            <div className="w-full h-full bg-[#0c101c] rounded-[9px] flex items-center justify-center overflow-hidden">
              <svg 
                className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-cyan-400 group-hover:scale-105 transition-transform duration-200" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.8"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 2L21 7.5V16.5L12 22L3 16.5V7.5L12 2Z" stroke="url(#nexus-grad)" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="2.5" fill="#38bdf8" />
                <line x1="12" y1="2" x2="12" y2="9.5" stroke="#818cf8" strokeWidth="1.5" />
                <line x1="3" y1="16.5" x2="10" y2="13" stroke="#818cf8" strokeWidth="1.5" />
                <line x1="21" y1="16.5" x2="14" y2="13" stroke="#38bdf8" strokeWidth="1.5" />
                <defs>
                  <linearGradient id="nexus-grad" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6366f1" />
                    <stop offset="0.5" stopColor="#a855f7" />
                    <stop offset="1" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white font-display">
                Git<span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Hired</span>
              </span>
              <span className="hidden md:inline-flex px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 rounded-full items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                Talent Intelligence
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-400 font-mono tracking-tight -mt-0.5">
              Empirical Code Telemetry & Radar
            </p>
          </div>
        </div>

        {/* Responsive Segmented Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/[0.08]">
          <button
            id="nav-tab-profile"
            onClick={() => onSelectTab('profile')}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 ${
              activeTab === 'profile'
                ? 'bg-indigo-600/30 text-white border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span>Profile<span className="hidden md:inline"> Intelligence</span></span>
          </button>

          <button
            id="nav-tab-compare"
            onClick={() => onSelectTab('compare')}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 ${
              activeTab === 'compare'
                ? 'bg-indigo-600/30 text-white border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
            <span>Compare<span className="hidden md:inline"> Developers</span></span>
          </button>
        </nav>

        {/* Right Status Badge (Hidden on mobile) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-white/[0.08] text-xs font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live AST Engine</span>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
