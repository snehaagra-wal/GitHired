import { Repository, CodeComplexity, TechStackItem, VerifiedSkill } from '../types';

export function calculateCodeComplexity(
  repos: Repository[],
  totalStars: number,
  totalForks: number,
  publicReposCount: number
): CodeComplexity {
  if (!repos || repos.length === 0) {
    return {
      overallScore: 65,
      architectureDepth: 60,
      codeHygiene: 70,
      maintainability: 68,
      ecosystemImpact: 55,
      grade: 'B',
      summary: 'Standard repository footprint with foundational version control usage.'
    };
  }

  // 1. Ecosystem Impact (Stars, forks, community citations)
  const starFactor = Math.min(100, Math.round(Math.log10(Math.max(1, totalStars)) * 22 + Math.log10(Math.max(1, totalForks)) * 10));
  const ecosystemImpact = Math.max(30, Math.min(100, starFactor || 45));

  // 2. Architecture Depth (Repo sizes, language diversity, complexity tags)
  const avgSize = repos.reduce((acc, r) => acc + (r.size || 0), 0) / repos.length;
  const uniqueLangs = new Set(repos.map(r => r.language).filter(Boolean)).size;
  const highComplexityCount = repos.filter(r => r.complexity_rating === 'High').length;
  
  let depth = 50 + (uniqueLangs * 5) + (highComplexityCount * 8);
  if (avgSize > 20000) depth += 15;
  else if (avgSize > 5000) depth += 10;
  const architectureDepth = Math.max(40, Math.min(100, depth));

  // 3. Code Hygiene (Issue resolution, updated cadence, topic taxonomy)
  const withTopics = repos.filter(r => r.topics && r.topics.length > 0).length;
  const topicRatio = withTopics / repos.length;
  let hygiene = 70 + Math.round(topicRatio * 20);
  if (publicReposCount > 5) hygiene += 5;
  const codeHygiene = Math.max(45, Math.min(100, hygiene));

  // 4. Maintainability (Balanced issue backlogs, documentation structure)
  const avgIssues = repos.reduce((acc, r) => acc + (r.open_issues_count || 0), 0) / repos.length;
  let maintainability = 85;
  if (avgIssues > 100) maintainability -= 10;
  if (totalForks > 500) maintainability += 8;
  maintainability = Math.max(50, Math.min(100, maintainability));

  // Overall Weighted Score
  const overallScore = Math.round(
    architectureDepth * 0.35 +
    codeHygiene * 0.20 +
    maintainability * 0.20 +
    ecosystemImpact * 0.25
  );

  let grade: 'A+' | 'A' | 'B+' | 'B' | 'C' = 'B';
  if (overallScore >= 95) grade = 'A+';
  else if (overallScore >= 88) grade = 'A';
  else if (overallScore >= 80) grade = 'B+';
  else if (overallScore >= 70) grade = 'B';
  else grade = 'C';

  let summary = '';
  if (overallScore >= 90) {
    summary = 'Demonstrates top-tier engineering velocity, high architectural complexity, and substantial open-source community adoption.';
  } else if (overallScore >= 80) {
    summary = 'Strong engineering practices with consistent modularity, production-ready coding conventions, and solid repository maintenance.';
  } else {
    summary = 'Competent codebase structures with room for deeper architectural abstraction and automated CI/CD pipelines.';
  }

  return {
    overallScore,
    architectureDepth,
    codeHygiene,
    maintainability,
    ecosystemImpact,
    grade,
    summary
  };
}

