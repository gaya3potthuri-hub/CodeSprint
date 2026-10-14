import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ProgrammingIslandId, 
  Village, 
  UserProfile 
} from '../../types';
import { VillageProgressService } from '../../services/villageProgressService';
import { soundFx } from '../../services/soundFx';
import { 
  ArrowLeft, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Star, 
  Play, 
  Layers, 
  RotateCw, 
  Castle, 
  Mountain, 
  Trees, 
  Compass, 
  Anchor, 
  Database, 
  Share2, 
  Shield, 
  Cpu, 
  Sliders, 
  Box, 
  GitBranch, 
  Grid, 
  TrendingUp, 
  Network, 
  Eye, 
  Brain,
  Award,
  ChevronRight
} from 'lucide-react';

interface VillageMapProps {
  islandId: ProgrammingIslandId;
  user: UserProfile;
  theme?: 'dark' | 'light';
  onSelectVillage: (village: Village) => void;
  onBackToWorld: () => void;
}

// Icon mapper for village representations with theme-conscious contrast
const renderVillageIcon = (iconName: string, state: string, accentColor: string) => {
  const isCompleted = state === 'completed';
  const isLocked = state === 'locked';
  const color = isCompleted ? '#4CB963' : isLocked ? '#798CA8' : accentColor;

  switch (iconName) {
    case 'Trees': return <Trees className="w-6 h-6" style={{ color }} />;
    case 'RotateCw': return <RotateCw className="w-6 h-6" style={{ color }} />;
    case 'Layers': return <Layers className="w-6 h-6" style={{ color }} />;
    case 'Castle': return <Castle className="w-6 h-6" style={{ color }} />;
    case 'Mountain': return <Mountain className="w-6 h-6" style={{ color }} />;
    case 'Anchor': return <Anchor className="w-6 h-6" style={{ color }} />;
    case 'Compass': return <Compass className="w-6 h-6" style={{ color }} />;
    case 'Database': return <Database className="w-6 h-6" style={{ color }} />;
    case 'Share2': return <Share2 className="w-6 h-6" style={{ color }} />;
    case 'Shield': return <Shield className="w-6 h-6" style={{ color }} />;
    case 'Cpu': return <Cpu className="w-6 h-6" style={{ color }} />;
    case 'Sliders': return <Sliders className="w-6 h-6" style={{ color }} />;
    case 'Box': return <Box className="w-6 h-6" style={{ color }} />;
    case 'GitBranch': return <GitBranch className="w-6 h-6" style={{ color }} />;
    case 'Grid': return <Grid className="w-6 h-6" style={{ color }} />;
    case 'Sparkles': return <Sparkles className="w-6 h-6" style={{ color }} />;
    case 'TrendingUp': return <TrendingUp className="w-6 h-6" style={{ color }} />;
    case 'Network': return <Network className="w-6 h-6" style={{ color }} />;
    case 'Eye': return <Eye className="w-6 h-6" style={{ color }} />;
    case 'Brain': return <Brain className="w-6 h-6" style={{ color }} />;
    default: return <Compass className="w-6 h-6" style={{ color }} />;
  }
};

