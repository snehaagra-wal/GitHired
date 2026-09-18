import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GitCompare, ArrowRight, Bot, Star, GitFork, 
  CheckCircle2, Layers, Trophy, ArrowUpRight, Zap 
} from 'lucide-react';
import { CandidateDossier, ComparisonVerdict } from '../types';
import { fetchDeveloperDossier } from '../services/githubService';

interface DeveloperComparisonProps {
  initialDev1?: string;
  initialDev2?: string;
}

export const DeveloperComparison: React.FC<DeveloperComparisonProps> = ({
  initialDev1 = 'shadcn',
  initialDev2 = 'leerob'
}) => {
  const [dev1User, setDev1User] = useState(initialDev1);
  const [dev2User, setDev2User] = useState(initialDev2);
  const [dossier1, setDossier1] = useState<CandidateDossier | null>(null);
  const [dossier2, setDossier2] = useState<CandidateDossier | null>(null);
  const [verdict, setVerdict] = useState<ComparisonVerdict | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeCompare = async (u1: string, u2: string) => {
    if (!u1.trim() || !u2.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const [d1, d2] = await Promise.all([
        fetchDeveloperDossier(u1.trim()),
        fetchDeveloperDossier(u2.trim())
      ]);
      setDossier1(d1);
      setDossier2(d2);

      // Generate head-to-head AI verdict
      const winnerName = d1.profile.potential_score >= d2.profile.potential_score ? d1.profile.name : d2.profile.name;
      const winnerLogin = d1.profile.potential_score >= d2.profile.potential_score ? d1.profile.login : d2.profile.login;

      setVerdict({
        winnerUsername: winnerLogin,
        headline: `${winnerName} displays higher overall architectural & ecosystem leverage.`,
        reasoning: `@${d1.profile.login} maintains an overall potential rating of ${d1.profile.potential_score}/100 with a ${d1.complexity.overallScore}% complexity index. Meanwhile, @${d2.profile.login} exhibits ${d2.profile.potential_score}/100 with strong traction in ${d2.techStack[0]?.name || 'modern web'}. Candidate @${winnerLogin} is best suited for complex architectural foundations and scaling high-throughput systems.`,
        advantageDev1: [
          `${d1.complexity.architectureDepth}/100 Architectural Depth Rating`,
          `${d1.profile.total_stars.toLocaleString()} Stars across public codebases`,
          `${d1.profile.active_streak_days}-day current commit streak`
        ],
        advantageDev2: [
          `${d2.complexity.codeHygiene}/100 Code Hygiene & Maintainability`,
          `${d2.profile.total_forks.toLocaleString()} Downstream forks & adoptions`,
          `${d2.techStack.length} Verified language ecosystems`
        ],
        roleRecommendation: {
          forDev1: `Principal Infrastructure Architect or Core Systems Lead`,
          forDev2: `Staff Product Engineer or Developer Experience Architect`
        }
      });
    } catch (err: any) {
      setError(err.message || 'Failed to compare candidates. Please verify both GitHub usernames.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* HEADER TITLE */}
      <div className="text-center max-w-3xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-3">
          <GitCompare className="w-3.5 h-3.5 text-cyan-400" />
          <span>BENCHMARK TALENT ARBITRAGE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Side-by-Side Developer Comparison
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2">
          Compare two engineers across verified repository complexity, open-source impact, tech stack mastery, and hiring potential.
        </p>
      </div>

      {/* DUAL USERNAME INPUTS BAR */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 shadow-xl max-w-4xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeCompare(dev1User, dev2User);
          }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          {/* Developer 1 input */}
          <div className="flex-1 w-full relative">
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block mb-1">
              Developer 1 (GitHub)
            </span>
            <input
              id="input-compare-dev1"
              type="text"
              value={dev1User}
              onChange={(e) => setDev1User(e.target.value)}
              placeholder="e.g. shadcn"
              className="w-full bg-black/50 border border-white/10 focus:border-indigo-500/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none font-mono"
            />
          </div>

          <div className="hidden sm:flex items-center justify-center pt-5">
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-mono font-bold">
              VS
            </span>
          </div>

          {/* Developer 2 input */}
          <div className="flex-1 w-full relative">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
              Developer 2 (GitHub)
            </span>
            <input
              id="input-compare-dev2"
              type="text"
              value={dev2User}
              onChange={(e) => setDev2User(e.target.value)}
              placeholder="e.g. leerob"
              className="w-full bg-black/50 border border-white/10 focus:border-cyan-500/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none font-mono"
            />
          </div>

          <div className="w-full sm:w-auto sm:pt-5">
            <button
              id="btn-run-comparison"
              type="submit"
              disabled={isLoading || !dev1User.trim() || !dev2User.trim()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Comparing...</span>
                </>
              ) : (
                <>
                  <span>Compare</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Preset quick test benchmarks */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5 text-xs text-slate-400">
          <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
            <Zap className="w-3 h-3 text-cyan-400" /> Quick Matchups:
          </span>
          <button
            onClick={() => {
              setDev1User('shadcn');
              setDev2User('gaearon');
              executeCompare('shadcn', 'gaearon');
            }}
            className="text-xs font-mono text-indigo-400 hover:underline"
          >
            @shadcn vs @gaearon
          </button>
          <span>•</span>
          <button
            onClick={() => {
              setDev1User('leerob');
              setDev2User('shadcn');
              executeCompare('leerob', 'shadcn');
            }}
            className="text-xs font-mono text-cyan-400 hover:underline"
          >
            @leerob vs @shadcn
          </button>
        </div>
      </div>

      {error && (
        <div className="max-w-4xl mx-auto p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono">
          {error}
        </div>
      )}

      {/* COMPARISON RESULTS VIEW */}
      {dossier1 && dossier2 && verdict && (
        <div className="space-y-8 max-w-6xl mx-auto">
          
          {/* AI HEAD-TO-HEAD VERDICT BANNER */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900/90 to-[#0c121d] border border-indigo-500/30 shadow-2xl relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-cyan-400">
                <Bot className="w-6 h-6" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
                    AI Talent Intelligence Verdict
                  </span>
                  <Trophy className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  {verdict.headline}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
                  {verdict.reasoning}
                </p>

                {/* Role Recommendations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
                  <div className="p-3 rounded-xl bg-black/30 border border-indigo-500/30">
                    <span className="font-bold text-indigo-400 block mb-0.5">
                      Best Placement for @{dossier1.profile.login}:
                    </span>
                    <span className="text-slate-300">{verdict.roleRecommendation.forDev1}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/30 border border-cyan-500/30">
                    <span className="font-bold text-cyan-400 block mb-0.5">
                      Best Placement for @{dossier2.profile.login}:
                    </span>
                    <span className="text-slate-300">{verdict.roleRecommendation.forDev2}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DUAL CANDIDATE CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* CANDIDATE 1 CARD - INDIGO ACCENT */}
            <div className="glass-card rounded-3xl p-6 border border-indigo-500/30 shadow-xl relative">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={dossier1.profile.avatar_url}
                  alt={dossier1.profile.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/40 bg-slate-900"
                />
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {dossier1.profile.name}
                    <a
                      href={dossier1.profile.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-indigo-400"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </h3>
                  <p className="text-xs text-indigo-400 font-mono">@{dossier1.profile.login}</p>
                  <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                    {dossier1.profile.seniority_level}
                  </span>
                </div>
              </div>

              {/* Score Metric */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 mb-6 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 block">Potential Score</span>
                  <span className="text-3xl font-black text-white font-mono glow-text-indigo">
                    {dossier1.profile.potential_score}
                  </span>
                  <span className="text-slate-500 text-xs font-mono"> / 100</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-slate-400 block">Complexity</span>
                  <span className="text-xl font-bold text-indigo-400 font-mono">
                    Grade {dossier1.complexity.grade} ({dossier1.complexity.overallScore}%)
                  </span>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="space-y-2 mb-6 text-xs">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Demonstrated Advantages:
                </span>
                {verdict.advantageDev1.map((adv, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span>{adv}</span>
                  </div>
                ))}
              </div>

              {/* Top Tech Stack */}
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                  Top Technologies:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {dossier1.techStack.slice(0, 4).map(t => (
                    <span key={t.name} className="px-2 py-0.5 rounded bg-slate-800 border border-white/5 text-[11px] font-mono text-slate-300">
                      {t.name} ({t.percentage}%)
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CANDIDATE 2 CARD - CYAN ACCENT */}
            <div className="glass-card rounded-3xl p-6 border border-cyan-500/30 shadow-xl relative">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={dossier2.profile.avatar_url}
                  alt={dossier2.profile.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/40 bg-slate-900"
                />
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {dossier2.profile.name}
                    <a
                      href={dossier2.profile.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-cyan-400"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </h3>
                  <p className="text-xs text-cyan-400 font-mono">@{dossier2.profile.login}</p>
                  <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                    {dossier2.profile.seniority_level}
                  </span>
                </div>
              </div>

              {/* Score Metric */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 mb-6 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 block">Potential Score</span>
                  <span className="text-3xl font-black text-white font-mono glow-text-cyan">
                    {dossier2.profile.potential_score}
                  </span>
                  <span className="text-slate-500 text-xs font-mono"> / 100</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-slate-400 block">Complexity</span>
                  <span className="text-xl font-bold text-cyan-400 font-mono">
                    Grade {dossier2.complexity.grade} ({dossier2.complexity.overallScore}%)
                  </span>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="space-y-2 mb-6 text-xs">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Demonstrated Advantages:
                </span>
                {verdict.advantageDev2.map((adv, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span>{adv}</span>
                  </div>
                ))}
              </div>

              {/* Top Tech Stack */}
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                  Top Technologies:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {dossier2.techStack.slice(0, 4).map(t => (
                    <span key={t.name} className="px-2 py-0.5 rounded bg-slate-800 border border-white/5 text-[11px] font-mono text-slate-300">
                      {t.name} ({t.percentage}%)
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* HEAD-TO-HEAD METRICS TABLE */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 overflow-x-auto">
            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Granular Telemetry Matrix
            </h4>
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="py-2.5 px-3">Metric Dimension</th>
                  <th className="py-2.5 px-3 text-indigo-400">@{dossier1.profile.login}</th>
                  <th className="py-2.5 px-3 text-cyan-400">@{dossier2.profile.login}</th>
                  <th className="py-2.5 px-3 text-right">Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="py-3 px-3 text-slate-300 font-sans">Open-Source Stars</td>
                  <td className="py-3 px-3 font-bold text-white">{dossier1.profile.total_stars.toLocaleString()}</td>
                  <td className="py-3 px-3 font-bold text-white">{dossier2.profile.total_stars.toLocaleString()}</td>
                  <td className={`py-3 px-3 text-right font-bold ${dossier1.profile.total_stars > dossier2.profile.total_stars ? 'text-indigo-400' : 'text-cyan-400'}`}>
                    {dossier1.profile.total_stars > dossier2.profile.total_stars ? `@${dossier1.profile.login}` : `@${dossier2.profile.login}`}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-slate-300 font-sans">Total Forks</td>
                  <td className="py-3 px-3 font-bold text-white">{dossier1.profile.total_forks.toLocaleString()}</td>
                  <td className="py-3 px-3 font-bold text-white">{dossier2.profile.total_forks.toLocaleString()}</td>
                  <td className={`py-3 px-3 text-right font-bold ${dossier1.profile.total_forks > dossier2.profile.total_forks ? 'text-indigo-400' : 'text-cyan-400'}`}>
                    {dossier1.profile.total_forks > dossier2.profile.total_forks ? `@${dossier1.profile.login}` : `@${dossier2.profile.login}`}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-slate-300 font-sans">Architecture Depth Score</td>
                  <td className="py-3 px-3 font-bold text-white">{dossier1.complexity.architectureDepth}/100</td>
                  <td className="py-3 px-3 font-bold text-white">{dossier2.complexity.architectureDepth}/100</td>
                  <td className={`py-3 px-3 text-right font-bold ${dossier1.complexity.architectureDepth > dossier2.complexity.architectureDepth ? 'text-indigo-400' : 'text-cyan-400'}`}>
                    {dossier1.complexity.architectureDepth > dossier2.complexity.architectureDepth ? `@${dossier1.profile.login}` : `@${dossier2.profile.login}`}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-slate-300 font-sans">Code Hygiene Index</td>
                  <td className="py-3 px-3 font-bold text-white">{dossier1.complexity.codeHygiene}/100</td>
                  <td className="py-3 px-3 font-bold text-white">{dossier2.complexity.codeHygiene}/100</td>
                  <td className={`py-3 px-3 text-right font-bold ${dossier1.complexity.codeHygiene > dossier2.complexity.codeHygiene ? 'text-indigo-400' : 'text-cyan-400'}`}>
                    {dossier1.complexity.codeHygiene > dossier2.complexity.codeHygiene ? `@${dossier1.profile.login}` : `@${dossier2.profile.login}`}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-slate-300 font-sans">Active Commit Streak</td>
                  <td className="py-3 px-3 font-bold text-white">{dossier1.profile.active_streak_days} Days</td>
                  <td className="py-3 px-3 font-bold text-white">{dossier2.profile.active_streak_days} Days</td>
                  <td className={`py-3 px-3 text-right font-bold ${dossier1.profile.active_streak_days > dossier2.profile.active_streak_days ? 'text-indigo-400' : 'text-cyan-400'}`}>
                    {dossier1.profile.active_streak_days > dossier2.profile.active_streak_days ? `@${dossier1.profile.login}` : `@${dossier2.profile.login}`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      )}
    </motion.div>
  );
};
