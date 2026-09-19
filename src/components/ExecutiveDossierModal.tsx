import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Download, Copy, Check, ShieldCheck, Sparkles, 
  Cpu, Star, Calendar, FileText
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

  const { profile, complexity, techStack, repos } = dossier;
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
        
        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0b0f19] border border-white/[0.08] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-left"
        >
          {/* Top Decorative Ambient Glow */}
          <div className="absolute top-0 left-1/4 w-1/2 h-32 bg-indigo-500/10 blur-3xl pointer-events-none" />

          {/* MODAL HEADER */}
          <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/[0.08] bg-[#080d1a]/90 backdrop-blur-md gap-2">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/25 text-cyan-400 flex-shrink-0">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 truncate">
                    EXECUTIVE DOSSIER
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 flex-shrink-0">
                    VERIFIED
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                  {profile.name} — Talent Briefing
                </h3>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <button
                onClick={handleCopyBriefing}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-white/[0.08] text-xs font-bold transition-all"
                title="Copy summary"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleExportPdf}
                disabled={isExporting}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:opacity-95 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SCROLLABLE DOSSIER CONTENT */}
          <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6 touch-scroll">
            
            {/* Candidate Overview Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1424] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={profile.avatar_url}
                  alt={profile.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-cyan-400/40 shadow-md flex-shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5 truncate">
                    <span className="truncate">{profile.name}</span>
                    <span className="text-xs font-mono font-normal text-slate-400">@{profile.login}</span>
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">
                    {profile.bio || 'Autonomous developer talent analyzed via verified GitHub code telemetry.'}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] font-mono text-slate-400">
                    <span className="text-indigo-300 font-bold">{profile.seniority_level}</span>
                    <span>•</span>
                    <span>{profile.public_repos} Repos</span>
                    <span>•</span>
                    <span>{profile.total_stars.toLocaleString()} Stars</span>
                  </div>
                </div>
              </div>

              {/* Score pill */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-white/[0.06]">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Potential Rating</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-white font-mono glow-text-indigo">
                    {profile.potential_score}
                  </span>
                  <span className="text-slate-500 text-xs font-mono">/ 100</span>
                </div>
                <span className="text-[10px] font-bold text-cyan-400 font-mono">
                  {profile.recommendation_status}
                </span>
              </div>
            </div>

            {/* Executive Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/[0.05]">
                <span className="text-[10px] font-mono text-indigo-300 block mb-1">COMPLEXITY GRADE</span>
                <span className="text-xl font-extrabold text-white font-mono block">Grade {complexity.grade}</span>
                <span className="text-[11px] text-slate-400 mt-1 block">Architecture Depth: {complexity.architectureDepth}%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/[0.05]">
                <span className="text-[10px] font-mono text-cyan-300 block mb-1">CONTRIBUTION CADENCE</span>
                <span className="text-xl font-extrabold text-white font-mono block">{profile.active_streak_days} Days</span>
                <span className="text-[11px] text-slate-400 mt-1 block">Current Active Streak</span>
              </div>
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/[0.05]">
                <span className="text-[10px] font-mono text-amber-300 block mb-1">VERIFIED BADGES</span>
                <span className="text-xl font-extrabold text-white font-mono block">{unlockedBadges.length} Earned</span>
                <span className="text-[11px] text-slate-400 mt-1 block">Algorithmic proof</span>
              </div>
            </div>

            {/* AI Executive Evaluation Narrative */}
            <div className="p-4 rounded-2xl bg-indigo-950/25 border border-indigo-500/20 space-y-2">
              <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Executive Architectural Synthesis</span>
              </h5>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Candidate <strong>@{profile.login}</strong> demonstrates deterministic code execution maturity with an overall potential score of <strong>{profile.potential_score}/100</strong>. Analysis of public repositories confirms strong patterns in <strong>{techStack.slice(0, 3).map(t => t.name).join(', ')}</strong>, with an emphasis on maintainable systems and consistent contribution cadence.
              </p>
            </div>

            {/* Verified Technical Stack */}
            <div className="space-y-2">
              <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Primary Verified Tech Stack</span>
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {techStack.slice(0, 4).map((tech) => (
                  <div key={tech.name} className="p-2.5 rounded-xl bg-black/30 border border-white/[0.05]">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-white truncate">{tech.name}</span>
                      <span className="text-slate-400 font-mono text-[10px]">{tech.percentage}%</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/[0.05]">
                      {tech.tier}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Flagship Repositories */}
            <div className="space-y-2">
              <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                <span>Flagship Repositories Evaluated</span>
              </h5>
              <div className="space-y-2">
                {repos.slice(0, 3).map((repo) => (
                  <div key={repo.id} className="p-3 rounded-xl bg-black/20 border border-white/[0.05] flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{repo.name}</span>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-500/20">
                          {repo.architecture_type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {repo.description || 'Public engineering codebase.'}
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
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-white/[0.08]">
              <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300 mb-2 flex items-center gap-1.5">
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
          <div className="px-4 sm:px-6 py-3.5 border-t border-white/[0.08] bg-[#080d1a] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 text-center sm:text-left">
              ⚡ 1-Click Executive Export • Verified GitHired Telemetry
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopyBriefing}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/[0.08] text-xs font-bold transition-all active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                <span>{copied ? 'Copied Briefing!' : 'Copy Summary'}</span>
              </button>

              <button
                onClick={handleExportPdf}
                disabled={isExporting}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:opacity-95 text-white text-xs font-extrabold shadow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
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

export default ExecutiveDossierModal;
