import { ProgrammingIsland, ProgrammingIslandId, Village, VillageState, VillageScore, QuizAttemptResult } from '../types';
import { PROGRAMMING_ISLANDS, getIslandById } from './codingWorldData';
import { StorageService, calculateLevelData } from './storageService';

const VILLAGE_STORAGE_KEY = 'codesprint_village_progress_v1';

interface StoredVillageData {
  state: VillageState;
  bestScore?: VillageScore;
  attemptsCount: number;
}

interface StoredProgressMap {
  [villageId: string]: StoredVillageData;
}

export class VillageProgressService {
  private static getStoredMap(): StoredProgressMap {
    try {
      const raw = localStorage.getItem(VILLAGE_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {}
    // Initial defaults: Village 1 on all 4 islands is 'available', others 'locked'
    const initialMap: StoredProgressMap = {};
    PROGRAMMING_ISLANDS.forEach((island) => {
      island.villages.forEach((village) => {
        initialMap[village.id] = {
          state: village.order === 1 ? 'available' : 'locked',
          attemptsCount: 0
        };
      });
    });
    this.saveStoredMap(initialMap);
    return initialMap;
  }

  private static saveStoredMap(map: StoredProgressMap): void {
    try {
      localStorage.setItem(VILLAGE_STORAGE_KEY, JSON.stringify(map));
    } catch {}
  }

  /**
   * Get all 4 islands merged with current saved student progress.
   */
  public static getIslands(): ProgrammingIsland[] {
    const progressMap = this.getStoredMap();

    return PROGRAMMING_ISLANDS.map((island) => {
      const mergedVillages: Village[] = island.villages.map((village) => {
        const stored = progressMap[village.id];
        let state: VillageState = stored?.state ?? (village.order === 1 ? 'available' : 'locked');
        
        return {
          ...village,
          state,
          bestScore: stored?.bestScore
        };
      });

      return {
        ...island,
        villages: mergedVillages
      };
    });
  }

  /**
   * Get a single island merged with progress.
   */
  public static getIsland(islandId: ProgrammingIslandId): ProgrammingIsland {
    const islands = this.getIslands();
    return islands.find((i) => i.id === islandId) || islands[0];
  }

  /**
   * Get stats for an island: completed villages, total, % progress.
   */
  public static getIslandStats(islandId: ProgrammingIslandId): {
    completedCount: number;
    totalCount: number;
    progressPercent: number;
    currentLevel: number;
  } {
    const island = this.getIsland(islandId);
    const totalCount = island.villages.length;
    const completedCount = island.villages.filter((v) => v.state === 'completed').length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const currentLevel = Math.min(totalCount, completedCount + 1);

    return {
      completedCount,
      totalCount,
      progressPercent,
      currentLevel
    };
  }

  /**
   * Record a completed quiz attempt.
   * If passed (>= 70%): marks village completed, awards XP without repeat farming, and unlocks next village!
   */
  public static recordQuizAttempt(result: QuizAttemptResult): {
    unlockedVillageTitle?: string;
    xpAwarded: number;
    isFirstCompletion: boolean;
  } {
    const progressMap = this.getStoredMap();
    const current = progressMap[result.villageId] || {
      state: 'available',
      attemptsCount: 0
    };

    current.attemptsCount = (current.attemptsCount || 0) + 1;
    const isFirstCompletion = current.state !== 'completed' && result.passed;

    // Save or update best score
    if (!current.bestScore || result.correctCount > current.bestScore.score) {
      current.bestScore = {
        score: result.correctCount,
        total: result.totalQuestions,
        accuracy: result.accuracyPercent,
        completedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
    }

    let unlockedVillageTitle: string | undefined = undefined;
    let xpAwarded = 0;

    if (result.passed) {
      current.state = 'completed';

      // Anti-XP farming: Full XP on first completion, nominal practice XP on replay
      xpAwarded = isFirstCompletion ? result.xpEarned : Math.min(25, Math.round(result.xpEarned * 0.2));

      // Find next village in progression for this island
      const island = getIslandById(result.islandId);
      const currentVillage = island.villages.find((v) => v.id === result.villageId);

      if (currentVillage) {
        const nextVillage = island.villages.find((v) => v.order === currentVillage.order + 1);
        if (nextVillage) {
          const nextData = progressMap[nextVillage.id] || { state: 'locked', attemptsCount: 0 };
          if (nextData.state === 'locked') {
            nextData.state = 'available';
            progressMap[nextVillage.id] = nextData;
            unlockedVillageTitle = nextVillage.title;
          }
        }
      }
    } else {
      if (current.state !== 'completed') {
        current.state = 'in_progress';
      }
      xpAwarded = Math.round(result.correctCount * 5); // Partial consolation XP for learning effort
    }

    progressMap[result.villageId] = current;
    this.saveStoredMap(progressMap);

    // Synchronize XP and auto-recalculate level and rank in StorageService
    if (xpAwarded > 0) {
      const user = StorageService.getUser();
      const newXp = user.xp + xpAwarded;
      const completedVillages = Array.from(new Set([...(user.completedVillageIds || []), ...(result.passed ? [result.villageId] : [])]));
      const totalCompleted = (user.completedChallengeIds?.length || 0) + completedVillages.length;
      const levelInfo = calculateLevelData(newXp, totalCompleted);
      const updatedUser = {
        ...user,
        xp: newXp,
        level: levelInfo.level,
        rankTier: levelInfo.rankTier,
        xpToNextLevel: levelInfo.nextLevelXp - levelInfo.currentLevelXp,
        completedVillageIds: completedVillages
      };
      StorageService.saveUser(updatedUser);
    }

    return {
      unlockedVillageTitle,
      xpAwarded,
      isFirstCompletion
    };
  }

  /**
   * Reset village progress for testing or demonstrations.
   */
  public static resetProgress(): void {
    localStorage.removeItem(VILLAGE_STORAGE_KEY);
    this.getStoredMap();
  }
}
