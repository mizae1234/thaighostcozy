'use client';

import React, { useState, useEffect } from 'react';
import { useQuestStore } from '@/stores/useQuestStore';
import { useInventoryStore } from '@/stores/useInventoryStore';
import { useContentStore } from '@/stores/useContentStore';

// Pla Boo Thong static fallback dictionaries
const PLA_BOO_STEP_TITLES: Record<string, string> = {
  'washed-ashore': 'ภารกิจที่ 1: ฟื้นฟูร่างกายหลังคลื่นซัด',
  'well-song': 'ภารกิจที่ 2: ตามหาบ่อน้ำศักดิ์สิทธิ์',
  'goby-revealed': 'ภารกิจที่ 3: สื่อสารกับปลาบู่ทอง',
  'collect-three-treasures': 'ภารกิจที่ 4: ออกตามหาของวิเศษ 3 อย่าง',
  'lift-the-curse': 'ภารกิจที่ 5: ปลดปล่อยวิญญาณปลาบู่ทอง',
};

const PLA_BOO_HINTS: Record<string, string> = {
  'washed-ashore': '💡 คำแนะนำ: เดินเก็บลังไม้ 5 ชิ้น และมะพร้าว 2 ลูกตามชายหาด จากนั้นเปิดเมนูคราฟต์ด้านซ้ายเพื่อสร้างกองไฟ',
  'well-song': '💡 คำแนะนำ: เดินไปทางขวาบนเพื่อตามหาบ่อน้ำโบราณใจกลางเกาะ และเก็บลูกไม้สีเขียว 3 ลูกที่ตกอยู่รอบบ่อน้ำ',
  'goby-revealed': '💡 คำแนะนำ: ยืนใกล้ปลาบู่ทองสีทองเหนือบ่อน้ำ แล้วกดปุ่ม Space เพื่อพูดคุย',
  'collect-three-treasures': '💡 คำแนะนำ: คราฟต์มีดจากเมนูซ้ายล่าง จากนั้นเดินหาของวิเศษ 3 อย่าง: ดอกไม้ทางเหนือ, เปลือกหอยทางหาดทรายซ้าย, และสับไม้จันทน์ทางทิศใต้ (ต้องมีมีด)',
  'lift-the-curse': '💡 คำแนะนำ: นำของวิเศษทั้ง 3 อย่างไปคุยกับปลาบู่ทองที่บ่อน้ำโบราณเพื่อปลดคำสาป!',
};

