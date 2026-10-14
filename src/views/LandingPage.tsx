import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Terminal, 
  Database, 
  Layout, 
  Flame, 
  Trophy, 
  Sparkles, 
  ChevronDown,
  Target,
  Crown,
  Award
} from 'lucide-react';
import { ViewState, LearningPathId, UserProfile } from '../types';
import { InteractiveChallengeShowcase } from '../components/InteractiveChallengeShowcase';
import { CodeBlock } from '../components/CodeBlock';
import { soundFx } from '../services/soundFx';

interface LandingPageProps {
  onNavigate: (view: ViewState, pathId?: LearningPathId) => void;
  user: UserProfile;
  onEarnXp: (amount: number) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  user,
  onEarnXp
}) => {
  const handleDeploy = () => {
    soundFx.lockIn();
    onNavigate('dashboard');
  };

  return (
    <div className="overflow-hidden bg-transparent text-navy font-sans select-none">
      
      {/* ========================================================
          SECTION 1: CARTOON GAME HERO
         ======================================================== */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Left (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Friendly Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 text-xs font-heading font-black tracking-wider uppercase text-purple bg-purple/10 px-3.5 py-1.5 rounded-full border-2 border-purple/30"
            >
              <Sparkles className="w-4 h-4 text-gold" />
              <span>THE GAME-BASED CODING REALM</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-navy leading-[1.1] max-w-2xl text-balance"
            >
              Learn · Practice · Grow.{' '}
              <span className="text-purple">
                Your skills. Your journey.
              </span>
            </motion.h1>

            {/* Supporting Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-xl text-balance font-medium"
            >
              Stop watching tutorials on repeat. Explore vibrant floating coding islands, solve interactive challenges, earn rewards, and level up your software skills with confidence!
            </motion.p>

            {/* Primary & Secondary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button
                onClick={handleDeploy}
                onMouseEnter={() => soundFx.hoverTick()}
                className="game-btn game-btn-green px-7 py-3.5 text-sm font-heading font-black text-white flex items-center gap-2.5 group cursor-pointer"
              >
                <span>ENTER THE REALM</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => {
                  soundFx.click();
                  const el = document.getElementById('platform');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                onMouseEnter={() => soundFx.hoverTick()}
                className="game-btn game-btn-card px-6 py-3.5 text-sm font-heading font-black text-navy cursor-pointer"
              >
                HOW IT WORKS
              </button>
            </motion.div>

            {/* Friendly Trust Markers */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-2 flex flex-wrap items-center gap-4 text-xs font-heading font-bold text-text-secondary"
            >
              <div className="flex items-center gap-1.5 text-green">
                <Target className="w-4 h-4" />
                <span>3 Floating Islands</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5 text-gold">
                <Crown className="w-4 h-4" />
                <span>Ranks & Badges</span>
              </div>
              <span>·</span>
              <span className="text-text-muted">50+ Interactive Quizzes</span>
            </motion.div>
          </div>

          {/* Hero Right: Live Explorer HUD Preview (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            {/* Explorer Profile Card */}
            <div className="bg-card text-navy rounded-2xl border-2 border-border game-card p-6 space-y-4 relative overflow-hidden">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-border text-xs font-heading">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green animate-pulse" />
                  <span className="font-extrabold text-navy tracking-wider">EXPLORER: {user.callsign}</span>
                  <span className="text-text-muted">·</span>
                  <span className="text-text-secondary">READY TO SPRINT</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gold font-black flex items-center gap-1 bg-gold/15 px-2.5 py-1 rounded-full border-2 border-gold/30">
                    <Flame className="w-3.5 h-3.5 fill-gold text-gold" />
                    {user.streak}D STREAK
                  </span>
                </div>
              </div>

              {/* Explorer Rank & XP Lockup */}
              <div className="space-y-2 bg-card-subtle p-4 rounded-xl border-2 border-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-heading font-bold text-text-secondary">CURRENT DIVISION</span>
                  <span className="text-xs font-heading font-black text-purple">ACT 1 · EXPEDITION</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-heading font-black text-navy">
                    {user.rankTier}
                  </h3>
                  <span className="font-mono text-base font-bold text-purple tabular-nums">
                    {user.xp} XP
                  </span>
                </div>
                
                {/* Progress bar to next rank */}
                <div className="pt-2 space-y-1.5">
                  <div className="flex justify-between text-xs font-heading font-bold text-text-secondary">
                    <span>Rank Progress</span>
                    <span className="text-navy">150 XP to Next Tier</span>
                  </div>
                  <div className="w-full h-2.5 bg-card rounded-full overflow-hidden border-2 border-border">
                    <div className="h-full bg-green rounded-full w-[65%]" />
                  </div>
                </div>
              </div>

              {/* Floating Islands Grid */}
              <div className="grid grid-cols-3 gap-2.5 pt-1 text-xs font-heading">
                <div className="p-3 rounded-xl bg-card-subtle border-2 border-border text-left">
                  <div className="flex items-center gap-1.5 text-green font-black mb-1">
                    <Terminal className="w-4 h-4" />
                    <span>PYTHON</span>
                  </div>
                  <div className="text-[11px] text-text-secondary font-bold">5/8 Challenges</div>
                </div>
                
                <div className="p-3 rounded-xl bg-card-subtle border-2 border-border text-left">
                  <div className="flex items-center gap-1.5 text-purple font-black mb-1">
                    <Database className="w-4 h-4" />
                    <span>SQL</span>
                  </div>
                  <div className="text-[11px] text-text-secondary font-bold">3/6 Challenges</div>
                </div>

                <div className="p-3 rounded-xl bg-card-subtle border-2 border-border text-left">
                  <div className="flex items-center gap-1.5 text-gold font-black mb-1">
                    <Layout className="w-4 h-4" />
                    <span>WEB DEV</span>
                  </div>
                  <div className="text-[11px] text-text-secondary font-bold">2/7 Challenges</div>
                </div>
              </div>

              {/* Weekly Practice Bar chart */}
              <div className="bg-card-subtle rounded-xl p-3.5 border-2 border-border space-y-2">
                <div className="flex items-center justify-between text-xs font-heading">
                  <span className="font-bold text-navy">RECENT ACTIVITY</span>
                  <span className="text-green font-black">+340 XP EARNED</span>
                </div>
                <div className="flex items-end justify-between h-14 pt-2 gap-1.5 px-1">
                  {[
                    { d: 'M', h: '45%' },
                    { d: 'T', h: '60%' },
                    { d: 'W', h: '35%' },
                    { d: 'T', h: '80%' },
                    { d: 'F', h: '65%' },
                    { d: 'S', h: '95%' },
                    { d: 'S', h: '55%' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 font-mono">
                      <div className="w-full bg-card rounded-t h-12 flex items-end border border-border">
                        <div
                          style={{ height: item.h }}
                          className={`w-full rounded-t ${
                            idx === 5 || idx === 6
                              ? 'bg-green'
                              : 'bg-purple'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] text-text-secondary font-bold">{item.d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Standings Bar */}
              <div className="flex items-center justify-between text-xs font-heading bg-card-subtle p-3 rounded-xl border-2 border-border">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-gold" />
                  <span className="text-navy font-bold">LADDER RANK #4</span>
                  <span className="text-text-muted">[{user.callsign}]</span>
                </div>
                <button
                  onClick={handleDeploy}
                  onMouseEnter={() => soundFx.hoverTick()}
                  className="text-xs font-black text-purple hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>ENTER ARENA</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </motion.div>

        </div>

        {/* Scroll Indicator */}
        <div className="mt-16 flex justify-center">
          <a
            href="#platform"
            onMouseEnter={() => soundFx.hoverTick()}
            className="flex flex-col items-center gap-1.5 text-xs font-heading font-bold text-text-muted hover:text-navy transition-colors cursor-pointer"
          >
            <span>DISCOVER THE ADVENTURE</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-purple" />
          </a>
        </div>
      </section>

      {/* ========================================================
          SECTION 2: VALUE PROPOSITION (Game Bento)
         ======================================================== */}
      <section id="platform" className="py-20 md:py-28 bg-card-subtle border-y-2 border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-heading font-black tracking-wider uppercase text-purple bg-purple/10 px-3 py-1 rounded-full border-2 border-purple/30 inline-block">
              DESIGNED FOR ENGAGING CODING FLOW
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-navy text-balance">
              Less passive tutorials.<br />More active progress.
            </h2>
            <p className="text-base text-text-secondary leading-relaxed text-balance font-medium">
              Build daily consistency, solve puzzles on floating islands, and see your abilities grow level by level.
            </p>
          </div>

          {/* 3 Asymmetric Value Bento Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 01 */}
            <div className="p-8 rounded-2xl bg-card border-2 border-border game-card hover:border-green transition-all space-y-4 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-black text-green tracking-wider uppercase">01 ADVENTURE</span>
                <div className="w-10 h-10 rounded-xl bg-green/10 text-green border-2 border-green/30 flex items-center justify-center">
                  <Terminal className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-xl font-heading font-black tracking-tight text-navy">
                Learn by Doing
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Practise through interactive questions and coding challenges rather than relying entirely on passive video lessons. Every question tests comprehension with instant contextual explanations.
              </p>
              <div className="pt-3 border-t-2 border-border text-xs text-green font-heading font-bold">
                Active Recall · Instant Execution Feedback
              </div>
            </div>

            {/* Feature 02 */}
            <div className="p-8 rounded-2xl bg-card border-2 border-border game-card hover:border-purple transition-all space-y-4 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-black text-purple tracking-wider uppercase">02 MOMENTUM</span>
                <div className="w-10 h-10 rounded-xl bg-purple/10 text-purple border-2 border-purple/30 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-gold" />
                </div>
              </div>
              <h3 className="text-xl font-heading font-black tracking-tight text-navy">
                Turn Progress Into Momentum
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Earn XP, unlock achievements, and move through levels as you complete challenges. Daily streak tracking keeps habits strong without burnout or arbitrary punishment.
              </p>
              <div className="pt-3 border-t-2 border-border text-xs text-purple font-heading font-bold">
                Experience XP · Calling Card Badges
              </div>
            </div>

            {/* Feature 03 */}
            <div className="p-8 rounded-2xl bg-card border-2 border-border game-card hover:border-gold transition-all space-y-4 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-black text-gold tracking-wider uppercase">03 PRECISION</span>
                <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold border-2 border-gold/30 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-xl font-heading font-black tracking-tight text-navy">
                See How Far You've Come
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Track completed challenges, accuracy, learning streaks, and improvements over time with clean visual analytics. Transparent leaderboards provide healthy motivation.
              </p>
              <div className="pt-3 border-t-2 border-border text-xs text-gold font-heading font-bold">
                Accuracy Metrics · Friendly Ladders
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          SECTION 3: LEARNING PATHS (Floating Islands)
         ======================================================== */}
      <section id="paths" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-heading font-black tracking-wider uppercase text-purple bg-purple/10 px-3.5 py-1 rounded-full border-2 border-purple/30 inline-block">
            EXPLORE THE ISLES
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-navy text-balance">
            Choose your next island.
          </h2>
          <p className="text-base text-text-secondary font-medium">
            Three distinct coding tracks. One vibrant place to grow.
          </p>
        </div>

        {/* Path Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Path 1: Python */}
          <div className="rounded-2xl border-2 border-border bg-card p-6 game-card hover:border-green transition-all flex flex-col justify-between space-y-6 relative group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-green/15 text-green border-2 border-green/30 flex items-center justify-center font-bold">
                  <Terminal className="w-6 h-6" />
                </div>
                <span className="text-xs font-heading font-bold text-text-secondary">18 DRILLS · 12H EST</span>
              </div>
              
              <div>
                <span className="text-[11px] font-heading font-black text-green tracking-wider block uppercase">
                  LOGIC & SCRIPTING
                </span>
                <h3 className="text-2xl font-heading font-black text-navy mt-1">Python Island</h3>
                <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                  Build your programming foundations, practise logic, and solve problems step by step.
                </p>
              </div>

              {/* Code Visual */}
              <div className="pt-1">
                <CodeBlock
                  code={`# Python Routine
def calculate_grade(score):
    if score >= 90:
        return "Master"
    return "Progressing"

print(calculate_grade(95))`}
                  language="python"
                  filename="grade_calc.py"
                  showLineNumbers={false}
                />
              </div>

              {/* Progress Indicator */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-heading font-bold text-text-secondary">
                  <span>Track Progress</span>
                  <span className="text-green font-black">5 / 8 SOLVED (62%)</span>
                </div>
                <div className="w-full h-2.5 bg-card-subtle rounded-full overflow-hidden border-2 border-border">
                  <div className="h-full bg-green rounded-full w-[62%]" />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.click();
                onNavigate('path-detail', 'python');
              }}
              onMouseEnter={() => soundFx.hoverTick()}
              className="w-full py-3 px-4 game-btn game-btn-green text-white text-xs font-heading font-black tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>EXPLORE PYTHON</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Path 2: SQL */}
          <div className="rounded-2xl border-2 border-border bg-card p-6 game-card hover:border-purple transition-all flex flex-col justify-between space-y-6 relative group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple/15 text-purple border-2 border-purple/30 flex items-center justify-center font-bold">
                  <Database className="w-6 h-6" />
                </div>
                <span className="text-xs font-heading font-bold text-text-secondary">15 DRILLS · 10H EST</span>
              </div>
              
              <div>
                <span className="text-[11px] font-heading font-black text-purple tracking-wider block uppercase">
                  DATA & SCHEMAS
                </span>
                <h3 className="text-2xl font-heading font-black text-navy mt-1">SQL Citadel</h3>
                <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                  Learn to query databases, understand relationships, and work confidently with real tables.
                </p>
              </div>

              {/* Code Visual */}
              <div className="pt-1">
                <CodeBlock
                  code={`-- SQL Grouping Query
SELECT department,
       COUNT(*) as headcount
FROM explorers
GROUP BY department
HAVING headcount > 5;`}
                  language="sql"
                  filename="recon.sql"
                  showLineNumbers={false}
                />
              </div>

              {/* Progress Indicator */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-heading font-bold text-text-secondary">
                  <span>Track Progress</span>
                  <span className="text-purple font-black">3 / 6 SOLVED (50%)</span>
                </div>
                <div className="w-full h-2.5 bg-card-subtle rounded-full overflow-hidden border-2 border-border">
                  <div className="h-full bg-purple rounded-full w-[50%]" />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.click();
                onNavigate('path-detail', 'sql');
              }}
              onMouseEnter={() => soundFx.hoverTick()}
              className="w-full py-3 px-4 game-btn game-btn-purple text-white text-xs font-heading font-black tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>EXPLORE SQL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Path 3: Web Development */}
          <div className="rounded-2xl border-2 border-border bg-card p-6 game-card hover:border-gold transition-all flex flex-col justify-between space-y-6 relative group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gold/20 text-gold border-2 border-gold/40 flex items-center justify-center font-bold">
                  <Layout className="w-6 h-6" />
                </div>
                <span className="text-xs font-heading font-bold text-text-secondary">20 DRILLS · 14H EST</span>
              </div>
              
              <div>
                <span className="text-[11px] font-heading font-black text-gold tracking-wider block uppercase">
                  INTERACTIVE WEB
                </span>
                <h3 className="text-2xl font-heading font-black text-navy mt-1">Web Village</h3>
                <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                  Understand how modern websites work, from HTML structure to CSS styling and JS logic.
                </p>
              </div>

              {/* Code Visual */}
              <div className="pt-1">
                <CodeBlock
                  code={`/* Reactive Trigger */
const trigger = document.querySelector('#strike');
trigger.addEventListener('click', () => {
  deployAdventureHUD();
});`}
                  language="javascript"
                  filename="strike.js"
                  showLineNumbers={false}
                />
              </div>

              {/* Progress Indicator */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-heading font-bold text-text-secondary">
                  <span>Track Progress</span>
                  <span className="text-gold font-black">2 / 7 SOLVED (28%)</span>
                </div>
                <div className="w-full h-2.5 bg-card-subtle rounded-full overflow-hidden border-2 border-border">
                  <div className="h-full bg-gold rounded-full w-[28%]" />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.click();
                onNavigate('path-detail', 'web-dev');
              }}
              onMouseEnter={() => soundFx.hoverTick()}
              className="w-full py-3 px-4 game-btn game-btn-gold text-navy text-xs font-heading font-black tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>EXPLORE WEB DEV</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================
          SECTION 4: INTERACTIVE CHALLENGE SHOWCASE
         ======================================================== */}
      <section id="challenge-demo" className="py-20 md:py-28 bg-card-subtle border-t-2 border-border text-navy">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-heading font-black tracking-wider uppercase text-purple bg-purple/10 px-3.5 py-1 rounded-full border-2 border-purple/30 inline-block">
              LIVE TRIAL ARENA
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-navy text-balance">
              Learn by solving.<br />Grow by doing.
            </h2>
            <p className="text-base text-text-secondary font-medium">
              Test your knowledge right now. Select an answer and experience instant evaluation with rewarded XP.
            </p>
          </div>

          <InteractiveChallengeShowcase
            onEarnXp={onEarnXp}
            onExploreFullApp={() => onNavigate('challenge')}
          />

        </div>
      </section>

      {/* ========================================================
          SECTION 5: GAMIFICATION & RANKS
         ======================================================== */}
      <section className="py-20 md:py-32 bg-transparent text-navy border-t-2 border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-heading font-black tracking-wider uppercase text-green bg-green/10 px-3.5 py-1 rounded-full border-2 border-green/30 inline-block">
              REWARD SYSTEM
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-navy text-balance">
              Small wins.<br />Serious momentum.
            </h2>
            <p className="text-base text-text-secondary font-medium">
              Every challenge completed is another milestone along your roadmap.
            </p>
          </div>

          {/* 4 Gamification Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            
            {/* 1. Experience Points */}
            <div className="p-6 rounded-2xl bg-card border-2 border-border game-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-text-secondary uppercase tracking-wider">EXP POINTS</span>
                <Sparkles className="w-4 h-4 text-purple" />
              </div>
              <div className="text-3xl font-heading font-black text-navy tracking-tight tabular-nums">
                +{user.xp} <span className="text-sm text-purple">XP</span>
              </div>
              <p className="text-text-secondary font-sans text-xs leading-relaxed">
                Earn 50 to 75 XP per solved exercise. Climb ranking divisions from Novice to Code Master.
              </p>
            </div>

            {/* 2. Levels */}
            <div className="p-6 rounded-2xl bg-card border-2 border-border game-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-text-secondary uppercase tracking-wider">DIVISION</span>
                <Award className="w-4 h-4 text-gold" />
              </div>
              <div className="text-2xl font-heading font-black text-navy tracking-tight">
                {user.rankTier}
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-heading font-bold text-text-secondary">
                  <span>To Next Tier</span>
                  <span className="text-green">150 XP remaining</span>
                </div>
                <div className="w-full h-2.5 bg-card-subtle rounded-full overflow-hidden border-2 border-border">
                  <div className="h-full bg-green rounded-full w-[70%]" />
                </div>
              </div>
              <p className="text-text-secondary font-sans text-xs leading-relaxed">
                Unlock shiny profile badges, special island trophies, and celebratory animations.
              </p>
            </div>

            {/* 3. Achievements */}
            <div className="p-6 rounded-2xl bg-card border-2 border-border game-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-text-secondary uppercase tracking-wider">HONORS</span>
                <Trophy className="w-4 h-4 text-gold" />
              </div>
              <div className="space-y-2 pt-1 font-heading font-bold">
                <div className="flex items-center gap-2 text-navy">
                  <span className="text-green">●</span>
                  <span>FIRST RUNNER</span>
                </div>
                <div className="flex items-center gap-2 text-navy">
                  <span className="text-purple">●</span>
                  <span>PYTHON EXPLORER</span>
                </div>
                <div className="flex items-center gap-2 text-text-muted">
                  <span className="text-gold">○</span>
                  <span>7-DAY STREAK (5/7)</span>
                </div>
              </div>
              <p className="text-xs text-text-secondary pt-1">
                Verifiable achievements and badges displayed on your student profile.
              </p>
            </div>

            {/* 4. Leaderboard */}
            <div className="p-6 rounded-2xl bg-card border-2 border-border game-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-text-secondary uppercase tracking-wider">LEADERBOARD</span>
                <span className="text-[10px] text-green font-bold">COMMUNITY</span>
              </div>
              <div className="space-y-2 font-heading font-bold">
                <div className="flex items-center justify-between text-navy">
                  <span>1. PHANTOM</span>
                  <span className="text-purple font-black tabular-nums">2,450 XP</span>
                </div>
                <div className="flex items-center justify-between text-navy">
                  <span>2. CIPHER_X</span>
                  <span className="text-purple font-black tabular-nums">2,200 XP</span>
                </div>
                <div className="flex items-center justify-between text-navy">
                  <span>3. NOVA</span>
                  <span className="text-purple font-black tabular-nums">1,950 XP</span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('leaderboard')}
                onMouseEnter={() => soundFx.hoverTick()}
                className="w-full mt-2 py-2 text-center text-xs text-navy font-heading font-bold game-btn game-btn-card rounded-xl"
              >
                VIEW LEADERBOARD
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          SECTION 6: PROGRESS AND ANALYTICS
         ======================================================== */}
      <section className="py-20 md:py-28 bg-card-subtle border-y-2 border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-heading font-black tracking-wider uppercase text-purple bg-purple/10 px-3.5 py-1 rounded-full border-2 border-purple/30 inline-block">
              LEARNING TELEMETRY
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-navy text-balance">
              Your progress.<br />Made visible.
            </h2>
            <p className="text-base text-text-secondary font-medium">
              Clear learning analytics showing challenges solved, accuracy metrics, and weekly practice habit velocity.
            </p>
          </div>

          {/* Analytics Snapshot Preview */}
          <div className="bg-card rounded-2xl border-2 border-border p-6 md:p-8 game-card space-y-8">
            
            {/* Top Stat Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-6 border-b-2 border-border">
              <div>
                <div className="text-xs text-text-secondary font-heading font-bold uppercase">DRILLS CLEARED</div>
                <div className="text-2xl sm:text-3xl font-heading font-black text-navy mt-1 tabular-nums">
                  {user.completedChallengeIds.length}
                </div>
                <div className="text-xs text-green font-heading font-bold mt-0.5">Across all 3 paths</div>
              </div>

              <div>
                <div className="text-xs text-text-secondary font-heading font-bold uppercase">ACCURACY RATE</div>
                <div className="text-2xl sm:text-3xl font-heading font-black text-navy mt-1 tabular-nums">
                  {user.headshotAccuracy}%
                </div>
                <div className="text-xs text-green font-heading font-bold mt-0.5">First-attempt success</div>
              </div>

              <div>
                <div className="text-xs text-text-secondary font-heading font-bold uppercase">ACTIVE STREAK</div>
                <div className="text-2xl sm:text-3xl font-heading font-black text-gold mt-1 tabular-nums flex items-center gap-1">
                  <Flame className="w-6 h-6 fill-gold" />
                  {user.streak} DAYS
                </div>
                <div className="text-xs text-text-muted font-heading font-bold mt-0.5">Best streak: 12 days</div>
              </div>

              <div>
                <div className="text-xs text-text-secondary font-heading font-bold uppercase">TOTAL EXPERIENCE</div>
                <div className="text-2xl sm:text-3xl font-heading font-black text-purple mt-1 tabular-nums">
                  {user.xp} XP
                </div>
                <div className="text-xs text-text-muted font-heading font-bold mt-0.5">Rank #4 Community</div>
              </div>
            </div>

            {/* Bottom Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Weekly Activity (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between text-xs font-heading font-bold">
                  <span className="text-navy">7-DAY PRACTICE VOLUME</span>
                  <span className="text-text-muted">PAST WEEK</span>
                </div>

                <div className="h-44 flex items-end justify-between gap-3 pt-4 px-3 bg-card-subtle rounded-xl border-2 border-border">
                  {[
                    { day: 'MON', count: 3, xp: 160 },
                    { day: 'TUE', count: 4, xp: 210 },
                    { day: 'WED', count: 2, xp: 110 },
                    { day: 'THU', count: 5, xp: 280 },
                    { day: 'FRI', count: 4, xp: 215 },
                    { day: 'SAT', count: 6, xp: 340 },
                    { day: 'SUN', count: 3, xp: 150 },
                  ].map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative cursor-pointer">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-card text-navy text-[10px] font-heading font-bold py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap shadow-sm border-2 border-border">
                        {bar.count} drills · +{bar.xp} XP
                      </div>
                      <div className="w-full bg-card rounded-t h-32 flex items-end border border-border">
                        <div
                          style={{ height: `${(bar.count / 6) * 100}%` }}
                          className={`w-full rounded-t transition-all ${
                            idx === 5 || idx === 6
                              ? 'bg-green'
                              : 'bg-purple group-hover:bg-green'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] font-heading font-bold text-text-secondary">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Path Mastery Progress (5 cols) */}
              <div className="lg:col-span-5 space-y-4 font-heading text-xs font-bold">
                <span className="block text-navy">ISLAND MASTERY PROGRESS</span>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">PYTHON ISLAND</span>
                      <span className="text-green font-black">62%</span>
                    </div>
                    <div className="w-full h-2.5 bg-card-subtle rounded-full overflow-hidden border-2 border-border">
                      <div className="h-full bg-green rounded-full w-[62%]" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">SQL CITADEL</span>
                      <span className="text-purple font-black">50%</span>
                    </div>
                    <div className="w-full h-2.5 bg-card-subtle rounded-full overflow-hidden border-2 border-border">
                      <div className="h-full bg-purple rounded-full w-[50%]" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">WEB VILLAGE</span>
                      <span className="text-gold font-black">28%</span>
                    </div>
                    <div className="w-full h-2.5 bg-card-subtle rounded-full overflow-hidden border-2 border-border">
                      <div className="h-full bg-gold rounded-full w-[28%]" />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('progress')}
                    onMouseEnter={() => soundFx.hoverTick()}
                    className="text-xs font-heading font-black text-purple hover:underline flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>INSPECT FULL PROGRESS LOGS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          SECTION 7: HOW IT WORKS (3 Step Protocol)
         ======================================================== */}
      <section id="how-it-works" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-heading font-black tracking-wider uppercase text-purple bg-purple/10 px-3.5 py-1 rounded-full border-2 border-purple/30 inline-block">
            THE LEARNING LOOP
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-navy text-balance">
            Three simple steps.<br />One rewarding habit.
          </h2>
          <p className="text-base text-text-secondary font-medium">
            A playful cadence designed for daily student retention and real-world software confidence.
          </p>
        </div>

        {/* 3 Step Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 rounded-2xl bg-card border-2 border-border game-card space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple/15 text-purple font-heading font-black text-sm flex items-center justify-center border-2 border-purple/30">
              01
            </div>
            <h3 className="text-xl font-heading font-black text-navy">Choose Your Island</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Select Python, SQL, or Web Development. Follow a structured progression of concepts from basics to production-ready patterns.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card border-2 border-border game-card space-y-4">
            <div className="w-10 h-10 rounded-xl bg-green/15 text-green font-heading font-black text-sm flex items-center justify-center border-2 border-green/30">
              02
            </div>
            <h3 className="text-xl font-heading font-black text-navy">Solve Challenges</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Practise with bite-sized questions designed to reinforce your understanding. Inspect realistic code snippets and evaluate outputs.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card border-2 border-border game-card space-y-4">
            <div className="w-10 h-10 rounded-xl bg-gold/20 text-gold font-heading font-black text-sm flex items-center justify-center border-2 border-gold/40">
              03
            </div>
            <h3 className="text-xl font-heading font-black text-navy">Track Your Progress</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Earn XP, unlock achievements, maintain streaks, and measure your improvement over time with detailed accuracy telemetry.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================
          SECTION 8: FINAL CALL TO ACTION
         ======================================================== */}
      <section className="py-24 md:py-32 bg-card-subtle text-navy text-center relative overflow-hidden border-t-2 border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative">
          <span className="text-xs font-heading font-black tracking-wider uppercase text-purple bg-purple/10 px-3.5 py-1.5 rounded-full border-2 border-purple/30 inline-block">
            READY TO EXPLORE?
          </span>
          
          <h2 className="text-4xl sm:text-5xl font-heading font-black tracking-tight text-navy text-balance">
            Your coding adventure starts here.
          </h2>

          <p className="text-lg text-text-secondary max-w-xl mx-auto leading-relaxed font-medium">
            Make every learning session fun and effective.
          </p>

          <div className="pt-2">
            <button
              onClick={handleDeploy}
              onMouseEnter={() => soundFx.hoverTick()}
              className="game-btn game-btn-green px-10 py-4 text-base font-heading font-black text-white inline-flex items-center gap-3 group cursor-pointer"
            >
              <span>START YOUR JOURNEY</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <p className="text-xs font-heading font-bold text-text-muted pt-2">
            Choose an island · Complete quizzes · Unlock badges
          </p>
        </div>
      </section>

    </div>
  );
};
