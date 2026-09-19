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

  const getCellColor = (level: number) => {
    switch (level) {
      case 4:
        return 'bg-[#06b6d4] shadow-sm shadow-[#06b6d4]/30 border-transparent';
      case 3:
        return 'bg-[#6366f1] border-transparent';
      case 2:
        return 'bg-[#4f46e5] border-transparent';
      case 1:
        return 'bg-[#818cf8]/45 border-transparent';
      default:
        return 'bg-[#0e1322] border-white/[0.04]';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 border border-white/[0.08] relative overflow-hidden">
      
      {/* Header & Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 sm:mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Commit Frequency & Contribution Cadence
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            52-week rolling activity telemetry for @{candidateName}
          </p>
        </div>

        {/* Quick Stats Pills */}
        <div className="grid grid-cols-3 sm:flex items-center gap-2 sm:gap-3">
          <div className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 flex items-center gap-1.5 sm:gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <div className="text-left sm:text-right">
              <span className="text-[9px] sm:text-[10px] text-slate-400 block -mb-0.5">Commits</span>
              <span className="text-xs font-bold text-cyan-300 font-mono">
                {data.totalCommitsLastYear.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-950/30 border border-amber-500/20 flex items-center gap-1.5 sm:gap-2">
            <Flame className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <div className="text-left sm:text-right">
              <span className="text-[9px] sm:text-[10px] text-slate-400 block -mb-0.5">Streak</span>
              <span className="text-xs font-bold text-amber-300 font-mono">
                {data.currentStreak}d
              </span>
            </div>
          </div>

          <div className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-950/30 border border-purple-500/20 flex items-center gap-1.5 sm:gap-2">
            <Award className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
            <div className="text-left sm:text-right">
              <span className="text-[9px] sm:text-[10px] text-slate-400 block -mb-0.5">Peak</span>
              <span className="text-xs font-bold text-purple-300 font-mono">
                {data.longestStreak}d
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tooltip & Legend Banner */}
      <div className="mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs font-mono min-h-[24px]">
        {hoveredDay ? (
          <motion.div 
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-cyan-300 bg-indigo-950/60 px-2.5 py-0.5 rounded-md border border-cyan-500/30 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>
              <strong>{hoveredDay.count} {hoveredDay.count === 1 ? 'commit' : 'commits'}</strong> on {hoveredDay.date}
            </span>
          </motion.div>
        ) : (
          <span className="text-slate-400 text-[11px]">
            Hover or tap any cell to inspect daily commit density
          </span>
        )}

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <span>Less</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#0e1322] border border-white/[0.05]" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#818cf8]/45" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#4f46e5]" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#6366f1]" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[#06b6d4]" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Mobile Swipe Hint */}
      <div className="sm:hidden text-[10px] font-mono text-cyan-400/70 mb-1.5 flex items-center gap-1">
        <span>← Swipe horizontally to view full 52 weeks →</span>
      </div>

      {/* Heatmap Grid Container (Scrollable horizontally on mobile) */}
      <div className="touch-scroll overflow-x-auto pb-1.5">
        <div className="min-w-[720px]">
          
          {/* Months Header */}
          <div className="grid grid-cols-12 text-[10px] font-mono text-slate-400 mb-1.5 pl-6">
            {monthNames.map((m, idx) => (
              <div key={idx} className="text-left">
                {m}
              </div>
            ))}
          </div>

          {/* Grid with Weekday Labels */}
          <div className="flex gap-2">
            {/* Days labels */}
            <div className="flex flex-col justify-between text-[9px] font-mono text-slate-500 py-0.5 select-none w-4">
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
                      onClick={() => setHoveredDay(day)}
                      className={`w-[11px] h-[11px] rounded-[2px] border cursor-pointer transition-all duration-100 hover:scale-125 hover:z-10 hover:ring-1 hover:ring-cyan-400 ${getCellColor(
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

export default CommitHeatmap;
