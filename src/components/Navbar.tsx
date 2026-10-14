import React, { useState, useEffect } from 'react';
import { ViewState, UserProfile } from '../types';
import { soundFx } from '../services/soundFx';
import { getRankConfig } from '../services/storageService';
import { 
  Zap, 
  Menu, 
  X, 
  Terminal, 
  Trophy, 
  BarChart3, 
  User, 
  ArrowRight,
  Flame,
  LayoutDashboard,
  Volume2,
  VolumeX,
  Crosshair,
  Globe,
  Sun,
  Moon,
  Compass,
  BookOpen,
  LogOut
} from 'lucide-react';
import { authService } from '../services/authService';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState, pathId?: 'python' | 'sql' | 'web-dev') => void;
  user: UserProfile;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onToggleSound: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  user,
  onOpenAuth,
  onToggleSound,
  theme,
  onToggleTheme,
  onLogout
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLanding = currentView === 'landing';
  const rankConfig = getRankConfig(user.rankTier);

  const handleNavClick = (view: ViewState, pathId?: 'python' | 'sql' | 'web-dev') => {
    soundFx.click();
    onNavigate(view, pathId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-colors duration-200 border-b backdrop-blur-md ${
          scrolled || !isLanding
            ? 'bg-[var(--bg-header)] border-[var(--border-color)] shadow-sm'
            : 'bg-[var(--bg-header)] border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between gap-3 lg:gap-6 h-16 w-full">
            
            {/* Zone 1: Tactical Brand Wordmark */}
            <button
              onClick={() => handleNavClick('landing')}
              onMouseEnter={() => soundFx.hoverTick()}
              className="flex items-center gap-2.5 sm:gap-3 text-left group whitespace-nowrap shrink-0 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-purple border-2 border-purple-dark flex items-center justify-center text-white shadow-[0_3px_0_var(--game-purple-dark)] group-hover:scale-105 transition-transform shrink-0">
                <Crosshair className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-extrabold tracking-wide text-navy font-heading leading-tight">
                  CODE<span className="text-purple">SPRINT</span>
                </span>
                <span className="text-[10px] font-sans font-bold tracking-wider text-muted -mt-0.5 hidden xs:block">
                  LEARN · PRACTICE · GROW
                </span>
              </div>
            </button>

            {/* Zone 2: Navigation Links (Responsive Desktop) */}
            <nav className="hidden lg:flex items-center gap-2 xl:gap-4 text-xs font-mono tracking-wider uppercase text-[var(--text-muted)]">
              {isLanding ? (
                <>
                  <a
                    href="#platform"
                    onMouseEnter={() => soundFx.hoverTick()}
                    className="hover:text-[var(--text-primary)] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 px-2"
                  >
                    <span>PLATFORM</span>
                  </a>
                  <a
                    href="#paths"
                    onMouseEnter={() => soundFx.hoverTick()}
                    className="hover:text-[var(--text-primary)] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 px-2"
                  >
                    <span>CURRICULUM</span>
                  </a>
                  <a
                    href="#challenge-demo"
                    onMouseEnter={() => soundFx.hoverTick()}
                    className="hover:text-[var(--text-primary)] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 px-2"
                  >
                    <span>COMBAT ARENA</span>
                  </a>
                  <a
                    href="#how-it-works"
                    onMouseEnter={() => soundFx.hoverTick()}
                    className="hover:text-[var(--text-primary)] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 px-2"
                  >
                    <BookOpen className="w-3.5 h-3.5 opacity-70" />
                    <span>HOW IT WORKS</span>
                  </a>
                  <button
                    onClick={() => handleNavClick('leaderboard')}
                    onMouseEnter={() => soundFx.hoverTick()}
                    className="hover:text-[var(--text-primary)] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 py-1 px-2"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span>LEADERBOARD</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Explore Islands */}
                  <button
                    onClick={() => handleNavClick('world')}
                    onMouseEnter={() => soundFx.hoverTick()}
                    className={`game-btn flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 px-3.5 py-1.5 rounded-xl border-2 font-bold cursor-pointer text-xs ${
                      currentView === 'world' || currentView === 'village-map' || currentView === 'quiz'
                        ? 'game-btn-green'
                        : 'text-navy border-border hover:border-green hover:text-green bg-card shadow-[0_2px_0_var(--border-color)]'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>EXPLORE ISLANDS</span>
                  </button>

                  {/* 3D World */}
                  <button
                    onClick={() => handleNavClick('world-3d')}
                    onMouseEnter={() => soundFx.hoverTick()}
                    className={`game-btn flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 px-3.5 py-1.5 rounded-xl border-2 font-bold cursor-pointer text-xs ${
                      currentView === 'world-3d'
                        ? 'game-btn-purple'
                        : 'text-navy border-border hover:border-purple hover:text-purple bg-card shadow-[0_2px_0_var(--border-color)]'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>3D WORLD</span>
                  </button>

                  {/* Dashboard */}
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    onMouseEnter={() => soundFx.hoverTick()}
                    className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1.5 px-2.5 rounded-lg cursor-pointer font-bold ${
                      currentView === 'dashboard'
                        ? 'text-purple bg-purple/10'
                        : 'hover:text-navy hover:bg-card-subtle'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>DASHBOARD</span>
                  </button>

                  {/* Challenges */}
                  <button
                    onClick={() => handleNavClick('paths')}
                    onMouseEnter={() => soundFx.hoverTick()}
                    className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1.5 px-2.5 rounded-lg cursor-pointer font-bold ${
                      currentView === 'paths' || currentView === 'path-detail' || currentView === 'challenge'
                        ? 'text-green bg-green/10'
                        : 'hover:text-navy hover:bg-card-subtle'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>CHALLENGES</span>
                  </button>

                  {/* Leaderboard */}
                  <button
                    onClick={() => handleNavClick('leaderboard')}
                    onMouseEnter={() => soundFx.hoverTick()}
                    className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1.5 px-2.5 rounded-lg cursor-pointer font-bold ${
                      currentView === 'leaderboard'
                        ? 'text-gold bg-gold/15'
                        : 'hover:text-navy hover:bg-card-subtle'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>LEADERBOARD</span>
                  </button>

                  {/* Learning Analytics */}
                  <button
                    onClick={() => handleNavClick('progress')}
                    onMouseEnter={() => soundFx.hoverTick()}
                    className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1.5 px-2.5 rounded-lg cursor-pointer font-bold hidden xl:flex ${
                      currentView === 'progress'
                        ? 'text-purple bg-purple/10'
                        : 'hover:text-navy hover:bg-card-subtle'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>PROGRESS</span>
                  </button>
                </>
              )}
            </nav>

            {/* Zone 3: Audio Toggle, Theme Toggle, Rank Tag, and Profile/CTA */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              
              {/* Light / Dark Mode Toggle Button */}
              <button
                onClick={onToggleTheme}
                onMouseEnter={() => soundFx.hoverTick()}
                className={`p-2 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-center ${
                  theme === 'dark'
                    ? 'border-gold bg-gold/15 text-gold hover:bg-gold/25 shadow-[0_2px_0_var(--game-gold-dark)]'
                    : 'border-purple/30 bg-purple/10 text-purple hover:bg-purple/20 shadow-[0_2px_0_var(--border-color)]'
                }`}
                title={theme === 'dark' ? 'Switch to Day Mode' : 'Switch to Night Mode'}
                aria-label="Toggle Day and Night Mode"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-gold" />
                ) : (
                  <Moon className="w-4 h-4 text-purple" />
                )}
              </button>

              {/* Sound FX Toggle */}
              <button
                onClick={onToggleSound}
                onMouseEnter={() => soundFx.hoverTick()}
                className={`p-2 rounded-xl border-2 transition-colors cursor-pointer ${
                  user.soundEnabled
                    ? 'border-green bg-green/15 text-green shadow-[0_2px_0_var(--border-color)]'
                    : 'border-border bg-card text-muted'
                }`}
                title={user.soundEnabled ? 'Audio Active' : 'Audio Muted'}
                aria-label="Toggle Audio"
              >
                {user.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Four Progress-Based Ranks: Bronze, Silver, Gold, Platinum Badge */}
              {!isLanding && (
                <div className="hidden md:flex items-center gap-2 text-xs font-heading font-bold">
                  <div className="hidden xl:flex items-center gap-1 text-gold bg-gold/15 px-2.5 py-1 rounded-xl border-2 border-gold/40 tabular-nums shadow-[0_2px_0_var(--border-color)]">
                    <Flame className="w-3.5 h-3.5 fill-gold text-gold" />
                    <span>{user.streak}D STREAK</span>
                  </div>
                  <div 
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border-2 font-bold tabular-nums shadow-[0_2px_0_var(--border-color)]"
                    style={{
                      color: rankConfig.badgeColor,
                      borderColor: rankConfig.badgeColor + '55',
                      backgroundColor: rankConfig.badgeBg
                    }}
                    title={`Progress Rank: ${user.rankTier} (${user.xp} XP earned)`}
                  >
                    <span>{user.rankTier}</span>
                    <span className="opacity-40">·</span>
                    <span>{user.xp} XP</span>
                  </div>
                </div>
              )}

              {isLanding ? (
                <>
                  <button
                    onClick={() => {
                      soundFx.click();
                      onOpenAuth('login');
                    }}
                    onMouseEnter={() => soundFx.hoverTick()}
                    className="hidden sm:inline-flex text-xs font-bold text-navy hover:text-purple px-3 py-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    SIGN IN
                  </button>
                  <button
                    onClick={() => handleNavClick('world')}
                    onMouseEnter={() => soundFx.hoverTick()}
                    className="game-btn game-btn-purple px-4 py-2 text-xs font-bold tracking-wider text-white whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>START SPRINT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => {
                      soundFx.click();
                      setProfileDropdownOpen((prev) => !prev);
                    }}
                    onMouseEnter={() => soundFx.hoverTick()}
                    className="flex items-center gap-2 p-1.5 pl-2.5 bg-card hover:bg-card-hover rounded-xl border-2 border-border shadow-[0_2px_0_var(--border-color)] transition-colors cursor-pointer shrink-0"
                    title="Agent Profile & Settings"
                  >
                    <div className="flex flex-col text-right hidden sm:flex">
                      <span className="text-xs font-heading font-bold text-navy leading-tight">
                        {user.callsign}
                      </span>
                      <span className="text-[10px] font-bold text-green leading-tight">
                        LVL {user.level} · {user.rankTier}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-purple text-white flex items-center justify-center font-bold text-xs shadow-xs overflow-hidden shrink-0 border border-purple-dark">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-card border-2 border-border shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
                      <div className="px-3 py-2 border-b-2 border-border mb-1.5">
                        <div className="text-xs font-heading font-black text-navy truncate">
                          {user.callsign}
                        </div>
                        <div className="text-[10px] text-muted truncate">
                          {user.email}
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[10px] font-bold">
                          <span className="text-green">Level {user.level}</span>
                          <span className="text-gold">{user.xp} XP</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          handleNavClick('profile');
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-heading font-bold text-navy hover:bg-card-subtle rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <User className="w-4 h-4 text-purple" />
                        <span>Player Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          handleNavClick('dashboard');
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-heading font-bold text-navy hover:bg-card-subtle rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-green" />
                        <span>Dashboard</span>
                      </button>

                      <div className="border-t border-border my-1" />

                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setShowLogoutConfirm(true);
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-heading font-bold text-red hover:bg-red/10 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl border-2 border-border text-navy hover:bg-card-subtle cursor-pointer"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 z-30 bg-card border-b-2 border-border p-4 animate-in fade-in duration-150 font-sans text-sm shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
              <span className="text-muted text-xs font-bold">THEME PREFERENCE</span>
              <button
                onClick={onToggleTheme}
                className="px-3 py-1.5 rounded-xl border-2 border-border bg-card-subtle flex items-center gap-2 text-navy cursor-pointer font-bold"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-gold" />
                    <span>DAY MODE</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-purple" />
                    <span>NIGHT MODE</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => handleNavClick('world')}
              className="w-full text-left py-2.5 px-3 text-green font-bold hover:bg-card-subtle rounded-xl flex justify-between"
            >
              <span>EXPLORE ISLANDS</span>
              <span className="text-xs">MAP</span>
            </button>
            <button
              onClick={() => handleNavClick('world-3d')}
              className="w-full text-left py-2.5 px-3 text-purple font-bold hover:bg-card-subtle rounded-xl flex justify-between"
            >
              <span>3D WORLD</span>
              <span className="text-xs">EXPLORE</span>
            </button>
            <button
              onClick={() => handleNavClick('dashboard')}
              className="w-full text-left py-2.5 px-3 text-navy font-bold hover:bg-card-subtle rounded-xl flex justify-between"
            >
              <span>DASHBOARD</span>
              <span className="text-green font-bold">{user.xp} XP</span>
            </button>
            <button
              onClick={() => handleNavClick('paths')}
              className="w-full text-left py-2.5 px-3 text-navy font-bold hover:bg-card-subtle rounded-xl"
            >
              CHALLENGES
            </button>
            <button
              onClick={() => handleNavClick('leaderboard')}
              className="w-full text-left py-2.5 px-3 text-navy font-bold hover:bg-card-subtle rounded-xl"
            >
              LEADERBOARD
            </button>
            <button
              onClick={() => handleNavClick('progress')}
              className="w-full text-left py-2.5 px-3 text-navy font-bold hover:bg-card-subtle rounded-xl"
            >
              LEARNING ANALYTICS
            </button>
            <button
              onClick={() => handleNavClick('profile')}
              className="w-full text-left py-2.5 px-3 text-navy font-bold hover:bg-card-subtle rounded-xl"
            >
              PROFILE & RANK
            </button>

            {!isLanding && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowLogoutConfirm(true);
                }}
                className="w-full text-left py-2.5 px-3 text-red font-bold hover:bg-red/10 rounded-xl flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>LOG OUT</span>
              </button>
            )}

            {isLanding && (
              <div className="pt-3 border-t border-border flex gap-2">
                <button
                  onClick={() => {
                    soundFx.click();
                    onOpenAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 bg-card-subtle text-navy font-bold rounded-xl text-center cursor-pointer border-2 border-border"
                >
                  SIGN IN
                </button>
                <button
                  onClick={() => handleNavClick('world')}
                  className="game-btn game-btn-purple flex-1 py-2 text-white font-bold rounded-xl text-center cursor-pointer"
                >
                  START SPRINT
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans">
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
                onClick={() => {
                  soundFx.click();
                  authService.logout();
                  setShowLogoutConfirm(false);
                  if (onLogout) {
                    onLogout();
                  }
                }}
                className="game-btn game-btn-red flex-1 py-2.5 rounded-xl text-xs font-heading font-bold cursor-pointer"
              >
                LOG OUT
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
