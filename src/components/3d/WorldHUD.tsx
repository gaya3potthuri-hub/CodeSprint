import React from 'react';
import { 
  UserProfile, 
  ProgrammingIslandId 
} from '../../types';
import { soundFx } from '../../services/soundFx';
import { 
  Trophy, 
  Flame, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  LayoutDashboard,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export interface WorldHUDProps {
  user: UserProfile;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onToggleSound: () => void;
  onOpenDashboard: () => void;
  currentIsland?: ProgrammingIslandId;
  onSelectIsland?: (id: ProgrammingIslandId) => void;
  // Optional legacy props to keep backwards compatibility
  cameraMode?: string;
  onToggleCamera?: () => void;
  viewMode?: string;
  onToggleViewMode?: () => void;
}

export const WorldHUD: React.FC<WorldHUDProps> = ({
  user,
  theme = 'light',
  onToggleTheme,
  onToggleSound,
  onOpenDashboard
}) => {
  return (
    <header className="absolute inset-x-0 top-0 pointer-events-none z-30 flex flex-col gap-2 p-3 sm:p-5 select-none" aria-label="World HUD">
      
      {/* Top Header Row with Rounded White Game Cards */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full">
        
        {/* Brand & Theme Title Card (matches theme.png "Learn + Practice + Grow") */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="bg-card/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border-2 border-border game-card flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple text-white flex items-center justify-center font-extrabold shadow-sm">
              <Sparkles className="w-4 h-4 fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-extrabold font-heading text-navy leading-tight flex items-center gap-1.5">
                <span>Learn</span>
                <span className="text-gold">✦</span>
                <span>Practice</span>
                <span className="text-gold">✦</span>
                <span>Grow</span>
              </span>
              <span className="text-[10px] font-sans font-bold text-muted -mt-0.5">
                Your Skills. Your Journey.
              </span>
            </div>
          </div>
        </div>

        {/* HUD Quick Stats: Rounded White Cards for XP, Level, Streak, Theme Toggle */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-2.5 flex-wrap justify-end">
          
          {/* XP Card */}
          <div 
            className="bg-card/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border-2 border-border game-card flex items-center gap-2 text-xs font-heading font-extrabold text-navy"
            title="Total Experience Points"
          >
            <div className="w-6 h-6 rounded-lg bg-gold/20 flex items-center justify-center text-gold">
              <Trophy className="w-3.5 h-3.5 fill-gold text-gold" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[9px] text-muted font-bold tracking-wider">XP</span>
              <span className="text-green text-xs font-black">{user.xp.toLocaleString()}</span>
            </div>
          </div>

          {/* Level Card */}
          <div 
            className="bg-card/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border-2 border-border game-card flex items-center gap-2 text-xs font-heading font-extrabold text-navy"
            title={`Current Clearance: Level ${user.level}`}
          >
            <div className="w-6 h-6 rounded-lg bg-green/20 flex items-center justify-center text-green">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[9px] text-muted font-bold tracking-wider">LEVEL</span>
              <span className="text-navy text-xs font-black">{user.level}</span>
            </div>
          </div>

          {/* Streak Card */}
          <div 
            className="bg-card/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border-2 border-border game-card flex items-center gap-2 text-xs font-heading font-extrabold text-navy"
            title={`${user.streak} Day Study Streak`}
          >
            <div className="w-6 h-6 rounded-lg bg-gold/20 flex items-center justify-center text-gold">
              <Flame className="w-3.5 h-3.5 fill-gold text-gold animate-bounce" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[9px] text-muted font-bold tracking-wider">STREAK</span>
              <span className="text-gold text-xs font-black">{user.streak}D</span>
            </div>
          </div>

          {/* Theme Toggle Button Card */}
          {onToggleTheme && (
            <button
              onClick={() => {
                soundFx.powerOnChirp();
                onToggleTheme();
              }}
              onMouseEnter={() => soundFx.hoverTick()}
              className="bg-card/95 backdrop-blur-md p-2.5 rounded-2xl border-2 border-border game-card text-navy hover:text-purple transition-all cursor-pointer flex items-center justify-center"
              title={theme === 'dark' ? 'Switch to Bright Day Ocean' : 'Switch to Deep Night Ocean'}
              aria-label="Toggle Island World Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-gold" />
              ) : (
                <Moon className="w-4 h-4 text-purple" />
              )}
            </button>
          )}

          {/* Audio FX Toggle */}
          <button
            onClick={onToggleSound}
            onMouseEnter={() => soundFx.hoverTick()}
            className="bg-card/95 backdrop-blur-md p-2.5 rounded-2xl border-2 border-border game-card text-navy hover:text-green transition-all cursor-pointer flex items-center justify-center"
            title={user.soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
            aria-label="Toggle Sound Effects"
          >
            {user.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-green" />
            ) : (
              <VolumeX className="w-4 h-4 text-muted" />
            )}
          </button>

          {/* Return to Dashboard */}
          <button
            onClick={() => {
              soundFx.click();
              onOpenDashboard();
            }}
            onMouseEnter={() => soundFx.hoverTick()}
            className="game-btn game-btn-card px-3.5 py-2 rounded-2xl text-xs font-heading font-extrabold text-navy flex items-center gap-1.5 cursor-pointer"
            title="Open Dashboard"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-purple" />
            <span className="hidden sm:inline">DASHBOARD</span>
          </button>

        </div>

      </div>

    </header>
  );
};
