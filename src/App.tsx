import React, { useState, useEffect, useCallback } from 'react';
import { 
  ViewState, 
  LearningPathId, 
  ProgrammingIslandId, 
  Village, 
  QuizSetupConfig, 
  QuizQuestion, 
  QuizAttemptResult, 
  UserProfile, 
  ToastMessage 
} from './types';
import { StorageService } from './services/storageService';
import { VillageProgressService } from './services/villageProgressService';
import { QuestionService } from './services/questionService';
import { getIslandById } from './services/codingWorldData';
import { soundFx } from './services/soundFx';
import { authService } from './services/authService';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { AuthModal } from './components/AuthModal';

import { LoginScreen } from './views/LoginScreen';
import { CinematicLoader } from './components/CinematicLoader';
import { CodingWorld } from './components/world/CodingWorld';
import { VillageMap } from './components/world/VillageMap';
import { VillageQuizSetup } from './components/world/VillageQuizSetup';
import { QuizRunner } from './components/world/QuizRunner';
import { QuizResults } from './components/world/QuizResults';
import { World3DView } from './views/World3DView';

import { LandingPage } from './views/LandingPage';
import { DashboardView } from './views/DashboardView';
import { LearningPathView } from './views/LearningPathView';
import { ChallengeView } from './views/ChallengeView';
import { LeaderboardView } from './views/LeaderboardView';
import { ProgressView } from './views/ProgressView';
import { ProfileView } from './views/ProfileView';

