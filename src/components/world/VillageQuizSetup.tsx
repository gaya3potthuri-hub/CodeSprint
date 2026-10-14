import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Village, 
  ProgrammingIsland, 
  QuizSetupConfig 
} from '../../types';
import { soundFx } from '../../services/soundFx';
import { 
  X, 
  Clock, 
  HelpCircle, 
  Award, 
  Sparkles, 
  Play, 
  ChevronRight, 
  Minus, 
  Plus, 
  BookOpen, 
  Target,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface VillageQuizSetupProps {
  village: Village;
  island: ProgrammingIsland;
  onStartQuiz: (config: QuizSetupConfig) => void;
  onClose: () => void;
}

const QUESTION_COUNT_OPTIONS = [5, 10, 15, 20, 25];

export const VillageQuizSetup: React.FC<VillageQuizSetupProps> = ({
  village,
  island,
  onStartQuiz,
  onClose
}) => {
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [durationMinutes, setDurationMinutes] = useState<number>(15);

  // Stepper handlers (strictly min 10 min, max 50 min, 5 min step)
  const handleDecreaseDuration = () => {
    soundFx.hoverTick();
    if (durationMinutes > 10) {
      setDurationMinutes((prev) => prev - 5);
    }
  };

  const handleIncreaseDuration = () => {
    soundFx.hoverTick();
    if (durationMinutes < 50) {
      setDurationMinutes((prev) => prev + 5);
    }
  };

  // Calculation of average seconds per question
  const totalSeconds = durationMinutes * 60;
  const secondsPerQuestion = Math.round(totalSeconds / questionCount);

  const handleStart = () => {
    soundFx.lockIn();
    onStartQuiz({
      islandId: island.id,
      villageId: village.id,
      questionCount,
      durationMinutes,
      difficulty: village.difficulty
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl bg-card rounded-2xl border-2 border-border game-card text-navy overflow-hidden flex flex-col transition-colors duration-200"
      >
        {/* Top Header Banner with Island & Village Theme */}
        <div 
          className="px-6 py-5 border-b-2 border-border flex items-center justify-between"
          style={{
            background: `linear-gradient(to right, ${island.accentColor}25, transparent)`
          }}
        >
          <div>
            <div className="flex items-center gap-2">
              <span 
                className="w-3 h-3 rounded-full border border-navy/20"
                style={{ backgroundColor: island.accentColor }}
              />
              <span className="text-xs font-heading font-bold tracking-wider uppercase text-muted">
                {island.name} · VILLAGE #{village.order}
              </span>
            </div>
            <h2 className="text-2xl font-heading font-extrabold tracking-tight text-navy mt-1">
              {village.title}
            </h2>
            <p className="text-xs text-muted font-sans mt-0.5">
              {village.subtitle}
            </p>
          </div>

          <button
            onClick={() => {
              soundFx.click();
              onClose();
            }}
            className="p-2 rounded-xl bg-card-subtle hover:bg-card-alt border-2 border-border text-muted hover:text-navy transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Village Overview Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-card-subtle p-3 rounded-2xl border-2 border-border">
              <span className="text-[10px] font-heading font-bold text-muted block uppercase">DIFFICULTY</span>
              <span className="text-xs font-heading font-extrabold text-gold mt-0.5 block">{village.difficulty}</span>
            </div>

            <div className="bg-card-subtle p-3 rounded-2xl border-2 border-border">
              <span className="text-[10px] font-heading font-bold text-muted block uppercase">EST. DURATION</span>
              <span className="text-xs font-heading font-extrabold text-navy mt-0.5 block">{village.estimatedDuration}</span>
            </div>

            <div className="bg-card-subtle p-3 rounded-2xl border-2 border-border">
              <span className="text-[10px] font-heading font-bold text-muted block uppercase">XP REWARD</span>
              <span className="text-xs font-heading font-extrabold text-green mt-0.5 block">+{village.xpReward} XP</span>
            </div>

            <div className="bg-card-subtle p-3 rounded-2xl border-2 border-border">
              <span className="text-[10px] font-heading font-bold text-muted block uppercase">BEST SCORE</span>
              <span className="text-xs font-heading font-extrabold text-navy mt-0.5 block">
                {village.bestScore ? `${village.bestScore.score}/${village.bestScore.total} (${village.bestScore.accuracy}%)` : 'Not Attempted'}
              </span>
            </div>
          </div>

          {/* Topics Covered */}
          <div className="space-y-2">
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-purple" />
              <span>SYLLABUS TOPICS COVERED:</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {village.topics.map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1.5 rounded-xl text-xs font-sans font-bold bg-card-subtle border-2 border-border text-navy"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* CONTROL A: NUMBER OF QUESTIONS */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <Target className="w-4 h-4 text-purple" />
                <span>CONTROL A: NUMBER OF QUESTIONS</span>
              </span>
              <span className="text-xs font-heading font-bold text-purple">
                {questionCount} Questions Selected
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {QUESTION_COUNT_OPTIONS.map((count) => {
                const isSelected = questionCount === count;
                return (
                  <button
                    key={count}
                    onClick={() => {
                      soundFx.hoverTick();
                      setQuestionCount(count);
                    }}
                    className={`py-2.5 rounded-xl font-heading text-xs font-extrabold transition-all border-2 cursor-pointer ${
                      isSelected
                        ? 'game-btn game-btn-purple text-white border-purple'
                        : 'game-btn game-btn-card text-navy border-border'
                    }`}
                  >
                    {count} Qs
                  </button>
                );
              })}
            </div>
          </div>

          {/* CONTROL B: QUIZ DURATION STEPPER */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gold" />
                <span>CONTROL B: QUIZ DURATION (MINIMUM 10 MIN)</span>
              </span>
              <span className="text-xs font-sans text-muted">
                Increments of 5 min
              </span>
            </div>

            {/* Stepper Control */}
            <div className="flex items-center justify-between bg-card-subtle p-2.5 rounded-2xl border-2 border-border">
              <button
                onClick={handleDecreaseDuration}
                disabled={durationMinutes <= 10}
                className="w-12 h-12 rounded-xl game-btn game-btn-card disabled:opacity-30 disabled:cursor-not-allowed text-navy flex items-center justify-center transition-all cursor-pointer font-bold border-2 border-border"
                title="Decrease duration by 5 minutes (Min: 10 mins)"
              >
                <Minus className="w-5 h-5" />
              </button>

              <div className="text-center">
                <div className="text-xl sm:text-2xl font-heading font-extrabold text-navy">
                  {durationMinutes} <span className="text-sm font-normal text-muted">minutes</span>
                </div>
                <div className="text-[10px] font-sans text-muted">
                  {durationMinutes <= 10 ? 'Minimum threshold enforced' : 'Custom duration allocated'}
                </div>
              </div>

              <button
                onClick={handleIncreaseDuration}
                disabled={durationMinutes >= 50}
                className="w-12 h-12 rounded-xl game-btn game-btn-card disabled:opacity-30 disabled:cursor-not-allowed text-navy flex items-center justify-center transition-all cursor-pointer font-bold border-2 border-border"
                title="Increase duration by 5 minutes (Max: 50 mins)"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* DYNAMIC ESTIMATE INFO CARD */}
          <div className="bg-card-subtle p-4 rounded-2xl border-2 border-border flex items-center justify-between gap-4 font-sans text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold/20 text-gold flex items-center justify-center font-bold text-base">
                ⏱️
              </div>
              <div>
                <div className="text-navy font-bold font-heading">
                  {questionCount} questions · {durationMinutes} minutes
                </div>
                <div className="text-muted text-[11px]">
                  ~{secondsPerQuestion} seconds per question on average
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-heading font-bold text-muted block">DIFFICULTY</span>
              <span className="font-heading font-bold text-gold">{village.difficulty}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t-2 border-border bg-card-subtle flex items-center justify-between gap-4">
          <button
            onClick={() => {
              soundFx.click();
              onClose();
            }}
            className="px-5 py-3 rounded-xl game-btn game-btn-card text-xs font-heading font-bold text-navy transition-colors cursor-pointer border-2 border-border"
          >
            CANCEL
          </button>

          <button
            onClick={handleStart}
            className="flex-1 py-3.5 px-6 rounded-xl game-btn game-btn-green font-heading text-sm font-extrabold tracking-wider uppercase flex items-center justify-center gap-2.5 cursor-pointer text-white border-2 border-green"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>START QUIZ NOW</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