export const VillageMap: React.FC<VillageMapProps> = ({
  islandId,
  user,
  theme,
  onSelectVillage,
  onBackToWorld
}) => {
  const island = VillageProgressService.getIsland(islandId);
  const stats = VillageProgressService.getIslandStats(islandId);
  const [hoveredVillage, setHoveredVillage] = useState<Village | null>(null);

  const handleVillageClick = (village: Village) => {
    if (village.state === 'locked') {
      soundFx.errorDeflect();
      return;
    }
    soundFx.lockIn();
    onSelectVillage(village);
  };

  const getVillageStars = (v: Village): number => {
    if (v.bestScore) {
      if (v.bestScore.accuracy >= 90) return 3;
      if (v.bestScore.accuracy >= 70) return 2;
      return 1;
    }
    if (v.state === 'completed') return 3;
    return 0;
  };

  // Generate SVG path connecting the 5 villages sequentially
  const villagesSorted = [...island.villages].sort((a, b) => a.order - b.order);
  const pathD = villagesSorted.reduce((acc, v, idx) => {
    if (idx === 0) return `M ${v.coordinates.xPercent} ${v.coordinates.yPercent}`;
    // Curve naturally between checkpoints
    const prev = villagesSorted[idx - 1];
    const midX = (prev.coordinates.xPercent + v.coordinates.xPercent) / 2;
    const midY = (prev.coordinates.yPercent + v.coordinates.yPercent) / 2 - 4;
    return `${acc} Q ${midX} ${midY}, ${v.coordinates.xPercent} ${v.coordinates.yPercent}`;
  }, '');

  return (
    <div className="map-page-container relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden select-none transition-colors duration-200 font-sans">
      
      {/* 1. Header Toolbar with Return to World Map & Island Meta */}
      <div className="map-header relative z-20 px-6 py-4 sm:px-10 border-b-2 border-border backdrop-blur-md flex flex-wrap items-center justify-between gap-4 transition-colors duration-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              soundFx.click();
              onBackToWorld();
            }}
            className="game-btn game-btn-card px-3.5 py-2 text-xs font-bold text-navy rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-purple" />
            <span>WORLD MAP</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span 
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: island.accentColor }}
              />
              <span className="text-xs font-heading font-bold tracking-widest uppercase text-muted">
                {island.theme}
              </span>
            </div>
            <h1 className="map-header-title text-xl sm:text-2xl font-extrabold font-heading tracking-tight">
              {island.name} · Village Progression
            </h1>
          </div>
        </div>

        {/* Island Stats Strip with Coins Counter */}
        <div className="flex items-center gap-3">
          <div className="map-stats-widget border-2 border-border px-4 py-2 rounded-xl flex items-center gap-4 text-xs font-heading font-bold shadow-md">
            <div>
              <span className="text-muted block text-[10px]">PROGRESS</span>
              <span className="font-bold text-navy">{stats.completedCount} / {stats.totalCount} Villages</span>
            </div>
            <div className="h-6 w-[2px] bg-border" />
            <div>
              <span className="text-muted block text-[10px]">MASTERY</span>
              <span className="font-bold text-green">{stats.progressPercent}%</span>
            </div>
            <div className="h-6 w-[2px] bg-border" />
            <div className="flex items-center gap-1.5 text-gold font-extrabold" title="Gold Coins">
              <span className="text-sm">🪙</span>
              <span>{user.coins ?? 240}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Illustrated Island Terrain & Village Progression Map */}
      <div className="relative flex-1 w-full min-h-[560px] flex items-center justify-center p-4 sm:p-8 overflow-hidden">
        {/* Themed Background Gradients & Environmental Atmospheres */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${island.accentColor}22 0%, transparent 70%)`
          }}
        />

        {/* The Illustrated Map Canvas Container */}
        <div className="map-canvas-container relative w-full max-w-5xl h-[520px] rounded-3xl border backdrop-blur-xl transition-colors duration-200 overflow-hidden">
          {/* Topographical Island Contours in SVG */}
          <svg 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            {/* Colourful Ambient Island Mass */}
            <path
              d="M 8,82 Q 12,30 45,20 Q 75,10 92,35 Q 98,75 75,90 Q 40,96 8,82 Z"
              fill={island.accentColor}
              fillOpacity="0.08"
            />
            <path
              d="M 12,80 Q 18,36 48,26 Q 72,18 88,40 Q 94,72 72,86 Q 42,92 12,80 Z"
              stroke={island.accentColor}
              strokeWidth="0.4"
              strokeDasharray="2 2"
              fill="none"
              strokeOpacity="0.45"
            />

            {/* Base Winding Progression Path Connecting the Villages */}
            <path
              d={pathD}
              fill="none"
              stroke="var(--map-path-base)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            
            {/* Glowing Illuminated Active/Completed Path */}
            <path
              d={pathD}
              fill="none"
              stroke={island.accentColor}
              strokeWidth="1.4"
              strokeDasharray="3 3"
              strokeLinecap="round"
              className="animate-pulse"
              strokeOpacity="0.9"
            />
          </svg>

          {/* Render the 5 Village Nodes */}
          {island.villages.map((village) => {
            const isCompleted = village.state === 'completed';
            const isAvailable = village.state === 'available';
            const isInProgress = village.state === 'in_progress';
            const isLocked = village.state === 'locked';

            return (
              <div
                key={village.id}
                style={{
                  left: `${village.coordinates.xPercent}%`,
                  top: `${village.coordinates.yPercent}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className="absolute z-20 flex flex-col items-center"
              >
                {/* Interactive Village Monument Node */}
                <motion.div
                  whileHover={{ scale: isLocked ? 1.02 : 1.15 }}
                  whileTap={{ scale: isLocked ? 1 : 0.95 }}
                  onClick={() => handleVillageClick(village)}
                  onMouseEnter={() => {
                    soundFx.hoverTick();
                    setHoveredVillage(village);
                  }}
                  onMouseLeave={() => setHoveredVillage(null)}
                  className={`relative p-3.5 rounded-2xl border-2 flex items-center justify-center transition-all cursor-pointer shadow-md ${
                    isCompleted
                      ? 'bg-green/20 border-green shadow-[0_3px_0_var(--game-green-dark)]'
                      : isAvailable || isInProgress
                      ? 'map-node-card border-border shadow-[0_3px_0_var(--border-color)] hover:border-purple'
                      : 'bg-card-subtle border-border opacity-60 cursor-not-allowed'
                  }`}
                  style={{
                    borderColor: isAvailable ? island.accentColor : undefined,
                  }}
                >
                  {/* Node Sequence Number Badge */}
                  <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-navy text-white border-2 border-white flex items-center justify-center text-xs font-heading font-black shadow-md z-10">
                    {village.order}
                  </div>

                  {/* Village Themed Icon */}
                  {renderVillageIcon(village.icon, village.state, island.accentColor)}

                  {/* Village State Status Badges */}
                  {isCompleted && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-green text-white flex items-center justify-center shadow-md animate-bounce">
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  {isLocked && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-card-alt border border-border text-muted flex items-center justify-center shadow-sm">
                      <Lock className="w-3 h-3" />
                    </div>
                  )}

                  {isAvailable && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gold text-navy flex items-center justify-center shadow-md animate-pulse">
                      <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                    </div>
                  )}
                </motion.div>

                {/* 1-3 Stars Display per village node */}
                <div className="flex items-center gap-0.5 mt-1 bg-card/90 backdrop-blur-xs px-2 py-0.5 rounded-full border border-border shadow-xs">
                  {[1, 2, 3].map((starNum) => {
                    const stars = getVillageStars(village);
                    const isFilled = starNum <= stars;
                    return (
                      <Star
                        key={starNum}
                        className={`w-3 h-3 ${
                          isFilled
                            ? 'fill-gold text-gold'
                            : 'text-border fill-card-subtle'
                        }`}
                      />
                    );
                  })}
                </div>

                {/* Village Title Label */}
                <div 
                  onClick={() => handleVillageClick(village)}
                  className={`mt-1 text-center cursor-pointer transition-colors max-w-[130px]`}
                >
                  <div className={`map-node-title text-xs font-heading font-bold leading-tight ${
                    isLocked ? 'opacity-50' : 'opacity-100'
                  }`}>
                    {village.title}
                  </div>
                  <div className="map-node-subtitle text-[10px] font-sans truncate mt-0.5 font-bold">
                    {village.difficulty}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Hovered / Inspected Village Preview Card (Floating overlay) */}
          <AnimatePresence>
            {hoveredVillage && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="map-preview-card absolute bottom-6 right-6 z-30 max-w-sm p-5 rounded-2xl border-2 border-border bg-card text-navy shadow-xl pointer-events-auto"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-heading font-bold text-purple uppercase tracking-wider">
                    VILLAGE #{hoveredVillage.order}
                  </span>
                  <span 
                    className={`text-[10px] font-heading font-bold px-2 py-0.5 rounded-lg uppercase ${
                      hoveredVillage.state === 'completed'
                        ? 'bg-green/20 text-green'
                        : hoveredVillage.state === 'available'
                        ? 'bg-gold/20 text-gold'
                        : 'bg-card-subtle text-muted'
                    }`}
                  >
                    {hoveredVillage.state.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="map-preview-title text-base font-extrabold font-heading text-navy">
                  {hoveredVillage.title}
                </h3>

                {/* Stars in Preview Card */}
                <div className="flex items-center gap-1.5 my-1.5">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((starNum) => (
                      <Star
                        key={starNum}
                        className={`w-3.5 h-3.5 ${
                          starNum <= getVillageStars(hoveredVillage)
                            ? 'fill-gold text-gold'
                            : 'text-border fill-card-subtle'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-heading font-bold text-navy">
                    {getVillageStars(hoveredVillage) > 0 ? `${getVillageStars(hoveredVillage)} / 3 Stars` : 'Unrated'}
                  </span>
                </div>

                <p className="map-preview-desc text-xs font-sans mt-1 leading-relaxed text-muted">
                  {hoveredVillage.description}
                </p>

                {/* Topics covered */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {hoveredVillage.topics.map((t) => (
                    <span 
                      key={t}
                      className="map-preview-topic text-[10px] font-heading font-bold px-2 py-0.5 rounded-lg border border-border bg-card-subtle text-navy"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Lock Explanation or CTA */}
                {hoveredVillage.state === 'locked' ? (
                  <div className="mt-4 p-2.5 rounded-xl bg-card-subtle border-2 border-border text-xs text-gold font-heading font-bold flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    <span>{hoveredVillage.prerequisiteExplanation || 'Complete prior villages to unlock.'}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleVillageClick(hoveredVillage)}
                    className="game-btn game-btn-purple mt-4 w-full py-2.5 text-white font-heading text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>ENTER VILLAGE & PRACTICE</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Bottom Legend & Instructions */}
      <div className="map-footer relative z-20 px-6 py-3 border-t-2 border-border backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-xs font-heading font-bold transition-colors duration-200">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
            <span className="text-navy">Available</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green" />
            <span className="text-navy">Completed</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-muted" />
            <span className="text-muted">Locked</span>
          </span>
        </div>
        <div>
          <span className="text-muted">Click any available village to start your challenge</span>
        </div>
      </div>
    </div>
  );
};
