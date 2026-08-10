'use client';

import { useInteractionStore } from '@/stores/useInteractionStore';

export default function InteractionPrompt() {
  const { promptText, promptType } = useInteractionStore();

  if (!promptText) return null;

  // Decide coloring based on promptType
  let borderClass = 'border-amber-700/60 bg-amber-950/85';
  let textClass = 'text-amber-100';
  let badgeClass = 'bg-amber-800 text-amber-100';

  if (promptType === 'warning') {
    borderClass = 'border-red-600/70 bg-red-950/85 animate-shake';
    textClass = 'text-red-100 font-bold';
    badgeClass = 'bg-red-800 text-red-100';
  } else if (promptType === 'talk') {
    borderClass = 'border-yellow-500/70 bg-slate-900/90 shadow-[0_0_15px_rgba(234,179,8,0.25)]';
    textClass = 'text-yellow-100';
    badgeClass = 'bg-yellow-600 text-black font-extrabold';
  } else if (promptType === 'harvest') {
    borderClass = 'border-green-600/60 bg-slate-900/90';
    textClass = 'text-green-100';
    badgeClass = 'bg-green-600 text-black font-bold';
  }

  return (
    <div className="absolute bottom-24 left-1/2 z-40 w-auto -translate-x-1/2 transform px-4 animate-fade-in">
      <div 
        className={`flex items-center gap-3 rounded-full border-2 px-4 py-2 shadow-2xl backdrop-blur-md transition-all ${borderClass}`}
      >
        {/* Interaction key indicator */}
        {promptType !== 'warning' && promptType !== 'info' && (
          <span className={`rounded px-1.5 py-0.5 text-[10px] uppercase font-bold font-mono tracking-widest ${badgeClass}`}>
            SPACE
          </span>
        )}
        {promptType === 'info' && (
          <span className="text-xs">💡</span>
        )}
        {promptType === 'warning' && (
          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${badgeClass}`}>
            ⚠
          </span>
        )}

        {/* Message */}
        <span className={`text-xs md:text-sm tracking-wide font-normal ${textClass}`}>
          {promptText}
        </span>
      </div>
    </div>
  );
}
