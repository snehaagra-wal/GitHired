import React from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle, Star, FolderGit2 } from 'lucide-react';
import { VerifiedSkill } from '../types';

interface VerifiedSkillsProps {
  skills: VerifiedSkill[];
}

export const VerifiedSkills: React.FC<VerifiedSkillsProps> = ({ skills }) => {
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 border border-white/[0.08] relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/25 text-cyan-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Verified Technical Competencies
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Empirical skills backed by repository codebases and community usage
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/25 text-cyan-300 text-xs font-mono flex-shrink-0">
          <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>EMPIRICAL PROOF</span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {skills.map((skill) => (
          <motion.div
            key={skill.id}
            whileHover={{ y: -2 }}
            className="p-3.5 sm:p-4 rounded-xl bg-black/20 border border-white/[0.06] hover:border-indigo-500/30 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Card Top Pill Row */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-white/[0.05]">
                  {skill.category}
                </span>

                <span className="text-[10px] sm:text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                  {skill.level}
                </span>
              </div>

              {/* Skill Title */}
              <h4 className="text-sm sm:text-base font-bold text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
                {skill.name}
              </h4>

              {/* Proof Text */}
              <p className="text-xs text-slate-400 leading-relaxed mb-3 sm:mb-4">
                {skill.proofText}
              </p>
            </div>

            {/* Evidence Footer */}
            <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.05] text-[10px] sm:text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Star className="w-3.5 h-3.5" />
                <span>{skill.starsBacking.toLocaleString()} Stars</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-400">
                <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{skill.reposCount} Repos</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default VerifiedSkills;
