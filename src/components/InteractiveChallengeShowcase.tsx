import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Sparkles, ArrowRight, RotateCcw, ChevronRight, Crosshair, Target, Shield, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../services/soundFx';

interface ChallengeDemoItem {
  id: string;
  category: string;
  categoryBadge: string;
  title: string;
  question: string;
  codeSnippet: string;
  language: string;
  options: { id: string; label: string; text: string }[];
  correctId: string;
  explanation: string;
  hint: string;
}

const DEMO_CHALLENGES: ChallengeDemoItem[] = [
  {
    id: 'demo-1',
    category: 'PYTHON',
    categoryBadge: 'OPERATOR PROTOCOL',
    title: 'Pointer & Register Output',
    question: 'What will this Python protocol print to the combat terminal?',
    codeSnippet: `name = "Alex"
print(name)`,
    language: 'python',
    options: [
      { id: 'A', label: 'A', text: 'name' },
      { id: 'B', label: 'B', text: 'Alex' },
      { id: 'C', label: 'C', text: 'Error' },
    ],
    correctId: 'B',
    explanation: '`name` stores the string literal `"Alex"`. `print(name)` resolves the identifier in memory and emits its literal string value to stdout.',
    hint: 'Notice there are no quotes around name inside the print() call.'
  },
  {
    id: 'demo-2',
    category: 'SQL',
    categoryBadge: 'SENTINEL INTEL',
    title: 'Relational Row Extraction',
    question: 'Which query retrieves only members with age over 21?',
    codeSnippet: `SELECT first_name, age 
FROM members
WHERE age > 21;`,
    language: 'sql',
    options: [
      { id: 'A', label: 'A', text: 'WHERE age > 21' },
      { id: 'B', label: 'B', text: 'FILTER age > 21' },
      { id: 'C', label: 'C', text: 'HAVING age > 21' },
    ],
    correctId: 'A',
    explanation: 'In SQL, `WHERE` is the primary clause for filtering raw table rows before grouping or projection.',
    hint: 'WHERE filters individual row records; HAVING is reserved for aggregate groups.'
  },
  {
    id: 'demo-3',
    category: 'WEB DEV',
    categoryBadge: 'DUELIST ASSAULT',
    title: 'Array Transformation Ammo',
    question: 'What will `result` contain after execution?',
    codeSnippet: `const scores = [10, 20];
const result = scores.map(s => s * 2);
console.log(result);`,
    language: 'javascript',
    options: [
      { id: 'A', label: 'A', text: '[10, 20]' },
      { id: 'B', label: 'B', text: '[20, 40]' },
      { id: 'C', label: 'C', text: '60' },
    ],
    correctId: 'B',
    explanation: '`map()` iterates over each element in the array and returns a new array with mapped values: 10 * 2 = 20, 20 * 2 = 40.',
    hint: 'Array.map transforms every item independently without mutating the original array.'
  }
];

interface InteractiveChallengeShowcaseProps {
  onEarnXp?: (amount: number) => void;
  onExploreFullApp: () => void;
}

