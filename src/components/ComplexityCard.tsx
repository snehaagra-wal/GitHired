import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Layers, ShieldCheck, CheckCircle2, GitFork, Star } from 'lucide-react';
import { CodeComplexity } from '../types';

interface ComplexityCardProps {
  complexity: CodeComplexity;
  totalStars: number;
  totalForks: number;
  repoCount: number;
}

export const ComplexityCard: React.FC<ComplexityCardProps> = ({
  complexity,
  totalStars,
  totalForks,
  repoCount
}) => {
  const factors = [
    {
      name: 'Architectural Depth',
      score: complexity.architectureDepth,
      icon: Layers,
      color: 'from-indigo-600 via-indigo-500 to-cyan-400',
      description: 'Multi-tiered abstractions, modular packaging & domain boundaries'
    },
    {
      name: 'Code Hygiene & Modularity',
      score: complexity.codeHygiene,
      icon: ShieldCheck,
      color: 'from-cyan-500 to-sky-400',
      description: 'Clean dependency trees, typing discipline & branch workflows'
    },
    {
      name: 'Maintainability Index',
      score: complexity.maintainability,
      icon: CheckCircle2,
      color: 'from-purple-600 to-indigo-400',
      description: 'Issue resolution velocity, semantic releases & API stability'
    },
    {
      name: 'Ecosystem & Open Source Impact',
      score: complexity.ecosystemImpact,
      icon: Star,
      color: 'from-sky-500 to-indigo-400',
      description: 'Community adoption ratio, downstream packaging & forks'
    }
  ];

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200/90 dark:border-white/10 shadow-xl relative overflow-hidden transition-colors">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-300">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
              Code Complexity & Architecture
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Algorithmic synthesis across {repoCount} repositories
            </p>
          </div>
        </div>

        {/* Grade Badge */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-200 font-mono font-black text-base shadow-sm">
            Grade {complexity.grade}
          </div>
        </div>
      </div>

      {/* Main Score Hero Bar */}
      <div className="p-4 rounded-xl bg-slate-100/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Overall Code Complexity Score
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight font-mono glow-text-indigo">
              {complexity.overallScore}
            </span>
            <span className="text-slate-400 text-sm font-mono">/ 100</span>
            <span className="ml-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/25">
              {complexity.overallScore >= 90 ? 'Top 1% Percentile' : 'Top 5% Percentile'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-white/10 pt-3 sm:pt-0 sm:pl-6">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span>{totalStars.toLocaleString()} Stars</span>
          </div>
          <div className="flex items-center gap-1.5">
            <GitFork className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>{totalForks.toLocaleString()} Forks</span>
          </div>
        </div>
      </div>

      {/* Progress Bars for Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {factors.map((factor, idx) => {
          const Icon = factor.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {factor.name}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-300">
                  {factor.score}%
                </span>
              </div>

              {/* Progress track */}
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800/80 rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${factor.score}%` }}
                  transition={{ duration: 0.8, delay: 0.1 * idx, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r ${factor.color} rounded-full`}
                />
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                {factor.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Summary note */}
      <p className="mt-5 text-xs text-slate-600 dark:text-slate-300 italic bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/20 p-3.5 rounded-xl leading-relaxed">
        💡 <strong className="text-slate-900 dark:text-slate-200 not-italic">Intelligence Synthesis:</strong> {complexity.summary}
      </p>
    </div>
  );
};
