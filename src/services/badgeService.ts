import { CandidateDossier, SkillBadge } from '../types';

export function evaluateSkillBadges(dossier: CandidateDossier): SkillBadge[] {
  const { profile, complexity, techStack, commitHeatmap } = dossier;

  const badges: SkillBadge[] = [
    {
      id: 'open-source-master',
      title: 'Open Source Master',
      tier: 'Diamond',
      category: 'Ecosystem',
      icon: 'Trophy',
      description: 'Maintains viral software libraries used by millions of global developers.',
      criteria: 'Over 5,000 GitHub stars or 1,000 forks across public codebases.',
      unlocked: profile.total_stars >= 5000 || profile.total_forks >= 1000
    },
    {
      id: 'elite-contributor',
      title: 'Elite Contributor',
      tier: 'Platinum',
      category: 'Ecosystem',
      icon: 'Star',
      description: 'Exceptional open source traction and trusted developer influence.',
      criteria: 'More than 500 stars and strong public follower adoption.',
      unlocked: profile.total_stars >= 500 || profile.followers >= 500
    },
    {
      id: 'architecture-mastermind',
      title: 'Architecture Mastermind',
      tier: 'Diamond',
      category: 'Architecture',
      icon: 'Layers',
      description: 'Designs multi-tiered domain boundaries with deep architectural complexity.',
      criteria: 'Architecture Depth index score of 90/100 or higher.',
      unlocked: complexity.architectureDepth >= 90
    },
    {
      id: 'consistent-coder',
      title: 'Consistent Coder',
      tier: 'Gold',
      category: 'Consistency',
      icon: 'Flame',
      description: 'Continuous daily shipping cadence with long contribution streaks.',
      criteria: 'Active commit streak of 20+ days and over 500 commits in 12 months.',
      unlocked: profile.active_streak_days >= 20 || commitHeatmap.totalCommitsLastYear >= 500
    },
    {
      id: 'clean-code-virtuoso',
      title: 'Clean Code Virtuoso',
      tier: 'Gold',
      category: 'Hygiene',
      icon: 'ShieldCheck',
      description: 'Impeccable codebase hygiene, typing discipline, and maintainable APIs.',
      criteria: 'Code Hygiene rating exceeding 90/100.',
      unlocked: complexity.codeHygiene >= 90
    },
    {
      id: 'polyglot-craftsman',
      title: 'Polyglot Craftsman',
      tier: 'Silver',
      category: 'Velocity',
      icon: 'Code2',
      description: 'Production mastery spanning diverse languages and paradigms.',
      criteria: 'Demonstrated repositories across 3 or more distinct languages.',
      unlocked: techStack.length >= 3
    },
    {
      id: 'velocity-champion',
      title: 'Velocity Champion',
      tier: 'Platinum',
      category: 'Velocity',
      icon: 'Zap',
      description: 'High-frequency output across both open issues and pull requests.',
      criteria: 'Overall talent potential score of 88/100 or higher.',
      unlocked: profile.potential_score >= 88
    }
  ];

  return badges;
}
