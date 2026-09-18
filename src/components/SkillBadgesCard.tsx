import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Star, Layers, Flame, ShieldCheck, 
  Code2, Zap, Award, Lock, CheckCircle2 
} from 'lucide-react';
import { SkillBadge } from '../types';

interface SkillBadgesCardProps {
  badges: SkillBadge[];
}

export const SkillBadgesCard: React.FC<SkillBadgesCardProps> = ({ badges }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trophy': return <Trophy className="w-4 h-4" />;
      case 'Star': return <Star className="w-4 h-4" />;
      case 'Layers': return <Layers className="w-4 h-4" />;
      case 'Flame': return <Flame className="w-4 h-4" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4" />;
      case 'Code2': return <Code2 className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const getTierBadgeStyle = (tier: SkillBadge['tier']) => {
    switch (tier) {
      case 'Diamond':
        return 'border-cyan-300 dark:border-cyan-400/50 bg-gradient-to-br from-cyan-50 via-indigo-50/50 to-white dark:from-cyan-950/50 dark:via-indigo-950/40 dark:to-slate-900/90 text-cyan-800 dark:text-cyan-300 shadow-md dark:shadow-lg dark:shadow-cyan-500/15';
      case 'Platinum':
        return 'border-purple-200 dark:border-purple-400/40 bg-gradient-to-br from-purple-50 via-slate-50 to-white dark:from-purple-950/40 dark:via-slate-900/90 dark:to-black/60 text-purple-800 dark:text-purple-300 shadow-md dark:shadow-purple-500/10';
      case 'Gold':
        return 'border-amber-200 dark:border-amber-400/40 bg-gradient-to-br from-amber-50 via-orange-50/50 to-white dark:from-amber-950/30 dark:via-slate-900/90 dark:to-black/60 text-amber-800 dark:text-amber-300 shadow-md dark:shadow-amber-500/10';
      default:
        return 'border-slate-200 dark:border-slate-500/30 bg-slate-50 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300';
    }
  };

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200/90 dark:border-white/10 shadow-xl relative overflow-hidden transition-colors">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
              Automated Skill Badges & Achievements
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Algorithmic verification across open-source scale, code hygiene & commit cadence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300">
            {unlockedCount} / {badges.length} Unlocked
          </span>
        </div>
      </div>

      {/* Badges Grid with interactive hover effect */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {badges.map((badge) => {
          const isUnlocked = badge.unlocked;
          return (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.025, y: -2 }}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                isUnlocked
                  ? getTierBadgeStyle(badge.tier)
                  : 'border-slate-200 dark:border-white/5 bg-slate-100/60 dark:bg-black/20 text-slate-400 dark:text-slate-600 opacity-60'
              }`}
            >
              <div>
                {/* Top Row: Tier and Status */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/70 dark:bg-black/40 border border-slate-200 dark:border-white/10 font-bold text-slate-700 dark:text-white">
                    {badge.tier} Tier
                  </span>

                  <span className="text-[11px] font-mono flex items-center gap-1">
                    {isUnlocked ? (
                      <span className="text-indigo-600 dark:text-cyan-400 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Locked
                      </span>
                    )}
                  </span>
                </div>

                {/* Badge Icon & Title */}
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`p-2 rounded-lg bg-white/70 dark:bg-black/30 border border-slate-200 dark:border-white/10 ${isUnlocked ? 'text-indigo-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-600'}`}>
                    {getIcon(badge.icon)}
                  </div>
                  <h4 className={`text-sm font-bold ${isUnlocked ? 'text-slate-950 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                    {badge.title}
                  </h4>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  {badge.description}
                </p>
              </div>

              {/* Requirement footer */}
              <div className="pt-2.5 border-t border-slate-200/80 dark:border-white/5 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                Criteria: {badge.criteria}
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
