import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ProgrammingIsland, 
  ProgrammingIslandId, 
  UserProfile 
} from '../../types';
import { VillageProgressService } from '../../services/villageProgressService';
import { soundFx } from '../../services/soundFx';
import { 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  Trophy, 
  Flame,
  Terminal,
  Database,
  Cpu,
  Brain,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export interface CodingWorldProps {
  user: UserProfile;
  theme?: 'dark' | 'light';
  onSelectIsland: (islandId: ProgrammingIslandId) => void;
  onOpenDashboard: () => void;
  onExplore3DIsles?: () => void;
}

export const CodingWorld: React.FC<CodingWorldProps> = ({
  user,
  onSelectIsland,
  onOpenDashboard,
  onExplore3DIsles
}) => {
  const [islands, setIslands] = useState<ProgrammingIsland[]>(() => VillageProgressService.getIslands());
  const [hoveredIslandId, setHoveredIslandId] = useState<ProgrammingIslandId | null>(null);
  const [selectedIslandId, setSelectedIslandId] = useState<ProgrammingIslandId | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Refresh progress whenever view opens
  useEffect(() => {
    setIslands(VillageProgressService.getIslands());
  }, []);

  // Subtle desktop pointer parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x: x * 14, y: y * 14 });
  };

  const handleIslandClick = (island: ProgrammingIsland) => {
    if (island.isLocked) {
      soundFx.errorDeflect();
      return;
    }
    soundFx.warpDrive();
    setSelectedIslandId(island.id);
    setTimeout(() => {
      onSelectIsland(island.id);
    }, 400);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="island-page-container relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden select-none transition-colors duration-250"
    >
      {/* 1. Atmospheric Sky & Celestial Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft atmospheric gradient radial glows */}
        <div className="absolute -top-40 left-1/4 w-[700px] h-[700px] rounded-full blur-[140px] pointer-events-none bg-gradient-to-br from-emerald-500/12 via-cyan-500/5 to-transparent opacity-80" />
        <div className="absolute top-1/3 -right-40 w-[800px] h-[800px] rounded-full blur-[160px] pointer-events-none bg-gradient-to-bl from-purple-600/12 via-rose-500/8 to-transparent opacity-80" />
        
        {/* Floating Clouds Layer (Gentle Drift) */}
        <motion.div 
          animate={{ x: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 opacity-20 pointer-events-none"
        >
          <div className="absolute top-20 left-10 w-96 h-36 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-40 right-20 w-[30rem] h-48 bg-purple-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-80 h-32 bg-emerald-400/10 rounded-full blur-3xl" />
        </motion.div>

        {/* Ambient Grid Accent */}
        <div className="absolute inset-0 [background-size:32px_32px] bg-[radial-gradient(currentColor_0.75px,transparent_1px)] opacity-[0.06] pointer-events-none" />
      </div>

      {/* 2. Top World Title & Dossier HUD Header */}
      <div className="relative z-20 px-6 pt-6 sm:px-12 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-heading font-bold tracking-widest uppercase">
            <span className="w-2.5 h-2.5 rounded-full animate-ping bg-green" />
            <span className="island-kicker">
              CODESPRINT REALM · 4 FLOATING ISLES
            </span>
          </div>
          <h1 className="island-heading text-2xl sm:text-3xl font-extrabold font-heading tracking-tight mt-1">
            Choose Your Destination
          </h1>
          <p className="island-subtitle text-xs sm:text-sm font-sans max-w-xl">
            Explore 4 distinct technology worlds. Enter villages, solve progressive challenges, earn XP, and unlock high-tier mastery.
          </p>
        </div>

        {/* User Quick Stats Widget */}
        <div className="flex items-center gap-3">
          <div className="island-hud-widget px-4 py-2 rounded-xl flex items-center gap-3 shadow-md border-2 border-border backdrop-blur-xl transition-colors">
            <div className="flex items-center gap-1.5 text-gold font-heading text-xs font-bold">
              <Flame className="w-4 h-4 fill-gold text-gold" />
              <span>{user.streak}D STREAK</span>
            </div>
            <div className="h-4 w-[2px] opacity-25 bg-current" />
            <div className="text-xs font-heading font-bold">
              <span className="text-green">{user.xp}</span>{' '}
              <span className="opacity-60 font-normal">XP</span>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.click();
              onOpenDashboard();
            }}
            className="game-btn game-btn-card px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
          >
            <Trophy className="w-4 h-4 text-gold" />
            <span>DASHBOARD</span>
          </button>

          {onExplore3DIsles && (
            <button
              onClick={() => {
                soundFx.click();
                onExplore3DIsles();
              }}
              className="game-btn game-btn-purple px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm text-white active:scale-95"
              title="Switch to 3D Avatar Exploration"
            >
              <Compass className="w-4 h-4" />
              <span>3D WORLD</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. THE FOUR FLOATING PROGRAMMING ISLANDS */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
        <motion.div 
          style={{
            transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full items-stretch"
        >
          {islands.map((island, index) => {
            const stats = VillageProgressService.getIslandStats(island.id);
            const isHovered = hoveredIslandId === island.id;
            const isSelected = selectedIslandId === island.id;
            const isDimmed = selectedIslandId !== null && !isSelected;

            return (
              <motion.div
                key={island.id}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ 
                  opacity: isDimmed ? 0.4 : 1, 
                  y: isSelected ? -8 : 0,
                  scale: isSelected ? 1.03 : 1
                }}
                transition={{ 
                  delay: index * 0.08, 
                  duration: 0.45, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                onMouseEnter={() => {
                  soundFx.hoverTick();
                  setHoveredIslandId(island.id);
                }}
                onMouseLeave={() => setHoveredIslandId(null)}
                onClick={() => handleIslandClick(island)}
                className={`relative group cursor-pointer transition-transform duration-300 rounded-3xl h-full flex flex-col ${
                  isHovered ? '-translate-y-2' : ''
                }`}
              >
                {/* Floating Island Visual Card Entity (Theme Variables Driven) */}
                <div 
                  className={`island-entity-${island.id} relative overflow-hidden rounded-2xl border-2 transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between h-full min-h-[480px]`}>
                  
                  {/* Card Section 1: Top Bar with Island Icon & Level Badge */}
                  <div className="relative z-10 flex items-center justify-between pb-1">
                    {/* Island Avatar Badge */}
                    <div 
                      className={`island-icon-${island.id} w-11 h-11 rounded-xl flex items-center justify-center shadow-sm border-2 transition-colors`}
                    >
                      {island.id === 'python' && <Terminal className="w-5 h-5" />}
                      {island.id === 'sql' && <Database className="w-5 h-5" />}
                      {island.id === 'java' && <Cpu className="w-5 h-5" />}
                      {island.id === 'ai' && <Brain className="w-5 h-5" />}
                    </div>

                    {/* Level / Status Pill */}
                    {island.isLocked ? (
                      <div className="island-badge-locked flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-bold border-2">
                        <Lock className="w-3.5 h-3.5" />
                        <span>LVL {island.levelRequirement}</span>
                      </div>
                    ) : stats.progressPercent === 100 ? (
                      <div className={`island-badge-${island.id} flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-bold border-2`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>CONQUERED</span>
                      </div>
                    ) : (
                      <div className={`island-badge-${island.id} flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-bold border-2 transition-colors`}>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>LEVEL {stats.currentLevel}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Section 2: DEDICATED ARTWORK STAGE */}
                  <div className="relative w-full h-40 sm:h-44 flex items-center justify-center my-2 select-none overflow-visible">
                    {/* Ambient shadow beneath island */}
                    <div 
                      className="absolute w-36 h-10 rounded-full blur-lg pointer-events-none opacity-20"
                      style={{ 
                        backgroundColor: island.accentColor,
                      }} 
                    />

                    {/* Floating Island Core Artwork with gentle vertical hover animation */}
                    <motion.div
                      animate={{ y: [0, index % 2 === 0 ? -6 : -8, 0] }}
                      transition={{
                        duration: 4.5 + index * 0.6,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                      className="relative flex items-center justify-center pointer-events-none"
                    >
                      {island.id === 'python' && (
                        <svg viewBox="0 0 200 200" className="w-44 h-44 sm:w-48 sm:h-48 drop-shadow-md">
                          {/* Floating Island Soil Crust */}
                          <polygon points="30,120 170,120 140,175 60,175" fill="#7C532A" />
                          <polygon points="40,120 160,120 130,165 70,165" fill="#63401D" />
                          {/* Lush Emerald Surface Plateau */}
                          <ellipse cx="100" cy="118" rx="72" ry="22" fill="#4CB963" />
                          <ellipse cx="100" cy="116" rx="66" ry="18" fill="#6EE7B7" />
                          {/* Waterfall */}
                          <path d="M 85,120 Q 86,150 84,175" stroke="#38BDF8" strokeWidth="5" strokeLinecap="round" opacity="0.95" />
                          {/* Illustrated Trees */}
                          <circle cx="65" cy="98" r="14" fill="#37954C" />
                          <circle cx="80" cy="92" r="16" fill="#4CB963" />
                          <circle cx="130" cy="95" r="15" fill="#2E7D32" />
                          <polygon points="63,98 67,98 66,114 64,114" fill="#4B3621" />
                          {/* Glowing Checkpoint Crystal */}
                          <polygon points="100,75 108,90 100,105 92,90" fill="#FFC53D" opacity="0.95" />
                        </svg>
                      )}

                      {island.id === 'sql' && (
                        <svg viewBox="0 0 200 200" className="w-44 h-44 sm:w-48 sm:h-48 drop-shadow-md">
                          {/* Data Island Base */}
                          <polygon points="25,120 175,120 145,178 55,178" fill="#5A6B82" />
                          <polygon points="35,120 165,120 135,168 65,168" fill="#475569" />
                          {/* Sky Blue Surface */}
                          <ellipse cx="100" cy="118" rx="72" ry="22" fill="#38BDF8" />
                          <ellipse cx="100" cy="116" rx="65" ry="17" fill="#7DD3FC" />
                          {/* Database Crystal Towers */}
                          <rect x="68" y="72" width="18" height="42" rx="4" fill="#0284C7" />
                          <rect x="92" y="58" width="22" height="56" rx="5" fill="#0369A1" />
                          <rect x="120" y="80" width="16" height="34" rx="4" fill="#38BDF8" />
                          {/* Floating Rings */}
                          <ellipse cx="103" cy="74" rx="28" ry="8" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4 3" />
                        </svg>
                      )}

                      {island.id === 'java' && (
                        <svg viewBox="0 0 200 200" className="w-44 h-44 sm:w-48 sm:h-48 drop-shadow-md">
                          {/* Mechanical Java Base */}
                          <polygon points="30,120 170,120 140,178 60,178" fill="#7C4A50" />
                          <polygon points="40,120 160,120 130,168 70,168" fill="#5F363C" />
                          {/* Terraced Coral Platform */}
                          <ellipse cx="100" cy="118" rx="72" ry="22" fill="#EF5B5B" />
                          <ellipse cx="100" cy="116" rx="65" ry="17" fill="#FDA4AF" />
                          {/* Clockwork Towers & Bridge */}
                          <rect x="65" y="68" width="20" height="46" fill="#BE123C" rx="3" />
                          <rect x="115" y="68" width="20" height="46" fill="#BE123C" rx="3" />
                          <line x1="85" y1="88" x2="115" y2="88" stroke="#EF5B5B" strokeWidth="3" />
                          {/* Glowing Core Spire */}
                          <polygon points="100,50 108,74 92,74" fill="#FFC53D" />
                        </svg>
                      )}

                      {island.id === 'ai' && (
                        <svg viewBox="0 0 200 200" className="w-44 h-44 sm:w-48 sm:h-48 drop-shadow-md">
                          {/* AI Crystal Base */}
                          <polygon points="30,120 170,120 140,178 60,178" fill="#5B4A78" />
                          <polygon points="40,120 160,120 130,168 70,168" fill="#44355E" />
                          {/* Purple Surface */}
                          <ellipse cx="100" cy="118" rx="72" ry="22" fill="#7B5CFF" />
                          <ellipse cx="100" cy="116" rx="65" ry="17" fill="#C084FC" />
                          {/* Synaptic Neural Nodes */}
                          <circle cx="75" cy="80" r="7" fill="#F472B6" />
                          <circle cx="125" cy="80" r="7" fill="#F472B6" />
                          <circle cx="100" cy="62" r="9" fill="#A855F7" />
                          <line x1="75" y1="80" x2="100" y2="62" stroke="#E9D5FF" strokeWidth="2" />
                          <line x1="125" y1="80" x2="100" y2="62" stroke="#E9D5FF" strokeWidth="2" />
                          <line x1="75" y1="80" x2="125" y2="80" stroke="#E9D5FF" strokeWidth="2" strokeDasharray="3 3" />
                        </svg>
                      )}
                    </motion.div>
                  </div>

                  {/* Card Section 3: Text, Progress & Action */}
                  <div className="relative z-10 flex flex-col justify-between gap-3 pt-2 mt-auto">
                    {/* Island Title & Subtitle */}
                    <div>
                      <h2 className="island-card-title text-xl sm:text-2xl font-extrabold font-heading tracking-tight flex items-center justify-between">
                        <span>{island.name}</span>
                        <ChevronRight className={`island-card-chevron w-5 h-5 transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''}`} />
                      </h2>
                      <p className="island-card-desc text-xs font-sans line-clamp-2 mt-1 leading-relaxed">
                        {island.subtitle}
                      </p>
                    </div>

                    {/* Progress Indicator Container */}
                    <div className="island-prog-box p-3 rounded-2xl border-2 space-y-2 transition-colors">
                      <div className="flex items-center justify-between text-xs font-heading font-bold">
                        <span className="island-prog-label">
                          {stats.completedCount} / {stats.totalCount} Villages
                        </span>
                        <span className="island-prog-pct">
                          {stats.progressPercent}%
                        </span>
                      </div>

                      {/* Progress Bar Track & Fill */}
                      <div className="island-prog-track w-full h-2.5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${stats.progressPercent}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: island.accentColor }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      className="game-btn island-action-btn w-full py-3 rounded-xl text-xs font-heading font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border-2"
                      disabled={island.isLocked}
                    >
                      <span>{island.isLocked ? `LOCKED (LVL ${island.levelRequirement})` : 'ENTER ISLAND'}</span>
                      {island.isLocked ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* 4. Bottom Environmental Scenery & Floating Status Bar */}
      <div className="island-footer relative z-10 px-6 py-4 border-t-2 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-xs font-heading font-bold transition-colors">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green" />
          <span>CONTINUOUS PROGRESS SAVED AUTOMATICALLY</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-green">PYTHON (LOGIC)</span>
          <span className="opacity-40">·</span>
          <span className="text-sky">SQL (DATA)</span>
          <span className="opacity-40">·</span>
          <span className="text-red">JAVA (OOP)</span>
          <span className="opacity-40">·</span>
          <span className="text-purple">AI (NEURAL)</span>
        </div>
      </div>
    </div>
  );
};
