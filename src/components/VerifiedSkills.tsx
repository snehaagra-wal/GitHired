import React from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle, Star, FolderGit2 } from 'lucide-react';
import { VerifiedSkill } from '../types';

interface VerifiedSkillsProps {
  skills: VerifiedSkill[];
}

export const VerifiedSkills: React.FC<VerifiedSkillsProps> = ({ skills }) => {
  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200/90 dark:border-white/10 shadow-xl relative overflow-hidden transition-colors">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-300">
            <Award className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-950 dark:text-white tracking-tight">
              Verified Technical Competencies
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Empirical skills backed by repository codebases and community usage
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-cyan-300 text-xs font-mono">
          <CheckCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
          <span>100% EMPIRICAL PROOF</span>
        </div>
      </div>

      {/* Cards Grid with Framer Motion Scale Hover */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => (
          <motion.div
            key={skill.id}
            whileHover={{ scale: 1.02, y: -3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="p-4 rounded-xl bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-950/90 border border-slate-200/90 dark:border-white/10 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10 transition-all flex flex-col justify-between cursor-pointer group shadow-sm dark:shadow-none"
          >
            <div>
              {/* Card Top Pill Row */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5">
                  {skill.category}
                </span>

                <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/25 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/25 transition-colors">
                  {skill.level}
                </span>
              </div>

              {/* Skill Title */}
              <h4 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-cyan-300 transition-colors">
                {skill.name}
              </h4>

              {/* Proof Text */}
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {skill.proofText}
              </p>
            </div>

            {/* Evidence Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5 text-amber-500 dark:text-amber-300">
                <Star className="w-3.5 h-3.5" />
                <span>{skill.starsBacking.toLocaleString()} Stars Backing</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <FolderGit2 className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                <span>{skill.reposCount} Active Repos</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};
