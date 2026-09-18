import { CandidateDossier, CommitHeatmapData, CommitDay } from '../types';

export function generateRealisticHeatmap(baseFrequency = 0.75): CommitHeatmapData {
  const weeks: { days: CommitDay[] }[] = [];
  const today = new Date();
  let totalCommitsLastYear = 0;
  let currentStreak = 0;
  let longestStreak = 0;
  let runningStreak = 0;
  let peakDay = { date: '', count: 0 };

  // Generate 52 weeks (364 days)
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 52 * 7 + 1);

  for (let w = 0; w < 52; w++) {
    const days: CommitDay[] = [];
    for (let d = 0; d < 7; d++) {
      const curDate = new Date(startDate);
      curDate.setDate(startDate.getDate() + (w * 7 + d));
      const dateStr = curDate.toISOString().split('T')[0];

      // Weekend vs weekday probability
      const isWeekend = d === 0 || d === 6;
      const prob = isWeekend ? baseFrequency * 0.4 : baseFrequency;
      const hasCommits = Math.random() < prob;

      let count = 0;
      let level: 0 | 1 | 2 | 3 | 4 = 0;

      if (hasCommits) {
        const rand = Math.random();
        if (rand > 0.85) {
          count = Math.floor(Math.random() * 8) + 9; // 9-16
          level = 4;
        } else if (rand > 0.6) {
          count = Math.floor(Math.random() * 5) + 5; // 5-9
          level = 3;
        } else if (rand > 0.3) {
          count = Math.floor(Math.random() * 3) + 2; // 2-4
          level = 2;
        } else {
          count = 1;
          level = 1;
        }
        totalCommitsLastYear += count;
        runningStreak++;
        if (runningStreak > longestStreak) longestStreak = runningStreak;
      } else {
        runningStreak = 0;
      }

      if (count > peakDay.count) {
        peakDay = { date: dateStr, count };
      }

      days.push({ date: dateStr, count, level });
    }
    weeks.push({ days });
  }

  // Calculate current streak from last days
  let revCount = 0;
  for (let w = 51; w >= 0; w--) {
    for (let d = 6; d >= 0; d--) {
      if (weeks[w].days[d].count > 0) {
        revCount++;
      } else {
        break;
      }
    }
    if (revCount === 0) break;
  }
  currentStreak = revCount;

  return {
    weeks,
    totalCommitsLastYear,
    longestStreak,
    currentStreak: currentStreak || 12,
    peakDay: peakDay.date ? peakDay : { date: today.toISOString().split('T')[0], count: 14 }
  };
}

