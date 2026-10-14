import { UserProfile, LearningPath, AchievementBadge, LeaderboardUser, DailyActivity, CompetitiveRank, DailyQuest } from '../types';
import { INITIAL_LEARNING_PATHS, INITIAL_ACHIEVEMENTS, INITIAL_LEADERBOARD, INITIAL_WEEKLY_ACTIVITY } from './mockData';

const STORAGE_KEYS = {
  USER: 'codesprint_tactical_user_v2',
  PATHS: 'codesprint_tactical_paths_v2',
  ACHIEVEMENTS: 'codesprint_tactical_achievements_v2',
  LEADERBOARD: 'codesprint_tactical_leaderboard_v2',
  ACTIVITY: 'codesprint_tactical_activity_v2',
  QUESTS: 'codesprint_daily_quests_v1',
};

export interface RankConfig {
  rank: CompetitiveRank;
  minXp: number;
  minCompleted: number; // completed challenges / checkpoints
  description: string;
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
}

export const RANK_THRESHOLDS: RankConfig[] = [
  {
    rank: 'Platinum',
    minXp: 3000,
    minCompleted: 10,
    description: 'Elite programming mastery across complex challenges and advanced villages.',
    badgeColor: '#00F5D4',
    badgeBg: 'rgba(0, 245, 212, 0.15)',
    badgeBorder: '#00F5D4',
    textColor: 'text-[#00F5D4]'
  },
  {
    rank: 'Gold',
    minXp: 1600,
    minCompleted: 5,
    description: 'Proven engineer demonstrating command across challenges and islands.',
    badgeColor: '#F59E0B',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    badgeBorder: '#F59E0B',
    textColor: 'text-amber-400'
  },
  {
    rank: 'Silver',
    minXp: 700,
    minCompleted: 2,
    description: 'Solid foundation in core coding concepts and syntax fundamentals.',
    badgeColor: '#94A3B8',
    badgeBg: 'rgba(148, 163, 184, 0.15)',
    badgeBorder: '#94A3B8',
    textColor: 'text-slate-300'
  },
  {
    rank: 'Bronze',
    minXp: 0,
    minCompleted: 0,
    description: 'Initiate engineer commencing tactical drills and fundamentals.',
    badgeColor: '#CD7F32',
    badgeBg: 'rgba(205, 127, 50, 0.15)',
    badgeBorder: '#CD7F32',
    textColor: 'text-[#E0A96D]'
  }
];

export function getRankConfig(rank: CompetitiveRank): RankConfig {
  return RANK_THRESHOLDS.find(r => r.rank === rank) || RANK_THRESHOLDS[RANK_THRESHOLDS.length - 1];
}

export function calculateRankTier(xp: number, completedCount: number = 0): CompetitiveRank {
  for (const item of RANK_THRESHOLDS) {
    if (xp >= item.minXp && completedCount >= item.minCompleted) {
      return item.rank;
    }
  }
  return 'Bronze';
}

export function getRankProgression(xp: number, completedCount: number = 0): {
  currentRank: CompetitiveRank;
  nextRank: CompetitiveRank | null;
  xpNeededForNext: number;
  completedNeededForNext: number;
  progressPercent: number;
  currentRankConfig: RankConfig;
  nextRankConfig: RankConfig | null;
} {
  const currentRank = calculateRankTier(xp, completedCount);
  const currentRankConfig = getRankConfig(currentRank);
  const currentIndex = RANK_THRESHOLDS.findIndex(r => r.rank === currentRank);

  if (currentIndex <= 0) {
    return {
      currentRank,
      nextRank: null,
      xpNeededForNext: 0,
      completedNeededForNext: 0,
      progressPercent: 100,
      currentRankConfig,
      nextRankConfig: null
    };
  }

  const nextRankConfig = RANK_THRESHOLDS[currentIndex - 1];
  const xpSpan = Math.max(1, nextRankConfig.minXp - currentRankConfig.minXp);
  const currentXpIntoTier = Math.max(0, xp - currentRankConfig.minXp);
  const xpPercent = Math.min(100, Math.round((currentXpIntoTier / xpSpan) * 100));

  const xpNeeded = Math.max(0, nextRankConfig.minXp - xp);
  const completedNeeded = Math.max(0, nextRankConfig.minCompleted - completedCount);

  return {
    currentRank,
    nextRank: nextRankConfig.rank,
    xpNeededForNext: xpNeeded,
    completedNeededForNext: completedNeeded,
    progressPercent: xpPercent,
    currentRankConfig,
    nextRankConfig
  };
}

export const LEVEL_THRESHOLDS = [0, 500, 1200, 2000, 3000, 4500, 6500, 9000];

