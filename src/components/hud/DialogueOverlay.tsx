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

  // Decide speaker styling
  const isPlayer = currentLine.speaker === 'เรา';
  const speakerColor = isPlayer ? 'text-amber-300' : 'text-yellow-400 font-extrabold drop-shadow';

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/45 p-6 md:p-8 animate-fade-in">
      {/* Dialogue box */}
      <div 
        onClick={nextDialogue}
        className="mx-auto w-full max-w-3xl cursor-pointer rounded-2xl border-4 border-amber-900 bg-amber-950/90 p-5 shadow-2xl backdrop-blur-md transition-all hover:border-amber-700 hover:bg-amber-950/95"
        style={{
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.7), inset 0 2px 4px 0 rgb(255 255 255 / 0.1)',
        }}
      >
        {/* Speaker Name Tag */}
        <div className="mb-2 flex items-center justify-between border-b-2 border-amber-900/50 pb-2">
          <span className={`text-lg font-bold tracking-wide uppercase ${speakerColor}`}>
            {currentLine.speaker}
          </span>
          <span className="text-xs text-amber-500/80 uppercase tracking-widest font-mono">
            {dialogueIndex + 1} / {dialogueLines.length}
          </span>
        </div>

        {/* Message Content */}
        <div className="min-h-16 text-base md:text-lg leading-relaxed text-amber-100 font-normal">
          {currentLine.thai}
        </div>

        {/* Next Indicator */}
        <div className="mt-3 flex justify-end">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500 animate-pulse">
            <span>กด Spacebar หรือคลิกเพื่ออ่านต่อ</span>
            <svg 
              className="h-3 w-3 fill-current transform translate-y-0.5" 
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
