import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, MapPin, Link2, 
  Bot, Flame, Star, GitFork, ArrowUpRight,
  MessageSquare, Download
} from 'lucide-react';
import { CandidateDossier } from '../types';
import { CommitHeatmap } from './CommitHeatmap';
import { ComplexityCard } from './ComplexityCard';
import { TechStackCard } from './TechStackCard';
import { VerifiedSkills } from './VerifiedSkills';
import { RepoList } from './RepoList';
import { SkillBadgesCard } from './SkillBadgesCard';
import { ExecutiveDossierModal } from './ExecutiveDossierModal';
import { evaluateSkillBadges } from '../services/badgeService';
import { exportCandidatePdf } from '../utils/pdfExport';

interface DeveloperProfileProps {
  dossier: CandidateDossier;
  onOpenAiAssistant: () => void;
  isAiPanelOpen: boolean;
  onOpenDirectChat: () => void;
}

export const DeveloperProfile: React.FC<DeveloperProfileProps> = ({
  dossier,
  onOpenAiAssistant,
  isAiPanelOpen,
  onOpenDirectChat
}) => {
  const { profile, repos, complexity, techStack, verifiedSkills, commitHeatmap } = dossier;
  const [isExporting, setIsExporting] = useState(false);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);
  const badges = evaluateSkillBadges(dossier);

  const handleExportPdf = () => {
    setIsExporting(true);
    setTimeout(() => {
      exportCandidatePdf(dossier);
      setIsExporting(false);
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-8 pb-16"
    >
      {/* CANDIDATE HEADER HERO CARD */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-white/10 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors">
        
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* Avatar & Core Bio */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden p-[2px] bg-gradient-to-tr from-indigo-600 via-purple-500 to-cyan-400 shadow-xl shadow-indigo-500/25">
                <img
                  src={profile.avatar_url}
                  alt={profile.name}
                  className="w-full h-full object-cover rounded-[14px] bg-slate-900"
                />
              </div>
              {profile.verified_badge && (
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-[10px] font-mono font-black uppercase tracking-wider shadow-md">
                  {profile.verified_badge}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight transition-colors">
                  {profile.name}
                </h1>
                <a
                  href={profile.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-indigo-600 dark:text-cyan-400 border border-slate-200 dark:border-white/5 flex items-center gap-1 transition-colors"
                >
                  <span>@{profile.login}</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </a>

                {profile.hireable !== false && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-500/15 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
                    Open to Opportunities
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed transition-colors">
                {profile.bio || 'Public open-source engineer and repository maintainer.'}
              </p>

              {/* Meta Links */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400 pt-1 font-mono">
                {profile.company && (
                  <span className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {profile.company}
                  </span>
                )}
                {profile.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {profile.location}
                  </span>
                )}
                {profile.blog && (
                  <a
                    href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    <Link2 className="w-3.5 h-3.5 text-slate-400" />
                    {profile.blog.replace('https://', '').replace('http://', '')}
                  </a>
                )}
                {profile.twitter_username && (
                  <a
                    href={`https://twitter.com/${profile.twitter_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 fill-current text-slate-400" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    @{profile.twitter_username}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* TALENT POTENTIAL SCORE & ACTION BUTTONS */}
          <div className="flex flex-col items-start lg:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-slate-200/80 dark:border-white/10 pt-4 lg:pt-0 lg:pl-8">
            
            {/* Score Rating */}
            <div className="text-left lg:text-right">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Calculated Potential Score
              </span>
              <div className="flex items-baseline lg:justify-end gap-2 mt-0.5">
                <span className="text-4xl sm:text-5xl font-black text-slate-950 dark:text-white font-mono tracking-tight glow-text-indigo">
                  {profile.potential_score}
                </span>
                <span className="text-slate-400 text-sm font-mono">/ 100</span>
              </div>
              <div className="flex items-center lg:justify-end gap-2 mt-1">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                  {profile.seniority_level}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400"></span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/25">
                  {profile.recommendation_status}
                </span>
              </div>
            </div>

            {/* Action Buttons Row: Connect/Chat + Download Report + Ask AI */}
            <div className="flex items-center gap-2 flex-wrap">
              
              {/* Connect / Chat Button */}
              <button
                id="btn-direct-chat"
                onClick={onOpenDirectChat}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-500/40 text-xs font-bold tracking-wide transition-all active:scale-95 shadow-sm dark:shadow-md dark:shadow-indigo-500/15"
                title="Open Direct Message Channel"
              >
                <MessageSquare className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                <span>Connect / Chat</span>
              </button>

              {/* Download PDF Button */}
              <button
                id="btn-export-executive-dossier"
                onClick={() => setIsDossierModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 hover:from-indigo-500/30 hover:to-cyan-500/30 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 text-xs font-extrabold tracking-wide transition-all active:scale-95 shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/25 group"
                title="1-Click Executive PDF Talent Dossier"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>Download PDF</span>
              </button>

              {/* AI Assistant Launch Button */}
              <button
                id="btn-open-ai-assistant"
                onClick={onOpenAiAssistant}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs tracking-wide shadow-md transition-all ${
                  isAiPanelOpen
                    ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500/40'
                    : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:opacity-95 text-white shadow-indigo-500/25 hover:scale-102'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-cyan-200" />
                <span>{isAiPanelOpen ? 'AI Panel Active' : 'Ask AI'}</span>
              </button>

            </div>

          </div>

        </div>

        {/* METRICS COUNTER BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-8 pt-6 border-t border-slate-200/80 dark:border-white/5">
          
          <div className="p-3 rounded-xl bg-slate-100/90 dark:bg-black/30 border border-slate-200/80 dark:border-white/5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">Public Repos</span>
            <span className="text-lg font-bold text-slate-950 dark:text-white font-mono mt-0.5 block">
              {profile.public_repos}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-100/90 dark:bg-black/30 border border-slate-200/80 dark:border-white/5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">Total Stars</span>
            <span className="text-lg font-bold text-amber-500 dark:text-amber-400 font-mono mt-0.5 block flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400/20 text-amber-500 dark:text-amber-400" />
              {profile.total_stars.toLocaleString()}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-100/90 dark:bg-black/30 border border-slate-200/80 dark:border-white/5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">Total Forks</span>
            <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400 font-mono mt-0.5 block flex items-center gap-1">
              <GitFork className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              {profile.total_forks.toLocaleString()}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-100/90 dark:bg-black/30 border border-slate-200/80 dark:border-white/5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">Followers</span>
            <span className="text-lg font-bold text-slate-950 dark:text-white font-mono mt-0.5 block">
              {profile.followers.toLocaleString()}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-100/90 dark:bg-black/30 border border-slate-200/80 dark:border-white/5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">Estimated LOC</span>
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 font-mono mt-0.5 block">
              ~{(profile.lines_of_code_est / 1000).toFixed(0)}k
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-100/90 dark:bg-black/30 border border-slate-200/80 dark:border-white/5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">Active Streak</span>
            <span className="text-lg font-bold text-amber-600 dark:text-amber-300 font-mono mt-0.5 block flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              {profile.active_streak_days} Days
            </span>
          </div>

        </div>

      </div>

      {/* AUTOMATED SKILL BADGES & ACHIEVEMENTS */}
      <SkillBadgesCard badges={badges} />

      {/* COMMIT ACTIVITY HEATMAP */}
      <CommitHeatmap
        data={commitHeatmap}
        candidateName={profile.login}
      />

      {/* DUAL GRID: CODE COMPLEXITY & TECH STACK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ComplexityCard
          complexity={complexity}
          totalStars={profile.total_stars}
          totalForks={profile.total_forks}
          repoCount={repos.length}
        />

        <TechStackCard
          techStack={techStack}
        />
      </div>

      {/* VERIFIED SKILLS */}
      <VerifiedSkills
        skills={verifiedSkills}
      />

      {/* REPOSITORIES ARCHITECTURE */}
      <RepoList
        repos={repos}
      />

      {/* 1-CLICK EXECUTIVE TALENT DOSSIER MODAL */}
      <ExecutiveDossierModal
        dossier={dossier}
        isOpen={isDossierModalOpen}
        onClose={() => setIsDossierModalOpen(false)}
      />

    </motion.div>
  );
};