export function calculateLevelData(totalXp: number, completedCount: number = 0): {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
  rankTier: CompetitiveRank;
} {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length - 1; i++) {
    if (totalXp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    }
  }

  const baseForCurrent = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const targetForNext = LEVEL_THRESHOLDS[level] ?? (baseForCurrent + 1500);
  const needed = targetForNext - baseForCurrent;
  const currentLevelProgress = Math.max(0, totalXp - baseForCurrent);
  const progressPercent = Math.min(100, Math.round((currentLevelProgress / needed) * 100));

  return {
    level,
    currentLevelXp: currentLevelProgress,
    nextLevelXp: needed,
    progressPercent,
    rankTier: calculateRankTier(totalXp, completedCount)
  };
}

const DEFAULT_USER: UserProfile = {
  id: 'u-current',
  name: 'Alex Chen',
  callsign: 'VORTEX',
  username: 'vortex_dev',
  email: 'alex.chen@codesprint.gg',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
  rankTier: 'Gold',
  level: 3,
  xp: 1850,
  xpToNextLevel: 150,
  streak: 5,
  headshotAccuracy: 94.2,
  totalMatchesWon: 28,
  completedChallengeIds: ['py-ch-1', 'py-ch-2', 'py-ch-4', 'sql-ch-1', 'web-ch-1'],
  joinedDate: 'September 2026',
  dailyGoalXp: 100,
  soundEnabled: true,
  theme: 'tactical',
  primaryPath: 'python',
  coins: 240
};

export const DEFAULT_DAILY_QUESTS: DailyQuest[] = [
  {
    id: 'quest-village',
    title: 'Village Explorer',
    description: 'Solve and master at least 1 village challenge',
    current: 1,
    target: 1,
    rewardXp: 100,
    rewardCoins: 50,
    completed: true,
    claimed: false
  },
  {
    id: 'quest-combo',
    title: 'Streak Striker',
    description: 'Achieve a 3x answer combo multiplier in quiz',
    current: 2,
    target: 3,
    rewardXp: 120,
    rewardCoins: 60,
    completed: false,
    claimed: false
  },
  {
    id: 'quest-xp',
    title: 'Knowledge Harvester',
    description: 'Accumulate 150 total XP across programming sessions',
    current: 120,
    target: 150,
    rewardXp: 150,
    rewardCoins: 80,
    completed: false,
    claimed: false
  }
];

