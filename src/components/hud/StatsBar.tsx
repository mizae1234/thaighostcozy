'use client';

import React, { useEffect } from 'react';
import { usePlayerStatsStore } from '@/stores/usePlayerStatsStore';
import { useInventoryStore } from '@/stores/useInventoryStore';
import { useParams } from 'next/navigation';
import { EventBus } from '@/game/EventBus';
import { useQuestStore } from '@/stores/useQuestStore';
import StatBar from './StatBar';
import PanelFrame from './PanelFrame';

export default function StatsBar() {
  const hunger = usePlayerStatsStore((state) => state.hunger);
  const thirst = usePlayerStatsStore((state) => state.thirst);
  const nickname = usePlayerStatsStore((state) => state.nickname);
  const setNickname = usePlayerStatsStore((state) => state.setNickname);
  const eatCoconut = usePlayerStatsStore((state) => state.eatCoconut);
  const coconutCount = useInventoryStore((state) => state.quantities.coconut ?? 0);

  const currentStepIndex = useQuestStore((state) => state.currentStepIndex);
  const level = Math.floor(currentStepIndex / 2) + 1;

  const params = useParams();
  const slug = params?.slug;
  const isGhostMode = slug === 'ghost-whisperer';
  
  useEffect(() => {
    if (!nickname && typeof window !== 'undefined') {
      const stored = localStorage.getItem('thaighost_nickname');
      if (stored) {
        setNickname(stored);
      }
    }
  }, [nickname, setNickname]);

  const buttonLabel = isGhostMode 
    ? `🍵 ดื่มชาใบตอง (${coconutCount})` 
    : `🥥 กินมะพร้าว (${coconutCount})`;

  return (
    <div className="pointer-events-auto absolute left-2 top-2 md:left-5 md:top-5 w-64 md:w-72 origin-top-left scale-[0.65] md:scale-100">
      <PanelFrame>
        <div className="flex flex-col gap-2">
          {nickname && (
            <div className="text-stone-800 text-xs font-black border-b border-stone-150 pb-1 mb-0.5 tracking-wider flex justify-between items-center">
              <span>👤 ผู้รอดชีวิต: {nickname}</span>
              <span className="text-[#C96E3A] font-extrabold bg-[#C96E3A]/10 px-2 py-0.5 rounded-full text-[9px] border border-[#C96E3A]/20">Lv.{level}</span>
            </div>
          )}
          <StatBar type="hunger" value={hunger} />
          <StatBar type="thirst" value={thirst} />
          <button
            type="button"
            onClick={(e) => {
              eatCoconut();
              e.currentTarget.blur();
            }}
            disabled={coconutCount <= 0}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-[#2D4B32] hover:bg-[#1E3322] px-3 py-1.5 text-xs font-bold text-white transition-colors disabled:cursor-not-allowed disabled:bg-stone-150 disabled:text-stone-400"
          >
            {buttonLabel}
          </button>
          
          {isGhostMode && (
            <button
              type="button"
              onClick={(e) => {
                EventBus.emit('toggle-camera-zoom', undefined);
                e.currentTarget.blur();
              }}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-stone-300 bg-[#FCFBF9] hover:bg-stone-100 px-3 py-1.5 text-xs font-bold text-stone-800 transition-colors"
            >
              🔍 ซูมกล้อง (2 ระยะ)
            </button>
          )}
        </div>
      </PanelFrame>
    </div>
  );
}
