'use client';

import { useQuestStore } from '@/stores/useQuestStore';
import { useInventoryStore } from '@/stores/useInventoryStore';
import { useContentStore } from '@/stores/useContentStore';

const GHOST_EPISODES = [
  { id: 1, name: 'มูเตลูทาวน์', status: 'COMPLETED', desc: 'ปลดล็อกมิตรภาพตานีสำเร็จ' },
  { id: 2, name: 'บ้านสวนตานี', status: 'LOCKED', desc: 'ฟาร์มกล้วยอัตโนมัติ (ล็อกไว้)' },
  { id: 3, name: 'ศาลเจ้าแม่ไทร', status: 'LOCKED', desc: 'มูเตลูเสริมดวงความรัก (ล็อกไว้)' },
  { id: 4, name: 'ป่าช้าโมเดิร์น', status: 'LOCKED', desc: 'ปัดเป่าพลังงานลบ (ล็อกไว้)' },
  { id: 5, name: 'วัดท้ายบ้าน Y2K', status: 'LOCKED', desc: 'ปลุกเสกเครื่องรางมงคล (ล็อกไว้)' },
  { id: 6, name: 'คาเฟ่ผีขยัน', status: 'LOCKED', desc: 'ร้านกาแฟวิญญาณคนทำงาน (ล็อกไว้)' },
  { id: 7, name: 'สตรีมเมอร์สายดาร์ก', status: 'LOCKED', desc: 'ล่าท้าผีออนไลน์ (ล็อกไว้)' },
  { id: 8, name: 'มิตรภาพนิรันดร์', status: 'LOCKED', desc: 'งานปาร์ตี้ภูตผี (ล็อกไว้)' }
];

const PLABOO_EPISODES = [
  { id: 1, name: 'เกาะปลาบู่ทอง', status: 'COMPLETED', desc: 'ปลดคำสาปสำเร็จ ได้แหวนวิเศษ' },
  { id: 2, name: 'เกาะสังข์ทอง', status: 'LOCKED', desc: 'ตามหานางสังข์ทอง (ล็อกไว้)' },
  { id: 3, name: 'เกาะพิกุลทอง', status: 'LOCKED', desc: 'ปริศนาดอกพิกุลร่วง (ล็อกไว้)' },
  { id: 4, name: 'เกาะแก้วพิสดาร', status: 'LOCKED', desc: 'ดินแดนแห่งมนตรา (ล็อกไว้)' },
  { id: 5, name: 'เกาะขุนช้างขุนแผน', status: 'LOCKED', desc: 'ศึกดาบฟ้าฟื้น (ล็อกไว้)' },
  { id: 6, name: 'เกาะรามเกียรติ์', status: 'LOCKED', desc: 'ดินแดนวานร (ล็อกไว้)' },
  { id: 7, name: 'เกาะอุทัยเทวี', status: 'LOCKED', desc: 'คางคกวิเศษ (ล็อกไว้)' },
  { id: 8, name: 'เกาะพระอภัยมณี', status: 'LOCKED', desc: 'เสียงปี่มรณะ (ล็อกไว้)' }
];

export default function EpisodeEndOverlay() {
  const { isEpisodeEnd, startQuest } = useQuestStore();

  if (!isEpisodeEnd) return null;

  // Resolve story slug dynamically from path
  const slug = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : 'pla-boo-thong';
  const isGhostMode = slug === 'ghost-whisperer';

  const handleRestart = () => {
    startQuest('find-golden-goby');
  };

  const episodes = isGhostMode ? GHOST_EPISODES : PLABOO_EPISODES;
  const rewardName = isGhostMode ? 'รางวัล: แหวนมูเตลูทองคำ' : 'รางวัล: แหวนวิเศษ';
  const rewardDesc = isGhostMode 
    ? '"แหวนทองคำลงอักขระเพื่อมิตรภาพที่ยั่งยืน สัญลักษณ์แห่งพันธสัญญาระหว่างนักสตรีมเมอร์และวิญญาณนางตานี"'
    : '"แหวนประหลาดที่ปลาบู่ทองทิ้งไว้ให้ ส่องแสงจางๆ เหมือนกำลังรอเวลาไขความลับใหญ่ที่ซ่อนอยู่อีกเกาะ"';

  const titleText = isGhostMode ? 'จบบทที่ 1: ผูกมิตรภาพนางตานี' : 'จบบทที่ 1: คลื่นซัดขึ้นฝั่ง';
  const descText = isGhostMode 
    ? 'คุณปลดปล่อยความเครียดให้นางตานีสำเร็จ และได้รับแหวนมิตรภาพโบราณ!'
    : 'คุณปลดคำสาปให้ปลาบู่ทองสำเร็จและได้รับเบาะแสชิ้นสำคัญ!';

  const schemaTitle = isGhostMode ? 'แผนผังชุมชนวิญญาณมินิมอล' : 'แผนผังเกาะนิทานพื้นบ้านไทย';

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 p-4 animate-fade-in">
      <div className="w-full max-w-2xl transform overflow-hidden rounded-3xl border-4 border-yellow-600 bg-slate-950 p-6 shadow-2xl transition-all duration-300 md:p-8">
        
        {/* Title Section */}
        <div className="text-center mb-6">
          <div className="inline-block px-4 py-1 rounded-full bg-yellow-950 border border-yellow-700 text-yellow-400 text-xs font-bold uppercase tracking-widest mb-2 animate-bounce">
            EPISODE 1 COMPLETED
          </div>
          <h2 className="text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-500 drop-shadow-md">
            {titleText}
          </h2>
          <p className="text-slate-400 text-sm mt-1">{descText}</p>
        </div>

        {/* Reward Box */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-2xl border border-yellow-800/40 mb-6 shadow-inner relative overflow-hidden group">
          <div className="absolute -inset-10 bg-yellow-500/10 blur-xl rounded-full animate-pulse" />
          
          <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-yellow-600 to-amber-950 rounded-full border-2 border-yellow-400 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(234,179,8,0.4)] animate-spin-slow">
            <span className="text-3xl">💍</span>
          </div>
          <h3 className="relative z-10 text-lg font-bold text-yellow-400">{rewardName}</h3>
          <p className="relative z-10 text-xs text-slate-300 text-center max-w-md mt-1 italic">
            {rewardDesc}
          </p>
        </div>

        {/* Episodes grid */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">{schemaTitle}</h4>
          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {episodes.map((ep) => {
              const isCompleted = ep.status === 'COMPLETED';
              return (
                <div 
                  key={ep.id}
                  title={ep.desc}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                    isCompleted 
                      ? 'bg-yellow-950/40 border-yellow-600/70 text-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.2)]'
                      : 'bg-slate-900/40 border-slate-800 text-slate-600'
                  }`}
                >
                  <div className="text-2xl mb-1 filter drop-shadow">
                    {isCompleted ? '🏝️' : '🔒'}
                  </div>
                  <span className={`text-[10px] font-bold truncate w-full ${isCompleted ? 'text-yellow-300' : 'text-slate-500'}`}>
                    {ep.name}
                  </span>
                  <span className="text-[8px] opacity-75 font-semibold mt-0.5">
                    {isCompleted ? 'จบบท' : 'ล็อกอยู่'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRestart}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-black font-extrabold text-sm tracking-wider shadow-lg hover:shadow-yellow-500/20 active:scale-95 transition-all"
          >
            เล่นบทที่ 1 ใหม่
          </button>
        </div>

      </div>
    </div>
  );
}
