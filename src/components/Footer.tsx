import React from 'react';
import { ViewState } from '../types';
import { Crosshair } from 'lucide-react';
import { soundFx } from '../services/soundFx';

interface FooterProps {
  onNavigate: (view: ViewState, pathId?: 'python' | 'sql' | 'web-dev') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-card border-t-2 border-border text-muted text-xs py-12 font-sans transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-10 border-b-2 border-border">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple border-2 border-purple-dark flex items-center justify-center text-white shadow-[0_2px_0_var(--game-purple-dark)]">
                <Crosshair className="w-4 h-4" />
              </div>
              <span className="text-base font-extrabold text-navy tracking-wide font-heading">
                CODE<span className="text-purple">SPRINT</span>
              </span>
            </div>
            <p className="text-muted max-w-sm leading-relaxed text-xs">
              Gamified technology education. Master Python, SQL, Java, and AI through bite-sized interactive challenges, progressive island checkpoints, and real progress-based ranks.
            </p>
            <div className="text-[11px] text-muted opacity-80">
              © {new Date().getFullYear()} CODESPRINT. ALL RIGHTS RESERVED.
            </div>
          </div>

          {/* Links Col 1: Platform */}
          <div>
            <h4 className="font-heading font-bold text-navy mb-3 text-sm tracking-wide">PLATFORM</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    soundFx.click();
                    onNavigate('dashboard');
                  }}
                  onMouseEnter={() => soundFx.hoverTick()}
                  className="hover:text-purple transition-colors text-left cursor-pointer font-bold"
                >
                  DASHBOARD
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    soundFx.click();
                    onNavigate('paths');
                  }}
                  onMouseEnter={() => soundFx.hoverTick()}
                  className="hover:text-green transition-colors text-left cursor-pointer font-bold"
                >
                  CHALLENGES
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    soundFx.click();
                    onNavigate('progress');
                  }}
                  onMouseEnter={() => soundFx.hoverTick()}
                  className="hover:text-purple transition-colors text-left cursor-pointer font-bold"
                >
                  LEARNING ANALYTICS
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    soundFx.click();
                    onNavigate('leaderboard');
                  }}
                  onMouseEnter={() => soundFx.hoverTick()}
                  className="hover:text-gold transition-colors text-left cursor-pointer font-bold"
                >
                  LEADERBOARD
                </button>
              </li>
            </ul>
          </div>

          {/* Links Col 2: Learning Paths */}
          <div>
            <h4 className="font-heading font-bold text-navy mb-3 text-sm tracking-wide">ISLANDS</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    soundFx.click();
                    onNavigate('path-detail', 'python');
                  }}
                  onMouseEnter={() => soundFx.hoverTick()}
                  className="hover:text-green transition-colors text-left font-bold"
                >
                  PYTHON ISLE
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    soundFx.click();
                    onNavigate('path-detail', 'sql');
                  }}
                  onMouseEnter={() => soundFx.hoverTick()}
                  className="hover:text-sky transition-colors text-left font-bold"
                >
                  SQL ARCHIPELAGO
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    soundFx.click();
                    onNavigate('path-detail', 'web-dev');
                  }}
                  onMouseEnter={() => soundFx.hoverTick()}
                  className="hover:text-gold transition-colors text-left font-bold"
                >
                  WEB CASTLE
                </button>
              </li>
            </ul>
          </div>

          {/* Links Col 3: Resources */}
          <div>
            <h4 className="font-heading font-bold text-navy mb-3 text-sm tracking-wide">EXPLORER</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    soundFx.click();
                    onNavigate('profile');
                  }}
                  onMouseEnter={() => soundFx.hoverTick()}
                  className="hover:text-purple transition-colors text-left font-bold"
                >
                  EXPLORER PROFILE
                </button>
              </li>
              <li>
                <span className="text-muted/60 cursor-default">ACHIEVEMENT BADGES</span>
              </li>
              <li>
                <span className="text-muted/60 cursor-default">COMMUNITY RULES</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div className="flex items-center gap-2">
            <span>ENGINEERED FOR HIGH-OCTANE STUDENT MASTERY.</span>
          </div>
          <div className="flex items-center gap-4 font-bold">
            <span className="text-green">ONLINE: READY</span>
            <span>·</span>
            <span>GAME AUDIO ENABLED</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
