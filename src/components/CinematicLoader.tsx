import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Terminal, Database, Cpu, Brain, Sparkles, ArrowRight } from 'lucide-react';
import { soundFx } from '../services/soundFx';

interface CinematicLoaderProps {
  onComplete: () => void;
  targetIslandName?: string;
}

const PHASES = [
  'AUTHENTICATING STUDENT CLEARANCE · ESTABLISHING DIGITAL LINK...',
  'CONJURING BLUE-VIOLET CELESTIAL HORIZON & CLOUD MESH...',
  'RENDERING PYTHON ISLAND: LOGIC FORESTS & CASCADE WATERFALLS...',
  'SYNTHESIZING SQL ISLAND: RELATIONAL TOWERS & CRYSTAL CONDUITS...',
  'MATERIALIZING JAVA ISLAND: OBJECT FOUNDRIES & CIRCUITS...',
  'CALIBRATING AI ISLAND: NEURAL NETWORKS & SYNAPSE NODES...',
  'THE WORLD OF CODING HAS AWAKENED · ENTERING CODESPRINT...'
];

export const CinematicLoader: React.FC<CinematicLoaderProps> = ({ onComplete }) => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    soundFx.warpDrive();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            soundFx.rankUp();
            onComplete();
          }, 300);
          return 100;
        }
        return prev + 20;
      });

      setPhaseIndex((prev) => (prev < PHASES.length - 1 ? prev + 1 : prev));
    }, 380);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-page text-navy flex flex-col items-center justify-center p-6 font-sans select-none overflow-hidden">
      {/* Sky Blue & Sun Glow Ambient Light */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0.3, 0.6, 0.4], scale: [1, 1.2, 1.1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-[700px] h-[700px] bg-gradient-to-tr from-sky/30 via-purple/20 to-gold/20 rounded-full blur-[120px] pointer-events-none" 
      />

      <div className="relative max-w-xl w-full space-y-8 text-center z-10">
        {/* Emblem */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-16 h-16 mx-auto rounded-2xl bg-purple border-2 border-purple-dark flex items-center justify-center text-white shadow-[0_4px_0_var(--game-purple-dark)]"
        >
          <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
        </motion.div>

        {/* Title */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-green tracking-widest uppercase block font-heading">
            EXPLORING THE FLOATING ISLES
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight font-heading">
            CODESPRINT · WORLD OF CODING
          </h2>
          <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
            Four floating technology islands are rising above the clouds.
          </p>
        </div>

        {/* 4 Programming Islands Preview Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="game-card p-3.5 bg-card border-2 border-green/40 text-left shadow-[0_3px_0_var(--game-green-dark)]">
            <Terminal className="w-5 h-5 text-green mb-1.5" />
            <div className="text-xs text-navy font-bold font-heading">PYTHON</div>
            <div className="text-[10px] text-muted">Logic Forest</div>
          </div>

          <div className="game-card p-3.5 bg-card border-2 border-sky/40 text-left shadow-[0_3px_0_var(--game-sky)]">
            <Database className="w-5 h-5 text-sky mb-1.5" />
            <div className="text-xs text-navy font-bold font-heading">SQL</div>
            <div className="text-[10px] text-muted">Data Waters</div>
          </div>

          <div className="game-card p-3.5 bg-card border-2 border-red/40 text-left shadow-[0_3px_0_var(--game-red-dark)]">
            <Cpu className="w-5 h-5 text-red mb-1.5" />
            <div className="text-xs text-navy font-bold font-heading">JAVA</div>
            <div className="text-[10px] text-muted">Object Spire</div>
          </div>

          <div className="game-card p-3.5 bg-card border-2 border-purple/40 text-left shadow-[0_3px_0_var(--game-purple-dark)]">
            <Brain className="w-5 h-5 text-purple mb-1.5" />
            <div className="text-xs text-navy font-bold font-heading">AI</div>
            <div className="text-[10px] text-muted">Neural Peak</div>
          </div>
        </div>

        {/* Progress Bar & Current Phase */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between text-xs text-muted font-bold font-heading">
            <span className="truncate max-w-[320px] text-left">{PHASES[phaseIndex]}</span>
            <span className="text-purple">{progress}%</span>
          </div>

          <div className="w-full h-3 bg-card-subtle rounded-full overflow-hidden border-2 border-border shadow-inner">
            <motion.div
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-green via-gold to-purple rounded-full transition-all duration-300"
            />
          </div>
        </div>

        {/* Quick Fast-Entry / Skip Option for returning users */}
        <div className="pt-2">
          <button
            onClick={() => {
              soundFx.click();
              onComplete();
            }}
            className="text-xs text-muted hover:text-navy font-bold flex items-center gap-1.5 mx-auto transition-colors cursor-pointer py-1.5 px-3 rounded-xl hover:bg-card border-2 border-transparent hover:border-border"
          >
            <span>Skip Animation & Enter World</span>
            <ArrowRight className="w-3.5 h-3.5 text-purple" />
          </button>
        </div>
      </div>
    </div>
  );
};
