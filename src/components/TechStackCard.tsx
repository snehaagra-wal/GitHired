import React from 'react';
import { motion } from 'framer-motion';
import { Code2, FolderGit2 } from 'lucide-react';
import { TechStackItem } from '../types';

interface TechStackCardProps {
  techStack: TechStackItem[];
}

export const TechStackCard: React.FC<TechStackCardProps> = ({ techStack }) => {
  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200/90 dark:border-white/10 shadow-xl relative overflow-hidden transition-colors">
      
      {/* Card Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-950 dark:text-white tracking-tight">
              Technology Stack Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Byte-weighted code volume across public repositories
            </p>
          </div>
        </div>

        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
          {techStack.length} Verified Languages
        </span>
      </div>

      {/* Multi-segment Progress Bar */}
      <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-800/80 mb-6 p-0.5 gap-0.5 border border-slate-200 dark:border-white/5">
        {techStack.map((tech, idx) => (
          <motion.div
            key={idx}
            initial={{ width: 0 }}
            animate={{ width: `${tech.percentage}%` }}
            transition={{ duration: 0.8, delay: 0.05 * idx }}
            style={{ backgroundColor: tech.color }}
            className="h-full rounded-full transition-all cursor-pointer hover:opacity-80"
            title={`${tech.name}: ${tech.percentage}%`}
          />
        ))}
      </div>

      {/* Grid of Technologies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {techStack.map((tech, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02, y: -1 }}
            className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15 flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-2.5">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                style={{ backgroundColor: tech.color }}
              />
              <div>
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-200 block">
                  {tech.name}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                  <FolderGit2 className="w-3 h-3 text-slate-400" />
                  {tech.repoCount} {tech.repoCount === 1 ? 'repo' : 'repos'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono ${
                  tech.tier === 'Mastery'
                    ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30'
                    : tech.tier === 'Proficient'
                    ? 'bg-cyan-50 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5'
                }`}
              >
                {tech.tier}
              </span>
              <span className="text-xs sm:text-sm font-mono font-bold text-slate-950 dark:text-white min-w-[36px] text-right">
                {tech.percentage}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};
