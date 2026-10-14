import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Flame, 
  Lock, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  LogOut, 
  Edit3, 
  Check, 
  Trophy, 
  ShieldCheck, 
  Crosshair, 
  RotateCcw,
  Sparkles,
  Zap
} from 'lucide-react';
import { UserProfile, AchievementBadge } from '../types';
import { soundFx } from '../services/soundFx';
import { getRankConfig, calculateLevelData } from '../services/storageService';
import { authService } from '../services/authService';
import { AVATAR_OPTIONS } from '../services/avatarList';

export interface ProfileViewProps {
  user: UserProfile;
  achievements: AchievementBadge[];
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onResetData: () => void;
  onBack: () => void;
  onLogout?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  achievements,
  onUpdateUser,
  onResetData,
  onBack,
  onLogout,
  theme = 'light',
  onToggleTheme
}) => {
  // Username editing state
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState(user.callsign || user.name || 'VORTEX');
  
  // Avatar picker toggle
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  
  // Confirmation modals
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const rankConfig = getRankConfig(user.rankTier);
  const levelData = calculateLevelData(user.xp, user.completedChallengeIds.length);

  const handleSaveUsername = () => {
    const trimmed = usernameInput.trim();
    if (trimmed) {
      soundFx.lockIn();
      onUpdateUser({
        callsign: trimmed.toUpperCase(),
        name: trimmed,
        username: trimmed.toLowerCase().replace(/\s+/g, '_')
      });
      setIsEditingUsername(false);
    }
  };

  const handleSelectAvatar = (url: string) => {
    soundFx.powerOnChirp();
    onUpdateUser({ avatar: url });
    setShowAvatarPicker(false);
  };

  const handlePerformLogout = () => {
    soundFx.click();
    authService.logout();
    setShowLogoutConfirm(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="w-full flex-1 bg-page text-navy py-6 sm:py-10 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8 w-full font-sans">
        
        {/* Top Navigation Back Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              soundFx.click();
              onBack();
            }}
            onMouseEnter={() => soundFx.hoverTick()}
            className="game-btn game-btn-card px-4 py-2 rounded-xl text-xs font-heading font-bold flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-purple" />
            <span>RETURN TO WORLD</span>
          </button>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="game-btn game-btn-red px-4 py-2 rounded-xl text-xs font-heading font-bold flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>LOGOUT</span>
          </button>
        </div>

        {/* 1. MAIN GAME PLAYER CARD */}
        <div className="game-card p-6 sm:p-8 relative overflow-hidden">
          {/* Card Accent Top Banner */}
          <div 
            className="absolute top-0 inset-x-0 h-3 rounded-t-xl"
            style={{ backgroundColor: rankConfig.badgeColor }}
          />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-2">
            
            {/* Player Avatar with Glow & Picker Trigger */}
            <div className="flex flex-col items-center gap-2.5">
              <div 
                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-4 border-white shadow-lg overflow-hidden group cursor-pointer"
                style={{ backgroundColor: rankConfig.badgeBg }}
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                title="Click to change your avatar"
              >
                <img 
                  src={user.avatar || AVATAR_OPTIONS[0].url} 
                  alt={user.name} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-heading font-bold">
                  <span>CHANGE</span>
                </div>
              </div>

              <button
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="text-[11px] font-heading font-bold text-purple hover:underline cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{showAvatarPicker ? 'Close Picker' : 'Choose Avatar'}</span>
              </button>
            </div>

            {/* Player Info & Editable Username */}
            <div className="flex-1 text-center sm:text-left space-y-3">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Editable Username */}
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  {isEditingUsername ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveUsername()}
                        className="px-3 py-1.5 rounded-xl border-2 border-purple bg-card text-navy font-heading font-black text-xl sm:text-2xl outline-none"
                        maxLength={16}
                        autoFocus
                      />
                      <button
                        onClick={handleSaveUsername}
                        className="game-btn game-btn-green p-2 rounded-xl text-white cursor-pointer"
                        title="Save username"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group">
                      <h1 className="text-2xl sm:text-3xl font-heading font-black text-navy tracking-tight">
                        {user.callsign}
                      </h1>
                      <button
                        onClick={() => {
                          soundFx.click();
                          setUsernameInput(user.callsign);
                          setIsEditingUsername(true);
                        }}
                        className="p-1 rounded-lg text-muted hover:text-purple hover:bg-card-subtle cursor-pointer transition-colors"
                        title="Edit Call Name"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Rank Badge & Streak */}
                <div className="flex items-center justify-center sm:justify-end gap-2.5">
                  {/* Streak Flame */}
                  <div className="bg-gold/15 border-2 border-gold/40 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 text-xs font-heading font-black text-gold shadow-sm">
                    <Flame className="w-4 h-4 fill-gold text-gold animate-bounce" />
                    <span>{user.streak}D STREAK</span>
                  </div>

                  {/* Rank Badge */}
                  <div 
                    className="px-3 py-1.5 rounded-2xl border-2 text-xs font-heading font-black shadow-sm flex items-center gap-1.5"
                    style={{
                      color: rankConfig.badgeColor,
                      borderColor: rankConfig.badgeColor,
                      backgroundColor: rankConfig.badgeBg
                    }}
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{user.rankTier} TIER</span>
                  </div>
                </div>
              </div>

              {/* Sub-meta */}
              <p className="text-xs text-muted font-sans font-medium">
                Registered CodeSprint Cadet · Joined {user.joinedDate || '2026'} · {user.email}
              </p>

              {/* Level & XP Progress Bar */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between text-xs font-heading font-bold">
                  <div className="flex items-center gap-2 text-navy">
                    <ShieldCheck className="w-4 h-4 text-green" />
                    <span>LEVEL {levelData.level} EXPLORER</span>
                  </div>
                  <div className="text-muted">
                    <span className="text-green font-black">{levelData.currentLevelXp}</span> / {levelData.nextLevelXp} XP to Level {levelData.level + 1}
                  </div>
                </div>

                {/* Chunky Progress Track */}
                <div className="w-full h-4 rounded-full bg-card-subtle border-2 border-border overflow-hidden p-0.5">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-green via-sky to-purple transition-all duration-500 shadow-sm"
                    style={{ width: `${levelData.progressPercent}%` }}
                  />
                </div>
              </div>

            </div>

          </div>

          {/* 8-OPTION AVATAR PICKER DRAWER */}
          {showAvatarPicker && (
            <div className="mt-6 pt-6 border-t-2 border-border animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-heading font-black text-navy uppercase tracking-wider">
                  Select Your Player Avatar (8 Options)
                </span>
                <span className="text-[11px] text-muted">Click any avatar to equip</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {AVATAR_OPTIONS.map((av) => {
                  const isCurrent = user.avatar === av.url;
                  return (
                    <button
                      key={av.id}
                      onClick={() => handleSelectAvatar(av.url)}
                      onMouseEnter={() => soundFx.hoverTick()}
                      className={`relative flex flex-col items-center gap-1.5 p-2 rounded-2xl border-2 transition-all cursor-pointer group ${
                        isCurrent 
                          ? 'border-purple bg-purple/10 shadow-[0_4px_0_var(--game-purple-dark)]' 
                          : 'border-border bg-card hover:border-purple/50 hover:bg-card-subtle'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden shadow-xs group-hover:scale-105 transition-transform">
                        <img src={av.url} alt={av.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] font-heading font-bold text-navy truncate w-full text-center">
                        {av.name}
                      </span>
                      {isCurrent && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-purple text-white flex items-center justify-center text-[10px]">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* 2. STATS GRID */}
        <div>
          <h2 className="text-sm font-heading font-black text-navy uppercase tracking-wider mb-3">
            Career Combat & Learning Stats
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* XP */}
            <div className="game-card p-4 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-xl bg-green/15 text-green flex items-center justify-center font-bold mb-2">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-2xl font-heading font-black text-navy leading-none">
                  {user.xp.toLocaleString()}
                </div>
                <div className="text-[11px] font-bold text-muted mt-1 uppercase">Total XP Earned</div>
              </div>
            </div>

            {/* Villages Mastered */}
            <div className="game-card p-4 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-xl bg-purple/15 text-purple flex items-center justify-center font-bold mb-2">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <div className="text-2xl font-heading font-black text-navy leading-none">
                  {user.completedVillageIds?.length || 0}
                </div>
                <div className="text-[11px] font-bold text-muted mt-1 uppercase">Villages Cleared</div>
              </div>
            </div>

            {/* Accuracy */}
            <div className="game-card p-4 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-xl bg-sky/15 text-sky flex items-center justify-center font-bold mb-2">
                <Crosshair className="w-4 h-4" />
              </div>
              <div>
                <div className="text-2xl font-heading font-black text-navy leading-none">
                  {user.headshotAccuracy || 94.2}%
                </div>
                <div className="text-[11px] font-bold text-muted mt-1 uppercase">Drill Accuracy</div>
              </div>
            </div>

            {/* Quizzes Won */}
            <div className="game-card p-4 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-xl bg-gold/15 text-gold flex items-center justify-center font-bold mb-2">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <div className="text-2xl font-heading font-black text-navy leading-none">
                  {user.totalMatchesWon || 12}
                </div>
                <div className="text-[11px] font-bold text-muted mt-1 uppercase">Quizzes Passed</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. BADGE SHELF (Locked Badges Greyed Out) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-heading font-black text-navy uppercase tracking-wider">
              Badge Shelf ({achievements.filter((a) => a.isUnlocked).length}/{achievements.length} Unlocked)
            </h2>
            <span className="text-[11px] text-muted font-bold">Locked achievements greyed</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {achievements.map((badge) => {
              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between min-h-[140px] ${
                    badge.isUnlocked
                      ? 'game-card bg-card border-border hover:-translate-y-1'
                      : 'bg-card-subtle/60 border-dashed border-border opacity-50 grayscale'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div 
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                        badge.isUnlocked ? 'bg-gold/20 text-gold' : 'bg-muted/20 text-muted'
                      }`}
                    >
                      <Trophy className="w-5 h-5" />
                    </div>

                    {badge.isUnlocked ? (
                      <span className="text-[9px] font-heading font-black uppercase px-2 py-0.5 rounded-full bg-green/15 text-green border border-green/30">
                        UNLOCKED
                      </span>
                    ) : (
                      <div className="flex items-center gap-1 text-[9px] font-heading font-bold text-muted">
                        <Lock className="w-3 h-3" />
                        <span>LOCKED</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-2">
                    <div className="text-xs font-heading font-extrabold text-navy">
                      {badge.title}
                    </div>
                    <div className="text-[10px] text-muted font-sans mt-0.5 line-clamp-2">
                      {badge.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. SETTINGS & LOGOUT */}
        <div className="game-card p-6 space-y-4">
          <h2 className="text-sm font-heading font-black text-navy uppercase tracking-wider pb-2 border-b-2 border-border">
            Cadet Settings & Station Controls
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Theme Toggle Button */}
            {onToggleTheme && (
              <button
                onClick={() => {
                  soundFx.powerOnChirp();
                  onToggleTheme();
                }}
                className="game-btn game-btn-card p-3 rounded-2xl flex items-center justify-between text-xs font-heading font-bold cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-gold" /> : <Moon className="w-4 h-4 text-purple" />}
                  <span>{theme === 'dark' ? 'Day Theme' : 'Night Theme'}</span>
                </div>
                <span className="text-[10px] text-muted uppercase font-mono">{theme}</span>
              </button>
            )}

            {/* Sound Toggle */}
            <button
              onClick={() => {
                const nextState = !user.soundEnabled;
                soundFx.enabled = nextState;
                if (nextState) soundFx.powerOnChirp();
                onUpdateUser({ soundEnabled: nextState });
              }}
              className="game-btn game-btn-card p-3 rounded-2xl flex items-center justify-between text-xs font-heading font-bold cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                {user.soundEnabled ? <Volume2 className="w-4 h-4 text-green" /> : <VolumeX className="w-4 h-4 text-muted" />}
                <span>Sound FX</span>
              </div>
              <span className={`text-[10px] font-bold ${user.soundEnabled ? 'text-green' : 'text-muted'}`}>
                {user.soundEnabled ? 'ONLINE' : 'MUTED'}
              </span>
            </button>

            {/* Reset Progress */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="game-btn game-btn-card p-3 rounded-2xl flex items-center justify-between text-xs font-heading font-bold cursor-pointer text-muted hover:text-red"
            >
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4" />
                <span>Reset Progress</span>
              </div>
              <span className="text-[10px] uppercase font-mono">Reset</span>
            </button>
          </div>

          {/* Prominent Logout Button */}
          <div className="pt-2">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="game-btn game-btn-red w-full py-3 rounded-2xl text-xs font-heading font-black tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>LOGOUT OF CODESPRINT</span>
            </button>
          </div>
        </div>

      </div>

      {/* CONFIRM LOGOUT MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="game-card bg-card p-6 max-w-sm w-full space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red/15 text-red flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-black text-navy">Confirm Logout</h3>
              <p className="text-xs text-muted font-sans mt-1">
                Are you sure you want to log out of your CodeSprint session?
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="game-btn game-btn-card flex-1 py-2.5 rounded-xl text-xs font-heading font-bold cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={handlePerformLogout}
                className="game-btn game-btn-red flex-1 py-2.5 rounded-xl text-xs font-heading font-bold cursor-pointer"
              >
                LOG OUT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM RESET PROGRESS MODAL */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="game-card bg-card p-6 max-w-sm w-full space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red/15 text-red flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-black text-navy">Reset All Progress?</h3>
              <p className="text-xs text-muted font-sans mt-1">
                This will reset your XP, village completions, and challenges to baseline.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="game-btn game-btn-card flex-1 py-2.5 rounded-xl text-xs font-heading font-bold cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  soundFx.errorDeflect();
                  onResetData();
                  setShowResetConfirm(false);
                }}
                className="game-btn game-btn-red flex-1 py-2.5 rounded-xl text-xs font-heading font-bold cursor-pointer"
              >
                RESET ALL
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
