export type LearningPathId = 'python' | 'sql' | 'java' | 'ai' | 'web-dev';

export type ProgrammingIslandId = 'python' | 'sql' | 'java' | 'ai';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type VillageState = 'available' | 'in_progress' | 'completed' | 'locked';

export interface VillageScore {
  score: number;
  total: number;
  accuracy: number;
  completedAt: string;
}

export interface Village {
  id: string;
  islandId: ProgrammingIslandId;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  topics: string[];
  difficulty: Difficulty;
  icon: string;
  estimatedDuration: string;
  prerequisiteVillageId?: string;
  prerequisiteExplanation?: string;
  xpReward: number;
  questionBankCount: number;
  state: VillageState;
  bestScore?: VillageScore;
  coordinates: {
    xPercent: number; // Responsive map position percentage (0 - 100)
    yPercent: number;
  };
}

export interface ProgrammingIsland {
  id: ProgrammingIslandId;
  name: string;
  subtitle: string;
  theme: string;
  accentColor: string;
  glowColor: string;
  skyGradient: string;
  visualElements: string[];
  villages: Village[];
  levelRequirement: number;
  isLocked: boolean;
  lockExplanation?: string;
}

export interface QuizSetupConfig {
  islandId: ProgrammingIslandId;
  villageId: string;
  questionCount: number; // 5, 10, 15, 20, 25
  durationMinutes: number; // 10 to 50 in 5 min steps
  difficulty: Difficulty;
}

export interface QuizQuestion {
  id: string;
  islandId: ProgrammingIslandId;
  villageId: string;
  topic: string;
  difficulty: Difficulty;
  question: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  explanation: string;
}

export interface QuizUserAnswer {
  questionId: string;
  questionText: string;
  userOptionId: string | null;
  correctOptionId: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizAttemptResult {
  islandId: ProgrammingIslandId;
  villageId: string;
  villageTitle: string;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  accuracyPercent: number;
  timeTakenSeconds: number;
  xpEarned: number;
  passed: boolean;
  passingScorePercent: number;
  weakTopics: string[];
  completedAt: string;
  answers: QuizUserAnswer[];
}

export type CompetitiveRank = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface Challenge {
  id: string;
  pathId: LearningPathId;
  topicId: string;
  topicTitle: string;
  title: string;
  difficulty: Difficulty;
  xpReward: number; // Ranked Rating (RR) / XP
  question: string;
  tacticalBrief?: string;
  codeSnippet?: {
    language: 'python' | 'sql' | 'javascript' | 'html' | 'java';
    code: string;
  };
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  explanation: string;
  hint: string;
}

export type IslandNodeType = 'cave' | 'tree' | 'stone' | 'masterpiece';

export interface IslandWorldNode {
  id: string;
  title: string;
  type: IslandNodeType;
  islandId: LearningPathId;
  x: number;
  z: number;
  radius: number;
  challenge: Challenge;
  cleared: boolean;
  description: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  order: number;
  challengesCount: number;
  completedCount: number;
  isLocked: boolean;
  challenges: Challenge[];
}

export interface LearningPath {
  id: LearningPathId;
  title: string;
  tagline: string;
  description: string;
  tacticalRole: string;
  icon: string;
  color: string;
  accentColor: string;
  badge: string;
  totalChallenges: number;
  estimatedHours: number;
  sampleCode: {
    language: string;
    filename: string;
    code: string;
  };
  topics: Topic[];
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'milestone' | 'streak' | 'mastery' | 'speed';
  unlockedAt?: string;
  isUnlocked: boolean;
  progress?: {
    current: number;
    total: number;
  };
}

export interface LeaderboardUser {
  id: string;
  name: string;
  callsign: string;
  username: string;
  avatar: string;
  rank: number;
  rankTier: CompetitiveRank;
  rr: number;
  level: number;
  streak: number;
  primaryPath: string;
  headshotAccuracy: number;
  winStreak: number;
  badgesCount: number;
  isCurrentUser?: boolean;
}

export interface DailyActivity {
  day: string;
  date: string;
  challenges: number;
  xp: number;
}

export interface UserProfile {
  id: string;
  name: string;
  callsign: string;
  username: string;
  email: string;
  avatar: string;
  rankTier: CompetitiveRank;
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  headshotAccuracy: number;
  totalMatchesWon: number;
  completedChallengeIds: string[];
  completedVillageIds?: string[];
  joinedDate: string;
  dailyGoalXp: number;
  soundEnabled: boolean;
  theme: 'dark' | 'tactical';
  primaryPath: LearningPathId;
  coins?: number;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  rewardXp: number;
  rewardCoins: number;
  completed: boolean;
  claimed: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'xp' | 'success' | 'level' | 'info' | 'rankup';
  title: string;
  description?: string;
  xpAmount?: number;
}

export type ViewState = 
  | 'login'
  | 'loading'
  | 'world'         // The 4-Island World Selection Screen
  | 'village-map'   // Island Interior: Village Map
  | 'quiz'          // Active Village Quiz Interface
  | 'world-3d'      // 3D Avatar Exploration Isles
  | 'landing'
  | 'dashboard'
  | 'paths'
  | 'path-detail'
  | 'challenge'
  | 'leaderboard'
  | 'progress'
  | 'profile';

export type CameraMode = 'third-person' | 'first-person';

export type WorldViewMode = 'explore' | 'orbital-map';