export class StorageService {
  static getUser(): UserProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      if (stored) {
        const user: UserProfile = JSON.parse(stored);
        const totalCompleted = (user.completedChallengeIds?.length || 0) + (user.completedVillageIds?.length || 0);
        user.rankTier = calculateRankTier(user.xp, totalCompleted);
        user.coins = user.coins ?? 240;
        return user;
      }
    } catch {}
    this.saveUser(DEFAULT_USER);
    return DEFAULT_USER;
  }

  static saveUser(user: UserProfile): void {
    try {
      const totalCompleted = (user.completedChallengeIds?.length || 0) + (user.completedVillageIds?.length || 0);
      user.rankTier = calculateRankTier(user.xp, totalCompleted);
      user.coins = user.coins ?? 240;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch {}
  }

  static addCoins(amount: number): UserProfile {
    const user = this.getUser();
    const updated = { ...user, coins: (user.coins || 0) + amount };
    this.saveUser(updated);
    return updated;
  }

  static getDailyQuests(): DailyQuest[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.QUESTS);
      if (stored) return JSON.parse(stored);
    } catch {}
    this.saveDailyQuests(DEFAULT_DAILY_QUESTS);
    return DEFAULT_DAILY_QUESTS;
  }

  static saveDailyQuests(quests: DailyQuest[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
    } catch {}
  }

  static claimDailyQuest(questId: string): { user: UserProfile; quests: DailyQuest[] } {
    const quests = this.getDailyQuests();
    const quest = quests.find(q => q.id === questId);
    let user = this.getUser();
    if (quest && quest.completed && !quest.claimed) {
      quest.claimed = true;
      this.saveDailyQuests(quests);
      user = {
        ...user,
        xp: user.xp + quest.rewardXp,
        coins: (user.coins || 0) + quest.rewardCoins
      };
      this.saveUser(user);
    }
    return { user, quests };
  }

  static incrementQuestProgress(type: 'village' | 'combo' | 'xp', amount = 1): void {
    const quests = this.getDailyQuests();
    let updated = false;
    quests.forEach(q => {
      if (!q.completed) {
        if (type === 'village' && q.id === 'quest-village') {
          q.current = Math.min(q.target, q.current + amount);
          if (q.current >= q.target) q.completed = true;
          updated = true;
        } else if (type === 'combo' && q.id === 'quest-combo') {
          q.current = Math.min(q.target, Math.max(q.current, amount));
          if (q.current >= q.target) q.completed = true;
          updated = true;
        } else if (type === 'xp' && q.id === 'quest-xp') {
          q.current = Math.min(q.target, q.current + amount);
          if (q.current >= q.target) q.completed = true;
          updated = true;
        }
      }
    });
    if (updated) {
      this.saveDailyQuests(quests);
    }
  }

  static getPaths(): LearningPath[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PATHS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    this.savePaths(INITIAL_LEARNING_PATHS);
    return INITIAL_LEARNING_PATHS;
  }

  static savePaths(paths: LearningPath[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PATHS, JSON.stringify(paths));
    } catch {}
  }

  static getAchievements(): AchievementBadge[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    this.saveAchievements(INITIAL_ACHIEVEMENTS);
    return INITIAL_ACHIEVEMENTS;
  }

  static saveAchievements(badges: AchievementBadge[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(badges));
    } catch {}
  }

  static getLeaderboard(): LeaderboardUser[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      const currentUser = stored ? JSON.parse(stored) : DEFAULT_USER;
      const storedBoard = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      const board: LeaderboardUser[] = storedBoard ? JSON.parse(storedBoard) : INITIAL_LEADERBOARD;
      
      // Sanitize all board ranks to match the 4 ranks
      return board.map(u => {
        if (u.isCurrentUser || u.id === 'u-current') {
          const totalCompleted = (currentUser.completedChallengeIds?.length || 0) + (currentUser.completedVillageIds?.length || 0);
          return {
            ...u,
            rr: currentUser.xp,
            level: currentUser.level,
            rankTier: calculateRankTier(currentUser.xp, totalCompleted)
          };
        }
        // Normalize any legacy ranks
        const rankTier = calculateRankTier(u.rr, Math.round(u.rr / 250));
        return { ...u, rankTier };
      });
    } catch {}
    this.saveLeaderboard(INITIAL_LEADERBOARD);
    return INITIAL_LEADERBOARD;
  }

  static saveLeaderboard(board: LeaderboardUser[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(board));
    } catch {}
  }

  static getActivity(): DailyActivity[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    this.saveActivity(INITIAL_WEEKLY_ACTIVITY);
    return INITIAL_WEEKLY_ACTIVITY;
  }

  static saveActivity(activity: DailyActivity[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(activity));
    } catch {}
  }

  static completeChallenge(challengeId: string, xpEarned: number): {
    user: UserProfile;
    leveledUp: boolean;
    rankedUp: boolean;
    alreadyCompleted: boolean;
    newBadges: AchievementBadge[];
  } {
    const user = this.getUser();
    const alreadyCompleted = user.completedChallengeIds.includes(challengeId);

    const oldLevel = user.level;
    const oldRank = user.rankTier;
    const finalXpEarned = alreadyCompleted ? 0 : xpEarned;
    const newTotalXp = user.xp + finalXpEarned;
    const newCompletedChallengeIds = alreadyCompleted
      ? user.completedChallengeIds
      : [...user.completedChallengeIds, challengeId];
    const totalCompleted = newCompletedChallengeIds.length + (user.completedVillageIds?.length || 0);
    const levelInfo = calculateLevelData(newTotalXp, totalCompleted);

    const updatedUser: UserProfile = {
      ...user,
      xp: newTotalXp,
      level: levelInfo.level,
      rankTier: levelInfo.rankTier,
      xpToNextLevel: levelInfo.nextLevelXp - levelInfo.currentLevelXp,
      totalMatchesWon: alreadyCompleted ? user.totalMatchesWon : user.totalMatchesWon + 1,
      completedChallengeIds: newCompletedChallengeIds
    };

    this.saveUser(updatedUser);

    if (!alreadyCompleted && finalXpEarned > 0) {
      const activity = this.getActivity();
      const todayIndex = activity.findIndex(a => a.day === 'SUN');
      if (todayIndex >= 0) {
        activity[todayIndex].challenges += 1;
        activity[todayIndex].xp += finalXpEarned;
        this.saveActivity(activity);
      }

      const board = this.getLeaderboard();
      const userIndex = board.findIndex(u => u.isCurrentUser || u.id === 'u-current');
      if (userIndex >= 0) {
        board[userIndex].rr = newTotalXp;
        board[userIndex].level = levelInfo.level;
        board[userIndex].rankTier = levelInfo.rankTier;
        board.sort((a, b) => b.rr - a.rr);
        board.forEach((u, idx) => {
          u.rank = idx + 1;
        });
        this.saveLeaderboard(board);
      }
    }

    const newBadges: AchievementBadge[] = [];
    const achievements = this.getAchievements();
    achievements.forEach(badge => {
      if (!badge.isUnlocked) {
        if (badge.id === 'badge-first-blood' && updatedUser.completedChallengeIds.length >= 1) {
          badge.isUnlocked = true;
          badge.unlockedAt = new Date().toISOString().split('T')[0];
          newBadges.push(badge);
        } else if (badge.id === 'badge-streak-7' && updatedUser.streak >= 7) {
          badge.isUnlocked = true;
          badge.unlockedAt = new Date().toISOString().split('T')[0];
          newBadges.push(badge);
        }
      }
    });
    if (newBadges.length > 0) {
      this.saveAchievements(achievements);
    }

    return {
      user: updatedUser,
      leveledUp: levelInfo.level > oldLevel,
      rankedUp: levelInfo.rankTier !== oldRank,
      alreadyCompleted,
      newBadges
    };
  }

  static resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.PATHS);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITY);
  }
}
