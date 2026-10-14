import React, { useState } from 'react';
import { Trophy, Medal, Flame, Sparkles, ArrowLeft, Search, Crosshair, Crown, Target, Zap } from 'lucide-react';
import { LeaderboardUser, UserProfile } from '../types';
import { soundFx } from '../services/soundFx';
import { getRankConfig } from '../services/storageService';

interface LeaderboardViewProps {
  board: LeaderboardUser[];
  user: UserProfile;
  onBack: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  board,
  user,
  onBack
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'weekly' | 'monthly' | 'all-time'>('weekly');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = board
    .map((u) => {
      let adjustedXp = u.rr;
      if (filterPeriod === 'weekly') {
        adjustedXp = Math.round(u.rr * 0.42);
      } else if (filterPeriod === 'monthly') {
        adjustedXp = Math.round(u.rr * 0.78);
      }
      return { ...u, displayXp: adjustedXp };
    })
    .sort((a, b) => b.displayXp - a.displayXp)
    .map((u, idx) => ({ ...u, dynamicRank: idx + 1 }))
    .filter((u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.callsign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.primaryPath.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const topThree = filteredUsers.slice(0, 3);

  return (
    <div className="w-full flex-1 bg-[var(--bg-app)] text-[var(--text-primary)] py-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
        <div>
          <button
            onClick={() => {
              soundFx.click();
              onBack();
            }}
            onMouseEnter={() => soundFx.hoverTick()}
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-navy font-heading font-bold transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>[ RETURN TO DASHBOARD ]</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight flex items-center gap-2.5 font-heading">
            <Crown className="w-7 h-7 text-gold" />
            <span>GLOBAL LEADERBOARD</span>
          </h1>
          <p className="text-xs text-muted mt-1 font-sans">
            Global competitive ratings across Python, SQL, Java, and AI disciplines.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-card rounded-2xl border-2 border-border game-card w-fit text-xs font-heading font-extrabold">
          <button
            onClick={() => {
              soundFx.click();
              setFilterPeriod('weekly');
            }}
            onMouseEnter={() => soundFx.hoverTick()}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer border-2 ${
              filterPeriod === 'weekly'
                ? 'game-btn game-btn-purple text-white border-purple'
                : 'game-btn game-btn-card text-navy border-border'
            }`}
          >
            WEEKLY CUP
          </button>
          <button
            onClick={() => {
              soundFx.click();
              setFilterPeriod('monthly');
            }}
            onMouseEnter={() => soundFx.hoverTick()}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer border-2 ${
              filterPeriod === 'monthly'
                ? 'game-btn game-btn-purple text-white border-purple'
                : 'game-btn game-btn-card text-navy border-border'
            }`}
          >
            SEASON RANK
          </button>
          <button
            onClick={() => {
              soundFx.click();
              setFilterPeriod('all-time');
            }}
            onMouseEnter={() => soundFx.hoverTick()}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer border-2 ${
              filterPeriod === 'all-time'
                ? 'game-btn game-btn-purple text-white border-purple'
                : 'game-btn game-btn-card text-navy border-border'
            }`}
          >
            ALL-TIME STANDINGS
          </button>
        </div>
      </div>

      {/* Top 3 Podium Highlights */}
      {topThree.length >= 3 && !searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 font-heading">
          
          {/* Silver - 2nd place */}
          <div className="order-2 md:order-1 bg-card rounded-2xl border-2 border-border p-5 game-card text-center space-y-3 transition-colors">
            <div className="w-8 h-8 mx-auto rounded-xl bg-card-subtle text-muted flex items-center justify-center font-bold text-xs border-2 border-border">
              #2
            </div>
            <div className="w-14 h-14 mx-auto rounded-xl ring-2 ring-border overflow-hidden">
              <img src={topThree[1].avatar} alt={topThree[1].name} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-[10px] font-bold block" style={{ color: getRankConfig(topThree[1].rankTier).badgeColor }}>
                {topThree[1].rankTier}
              </span>
              <h3 className="font-extrabold text-navy text-base">{topThree[1].callsign}</h3>
              <p className="text-[11px] text-muted font-sans">@{topThree[1].username}</p>
            </div>
            <div className="font-extrabold text-xl text-navy tabular-nums">
              {topThree[1].displayXp} <span className="text-xs text-gold">XP</span>
            </div>
            <div className="text-[11px] text-muted font-sans">{topThree[1].primaryPath}</div>
          </div>

          {/* Gold - 1st place */}
          <div className="order-1 md:order-2 bg-card rounded-2xl border-2 border-gold p-6 game-card text-center space-y-3 relative md:-translate-y-2 ring-2 ring-gold/30 transition-colors">
            <div className="w-9 h-9 mx-auto rounded-xl bg-gold/20 text-gold flex items-center justify-center font-bold text-sm border-2 border-gold">
              <Crown className="w-5 h-5 text-gold" />
            </div>
            <div className="w-16 h-16 mx-auto rounded-xl ring-4 ring-gold/40 overflow-hidden shadow-sm">
              <img src={topThree[0].avatar} alt={topThree[0].name} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold tracking-wider block" style={{ color: getRankConfig(topThree[0].rankTier).badgeColor }}>
                {topThree[0].rankTier} #1
              </span>
              <h3 className="font-extrabold text-navy text-lg">{topThree[0].callsign}</h3>
              <p className="text-xs text-muted font-sans">@{topThree[0].username}</p>
            </div>
            <div className="font-extrabold text-2xl text-navy tabular-nums">
              {topThree[0].displayXp} <span className="text-xs text-gold">XP</span>
            </div>
            <div className="text-xs text-green font-bold">{topThree[0].primaryPath} · 98.4% ACC</div>
          </div>

          {/* Bronze - 3rd place */}
          <div className="order-3 bg-card rounded-2xl border-2 border-border p-5 game-card text-center space-y-3 transition-colors">
            <div className="w-8 h-8 mx-auto rounded-xl bg-card-subtle text-muted flex items-center justify-center font-bold text-xs border-2 border-border">
              #3
            </div>
            <div className="w-14 h-14 mx-auto rounded-xl ring-2 ring-border overflow-hidden">
              <img src={topThree[2].avatar} alt={topThree[2].name} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-[10px] font-bold block" style={{ color: getRankConfig(topThree[2].rankTier).badgeColor }}>
                {topThree[2].rankTier}
              </span>
              <h3 className="font-extrabold text-navy text-base">{topThree[2].callsign}</h3>
              <p className="text-[11px] text-muted font-sans">@{topThree[2].username}</p>
            </div>
            <div className="font-extrabold text-xl text-navy tabular-nums">
              {topThree[2].displayXp} <span className="text-xs text-gold">XP</span>
            </div>
            <div className="text-[11px] text-muted font-sans">{topThree[2].primaryPath}</div>
          </div>

        </div>
      )}

      {/* Search Filter */}
      <div className="relative max-w-sm font-sans text-xs">
        <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="SEARCH CALLSIGN OR DISCIPLINE..."
          className="w-full pl-9 pr-4 py-2.5 bg-card border-2 border-border rounded-xl text-navy placeholder:text-muted focus:outline-none focus:border-purple"
        />
      </div>

      {/* Leaderboard Table */}
      <div className="bg-card rounded-2xl border-2 border-border overflow-hidden game-card font-sans text-xs transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-card-subtle border-b-2 border-border text-muted uppercase tracking-wider text-[11px] font-heading font-bold">
                <th className="py-3 px-4 w-16 text-center">RANK</th>
                <th className="py-3 px-4">AGENT CALLSIGN</th>
                <th className="py-3 px-4 hidden sm:table-cell">PROGRESS RANK</th>
                <th className="py-3 px-4 text-center">ACCURACY</th>
                <th className="py-3 px-4 text-right">RATING (XP)</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border">
              {filteredUsers.map((u) => {
                const isCurrent = u.isCurrentUser || u.username === user.username;
                const rowRankConfig = getRankConfig(u.rankTier);

                return (
                  <tr
                    key={u.id}
                    onMouseEnter={() => soundFx.hoverTick()}
                    className={`transition-colors ${
                      isCurrent
                        ? 'bg-purple/15 font-bold text-navy border-l-4 border-purple'
                        : 'hover:bg-card-subtle text-navy'
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center font-heading font-extrabold">
                      {u.dynamicRank === 1 ? (
                        <span className="text-gold font-extrabold font-heading">#1</span>
                      ) : u.dynamicRank === 2 ? (
                        <span className="text-muted font-bold font-heading">#2</span>
                      ) : u.dynamicRank === 3 ? (
                        <span className="text-gold font-bold font-heading">#3</span>
                      ) : (
                        <span className="text-muted tabular-nums font-heading">#{u.dynamicRank}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl overflow-hidden bg-card-subtle shrink-0 ring-2 ring-border">
                          <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-extrabold text-navy font-heading truncate flex items-center gap-1.5">
                            <span>{u.callsign}</span>
                            {isCurrent && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-lg bg-purple text-white font-heading font-bold">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-muted">{u.primaryPath}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <span className="font-bold px-2 py-0.5 rounded text-[11px]" style={{
                        color: rowRankConfig.badgeColor,
                        backgroundColor: rowRankConfig.badgeBg,
                        border: `1px solid ${rowRankConfig.badgeColor}40`
                      }}>
                        {u.rankTier}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center tabular-nums text-emerald-500 font-bold">
                      {u.headshotAccuracy}%
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-[var(--text-primary)] tabular-nums text-sm">
                      {u.displayXp} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      </div>

    </div>
  );
};
