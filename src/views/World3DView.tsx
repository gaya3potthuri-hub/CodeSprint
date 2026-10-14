import React from 'react';
import { 
  LearningPathId, 
  UserProfile, 
  ProgrammingIslandId 
} from '../types';
import { WorldCanvas } from '../components/3d/WorldCanvas';
import { WorldHUD } from '../components/3d/WorldHUD';
import { WorldErrorBoundary } from '../components/3d/WorldErrorBoundary';

export interface World3DViewProps {
  user: UserProfile;
  initialIsland?: LearningPathId;
  onSolveChallenge?: (challengeId: string, xpReward: number) => void;
  onOpenDashboard: () => void;
  onToggleSound: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onSelectIsland?: (islandId: ProgrammingIslandId) => void;
}

export const World3DView: React.FC<World3DViewProps> = ({
  user,
  initialIsland = 'python',
  onOpenDashboard,
  onToggleSound,
  theme = 'light',
  onToggleTheme,
  onSelectIsland
}) => {
  const handleSelectIsland = (islandId: ProgrammingIslandId) => {
    if (onSelectIsland) {
      onSelectIsland(islandId);
    }
  };

  const safeIslandId = (initialIsland === 'web-dev' ? 'python' : initialIsland) as ProgrammingIslandId;

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] min-h-[calc(100vh-4rem)] overflow-hidden bg-page">
      {/* 3D WebGL Scene with Error Boundary Fallback to 2D Map */}
      <WorldErrorBoundary
        onSelectIsland={handleSelectIsland}
        theme={theme}
      >
        <WorldCanvas
          currentIsland={safeIslandId}
          onSelectIsland={handleSelectIsland}
          theme={theme}
        />
      </WorldErrorBoundary>

      {/* Modern Cartoon HUD with Rounded White Game Cards for XP, Level, Streak, Theme */}
      <WorldHUD
        user={user}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onToggleSound={onToggleSound}
        onOpenDashboard={onOpenDashboard}
      />
    </div>
  );
};