export const InteractiveChallengeShowcase: React.FC<InteractiveChallengeShowcaseProps> = ({
  onEarnXp,
  onExploreFullApp
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [localXp, setLocalXp] = useState(150);
  const [solvedInDemo, setSolvedInDemo] = useState<string[]>([]);

  const currentChallenge = DEMO_CHALLENGES[currentIdx];
  const isCorrect = selectedOption === currentChallenge.correctId;
  const alreadyAwarded = solvedInDemo.includes(currentChallenge.id);

  const handleSelect = (optionId: string) => {
    soundFx.hoverTick();
    if (isSubmitted && isCorrect) return;
    setSelectedOption(optionId);
    setIsSubmitted(false);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;
    soundFx.lockIn();
    setIsSubmitted(true);

    if (selectedOption === currentChallenge.correctId) {
      setTimeout(() => {
        soundFx.headshot();
      }, 150);

      if (!alreadyAwarded) {
        setSolvedInDemo((prev) => [...prev, currentChallenge.id]);
        setLocalXp((prev) => prev + 50);
        if (onEarnXp) onEarnXp(50);
      }
      
      try {
        confetti({
          particleCount: 45,
          spread: 75,
          origin: { y: 0.65 },
          colors: ['#FF4655', '#00F5D4', '#F59E0B']
        });
      } catch {}
    } else {
      setTimeout(() => {
        soundFx.errorDeflect();
      }, 150);
    }
  };

  const handleNextChallenge = () => {
    soundFx.click();
    const next = (currentIdx + 1) % DEMO_CHALLENGES.length;
    setCurrentIdx(next);
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  const handleResetChallenge = () => {
    soundFx.click();
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  return (
    <div className="game-card bg-card text-navy shadow-xl overflow-hidden relative">
      {/* Top Status Bar */}
      <div className="px-5 py-3 bg-card-subtle border-b-2 border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {DEMO_CHALLENGES.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => {
                soundFx.click();
                setCurrentIdx(idx);
                setSelectedOption(null);
                setIsSubmitted(false);
              }}
              onMouseEnter={() => soundFx.hoverTick()}
              className={`px-3 py-1 text-xs font-heading font-bold rounded-xl border-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                currentIdx === idx
                  ? 'bg-purple border-purple-dark text-white shadow-[0_2px_0_var(--game-purple-dark)]'
                  : 'text-navy hover:bg-card-subtle bg-card border-border'
              }`}
            >
              <span>{ch.category}</span>
              {solvedInDemo.includes(ch.id) && (
                <span className="text-green">●</span>
              )}
            </button>
          ))}
        </div>

        {/* Live XP Counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-heading font-bold text-xs text-green bg-green/15 px-2.5 py-1 rounded-xl border-2 border-green/30 tabular-nums">
            <Target className="w-3.5 h-3.5" />
            <span>ACCURACY 94%</span>
          </div>

          <motion.div
            key={localXp}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 font-heading font-bold text-xs tabular-nums bg-gold/15 text-gold px-2.5 py-1 rounded-xl border-2 border-gold/40"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+{localXp} XP</span>
          </motion.div>
        </div>
      </div>

      {/* Main Grid: Code Window on Left, Options on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x-2 divide-border">
        
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 p-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-heading">
            <div className="flex items-center gap-2">
              <span className="text-purple font-bold tracking-wider">{currentChallenge.categoryBadge}</span>
              <span className="text-muted">·</span>
              <span className="text-muted">{currentChallenge.title}</span>
            </div>
            <span className="text-green font-bold">+50 XP REWARD</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-navy font-heading tracking-tight">
            {currentChallenge.question}
          </h3>

          {/* Code Box */}
          <div className="rounded-xl border-2 border-border bg-card-subtle p-4 font-mono text-xs sm:text-sm shadow-inner relative overflow-hidden">
            <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-border text-xs text-muted">
              <span className="text-purple font-bold font-mono">script.{currentChallenge.language === 'python' ? 'py' : currentChallenge.language === 'sql' ? 'sql' : 'js'}</span>
              <span className="text-muted font-bold">[ EXECUTABLE ]</span>
            </div>
            <pre className="text-navy leading-relaxed overflow-x-auto whitespace-pre font-mono">
              <code>{currentChallenge.codeSnippet}</code>
            </pre>
          </div>

          <p className="text-xs text-muted flex items-center gap-1.5 font-sans">
            <span className="font-bold text-navy">[ HINT ]:</span>
            <span>{currentChallenge.hint}</span>
          </p>
        </div>

        {/* Right Column: Choices & Lock-in (5 cols) */}
        <div className="lg:col-span-5 p-6 bg-card flex flex-col justify-between space-y-5">
          <div>
            <div className="text-xs font-heading font-bold tracking-wide text-navy uppercase mb-3 flex items-center gap-1.5">
              <Crosshair className="w-4 h-4 text-purple" />
              <span>SELECT YOUR SOLUTION:</span>
            </div>

            <div className="space-y-2.5">
              {currentChallenge.options.map((opt) => {
                const isChosen = selectedOption === opt.id;
                let stateStyles = 'border-border bg-card-subtle text-navy hover:border-purple';

                if (isSubmitted) {
                  if (opt.id === currentChallenge.correctId) {
                    stateStyles = 'border-green bg-green/20 text-navy font-bold shadow-[0_2px_0_var(--game-green-dark)]';
                  } else if (isChosen && !isCorrect) {
                    stateStyles = 'border-red bg-red/20 text-navy font-bold shadow-[0_2px_0_var(--game-red-dark)]';
                  }
                } else if (isChosen) {
                  stateStyles = 'border-purple bg-purple/15 text-navy font-bold shadow-[0_2px_0_var(--game-purple-dark)]';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    onMouseEnter={() => soundFx.hoverTick()}
                    className={`w-full p-3.5 rounded-xl border-2 text-left transition-all flex items-center justify-between group cursor-pointer ${stateStyles}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center border ${
                        isChosen
                          ? 'bg-purple text-white border-purple-dark'
                          : 'bg-card text-navy border-border'
                      }`}>
                        {opt.label}
                      </span>
                      <span className="font-sans text-xs sm:text-sm font-semibold">{opt.text}</span>
                    </div>

                    {isSubmitted && opt.id === currentChallenge.correctId && (
                      <CheckCircle2 className="w-4 h-4 text-green shrink-0" />
                    )}
                    {isSubmitted && isChosen && !isCorrect && (
                      <XCircle className="w-4 h-4 text-red shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Actions */}
          <div className="space-y-3 pt-2">
            <AnimatePresence mode="wait">
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className={`p-3.5 rounded-xl border-2 text-xs font-sans leading-relaxed ${
                    isCorrect
                      ? 'bg-green/15 border-green/40 text-navy'
                      : 'bg-red/15 border-red/40 text-navy'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold mb-1 font-heading">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green" />
                        <span className="text-green">CORRECT! +50 XP ADDED</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red" />
                        <span className="text-red">INCORRECT. TRY AGAIN!</span>
                      </>
                    )}
                  </div>
                  <p className="text-muted font-sans text-xs mt-1">{currentChallenge.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-2.5">
              {!isSubmitted ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={!selectedOption}
                  onMouseEnter={() => soundFx.hoverTick()}
                  className="game-btn game-btn-purple w-full py-2.5 px-4 disabled:opacity-40 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>LOCK IN SELECTION</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : isCorrect ? (
                <div className="flex items-center gap-2 w-full">
                  <button
                    onClick={handleNextChallenge}
                    onMouseEnter={() => soundFx.hoverTick()}
                    className="game-btn game-btn-card flex-1 py-2.5 px-3 text-navy text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>NEXT CHALLENGE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      soundFx.click();
                      onExploreFullApp();
                    }}
                    onMouseEnter={() => soundFx.hoverTick()}
                    className="game-btn game-btn-green py-2.5 px-3 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <span>EXPLORE ALL</span>
                    <Zap className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleResetChallenge}
                  onMouseEnter={() => soundFx.hoverTick()}
                  className="game-btn game-btn-card w-full py-2.5 px-4 text-navy text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>TRY AGAIN</span>
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
