import { jsPDF } from 'jspdf';
import { CandidateDossier } from '../types';

export function exportCandidatePdf(dossier: CandidateDossier) {
  const { profile, complexity, techStack, verifiedSkills, repos } = dossier;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 16;

  // 1. Dark Executive Theme Background
  doc.setFillColor(8, 13, 26); // Deep Cyberpunk Navy
  doc.rect(0, 0, pageWidth, 297, 'F');

  // Decorative Modern Border
  doc.setDrawColor(99, 102, 241); // Indigo Accent
  doc.setLineWidth(0.4);
  doc.roundedRect(8, 8, pageWidth - 16, 281, 3, 3);

  // 2. Header Branding & Confidential Tag
  doc.setTextColor(56, 189, 248); // Cyan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('GitHired', 14, y);

  doc.setTextColor(168, 85, 247); // Purple
  doc.setFontSize(10);
  doc.text('// EXECUTIVE TALENT DOSSIER', 42, y);

  doc.setTextColor(148, 163, 184); // Slate 400
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(`CONFIDENTIAL • ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`, pageWidth - 14, y, { align: 'right' });

  y += 7;
  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.3);
  doc.line(14, y, pageWidth - 14, y);

  y += 7;

  // 3. Candidate Profile Plaque Box
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.roundedRect(14, y, pageWidth - 28, 32, 2, 2, 'F');
  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(0.3);
  doc.roundedRect(14, y, pageWidth - 28, 32, 2, 2, 'D');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(profile.name, 19, y + 9);

  doc.setTextColor(56, 189, 248);
  doc.setFontSize(9);
  doc.text(`@${profile.login}   •   ${profile.seniority_level}   •   ${profile.company || 'Open-Source Engineer'}`, 19, y + 15);

  doc.setTextColor(203, 213, 225);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  const bio = profile.bio ? doc.splitTextToSize(profile.bio, pageWidth - 80) : 'Autonomous developer talent evaluated via public GitHub repository telemetry.';
  doc.text(bio, 19, y + 21);

  // Potential Score Box (Right Side)
  doc.setFillColor(20, 30, 55);
  doc.roundedRect(pageWidth - 52, y + 3.5, 34, 25, 2, 2, 'F');
  doc.setDrawColor(56, 189, 248);
  doc.roundedRect(pageWidth - 52, y + 3.5, 34, 25, 2, 2, 'D');

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.text('POTENTIAL SCORE', pageWidth - 35, y + 9.5, { align: 'center' });

  doc.setTextColor(56, 189, 248);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`${profile.potential_score}`, pageWidth - 35, y + 18, { align: 'center' });

  doc.setTextColor(129, 140, 248);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.text(profile.recommendation_status, pageWidth - 35, y + 24, { align: 'center' });

  y += 38;

  // 4. Key Engineering Telemetry (6 metrics in 3x2 grid)
  doc.setTextColor(56, 189, 248);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('1. Deterministic Git Cadence & Velocity', 14, y);
  y += 4.5;

  const metrics = [
    { label: 'Public Repositories', val: `${profile.public_repos}` },
    { label: 'Total Stars Earned', val: profile.total_stars.toLocaleString() },
    { label: 'Community Forks', val: profile.total_forks.toLocaleString() },
    { label: 'Network Followers', val: profile.followers.toLocaleString() },
    { label: 'Active Contribution Streak', val: `${profile.active_streak_days} Days` },
    { label: 'AST Complexity Rating', val: `Grade ${complexity.grade} (${complexity.architectureDepth}/100)` }
  ];

  const colWidth = (pageWidth - 28) / 3;
  metrics.forEach((m, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const boxX = 14 + col * colWidth;
    const boxY = y + row * 14;

    doc.setFillColor(15, 23, 42);
    doc.roundedRect(boxX, boxY, colWidth - 2.5, 11.5, 1.5, 1.5, 'F');

    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text(m.label, boxX + 3.5, boxY + 4.5);

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(m.val, boxX + 3.5, boxY + 9);
  });

  y += 33;

  // 5. Code Complexity Breakdown
  doc.setTextColor(56, 189, 248);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('2. Algorithmic Complexity & Architecture Analysis', 14, y);
  y += 4.5;

  const compFactors = [
    { name: 'Architectural Depth & Module Separation', score: `${complexity.architectureDepth}/100` },
    { name: 'Code Hygiene & Modern Syntax Standards', score: `${complexity.codeHygiene}/100` },
    { name: 'Maintainability & Cyclomatic Density Index', score: `${complexity.maintainability}/100` },
    { name: 'Open-Source Ecosystem Impact & Influence', score: `${complexity.ecosystemImpact}/100` }
  ];

  compFactors.forEach((cf, idx) => {
    const boxY = y + idx * 8.5;
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(14, boxY, pageWidth - 28, 6.8, 1, 1, 'F');

    doc.setTextColor(226, 232, 240);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(cf.name, 18, boxY + 4.7);

    doc.setTextColor(129, 140, 248);
    doc.setFont('helvetica', 'bold');
    doc.text(cf.score, pageWidth - 18, boxY + 4.7, { align: 'right' });
  });

  y += 39;

  // 6. Top Verified Competencies
  doc.setTextColor(56, 189, 248);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('3. Verified Technical Competencies (Empirical Proofs)', 14, y);
  y += 4.5;

  verifiedSkills.slice(0, 3).forEach((vs, idx) => {
    const boxY = y + idx * 14.5;
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(14, boxY, pageWidth - 28, 12, 1.5, 1.5, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(vs.name, 18, boxY + 4.5);

    doc.setTextColor(56, 189, 248);
    doc.setFontSize(7);
    doc.text(vs.level, pageWidth - 18, boxY + 4.5, { align: 'right' });

    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    const proof = doc.splitTextToSize(vs.proofText, pageWidth - 38);
    doc.text(proof, 18, boxY + 9);
  });

  y += 49;

  // 7. Top Production Repositories
  doc.setTextColor(56, 189, 248);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('4. Flagship Production Repositories', 14, y);
  y += 4.5;

  repos.slice(0, 3).forEach((r, idx) => {
    const boxY = y + idx * 12;
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(14, boxY, pageWidth - 28, 9.8, 1, 1, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(r.name, 18, boxY + 4.2);

    doc.setTextColor(168, 85, 247);
    doc.setFontSize(6.5);
    doc.text(`${r.language || 'Architecture'}  •  ${(r.stargazers_count || 0).toLocaleString()} Stars`, pageWidth - 18, boxY + 4.2, { align: 'right' });

    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    const desc = r.description ? doc.splitTextToSize(r.description, pageWidth - 38)[0] : 'Core engineering codebase';
    doc.text(desc, 18, boxY + 8);
  });

  y += 41;

  // 8. Executive Recruiter Interview Prompts
  doc.setTextColor(56, 189, 248);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('5. Autonomous Recruiter Interview Strategy', 14, y);
  y += 4.5;

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(14, y, pageWidth - 28, 16, 1.5, 1.5, 'F');

  doc.setTextColor(203, 213, 225);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.text(`1. "In your flagship repo ${repos[0]?.name || 'active repo'}, what was the primary architectural bottleneck you solved at scale?"`, 18, y + 6);
  doc.text(`2. "How did you balance cyclomatic complexity against modular maintainability in your core modules?"`, 18, y + 11.5);

  // 9. Document Footer
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(6.5);
  doc.text('Autonomously minted by GitHired Developer Talent Intelligence • Verified AST Telemetry Protocol', pageWidth / 2, 283, { align: 'center' });

  doc.save(`GitHired-Executive-Dossier-${profile.login}.pdf`);
}
