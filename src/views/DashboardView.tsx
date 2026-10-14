import React from 'react';
import { 
  Flame, 
  Sparkles, 
  Trophy, 
  Terminal, 
  Database, 
  Layout, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  Target, 
  Award,
  ChevronRight,
  Crosshair,
  Shield,
  Zap,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, LearningPath, ViewState, LearningPathId, DailyQuest } from '../types';
import { 
  calculateLevelData, 
  getRankConfig, 
  getRankProgression, 
  StorageService 
} from '../services/storageService';
import { soundFx } from '../services/soundFx';

interface DashboardViewProps {
  user: UserProfile;
  paths: LearningPath[];
  onNavigate: (view: ViewState, pathId?: LearningPathId) => void;
  onSelectChallenge: (challengeId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  paths,
  onNavigate,
  onSelectChallenge
}) => {
  const [quests, setQuests] = React.useState<DailyQuest[]>(() => StorageService.getDailyQuests());
  const [userCoins, setUserCoins] = React.useState(user.coins ?? 240);

  const handleClaimQuest = (questId: string) => {
    soundFx.powerOnChirp();
    const result = StorageService.claimDailyQuest(questId);
    setQuests(result.quests);
    setUserCoins(result.user.coins ?? 240);
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFC53D', '#4CB963', '#7B5CFF']
      });
    } catch {}
  };

  const totalCompleted = (user.completedChallengeIds?.length || 0) + (user.completedVillageIds?.length || 0);
  const levelInfo = calculateLevelData(user.xp, totalCompleted);
  const rankProgression = getRankProgression(user.xp, totalCompleted);
  const rankConfig = rankProgression.currentRankConfig;
  const leaderboardUsers = StorageService.getLeaderboard().slice(0, 5);
  const achievements = StorageService.getAchievements();

  let recommendedChallenge = null;
  for (const path of paths) {
    for (const topic of path.topics) {
      for (const ch of topic.challenges) {
        if (!user.completedChallengeIds.includes(ch.id)) {
          recommendedChallenge = ch;
          break;
        }
      }
      if (recommendedChallenge) break;
    }
    if (recommendedChallenge) break;
  }

  if (!recommendedChallenge && paths[0]?.topics[0]?.challenges[0]) {
    recommendedChallenge = paths[0].topics[0].challenges[0];
  }

  return (
    <div className="w-full flex-1 bg-page text-navy py-6 sm:py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      
      {/* Tactical Agent Banner */}
      <div className="bg-card rounded-2xl border-2 border-border p-6 sm:p-8 game-card relative overflow-hidden transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b-2 border-border">
          <div>
            <div className="flex items-center gap-2 text-xs font-heading font-bold text-muted">
              <span className="text-purple font-extrabold uppercase tracking-wider">TACTICAL DASHBOARD ACTIVE</span>
              <span>·</span>
              <span>CALLSIGN: {user.callsign}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mt-1 font-heading">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs font-sans text-muted mt-1">
              PROGRESS RANK: <span className="font-extrabold font-heading" style={{ color: rankConfig.badgeColor }}>{user.rankTier}</span> · {rankConfig.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-heading">
            <div className="flex items-center gap-1.5 bg-gold/15 border-2 border-gold/40 px-3.5 py-2 rounded-xl font-heading font-extrabold text-xs text-gold shadow-xs" title="Cadet Treasury">
              <span className="text-base leading-none">🪙</span>
              <span>{userCoins} COINS</span>
            </div>

            <button
              onClick={() => {
                soundFx.click();
                onNavigate('paths');
              }}
              onMouseEnter={() => soundFx.hoverTick()}
              className="px-4 py-2.5 text-xs font-bold tracking-wider text-navy game-btn game-btn-card border-2 border-border rounded-xl cursor-pointer"
            >
              CHALLENGES DIRECTORY
            </button>
            {recommendedChallenge && (
              <button
                onClick={() => {
                  soundFx.lockIn();
                  onSelectChallenge(recommendedChallenge.id);
                }}
                onMouseEnter={() => soundFx.hoverTick()}
                className="px-5 py-2.5 text-xs font-extrabold tracking-wider text-white game-btn game-btn-green border-2 border-green rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <Crosshair className="w-4 h-4" />
                <span>ENGAGE RECOMMENDED CHALLENGE</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Tactical Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 font-heading text-xs">
          
          {/* XP & Level */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Earned Experience</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-navy tabular-nums">
              {user.xp} <span className="text-xs text-gold">XP</span>
            </div>
            <div className="text-[11px] text-muted font-sans">
              Level {levelInfo.level} · +{levelInfo.currentLevelXp} XP in tier
            </div>
          </div>

          {/* Progress-Based Rank Progression */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted font-bold uppercase">
              <Crown className="w-3.5 h-3.5" style={{ color: rankConfig.badgeColor }} />
              <span>Competitive Rank</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold" style={{ color: rankConfig.badgeColor }}>
              {user.rankTier}
            </div>
            <div className="space-y-1 font-sans">
              <div className="flex justify-between text-[10px] text-muted font-heading font-bold">
                <span>
                  {rankProgression.nextRank 
                    ? `Next: ${rankProgression.nextRank}` 
                    : 'Max Rank Achieved'}
                </span>
                <span className="text-purple font-extrabold">
                  {rankProgression.nextRank 
                    ? `${rankProgression.xpNeededForNext} XP needed`
                    : 'Platinum Tier'}
                </span>
              </div>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div
                  style={{ 
                    width: `${rankProgression.progressPercent}%`,
                    backgroundColor: rankConfig.badgeColor
                  }}
                  className="h-full rounded-full transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Daily Streak */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted font-bold uppercase">
              <Flame className="w-3.5 h-3.5 text-gold fill-gold" />
              <span>Daily Streak</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-gold tabular-nums">
              {user.streak} <span className="text-xs font-normal text-muted">DAYS</span>
            </div>
            <div className="text-[11px] text-green font-bold">Active today · Streak protected</div>
          </div>

          {/* Accuracy & Solved Count */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted font-bold uppercase">
              <Target className="w-3.5 h-3.5 text-green" />
              <span>Challenge Accuracy</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-green tabular-nums">
              {user.headshotAccuracy}%
            </div>
            <div className="text-[11px] text-muted font-sans">
              {user.completedChallengeIds.length} Challenges Cleared
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid: Recommended Challenge + Paths (Left 8 cols), Leaderboard + Achievements (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8 min-w-0">
          
          {/* DAILY QUESTS CARD */}
          <div className="game-card p-6 bg-card border-2 border-border space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gold/20 text-gold flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5 fill-gold text-gold" />
                </div>
                <div>
                  <h2 className="text-base font-heading font-black text-navy leading-tight">
                    Daily Cadet Quests
                  </h2>
                  <p className="text-[11px] text-muted font-sans font-medium">
                    Reset every 24 hours · Complete for bonus XP and gold coins
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-gold/15 border border-gold/30 px-2.5 py-1 rounded-xl text-xs font-heading font-black text-gold">
                <span>🪙</span>
                <span>{userCoins} Coins</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {quests.map((q) => {
                const percent = Math.min(100, Math.round((q.current / q.target) * 100));
                return (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-2xl border-2 border-border bg-card-subtle flex flex-col justify-between space-y-2.5"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-heading font-black text-navy">{q.title}</span>
                        <span className="text-[10px] font-heading font-bold text-muted">{q.current}/{q.target}</span>
                      </div>
                      <p className="text-[11px] text-muted font-sans mt-0.5 line-clamp-2 leading-tight">
                        {q.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {/* Track */}
                      <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-green to-gold transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      {/* Reward & Button */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="text-[10px] font-heading font-bold text-gold flex items-center gap-1">
                          <span>+{q.rewardXp} XP</span>
                          <span>·</span>
                          <span>+{q.rewardCoins} 🪙</span>
                        </div>

                        {q.claimed ? (
                          <span className="text-[10px] font-heading font-extrabold text-green bg-green/15 px-2 py-0.5 rounded-lg border border-green/30">
                            CLAIMED ✓
                          </span>
                        ) : q.completed ? (
                          <button
                            onClick={() => handleClaimQuest(q.id)}
                            className="game-btn game-btn-gold px-2.5 py-1 rounded-lg text-[10px] font-heading font-black cursor-pointer shadow-xs animate-bounce"
                          >
                            CLAIM!
                          </button>
                        ) : (
                          <span className="text-[10px] font-heading font-bold text-muted bg-card px-2 py-0.5 rounded-lg border border-border">
                            {percent}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommended Challenge Launchpad */}
          {recommendedChallenge && (
            <div className="bg-card text-navy rounded-2xl border-2 border-border p-6 game-card relative overflow-hidden group transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Terminal className="w-32 h-32 text-purple" />
              </div>

              <div className="relative space-y-4">
                <div className="flex items-center justify-between text-xs font-heading">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-purple/15 text-purple font-extrabold border-2 border-purple/30">
                      ACTIVE MISSION TARGET
                    </span>
                    <span className="text-muted">·</span>
                    <span className="text-navy font-bold">{recommendedChallenge.topicTitle}</span>
                  </div>
                  <span className="text-green font-extrabold">+{recommendedChallenge.xpReward} XP REWARD</span>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold tracking-tight text-navy font-heading">
                    {recommendedChallenge.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted mt-1 line-clamp-2 font-sans">
                    {recommendedChallenge.question}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3 text-xs text-muted font-heading font-bold">
                    <span className="uppercase text-purple font-extrabold">{recommendedChallenge.pathId}</span>
                    <span>·</span>
                    <span>{recommendedChallenge.difficulty}</span>
                  </div>

                  <button
                    onClick={() => {
                      soundFx.lockIn();
                      onSelectChallenge(recommendedChallenge.id);
                    }}
                    onMouseEnter={() => soundFx.hoverTick()}
                    className="px-4 py-2 game-btn game-btn-green text-white text-xs font-heading font-extrabold tracking-wider rounded-xl border-2 border-green transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>START CHALLENGE</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Active Learning Specializations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between font-heading text-xs">
              <div>
                <h2 className="text-base font-extrabold text-navy uppercase">
                  LEARNING SPECIALIZATIONS
                </h2>
                <p className="text-muted font-sans">Queue into progressive coding exercises and curriculum</p>
              </div>
              <button
                onClick={() => {
                  soundFx.click();
                  onNavigate('paths');
                }}
                onMouseEnter={() => soundFx.hoverTick()}
                className="text-purple font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>[ ALL CHALLENGES ]</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paths.map((path) => {
                const totalChallenges = path.topics.flatMap((t) => t.challenges).length;
                const solvedCount = path.topics
                  .flatMap((t) => t.challenges)
                  .filter((c) => user.completedChallengeIds.includes(c.id)).length;
                const percent = totalChallenges > 0 ? Math.round((solvedCount / totalChallenges) * 100) : 0;

                return (
                  <div
                    key={path.id}
                    className="p-5 rounded-2xl bg-card border-2 border-border game-card transition-all flex flex-col justify-between space-y-4 min-w-0"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white border border-navy/20"
                          style={{ backgroundColor: path.color }}
                        >
                          {path.id === 'python' ? (
                            <Terminal className="w-4 h-4 text-white" />
                          ) : path.id === 'sql' ? (
                            <Database className="w-4 h-4 text-neutral-950" />
                          ) : (
                            <Layout className="w-4 h-4 text-neutral-950" />
                          )}
                        </div>
                        <span className="text-[11px] font-heading font-bold text-muted tabular-nums">
                          {solvedCount}/{totalChallenges} solved
                        </span>
                      </div>

                      <div>
                        <span className="text-[9px] font-heading font-extrabold tracking-wider text-purple uppercase block">
                          {path.tacticalRole.includes('·') ? path.tacticalRole.split('·')[0].trim() : path.tacticalRole.split('//')[0].trim()}
                        </span>
                        <h4 className="font-extrabold text-navy text-sm font-heading mt-0.5">{path.title}</h4>
                        <p className="text-xs text-muted line-clamp-2 mt-0.5 font-sans">
                          {path.tagline}
                        </p>
                      </div>

                      {/* Track progress */}
                      <div className="space-y-1 font-sans">
                        <div className="flex justify-between text-[10px] font-heading font-bold text-muted">
                          <span>Mastery</span>
                          <span className="text-navy font-extrabold">{percent}%</span>
                        </div>
                        <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                          <div
                            style={{ width: `${percent}%`, backgroundColor: path.color }}
                            className="h-full rounded-full transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        soundFx.click();
                        onNavigate('path-detail', path.id);
                      }}
                      onMouseEnter={() => soundFx.hoverTick()}
                      className="w-full py-2.5 text-xs font-heading font-extrabold text-navy game-btn game-btn-card border-2 border-border rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>QUEUE TRACK</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Daily Target + Leaderboard + Achievements (4 cols) */}
        <div className="lg:col-span-4 space-y-6 min-w-0">
          
          {/* Daily XP Target */}
          <div className="bg-card rounded-2xl border-2 border-border p-5 game-card space-y-3 font-heading text-xs transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-extrabold text-navy">
                <Target className="w-4 h-4 text-purple" />
                <span>DAILY PRACTICE TARGET</span>
              </div>
              <span className="text-green tabular-nums font-extrabold">100 / 100 XP</span>
            </div>

            <div className="w-full h-2.5 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-green rounded-full w-full" />
            </div>

            <p className="text-[11px] text-green font-sans font-bold">
              Daily target secured. Streak protected for today.
            </p>
          </div>

          {/* Mini Leaderboard Preview (Dynamic, Real Statistics) */}
          <div className="bg-card rounded-2xl border-2 border-border p-5 game-card space-y-4 font-heading text-xs transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-extrabold text-navy">
                <Trophy className="w-4 h-4 text-gold" />
                <span>LEADERBOARD</span>
              </div>
              <button
                onClick={() => {
                  soundFx.click();
                  onNavigate('leaderboard');
                }}
                onMouseEnter={() => soundFx.hoverTick()}
                className="text-xs text-purple font-extrabold hover:underline cursor-pointer"
              >
                [ VIEW ALL ]
              </button>
            </div>

            <div className="space-y-2">
              {leaderboardUsers.map((row, idx) => {
                const isYou = row.isCurrentUser || row.id === 'u-current';
                const rowRankConfig = getRankConfig(row.rankTier);
                return (
                  <div
                    key={row.id || idx}
                    className={`flex items-center justify-between p-2.5 rounded-xl transition-colors ${
                      isYou
                        ? 'bg-purple/15 font-bold text-navy border-2 border-purple/40'
                        : 'text-navy hover:bg-card-subtle'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-4 text-center font-extrabold text-muted shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="truncate max-w-[110px] text-xs font-extrabold text-navy">
                          {row.callsign} {isYou ? '(YOU)' : ''}
                        </span>
                        <span className="text-[9px] font-bold" style={{ color: rowRankConfig.badgeColor }}>
                          {row.rankTier}
                        </span>
                      </div>
                    </div>
                    <span className="tabular-nums text-gold font-extrabold shrink-0">{row.rr} XP</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unlocked Achievements / Honors */}
          <div className="bg-card rounded-2xl border-2 border-border p-5 game-card space-y-3 font-heading text-xs transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-navy">ACHIEVEMENTS</span>
              <button
                onClick={() => {
                  soundFx.click();
                  onNavigate('profile');
                }}
                onMouseEnter={() => soundFx.hoverTick()}
                className="text-xs text-purple font-extrabold hover:underline cursor-pointer"
              >
                [ DOSSIER ]
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {achievements.slice(0, 3).map((badge) => (
                <div 
                  key={badge.id}
                  className={`p-2.5 rounded-2xl border-2 text-center space-y-1 transition-colors game-card-subtle ${
                    badge.isUnlocked
                      ? 'bg-card-subtle border-border'
                      : 'bg-card/50 border-border/50 opacity-60'
                  }`}
                  title={badge.description}
                >
                  <div className={`w-8 h-8 mx-auto rounded-xl flex items-center justify-center border-2 ${
                    badge.isUnlocked ? 'bg-purple/20 text-purple border-purple/30' : 'bg-card-subtle text-muted border-border'
                  }`}>
                    {badge.id.includes('blood') ? (
                      <Crosshair className="w-4 h-4" />
                    ) : badge.id.includes('streak') ? (
                      <Flame className="w-4 h-4" />
                    ) : (
                      <Shield className="w-4 h-4" />
                    )}
                  </div>
                  <div className="text-[9px] font-bold text-navy truncate">
                    {badge.title}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  </div>
);
};
