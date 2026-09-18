import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Flame, TrendingUp, Award } from 'lucide-react';
import { CommitHeatmapData, CommitDay } from '../types';

interface CommitHeatmapProps {
  data: CommitHeatmapData;
  candidateName: string;
}

export const CommitHeatmap: React.FC<CommitHeatmapProps> = ({ data, candidateName }) => {
  const [hoveredDay, setHoveredDay] = useState<CommitDay | null>(null);

  // Month label offsets approx across 52 weeks
  const monthNames = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

  // Color map for commit levels matching electric indigo & cyber cyan aesthetic in both modes
  const getCellColor = (level: number) => {
    switch (level) {
      case 4:
        return 'bg-[#06b6d4] shadow-sm shadow-[#06b6d4]/40 border-transparent';
      case 3:
        return 'bg-[#6366f1] border-transparent';
      case 2:
        return 'bg-[#4f46e5] border-transparent';
      case 1:
        return 'bg-[#818cf8]/50 border-indigo-300/30 dark:border-indigo-950';
      default:
        return 'bg-slate-200/80 dark:bg-[#0f1422] border-slate-300/40 dark:border-white/5';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200/90 dark:border-white/10 shadow-xl relative overflow-hidden transition-colors">
      
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
            <h3 className="text-lg font-bold text-slate-950 dark:text-white tracking-tight">
              Commit Frequency & Contribution Cadence
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
            52-week rolling activity telemetry for @{candidateName}
          </p>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/20 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
            <div className="text-right">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block -mb-0.5">Total Commits</span>
              <span className="text-xs font-bold text-indigo-700 dark:text-cyan-300 font-mono">
                {data.totalCommitsLastYear.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-500/20 flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <div className="text-right">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block -mb-0.5">Active Streak</span>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 font-mono">
                {data.currentStreak} Days
              </span>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/20 flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <div className="text-right">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block -mb-0.5">Longest Streak</span>
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300 font-mono">
                {data.longestStreak} Days
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tooltip Banner */}
      <div className="h-6 mb-2 flex items-center justify-between text-xs font-mono">
        {hoveredDay ? (
          <motion.div 
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-indigo-800 dark:text-cyan-300 bg-indigo-50 dark:bg-indigo-950/70 px-2.5 py-0.5 rounded-md border border-indigo-200 dark:border-cyan-500/30 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-ping"></span>
            <span>
              <strong>{hoveredDay.count} {hoveredDay.count === 1 ? 'commit' : 'commits'}</strong> on {hoveredDay.date}
            </span>
          </motion.div>
        ) : (
          <span className="text-slate-400 text-[11px]">
            Hover over any cell to inspect daily commit density
          </span>
        )}

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
          <span>Less</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-200 dark:bg-[#0f1422] border border-slate-300 dark:border-white/5" />
            <span className="w-2.5 h-2.5 rounded-sm bg-[#818cf8]/50" />
            <span className="w-2.5 h-2.5 rounded-sm bg-[#4f46e5]" />
            <span className="w-2.5 h-2.5 rounded-sm bg-[#6366f1]" />
            <span className="w-2.5 h-2.5 rounded-sm bg-[#06b6d4]" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Grid Container (Scrollable horizontally on mobile) */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[760px]">
          
          {/* Months Header */}
          <div className="grid grid-cols-12 text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1.5 pl-7">
            {monthNames.map((m, idx) => (
              <div key={idx} className="text-left">
                {m}
              </div>
            ))}
          </div>

          {/* Grid with Weekday Labels */}
          <div className="flex gap-2">
            {/* Days labels */}
            <div className="flex flex-col justify-between text-[9px] font-mono text-slate-400 dark:text-slate-500 py-0.5 select-none w-5">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Weeks Columns */}
            <div className="flex-1 flex gap-[3px]">
              {data.weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[3px]">
                  {week.days.map((day, dIdx) => (
                    <div
                      key={dIdx}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-[11.5px] h-[11.5px] rounded-[2.5px] border cursor-pointer transition-all duration-150 hover:scale-135 hover:z-20 hover:ring-2 hover:ring-indigo-400 dark:hover:ring-cyan-400 ${getCellColor(
                        day.level
                      )}`}
                      title={`${day.count} commits on ${day.date}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
