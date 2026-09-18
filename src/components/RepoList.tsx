import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Star, GitFork, ExternalLink, Search, Tag, AlertCircle } from 'lucide-react';
import { Repository } from '../types';

interface RepoListProps {
  repos: Repository[];
}

export const RepoList: React.FC<RepoListProps> = ({ repos }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLang, setSelectedLang] = useState<string>('all');

  const languages = ['all', ...Array.from(new Set(repos.map(r => r.language).filter(Boolean)))];

  const filteredRepos = repos.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLang = selectedLang === 'all' || repo.language === selectedLang;
    return matchesSearch && matchesLang;
  });

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 shadow-xl relative overflow-hidden">
      
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Repository Architecture & Codebases
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Inspected public repositories, complexity ratings & ecosystem traction
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search repos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/60 w-36 sm:w-44 font-mono"
            />
          </div>

          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            aria-label="Filter repositories by language"
            className="px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/60 font-mono"
          >
            {languages.map(l => (
              <option key={l as string} value={l as string} className="bg-slate-900 text-white">
                {l === 'all' ? 'All Languages' : l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Repositories Grid */}
      {filteredRepos.length === 0 ? (
        <div className="text-center py-12 text-slate-500 font-mono text-xs">
          No repositories matching the current filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRepos.map((repo) => (
            <motion.div
              key={repo.id}
              whileHover={{ scale: 1.015, y: -2 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:border-indigo-500/30 flex flex-col justify-between transition-all group"
            >
              <div>
                {/* Title & External Link */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                  >
                    <span>{repo.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                  </a>

                  {/* Complexity Tag */}
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                      repo.complexity_rating === 'High'
                        ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                        : repo.complexity_rating === 'Medium'
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-400 border border-white/5'
                    }`}
                  >
                    {repo.complexity_rating} Complexity
                  </span>
                </div>

                {/* Architecture Type Pill */}
                <div className="mb-2.5">
                  <span className="text-[11px] font-mono text-cyan-400/90 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20 inline-block">
                    {repo.architecture_type}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {repo.description || 'No public repository description provided.'}
                </p>

                {/* Topics / Tags */}
                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {repo.topics.slice(0, 4).map(topic => (
                      <span
                        key={topic}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-white/5 flex items-center gap-1"
                      >
                        <Tag className="w-2.5 h-2.5 text-slate-500" />
                        {topic}
                      </span>
                    ))}
                    {repo.topics.length > 4 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 text-slate-500">
                        +{repo.topics.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Metrics Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-amber-300">
                    <Star className="w-3.5 h-3.5" />
                    {repo.stargazers_count.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <GitFork className="w-3.5 h-3.5" />
                    {repo.forks_count.toLocaleString()}
                  </span>
                  {repo.open_issues_count > 0 && (
                    <span className="flex items-center gap-1 text-slate-500 hidden sm:flex">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {repo.open_issues_count}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-slate-300">{repo.language || 'Other'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
};
