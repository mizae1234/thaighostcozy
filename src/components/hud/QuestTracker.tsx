'use client';

import { useQuestStore } from '@/stores/useQuestStore';
import { useInventoryStore } from '@/stores/useInventoryStore';
import { useContentStore } from '@/stores/useContentStore';

const STEP_THAI_TITLES: Record<string, string> = {
  'washed-ashore': 'ภารกิจที่ 1: ฟื้นฟูร่างกายหลังคลื่นซัด',
  'well-song': 'ภารกิจที่ 2: ตามหาบ่อน้ำศักดิ์สิทธิ์',
  'goby-revealed': 'ภารกิจที่ 3: สื่อสารกับปลาบู่ทอง',
  'collect-three-treasures': 'ภารกิจที่ 4: ออกตามหาของวิเศษ 3 อย่าง',
  'lift-the-curse': 'ภารกิจที่ 5: ปลดปล่อยวิญญาณปลาบู่ทอง',
};

const STEP_HINTS: Record<string, string> = {
  'washed-ashore': '💡 คำแนะนำ: เดินเก็บลังไม้ 5 ชิ้น และมะพร้าว 2 ลูกตามชายหาด จากนั้นเปิดเมนูคราฟต์ด้านซ้ายเพื่อสร้างกองไฟ',
  'well-song': '💡 คำแนะนำ: เดินไปทางขวาบนเพื่อตามหาบ่อน้ำโบราณใจกลางเกาะ และเก็บลูกไม้สีเขียว 3 ลูกที่ตกอยู่รอบบ่อน้ำ',
  'goby-revealed': '💡 คำแนะนำ: ยืนใกล้ปลาบู่ทองสีทองเหนือบ่อน้ำ แล้วกดปุ่ม Space เพื่อพูดคุย',
  'collect-three-treasures': '💡 คำแนะนำ: คราฟต์มีดจากเมนูซ้ายล่าง จากนั้นเดินหาของวิเศษ 3 อย่าง: ดอกไม้ทางเหนือ, เปลือกหอยทางหาดทรายซ้าย, และสับไม้จันทน์ทางทิศใต้ (ต้องมีมีด)',
  'lift-the-curse': '💡 คำแนะนำ: นำของวิเศษทั้ง 3 อย่างไปคุยกับปลาบู่ทองที่บ่อน้ำโบราณเพื่อปลดคำสาป!',
};

const TARGET_THAI_NAMES: Record<string, string> = {
  'wood': 'ลังไม้',
  'coconut': 'มะพร้าว',
  'stone': 'ก้อนหิน',
  'campfire': 'กองไฟ',
  'well': 'บ่อน้ำโบราณ',
  'golden-goby': 'ปลาบู่ทอง',
  'fallen-fruit': 'ลูกไม้ร่วงหล่น',
  'sacred-flower': 'ดอกไม้ศักดิ์สิทธิ์',
  'pearl-shell': 'เปลือกหอยมุก',
  'sandalwood': 'ไม้จันทน์',
};

export default function QuestTracker() {
  const { currentQuestKey, currentStepIndex, quests, reachedLocations, talkedNPCs, placedBuildings, isEpisodeEnd } = useQuestStore();
  const { quantities: inventory } = useInventoryStore();

  if (isEpisodeEnd || !currentQuestKey || quests.length === 0) return null;

  const quest = quests.find(q => q.key === currentQuestKey);
  if (!quest) return null;

  const activeStep = quest.steps[currentStepIndex];
  if (!activeStep) return null;

  const stepTitle = STEP_THAI_TITLES[activeStep.key] || activeStep.key;
  const stepHint = STEP_HINTS[activeStep.key] || '';

  return (
    <div className="absolute left-4 top-36 z-40 w-64 rounded-2xl border-2 border-amber-900/60 bg-amber-950/80 p-4 text-amber-100 shadow-xl backdrop-blur-md transition-all md:w-72">
      {/* Header */}
      <div className="mb-2.5 border-b border-amber-800/60 pb-2">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">ภารกิจหลัก: ตามหาปลาบู่ทอง</h3>
        <p className="text-sm font-bold text-amber-200 mt-0.5">{stepTitle}</p>
      </div>

      {/* Objectives List */}
      <ul className="space-y-2">
        {activeStep.objectives.map((obj, i) => {
          let currentVal = 0;
          let targetVal = obj.quantity ?? 1;
          let label = '';
          let isDone = false;

          const targetName = TARGET_THAI_NAMES[obj.targetKey] || obj.targetKey;

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
                isDone ? 'text-amber-500/60 line-through' : 'text-amber-200'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-xs">
                  {isDone ? '✅' : '⚪'}
                </span>
                <span className="font-medium">{label}</span>
              </div>
              
              {/* Show quantity only for COLLECT and CRAFT */}
              {(obj.type === 'COLLECT' || obj.type === 'CRAFT') && (
                <span className={`font-mono text-xs ${isDone ? 'text-amber-500/60' : 'text-amber-300 font-bold'}`}>
                  {currentVal}/{targetVal}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {/* Guidance / Hint Box */}
      {stepHint && (
        <div className="mt-3 border-t border-amber-900/50 pt-2 text-[10px] md:text-xs leading-relaxed text-yellow-400/90 font-medium">
          {stepHint}
        </div>
      )}
    </div>
  );
}
