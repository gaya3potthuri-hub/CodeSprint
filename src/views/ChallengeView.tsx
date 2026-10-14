import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Lightbulb, 
  RotateCcw, 
  ArrowRight,
  List,
  Terminal,
  Database,
  Layout,
  Check,
  Crosshair,
  Target,
  Shield,
  Zap,
  Volume2,
  VolumeX
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Challenge, UserProfile, LearningPath } from '../types';
import { CodeBlock } from '../components/CodeBlock';
import { soundFx } from '../services/soundFx';

interface ChallengeViewProps {
  challengeId: string;
  paths: LearningPath[];
  user: UserProfile;
  onBack: () => void;
  onCompleteChallenge: (challengeId: string, xp: number) => void;
  onSelectChallenge: (challengeId: string) => void;
}

export const ChallengeView: React.FC<ChallengeViewProps> = ({
  challengeId,
  paths,
  user,
  onBack,
  onCompleteChallenge,
  onSelectChallenge
}) => {
  const allChallenges: Challenge[] = paths.flatMap((p) =>
    p.topics.flatMap((t) => t.challenges)
  );

  const currentChallengeIndex = allChallenges.findIndex((c) => c.id === challengeId);
  const currentChallenge = allChallenges[currentChallengeIndex] || allChallenges[0];

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setShowHint(false);
    setTimeLeft(60);
  }, [challengeId]);

  if (!currentChallenge) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-muted font-heading">
        <p>[ TARGET DRILL NOT FOUND ]</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 game-btn game-btn-purple text-white rounded-xl">
          RETURN TO DASHBOARD
        </button>
      </div>
    );
  }

  const isSolved = user.completedChallengeIds.includes(currentChallenge.id);
  const isCorrect = selectedOptionId === currentChallenge.correctOptionId;

  const handleSubmit = () => {
    if (!selectedOptionId) return;
    soundFx.lockIn();
    setIsSubmitted(true);

    if (selectedOptionId === currentChallenge.correctOptionId) {
      setTimeout(() => {
        soundFx.headshot();
      }, 150);

      try {
        confetti({
          particleCount: 50,
          spread: 75,
          origin: { y: 0.65 },
          colors: ['#FF4655', '#00F5D4', '#F59E0B']
        });
      } catch {}

      onCompleteChallenge(currentChallenge.id, currentChallenge.xpReward);
    } else {
      setTimeout(() => {
        soundFx.errorDeflect();
      }, 150);
    }
  };

  const handleNextChallenge = () => {
    soundFx.click();
    const nextIdx = (currentChallengeIndex + 1) % allChallenges.length;
    onSelectChallenge(allChallenges[nextIdx].id);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-page text-navy">
      
      {/* Top Tactical Bar */}
      <div className="border-b-2 border-border bg-card px-4 sm:px-6 py-3 font-heading">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundFx.click();
                onBack();
              }}
              onMouseEnter={() => soundFx.hoverTick()}
              className="p-1.5 rounded-xl text-muted hover:text-navy hover:bg-card-subtle transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-extrabold text-purple uppercase tracking-wider">
                {currentChallenge.pathId}
              </span>
              <span className="text-border">/</span>
              <span className="text-muted truncate max-w-[150px] sm:max-w-xs font-sans">
                {currentChallenge.topicTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-green bg-green/10 border-2 border-green/30 px-2.5 py-1 rounded-xl font-bold">
              <Crosshair className="w-3.5 h-3.5" />
              <span>+{currentChallenge.xpReward} RR</span>
            </div>

            <button
              onClick={() => {
                soundFx.click();
                setIsDrawerOpen(!isDrawerOpen);
              }}
              onMouseEnter={() => soundFx.hoverTick()}
              className="px-2.5 py-1 text-xs rounded-xl game-btn game-btn-card text-navy border-2 border-border flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <List className="w-3.5 h-3.5" />
              <span>{currentChallengeIndex + 1}/{allChallenges.length}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Code & Problem (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 font-mono text-xs">
                <span className={`px-2 py-0.5 rounded-xs font-bold tracking-wider ${
                  currentChallenge.difficulty === 'Beginner'
                    ? 'bg-blue-100 text-sky border-2 border-sky/30 dark:bg-sky/20'
                    : 'bg-amber-100 text-gold border-2 border-gold/30 dark:bg-gold/20'
                }`}>
                  {currentChallenge.difficulty} TIER
                </span>

                {isSolved && (
                  <span className="flex items-center gap-1 text-green font-bold font-heading">
                    <Check className="w-3.5 h-3.5" /> CLEARED
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-navy tracking-tight font-heading">
                {currentChallenge.title}
              </h1>

              <p className="text-sm text-navy leading-relaxed pt-1 font-sans">
                {currentChallenge.question}
              </p>
            </div>

            {/* Code Snippet */}
            {currentChallenge.codeSnippet && (
              <div className="pt-2">
                <CodeBlock
                  code={currentChallenge.codeSnippet.code}
                  language={currentChallenge.codeSnippet.language}
                  filename={`protocol.${
                    currentChallenge.codeSnippet.language === 'python'
                      ? 'py'
                      : currentChallenge.codeSnippet.language === 'sql'
                      ? 'sql'
                      : 'js'
                  }`}
                  showLineNumbers={true}
                />
              </div>
            )}

            {/* Hint Box */}
            <div className="pt-2 font-mono">
              <button
                onClick={() => {
                  soundFx.hoverTick();
                  setShowHint(!showHint);
                }}
                className="text-xs text-neutral-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>{showHint ? '[ HIDE RECON INTEL ]' : '[ REQUEST INTEL CLUE ]'}</span>
              </button>

              {showHint && (
                <div className="mt-2.5 p-3 rounded bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 animate-in fade-in duration-200 font-sans">
                  {currentChallenge.hint}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Choices & Action (5 cols) */}
          <div className="lg:col-span-5 bg-card rounded-2xl border-2 border-border p-6 space-y-6 game-card">
            
            <div>
              <div className="text-xs font-heading font-extrabold tracking-wider text-muted uppercase mb-3 flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-purple" />
                <span>SELECT YOUR TARGET:</span>
              </div>

              <div className="space-y-3 font-sans">
                {currentChallenge.options.map((opt, idx) => {
                  const isSelected = selectedOptionId === opt.id;
                  let cardStyle = 'border-2 border-border bg-card text-navy hover:border-purple/50 game-card-subtle';

                  if (isSubmitted) {
                    if (opt.id === currentChallenge.correctOptionId) {
                      cardStyle = 'border-2 border-green bg-green/15 text-navy ring-2 ring-green/20';
                    } else if (isSelected && !isCorrect) {
                      cardStyle = 'border-2 border-red bg-red/15 text-navy ring-2 ring-red/20';
                    }
                  } else if (isSelected) {
                    cardStyle = 'border-2 border-purple bg-purple/15 text-navy ring-2 ring-purple/20';
                  }

                  const labels = ['A', 'B', 'C', 'D'];

                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        soundFx.hoverTick();
                        if (isSubmitted && isCorrect) return;
                        setSelectedOptionId(opt.id);
                        setIsSubmitted(false);
                      }}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group cursor-pointer ${cardStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-xl text-xs font-heading font-extrabold flex items-center justify-center shrink-0 border-2 ${
                          isSelected
                            ? 'bg-purple text-white border-purple'
                            : 'bg-card-subtle text-navy border-border group-hover:border-purple/50'
                        }`}>
                          {labels[idx] || (idx + 1)}
                        </span>
                        <span className="font-sans text-xs sm:text-sm font-bold text-navy">{opt.text}</span>
                      </div>

                      {isSubmitted && opt.id === currentChallenge.correctOptionId && (
                        <CheckCircle2 className="w-5 h-5 text-green shrink-0" />
                      )}
                      {isSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback Message */}
            <AnimatePresence mode="wait">
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className={`p-4 rounded-2xl border-2 text-xs leading-relaxed space-y-1.5 ${
                    isCorrect
                      ? 'bg-green/10 border-green text-navy'
                      : 'bg-red/10 border-red text-navy'
                  }`}
                >
                  <div className="flex items-center gap-2 font-extrabold text-sm font-heading">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-green" />
                        <span className="text-green uppercase">TARGET NEUTRALIZED! +{currentChallenge.xpReward} RR SECURED</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red" />
                        <span className="text-red uppercase">TACTICAL REJECT. EVALUATION INCORRECT.</span>
                      </>
                    )}
                  </div>
                  <p className="text-navy font-sans text-xs">{currentChallenge.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="pt-2">
              {!isSubmitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={!selectedOptionId}
                  onMouseEnter={() => soundFx.hoverTick()}
                  className="w-full py-3.5 px-4 game-btn game-btn-purple text-white border-2 border-purple disabled:opacity-40 text-xs font-heading font-extrabold tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>LOCK IN SELECTION</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : isCorrect ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleNextChallenge}
                    onMouseEnter={() => soundFx.hoverTick()}
                    className="flex-1 py-3.5 px-4 game-btn game-btn-green text-white border-2 border-green text-xs font-heading font-extrabold tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>NEXT CHALLENGE OBJECTIVE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    soundFx.click();
                    setIsSubmitted(false);
                  }}
                  onMouseEnter={() => soundFx.hoverTick()}
                  className="w-full py-3.5 px-4 game-btn game-btn-card text-navy border-2 border-border text-xs font-heading font-extrabold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>RE-ATTEMPT CHALLENGE</span>
                </button>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Challenge Navigation Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end font-mono">
          <div
            className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-card border-l-2 border-border h-full p-6 overflow-y-auto space-y-6 text-navy">
            <div className="flex items-center justify-between pb-4 border-b-2 border-border font-heading">
              <h3 className="font-extrabold text-navy text-sm tracking-wider">ALL SPRINT MISSIONS</h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-xs text-muted hover:text-navy font-bold"
              >
                [ CLOSE ]
              </button>
            </div>

            <div className="space-y-2">
              {allChallenges.map((ch, idx) => {
                const isSelected = ch.id === currentChallenge.id;
                const isDone = user.completedChallengeIds.includes(ch.id);

                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      soundFx.click();
                      onSelectChallenge(ch.id);
                      setIsDrawerOpen(false);
                    }}
                    onMouseEnter={() => soundFx.hoverTick()}
                    className={`w-full p-3 rounded-2xl border-2 text-left transition-all flex items-center justify-between text-xs game-card-subtle ${
                      isSelected
                        ? 'border-purple bg-purple/20 text-navy'
                        : 'border-border bg-card-subtle text-navy hover:border-purple/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-muted font-heading font-extrabold">{idx + 1}</span>
                      <div className="truncate max-w-[190px]">
                        <p className="font-bold text-navy truncate font-sans">{ch.title}</p>
                        <p className="text-[10px] text-muted uppercase font-heading">{ch.pathId} · {ch.difficulty}</p>
                      </div>
                    </div>

                    {isDone && (
                      <Check className="w-4 h-4 text-green shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
