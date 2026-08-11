'use client';

import { useEffect, useState } from 'react';
import { useQuestStore } from '@/stores/useQuestStore';

interface ChoiceOption {
  key: string;
  text: string;
  cardKey: string;
  cardName: string;
  cardDesc: string;
  itemReward?: string;
}

export default function DialogueOverlay() {
  const [revealedChoice, setRevealedChoice] = useState<ChoiceOption | null>(null);

  const { 
    isDialogueActive, 
    dialogueLines, 
    dialogueIndex, 
    nextDialogue,
    showChoices,
    selectChoice,
    quests,
    currentQuestKey,
    currentStepIndex
  } = useQuestStore();

  useEffect(() => {
    if (!isDialogueActive || showChoices) return;

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
  }, [isDialogueActive, showChoices, nextDialogue]);

  if (revealedChoice) {
    const cardImagePath = `/assets/stories/ghost-whisperer/cards/${revealedChoice.cardKey}.png`;
    
    return (
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/85 p-6 md:p-8 animate-fade-in pointer-events-auto select-none text-[#1E2922]">
        <div className="flex flex-col items-center max-w-sm w-full text-center">
          <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-950/60 border border-amber-800/40 px-3.5 py-1 rounded-full mb-5 animate-pulse">
            ✨ ปลดล็อกเบาะแสความลับสำรวจคืนนี้!
          </span>

          {/* The Card Component */}
          <div className="relative aspect-[3/4] w-52 md:w-60 rounded-3xl bg-gradient-to-br from-stone-900 to-stone-950 border-4 border-amber-400/40 p-4 shadow-2xl flex flex-col items-center justify-between text-white hover:scale-105 transition-all duration-300">
            {/* Card Frame Inner */}
            <div className="absolute inset-2.5 rounded-[18px] border border-amber-400/10 pointer-events-none" />
            
            {/* Card Title */}
            <div className="z-10 w-full text-center mt-2.5">
              <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                {revealedChoice.cardKey.includes('character') ? '👤 CHARACTER LOG' : '🎬 NARRATIVE CLUE'}
              </h4>
              <h3 className="text-xs font-black text-white mt-1 uppercase tracking-wide px-2 drop-shadow-md truncate">
                {revealedChoice.cardName}
              </h3>
            </div>

            {/* Card Illustration Frame */}
            <div className="z-10 w-full h-[45%] rounded-xl overflow-hidden bg-stone-900 border border-stone-800/50 flex items-center justify-center relative shadow-inner my-2">
              <img 
                src={cardImagePath} 
                alt={revealedChoice.cardName}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent && !parent.querySelector('.fallback-emoji')) {
                    const fallback = document.createElement('div');
                    fallback.className = "fallback-emoji flex flex-col items-center justify-center text-4xl";
                    fallback.innerHTML = `<span>🔮</span><span class="text-[8px] text-stone-500 font-black mt-2">ILLUSTRATION READY</span>`;
                    parent.appendChild(fallback);
                  }
                }}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Card Content & Rewards */}
            <div className="z-10 w-full px-2 text-center mb-3">
              <p className="text-[9px] text-stone-300 font-bold leading-relaxed line-clamp-3">
                {revealedChoice.cardDesc}
              </p>
              
              {/* Item Reward Notice */}
              {revealedChoice.itemReward && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-950/70 border border-emerald-900/60 px-3 py-1">
                  <span className="text-[8px] font-black text-emerald-400 uppercase tracking-wider">
                    ได้รับไอเทม: {revealedChoice.itemReward === 'amulet' ? '🌸 เครื่องรางป้องภัย' : revealedChoice.itemReward === 'fallen-fruit' ? '🍂 กิ๊บใบตองตานี' : revealedChoice.itemReward === 'wood' ? '🪵 แผ่นไม้' : '🌸 ของดีป่ากล้วย'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Wake up Action button */}
          <button
            onClick={() => {
              selectChoice(revealedChoice.key);
              setRevealedChoice(null);
            }}
            className="mt-6 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 px-8 py-3 text-xs font-black uppercase tracking-widest text-black shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all select-none"
          >
            ตื่นเช้าวันถัดไป ☀️
          </button>
        </div>
      </div>
    );
  }

  if (!isDialogueActive && !showChoices) return null;

  // Resolve choices if we are in choice mode
  const activeQuest = quests.find(q => q.key === currentQuestKey);
  const activeStep = activeQuest?.steps[currentStepIndex];
  const choices = activeStep?.choices;

  if (showChoices && choices && choices.length > 0) {
    return (
      <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60 p-6 md:p-8 animate-fade-in pointer-events-auto">
        <div className="mx-auto w-full max-w-2xl rounded-3xl border-2 border-[#C96E3A]/30 bg-[#FCFBF9] p-6 shadow-2xl text-[#1E2922] select-none">
          <div className="text-center mb-5">
            <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest bg-rose-50 px-3.5 py-1 rounded-full border border-rose-200">
              ⚠️ การตัดสินใจสำคัญในคืนนี้ (Narrative Decision)
            </span>
            <h3 className="mt-3 text-xs font-black text-[#2D4B32] leading-relaxed max-w-lg mx-auto">
              มีบางสิ่งเคลื่อนไหวอยู่กลางความมืดในสวนกล้วย... คุณตัดสินใจจะกระทำสิ่งใดต่อไป?
            </h3>
          </div>

          <div className="flex flex-col gap-2.5">
            {choices.map((choice) => (
              <button
                key={choice.key}
                onClick={() => setRevealedChoice(choice)}
                className="w-full text-left rounded-2xl border border-stone-250 bg-white hover:bg-amber-50 hover:border-[#C96E3A]/60 p-4 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-between group shadow-sm"
              >
                <div className="pr-4">
                  <h4 className="text-xs font-black text-stone-800 group-hover:text-[#C96E3A]">
                    ➔ {choice.text}
                  </h4>
                  <p className="text-[9px] text-stone-400 font-bold mt-1.5 uppercase tracking-wider flex items-center gap-1">
                    <span>ปลดล็อกเบาะแส:</span> 
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-extrabold">{choice.cardName}</span>
                  </p>
                </div>
                <span className="text-sm flex-shrink-0">🔮</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Normal Dialogue rendering
  if (dialogueLines.length === 0) return null;
  const currentLine = dialogueLines[dialogueIndex];
  if (!currentLine) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/45 p-6 md:p-8 animate-fade-in pointer-events-auto">
      {/* Dialogue box */}
      <div 
        onClick={nextDialogue}
        className="mx-auto w-full max-w-2xl cursor-pointer rounded-2xl border border-stone-200 bg-[#FCFBF9] p-5 shadow-xl flex gap-4 transition-all hover:bg-stone-50 text-[#1E2922] select-none animate-slide-up"
      >
        {/* Avatar Portrait Bubble */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-xl overflow-hidden shadow-inner">
          {currentLine.speaker === 'เรา' ? '👤' : currentLine.speaker === 'ผู้ใหญ่บ้านลุงแดง' ? '🧔' : '👻'}
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