export const SAMPLE_DOSSIERS: Record<string, CandidateDossier> = {
  shadcn: {
    profile: {
      login: 'shadcn',
      id: 124599,
      avatar_url: 'https://avatars.githubusercontent.com/u/124599?v=4',
      name: 'shadcn',
      company: '@vercel',
      blog: 'https://ui.shadcn.com',
      location: 'Remote, Global',
      email: 'shadcn@users.noreply.github.com',
      hireable: true,
      bio: 'Design engineer, creator of shadcn/ui and taxonomy. Building the modern web UI ecosystem.',
      twitter_username: 'shadcn',
      public_repos: 48,
      public_gists: 14,
      followers: 84200,
      following: 110,
      created_at: '2009-09-08T00:00:00Z',
      updated_at: '2026-09-18T10:00:00Z',
      html_url: 'https://github.com/shadcn',
      total_stars: 128450,
      total_forks: 14200,
      potential_score: 98,
      seniority_level: 'Principal / Architect',
      recommendation_status: 'Strong Hire',
      verified_badge: 'Ecosystem Creator',
      lines_of_code_est: 480000,
      active_streak_days: 42
    },
    repos: [
      {
        id: 1,
        name: 'ui',
        full_name: 'shadcn/ui',
        description: 'Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.',
        html_url: 'https://github.com/shadcn-ui/ui',
        stargazers_count: 82400,
        forks_count: 7300,
        language: 'TypeScript',
        topics: ['components', 'design-system', 'radix-ui', 'react', 'tailwind', 'nextjs'],
        size: 38240,
        updated_at: '2026-09-18T08:00:00Z',
        open_issues_count: 142,
        complexity_rating: 'High',
        architecture_type: 'Design System & Component Library'
      },
      {
        id: 2,
        name: 'taxonomy',
        full_name: 'shadcn/taxonomy',
        description: 'An open source application built using the new router, server components and everything new in Next.js 13.',
        html_url: 'https://github.com/shadcn/taxonomy',
        stargazers_count: 19800,
        forks_count: 3100,
        language: 'TypeScript',
        topics: ['nextjs13', 'app-router', 'prisma', 'server-components', 'tailwind'],
        size: 15400,
        updated_at: '2026-08-20T14:30:00Z',
        open_issues_count: 48,
        complexity_rating: 'High',
        architecture_type: 'Full-Stack Production Blueprint'
      },
      {
        id: 3,
        name: 'next-template',
        full_name: 'shadcn/next-template',
        description: 'Next.js 14 template for building apps with Radix UI and Tailwind CSS.',
        html_url: 'https://github.com/shadcn/next-template',
        stargazers_count: 8500,
        forks_count: 1200,
        language: 'TypeScript',
        topics: ['radix-ui', 'template', 'tailwindcss'],
        size: 4200,
        updated_at: '2026-07-11T12:00:00Z',
        open_issues_count: 15,
        complexity_rating: 'Medium',
        architecture_type: 'Production Scaffolding'
      },
      {
        id: 4,
        name: 'typography',
        full_name: 'shadcn/typography',
        description: 'Drop-in typography styling plugin for Tailwind CSS.',
        html_url: 'https://github.com/shadcn/typography',
        stargazers_count: 3200,
        forks_count: 240,
        language: 'JavaScript',
        topics: ['css', 'typography', 'tailwind'],
        size: 1800,
        updated_at: '2026-04-05T09:00:00Z',
        open_issues_count: 8,
        complexity_rating: 'Standard',
        architecture_type: 'CSS Engine Plugin'
      }
    ],
    complexity: {
      overallScore: 94,
      architectureDepth: 96,
      codeHygiene: 98,
      maintainability: 93,
      ecosystemImpact: 99,
      grade: 'A+',
      summary: 'World-class design systems architecture with exceptional clean-code hygiene, zero-bloat component distribution models, and massive open-source ecosystem impact.'
    },
    techStack: [
      { name: 'TypeScript', percentage: 68, bytes: 4200000, color: '#3178c6', tier: 'Mastery', repoCount: 32 },
      { name: 'React / Next.js', percentage: 22, bytes: 1400000, color: '#61dafb', tier: 'Mastery', repoCount: 26 },
      { name: 'Tailwind CSS', percentage: 7, bytes: 450000, color: '#06b6d4', tier: 'Mastery', repoCount: 30 },
      { name: 'Node.js & CLI', percentage: 3, bytes: 190000, color: '#22c55e', tier: 'Proficient', repoCount: 8 }
    ],
    verifiedSkills: [
      {
        id: 'vs-1',
        name: 'Design Systems & Component Architecture',
        category: 'Frontend',
        level: 'Expert / Staff',
        proofText: 'Created shadcn/ui, powering thousands of production apps globally with headless Radix UI primitives.',
        starsBacking: 82400,
        reposCount: 14
      },
      {
        id: 'vs-2',
        name: 'Next.js App Router & Server Components',
        category: 'Architecture',
        level: 'Expert / Staff',
        proofText: 'Authored taxonomy, the industry reference implementation for RSC, Server Actions, and Next Auth.',
        starsBacking: 19800,
        reposCount: 8
      },
      {
        id: 'vs-3',
        name: 'TypeScript Strict Metaprogramming',
        category: 'Frontend',
        level: 'Production Mastery',
        proofText: 'Complex generic props typing across multi-tier Polymorphic components with CVA variant resolvers.',
        starsBacking: 85000,
        reposCount: 32
      },
      {
        id: 'vs-4',
        name: 'Tailwind & Modern CSS Systems',
        category: 'Frontend',
        level: 'Expert / Staff',
        proofText: 'Deep mastery of CSS variables, dark-mode tokens, animations, and zero-runtime stylesheet optimization.',
        starsBacking: 90000,
        reposCount: 35
      }
    ],
    commitHeatmap: generateRealisticHeatmap(0.85)
  },

  gaearon: {
    profile: {
      login: 'gaearon',
      id: 810438,
      avatar_url: 'https://avatars.githubusercontent.com/u/810438?v=4',
      name: 'Dan Abramov',
      company: '@bluesky',
      blog: 'https://overreacted.io',
      location: 'London, UK',
      email: 'dan.abramov@me.com',
      hireable: true,
      bio: 'Working on Bluesky. Co-created Redux, Create React App. Former React core team at Meta.',
      twitter_username: 'dan_abramov',
      public_repos: 248,
      public_gists: 72,
      followers: 92000,
      following: 175,
      created_at: '2011-05-25T00:00:00Z',
      updated_at: '2026-09-18T10:00:00Z',
      html_url: 'https://github.com/gaearon',
      total_stars: 184000,
      total_forks: 38000,
      potential_score: 99,
      seniority_level: 'Principal / Architect',
      recommendation_status: 'Strong Hire',
      verified_badge: 'React Pioneer',
      lines_of_code_est: 920000,
      active_streak_days: 64
    },
    repos: [
      {
        id: 101,
        name: 'redux',
        full_name: 'reduxjs/redux',
        description: 'Predictable state container for JavaScript apps.',
        html_url: 'https://github.com/reduxjs/redux',
        stargazers_count: 60400,
        forks_count: 15400,
        language: 'TypeScript',
        topics: ['flux', 'functional-programming', 'javascript', 'redux', 'state-management'],
        size: 24000,
        updated_at: '2026-09-10T12:00:00Z',
        open_issues_count: 18,
        complexity_rating: 'High',
        architecture_type: 'Distributed State & Event Sourcing Engine'
      },
      {
        id: 102,
        name: 'overreacted.io',
        full_name: 'gaearon/overreacted.io',
        description: 'Personal blog about software development, React internals, and mental models.',
        html_url: 'https://github.com/gaearon/overreacted.io',
        stargazers_count: 7300,
        forks_count: 1800,
        language: 'JavaScript',
        topics: ['blog', 'gatsby', 'react'],
        size: 8900,
        updated_at: '2026-08-01T10:00:00Z',
        open_issues_count: 4,
        complexity_rating: 'Medium',
        architecture_type: 'Static Content & AST Rendering'
      },
      {
        id: 103,
        name: 'react-hot-loader',
        full_name: 'gaearon/react-hot-loader',
        description: 'Tweak React components in real time.',
        html_url: 'https://github.com/gaearon/react-hot-loader',
        stargazers_count: 12800,
        forks_count: 980,
        language: 'JavaScript',
        topics: ['babel', 'hot-reloading', 'react', 'webpack'],
        size: 6700,
        updated_at: '2026-03-12T00:00:00Z',
        open_issues_count: 22,
        complexity_rating: 'High',
        architecture_type: 'Compiler AST & Runtime Module Swap'
      }
    ],
    complexity: {
      overallScore: 97,
      architectureDepth: 99,
      codeHygiene: 96,
      maintainability: 95,
      ecosystemImpact: 100,
      grade: 'A+',
      summary: 'Deep runtime compiler mastery, functional immutable state architectures, and foundational contributions that shaped the modern React paradigm.'
    },
    techStack: [
      { name: 'JavaScript / ECMAScript', percentage: 48, bytes: 3800000, color: '#f7df1e', tier: 'Mastery', repoCount: 110 },
      { name: 'TypeScript', percentage: 32, bytes: 2500000, color: '#3178c6', tier: 'Mastery', repoCount: 45 },
      { name: 'React Internals', percentage: 14, bytes: 1100000, color: '#61dafb', tier: 'Mastery', repoCount: 50 },
      { name: 'AT Protocol & Systems', percentage: 6, bytes: 480000, color: '#0085ff', tier: 'Proficient', repoCount: 12 }
    ],
    verifiedSkills: [
      {
        id: 'vs-10',
        name: 'State Management & Functional Architecture',
        category: 'Architecture',
        level: 'Expert / Staff',
        proofText: 'Created Redux, defining deterministic state trees, action dispatch reducers, and middleware pipelines.',
        starsBacking: 60400,
        reposCount: 20
      },
      {
        id: 'vs-11',
        name: 'Runtime DevTools & Hot Module Replacement',
        category: 'Systems & Core',
        level: 'Expert / Staff',
        proofText: 'Engineered react-hot-loader and React DevTools time-travel debugging engine.',
        starsBacking: 12800,
        reposCount: 15
      },
      {
        id: 'vs-12',
        name: 'Decentralized Social Systems (AT Protocol)',
        category: 'Backend',
        level: 'Production Mastery',
        proofText: 'Core engineering on Bluesky micro-services and decentralized federated protocols.',
        starsBacking: 15000,
        reposCount: 12
      }
    ],
    commitHeatmap: generateRealisticHeatmap(0.80)
  },

  leerob: {
    profile: {
      login: 'leerob',
      id: 9113740,
      avatar_url: 'https://avatars.githubusercontent.com/u/9113740?v=4',
      name: 'Lee Robinson',
      company: '@vercel',
      blog: 'https://leerob.io',
      location: 'Des Moines, IA',
      email: 'me@leerob.io',
      hireable: true,
      bio: 'VP of Developer Experience at Vercel. Helping developers build a faster web.',
      twitter_username: 'leeerob',
      public_repos: 135,
      public_gists: 28,
      followers: 43500,
      following: 380,
      created_at: '2014-10-10T00:00:00Z',
      updated_at: '2026-09-18T10:00:00Z',
      html_url: 'https://github.com/leerob',
      total_stars: 48200,
      total_forks: 6900,
      potential_score: 95,
      seniority_level: 'Staff / Lead',
      recommendation_status: 'Strong Hire',
      verified_badge: 'DX & Web Leader',
      lines_of_code_est: 340000,
      active_streak_days: 35
    },
    repos: [
      {
        id: 201,
        name: 'leerob.io',
        full_name: 'leerob/leerob.io',
        description: 'Open source portfolio built with Next.js App Router, React Server Components, Tailwind CSS, and Postgres.',
        html_url: 'https://github.com/leerob/leerob.io',
        stargazers_count: 8900,
        forks_count: 2400,
        language: 'TypeScript',
        topics: ['nextjs', 'react', 'tailwind', 'postgres', 'vercel'],
        size: 14200,
        updated_at: '2026-09-15T18:00:00Z',
        open_issues_count: 6,
        complexity_rating: 'High',
        architecture_type: 'Full-Stack Serverless Web App'
      },
      {
        id: 202,
        name: 'next-saas-starter',
        full_name: 'leerob/next-saas-starter',
        description: 'Get started quickly with Next.js, Postgres, Stripe, and Tailwind CSS.',
        html_url: 'https://github.com/leerob/next-saas-starter',
        stargazers_count: 14200,
        forks_count: 2100,
        language: 'TypeScript',
        topics: ['saas', 'stripe', 'auth', 'postgres', 'drizzle'],
        size: 9800,
        updated_at: '2026-09-12T14:00:00Z',
        open_issues_count: 12,
        complexity_rating: 'High',
        architecture_type: 'Production SaaS Multi-Tenant Monorepo'
      },
      {
        id: 203,
        name: 'rust-hyper-api',
        full_name: 'leerob/rust-hyper-api',
        description: 'High-throughput edge API router written in Rust with Hyper and Tokio.',
        html_url: 'https://github.com/leerob/rust-hyper-api',
        stargazers_count: 2400,
        forks_count: 190,
        language: 'Rust',
        topics: ['rust', 'hyper', 'tokio', 'edge-computing'],
        size: 3400,
        updated_at: '2026-07-20T11:00:00Z',
        open_issues_count: 3,
        complexity_rating: 'High',
        architecture_type: 'Async Microservice & Edge Proxy'
      }
    ],
    complexity: {
      overallScore: 92,
      architectureDepth: 93,
      codeHygiene: 95,
      maintainability: 94,
      ecosystemImpact: 94,
      grade: 'A',
      summary: 'Superb full-stack cloud and developer experience architecture, specializing in modern React Server Components, serverless databases, edge routing, and clean SaaS templates.'
    },
    techStack: [
      { name: 'TypeScript', percentage: 62, bytes: 2900000, color: '#3178c6', tier: 'Mastery', repoCount: 58 },
      { name: 'Next.js & React', percentage: 24, bytes: 1100000, color: '#61dafb', tier: 'Mastery', repoCount: 42 },
      { name: 'PostgreSQL & SQL', percentage: 8, bytes: 380000, color: '#336791', tier: 'Proficient', repoCount: 20 },
      { name: 'Rust', percentage: 6, bytes: 280000, color: '#dea584', tier: 'Proficient', repoCount: 8 }
    ],
    verifiedSkills: [
      {
        id: 'vs-20',
        name: 'Modern Web Performance & CWV',
        category: 'Frontend',
        level: 'Expert / Staff',
        proofText: 'Built benchmark Next.js applications hitting 100/100 Lighthouse across LCP, INP, and CLS metrics.',
        starsBacking: 23100,
        reposCount: 25
      },
      {
        id: 'vs-21',
        name: 'SaaS Billing & Database Integration',
        category: 'Backend',
        level: 'Production Mastery',
        proofText: 'Designed next-saas-starter with Drizzle ORM, multi-tenant Postgres connections, and Stripe webhooks.',
        starsBacking: 14200,
        reposCount: 12
      },
      {
        id: 'vs-22',
        name: 'Developer Experience & Documentation',
        category: 'Architecture',
        level: 'Expert / Staff',
        proofText: 'Architected Vercel DX guides and Next.js learning tracks used by hundreds of thousands of engineers.',
        starsBacking: 40000,
        reposCount: 30
      }
    ],
    commitHeatmap: generateRealisticHeatmap(0.82)
  },

  torvalds: {
    profile: {
      login: 'torvalds',
      id: 1024025,
      avatar_url: 'https://avatars.githubusercontent.com/u/1024025?v=4',
      name: 'Linus Torvalds',
      company: 'Linux Foundation',
      blog: 'https://kernel.org',
      location: 'Portland, OR',
      email: 'torvalds@linux-foundation.org',
      hireable: false,
      bio: 'Creator of Linux and Git. Systems architect, kernel hacker, and open source advocate.',
      twitter_username: null,
      public_repos: 7,
      public_gists: 0,
      followers: 245000,
      following: 0,
      created_at: '2011-09-03T00:00:00Z',
      updated_at: '2026-09-18T10:00:00Z',
      html_url: 'https://github.com/torvalds',
      total_stars: 198000,
      total_forks: 54000,
      potential_score: 100,
      seniority_level: 'Principal / Architect',
      recommendation_status: 'Strong Hire',
      verified_badge: 'Legendary Architect',
      lines_of_code_est: 28000000,
      active_streak_days: 120
    },
    repos: [
      {
        id: 301,
        name: 'linux',
        full_name: 'torvalds/linux',
        description: 'Linux kernel source tree.',
        html_url: 'https://github.com/torvalds/linux',
        stargazers_count: 182000,
        forks_count: 52000,
        language: 'C',
        topics: ['kernel', 'linux', 'operating-system', 'c', 'systems'],
        size: 1450000,
        updated_at: '2026-09-18T20:00:00Z',
        open_issues_count: 420,
        complexity_rating: 'High',
        architecture_type: 'Monolithic Operating System Kernel'
      },
      {
        id: 302,
        name: 'subsurface-for-dirk',
        full_name: 'torvalds/subsurface-for-dirk',
        description: 'Subsurface dive log program.',
        html_url: 'https://github.com/torvalds/subsurface-for-dirk',
        stargazers_count: 3100,
        forks_count: 480,
        language: 'C',
        topics: ['c', 'diving', 'gui', 'qt'],
        size: 34000,
        updated_at: '2026-08-05T12:00:00Z',
        open_issues_count: 14,
        complexity_rating: 'High',
        architecture_type: 'Desktop Hardware & Telemetry Suite'
      }
    ],
    complexity: {
      overallScore: 100,
      architectureDepth: 100,
      codeHygiene: 99,
      maintainability: 98,
      ecosystemImpact: 100,
      grade: 'A+',
      summary: 'Unrivaled systems programming, bare-metal hardware drivers, memory management, lockless concurrency algorithms, and the foundational software substrate of human civilization.'
    },
    techStack: [
      { name: 'C / Systems', percentage: 89, bytes: 42000000, color: '#555555', tier: 'Mastery', repoCount: 5 },
      { name: 'Assembly & Arch', percentage: 6, bytes: 2800000, color: '#6E4C13', tier: 'Mastery', repoCount: 3 },
      { name: 'Make & Toolchains', percentage: 3, bytes: 1400000, color: '#427819', tier: 'Mastery', repoCount: 5 },
      { name: 'Shell / Perl', percentage: 2, bytes: 950000, color: '#0298c3', tier: 'Proficient', repoCount: 4 }
    ],
    verifiedSkills: [
      {
        id: 'vs-30',
        name: 'Operating System Architecture & Kernel',
        category: 'Systems & Core',
        level: 'Expert / Staff',
        proofText: 'Architected Linux, controlling hardware memory allocators, virtual file systems (VFS), and process schedulers.',
        starsBacking: 182000,
        reposCount: 2
      },
      {
        id: 'vs-31',
        name: 'Concurrency, Mutexes & Lockless Data Structures',
        category: 'Architecture',
        level: 'Expert / Staff',
        proofText: 'Pioneered Read-Copy-Update (RCU) implementations and non-blocking lock primitives at hyperscale.',
        starsBacking: 182000,
        reposCount: 2
      },
      {
        id: 'vs-32',
        name: 'Distributed Version Control & Git Protocols',
        category: 'Systems & Core',
        level: 'Expert / Staff',
        proofText: 'Designed Git content-addressable storage engine (tree, commit, blob, packfile DAG architecture).',
        starsBacking: 200000,
        reposCount: 3
      }
    ],
    commitHeatmap: generateRealisticHeatmap(0.92)
  }
};
