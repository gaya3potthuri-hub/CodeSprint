import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  QuizAttemptResult, 
  ProgrammingIsland, 
  Village 
} from '../../types';
import { soundFx } from '../../services/soundFx';
import { StorageService } from '../../services/storageService';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  Award, 
  AlertCircle, 
  BookOpen, 
  ChevronDown, 
  ChevronUp,
  Coins
} from 'lucide-react';

interface QuizResultsProps {
  result: QuizAttemptResult;
  island: ProgrammingIsland;
  village: Village;
  onContinueToNextVillage: () => void;
  onReturnToIslandMap: () => void;
  onRetryQuiz: () => void;
  unlockedVillageTitle?: string;
  actualXpAwarded: number;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  result,
  island,
  village,
  onContinueToNextVillage,
  onReturnToIslandMap,
  onRetryQuiz,
  unlockedVillageTitle,
  actualXpAwarded
}) => {
  const [showAnswerReview, setShowAnswerReview] = useState(false);
  const [currentCoins, setCurrentCoins] = useState(() => StorageService.getUser().coins ?? 240);
  const rewardedRef = useRef(false);

  useEffect(() => {
    if (result.passed) {
      soundFx.rankUp();
      
      // Award 50 bonus coins on level complete (once)
      if (!rewardedRef.current) {
        rewardedRef.current = true;
        const updated = StorageService.addCoins(50);
        setCurrentCoins(updated.coins ?? 290);
        StorageService.incrementQuestProgress('village', 1);
        StorageService.incrementQuestProgress('xp', actualXpAwarded);
      }

      // Celebrate with confetti
      try {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.4 },
          colors: ['#FFC53D', '#4CB963', '#38BDF8', '#7B5CFF']
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 60,
            origin: { x: 0.1, y: 0.6 }
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 60,
            origin: { x: 0.9, y: 0.6 }
          });
        }, 300);
      } catch {}
    } else {
      soundFx.errorDeflect();
    }
  }, [result.passed, island.accentColor, actualXpAwarded]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-8 bg-page text-navy select-none overflow-y-auto transition-colors duration-200">
      {/* Background ambient light */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{
          backgroundColor: result.passed ? island.accentColor : '#EF5B5B'
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-2xl bg-card rounded-3xl border-2 border-border p-6 sm:p-8 game-card space-y-6 transition-colors duration-200 text-navy font-sans"
      >
        {/* Result Header Badge */}
        <div className="text-center space-y-2">
          <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center border-2 ${
            result.passed
              ? 'bg-green/20 border-green text-green'
              : 'bg-red/20 border-red text-red'
          }`}>
            {result.passed ? <Trophy className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-heading font-bold tracking-wider uppercase text-muted block">
              {island.name.toUpperCase()} · {village.title.toUpperCase()}
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-navy">
              {result.passed ? 'Village Conquered!' : 'Drill Needs Reinforcement'}
            </h1>
            <p className="text-xs sm:text-sm text-muted font-sans max-w-md mx-auto">
              {result.passed
                ? 'Congratulations! You satisfied the passing requirement and demonstrated topic mastery.'
                : 'You scored below the 70% passing threshold. Review the weak topics below and retry!'}
            </p>
          </div>
        </div>

        {/* REWARD CHEST CELEBRATION (On Level Complete) */}
        {result.passed && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 0.1 }}
            className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/15 via-gold/10 to-yellow-500/15 border-2 border-gold shadow-md flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left"
          >
            {/* Animated Cartoon Treasure Chest SVG */}
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                  {/* Chest Base */}
                  <rect x="15" y="42" width="70" height="44" rx="8" fill="#854D0E" stroke="#713F12" strokeWidth="3" />
                  {/* Gold Bands */}
                  <rect x="26" y="42" width="8" height="44" fill="#FACC15" />
                  <rect x="66" y="42" width="8" height="44" fill="#FACC15" />
                  {/* Open Lid */}
                  <path d="M 12,42 Q 50,15 88,42 L 80,42 Q 50,25 20,42 Z" fill="#A16207" stroke="#713F12" strokeWidth="2.5" />
                  {/* Glowing Core / Gold overflowing */}
                  <ellipse cx="50" cy="40" rx="25" ry="10" fill="#FDE047" opacity="0.9" />
                  <circle cx="44" cy="36" r="5" fill="#FEF08A" />
                  <circle cx="56" cy="38" r="6" fill="#FEF08A" />
                  {/* Lock Clasp */}
                  <rect x="44" y="52" width="12" height="14" rx="3" fill="#EAB308" stroke="#713F12" strokeWidth="2" />
                  <circle cx="50" cy="58" r="2.5" fill="#713F12" />
                </svg>
              </div>

              <div>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-heading font-black text-gold tracking-wide uppercase">
                  <Sparkles className="w-4 h-4 fill-gold text-gold" />
                  <span>Level Completion Reward Chest!</span>
                </div>
                <div className="text-xl font-heading font-black text-navy mt-0.5">
                  +50 Gold Coins Unlocked
                </div>
                <p className="text-[11px] text-muted font-sans font-medium">
                  Treasury balance updated: <strong className="text-gold font-bold">🪙 {currentCoins} Coins</strong>
                </p>
              </div>
            </div>

            <div className="bg-card px-4 py-2.5 rounded-2xl border-2 border-border shadow-xs shrink-0 flex items-center gap-2">
              <span className="text-xl">🪙</span>
              <div className="text-left leading-tight font-heading">
                <div className="text-[10px] text-muted font-bold">WALLET</div>
                <div className="text-sm font-black text-gold">{currentCoins}</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Newly Unlocked Village Notice */}
        {unlockedVillageTitle && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-green/10 border-2 border-green flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-green shrink-0" />
              <div>
                <span className="text-green font-heading font-bold block">NEW VILLAGE UNLOCKED:</span>
                <span className="text-navy font-heading font-extrabold">{unlockedVillageTitle}</span>
              </div>
            </div>
            <span className="text-[10px] font-heading font-extrabold bg-green/20 text-green px-2 py-1 rounded-xl">PATH OPENED</span>
          </motion.div>
        )}

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-card-subtle p-4 rounded-2xl border-2 border-border text-center">
            <span className="text-[10px] font-heading font-bold text-muted block uppercase">ACCURACY</span>
            <span className={`text-xl sm:text-2xl font-heading font-extrabold mt-0.5 block ${
              result.passed ? 'text-green' : 'text-red'
            }`}>
              {result.accuracyPercent}%
            </span>
            <span className="text-[10px] text-muted font-sans">Pass: {result.passingScorePercent}%</span>
          </div>

          <div className="bg-card-subtle p-4 rounded-2xl border-2 border-border text-center">
            <span className="text-[10px] font-heading font-bold text-muted block uppercase">SCORE</span>
            <span className="text-xl sm:text-2xl font-heading font-extrabold text-navy mt-0.5 block">
              {result.correctCount} / {result.totalQuestions}
            </span>
            <span className="text-[10px] text-muted font-sans">{result.incorrectCount} missed</span>
          </div>

          <div className="bg-card-subtle p-4 rounded-2xl border-2 border-border text-center">
            <span className="text-[10px] font-heading font-bold text-muted block uppercase">TIME TAKEN</span>
            <span className="text-xl sm:text-2xl font-heading font-extrabold text-navy mt-0.5 block">
              {formatTime(result.timeTakenSeconds)}
            </span>
            <span className="text-[10px] text-muted font-sans">Completed</span>
          </div>

          <div className="bg-card-subtle p-4 rounded-2xl border-2 border-border text-center">
            <span className="text-[10px] font-heading font-bold text-muted block uppercase">XP REWARD</span>
            <span className="text-xl sm:text-2xl font-heading font-extrabold text-gold mt-0.5 block">
              +{actualXpAwarded} XP
            </span>
            <span className="text-[10px] text-muted font-sans">Added to dossier</span>
          </div>
        </div>

        {/* Topics Needing Improvement */}
        {result.weakTopics.length > 0 && (
          <div className="p-4 rounded-2xl bg-gold/10 border-2 border-gold text-xs space-y-2">
            <div className="flex items-center gap-2 text-gold font-heading font-bold">
              <BookOpen className="w-4 h-4" />
              <span>TOPICS RECOMMENDED FOR PRACTICE:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {result.weakTopics.map((topic) => (
                <span
                  key={topic}
                  className="px-2.5 py-1 rounded-xl bg-gold/20 border-2 border-gold/40 text-navy font-bold text-xs"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Toggleable Detailed Answers Review */}
        <div>
          <button
            onClick={() => setShowAnswerReview(!showAnswerReview)}
            className="w-full py-2.5 px-4 rounded-xl game-btn game-btn-card border-2 border-border text-xs font-heading font-bold text-navy flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>REVIEW DETAILED QUESTION BREAKDOWN ({result.answers.length} ANSWERS)</span>
            {showAnswerReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <AnimatePresence>
            {showAnswerReview && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-3 pt-3"
              >
                {result.answers.map((ans, idx) => (
                  <div
                    key={ans.questionId}
                    className={`p-3.5 rounded-2xl border-2 text-xs space-y-1.5 ${
                      ans.isCorrect
                        ? 'bg-green/10 border-green text-navy'
                        : 'bg-red/10 border-red text-navy'
                    }`}
                  >
                    <div className="flex items-center justify-between font-heading font-bold">
                      <span>Q{idx + 1}: {ans.isCorrect ? 'Correct ✓' : 'Incorrect ✗'}</span>
                      <span className={ans.isCorrect ? 'text-green' : 'text-red'}>
                        {ans.isCorrect ? 'RESOLVED' : 'MISSED'}
                      </span>
                    </div>
                    <p className="text-navy font-sans text-xs font-medium">{ans.questionText}</p>
                    <p className="text-muted font-sans text-[11px] pt-1.5 border-t-2 border-border">
                      <strong>Explanation:</strong> {ans.explanation}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {result.passed ? (
            <>
              <button
                onClick={() => {
                  soundFx.click();
                  onReturnToIslandMap();
                }}
                className="py-3 px-5 rounded-xl game-btn game-btn-card border-2 border-border font-heading text-xs font-bold text-navy cursor-pointer text-center"
              >
                RETURN TO ISLAND MAP
              </button>
              <button
                onClick={() => {
                  soundFx.lockIn();
                  onContinueToNextVillage();
                }}
                className="py-3 px-5 rounded-xl game-btn game-btn-green font-heading text-xs font-extrabold tracking-wider text-white border-2 border-green flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>CONTINUE JOURNEY</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  soundFx.click();
                  onReturnToIslandMap();
                }}
                className="py-3 px-5 rounded-xl game-btn game-btn-card border-2 border-border font-heading text-xs font-bold text-navy cursor-pointer text-center"
              >
                RETURN TO ISLAND MAP
              </button>
              <button
                onClick={() => {
                  soundFx.lockIn();
                  onRetryQuiz();
                }}
                className="py-3 px-5 rounded-xl game-btn game-btn-red font-heading text-xs font-extrabold tracking-wider text-white border-2 border-red flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>RETRY THIS QUIZ</span>
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
