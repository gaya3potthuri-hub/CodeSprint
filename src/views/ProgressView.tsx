import React, { useState } from 'react';
import { 
  BarChart3, 
  ArrowLeft, 
  Flame, 
  Target, 
  CheckCircle2, 
  Sparkles,
  Terminal, 
  Database, 
  Layout, 
  Crosshair, 
  Shield, 
  Zap,
  Crown
} from 'lucide-react';
import { UserProfile, LearningPath, DailyActivity } from '../types';
import { soundFx } from '../services/soundFx';
import { getRankConfig } from '../services/storageService';

interface ProgressViewProps {
  user: UserProfile;
  paths: LearningPath[];
  activity: DailyActivity[];
  onBack: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  user,
  paths,
  activity,
  onBack
}) => {
  const [activeTooltipIdx, setActiveTooltipIdx] = useState<number | null>(null);

  const totalChallenges = paths.flatMap((p) => p.topics.flatMap((t) => t.challenges)).length;
  const completedCount = user.completedChallengeIds.length;
  const overallPercentage = totalChallenges > 0 ? Math.round((completedCount / totalChallenges) * 100) : 0;
  const rankConfig = getRankConfig(user.rankTier);

  return (
    <div className="w-full flex-1 bg-[var(--bg-app)] text-[var(--text-primary)] py-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      
      {/* Header */}
      <div className="font-mono">
        <button
          onClick={() => {
            soundFx.click();
            onBack();
          }}
          onMouseEnter={() => soundFx.hoverTick()}
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-navy transition-colors mb-2 cursor-pointer font-heading font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>[ RETURN TO DASHBOARD ]</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight flex items-center gap-2.5 font-heading">
          <BarChart3 className="w-7 h-7 text-purple" />
          <span>LEARNING ANALYTICS & ACCURACY</span>
        </h1>
        <p className="text-xs text-muted mt-1 font-sans">
          Real-time metrics tracking your challenge execution rate, first-try accuracy, and learning velocity.
        </p>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 font-heading text-xs">
        
        <div className="bg-card p-5 rounded-2xl border-2 border-border game-card space-y-1 transition-colors">
          <div className="flex items-center gap-1.5 text-muted font-bold">
            <CheckCircle2 className="w-4 h-4 text-green" />
            <span>CHALLENGES CLEARED</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-navy tabular-nums">
            {completedCount} <span className="text-xs font-normal text-muted">/ {totalChallenges}</span>
          </div>
          <div className="text-[11px] text-green font-bold">{overallPercentage}% overall completion</div>
        </div>

        <div className="bg-card p-5 rounded-2xl border-2 border-border game-card space-y-1 transition-colors">
          <div className="flex items-center gap-1.5 text-muted font-bold">
            <Crosshair className="w-4 h-4 text-purple" />
            <span>ACCURACY RATE</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-navy tabular-nums">
            {user.headshotAccuracy}%
          </div>
          <div className="text-[11px] text-green font-bold">+2.1% this week</div>
        </div>

        <div className="bg-card p-5 rounded-2xl border-2 border-border game-card space-y-1 transition-colors">
          <div className="flex items-center gap-1.5 text-muted font-bold">
            <Flame className="w-4 h-4 text-gold fill-gold" />
            <span>DAILY STREAK</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gold tabular-nums">
            {user.streak} <span className="text-xs font-normal text-muted">DAYS</span>
          </div>
          <div className="text-[11px] text-muted">Active daily streak</div>
        </div>

        <div className="bg-card p-5 rounded-2xl border-2 border-border game-card space-y-1 transition-colors">
          <div className="flex items-center gap-1.5 text-muted font-bold">
            <Crown className="w-4 h-4" style={{ color: rankConfig.badgeColor }} />
            <span>PROGRESS RANK</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tabular-nums" style={{ color: rankConfig.badgeColor }}>
            {user.rankTier}
          </div>
          <div className="text-[11px] text-muted">{user.xp} XP earned</div>
        </div>

      </div>

      {/* Interactive Weekly Bar Chart Card */}
      <div className="bg-card rounded-2xl border-2 border-border p-6 sm:p-8 game-card space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-heading">
          <div>
            <h2 className="text-base font-extrabold text-navy uppercase">7-DAY SPRINT VELOCITY</h2>
            <p className="text-xs text-muted font-sans">Challenges solved and XP gained across recent activity</p>
          </div>
          <div className="text-xs text-purple bg-purple/10 border-2 border-purple/30 px-2.5 py-1 rounded-xl w-fit font-bold">
            DAILY TARGET: {user.dailyGoalXp} XP
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 pt-6 px-4 bg-card-subtle rounded-2xl border-2 border-border">
          {activity.map((act, idx) => {
            const isHighest = act.challenges === Math.max(...activity.map((a) => a.challenges));

            return (
              <div
                key={act.day}
                className="flex-1 flex flex-col items-center gap-2 group relative cursor-pointer"
                onMouseEnter={() => {
                  soundFx.hoverTick();
                  setActiveTooltipIdx(idx);
                }}
                onMouseLeave={() => setActiveTooltipIdx(null)}
              >
                {/* Tooltip */}
                <div
                  className={`absolute -top-12 bg-card text-navy text-[11px] font-heading p-2 rounded-xl pointer-events-none whitespace-nowrap shadow-md border-2 border-border transition-all z-10 ${
                    activeTooltipIdx === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                >
                  <p className="font-bold text-navy">{act.date}</p>
                  <p className="text-green font-bold">+{act.xp} XP · {act.challenges} challenges</p>
                </div>

                {/* Bar */}
                <div className="w-full bg-border rounded-t-lg h-40 flex items-end">
                  <div
                    style={{ height: `${Math.max(10, (act.challenges / 7) * 100)}%` }}
                    className={`w-full rounded-t-lg transition-all ${
                      isHighest
                        ? 'bg-gradient-to-t from-purple to-green'
                        : 'bg-purple/70 group-hover:bg-purple'
                    }`}
                  />
                </div>

                <div className="text-center font-heading">
                  <span className="block text-xs font-bold text-navy">{act.day}</span>
                  <span className="block text-[10px] text-muted tabular-nums font-sans">+{act.xp}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Specialization Breakdown */}
      <div className="bg-card rounded-2xl border-2 border-border p-6 sm:p-8 game-card space-y-6 transition-colors">
        <div className="font-heading">
          <h2 className="text-base font-extrabold text-navy uppercase">SPECIALIZATION CLEARANCE</h2>
          <p className="text-xs text-muted font-sans">Mastery distribution across learning paths</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs">
          {paths.map((p) => {
            const pathChallenges = p.topics.flatMap((t) => t.challenges);
            const done = pathChallenges.filter((ch) => user.completedChallengeIds.includes(ch.id)).length;
            const pct = pathChallenges.length > 0 ? Math.round((done / pathChallenges.length) * 100) : 0;

            return (
              <div key={p.id} className="p-5 rounded-2xl border-2 border-border bg-card-subtle game-card space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-7 h-7 rounded-xl flex items-center justify-center text-white border border-navy/20"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.id === 'python' ? (
                        <Terminal className="w-3.5 h-3.5" />
                      ) : p.id === 'sql' ? (
                        <Database className="w-3.5 h-3.5 text-neutral-950" />
                      ) : (
                        <Layout className="w-3.5 h-3.5 text-neutral-950" />
                      )}
                    </span>
                    <h3 className="font-extrabold text-navy text-sm font-heading">{p.title}</h3>
                  </div>
                  <span className="font-extrabold text-navy tabular-nums font-heading">{pct}%</span>
                </div>

                <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%`, backgroundColor: p.color }}
                    className="h-full rounded-full transition-all"
                  />
                </div>

                <div className="text-[11px] text-muted flex justify-between font-medium">
                  <span>{done} of {pathChallenges.length} cleared</span>
                  <span>{p.topics.length} sectors</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      </div>

    </div>
  );
};
