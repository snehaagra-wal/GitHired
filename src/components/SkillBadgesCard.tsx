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
        return 'border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 via-slate-900/80 to-slate-900/90 text-cyan-300';
      case 'Platinum':
        return 'border-purple-500/30 bg-gradient-to-br from-purple-950/30 via-slate-900/80 to-slate-900/90 text-purple-300';
      case 'Gold':
        return 'border-amber-500/30 bg-gradient-to-br from-amber-950/25 via-slate-900/80 to-slate-900/90 text-amber-300';
      default:
        return 'border-white/[0.08] bg-slate-900/50 text-slate-300';
    }
  };

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 border border-white/[0.08] relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Automated Skill Badges & Achievements
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Algorithmic verification across open-source scale, code hygiene & commit cadence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-300">
            {unlockedCount} / {badges.length} Unlocked
          </span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
        {badges.map((badge) => {
          const isUnlocked = badge.unlocked;
          return (
            <motion.div
              key={badge.id}
              whileHover={{ y: -2 }}
              className={`p-3.5 sm:p-4 rounded-xl border flex flex-col justify-between transition-all ${
                isUnlocked
                  ? getTierBadgeStyle(badge.tier)
                  : 'border-white/[0.04] bg-black/20 text-slate-500 opacity-60'
              }`}
            >
              <div>
                {/* Top Row: Tier and Status */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-black/40 border border-white/[0.08] font-bold text-slate-200">
                    {badge.tier} Tier
                  </span>

                  <span className="text-[11px] font-mono flex items-center gap-1">
                    {isUnlocked ? (
                      <span className="text-cyan-400 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                      </span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Locked
                      </span>
                    )}
                  </span>
                </div>

                {/* Badge Icon & Title */}
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className={`p-1.5 rounded-lg bg-black/30 border border-white/[0.08] ${isUnlocked ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {getIcon(badge.icon)}
                  </div>
                  <h4 className={`text-sm font-bold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                    {badge.title}
                  </h4>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {badge.description}
                </p>
              </div>

              {/* Requirement footer */}
              <div className="pt-2 border-t border-white/[0.05] text-[10px] font-mono text-slate-400">
                Criteria: {badge.criteria}
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};

export default SkillBadgesCard;
