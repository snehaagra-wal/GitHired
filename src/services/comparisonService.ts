import { CandidateDossier, ComparisonVerdict } from '../types';

export function compareCandidates(
  dossier1: CandidateDossier,
  dossier2: CandidateDossier
): ComparisonVerdict {
  const p1 = dossier1.profile;
  const p2 = dossier2.profile;
  const c1 = dossier1.complexity;
  const c2 = dossier2.complexity;

  const score1 = p1.potential_score;
  const score2 = p2.potential_score;

  let winnerUsername = score1 >= score2 ? p1.login : p2.login;
  const adv1: string[] = [];
  const adv2: string[] = [];

  // Comparison metrics
  if (p1.total_stars > p2.total_stars) {
    adv1.push(`Higher Open Source Reach (${p1.total_stars.toLocaleString()} vs ${p2.total_stars.toLocaleString()} stars)`);
  } else {
    adv2.push(`Higher Open Source Reach (${p2.total_stars.toLocaleString()} vs ${p1.total_stars.toLocaleString()} stars)`);
  }

  if (c1.architectureDepth > c2.architectureDepth) {
    adv1.push(`Deeper Architecture Complexity (${c1.architectureDepth} vs ${c2.architectureDepth})`);
  } else {
    adv2.push(`Deeper Architecture Complexity (${c2.architectureDepth} vs ${c1.architectureDepth})`);
  }

  if (c1.codeHygiene > c2.codeHygiene) {
    adv1.push(`Superior Code Hygiene & Modularity (${c1.codeHygiene} vs ${c2.codeHygiene})`);
  } else {
    adv2.push(`Superior Code Hygiene & Modularity (${c2.codeHygiene} vs ${c1.codeHygiene})`);
  }

  if (p1.followers > p2.followers) {
    adv1.push(`Stronger Developer Following (${p1.followers.toLocaleString()} vs ${p2.followers.toLocaleString()})`);
  } else {
    adv2.push(`Stronger Developer Following (${p2.followers.toLocaleString()} vs ${p1.followers.toLocaleString()})`);
  }

  if (p1.active_streak_days > p2.active_streak_days) {
    adv1.push(`Longer Active Commit Cadence (${p1.active_streak_days} days)`);
  } else {
    adv2.push(`Longer Active Commit Cadence (${p2.active_streak_days} days)`);
  }

  const headline = score1 === score2
    ? `Exceptional Head-to-Head Parity Between Two Top-Tier Leaders`
    : score1 > score2
      ? `@${p1.login} Leads Overall Talent Potential Score (${score1} vs ${score2})`
      : `@${p2.login} Leads Overall Talent Potential Score (${score2} vs ${score1})`;

  const reasoning = `Both candidates represent top-percentile engineering talent. @${p1.login} excels in ${dossier1.techStack[0]?.name} with focus on ${dossier1.verifiedSkills[0]?.name || 'system design'}, while @${p2.login} showcases exceptional velocity in ${dossier2.techStack[0]?.name} with strong ${dossier2.verifiedSkills[0]?.name || 'architecture'}.`;

  const roleRecommendation = {
    forDev1: p1.potential_score >= 95
      ? 'Recommended for Principal Architect or Core Foundation Lead'
      : 'Recommended for Staff Full-Stack / Platform Tech Lead',
    forDev2: p2.potential_score >= 95
      ? 'Recommended for Principal Architect or Core Foundation Lead'
      : 'Recommended for Staff Full-Stack / Platform Tech Lead'
  };

  return {
    winnerUsername,
    headline,
    reasoning,
    roleRecommendation,
    advantageDev1: adv1,
    advantageDev2: adv2
  };
}
