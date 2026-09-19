import React from 'react';
import { motion } from 'framer-motion';
import { Code2, FolderGit2 } from 'lucide-react';
import { TechStackItem } from '../types';

interface TechStackCardProps {
  techStack: TechStackItem[];
}

export const TechStackCard: React.FC<TechStackCardProps> = ({ techStack }) => {
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 border border-white/[0.08] relative overflow-hidden">
      
      {/* Card Header */}
      <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/25 text-cyan-400">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Technology Stack Distribution
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Byte-weighted code volume across public repositories
            </p>
          </div>
        </div>

        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-white/[0.08] flex-shrink-0">
          {techStack.length} Languages
        </span>
      </div>

      {/* Multi-segment Progress Bar */}
      <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-800/60 mb-5 sm:mb-6 p-0.5 gap-0.5 border border-white/[0.05]">
        {techStack.map((tech, idx) => (
          <motion.div
            key={idx}
            initial={{ width: 0 }}
            animate={{ width: `${tech.percentage}%` }}
            transition={{ duration: 0.8, delay: 0.05 * idx }}
            style={{ backgroundColor: tech.color }}
            className="h-full rounded-full transition-all cursor-pointer hover:opacity-85"
            title={`${tech.name}: ${tech.percentage}%`}
          />
        ))}
      </div>

      {/* Grid of Technologies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        {techStack.map((tech, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -1 }}
            className="p-3 rounded-xl bg-black/20 border border-white/[0.05] hover:border-white/[0.1] flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm"
                style={{ backgroundColor: tech.color }}
              />
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-semibold text-slate-200 block truncate">
                  {tech.name}
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <FolderGit2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  {tech.repoCount} {tech.repoCount === 1 ? 'repo' : 'repos'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={`text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono ${
                  tech.tier === 'Mastery'
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25'
                    : tech.tier === 'Proficient'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/25'
                    : 'bg-slate-800 text-slate-400 border border-white/[0.05]'
                }`}
              >
                {tech.tier}
              </span>
              <span className="text-xs sm:text-sm font-mono font-bold text-white min-w-[32px] text-right">
                {tech.percentage}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default TechStackCard;
