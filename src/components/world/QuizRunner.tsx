import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  QuizQuestion, 
  QuizSetupConfig, 
  QuizAttemptResult, 
  QuizUserAnswer,
  ProgrammingIsland,
  Village
} from '../../types';
import { CodeBlock } from '../CodeBlock';
import { soundFx } from '../../services/soundFx';
import { StorageService } from '../../services/storageService';
import confetti from 'canvas-confetti';
import { 
  Clock, 
  X, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  AlertTriangle, 
  BookOpen, 
  Sparkles,
  HelpCircle,
  Heart,
  Flame,
  Zap,
  RotateCcw
} from 'lucide-react';

interface QuizRunnerProps {
  island: ProgrammingIsland;
  village: Village;
  config: QuizSetupConfig;
  questions: QuizQuestion[];
  onCompleteQuiz: (result: QuizAttemptResult) => void;
  onExitQuiz: () => void;
}

export const QuizRunner: React.FC<QuizRunnerProps> = ({
  island,
  village,
  config,
  questions,
  onCompleteQuiz,
  onExitQuiz
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [answers, setAnswers] = useState<QuizUserAnswer[]>([]);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // 5-Heart Lives System
  const [lives, setLives] = useState(5);
  const [isGameOver, setIsGameOver] = useState(false);

  // Combo Multiplier System
  const [combo, setCombo] = useState(0);
  const [totalBonusXp, setTotalBonusXp] = useState(0);
  const [comboPopup, setComboPopup] = useState<{ title: string; bonus: number; multiplier: number } | null>(null);

  // Countdown timer initialized in seconds
  const [remainingSeconds, setRemainingSeconds] = useState(config.durationMinutes * 60);
  const startTimeRef = useRef(Date.now());
  const timerFinishedRef = useRef(false);

  const currentQuestion = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length;

  // Countdown Interval
  useEffect(() => {
    if (isGameOver) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!timerFinishedRef.current) {
            timerFinishedRef.current = true;
            handleAutoSubmitOnTimeout();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameOver]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLowTime = remainingSeconds <= 120;

  // Reset quiz on Game Over restart
  const handleRestartQuiz = () => {
    soundFx.powerOnChirp();
    setLives(5);
    setIsGameOver(false);
    setCombo(0);
    setTotalBonusXp(0);
    setComboPopup(null);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setAnswers([]);
    setRemainingSeconds(config.durationMinutes * 60);
    startTimeRef.current = Date.now();
    timerFinishedRef.current = false;
  };

  // Submit the selected option for current question
  const handleSubmitAnswer = () => {
    if (!selectedOptionId || isAnswerSubmitted || isGameOver) return;
    soundFx.lockIn();
    setIsAnswerSubmitted(true);

    const isCorrect = selectedOptionId === currentQuestion.correctOptionId;

    if (isCorrect) {
      soundFx.headshot();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      StorageService.incrementQuestProgress('combo', nextCombo);

      // Trigger combo multiplier pop-up for 2+ consecutive correct answers
      if (nextCombo >= 2) {
        const bonus = nextCombo * 10;
        setTotalBonusXp((prev) => prev + bonus);
        const title = nextCombo >= 4 
          ? `🚀 ULTRA COMBO x${nextCombo}!` 
          : nextCombo === 3 
          ? `⚡ SUPER COMBO x3!` 
          : `🔥 COMBO x2!`;
        
        setComboPopup({ title, bonus, multiplier: nextCombo });
        soundFx.rankUp();
        setTimeout(() => setComboPopup(null), 1800);
      }

      try {
        confetti({
          particleCount: 35,
          spread: 55,
          origin: { y: 0.7 },
          colors: [island.accentColor, '#4CB963', '#FFC53D', '#7B5CFF']
        });
      } catch {}
    } else {
      soundFx.errorDeflect();
      // Lose combo
      setCombo(0);
      // Lose 1 Heart
      setLives((prev) => {
        const nextLives = prev - 1;
        if (nextLives <= 0) {
          setIsGameOver(true);
        }
        return nextLives;
      });
    }

    const answerRecord: QuizUserAnswer = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.question,
      userOptionId: selectedOptionId,
      correctOptionId: currentQuestion.correctOptionId,
      isCorrect,
      explanation: currentQuestion.explanation
    };

    setAnswers((prev) => [...prev, answerRecord]);
  };

  // Move to next question or complete quiz
  const handleNextQuestion = () => {
    soundFx.hoverTick();
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    } else {
      finalizeQuizResults(answers);
    }
  };

  // Auto submit when countdown timer expires
  const handleAutoSubmitOnTimeout = () => {
    soundFx.errorDeflect();
    const finalAnswers = [...answers];
    for (let i = finalAnswers.length; i < totalQuestions; i++) {
      const q = questions[i];
      finalAnswers.push({
        questionId: q.id,
        questionText: q.question,
        userOptionId: '',
        correctOptionId: q.correctOptionId,
        isCorrect: false,
        explanation: q.explanation
      });
    }
    finalizeQuizResults(finalAnswers);
  };

  const finalizeQuizResults = (completedAnswers: QuizUserAnswer[]) => {
    const timeTakenSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    const correctCount = completedAnswers.filter((a) => a.isCorrect).length;
    const answeredCount = completedAnswers.filter((a) => a.userOptionId !== '').length;
    const incorrectCount = answeredCount - correctCount;
    const unansweredCount = totalQuestions - answeredCount;
    const accuracyPercent = Math.round((correctCount / totalQuestions) * 100);
    const passingScorePercent = 70;
    const passed = accuracyPercent >= passingScorePercent;

    const weakTopics = Array.from(
      new Set(
        completedAnswers
          .filter((a) => !a.isCorrect)
          .map((a) => {
            const foundQ = questions.find((q) => q.id === a.questionId);
            return foundQ ? foundQ.topic : 'General';
          })
      )
    );

    const baseReward = passed ? village.xpReward : Math.round(correctCount * 5);
    const totalXp = baseReward + totalBonusXp;

    const result: QuizAttemptResult = {
      islandId: island.id,
      villageId: village.id,
      villageTitle: village.title,
      totalQuestions,
      correctCount,
      incorrectCount,
      unansweredCount,
      accuracyPercent,
      timeTakenSeconds,
      xpEarned: totalXp,
      passed,
      passingScorePercent,
      weakTopics,
      completedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      answers: completedAnswers
    };

    onCompleteQuiz(result);
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-page text-navy select-none overflow-hidden transition-colors duration-200">
      
      {/* 1. Header with Island, 5 Lives, Combo, & Timer */}
      <div className="relative z-20 px-4 sm:px-8 py-3.5 border-b-2 border-border bg-card/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-muted">
            <span 
              className="w-3 h-3 rounded-full border border-navy/20"
              style={{ backgroundColor: island.accentColor }}
            />
            <span>{island.name} · {village.title}</span>
          </div>
          <div className="text-sm font-heading font-extrabold text-navy mt-0.5">
            Question {currentIndex + 1} of {totalQuestions}
          </div>
        </div>

        {/* Center: 5-Heart Lives System */}
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center gap-1.5 bg-card px-3.5 py-1.5 rounded-2xl border-2 border-border game-card shadow-xs"
            title={`${lives} of 5 hearts remaining`}
          >
            {[1, 2, 3, 4, 5].map((h) => {
              const hasLife = h <= lives;
              return (
                <Heart
                  key={h}
                  className={`w-4 h-4 transition-all duration-300 ${
                    hasLife 
                      ? 'fill-red text-red drop-shadow-xs scale-105' 
                      : 'text-border fill-card-subtle opacity-40 scale-90'
                  }`}
                />
              );
            })}
          </div>

          {/* Active Combo Multiplier Badge */}
          {combo >= 2 && (
            <div className="hidden sm:flex items-center gap-1.5 bg-gold/20 border-2 border-gold px-3 py-1 rounded-2xl text-xs font-heading font-black text-navy shadow-xs animate-bounce">
              <Flame className="w-4 h-4 fill-gold text-gold" />
              <span>x{combo} COMBO (+{totalBonusXp} XP)</span>
            </div>
          )}
        </div>

        {/* Live Countdown Timer & Exit */}
        <div className="flex items-center gap-3">
          <div className={`px-3.5 py-1.5 rounded-2xl border-2 font-heading font-bold text-xs sm:text-sm flex items-center gap-2 backdrop-blur-md game-card-subtle transition-all ${
            isLowTime 
              ? 'bg-red/15 border-red text-red animate-pulse'
              : 'bg-card border-border text-navy'
          }`}>
            <Clock className={`w-3.5 h-3.5 ${isLowTime ? 'text-red' : 'text-gold'}`} />
            <span>{formatTime(remainingSeconds)}</span>
          </div>

          <button
            onClick={() => {
              soundFx.hoverTick();
              setShowExitConfirm(true);
            }}
            className="p-2 rounded-xl border-2 border-border game-btn game-btn-card text-muted hover:text-navy transition-colors cursor-pointer"
            title="Exit Quiz"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar under Header */}
      <div className="w-full h-2 bg-border">
        <motion.div
          animate={{ width: `${((currentIndex + (isAnswerSubmitted ? 1 : 0)) / totalQuestions) * 100}%` }}
          transition={{ duration: 0.3 }}
          className="h-full"
          style={{ backgroundColor: island.accentColor }}
        />
      </div>

      {/* FLOATING COMBO MULTIPLIER POP-UP NOTIFICATION */}
      <AnimatePresence>
        {comboPopup && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.75 }}
            animate={{ opacity: 1, y: 0, scale: 1.1 }}
            exit={{ opacity: 0, scale: 0.75, y: -15 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="bg-gold border-3 border-gold-dark text-navy px-6 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 font-heading font-black text-sm sm:text-base">
              <Flame className="w-5 h-5 fill-navy text-navy animate-spin" />
              <span>{comboPopup.title}</span>
              <span className="bg-navy text-gold px-2.5 py-0.5 rounded-xl text-xs font-mono font-black shadow-xs">
                +{comboPopup.bonus} XP BONUS
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Question Viewport Stage */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">
        <div className="game-card p-6 sm:p-8 border-2 border-border bg-card space-y-6">
          
          {/* Question Topic & Difficulty Pill */}
          <div className="flex items-center justify-between gap-3">
            <span className="px-3 py-1 rounded-xl text-xs font-heading font-bold uppercase tracking-wider bg-purple/10 text-purple border border-purple/30">
              {currentQuestion.topic}
            </span>
            <span className="text-xs font-heading font-bold text-muted uppercase">
              Difficulty: <strong className="text-navy">{currentQuestion.difficulty}</strong>
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-lg sm:text-xl font-heading font-bold text-navy leading-relaxed">
            {currentQuestion.question}
          </h2>

          {/* Optional Code Snippet */}
          {currentQuestion.codeSnippet && (
            <div className="rounded-xl overflow-hidden border-2 border-border shadow-xs">
              <CodeBlock 
                code={currentQuestion.codeSnippet.code} 
                language={currentQuestion.codeSnippet.language} 
              />
            </div>
          )}

          {/* Options Grid */}
          <div className="space-y-3 pt-2">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOptionId === opt.id;
              const isCorrectOpt = opt.id === currentQuestion.correctOptionId;
              
              let optionStyles = 'border-border bg-card text-navy hover:border-purple/60 hover:bg-card-subtle';

              if (isAnswerSubmitted) {
                if (isCorrectOpt) {
                  optionStyles = 'border-green bg-green/15 text-navy font-bold shadow-[0_2px_0_var(--game-green)]';
                } else if (isSelected && !isCorrectOpt) {
                  optionStyles = 'border-red bg-red/15 text-navy opacity-80';
                } else {
                  optionStyles = 'border-border bg-card text-muted opacity-50';
                }
              } else if (isSelected) {
                optionStyles = 'border-purple bg-purple/15 text-navy font-bold shadow-[0_2px_0_var(--game-purple)]';
              }

              return (
                <button
                  key={opt.id}
                  disabled={isAnswerSubmitted}
                  onClick={() => {
                    soundFx.hoverTick();
                    setSelectedOptionId(opt.id);
                  }}
                  className={`w-full p-4 rounded-xl border-2 text-left text-xs sm:text-sm transition-all duration-150 flex items-center justify-between gap-4 cursor-pointer ${optionStyles}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg border-2 border-border bg-card-subtle flex items-center justify-center font-heading font-bold text-xs text-muted shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-sans font-medium">{opt.text}</span>
                  </div>

                  {isAnswerSubmitted && (
                    <div>
                      {isCorrectOpt && <CheckCircle2 className="w-5 h-5 text-green shrink-0" />}
                      {isSelected && !isCorrectOpt && <XCircle className="w-5 h-5 text-red shrink-0" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Post-Answer Explanation Box */}
          <AnimatePresence>
            {isAnswerSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border-2 flex items-start gap-3 ${
                  selectedOptionId === currentQuestion.correctOptionId
                    ? 'border-green/40 bg-green/10 text-navy'
                    : 'border-red/40 bg-red/10 text-navy'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {selectedOptionId === currentQuestion.correctOptionId ? (
                    <CheckCircle2 className="w-5 h-5 text-green" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red" />
                  )}
                </div>
                <div className="space-y-1 text-xs">
                  <div className="font-heading font-black uppercase tracking-wider">
                    {selectedOptionId === currentQuestion.correctOptionId ? 'Correct Answer!' : 'Incorrect Choice'}
                  </div>
                  <p className="font-sans text-muted leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* 3. Bottom Action Bar */}
      <div className="relative z-20 px-6 py-4 border-t-2 border-border bg-card/90 backdrop-blur-md flex items-center justify-between gap-4">
        <div className="text-xs font-heading font-bold text-muted">
          Answer selection required to proceed
        </div>

        <div>
          {!isAnswerSubmitted ? (
            <button
              disabled={!selectedOptionId}
              onClick={handleSubmitAnswer}
              className={`px-7 py-3 rounded-xl game-btn font-heading text-xs font-extrabold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
                selectedOptionId
                  ? 'game-btn-green text-white border-green'
                  : 'bg-card-subtle text-muted border-border cursor-not-allowed opacity-50'
              }`}
            >
              <span>SUBMIT ANSWER</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-7 py-3 rounded-xl game-btn game-btn-purple font-heading text-xs font-extrabold tracking-wider uppercase text-white border-2 border-purple flex items-center gap-2 cursor-pointer"
            >
              <span>{currentIndex < totalQuestions - 1 ? 'NEXT QUESTION' : 'FINISH QUIZ'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* GAME OVER SCREEN OVERLAY (When 5 hearts run out) */}
      <AnimatePresence>
        {isGameOver && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full bg-card p-6 sm:p-8 rounded-3xl border-3 border-red game-card space-y-5 shadow-2xl text-center text-navy font-sans"
            >
              <div className="w-16 h-16 rounded-3xl bg-red/15 text-red flex items-center justify-center mx-auto border-2 border-red/40">
                <Heart className="w-8 h-8 fill-red text-red animate-pulse" />
              </div>

              <div>
                <div className="text-xs font-heading font-black text-red tracking-widest uppercase">
                  HEARTS DEPLETED · ZERO LIVES REMAINING
                </div>
                <h2 className="text-3xl font-heading font-black text-navy mt-1">
                  Game Over
                </h2>
                <p className="text-xs text-muted font-sans mt-2 max-w-xs mx-auto leading-relaxed">
                  You lost all 5 hearts on this challenge! Don't worry—review the syntax rules and jump back in to conquer the village.
                </p>
              </div>

              {/* Progress recap before defeat */}
              <div className="bg-card-subtle p-3.5 rounded-2xl border-2 border-border flex items-center justify-around text-xs font-heading font-bold">
                <div>
                  <span className="text-muted block text-[10px]">SOLVED CORRECTLY</span>
                  <span className="text-green text-sm font-black">{answers.filter(a => a.isCorrect).length} Questions</span>
                </div>
                <div className="h-6 w-[2px] bg-border" />
                <div>
                  <span className="text-muted block text-[10px]">PROGRESS</span>
                  <span className="text-navy text-sm font-black">{answers.length} / {totalQuestions}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    soundFx.click();
                    onExitQuiz();
                  }}
                  className="game-btn game-btn-card flex-1 py-3 rounded-2xl text-xs font-heading font-bold cursor-pointer"
                >
                  RETURN TO MAP
                </button>
                <button
                  onClick={handleRestartQuiz}
                  className="game-btn game-btn-green flex-1 py-3 rounded-2xl text-xs font-heading font-bold flex items-center justify-center gap-2 cursor-pointer text-white"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>TRY AGAIN</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog on Exit */}
      <AnimatePresence>
        {showExitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-md w-full bg-card p-6 rounded-2xl border-2 border-border game-card space-y-4 shadow-2xl text-center text-navy font-sans"
            >
              <div className="w-12 h-12 rounded-2xl bg-gold/20 text-gold flex items-center justify-center mx-auto border-2 border-gold">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold font-heading text-navy">
                Exit Active Quiz?
              </h3>
              <p className="text-xs text-muted font-sans leading-relaxed">
                Leaving now will submit your quiz with current recorded progress. Incomplete questions will be marked unanswered.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="py-2.5 rounded-xl game-btn game-btn-card text-navy font-heading text-xs font-bold border-2 border-border cursor-pointer"
                >
                  RESUME QUIZ
                </button>
                <button
                  onClick={() => {
                    setShowExitConfirm(false);
                    onExitQuiz();
                  }}
                  className="py-2.5 rounded-xl game-btn game-btn-red text-white font-heading text-xs font-bold border-2 border-red cursor-pointer"
                >
                  CONFIRM EXIT
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