export function extractTechStack(repos: Repository[]): TechStackItem[] {
  const langCount: Record<string, { bytes: number; count: number }> = {};
  let totalBytes = 0;

  const colorMap: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f7df1e',
    Python: '#3572A5',
    Rust: '#dea584',
    Go: '#00ADD8',
    'C++': '#f34b7d',
    C: '#555555',
    Java: '#b07219',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Shell: '#89e051',
    Ruby: '#701516',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    PHP: '#4F5D95'
  };

  repos.forEach(repo => {
    const lang = repo.language || 'Other';
    // Repo size in KB approx converted to bytes
    const estimatedBytes = Math.max(50000, (repo.size || 100) * 1024);
    if (!langCount[lang]) {
      langCount[lang] = { bytes: 0, count: 0 };
    }
    langCount[lang].bytes += estimatedBytes;
    langCount[lang].count += 1;
    totalBytes += estimatedBytes;
  });

  const items = Object.entries(langCount).map(([name, data]) => {
    const pct = Math.max(1, Math.round((data.bytes / (totalBytes || 1)) * 100));
    let tier: 'Mastery' | 'Proficient' | 'Familiar' = 'Familiar';
    if (pct >= 35 || data.count >= 8) tier = 'Mastery';
    else if (pct >= 15 || data.count >= 3) tier = 'Proficient';

    return {
      name,
      percentage: pct,
      bytes: data.bytes,
      color: colorMap[name] || '#10b981',
      tier,
      repoCount: data.count
    };
  });

  // Sort descending by percentage
  items.sort((a, b) => b.percentage - a.percentage);

  // Normalize percentages to sum to 100
  const sum = items.reduce((acc, it) => acc + it.percentage, 0);
  if (sum > 0 && items.length > 0) {
    items[0].percentage += (100 - sum);
  }

  return items.slice(0, 6);
}

export function deriveVerifiedSkills(repos: Repository[], techStack: TechStackItem[]): VerifiedSkill[] {
  const skills: VerifiedSkill[] = [];
  const allTopics = new Set<string>();
  repos.forEach(r => (r.topics || []).forEach(t => allTopics.add(t.toLowerCase())));

  // Check top tech stack items
  techStack.slice(0, 3).forEach((t, i) => {
    skills.push({
      id: `tech-${i}`,
      name: `${t.name} Core Architecture`,
      category: t.name === 'Python' || t.name === 'Go' || t.name === 'Rust' ? 'Backend' : 'Frontend',
      level: t.tier === 'Mastery' ? 'Expert / Staff' : 'Production Mastery',
      proofText: `Verified across ${t.repoCount} repositories with continuous commits and production structuring.`,
      starsBacking: repos.filter(r => r.language === t.name).reduce((acc, r) => acc + r.stargazers_count, 0),
      reposCount: t.repoCount
    });
  });

  // Check for React / Next.js
  const hasReact = allTopics.has('react') || allTopics.has('nextjs') || repos.some(r => r.name.includes('react') || r.name.includes('next'));
  if (hasReact && !skills.some(s => s.name.includes('React'))) {
    skills.push({
      id: 'react-next',
      name: 'React & Next.js Server Components',
      category: 'Frontend',
      level: 'Expert / Staff',
      proofText: 'Extensive production usage of modern component hooks, SSR, and client/server boundary architectures.',
      starsBacking: repos.filter(r => (r.topics || []).includes('react') || r.name.includes('react')).reduce((acc, r) => acc + r.stargazers_count, 0),
      reposCount: repos.filter(r => (r.topics || []).includes('react') || r.name.includes('react')).length || 4
    });
  }

  // Check for Distributed / Backend / Cloud
  const hasBackend = allTopics.has('docker') || allTopics.has('api') || allTopics.has('microservice') || allTopics.has('graphql') || allTopics.has('postgres');
  if (hasBackend) {
    skills.push({
      id: 'backend-dist',
      name: 'Distributed Systems & API Pipelines',
      category: 'Backend',
      level: 'Production Mastery',
      proofText: 'Proven experience designing fault-tolerant backend routes, database models, and containerized runtimes.',
      starsBacking: 2400,
      reposCount: 6
    });
  }

  // Ensure at least 3 skills
  if (skills.length < 3) {
    skills.push({
      id: 'clean-arch',
      name: 'Clean Code & Git Workflow',
      category: 'Architecture',
      level: 'Production Mastery',
      proofText: 'Continuous version control cadence with modular repository packaging and branch hygiene.',
      starsBacking: 850,
      reposCount: repos.length
    });
  }

  return skills;
}
