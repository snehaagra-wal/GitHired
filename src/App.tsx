import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, AlertCircle, RefreshCw } from 'lucide-react';
import { CandidateDossier } from './types';
import { fetchDeveloperDossier } from './services/githubService';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DeveloperProfile } from './components/DeveloperProfile';
import { DeveloperComparison } from './components/DeveloperComparison';
import { AiAssistantPanel } from './components/AiAssistantPanel';
import { DirectChatModal } from './components/DirectChatModal';
import { NetworkCanvas } from './components/NetworkCanvas';

export function App() {
  const [activeTab, setActiveTab] = useState<'profile' | 'compare'>('profile');
  const [currentUsername, setCurrentUsername] = useState('');
  const [dossier, setDossier] = useState<CandidateDossier | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Slide-in AI Drawer state (closed by default on initial landing page)
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [isDirectChatOpen, setIsDirectChatOpen] = useState(false);

  // Permanent sleek dark theme
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('githired_theme', 'dark');
  }, []);

  // Profile analysis only loads when a user enters a valid username and clicks "Analyze".
  const loadCandidate = async (username: string) => {
    if (!username.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchDeveloperDossier(username);
      setDossier(data);
      setCurrentUsername(data.profile.login);
      // Auto-open AI panel only on desktop (>=1024px) so mobile users can view the loaded profile directly
      if (window.innerWidth >= 1024) {
        setIsAiPanelOpen(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch candidate GitHub dossier.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (username: string) => {
    setActiveTab('profile');
    loadCandidate(username);
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-[#060810] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Sleek, minimal ambient canvas background */}
      <NetworkCanvas />

      {/* TOP NAVIGATION */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* MAIN CONTENT AREA WITH PAGE TRANSITIONS */}
      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: PROFILE INTELLIGENCE */}
          {activeTab === 'profile' && (
            <motion.div
              key="tab-profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8"
            >
              {/* Hero Section */}
              <HeroSection
                onSearch={handleSearch}
                isLoading={isLoading}
                currentUsername={currentUsername}
                hasDossier={!!dossier}
              />

              {/* Error Banner */}
              {error && (
                <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs sm:text-sm font-mono flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Loading State Skeleton */}
              {isLoading && (
                <div className="max-w-3xl mx-auto my-12 p-8 sm:p-12 rounded-3xl glass-card text-center space-y-4">
                  <RefreshCw className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400 animate-spin mx-auto" />
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    Harvesting GitHub Telemetry & AST Metaprograms...
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Calculating Code Complexity, Commit Heatmap, and Verified Skill Proofs
                  </p>
                </div>
              )}

              {/* Detailed Developer Dossier Display */}
              {!isLoading && dossier && (
                <DeveloperProfile
                  dossier={dossier}
                  onOpenAiAssistant={() => setIsAiPanelOpen(true)}
                  isAiPanelOpen={isAiPanelOpen}
                  onOpenDirectChat={() => setIsDirectChatOpen(true)}
                />
              )}
            </motion.div>
          )}

          {/* TAB 2: DEVELOPER COMPARISON */}
          {activeTab === 'compare' && (
            <motion.div
              key="tab-compare"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <DeveloperComparison
                initialDev1={currentUsername || 'shadcn'}
                initialDev2="leerob"
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* SLIDE-IN AI HIRING ASSISTANT PANEL */}
      {dossier && (
        <AiAssistantPanel
          dossier={dossier}
          isOpen={isAiPanelOpen}
          onClose={() => setIsAiPanelOpen(false)}
        />
      )}

      {/* FLOATING RE-OPEN AI BUTTON (WHEN DRAWER IS CLOSED) */}
      {!isAiPanelOpen && dossier && (
        <motion.button
          id="btn-floating-ai-launcher"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsAiPanelOpen(true)}
          className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-bold shadow-xl shadow-indigo-500/30 hover:scale-105 active:scale-95 flex items-center gap-2 transition-transform"
          title="Open AI Hiring Assistant"
        >
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-200" />
          <span className="text-[11px] sm:text-xs tracking-wide uppercase font-mono">Ask AI</span>
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-300 animate-pulse" />
        </motion.button>
      )}

      {/* REAL-TIME RECRUITER DIRECT CHAT MODAL */}
      {dossier && (
        <DirectChatModal
          isOpen={isDirectChatOpen}
          onClose={() => setIsDirectChatOpen(false)}
          dossier={dossier}
        />
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/[0.08] bg-[#07090e]/90 backdrop-blur-md py-6 sm:py-8 text-xs text-slate-400 font-mono relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="text-white font-bold tracking-tight">GitHired</span>
            <span>— Autonomous Developer Talent Intelligence</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 text-[10px] border border-indigo-500/25 font-semibold">
              Verified Code Telemetry
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span>Tailwind & Framer Motion</span>
            <span>•</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub API Integrated</span>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
