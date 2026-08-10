'use client';

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

// Ghost Whisperer static fallback dictionaries
const GHOST_STEP_TITLES: Record<string, string> = {
  'washed-ashore': 'ภารกิจที่ 1: อัญเชิญศาลพระภูมิมินิมอล',
  'well-song': 'ภารกิจที่ 2: ตามหากิ๊บหนีบผมตานี',
  'goby-revealed': 'ภารกิจที่ 3: บำบัดจิตใจนางตานี',
  'collect-three-treasures': 'ภารกิจที่ 4: ตามหาของมงคล 3 อย่าง',
  'lift-the-curse': 'ภารกิจที่ 5: ผูกมิตรภาพนิรันดร์',
};

const GHOST_HINTS: Record<string, string> = {
  'washed-ashore': '💡 คำแนะนำ: เดินเก็บไม้บอร์ดมูจิ 5 ชิ้น และชาใบตอง 2 ถ้วย จากนั้นเปิดเมนูคราฟต์ด้านซ้ายเพื่อสร้างศาลพระภูมิมูจิ',
  'well-song': '💡 คำแนะนำ: เดินไปทางขวาบนเพื่อตามหาบ่อน้ำโบราณในป่ากล้วย และเก็บกิ๊บหนีบผมใบตอง 3 อันที่ร่วงอยู่รอบบ่อน้ำ',
  'goby-revealed': '💡 คำแนะนำ: ยืนใกล้บ่อน้ำโบราณ แล้วกดปุ่ม Space เพื่อพูดคุยช่วยเหลือระบายความเครียดให้นางตานี',
  'collect-three-treasures': '💡 คำแนะนำ: คราฟต์มีดหมอมัสตาร์ดจากเมนูซ้ายล่าง จากนั้นเดินหาของมงคล 3 อย่าง: ดอกไม้บำบัดทางเหนือ, เปลือกหอยเรโทรทางหาดซ้าย, และสับไม้จันทน์มูเตลูทางทิศใต้ (ต้องใช้มีดหมอ)',
  'lift-the-curse': '💡 คำแนะนำ: นำของมงคลทั้ง 3 อย่างไปคุยพิธีกับนางตานีที่บ่อน้ำโบราณเพื่อปลดล็อกมิตรภาพนิรันดร์!',
};

export default function QuestTracker() {
  const { currentQuestKey, currentStepIndex, quests, reachedLocations, talkedNPCs, placedBuildings, isEpisodeEnd } = useQuestStore();
  const { quantities: inventory } = useInventoryStore();

  if (isEpisodeEnd || !currentQuestKey || quests.length === 0) return null;

  const quest = quests.find(q => q.key === currentQuestKey);
  if (!quest) return null;

  const activeStep = quest.steps[currentStepIndex];
  if (!activeStep) return null;

  // Determine current slug from window path
  const slug = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : 'pla-boo-thong';
  const isGhostMode = slug === 'ghost-whisperer';

  // Get localized step titles and hints
  const stepTitle = isGhostMode 
    ? (GHOST_STEP_TITLES[activeStep.key] || activeStep.title || activeStep.key)
    : (PLA_BOO_STEP_TITLES[activeStep.key] || activeStep.title || activeStep.key);
    
  const stepHint = isGhostMode
    ? (GHOST_HINTS[activeStep.key] || '')
    : (PLA_BOO_HINTS[activeStep.key] || '');

  return (
    <div className="absolute left-4 top-[195px] z-40 w-64 rounded-2xl border-2 border-amber-900/60 bg-amber-950/80 p-4 text-amber-100 shadow-xl backdrop-blur-md transition-all md:w-72">
      {/* Header */}
      <div className="mb-2.5 border-b border-amber-800/60 pb-2">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
          ภารกิจหลัก: {quest.name}
        </h3>
        <p className="text-sm font-bold text-amber-200 mt-0.5">{stepTitle}</p>
      </div>

      {/* Objectives List */}
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
