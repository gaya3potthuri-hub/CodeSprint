import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ArrowBigUp, Zap } from 'lucide-react';
import { soundFx } from '../../services/soundFx';

interface VirtualControlsProps {
  onMoveChange: (x: number, y: number) => void;
  onJump: () => void;
  onInteract?: () => void;
  hasNearbyNode: boolean;
}

export const VirtualControls: React.FC<VirtualControlsProps> = ({
  onMoveChange,
  onJump,
  onInteract,
  hasNearbyNode
}) => {
  return (
    <div className="fixed bottom-6 left-6 z-30 flex items-end gap-4 pointer-events-none select-none">
      {/* On-screen Directional Pad */}
      <div className="p-2.5 bg-card/95 backdrop-blur-md rounded-2xl border-2 border-border game-card pointer-events-auto flex flex-col items-center gap-1.5">
        <button
          onMouseDown={() => onMoveChange(0, -1)}
          onMouseUp={() => onMoveChange(0, 0)}
          onTouchStart={() => onMoveChange(0, -1)}
          onTouchEnd={() => onMoveChange(0, 0)}
          className="w-11 h-11 rounded-xl game-btn game-btn-card border-2 border-border text-navy active:text-purple flex items-center justify-center transition-all cursor-pointer"
          aria-label="Move Forward"
        >
          <ArrowUp className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onMouseDown={() => onMoveChange(-1, 0)}
            onMouseUp={() => onMoveChange(0, 0)}
            onTouchStart={() => onMoveChange(-1, 0)}
            onTouchEnd={() => onMoveChange(0, 0)}
            className="w-11 h-11 rounded-xl game-btn game-btn-card border-2 border-border text-navy active:text-purple flex items-center justify-center transition-all cursor-pointer"
            aria-label="Move Left"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onMouseDown={() => onMoveChange(0, 1)}
            onMouseUp={() => onMoveChange(0, 0)}
            onTouchStart={() => onMoveChange(0, 1)}
            onTouchEnd={() => onMoveChange(0, 0)}
            className="w-11 h-11 rounded-xl game-btn game-btn-card border-2 border-border text-navy active:text-purple flex items-center justify-center transition-all cursor-pointer"
            aria-label="Move Backward"
          >
            <ArrowDown className="w-5 h-5" />
          </button>

          <button
            onMouseDown={() => onMoveChange(1, 0)}
            onMouseUp={() => onMoveChange(0, 0)}
            onTouchStart={() => onMoveChange(1, 0)}
            onTouchEnd={() => onMoveChange(0, 0)}
            className="w-11 h-11 rounded-xl game-btn game-btn-card border-2 border-border text-navy active:text-purple flex items-center justify-center transition-all cursor-pointer"
            aria-label="Move Right"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Action Buttons: Jump + Interact */}
      <div className="flex items-center gap-2 pointer-events-auto font-heading">
        <button
          onClick={() => {
            soundFx.click();
            onJump();
          }}
          className="w-13 h-13 rounded-2xl game-btn game-btn-purple text-white border-2 border-purple flex flex-col items-center justify-center transition-all font-heading font-extrabold text-[10px] cursor-pointer"
          title="Jump [ Space ]"
        >
          <ArrowBigUp className="w-5 h-5" />
          <span>JUMP</span>
        </button>

        {hasNearbyNode && onInteract && (
          <button
            onClick={() => {
              soundFx.lockIn();
              onInteract();
            }}
            className="px-4 h-13 rounded-2xl game-btn game-btn-green text-white border-2 border-green flex items-center gap-2 font-heading font-extrabold text-xs cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>EXAMINE [ E ]</span>
          </button>
        )}
      </div>
    </div>
  );
};
