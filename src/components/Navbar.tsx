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
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#07090e]/90 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onSelectTab('profile')}
          className="flex items-center gap-3 cursor-pointer group"
          id="nav-brand-logo"
        >
          {/* Custom Talent Nexus Geometric Icon */}
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-500 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/60 transition-all duration-300">
            <div className="w-full h-full bg-[#0c101c] rounded-[10px] flex items-center justify-center overflow-hidden">
              <svg 
                className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.8"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                {/* Outer Nexus Polygon */}
                <path d="M12 2L21 7.5V16.5L12 22L3 16.5V7.5L12 2Z" stroke="url(#nexus-grad)" strokeWidth="1.6" />
                {/* Central Core & Interconnected Branching */}
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
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white font-display">
                Git<span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Hired</span>
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-full flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                Talent Intelligence
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-tight -mt-0.5">
              Empirical Code Telemetry & Radar
            </p>
          </div>
        </div>

        {/* Navigation Tabs - High Contrast & Modern */}
        <nav className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-white/10 shadow-inner">
          <button
            id="nav-tab-profile"
            onClick={() => onSelectTab('profile')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-indigo-600/40 via-purple-600/30 to-cyan-600/30 text-white border border-indigo-500/50 shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Search className="w-4 h-4 text-cyan-400" />
            <span>Profile Intelligence</span>
          </button>

          <button
            id="nav-tab-compare"
            onClick={() => onSelectTab('compare')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeTab === 'compare'
                ? 'bg-gradient-to-r from-indigo-600/40 via-purple-600/30 to-cyan-600/30 text-white border border-indigo-500/50 shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <GitCompare className="w-4 h-4 text-purple-400" />
            <span>Compare Developers</span>
          </button>
        </nav>

        {/* Right Status Badge (Theme toggle removed as requested) */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live AST Engine</span>
        </div>

      </div>
    </header>
  );
};
