'use client';

import React, { useEffect } from 'react';
import { usePlayerStatsStore } from '@/stores/usePlayerStatsStore';
import { useInventoryStore } from '@/stores/useInventoryStore';
import { useParams } from 'next/navigation';
import { EventBus } from '@/game/EventBus';
import { useQuestStore } from '@/stores/useQuestStore';
import StatBar from './StatBar';

export default function StatsBar() {
  const hunger = usePlayerStatsStore((state) => state.hunger);
  const thirst = usePlayerStatsStore((state) => state.thirst);
  const health = usePlayerStatsStore((state) => state.health);
  const nickname = usePlayerStatsStore((state) => state.nickname);
  const setNickname = usePlayerStatsStore((state) => state.setNickname);
  const eatCoconut = usePlayerStatsStore((state) => state.eatCoconut);
  const coconutCount = useInventoryStore((state) => state.quantities.coconut ?? 0);
  const coins = useInventoryStore((state) => state.coins);

  const currentQuestKey = useQuestStore((state) => state.currentQuestKey);
  const currentStepIndex = useQuestStore((state) => state.currentStepIndex);
  const quests = useQuestStore((state) => state.quests);
  const activeQuest = quests.find(q => q.key === currentQuestKey);
  const activeStep = activeQuest?.steps[currentStepIndex];
  const isNight = activeStep?.phase === 'NIGHT';
  const level = Math.floor(currentStepIndex / 2) + 1;

  const quantities = useInventoryStore((state) => state.quantities);

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

  const getCozyAdvice = () => {
    const hasFlashlight = (quantities['flashlight'] ?? 0) > 0;
    const hasAmulet = (quantities['amulet'] ?? 0) > 0;
    const bananaCount = quantities['coconut'] ?? 0;
    const herbCount = quantities['night-herb'] ?? 0;

    // 1. Critical Health
    if (health <= 30) {
      return {
        text: "🚨 พลังชีวิตวิกฤต! รีบกดกินอาหารฟื้นฟู หรือคราฟต์ไฟฉาย 🔦 เพื่อช่วยมองเห็นและหลบหลีกผีร้าย",
        color: "text-rose-800 bg-rose-50 border-rose-200"
      };
    }

    // 2. Night Time Phase
    if (isNight) {
      if (!hasFlashlight) {
        return {
          text: "🔦 คืนนี้มืดมิด! แนะนำคราฟต์ไฟฉายตราเสือ (เมนูคราฟต์ล่างซ้าย) เพื่อขยายวงแสงนำทางและมองเห็นผีได้ง่ายขึ้น",
          color: "text-amber-800 bg-amber-50 border-amber-200"
        };
      }
      if (!hasAmulet) {
        return {
          text: "🌸 คำเตือน: มีผีร้ายวิญญาณเงาดำกำลังตามล่าคุณ! ไปร้านป้าศรีเพื่อซื้อ ยันต์แดงป้องภัย 🌸 ช่วยคุ้มครองลดความเสียหาย",
          color: "text-purple-800 bg-purple-50 border-purple-200"
        };
      }
      return {
        text: "🌿 วิ่งหลบหลีกวิญญาณเงาดำ แล้วหาจังหวะเก็บ ว่านตานีราตรี 🌿 ไปขายที่ร้านป้าศรีเพื่อรับเหรียญทองราคาสูง",
        color: "text-indigo-850 bg-indigo-50 border-indigo-200"
      };
    }

    // 3. Low Hunger / Thirst
    if (hunger <= 30 || thirst <= 30) {
      return {
        text: "🔋 พลังกายใกล้หมด! ไปร้านป้าศรีเพื่อซื้อ แว่น Y2K 🕶️ ช่วยชะลออัตราหิวลง 20% หรือกดดื่มชา/กินผลผลิตเติมพลัง",
        color: "text-amber-850 bg-amber-50 border-amber-200"
      };
    }

    // 4. Low Coins but has sellable items
    if (coins < 50 && (bananaCount > 0 || herbCount > 0)) {
      return {
        text: "🪙 เงินเหรียญทองเหลือน้อย? นำกล้วยน้ำว้า 🍌 หรือว่านราตรี 🌿 ไปขายที่ร้านป้าศรีเพื่อแลกเป็นเงินทุน",
        color: "text-emerald-800 bg-emerald-50 border-emerald-250"
      };
    }

    // 5. Default cozy game advice
    return {
      text: "💡 เคล็ดลับมู: คราฟต์สิ่งก่อสร้างหรือซื้ออุปกรณ์แฟชั่นเพื่อรับความสามารถในการเดินทางและคุ้มครองถาวร!",
      color: "text-stone-800 bg-stone-50 border-stone-200"
    };
  };

  return (
    <div className="pointer-events-auto absolute left-3 top-3 md:left-5 md:top-5 z-40 origin-top-left scale-[0.8] md:scale-100 flex items-start gap-3 select-none">
      
      {/* Left Column: Avatar & Coins */}
      <div className="flex flex-col items-center gap-2">
        {/* Avatar Frame with Level Badge */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 border-4 border-white shadow-lg flex items-center justify-center overflow-visible">
          {/* Survivor Face Emoji */}
          <span className="text-3xl">🧑‍🌾</span>
          
          {/* Level Badge Circle */}
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C96E3A] border-2 border-white text-white font-extrabold text-[8px] flex items-center justify-center shadow-md">
            {level}
          </span>
        </div>

        {/* Coins Badge Pill */}
        <div className="flex items-center gap-1 bg-white/95 border border-stone-200 px-2 py-0.5 rounded-full shadow-md text-[#C96E3A] font-mono text-[10px] font-black tracking-wide">
          <span>🪙</span>
          <span>{coins}</span>
        </div>
      </div>

      {/* Right Column: Profile Panel containing 3 stats bars */}
      <div className="flex flex-col gap-2.5 rounded-2xl border-2 border-[#2D4B32]/10 bg-white/90 backdrop-blur-md p-3.5 shadow-xl w-52 md:w-56 text-stone-850">
        {nickname && (
          <div className="text-stone-800 text-[10px] font-black border-b border-stone-150 pb-1 mb-0.5 tracking-wider truncate text-left">
            👤 ผู้รอดชีวิต: {nickname}
          </div>
        )}
        
        <div className="flex flex-col gap-2">
          <StatBar type="health" value={health} />
          <StatBar type="hunger" value={hunger} />
          <StatBar type="thirst" value={thirst} />
        </div>

        {/* Food Action Button */}
        <button
          type="button"
          onClick={(e) => {
            eatCoconut();
            e.currentTarget.blur();
          }}
          disabled={coconutCount <= 0}
          className="mt-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#2D4B32] hover:bg-[#1E3322] disabled:bg-stone-150 disabled:text-stone-400 py-1.5 text-[9px] font-black uppercase tracking-wider text-white shadow-sm transition-colors active:scale-95"
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
            className="flex items-center justify-center gap-1 rounded-xl border border-stone-205 bg-[#FCFBF9] hover:bg-stone-100 py-1 text-[9px] font-black text-stone-750 shadow-sm transition-colors active:scale-95"
          >
            🔍 ซูมกล้อง (2 ระยะ)
          </button>
        )}

        {/* Dynamic tutorial recommendation card */}
        {(() => {
          const advice = getCozyAdvice();
          return (
            <div className={`mt-2 p-2.5 rounded-xl border text-left text-[9px] leading-relaxed font-bold animate-fade-in shadow-inner ${advice.color}`}>
              {advice.text}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
