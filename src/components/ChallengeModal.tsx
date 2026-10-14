import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ChevronRight, 
  RotateCcw, 
  Lightbulb,
  Crosshair,
  Zap,
  Terminal
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { IslandWorldNode } from '../types';
import { CodeBlock } from './CodeBlock';
import { soundFx } from '../services/soundFx';

interface ChallengeModalProps {
  node: IslandWorldNode | null;
  onClose: () => void;
  onSolve: (nodeId: string, challengeId: string, xp: number) => void;
  isAlreadyCleared: boolean;
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({
  node,
  onClose,
  onSolve,
  isAlreadyCleared
}) => {
  if (!node) return null;

  const challenge = node.challenge;
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const isCorrect = selectedOptionId === challenge.correctOptionId;

  const handleSubmit = () => {
    if (!selectedOptionId) return;
    soundFx.lockIn();
    setIsSubmitted(true);

    if (selectedOptionId === challenge.correctOptionId) {
      setTimeout(() => {
        soundFx.headshot();
      }, 150);

      try {
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FF4655', '#00F5D4', '#F59E0B']
        });
      } catch {}

      onSolve(node.id, challenge.id, challenge.xpReward);
    } else {
      setTimeout(() => {
        soundFx.errorDeflect();
      }, 150);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl border-2 border-border overflow-hidden z-10 text-navy max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b-2 border-border bg-card-subtle flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base border-2 ${
                node.type === 'tree' ? 'bg-green/15 text-green border-green/40' :
                node.type === 'cave' ? 'bg-sky/15 text-sky border-sky/40' :
                node.type === 'stone' ? 'bg-gold/15 text-gold border-gold/40' :
                'bg-purple/15 text-purple border-purple/40'
              }`}>
                {node.type === 'tree' ? '🌲' : node.type === 'cave' ? '⛰️' : node.type === 'stone' ? '🪨' : '🏆'}
              </span>
              <div>
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">
                  {node.type.toUpperCase()}: {node.title}
                </span>
                <h3 className="text-sm font-bold text-navy font-heading truncate max-w-sm">
                  {challenge.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-green bg-green/15 border-2 border-green/40 px-2.5 py-0.5 rounded-xl font-heading">
                +{challenge.xpReward} XP
              </span>
              <button
                onClick={() => {
                  soundFx.click();
                  onClose();
                }}
                className="p-1 rounded-xl text-muted hover:text-navy hover:bg-card transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            <div className="space-y-1">
              <p className="text-xs text-muted font-bold">CHALLENGE QUESTION:</p>
              <h4 className="text-base font-bold text-navy font-heading leading-relaxed">
                {challenge.question}
              </h4>
            </div>

            {/* Code Snippet */}
            {challenge.codeSnippet && (
              <CodeBlock
                code={challenge.codeSnippet.code}
                language={challenge.codeSnippet.language}
                filename={`inspect.${
                  challenge.codeSnippet.language === 'python' ? 'py' :
                  challenge.codeSnippet.language === 'sql' ? 'sql' : 'js'
                }`}
                showLineNumbers={true}
              />
            )}

            {/* Answer Options */}
            <div className="space-y-2.5 pt-1">
              <div className="text-xs font-bold text-muted uppercase tracking-wider">
                Select Your Solution:
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {challenge.options.map((opt, idx) => {
                  const isSelected = selectedOptionId === opt.id;
                  let style = 'border-border bg-card-subtle text-navy hover:border-purple';

                  if (isSubmitted) {
                    if (opt.id === challenge.correctOptionId) {
                      style = 'border-green bg-green/20 text-navy font-bold shadow-[0_2px_0_var(--game-green-dark)]';
                    } else if (isSelected && !isCorrect) {
                      style = 'border-red bg-red/20 text-navy font-bold shadow-[0_2px_0_var(--game-red-dark)]';
                    }
                  } else if (isSelected) {
                    style = 'border-purple bg-purple/15 text-navy font-bold shadow-[0_2px_0_var(--game-purple-dark)]';
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
                      className={`w-full p-3.5 rounded-xl border-2 text-left transition-all flex items-center justify-between group cursor-pointer ${style}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border ${
                          isSelected ? 'bg-purple text-white border-purple-dark' : 'bg-card border-border text-navy'
                        }`}>
                          {labels[idx] || (idx + 1)}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold">{opt.text}</span>
                      </div>

                      {isSubmitted && opt.id === challenge.correctOptionId && (
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

            {/* Hint Box */}
            <div>
              <button
                onClick={() => {
                  soundFx.hoverTick();
                  setShowHint(!showHint);
                }}
                className="text-xs text-muted hover:text-gold flex items-center gap-1.5 transition-colors cursor-pointer font-bold"
              >
                <Lightbulb className="w-4 h-4 text-gold" />
                <span>{showHint ? 'Hide Clue' : 'Need a Clue?'}</span>
              </button>

              {showHint && (
                <div className="mt-2 p-3 rounded-xl bg-gold/15 border-2 border-gold/30 text-xs text-navy animate-in fade-in duration-150 font-sans font-medium">
                  {challenge.hint}
                </div>
              )}
            </div>

            {/* Feedback Message */}
            <AnimatePresence mode="wait">
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className={`p-3.5 rounded-xl border-2 text-xs leading-relaxed space-y-1 ${
                    isCorrect
                      ? 'bg-green/15 border-green/40 text-navy'
                      : 'bg-red/15 border-red/40 text-navy'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs font-heading">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green" />
                        <span className="text-green">CORRECT! +{challenge.xpReward} XP AWARDED</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red" />
                        <span className="text-red">INCORRECT SOLUTION. TRY AGAIN!</span>
                      </>
                    )}
                  </div>
                  <p className="text-muted font-sans text-xs">{challenge.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Action Buttons */}
          <div className="p-4 bg-card-subtle border-t-2 border-border flex items-center justify-between gap-3">
            <button
              onClick={() => {
                soundFx.click();
                onClose();
              }}
              className="game-btn game-btn-card px-4 py-2.5 text-xs font-bold"
            >
              DISMISS
            </button>

            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={!selectedOptionId}
                onMouseEnter={() => soundFx.hoverTick()}
                className="game-btn game-btn-purple px-6 py-2.5 disabled:opacity-40 text-white text-xs font-bold tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <span>LOCK IN ANSWER</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : isCorrect ? (
              <button
                onClick={() => {
                  soundFx.click();
                  onClose();
                }}
                className="game-btn game-btn-green px-6 py-2.5 text-white text-xs font-bold tracking-wider cursor-pointer"
              >
                CONTINUE EXPEDITION
              </button>
            ) : (
              <button
                onClick={() => {
                  soundFx.click();
                  setIsSubmitted(false);
                }}
                className="game-btn game-btn-card px-6 py-2.5 text-navy text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>TRY AGAIN</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
