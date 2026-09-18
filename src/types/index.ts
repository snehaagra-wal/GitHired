export interface DeveloperProfile {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  html_url: string;

  // Calculated Talent Intelligence Metrics
  total_stars: number;
  total_forks: number;
  potential_score: number; // 0 - 100
  seniority_level: 'Principal / Architect' | 'Staff / Lead' | 'Senior Engineer' | 'Mid-Level Engineer' | 'Rising Specialist';
  recommendation_status: 'Strong Hire' | 'Consider / Hire' | 'Further Technical Screen';
  verified_badge?: string;
  lines_of_code_est: number;
  active_streak_days: number;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  size: number;
  updated_at: string;
  open_issues_count: number;
  complexity_rating: 'High' | 'Medium' | 'Standard';
  architecture_type: string;
  is_fork?: boolean;
}

export interface CodeComplexity {
  overallScore: number; // 0 - 100
  architectureDepth: number; // 0 - 100
  codeHygiene: number; // 0 - 100
  maintainability: number; // 0 - 100
  ecosystemImpact: number; // 0 - 100
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C';
  summary: string;
}

export interface TechStackItem {
  name: string;
  percentage: number;
  bytes: number;
  color: string;
  tier: 'Mastery' | 'Proficient' | 'Familiar';
  repoCount: number;
}

export interface VerifiedSkill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'DevOps & Cloud' | 'Systems & Core' | 'Architecture';
  level: 'Expert / Staff' | 'Production Mastery' | 'Proficient';
  proofText: string;
  starsBacking: number;
  reposCount: number;
}

export interface CommitDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface CommitHeatmapData {
  weeks: { days: CommitDay[] }[];
  totalCommitsLastYear: number;
  longestStreak: number;
  currentStreak: number;
  peakDay: { date: string; count: number };
}

export interface AiMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  citations?: { repoName: string; reason: string }[];
  isThinking?: boolean;
}


export interface ComparisonVerdict {
  winnerUsername: string;
  headline: string;
  reasoning: string;
  roleRecommendation: {
    forDev1: string;
    forDev2: string;
  };
  advantageDev1: string[];
  advantageDev2: string[];
}

export interface SkillBadge {
  id: string;
  title: string;
  tier: 'Diamond' | 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  category: 'Ecosystem' | 'Velocity' | 'Architecture' | 'Consistency' | 'Hygiene';
  icon: string;
  description: string;
  criteria: string;
  unlocked: boolean;
  scoreRequirement?: number;
}

export interface DirectChatMessage {
  id: string;
  sender: 'recruiter' | 'candidate';
  senderName: string;
  text: string;
  timestamp: string;
  isRead?: boolean;
}

export interface CandidateDossier {
  profile: DeveloperProfile;
  repos: Repository[];
  complexity: CodeComplexity;
  techStack: TechStackItem[];
  verifiedSkills: VerifiedSkill[];
  commitHeatmap: CommitHeatmapData;
  badges?: SkillBadge[];
}
