import React, { useState } from 'react';
import { 
  Terminal, 
  Database, 
  Layout, 
  ArrowLeft, 
  Play, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  BookOpen,
  ChevronRight,
  Crosshair,
  Shield,
  Zap,
  Target
} from 'lucide-react';
import { LearningPath, LearningPathId, UserProfile, Challenge } from '../types';
import { CodeBlock } from '../components/CodeBlock';
import { soundFx } from '../services/soundFx';

interface LearningPathViewProps {
  initialPathId: LearningPathId;
  paths: LearningPath[];
  user: UserProfile;
  onBack: () => void;
  onSelectChallenge: (challengeId: string) => void;
}

export const LearningPathView: React.FC<LearningPathViewProps> = ({
  initialPathId,
  paths,
  user,
  onBack,
  onSelectChallenge
}) => {
  const [selectedPathId, setSelectedPathId] = useState<LearningPathId>(initialPathId);

  const currentPath = paths.find((p) => p.id === selectedPathId) || paths[0];

  const allPathChallenges = currentPath.topics.flatMap((t) => t.challenges);
  const solvedCount = allPathChallenges.filter((ch) =>
    user.completedChallengeIds.includes(ch.id)
  ).length;
  const progressPercent =
    allPathChallenges.length > 0
      ? Math.round((solvedCount / allPathChallenges.length) * 100)
      : 0;

  return (
    <div className="w-full flex-1 bg-[var(--bg-app)] text-[var(--text-primary)] py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
      
      {/* Top Breadcrumb & Path Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
        <button
          onClick={() => {
            soundFx.click();
            onBack();
          }}
          onMouseEnter={() => soundFx.hoverTick()}
          className="inline-flex items-center gap-2 text-xs text-muted hover:text-navy font-heading font-bold transition-colors w-fit cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>[ RETURN TO DASHBOARD ]</span>
        </button>

        {/* 3 Path Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 bg-card rounded-2xl border-2 border-border game-card overflow-x-auto">
          {paths.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                soundFx.click();
                setSelectedPathId(p.id);
              }}
              onMouseEnter={() => soundFx.hoverTick()}
              className={`px-3.5 py-2 text-xs font-heading font-extrabold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer border-2 ${
                selectedPathId === p.id
                  ? 'game-btn game-btn-purple text-white border-purple'
                  : 'game-btn game-btn-card text-navy border-border'
              }`}
            >
              {p.id === 'python' ? (
                <Terminal className="w-3.5 h-3.5" />
              ) : p.id === 'sql' ? (
                <Database className="w-3.5 h-3.5" />
              ) : (
                <Layout className="w-3.5 h-3.5" />
              )}
              <span>{p.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Path Marquee Hero Card */}
      <div className="bg-card rounded-2xl border-2 border-border p-6 sm:p-8 game-card">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-3">
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white border border-navy/20"
                style={{ backgroundColor: currentPath.color }}
              >
                {currentPath.id === 'python' ? (
                  <Terminal className="w-5 h-5 text-white" />
                ) : currentPath.id === 'sql' ? (
                  <Database className="w-5 h-5 text-neutral-950" />
                ) : (
                  <Layout className="w-5 h-5 text-neutral-950" />
                )}
              </span>
              <div>
                <span className="text-[10px] font-heading font-extrabold tracking-wider text-purple uppercase block">
                  {currentPath.tacticalRole}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight font-heading">
                  {currentPath.title}
                </h1>
              </div>
            </div>

            <p className="text-sm text-muted leading-relaxed max-w-xl font-sans">
              {currentPath.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-heading font-bold text-muted pt-1">
              <div className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-green" />
                <span>{currentPath.topics.length} Mission Sectors</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-muted" />
                <span>~{currentPath.estimatedHours} Hours Deployment</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-gold" />
                <span>{allPathChallenges.length * 50} RR Available</span>
              </div>
            </div>

            {/* Path Progress Bar */}
            <div className="space-y-1.5 pt-2 max-w-md font-heading text-xs">
              <div className="flex justify-between text-muted">
                <span>Sector Clearance</span>
                <span className="text-navy font-extrabold">{solvedCount}/{allPathChallenges.length} Cleared ({progressPercent}%)</span>
              </div>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div
                  style={{ width: `${progressPercent}%`, backgroundColor: currentPath.color }}
                  className="h-full rounded-full transition-all"
                />
              </div>
            </div>
          </div>

          {/* Sample Snippet on Right */}
          <div className="lg:col-span-5">
            <CodeBlock
              code={currentPath.sampleCode.code}
              language={currentPath.sampleCode.language}
              filename={currentPath.sampleCode.filename}
              showLineNumbers={true}
            />
          </div>

        </div>
      </div>

      {/* Topics Syllabus & Challenges List */}
      <div className="space-y-6">
        <div className="font-heading">
          <h2 className="text-xl font-extrabold text-navy uppercase">MISSION SECTOR SYLLABUS</h2>
          <p className="text-xs text-muted mt-0.5 font-sans">Progressive operational drills arranged by conceptual clearance</p>
        </div>

        <div className="space-y-6">
          {currentPath.topics.map((topic, topicIdx) => {
            return (
              <div
                key={topic.id}
                className={`rounded-2xl border-2 transition-all game-card ${
                  topic.isLocked
                    ? 'bg-card/60 border-border opacity-70'
                    : 'bg-card border-border'
                }`}
              >
                {/* Topic Header */}
                <div className="p-5 sm:p-6 border-b-2 border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-heading">
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-xl bg-card-subtle text-purple font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 border-2 border-border">
                      0{topicIdx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-navy">{topic.title}</h3>
                        {topic.isLocked && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-muted bg-card-subtle border border-border px-2 py-0.5 rounded-lg">
                            <Lock className="w-3 h-3" /> RESTRICTED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted mt-0.5 font-sans">{topic.description}</p>
                    </div>
                  </div>

                  <div className="text-xs text-muted sm:text-right shrink-0 font-bold">
                    {topic.challenges.length} active drills
                  </div>
                </div>

                {/* Challenges inside topic */}
                <div className="p-4 sm:p-6">
                  {topic.isLocked ? (
                    <div className="py-6 text-center text-xs font-sans text-muted space-y-1">
                      <Lock className="w-6 h-6 mx-auto text-muted mb-2" />
                      <p className="font-bold text-navy font-heading">SECURITY CLEARANCE REQUIRED</p>
                      <p>Complete earlier mission sectors to unlock access.</p>
                    </div>
                  ) : topic.challenges.length === 0 ? (
                    <div className="py-4 text-center text-xs font-sans text-muted">
                      Additional mission objectives deploying in Act II.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {topic.challenges.map((ch: Challenge) => {
                        const isSolved = user.completedChallengeIds.includes(ch.id);

                        return (
                          <div
                            key={ch.id}
                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-3 game-card-subtle ${
                              isSolved
                                ? 'bg-card-subtle border-green/40'
                                : 'bg-card border-border hover:border-purple'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs font-heading">
                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-extrabold border ${
                                  ch.difficulty === 'Beginner'
                                    ? 'bg-blue-100 text-sky border-sky/30 dark:bg-sky/20'
                                    : 'bg-amber-100 text-gold border-gold/30 dark:bg-gold/20'
                                }`}>
                                  {ch.difficulty}
                                </span>

                                <span className="text-green font-extrabold text-xs">
                                  +{ch.xpReward} RR
                                </span>
                              </div>

                              <h4 className="text-sm font-extrabold text-navy line-clamp-1 font-heading">
                                {ch.title}
                              </h4>
                              <p className="text-xs text-muted line-clamp-2 font-sans">
                                {ch.question}
                              </p>
                            </div>

                            <button
                              onClick={() => {
                                soundFx.lockIn();
                                onSelectChallenge(ch.id);
                              }}
                              onMouseEnter={() => soundFx.hoverTick()}
                              className={`w-full py-2.5 px-3 text-xs font-heading font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border-2 ${
                                isSolved
                                  ? 'game-btn game-btn-green text-white border-green'
                                  : 'game-btn game-btn-purple text-white border-purple'
                              }`}
                            >
                              {isSolved ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>RE-PLAY CHALLENGE</span>
                                </>
                              ) : (
                                <>
                                  <Crosshair className="w-3.5 h-3.5" />
                                  <span>START CHALLENGE</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      </div>

    </div>
  );
};
