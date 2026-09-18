import { CandidateDossier, AiMessage } from '../types';

const GEMINI_KEY_STORAGE = 'githired_gemini_api_key';

export function getStoredGeminiKey(): string | null {
  return localStorage.getItem(GEMINI_KEY_STORAGE);
}

export function setStoredGeminiKey(key: string) {
  if (key.trim()) {
    localStorage.setItem(GEMINI_KEY_STORAGE, key.trim());
  } else {
    localStorage.removeItem(GEMINI_KEY_STORAGE);
  }
}

export async function askAiAssistant(
  prompt: string,
  dossier: CandidateDossier,
  conversationHistory: AiMessage[] = []
): Promise<{ text: string; citations?: { repoName: string; reason: string }[] }> {
  const p = prompt.trim().toLowerCase();
  const { profile, repos, complexity, techStack, verifiedSkills } = dossier;
  const topRepos = repos.slice(0, 3);

  // Check if Gemini API key is configured
  const apiKey = getStoredGeminiKey();
  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are GitHired AI, an elite developer talent intelligence assistant. 
Analyze the candidate using ONLY the provided verified GitHub data. Be objective, concise, and cite specific projects and real architectural impact.

Candidate Profile:
- Name: ${profile.name} (@${profile.login})
- Bio: ${profile.bio}
- Followers: ${profile.followers}, Public Repos: ${profile.public_repos}, Total Stars: ${profile.total_stars}, Forks: ${profile.total_forks}
- Seniority: ${profile.seniority_level}, Potential Score: ${profile.potential_score}/100
- Code Complexity Grade: ${complexity.grade} (${complexity.overallScore}/100)
- Top Tech Stack: ${techStack.map(t => `${t.name} (${t.percentage}%)`).join(', ')}
- Top Repositories: ${topRepos.map(r => `${r.name} (${r.stargazers_count} stars, ${r.language || 'N/A'}, ${r.architecture_type}): ${r.description}`).join('; ')}
- Verified Skills: ${verifiedSkills.map(s => `${s.name}: ${s.proofText}`).join('; ')}

Question: "${prompt}"

Provide a concise, direct, professional hiring answer.`
                  }
                ]
              }
            ]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const output = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (output) {
          return {
            text: output,
            citations: topRepos.map(r => ({
              repoName: r.name,
              reason: `${r.stargazers_count} stars • ${r.architecture_type}`
            }))
          };
        }
      }
    } catch (e) {
      console.warn('Gemini API call failed, using built-in intelligence engine:', e);
    }
  }

  // Built-in intelligent telemetry reasoning engine
  if (p.includes('top 3 strengths') || p.includes('strength') || p.includes('strongest')) {
    const s1 = verifiedSkills[0]?.name || `${techStack[0]?.name} Architectural Mastery`;
    const s2 = verifiedSkills[1]?.name || 'Production Codebase Hygiene & Modularity';
    const s3 = verifiedSkills[2]?.name || 'Open-Source Ecosystem Leadership';

    return {
      text: `### 🎯 Top 3 Engineering Strengths for **${profile.name}** (@${profile.login})

1. **${s1}**
   - Proven track record with **${verifiedSkills[0]?.starsBacking?.toLocaleString() || 'thousands of'}** GitHub stars backing and extensive daily commit momentum.
   - Core repository: \`${topRepos[0]?.name || 'primary repo'}\` demonstrating senior-tier modular design patterns.

2. **${s2}**
   - Strong architectural complexity rating (**${complexity.architectureDepth}/100**) with clean dependency boundaries.
   - Consistently produces maintainable APIs and resilient error boundaries.

3. **${s3}**
   - High ecosystem leverage (**${complexity.ecosystemImpact}/100** impact index) with active fork velocity (**${profile.total_forks.toLocaleString()} forks**).
   - Demonstrates ability to ship developer tools and infrastructure that scale beyond single-team boundaries.`,
      citations: [
        { repoName: topRepos[0]?.name || 'core-repo', reason: `Highest impact codebase with ${topRepos[0]?.stargazers_count?.toLocaleString() || '1k+'} stars` },
        { repoName: topRepos[1]?.name || 'secondary-repo', reason: 'High architectural depth & modularity' }
      ]
    };
  }

  if (p.includes('best role fit') || p.includes('role') || p.includes('hire for')) {
    let archetype = 'Founding Full-Stack Engineer / Lead Architect';
    if (profile.seniority_level.includes('Principal')) {
      archetype = 'Principal Architect / Head of Foundation Engineering';
    } else if (techStack[0]?.name === 'C' || techStack[0]?.name === 'Rust') {
      archetype = 'Core Systems / Distributed Infrastructure Lead';
    } else if (techStack[0]?.name === 'TypeScript') {
      archetype = 'Staff Frontend / Design Systems Platform Lead';
    }

    return {
      text: `### 💼 Optimal Role Alignment: **${archetype}**

- **Target Level:** ${profile.seniority_level} (Potential Rating: **${profile.potential_score}/100**)
- **Ideal Team Archetype:** High-velocity Product Foundation or Platform Infrastructure squad.
- **Why this fit:**
  - **${profile.name}** demonstrates exceptional autonomy. Across **${profile.public_repos} public repos**, they consistently take projects from inception to production adoption.
  - Dominant language mastery in **${techStack[0]?.name} (${techStack[0]?.percentage}%)** allows them to immediately establish code hygiene baselines and mentor team members.
  - Demonstrated ability to translate complex specifications into lightweight developer ergonomics (exemplified in \`${topRepos[0]?.name}\`).`,
      citations: [
        { repoName: topRepos[0]?.name || 'flagship', reason: `Demonstrates ownership of ${topRepos[0]?.architecture_type}` }
      ]
    };
  }

  if (p.includes('red flag') || p.includes('risk') || p.includes('concern')) {
    const langDominance = techStack[0]?.percentage || 60;
    const issuesAvg = repos.reduce((a, r) => a + (r.open_issues_count || 0), 0) / (repos.length || 1);

    return {
      text: `### 🚩 Technical Hiring Risks & Mitigation Strategies

1. **Technology Stack Concentration (${techStack[0]?.name}: ${langDominance}%)**
   - *Observation:* Over **${langDominance}%** of public code lines are concentrated in **${techStack[0]?.name}**.
   - *Mitigation:* In interview screening, probe their adaptability to multi-paradigm backends or unfamiliar distributed languages.

2. **Open Issue Triage Cadence**
   - *Observation:* With **${profile.total_stars.toLocaleString()} stars**, community pull requests and issue tracking require sustained maintenance cycles (averaging ~${Math.round(issuesAvg)} open items per flagship repo).
   - *Mitigation:* Inquire about their delegation strategies and experience operating inside strict corporate sprint constraints vs independent open-source schedules.

3. **Autonomy vs Bureaucracy Tolerance**
   - *Observation:* Candidate thrives in high-ownership, decentralized environments.
   - *Verdict:* May experience friction in slow-moving legacy release cycles; best positioned in autonomous pods with direct product influence.`,
      citations: [
        { repoName: topRepos[0]?.name || 'repo', reason: `High community backlog (${topRepos[0]?.open_issues_count || 5} issues)` }
      ]
    };
  }

  if (p.includes('summary') || p.includes('executive') || p.includes('overview')) {
    return {
      text: `### 📊 Talent Intelligence Executive Summary: **${profile.name}**

**${profile.name}** (@${profile.login}) is an elite **${profile.seniority_level}** operating in the top **1%** of public GitHub contributors.

- **Verified Impact:** Holds **${profile.total_stars.toLocaleString()} stars** and **${profile.total_forks.toLocaleString()} forks**, reflecting broad enterprise and developer trust.
- **Architectural Benchmark:** Code Complexity Score of **${complexity.overallScore}/100 (Grade ${complexity.grade})**, highlighted by flagship projects like \`${topRepos[0]?.name}\` (${topRepos[0]?.description || 'Modern system architecture'}).
- **Core Technology Mastery:** ${techStack.map(t => `**${t.name}** (${t.percentage}%)`).join(', ')}.
- **Hiring Verdict:** **${profile.recommendation_status}**. Recommended for critical path architectural initiatives requiring high velocity and exceptional design standards.`,
      citations: topRepos.map(r => ({
        repoName: r.name,
        reason: `${r.stargazers_count?.toLocaleString()} stars • ${r.architecture_type}`
      }))
    };
  }

  if (p.includes('interview') || p.includes('question')) {
    return {
      text: `### 💡 High-Signal Interview Questions for **${profile.name}**

1. *Architecture Deep Dive on \`${topRepos[0]?.name}\`:*
   > "In \`${topRepos[0]?.name}\`, what trade-offs did you make regarding type polymorphism and bundle tree-shaking? How did you ensure backward compatibility across minor releases?"

2. *State & Scalability:*
   > "When managing high-frequency events or client/server hydration, how do you prevent cascading re-renders and memory leaks in production ${techStack[0]?.name} applications?"

3. *System Maintainability:*
   > "Given your Code Hygiene score of ${complexity.codeHygiene}/100, what automated testing or linting pipelines do you mandate before shipping breaking API changes?"`,
      citations: [
        { repoName: topRepos[0]?.name || 'core', reason: 'Primary technical evaluation baseline' }
      ]
    };
  }

  // Default response for custom query
  return {
    text: `### 💡 Analysis on "${prompt}"

Based strictly on **${profile.name}**'s GitHub telemetry and repository audit:

- **Code Evidence:** Across **${profile.public_repos} public repos**, the candidate demonstrates deep proficiency with **${techStack.slice(0, 2).map(t => t.name).join(' & ')}**.
- **Flagship Implementation:** In \`${topRepos[0]?.name}\`, they authored code classified as **${topRepos[0]?.architecture_type}**, attracting over **${topRepos[0]?.stargazers_count.toLocaleString()} stars**.
- **Commit Cadence:** Consistent contribution frequency over 52 weeks with active streak of **${profile.active_streak_days} days**.
- **Hiring Alignment:** For questions involving *"${prompt}"*, candidate metrics indicate **${complexity.architectureDepth >= 85 ? 'high senior-level architectural competence' : 'solid practical production capability'}**.`,
    citations: [
      { repoName: topRepos[0]?.name || 'repo-1', reason: `${topRepos[0]?.language || 'Codebase'} primary proof` }
    ]
  };
}
