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
      color: 'from-indigo-500 to-cyan-400',
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
      color: 'from-purple-500 to-indigo-400',
      description: 'Issue resolution velocity, semantic releases & API stability'
    },
    {
      name: 'Ecosystem & Impact',
      score: complexity.ecosystemImpact,
      icon: Star,
      color: 'from-sky-500 to-indigo-400',
      description: 'Community adoption ratio, downstream packaging & forks'
    }
  ];

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 border border-white/[0.08] relative overflow-hidden">
      <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-300">
            <Cpu className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Code Complexity & Architecture
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Algorithmic synthesis across {repoCount} repositories
            </p>
          </div>
        </div>

        {/* Grade Badge */}
        <div className="px-3 py-1 rounded-xl bg-indigo-950/80 border border-indigo-500/30 text-cyan-300 font-mono font-bold text-sm shadow-sm flex-shrink-0">
          Grade {complexity.grade}
        </div>
      </div>

      {/* Main Score Hero Bar */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-black/30 border border-white/[0.05] mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Overall Code Complexity Score
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono glow-text-indigo">
              {complexity.overallScore}
            </span>
            <span className="text-slate-400 text-xs sm:text-sm font-mono">/ 100</span>
            <span className="ml-1 sm:ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
              {complexity.overallScore >= 90 ? 'Top 1% Percentile' : 'Top 5% Percentile'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono text-slate-400 border-t sm:border-t-0 sm:border-l border-white/[0.08] pt-2.5 sm:pt-0 sm:pl-5">
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>{totalStars.toLocaleString()} Stars</span>
          </div>
          <div className="flex items-center gap-1.5">
            <GitFork className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span>{totalForks.toLocaleString()} Forks</span>
          </div>
        </div>
      </div>

      {/* Progress Bars for Factors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
        {factors.map((factor, idx) => {
          const Icon = factor.icon;
          return (
            <div
              key={idx}
              className="p-3 sm:p-3.5 rounded-xl bg-black/20 border border-white/[0.05] hover:border-white/[0.1] transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Icon className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    {factor.name}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-300">
                  {factor.score}%
                </span>
              </div>

              {/* Progress track */}
              <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden mb-1.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${factor.score}%` }}
                  transition={{ duration: 0.8, delay: 0.1 * idx, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r ${factor.color} rounded-full`}
                />
              </div>

              <p className="text-[11px] text-slate-400 leading-tight">
                {factor.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Summary note */}
      <p className="mt-4 sm:mt-5 text-xs text-slate-300 bg-indigo-950/30 border border-indigo-500/20 p-3 sm:p-3.5 rounded-xl leading-relaxed">
        💡 <strong className="text-white not-italic">Intelligence Synthesis:</strong> {complexity.summary}
      </p>
    </div>
  );
};

export default ComplexityCard;
