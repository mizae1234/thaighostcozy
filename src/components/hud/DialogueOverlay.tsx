'use client';

import { useEffect } from 'react';
import { useQuestStore } from '@/stores/useQuestStore';

export default function DialogueOverlay() {
  const { isDialogueActive, dialogueLines, dialogueIndex, nextDialogue } = useQuestStore();

  useEffect(() => {
    if (!isDialogueActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        nextDialogue();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isDialogueActive, nextDialogue]);

  if (!isDialogueActive || dialogueLines.length === 0) return null;

  const currentLine = dialogueLines[dialogueIndex];
  if (!currentLine) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/45 p-6 md:p-8 animate-fade-in pointer-events-auto">
      {/* Dialogue box */}
      <div 
        onClick={nextDialogue}
        className="mx-auto w-full max-w-2xl cursor-pointer rounded-2xl border border-stone-200 bg-[#FCFBF9] p-5 shadow-xl flex gap-4 transition-all hover:bg-stone-50 text-[#1E2922] select-none"
      >
        {/* Avatar Portrait Bubble */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-xl overflow-hidden shadow-inner">
          {currentLine.speaker === 'เรา' ? '👤' : '👻'}
        </div>

        {/* Text Container */}
        <div className="flex-grow flex flex-col justify-center">
          {/* Header/Speaker name */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#C96E3A] uppercase tracking-widest">
              {currentLine.speaker}
            </span>
            <span className="text-[10px] text-stone-400 uppercase tracking-widest font-mono">
              {dialogueIndex + 1} / {dialogueLines.length}
            </span>
          </div>

          {/* Thai Dialogue Message */}
          <p className="mt-1 text-xs font-bold text-[#1E2922] leading-relaxed min-h-[32px]">
            &ldquo;{currentLine.thai}&rdquo;
          </p>

          {/* Press to continue notice */}
          <div className="mt-2 flex justify-end items-center gap-1 text-[9px] font-black text-stone-400 uppercase tracking-widest">
            <span>PRESS SPACEBAR OR CLICK TO CONTINUE</span>
            <svg 
              className="h-2 w-2 fill-current transform translate-y-0.5" 
              viewBox="0 0 24 24"
            >
              <path d="M12 21l-12-18h24z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
