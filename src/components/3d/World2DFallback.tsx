import React, { useState, useEffect } from 'react';
import { 
  ProgrammingIsland, 
  ProgrammingIslandId 
} from '../../types';
import { VillageProgressService } from '../../services/villageProgressService';
import { soundFx } from '../../services/soundFx';
import { 
  Lock, 
  Star, 
  Terminal, 
  Database, 
  Cpu, 
  Brain, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

export interface World2DFallbackProps {
  onSelectIsland: (islandId: ProgrammingIslandId) => void;
  theme?: 'dark' | 'light';
  errorMessage?: string;
}

export const World2DFallback: React.FC<World2DFallbackProps> = ({
  onSelectIsland,
  theme = 'light',
  errorMessage
}) => {
  const [islands, setIslands] = useState<ProgrammingIsland[]>(() => VillageProgressService.getIslands());
  const [hoveredIsland, setHoveredIsland] = useState<ProgrammingIslandId | null>(null);

  useEffect(() => {
    setIslands(VillageProgressService.getIslands());
  }, []);

  const handleIslandClick = (island: ProgrammingIsland) => {
    if (island.isLocked) {
      soundFx.errorDeflect();
      return;
    }
    soundFx.warpDrive();
    onSelectIsland(island.id);
  };

  const isDark = theme === 'dark';

  const islandCardData: Array<{
    id: ProgrammingIslandId;
    title: string;
    icon: typeof Terminal;
    accentColor: string;
    badgeBg: string;
    badgeBorder: string;
    badgeInner: string;
    subtitle: string;
  }> = [
    {
      id: 'python',
      title: 'Python Archipelago',
      icon: Terminal,
      accentColor: '#16A34A',
      badgeBg: 'bg-green-700',
      badgeBorder: 'border-green-300',
      badgeInner: 'bg-green-500',
      subtitle: 'Emerald Grove · Variables & Algorithms'
    },
    {
      id: 'java',
      title: 'Java Foundry',
      icon: Cpu,
      accentColor: '#EA580C',
      badgeBg: 'bg-orange-700',
      badgeBorder: 'border-orange-300',
      badgeInner: 'bg-orange-500',
      subtitle: 'Coral Stone Keep · OOP & Architecture'
    },
    {
      id: 'sql',
      title: 'SQL Archipelago',
      icon: Database,
      accentColor: '#0284C7',
      badgeBg: 'bg-sky-700',
      badgeBorder: 'border-sky-300',
      badgeInner: 'bg-sky-500',
      subtitle: 'Azure Lagoon · Relational Query Matrix'
    },
    {
      id: 'ai',
      title: 'AI Sanctuary',
      icon: Brain,
      accentColor: '#9333EA',
      badgeBg: 'bg-purple-700',
      badgeBorder: 'border-purple-300',
      badgeInner: 'bg-purple-500',
      subtitle: 'Neural Spire · Machine Learning Frontiers'
    }
  ];

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden select-none bg-gradient-to-b from-[#CFEFFF] to-[#EAF8FF] dark:from-[#0B132B] dark:to-[#1C2E5E] transition-colors duration-500">
      
      {/* Notice Pill */}
      {errorMessage && (
        <aside aria-label="System Notice" className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/90 dark:bg-card/90 border-2 border-border shadow-sm text-xs font-bold text-navy dark:text-white backdrop-blur-md">
            <Info className="w-3.5 h-3.5 text-purple shrink-0" />
            <span>2D Map Mode: {errorMessage}</span>
          </div>
        </aside>
      )}

      {/* Floating clouds in sky */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-8 left-12 w-64 h-24 bg-white/70 dark:bg-white/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-20 right-16 w-80 h-32 bg-white/70 dark:bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-16 left-1/3 w-96 h-28 bg-white/60 dark:bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* 4 Interactive Island Cards Grid matching theme.png */}
      <div className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple/15 text-purple font-extrabold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive World Matrix</span>
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-navy dark:text-white tracking-tight">
            Choose Your Destination Island
          </h1>
          <p className="text-sm font-sans font-semibold text-muted dark:text-neutral-300 mt-1 max-w-lg mx-auto">
            Click an island to enter its village map, explore quests, and master programming drills.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {islandCardData.map((item) => {
            const island = islands.find((i) => i.id === item.id) || islands[0];
            const stats = VillageProgressService.getIslandStats(item.id);
            const isHovered = hoveredIsland === item.id;
            const isComplete = stats.progressPercent === 100 && stats.totalCount > 0;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleIslandClick(island)}
                onMouseEnter={() => {
                  soundFx.hoverTick();
                  setHoveredIsland(item.id);
                }}
                onMouseLeave={() => setHoveredIsland(null)}
                className={`relative group text-left rounded-3xl p-5 border-2 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer ${
                  island.isLocked
                    ? 'bg-card/70 border-border/70 opacity-80 cursor-not-allowed shadow-sm'
                    : isHovered
                    ? 'bg-card border-navy/30 dark:border-white/30 -translate-y-2 shadow-xl'
                    : 'bg-card/95 border-border shadow-md hover:border-purple/40'
                }`}
                style={{
                  boxShadow: isHovered && !island.isLocked 
                    ? `0 14px 28px -10px ${item.accentColor}40, 0 4px 0 var(--border-color)` 
                    : '0 4px 0 var(--border-color)'
                }}
              >
                {/* Island Biome Header Accent */}
                <div 
                  className="absolute top-0 inset-x-0 h-2.5" 
                  style={{ backgroundColor: item.accentColor }} 
                />

                <div>
                  {/* Top Status Row */}
                  <div className="flex items-center justify-between mb-4 mt-1">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-110"
                      style={{ backgroundColor: item.accentColor }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    {island.isLocked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-extrabold text-[11px] border border-red-300 dark:border-red-800">
                        <Lock className="w-3 h-3" />
                        <span>LOCKED</span>
                      </span>
                    ) : isComplete ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-extrabold text-[11px] border border-amber-300 dark:border-amber-800">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>MASTERED</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 font-extrabold text-[11px] border border-green-300 dark:border-green-800">
                        <span>ACTIVE</span>
                      </span>
                    )}
                  </div>

                  {/* Island Title */}
                  <h2 className="text-xl font-black font-heading text-navy dark:text-white leading-tight">
                    {island.name}
                  </h2>
                  <p className="text-xs font-sans font-semibold text-muted dark:text-neutral-300 mt-1 line-clamp-2">
                    {item.subtitle}
                  </p>
                </div>

                {/* Progress Bar & Footer */}
                <div className="mt-6 pt-4 border-t border-border/80">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-muted dark:text-neutral-400 font-sans">
                      {stats.completedCount} / {stats.totalCount} Villages
                    </span>
                    <span className="font-heading font-extrabold text-navy dark:text-white">
                      {stats.progressPercent}%
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden border border-border/60">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.max(5, stats.progressPercent)}%`,
                        backgroundColor: item.accentColor 
                      }}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase text-muted tracking-wide">
                      {item.id.toUpperCase()} REALM
                    </span>
                    <div 
                      className="flex items-center gap-1 text-xs font-extrabold transition-transform group-hover:translate-x-1"
                      style={{ color: item.accentColor }}
                    >
                      <span>{island.isLocked ? 'Unlock at Lv. ' + island.levelRequirement : 'Enter Isle'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Wave Shoreline Accent */}
      <div className="relative w-full h-12 bg-white/40 dark:bg-black/20 backdrop-blur-sm border-t border-white/60 dark:border-white/10 flex items-center justify-center px-4 text-xs font-bold font-sans text-muted dark:text-neutral-400">
        <span>Press any island card above to initiate teleport warp sequence</span>
      </div>
    </div>
  );
};
