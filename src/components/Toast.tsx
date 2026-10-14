import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Sparkles, Award, Crown, Crosshair } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0 font-mono">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onDismiss(toast.id)}
            className="pointer-events-auto cursor-pointer rounded-2xl bg-card text-navy shadow-xl border-2 border-border flex items-center gap-3.5 p-3.5 border-l-4 border-l-purple"
          >
            {toast.type === 'rankup' ? (
              <div className="w-9 h-9 rounded-xl bg-gold/20 border-2 border-gold flex items-center justify-center text-gold shrink-0 font-bold text-xs shadow-xs">
                <Crown className="w-5 h-5" />
              </div>
            ) : toast.type === 'xp' ? (
              <div className="w-9 h-9 rounded-xl bg-green/20 border-2 border-green flex items-center justify-center text-green shrink-0 font-bold text-xs shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
            ) : toast.type === 'level' ? (
              <div className="w-9 h-9 rounded-xl bg-gold/20 border-2 border-gold flex items-center justify-center text-gold shrink-0 font-bold text-xs shadow-xs">
                <Award className="w-5 h-5" />
              </div>
            ) : toast.type === 'success' ? (
              <div className="w-9 h-9 rounded-xl bg-green/20 border-2 border-green flex items-center justify-center text-green shrink-0 shadow-xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-purple/20 border-2 border-purple flex items-center justify-center text-purple shrink-0 shadow-xs">
                <AlertCircle className="w-5 h-5" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-navy truncate font-heading">{toast.title}</p>
                {toast.xpAmount && (
                  <span className="text-xs font-bold text-green shrink-0 tabular-nums">
                    +{toast.xpAmount} XP
                  </span>
                )}
              </div>
              {toast.description && (
                <p className="text-xs text-muted truncate mt-0.5 font-sans">{toast.description}</p>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