export default function QuestTracker() {
  const { currentQuestKey, currentStepIndex, quests, reachedLocations, talkedNPCs, placedBuildings, isEpisodeEnd, showChoices } = useQuestStore();
  const { quantities: inventory } = useInventoryStore();

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 1024;
      setIsCollapsed(isMobile);
    }
  }, []);

  if (isEpisodeEnd || !currentQuestKey || quests.length === 0) return null;

  const quest = quests.find(q => q.key === currentQuestKey);
  if (!quest) return null;

  const activeStep = quest.steps[currentStepIndex];
  if (!activeStep) return null;

  // Determine current slug from window path
  const slug = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : 'pla-boo-thong';
  const isGhostMode = slug === 'ghost-whisperer';

  // Get localized step titles and hints
  const stepTitle = activeStep.title || activeStep.key;
  
  const stepHint = isGhostMode
    ? (activeStep.phase === 'NIGHT' 
        ? '💡 คำแนะนำ: จบการพูดคุยหน้าต่างขวาเพื่อเลือกเส้นทางการตัดสินใจในค่ำคืนนี้' 
        : '💡 คำแนะนำ: ทำภารกิจการจัดการสวนด้านล่างให้ครบเพื่อจบวัน')
    : (PLA_BOO_HINTS[activeStep.key] || '');

  const phaseBadgeText = activeStep.phase === 'DAY' ? '☀️ กลางวัน' : '🌙 กลางคืน';
  const phaseBadgeColor = activeStep.phase === 'DAY' 
    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
    : 'bg-purple-500/20 text-purple-300 border-purple-500/30';

  if (isCollapsed) {
    return (
      <div className="pointer-events-auto absolute left-2 top-[110px] md:top-[160px] z-40 origin-top-left scale-[0.75] md:scale-100 select-none">
        <button
          onClick={() => setIsCollapsed(false)}
          className="bg-[#5c3a2a]/95 hover:bg-[#482c1f] border border-[#C96E3A]/45 rounded-full px-4 py-2 text-xs font-black text-[#FCFBF9] shadow-lg flex items-center gap-1.5 active:scale-95 transition-all"
        >
          📌 <span>เควสต์</span>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute left-2 top-[110px] md:left-5 md:top-[245px] z-40 w-64 rounded-xl bg-[#5c3a2a]/95 p-4 text-white shadow-xl backdrop-blur-sm transition-all md:w-72 border border-[#C96E3A]/20 select-none origin-top-left scale-[0.65] md:scale-100">
      <button
        onClick={() => setIsCollapsed(true)}
        className="absolute top-2 right-2 text-[#FCFBF9]/60 hover:text-white font-bold text-[9px] p-1 select-none pointer-events-auto"
      >
        ➖ ซ่อน
      </button>
      {/* Header */}
      <div className="mb-2.5 border-b border-[#C96E3A]/20 pb-2 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-[#FCFBF9]/90 flex items-center gap-1">
            🔖 Current Objective
          </h3>
          {isGhostMode ? (
            <div className="flex items-center gap-1 flex-wrap justify-end">
              <span className="text-[8px] font-black px-1.5 py-0.5 rounded border border-emerald-500/20 bg-emerald-950/60 text-emerald-300 uppercase tracking-wider select-none">
                📅 วันที่ {Math.floor(currentStepIndex / 2) + 1}/7
              </span>
              {activeStep.phase && (
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider ${phaseBadgeColor}`}>
                  {phaseBadgeText}
                </span>
              )}
            </div>
          ) : null}
        </div>
        <p className="text-xs font-bold text-[#FCFBF9]/80 leading-snug">{stepTitle}</p>
      </div>

      {/* Objectives List */}
      {activeStep.objectives && activeStep.objectives.length > 0 ? (
        <ul className="space-y-2">
          {activeStep.objectives.map((obj, i) => {
            let currentVal = 0;
            const targetVal = obj.quantity ?? 1;
            let label = '';
            let isDone = false;

            // Resolve target name dynamically from database items
            const dbItem = useContentStore.getState().getItem(obj.targetKey);
            let targetName = dbItem ? dbItem.name : obj.targetKey;

            // If it is not an item, fallback to custom localization
            if (!dbItem) {
              if (obj.targetKey === 'well') {
                targetName = isGhostMode ? 'บ่อน้ำโบราณท้ายสวน' : 'บ่อน้ำโบราณ';
              } else if (obj.targetKey === 'golden-goby') {
                targetName = isGhostMode ? 'นางตานี' : 'แม่ปลาบู่ทอง';
              }
            }

            if (obj.type === 'COLLECT') {
              currentVal = inventory[obj.targetKey] || 0;
              isDone = currentVal >= targetVal;
              label = `เก็บ ${targetName}`;
            } else if (obj.type === 'CRAFT') {
              currentVal = placedBuildings[obj.targetKey] || 0;
              isDone = currentVal >= targetVal;
              label = `สร้าง ${targetName}`;
            } else if (obj.type === 'REACH_LOCATION') {
              isDone = !!reachedLocations[obj.targetKey];
              label = `เดินทางไปที่ ${targetName}`;
            } else if (obj.type === 'TALK_TO') {
              isDone = !!talkedNPCs[obj.targetKey];
              label = `พูดคุยกับ ${targetName}`;
            }

            return (
              <li 
                key={i} 
                className={`flex items-start justify-between text-xs transition-colors ${
                  isDone ? 'text-[#FCFBF9]/40 line-through' : 'text-[#FCFBF9]/90'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 text-xs select-none">
                    {isDone ? '✅' : '⚪'}
                  </span>
                  <span className="font-semibold">{label}</span>
                </div>
                
                {/* Show quantity only for COLLECT and CRAFT */}
                {(obj.type === 'COLLECT' || obj.type === 'CRAFT') && (
                  <span className={`font-mono text-xs ${isDone ? 'text-[#FCFBF9]/40' : 'text-[#C96E3A] font-black'}`}>
                    {currentVal}/{targetVal}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="py-1 text-xs font-semibold text-[#FCFBF9]/90 text-left">
          {showChoices ? (
            <span className="text-amber-400">🔮 กรุณาตัดสินใจเลือกทางเลือกบนจอ</span>
          ) : (
            <span>📢 รออ่านบทสนทนาขวาล่าง...</span>
          )}
        </div>
      )}

      {/* Guidance / Hint Box */}
      {stepHint && (
        <div className="mt-3 border-t border-[#C96E3A]/20 pt-2 text-[10px] leading-relaxed text-[#FCFBF9]/70 font-semibold italic">
          {stepHint}
        </div>
      )}
    </div>
  );
}
