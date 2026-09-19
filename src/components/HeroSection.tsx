import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, ArrowRight, Zap, Cpu, Calendar, 
  Bot, Award
} from 'lucide-react';

interface HeroSectionProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
  currentUsername?: string;
  hasDossier: boolean;
}

// Live Typewriter Heading for "Smart Code. Smart Hire!"
const TypewriterHeroHeading: React.FC = () => {
  const fullText = "Smart Code. Smart Hire!";
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayText.length < fullText.length) {
      // Natural human-like typing speed with pause at punctuation
      const nextChar = fullText[displayText.length];
      const speed = nextChar === '.' ? 320 : 65;
      
      timer = setTimeout(() => {
        setDisplayText(fullText.slice(0, displayText.length + 1));
      }, speed);
    } else if (!isDeleting && displayText.length === fullText.length) {
      // Completed typing - stay for 4.5 seconds for comfortable reading
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 4500);
    } else if (isDeleting && displayText.length > 0) {
      // Smooth backspace erasing
      timer = setTimeout(() => {
        setDisplayText(fullText.slice(0, displayText.length - 1));
      }, 25);
    } else if (isDeleting && displayText.length === 0) {
      // Erased - brief pause before typing forward again
      timer = setTimeout(() => {
        setIsDeleting(false);
      }, 500);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting]);

  // "Smart Code." is index 0 to 11
  const part1 = displayText.slice(0, 11);
  const part2 = displayText.length > 11 ? displayText.slice(11) : "";

  return (
    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display min-h-[1.3em] flex flex-wrap justify-center items-center gap-x-2.5 sm:gap-x-3 select-none">
      <span>{part1}</span>
      {part2 && (
        <span className="text-gradient-hero">
          {part2}
        </span>
      )}
      <span className="inline-block w-[3px] sm:w-[3.5px] h-[0.82em] bg-cyan-400 ml-1 rounded-full animate-pulse align-middle" />
    </h1>
  );
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  isLoading,
  currentUsername = '',
  hasDossier
}) => {
  const [inputVal, setInputVal] = useState(currentUsername);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSearch(inputVal.trim());
    }
  };

  const sampleDevs = [
    { username: 'shadcn', label: 'shadcn (UI Systems)' },
    { username: 'gaearon', label: 'gaearon (Dan Abramov)' },
    { username: 'leerob', label: 'leerob (VP of DX)' },
    { username: 'torvalds', label: 'torvalds (Linux & Git)' }
  ];

  // Compact search bar when a dossier is loaded
  if (hasDossier) {
    return (
      <div className="pt-4 pb-6 max-w-3xl mx-auto px-2 sm:px-0">
        <form 
          onSubmit={handleSubmit}
          className="search-container-minimal flex items-center p-1.5 sm:p-2 rounded-2xl"
        >
          <div className="pl-3 pr-2 text-slate-400 flex items-center flex-shrink-0">
            <svg className="w-5 h-5 fill-slate-300" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </div>

          <input
            id="input-github-username-compact"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Analyze another candidate (e.g. gaearon)..."
            disabled={isLoading}
            className="flex-1 min-w-0 bg-transparent border-none text-white text-xs sm:text-sm font-medium placeholder:text-slate-400 focus:outline-none py-1.5 sm:py-2 font-sans"
          />

          <button
            type="submit"
            disabled={isLoading || !inputVal.trim()}
            className="px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:opacity-95 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all flex items-center gap-1.5 flex-shrink-0"
          >
            {isLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Analyze</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  // Initial Clean Landing View
  return (
    <section className="relative pt-8 sm:pt-14 pb-16 sm:pb-20 px-3 sm:px-6 lg:px-8 text-center overflow-hidden">
      <div className="max-w-4xl mx-auto">
        
        {/* Top Intelligence Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.07] text-slate-300 text-[11px] sm:text-xs font-sans font-medium tracking-wide mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>AUTONOMOUS DEVELOPER TALENT INTELLIGENCE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
        </motion.div>

        {/* Live Typewriter Headline: Smart Code. Smart Hire! */}
        <div className="mb-4">
          <TypewriterHeroHeading />
        </div>

        {/* Subtext */}
        <motion.p
          id="hero-subtext"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed font-sans px-2"
        >
          Autonomous repository telemetry, algorithmic code complexity scoring, and empirical git cadence to evaluate engineering potential with zero guesswork.
        </motion.p>

        {/* Centered Minimalist Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="max-w-2xl mx-auto mb-6 px-1"
        >
          <form 
            onSubmit={handleSubmit}
            className="search-container-minimal flex items-center p-2 sm:p-2.5 rounded-2xl"
          >
            <div className="pl-3 sm:pl-3.5 pr-2.5 text-slate-400 flex items-center flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-slate-300" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </div>

            <input
              id="input-github-username"
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Enter GitHub username (e.g. shadcn, gaearon)..."
              disabled={isLoading}
              className="flex-1 min-w-0 bg-transparent border-none text-white text-xs sm:text-base font-medium placeholder:text-slate-400 focus:outline-none py-1.5 sm:py-2.5 font-sans"
            />

            <button
              id="btn-analyze-candidate"
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="inline-flex items-center gap-1.5 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:opacity-95 active:scale-95 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-md shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Analyze</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Quick Benchmark Developer Chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs text-slate-400 mb-12 sm:mb-16 font-sans"
        >
          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 uppercase tracking-wider mr-1">
            <Zap className="w-3 h-3 text-indigo-400" />
            Quick Benchmarks:
          </span>
          {sampleDevs.map(dev => (
            <button
              key={dev.username}
              onClick={() => {
                setInputVal(dev.username);
                onSearch(dev.username);
              }}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] text-slate-300 hover:text-white border border-white/[0.07] hover:border-white/[0.14] font-medium text-xs transition-all shadow-sm"
            >
              @{dev.username}
            </button>
          ))}
        </motion.div>

        {/* 4 Clean Minimal Capability Cards (Muted, Decent, No Neon Shine) */}
        <div className="text-left scroll-mt-20">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <h3 className="text-xs font-sans font-medium uppercase tracking-wider text-slate-400">
                Core Telemetry & Intelligence Engines
              </h3>
            </div>
            <span className="text-[11px] font-sans text-slate-400 hidden sm:flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] px-2.5 py-0.5 rounded-full">
              Automated Code Telemetry
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            
            {/* Box 1: Algorithmic Code Complexity */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.06] hover:border-white/[0.14] flex flex-col justify-between transition-colors group cursor-default"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-white/[0.06] group-hover:border-white/[0.12] group-hover:text-white transition-all duration-200">
                    <Cpu className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[10px] font-sans font-medium uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/[0.03] text-slate-400 border border-white/[0.05] group-hover:border-white/[0.1] transition-colors">
                    01 / AST Audit
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-semibold text-white mb-1.5 tracking-tight group-hover:text-slate-100 transition-colors">
                  Algorithmic Code Complexity
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                  Deconstructs Abstract Syntax Trees, cyclomatic density, and star-to-fork ratios to compute deterministic engineering ratings with zero guesswork.
                </p>
              </div>

              {/* Minimal Animated Metric: AST Cyclomatic Rating Bar */}
              <div className="pt-3 border-t border-white/[0.05]">
                <div className="flex items-center justify-between text-[11px] mb-1.5 font-sans">
                  <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    AST Cyclomatic Rating
                  </span>
                  <span className="text-indigo-300 font-mono text-[10px] font-semibold">94 / 100</span>
                </div>
                <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: '0%' }}
                    whileInView={{ width: '94%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full bg-gradient-to-r from-indigo-500/80 to-cyan-400/80 rounded-full"
                  />
                </div>
              </div>
            </motion.div>

            {/* Box 2: 52-Week Commit Cadence */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: 0.12, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.06] hover:border-white/[0.14] flex flex-col justify-between transition-colors group cursor-default"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-white/[0.06] group-hover:border-white/[0.12] group-hover:text-white transition-all duration-200">
                    <Calendar className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[10px] font-sans font-medium uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/[0.03] text-slate-400 border border-white/[0.05] group-hover:border-white/[0.1] transition-colors">
                    02 / Cadence
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-semibold text-white mb-1.5 tracking-tight group-hover:text-slate-100 transition-colors">
                  52-Week Commit Cadence & Velocity
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                  Measures active daily contribution volume, velocity consistency, longest streaks, and production push frequency over a 365-day rolling window.
                </p>
              </div>

              {/* Minimal Animated Metric: Cadence Sparkline */}
              <div className="pt-3 border-t border-white/[0.05]">
                <div className="flex items-center justify-between text-[11px] mb-2 font-sans">
                  <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    52-Week Velocity Pulse
                  </span>
                  <span className="text-emerald-300 font-mono text-[10px] font-semibold">Peak Cadence</span>
                </div>
                <div className="flex items-end gap-1 h-3.5">
                  {[35, 60, 45, 80, 95, 65, 100, 75, 90, 55, 85, 100].map((val, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ height: 3 }}
                      whileInView={{ height: `${val}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.15 + idx * 0.035, ease: 'easeOut' }}
                      className={`flex-1 rounded-xs ${
                        val > 80 ? 'bg-emerald-400/75' : val > 50 ? 'bg-emerald-500/45' : 'bg-emerald-600/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Box 3: Autonomous AI Talent Assistant */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: 0.19, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.06] hover:border-white/[0.14] flex flex-col justify-between transition-colors group cursor-default"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-white/[0.06] group-hover:border-white/[0.12] group-hover:text-white transition-all duration-200">
                    <Bot className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[10px] font-sans font-medium uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/[0.03] text-slate-400 border border-white/[0.05] group-hover:border-white/[0.1] transition-colors">
                    03 / AI Agent
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-semibold text-white mb-1.5 tracking-tight group-hover:text-slate-100 transition-colors">
                  Autonomous AI Talent Assistant
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                  Interactive candidate Q&A grounded strictly in verified repositories, citing concrete pull requests and architectural decisions without hallucination.
                </p>
              </div>

              {/* Minimal Animated Metric: Neural Audio / Token Waveform */}
              <div className="pt-3 border-t border-white/[0.05]">
                <div className="flex items-center justify-between text-[11px] mb-2 font-sans">
                  <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Neural Talent Agent
                  </span>
                  <span className="text-cyan-300 font-mono text-[10px] font-semibold">Live Grounded</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-end gap-0.5 h-3.5">
                    {[0.1, 0.35, 0.2, 0.5, 0.25].map((delay, idx) => (
                      <span
                        key={idx}
                        className="w-1 h-full bg-cyan-400/70 rounded-full animate-wave-bar"
                        style={{ animationDelay: `${delay}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 font-sans truncate">
                    Cross-checking PRs & architectural commits...
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Box 4: Automated Skill Badges */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: 0.26, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.06] hover:border-white/[0.14] flex flex-col justify-between transition-colors group cursor-default"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-white/[0.06] group-hover:border-white/[0.12] group-hover:text-white transition-all duration-200">
                    <Award className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[10px] font-sans font-medium uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/[0.03] text-slate-400 border border-white/[0.05] group-hover:border-white/[0.1] transition-colors">
                    04 / Verified Proof
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-semibold text-white mb-1.5 tracking-tight group-hover:text-slate-100 transition-colors">
                  Automated Skill Badges & Tier Proofs
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                  Programmatically mints Diamond, Platinum, and Gold badges directly from verified lines of code, stars, and open-source contributions.
                </p>
              </div>

              {/* Minimal Animated Metric: Verified Proof Pills with Shimmer */}
              <div className="pt-3 border-t border-white/[0.05]">
                <div className="flex items-center justify-between text-[11px] mb-2 font-sans">
                  <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                    Verified Proof Minting
                  </span>
                  <span className="text-purple-300 font-mono text-[10px] font-semibold">Top 1% Tier</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-[10px] text-slate-300 font-sans font-medium">
                    <Sparkles className="w-2.5 h-2.5 text-purple-400 animate-spin" style={{ animationDuration: '8s' }} />
                    Diamond Core
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-[10px] text-slate-300 font-sans font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    100% LOC Verified
                  </span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
