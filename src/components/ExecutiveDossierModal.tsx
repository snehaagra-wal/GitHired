import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Download, Copy, Check, ShieldCheck, Sparkles, 
  Cpu, GitPullRequest, Star, Calendar, ExternalLink,
  Award, FileText, CheckCircle2, ChevronRight
} from 'lucide-react';
import { CandidateDossier } from '../types';
import { exportCandidatePdf } from '../utils/pdfExport';
import { evaluateSkillBadges } from '../services/badgeService';

interface ExecutiveDossierModalProps {
  dossier: CandidateDossier;
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveDossierModal: React.FC<ExecutiveDossierModalProps> = ({
  dossier,
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const { profile, complexity, techStack, verifiedSkills, repos } = dossier;
  const badges = evaluateSkillBadges(dossier);
  const unlockedBadges = badges.filter(b => b.unlocked);

  const handleExportPdf = () => {
    setIsExporting(true);
    setTimeout(() => {
      exportCandidatePdf(dossier);
      setIsExporting(false);
    }, 400);
  };

  const handleCopyBriefing = () => {
    const text = `
==================================================
CONFIDENTIAL // GITHIRED EXECUTIVE TALENT BRIEFING
Candidate: ${profile.name} (@${profile.login})
Seniority: ${profile.seniority_level}
Potential Score: ${profile.potential_score}/100 [${profile.recommendation_status}]
==================================================

EXECUTIVE SUMMARY:
${profile.name} demonstrates ${profile.seniority_level.toLowerCase()} competency with deterministic telemetry across ${profile.public_repos} repositories.
- Complexity Grade: Grade ${complexity.grade} (${complexity.architectureDepth}/100 Architecture Depth)
- Active Git Streak: ${profile.active_streak_days} days
- Ecosystem Traction: ${profile.total_stars.toLocaleString()} Stars across public codebases

TOP VERIFIED TECHNICAL STACK:
${techStack.slice(0, 5).map(t => `• ${t.name}: ${t.percentage}% (${t.tier} Tier)`).join('\n')}

FLAGSHIP REPOSITORIES:
${repos.slice(0, 3).map(r => `• ${r.name} (${r.language || 'Code'}) - ${(r.stargazers_count || 0).toLocaleString()} stars: ${r.description || 'Core engineering module'}`).join('\n')}

AI HIRING VERDICT:
${profile.potential_score >= 85 ? 'STRONG HIRE - Recommended for flagship technical roles and distributed systems scale.' : 'RECOMMENDED - Solid individual contributor with clean modular syntax and consistent contribution cadence.'}

Report generated autonomously by GitHired Developer Talent Intelligence.
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
        
        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0b0f19] border border-white/15 rounded-3xl shadow-2xl shadow-cyan-500/10 overflow-hidden text-left"
        >
          {/* Top Decorative Ambient Glow */}
          <div className="absolute top-0 left-1/4 w-1/2 h-32 bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-purple-500/20 blur-3xl pointer-events-none -z-0" />

          {/* MODAL HEADER */}
          <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#080d1a]/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-cyan-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                    EXECUTIVE TALENT DOSSIER
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    VERIFIED // AST-V2
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-white tracking-tight">
                  {profile.name} — Hiring Intelligence Briefing
                </h3>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyBriefing}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-white/10 text-xs font-bold transition-all shadow-sm active:scale-95"
                title="Copy formatted summary to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-300" />
                    <span>Copy Summary</span>
                  </>
                )}
              </button>

              <button
                onClick={handleExportPdf}
                disabled={isExporting}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 hover:opacity-95 text-white text-xs font-extrabold shadow-md shadow-indigo-500/25 transition-all active:scale-95 disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-white" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* SCROLLABLE DOSSIER CONTENT */}
          <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Candidate Overview Card */}
            <div className="p-5 rounded-2xl bg-[#0e1424] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <img
                  src={profile.avatar_url}
                  alt={profile.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400/50 shadow-lg"
                />
                <div>
                  <h4 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <span>{profile.name}</span>
                    <span className="text-xs font-mono font-normal text-slate-400">@{profile.login}</span>
                  </h4>
                  <p className="text-xs text-slate-300 max-w-xl line-clamp-2 mt-1">
                    {profile.bio || 'Autonomous developer talent analyzed via verified GitHub code telemetry.'}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] font-mono text-slate-400">
                    <span className="text-indigo-300 font-bold">{profile.seniority_level}</span>
                    <span>•</span>
                    <span>{profile.public_repos} Public Repos</span>
                    <span>•</span>
                    <span>{profile.total_stars.toLocaleString()} Stars</span>
                  </div>
                </div>
              </div>

              {/* Potential Score Plaque */}
              <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-6">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Engineering Rating
                </span>
                <div className="flex items-baseline gap-1.5 my-0.5">
                  <span className="text-3xl font-black text-cyan-300 font-mono">
                    {profile.potential_score}
                  </span>
                  <span className="text-xs font-mono text-slate-400">/ 100</span>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {profile.recommendation_status}
                </span>
              </div>
            </div>

            {/* Two Column Section: Telemetry Metrics & Code Complexity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Telemetry Numbers */}
              <div className="p-4 rounded-2xl bg-[#0c111e] border border-white/10">
                <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300 mb-3 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Cadence & Velocity Telemetry</span>
                </h5>
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Total Stars</span>
                    <span className="text-base font-bold text-white">{profile.total_stars.toLocaleString()}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Active Streak</span>
                    <span className="text-base font-bold text-cyan-300">{profile.active_streak_days} Days</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Community Followers</span>
                    <span className="text-base font-bold text-white">{profile.followers.toLocaleString()}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Total Forks</span>
                    <span className="text-base font-bold text-white">{profile.total_forks.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* AST Complexity Scores */}
              <div className="p-4 rounded-2xl bg-[#0c111e] border border-white/10">
                <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 mb-3 flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AST Complexity Breakdown</span>
                </h5>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50">
                    <span className="text-slate-300">Architectural Depth</span>
                    <span className="font-mono font-bold text-cyan-300">{complexity.architectureDepth}/100</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50">
                    <span className="text-slate-300">Code Hygiene & Modularity</span>
                    <span className="font-mono font-bold text-indigo-300">{complexity.codeHygiene}/100</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/50">
                    <span className="text-slate-300">Maintainability Rating</span>
                    <span className="font-mono font-bold text-emerald-300">{complexity.maintainability}/100</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Top Verified Competencies */}
            <div className="p-4 rounded-2xl bg-[#0c111e] border border-white/10">
              <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Technical Competencies</span>
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {verifiedSkills.slice(0, 4).map((skill, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/70 border border-white/5 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white text-xs">{skill.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-500/30">
                        {skill.level}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {skill.proofText}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Flagship Production Repositories */}
            <div className="p-4 rounded-2xl bg-[#0c111e] border border-white/10">
              <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                <GitPullRequest className="w-3.5 h-3.5 text-cyan-400" />
                <span>Top Production Repositories</span>
              </h5>
              <div className="space-y-2">
                {repos.slice(0, 3).map((repo, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{repo.name}</span>
                        {repo.language && (
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-cyan-300">
                            {repo.language}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {repo.description || 'Public engineering repository'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-mono text-amber-400 flex-shrink-0">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{(repo.stargazers_count || 0).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Interview Strategy Prompts */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-900/60 border border-indigo-500/25">
              <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300 mb-2 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Executive Recruiter Interview Strategy</span>
              </h5>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-mono font-bold">01.</span>
                  <span>"Can you describe how you architected state management and concurrency in your flagship repository <strong>{repos[0]?.name || 'active repo'}</strong>?"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-mono font-bold">02.</span>
                  <span>"Given your high AST rating in modular design, what trade-offs did you make between bundle size and component abstraction?"</span>
                </li>
              </ul>
            </div>

          </div>

          {/* MODAL FOOTER */}
          <div className="px-6 py-4 border-t border-white/10 bg-[#080d1a] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] font-mono text-slate-400">
              ⚡ 1-Click Executive Export • Verified with GitHired Telemetry
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopyBriefing}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-bold transition-all active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Briefing!' : 'Copy Summary'}</span>
              </button>

              <button
                onClick={handleExportPdf}
                disabled={isExporting}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 hover:opacity-95 text-white text-xs font-extrabold shadow-md shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF Dossier</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
};
