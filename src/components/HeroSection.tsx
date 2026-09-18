import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Sparkles, ArrowRight, Zap, Cpu, Calendar, 
  Bot, Award, CheckCircle2
} from 'lucide-react';

interface HeroSectionProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
  currentUsername?: string;
  hasDossier: boolean;
}

// Falling Words Component that drops letters from the top and forms them quickly
const FallingWordsHeading: React.FC<{
  line1: string;
  line2: string;
}> = ({ line1, line2 }) => {
  const words1 = line1.split(' ');
  const words2 = line2.split(' ');

  let globalCharIndex = 0;

  return (
    <div className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-4 space-y-2 select-none font-display">
      {/* Line 1: Smart Code. */}
      <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1">
        {words1.map((word, wIdx) => (
          <span key={wIdx} className="inline-flex whitespace-nowrap">
            {Array.from(word).map((char, cIdx) => {
              const currentDelay = 0.05 + globalCharIndex * 0.028;
              globalCharIndex++;
              return (
                <motion.span
                  key={cIdx}
                  initial={{
                    y: -90,
                    opacity: 0,
                    rotateX: -80,
                    scale: 0.6,
                    filter: 'blur(8px)'
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    rotateX: 0,
                    scale: 1,
                    filter: 'blur(0px)'
                  }}
                  transition={{
                    type: 'spring',
                    damping: 15,
                    stiffness: 240,
                    delay: currentDelay
                  }}
                  className="inline-block transform-gpu origin-top text-white font-display drop-shadow-sm transition-colors"
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        ))}
      </div>

      {/* Line 2: Start Reading Code. */}
      <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1">
        {words2.map((word, wIdx) => (
          <span key={wIdx} className="inline-flex whitespace-nowrap">
            {Array.from(word).map((char, cIdx) => {
              const currentDelay = 0.35 + cIdx * 0.025 + wIdx * 0.1;
              return (
                <motion.span
                  key={cIdx}
                  initial={{
                    y: -90,
                    opacity: 0,
                    rotateX: -80,
                    scale: 0.6,
                    filter: 'blur(8px)'
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    rotateX: 0,
                    scale: 1,
                    filter: 'blur(0px)'
                  }}
                  transition={{
                    type: 'spring',
                    damping: 15,
                    stiffness: 240,
                    delay: currentDelay
                  }}
                  className="inline-block transform-gpu origin-top font-display text-gradient-hero"
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        ))}
      </div>
    </div>
  );
};

// Live Typewriter Component that types out when triggered by scroll into view
const TypewriterText: React.FC<{
  text: string;
  delay?: number;
  speed?: number;
  trigger: boolean;
  prefix?: string;
}> = ({ text, delay = 0, speed = 20, trigger, prefix = '' }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!trigger) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    let currentIndex = 0;
    const timeout = setTimeout(() => {
      setIsTyping(true);
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(interval);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [trigger, text, delay, speed]);

  return (
    <span className="font-mono">
      {prefix && <span className="text-slate-500 mr-1">{prefix}</span>}
      <span>{displayedText}</span>
      {isTyping && (
        <span className="inline-block w-1.5 h-3.5 bg-cyan-400 ml-1 translate-y-[2px] animate-pulse" />
      )}
    </span>
  );
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  isLoading,
  currentUsername = '',
  hasDossier
}) => {
  const [inputVal, setInputVal] = useState(currentUsername);
  const gridRef = useRef<HTMLDivElement | null>(null);
  // Trigger typewriter effect when user scrolls to the 4 boxes
  const isGridInView = useInView(gridRef, { once: false, amount: 0.2 });

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

  // If a profile is already loaded, render compact search bar with vibrant glowing styling
  if (hasDossier) {
    return (
      <div className="pt-6 pb-6 max-w-4xl mx-auto">
        <div className="border-beam-wrapper rounded-2xl">
          {/* Continuous Moving Glowing Border Beam */}
          <div className="border-beam-spinner-search" />

          {/* Inner Content Box with solid dark background */}
          <form 
            onSubmit={handleSubmit}
            className="border-beam-inner-box flex items-center p-2 rounded-2xl"
          >
            <div className="pl-3.5 pr-2.5 text-cyan-400 flex items-center">
              <svg className="w-5 h-5 fill-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]" viewBox="0 0 24 24">
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
              className="flex-1 bg-transparent border-none text-white text-sm font-medium placeholder:text-slate-300 focus:outline-none focus:ring-0 py-2 font-sans"
            />

            <button
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-indigo-500/30 disabled:opacity-50 transition-all flex items-center gap-1.5"
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
      </div>
    );
  }

  // Initial Clean State Landing Page
  return (
    <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
      
      <div className="max-w-4xl mx-auto">
        
        {/* HERO TEXT SECTION WRAPPER WITH SUBTLE ANIMATED BACKGROUND GRID */}
        <div className="relative overflow-hidden rounded-3xl py-4 sm:py-6 px-4 sm:px-6 mb-8">
          
          {/* Subtle Transparent Animated Background Grid Layer (Crossing Vertical & Horizontal Lines) */}
          <div 
            className="hero-grid-animated absolute inset-0 z-0 pointer-events-none" 
            aria-hidden="true"
          />

          {/* Foreground Hero Content (Strictly z-10 for pristine readability) */}
          <div className="relative z-10">
            {/* Top Intelligence Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-8 shadow-inner transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AUTONOMOUS DEVELOPER TALENT INTELLIGENCE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            </motion.div>

            {/* HERO SECTION HEADLINE: Words Falling From Top & Forming Fast */}
            <FallingWordsHeading
              line1="Smart Code."
              line2="Smart Hire!"
            />

            {/* Subtext */}
            <motion.p
              id="hero-subtext"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.8, ease: 'easeOut' }}
              className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mt-4 mb-2 leading-relaxed font-sans"
            >
              Autonomous repository telemetry, algorithmic code complexity scoring, and empirical git cadence to evaluate engineering potential with zero guesswork.
            </motion.p>
          </div>
        </div>

        {/* Centered Search Bar - Continuous Moving Glowing Border Beam */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.85, duration: 0.7 }}
          className="max-w-2xl mx-auto mb-6"
        >
          <div className="border-beam-wrapper rounded-2xl">
            {/* Spinning Laser Beam Effect */}
            <div className="border-beam-spinner-search" />

            {/* Inner Content Box with solid dark background */}
            <form 
              onSubmit={handleSubmit}
              className="border-beam-inner-box flex items-center p-2.5 sm:p-3 rounded-2xl"
            >
              <div className="pl-3.5 pr-3 text-cyan-400 flex items-center">
                <svg className="w-6 h-6 fill-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" viewBox="0 0 24 24">
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
                className="flex-1 bg-transparent border-none text-white text-base sm:text-lg font-medium placeholder:text-slate-300 focus:outline-none focus:ring-0 py-2.5 font-sans"
              />

              <button
                id="btn-analyze-candidate"
                type="submit"
                disabled={isLoading || !inputVal.trim()}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 hover:from-indigo-400 hover:to-cyan-300 active:scale-95 text-white font-extrabold text-sm sm:text-base tracking-wide shadow-xl shadow-indigo-500/40 hover:shadow-cyan-400/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Quick Benchmark Developer Chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 mb-16"
        >
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400 uppercase">
            <Zap className="w-3 h-3 text-cyan-400" />
            Quick Benchmarks:
          </span>
          {sampleDevs.map(dev => (
            <button
              key={dev.username}
              onClick={() => {
                setInputVal(dev.username);
                onSearch(dev.username);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-[#0d1424] hover:bg-indigo-950/80 text-slate-200 hover:text-cyan-300 border border-indigo-500/30 font-mono transition-all duration-150 shadow-sm hover:border-cyan-400/50 hover:scale-105"
            >
              @{dev.username}
            </button>
          ))}
        </motion.div>

        {/* 4 HIGH-TECH CAPABILITY BOXES WITH CONTINUOUS MOVING GLOWING BEAMS */}
        <div ref={gridRef} className="text-left scroll-mt-20 relative">
          
          {/* Section Ambient Moving Beam Stream Behind the Cards */}
          <div className="section-ambient-beams">
            <div className="section-beam-streak section-beam-streak-1" />
            <div className="section-beam-streak section-beam-streak-2" />
          </div>

          <div className="relative z-10 flex items-center justify-between mb-5 px-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Live Telemetry & Intelligence Engines
              </h3>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5 bg-cyan-950/40 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> Scroll-Activated Telemetry
            </span>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Box 1: Algorithmic Code Complexity */}
            <div className="border-beam-wrapper rounded-2xl group hover:-translate-y-1 transition-all duration-300 flex flex-col">
              {/* Continuous Moving Glowing Border Beam */}
              <div className="border-beam-spinner-card-1" />

              {/* Solid Dark Inner Content Box */}
              <div className="border-beam-inner-box rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between flex-1">
                {/* Continuously Moving Glowing Beams */}
                <div className="card-beam-1" />
                <div className="card-beam-2" />
                <div className="card-edge-laser" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 w-fit group-hover:scale-105 transition-transform">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-500/20">
                      ENGINE // AST-01
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1.5 group-hover:text-indigo-300 transition-colors">
                    Algorithmic Code Complexity
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Deconstructs Abstract Syntax Trees, cyclomatic density, and star-to-fork ratios to compute deterministic engineering ratings.
                  </p>

                  {/* Live Typewriter Terminal Display */}
                  <div className="bg-[#0a0f1d] rounded-xl p-3 border border-slate-800 font-mono text-[11px] shadow-inner">
                    <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-slate-800 text-[10px] text-slate-500">
                      <span className="w-2 h-2 rounded-full bg-red-500/80" />
                      <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                      <span className="w-2 h-2 rounded-full bg-cyan-500/80" />
                      <span className="ml-2 text-slate-400">complexity-audit.sh</span>
                    </div>
                    <div className="text-indigo-300">
                      <TypewriterText 
                        prefix=">"
                        text="audit --ast --depth=4 --candidate=active" 
                        speed={25}
                        delay={100}
                        trigger={isGridInView}
                      />
                    </div>
                    <div className="text-cyan-300 mt-1">
                      <TypewriterText 
                        prefix="✔"
                        text="AST Complexity: 94/100 [Production Ready]" 
                        speed={20}
                        delay={1200}
                        trigger={isGridInView}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: 52-Week Commit Cadence */}
            <div className="border-beam-wrapper rounded-2xl group hover:-translate-y-1 transition-all duration-300 flex flex-col">
              {/* Continuous Moving Glowing Border Beam */}
              <div className="border-beam-spinner-card-2" />

              {/* Solid Dark Inner Content Box */}
              <div className="border-beam-inner-box rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between flex-1">
                {/* Continuously Moving Glowing Beams */}
                <div className="card-beam-1" />
                <div className="card-beam-2" />
                <div className="card-edge-laser" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 w-fit group-hover:scale-105 transition-transform">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/20">
                      STREAM // CADENCE-02
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
                    52-Week Commit Cadence & Velocity
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Measures active daily contribution volume, velocity consistency, longest streaks, and production push frequency.
                  </p>

                  {/* Live Typewriter Terminal Display */}
                  <div className="bg-[#0a0f1d] rounded-xl p-3 border border-slate-800 font-mono text-[11px] shadow-inner">
                    <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-slate-800 text-[10px] text-slate-500">
                      <span className="w-2 h-2 rounded-full bg-red-500/80" />
                      <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                      <span className="w-2 h-2 rounded-full bg-cyan-500/80" />
                      <span className="ml-2 text-slate-400">cadence-telemetry.log</span>
                    </div>
                    <div className="text-cyan-300">
                      <TypewriterText 
                        prefix=">"
                        text="telemetry --window=365d --stream=live" 
                        speed={25}
                        delay={300}
                        trigger={isGridInView}
                      />
                    </div>
                    <div className="text-indigo-300 mt-1">
                      <TypewriterText 
                        prefix="✔"
                        text="1,420 Commits • 68-day Streak • Velocity Peak" 
                        speed={20}
                        delay={1400}
                        trigger={isGridInView}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 3: Autonomous AI Talent Assistant */}
            <div className="border-beam-wrapper rounded-2xl group hover:-translate-y-1 transition-all duration-300 flex flex-col">
              {/* Continuous Moving Glowing Border Beam */}
              <div className="border-beam-spinner-card-3" />

              {/* Solid Dark Inner Content Box */}
              <div className="border-beam-inner-box rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between flex-1">
                {/* Continuously Moving Glowing Beams */}
                <div className="card-beam-1" />
                <div className="card-beam-2" />
                <div className="card-edge-laser" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 w-fit group-hover:scale-105 transition-transform">
                      <Bot className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/20">
                      NEURAL // RAG-03
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1.5 group-hover:text-purple-300 transition-colors">
                    Autonomous AI Talent Assistant
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Interactive candidate Q&A grounded strictly in verified repositories, citing concrete pull requests and architectural decisions.
                  </p>

                  {/* Live Typewriter Terminal Display */}
                  <div className="bg-[#0a0f1d] rounded-xl p-3 border border-slate-800 font-mono text-[11px] shadow-inner">
                    <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-slate-800 text-[10px] text-slate-500">
                      <span className="w-2 h-2 rounded-full bg-red-500/80" />
                      <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                      <span className="w-2 h-2 rounded-full bg-cyan-500/80" />
                      <span className="ml-2 text-slate-400">neural-interviewer.py</span>
                    </div>
                    <div className="text-purple-300">
                      <TypewriterText 
                        prefix=">"
                        text="ai.evaluate('Distributed architecture & scale')" 
                        speed={25}
                        delay={500}
                        trigger={isGridInView}
                      />
                    </div>
                    <div className="text-cyan-300 mt-1">
                      <TypewriterText 
                        prefix="✔"
                        text="Verified: Microservices author • High concurrency" 
                        speed={20}
                        delay={1600}
                        trigger={isGridInView}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 4: Automated Skill Badges & Tier Verification */}
            <div className="border-beam-wrapper rounded-2xl group hover:-translate-y-1 transition-all duration-300 flex flex-col">
              {/* Continuous Moving Glowing Border Beam */}
              <div className="border-beam-spinner-card-4" />

              {/* Solid Dark Inner Content Box */}
              <div className="border-beam-inner-box rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between flex-1">
                {/* Continuously Moving Glowing Beams */}
                <div className="card-beam-1" />
                <div className="card-beam-2" />
                <div className="card-edge-laser" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 w-fit group-hover:scale-105 transition-transform">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/20">
                      VERIFY // BADGES-04
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1.5 group-hover:text-amber-300 transition-colors">
                    Automated Skill Badges & Tier Proofs
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Programmatically mints Diamond, Platinum, and Gold badges directly from verified lines of code, stars, and open-source contributions.
                  </p>

                  {/* Live Typewriter Terminal Display */}
                  <div className="bg-[#0a0f1d] rounded-xl p-3 border border-slate-800 font-mono text-[11px] shadow-inner">
                    <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-slate-800 text-[10px] text-slate-500">
                      <span className="w-2 h-2 rounded-full bg-red-500/80" />
                      <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                      <span className="w-2 h-2 rounded-full bg-cyan-500/80" />
                      <span className="ml-2 text-slate-400">credential-verify.ts</span>
                    </div>
                    <div className="text-amber-300">
                      <TypewriterText 
                        prefix=">"
                        text="credentials.mint --verify-codebase" 
                        speed={25}
                        delay={700}
                        trigger={isGridInView}
                      />
                    </div>
                    <div className="text-cyan-300 mt-1">
                      <TypewriterText 
                        prefix="✔"
                        text="Diamond Maintainer • Top 1% TypeScript Contributor" 
                        speed={20}
                        delay={1800}
                        trigger={isGridInView}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