export default function App() {
  // Start on login view as specified by user flow (Login -> Loading -> 4 Islands World)
  const [currentView, setCurrentView] = useState<ViewState>('login');
  const [selectedPathId, setSelectedPathId] = useState<LearningPathId>('python');
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>('py-ch-1');
  
  // 4-Island World and Village states
  const [selectedIslandId, setSelectedIslandId] = useState<ProgrammingIslandId>('python');
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [isQuizSetupOpen, setIsQuizSetupOpen] = useState(false);
  const [activeQuizConfig, setActiveQuizConfig] = useState<QuizSetupConfig | null>(null);
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestion[]>([]);
  const [activeQuizResult, setActiveQuizResult] = useState<QuizAttemptResult | null>(null);
  const [unlockedVillageTitle, setUnlockedVillageTitle] = useState<string | undefined>(undefined);
  const [actualXpAwarded, setActualXpAwarded] = useState(0);

  const [user, setUser] = useState<UserProfile>(() => {
    const u = StorageService.getUser();
    soundFx.enabled = u.soundEnabled;
    return u;
  });
  const [paths, setPaths] = useState(() => StorageService.getPaths());
  const [achievements, setAchievements] = useState(() => StorageService.getAchievements());
  const [leaderboard, setLeaderboard] = useState(() => StorageService.getLeaderboard());
  const [activity, setActivity] = useState(() => StorageService.getActivity());

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Theme state with localStorage persistence
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const stored = localStorage.getItem('codesprint_theme');
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {}
    return 'light';
  });

  useEffect(() => {
    try {
      localStorage.setItem('codesprint_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    } catch {}
  }, [theme]);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    soundFx.powerOnChirp();
    setTheme(nextTheme);
    addToast({
      type: 'info',
      title: nextTheme === 'light' ? 'Day Mode Active' : 'Night Mode Active',
      description: nextTheme === 'light' ? 'Bright adventure world engaged!' : 'Deep night sky world engaged!'
    });
  };

  // Sound toggle handler
  const handleToggleSound = () => {
    const nextState = !user.soundEnabled;
    soundFx.enabled = nextState;
    if (nextState) {
      soundFx.powerOnChirp();
    } else {
      soundFx.click();
    }
    const updated = { ...user, soundEnabled: nextState };
    setUser(updated);
    StorageService.saveUser(updated);
    addToast({
      type: 'info',
      title: nextState ? 'Audio Engine Online' : 'Audio Engine Muted',
      description: nextState ? 'Tactical sfx synthesis and telemetry audio active.' : 'Sound engine output suspended.'
    });
  };

  // Add toast helper
  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // View routing handler
  const handleNavigate = (view: ViewState, pathId?: LearningPathId) => {
    if (pathId) {
      setSelectedPathId(pathId);
      if (pathId === 'python' || pathId === 'sql' || pathId === 'java' || pathId === 'ai') {
        setSelectedIslandId(pathId);
      }
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Direct challenge launcher
  const handleSelectChallenge = (challengeId: string) => {
    setSelectedChallengeId(challengeId);
    setCurrentView('challenge');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Login event from LoginScreen with real authentication
  const handleLoginSubmit = (callsign: string, email: string, additional?: { name?: string; designation?: string }) => {
    const updated = {
      ...user,
      callsign: callsign || 'VORTEX',
      name: additional?.name || user.name || callsign,
      email: email || user.email
    };
    setUser(updated);
    StorageService.saveUser(updated);
    // Transition to cinematic loading screen
    setCurrentView('loading');
  };

  // Cinematic loader finished -> Teleport to 4-Island World of Coding
  const handleLoaderComplete = () => {
    setCurrentView('world');
    addToast({
      type: 'success',
      title: 'Arrived at the World of Coding',
      description: 'Explore the 4 Programming Islands: Python, SQL, Java, and AI!'
    });
  };

  // Island selection in CodingWorld -> opens dedicated VillageMap
  const handleSelectIsland = (islandId: ProgrammingIslandId) => {
    setSelectedIslandId(islandId);
    setSelectedPathId(islandId);
    setCurrentView('village-map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Village selection in VillageMap -> opens VillageQuizSetup
  const handleSelectVillage = (village: Village) => {
    setSelectedVillage(village);
    setIsQuizSetupOpen(true);
  };

  // Start Quiz configured in VillageQuizSetup
  const handleStartQuiz = async (config: QuizSetupConfig) => {
    const questions = await QuestionService.getQuestions(config);
    setActiveQuizConfig(config);
    setActiveQuizQuestions(questions);
    setActiveQuizResult(null);
    setIsQuizSetupOpen(false);
    setCurrentView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quiz completion handler
  const handleCompleteQuiz = (result: QuizAttemptResult) => {
    const progressResult = VillageProgressService.recordQuizAttempt(result);
    const updatedUser = StorageService.getUser();
    setUser(updatedUser);
    setLeaderboard(StorageService.getLeaderboard());
    setActivity(StorageService.getActivity());
    setAchievements(StorageService.getAchievements());

    setUnlockedVillageTitle(progressResult.unlockedVillageTitle);
    setActualXpAwarded(progressResult.xpAwarded);
    setActiveQuizResult(result);

    if (result.passed) {
      addToast({
        type: 'xp',
        title: `Village Mastered: ${result.villageTitle}!`,
        description: `+${progressResult.xpAwarded} XP awarded. ${progressResult.unlockedVillageTitle ? `Unlocked ${progressResult.unlockedVillageTitle}!` : ''}`,
        xpAmount: progressResult.xpAwarded
      });
    }
  };

  // Return from Quiz Results to Village Map
  const handleReturnToIslandMap = () => {
    setActiveQuizResult(null);
    setCurrentView('village-map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Continue to next unlocked village
  const handleContinueToNextVillage = () => {
    setActiveQuizResult(null);
    const currentIsland = VillageProgressService.getIsland(selectedIslandId);
    const completedIds = user.completedVillageIds || [];
    const nextAvail = currentIsland.villages.find((v) => v.state === 'available');

    if (nextAvail) {
      setSelectedVillage(nextAvail);
      setIsQuizSetupOpen(true);
    }
    setCurrentView('village-map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Retry quiz for current village
  const handleRetryQuiz = () => {
    setActiveQuizResult(null);
    if (selectedVillage) {
      setIsQuizSetupOpen(true);
    }
  };

  // Challenge completion handler (works in both 3D world and 2D challenge runner)
  const handleCompleteChallenge = (challengeId: string, xpReward: number) => {
    const result = StorageService.completeChallenge(challengeId, xpReward);
    setUser(result.user);
    setLeaderboard(StorageService.getLeaderboard());
    setActivity(StorageService.getActivity());
    setAchievements(StorageService.getAchievements());

    if (result.rankedUp) {
      soundFx.rankUp();
      addToast({
        type: 'rankup',
        title: `RANK PROMOTION: ${result.user.rankTier}`,
        description: 'Exceptional combat rating! Promoted to a higher competitive division.'
      });
    }

    if (result.alreadyCompleted) {
      addToast({
        type: 'info',
        title: 'Mission Replayed',
        description: 'Drill verified. Mechanical memory solidified.'
      });
    } else {
      addToast({
        type: 'xp',
        title: 'Challenge Solved!',
        description: `+${xpReward} XP awarded towards ${result.user.rankTier}.`,
        xpAmount: xpReward
      });

      if (result.leveledUp && !result.rankedUp) {
        addToast({
          type: 'level',
          title: `Clearance: Level ${result.user.level}`,
          description: 'New calling cards and terminal honors unlocked.'
        });
      }
    }
  };

  // Demo XP earned in landing demo
  const handleEarnDemoXp = (amount: number) => {
    const updated = { ...user, xp: user.xp + amount };
    setUser(updated);
    StorageService.saveUser(updated);
    addToast({
      type: 'xp',
      title: 'Drill Solved!',
      description: 'Progress committed to your session dossier.',
      xpAmount: amount
    });
  };

  // User profile update
  const handleUpdateUser = (updatedPartial: Partial<UserProfile>) => {
    const updated = { ...user, ...updatedPartial };
    setUser(updated);
    StorageService.saveUser(updated);
    addToast({
      type: 'info',
      title: 'Preferences Updated',
      description: 'Combat dossier configuration has been saved.'
    });
  };

  // Reset demo data
  const handleResetData = () => {
    StorageService.resetToDefault();
    VillageProgressService.resetProgress();
    const freshUser = StorageService.getUser();
    setUser(freshUser);
    setPaths(StorageService.getPaths());
    setAchievements(StorageService.getAchievements());
    setLeaderboard(StorageService.getLeaderboard());
    setActivity(StorageService.getActivity());
    addToast({
      type: 'info',
      title: 'Session Purged',
      description: 'Dossier and village progress restored to baseline state.'
    });
  };

  // User logout handler
  const handleLogout = () => {
    authService.logout();
    const defaultUser = StorageService.getUser();
    setUser(defaultUser);
    setCurrentView('login');
    addToast({
      type: 'info',
      title: 'Logged Out',
      description: 'You have returned to the mission briefing and login screen.'
    });
  };

  // Don't show top navbar during initial Login or Loading screens
  const showNav = currentView !== 'login' && currentView !== 'loading';

  return (
    <div className="min-h-screen w-full flex flex-col bg-[var(--bg-app)] text-[var(--text-primary)] overflow-x-hidden selection:bg-purple/30 selection:text-navy transition-colors duration-200">
      
      {/* Top Bar Navigation (Hidden in initial Login & Loader) */}
      {showNav && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          user={user}
          onOpenAuth={() => setCurrentView('login')}
          onToggleSound={handleToggleSound}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onLogout={handleLogout}
        />
      )}

      {/* Main Viewport Content */}
      <main className="flex-1 w-full flex flex-col overflow-x-hidden">
        {currentView === 'login' && (
          <LoginScreen
            onLoginSuccess={handleLoginSubmit}
            onExploreWithoutLogin={() => setCurrentView('world')}
          />
        )}

        {currentView === 'loading' && (
          <CinematicLoader
            onComplete={handleLoaderComplete}
          />
        )}

        {/* 1. THE 4 PROGRAMMING ISLANDS WORLD MAP */}
        {currentView === 'world' && (
          <CodingWorld
            user={user}
            theme={theme}
            onSelectIsland={handleSelectIsland}
            onOpenDashboard={() => handleNavigate('dashboard')}
            onExplore3DIsles={() => handleNavigate('world-3d')}
          />
        )}

        {/* 2. ISLAND INTERIOR: VILLAGE MAP */}
        {currentView === 'village-map' && (
          <VillageMap
            islandId={selectedIslandId}
            user={user}
            theme={theme}
            onSelectVillage={handleSelectVillage}
            onBackToWorld={() => handleNavigate('world')}
          />
        )}

        {/* 3. ACTIVE QUIZ RUNNER OR RESULTS */}
        {currentView === 'quiz' && (
          activeQuizResult ? (
            <QuizResults
              result={activeQuizResult}
              island={getIslandById(selectedIslandId)}
              village={selectedVillage || VillageProgressService.getIsland(selectedIslandId).villages[0]}
              onContinueToNextVillage={handleContinueToNextVillage}
              onReturnToIslandMap={handleReturnToIslandMap}
              onRetryQuiz={handleRetryQuiz}
              unlockedVillageTitle={unlockedVillageTitle}
              actualXpAwarded={actualXpAwarded}
            />
          ) : (
            activeQuizConfig && (
              <QuizRunner
                island={getIslandById(selectedIslandId)}
                village={selectedVillage || VillageProgressService.getIsland(selectedIslandId).villages[0]}
                config={activeQuizConfig}
                questions={activeQuizQuestions}
                onCompleteQuiz={handleCompleteQuiz}
                onExitQuiz={handleReturnToIslandMap}
              />
            )
          )
        )}

        {/* 4. PRESERVED 3D AVATAR EXPLORATION */}
        {currentView === 'world-3d' && (
          <World3DView
            user={user}
            initialIsland={selectedPathId}
            onSolveChallenge={handleCompleteChallenge}
            onOpenDashboard={() => handleNavigate('dashboard')}
            onToggleSound={handleToggleSound}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            onSelectIsland={handleSelectIsland}
          />
        )}

        {/* 5. PRESERVED EXISTING DASHBOARD & SYSTEM VIEWS */}
        {currentView === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
            user={user}
            onEarnXp={handleEarnDemoXp}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            user={user}
            paths={paths}
            onNavigate={handleNavigate}
            onSelectChallenge={handleSelectChallenge}
          />
        )}

        {(currentView === 'paths' || currentView === 'path-detail') && (
          <LearningPathView
            initialPathId={selectedPathId}
            paths={paths}
            user={user}
            onBack={() => handleNavigate('world')}
            onSelectChallenge={handleSelectChallenge}
          />
        )}

        {currentView === 'challenge' && (
          <ChallengeView
            challengeId={selectedChallengeId}
            paths={paths}
            user={user}
            onBack={() => handleNavigate('world')}
            onCompleteChallenge={handleCompleteChallenge}
            onSelectChallenge={handleSelectChallenge}
          />
        )}

        {currentView === 'leaderboard' && (
          <LeaderboardView
            board={leaderboard}
            user={user}
            onBack={() => handleNavigate('world')}
          />
        )}

        {currentView === 'progress' && (
          <ProgressView
            user={user}
            paths={paths}
            activity={activity}
            onBack={() => handleNavigate('world')}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView
            user={user}
            achievements={achievements}
            onUpdateUser={handleUpdateUser}
            onResetData={handleResetData}
            onBack={() => handleNavigate('world')}
            onLogout={handleLogout}
            theme={theme}
            onToggleTheme={handleToggleTheme}
          />
        )}
      </main>

      {/* VILLAGE QUIZ CONFIGURATION MODAL (Step before quiz start) */}
      {isQuizSetupOpen && selectedVillage && (
        <VillageQuizSetup
          village={selectedVillage}
          island={getIslandById(selectedIslandId)}
          onStartQuiz={handleStartQuiz}
          onClose={() => setIsQuizSetupOpen(false)}
        />
      )}

      {/* Footer (Shown on landing & static pages; hidden in world, quiz, 3D isles) */}
      {currentView !== 'challenge' && currentView !== 'world-3d' && currentView !== 'world' && currentView !== 'village-map' && currentView !== 'quiz' && currentView !== 'login' && currentView !== 'loading' && (
        <Footer onNavigate={handleNavigate} />
      )}

      {/* Floating Microinteraction Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Authentication Modal (if invoked as popup) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(loggedUser) => {
          setUser(loggedUser);
          setCurrentView('world');
        }}
        defaultMode={authModalMode}
      />

    </div>
  );
}
