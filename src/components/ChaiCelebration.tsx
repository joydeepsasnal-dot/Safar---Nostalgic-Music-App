import React from 'react';
import { Coffee, Heart } from 'lucide-react';

interface ChaiCelebrationProps {
  show: boolean;
  onClose: () => void;
  count: number;
  message: string;
}

export const ChaiCelebration: React.FC<ChaiCelebrationProps> = ({
  show,
  onClose,
  count,
  message,
}) => {
  if (!show) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-28 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-2xl border border-amber-500/40 bg-neutral-900/95 px-5 py-3 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300 text-white"
    >
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
        <Coffee className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          <Heart className="h-2.5 w-2.5 fill-white" />
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-xs font-bold text-amber-400">☕ {message}</span>
        <span className="text-[11px] text-white/70">
          Chai Cups Served: <span className="font-mono-code font-bold text-white">{count}</span>
        </span>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss tea toast"
        className="ml-2 rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white text-xs"
      >
        ✕
      </button>
    </div>
  );
};
