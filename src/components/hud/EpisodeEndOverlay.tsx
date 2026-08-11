'use client';

import { useQuestStore } from '@/stores/useQuestStore';
import { useInventoryStore } from '@/stores/useInventoryStore';

const GHOST_EPISODES = [
  { id: 1, name: 'มรดกสวนกล้วย', status: 'COMPLETED', desc: 'จบเดโมสืบสวน 7 วันแรก' },
  { id: 2, name: 'ตึกนายทุนทมิฬ', status: 'LOCKED', desc: 'บุกรังนายทุนเบื้องหลัง (ล็อกไว้)' },
  { id: 3, name: 'พันธะตานีประทาน', status: 'LOCKED', desc: 'ปลดล็อกร่างวิญญาณเต็มพิกัด (ล็อกไว้)' },
  { id: 4, name: 'ผู้ใหญ่บ้านล้างแค้น', status: 'LOCKED', desc: 'วิญญาณแค้นลุงแดงอาละวาด (ล็อกไว้)' },
  { id: 5, name: 'บันทึกตาเดชหน้าสุดท้าย', status: 'LOCKED', desc: 'ความจริงฉบับลับของคุณตา (ล็อกไว้)' },
  { id: 6, name: 'ศาลอาคมโบราณสวนลึก', status: 'LOCKED', desc: 'พิธีกรรมฟื้นฟูพันธสัญญาเล่มสมบูรณ์ (ล็อกไว้)' },
  { id: 7, name: 'สงครามปราบผีป่ากล้วย', status: 'LOCKED', desc: 'ศึกหมอผีนายทุนล้อมสวน (ล็อกไว้)' },
  { id: 8, name: 'มิตรภาพสายใยนิรันดร์', status: 'LOCKED', desc: 'พิธีปลดแอกวิญญาณตานีสู่สุขคติ (ล็อกไว้)' }
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
  const { isEpisodeEnd, startQuest, selectedChoices } = useQuestStore();
  const { unlockedGhosts } = useInventoryStore();

  if (!isEpisodeEnd) return null;

  // Resolve story slug dynamically from path
  const slug = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : 'pla-boo-thong';
  const isGhostMode = slug === 'ghost-whisperer';

  const handleRestart = () => {
    if (isGhostMode) {
      startQuest('grandpa-banana-mystery');
    } else {
      startQuest('find-golden-goby');
    }
  };

  const episodes = isGhostMode ? GHOST_EPISODES : PLABOO_EPISODES;
  
  // Custom ending stats for Ghost Mode
  const finalChoice = selectedChoices['day7-night'];
  let finalTitle = 'ชะตากรรมที่เลือก';
  let finalDesc = 'คุณได้ทำการสืบสวนและนำความจริงมาเปิดเผย';
  let finalEmoji = '💍';
  let finalColor = 'from-yellow-600 to-amber-950 border-yellow-400 text-yellow-400';

  if (finalChoice === 'night7_save_chief') {
    finalTitle = 'ผู้พิทักษ์ศีลธรรม (Destiny Savior)';
    finalDesc = 'คุณตัดสินใจใช้มีดพร้าคุณตาฟันรากตานีออกเพื่อช่วยชีวิตลุงแดงผู้ใหญ่บ้าน ท่ามกลางสายตาอาฆาตของแม่ตานี... คุณเลือกคุณธรรมเพื่อมนุษย์!';
    finalEmoji = '❤️';
    finalColor = 'from-rose-700 to-rose-950 border-rose-500 text-rose-400';
  } else if (finalChoice === 'night7_let_tani_take') {
    finalTitle = 'มิตรสหายวิญญาณ (Vengeance Allied)';
    finalDesc = 'คุณตัดสินใจยืนนิ่งและปล่อยให้เวรกรรมตามทันผู้ใหญ่บ้านลุงแดง ท่ามกลางเสียงกรีดร้อง ลุงแดงจมดินดิ่งลึกหายไปในสวนกล้วย... คุณเลือกยืนข้างตานี!';
    finalEmoji = '🖤';
    finalColor = 'from-zinc-800 to-stone-950 border-stone-500 text-stone-300';
  } else if (finalChoice === 'night7_sacrifice_self') {
    finalTitle = 'ผู้สืบทอดสัญญาเลือด (Sacrificial Covenant)';
    finalDesc = 'คุณกระโดดเข้าไปขวางรากตานี ยอมนำดวงจิตร่วมเป็นพันธะสัญญาคนใหม่สืบต่อจากคุณตา รังสีสีเขียวพุ่งเข้าสู่หน้าอกคุณ... คุณเสียสละตนเพื่อส่วนรวม!';
    finalEmoji = '💚';
    finalColor = 'from-emerald-700 to-teal-950 border-emerald-500 text-emerald-400';
  }

  const unlockedCount = unlockedGhosts.filter(g => g.startsWith('card-')).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start overflow-y-auto bg-black/90 p-4 md:p-8 animate-fade-in pointer-events-auto">
      <div className="my-auto w-full max-w-2xl transform overflow-hidden rounded-3xl border-2 border-emerald-600/30 bg-stone-950 p-5 shadow-2xl transition-all duration-300 md:p-8 text-[#FCFBF9]">
        
        {/* Title Section */}
        <div className="text-center mb-5">
          <div className="inline-block px-4 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-2.5 animate-pulse">
            {isGhostMode ? 'DEMO 7 วัน สวนกล้วยเสร็จสมบูรณ์' : 'EPISODE 1 COMPLETED'}
          </div>
          <h2 className="text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-yellow-200 to-emerald-500 drop-shadow-md">
            {isGhostMode ? 'จบบททดสอบเดโม: พันธสัญญาใบตอง' : 'จบบทที่ 1: คลื่นซัดขึ้นฝั่ง'}
          </h2>
          <p className="text-stone-400 text-xs mt-1 max-w-md mx-auto leading-relaxed">
            {isGhostMode 
              ? 'พายุใหญ่พัดทำลายสวนกล้วย รุ่งสางมาพร้อมชะตากรรมที่คุณเลือก...' 
              : 'คุณปลดคำสาปให้ปลาบู่ทองสำเร็จและได้รับเบาะแสชิ้นสำคัญ!'}
          </p>
        </div>

        {/* Dynamic Climax Summary Box for Ghost Mode */}
        {isGhostMode ? (
          <div className={`flex flex-col items-center justify-center p-5 bg-gradient-to-br ${finalColor} rounded-2xl border mb-5 shadow-inner relative overflow-hidden`}>
            <div className="absolute -inset-10 bg-emerald-500/5 blur-xl rounded-full pointer-events-none" />
            
            <div className="relative z-10 w-16 h-16 bg-black/40 rounded-full border border-white/20 flex items-center justify-center mb-2.5 shadow-lg select-none">
              <span className="text-3xl animate-pulse">{finalEmoji}</span>
            </div>
            <h3 className="relative z-10 text-sm font-black uppercase tracking-wider">{finalTitle}</h3>
            <p className="relative z-10 text-[11px] text-stone-300 text-center max-w-md mt-1.5 leading-relaxed font-bold">
              {finalDesc}
            </p>
            <div className="mt-3.5 relative z-10 text-[9px] font-black uppercase tracking-widest bg-black/35 px-3 py-1 rounded-full text-stone-400 border border-white/5">
              การ์ดเบาะแสที่รวบรวมได้ในเกม: <span className="text-amber-400 font-extrabold">{unlockedCount} ใบ</span>
            </div>
          </div>
        ) : (
          /* Original Plaboo Reward Box */
          <div className="flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-2xl border border-yellow-800/40 mb-6 shadow-inner relative overflow-hidden">
            <div className="absolute -inset-10 bg-yellow-500/10 blur-xl rounded-full animate-pulse" />
            <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-yellow-600 to-amber-950 rounded-full border-2 border-yellow-400 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(234,179,8,0.4)] animate-spin-slow">
              <span className="text-3xl">💍</span>
            </div>
            <h3 className="relative z-10 text-lg font-bold text-yellow-400">รางวัล: แหวนวิเศษ</h3>
            <p className="relative z-10 text-xs text-slate-300 text-center max-w-md mt-1 italic">
              &ldquo;แหวนประหลาดที่ปลาบู่ทองทิ้งไว้ให้ ส่องแสงจางๆ เหมือนกำลังรอเวลาไขความลับใหญ่ที่ซ่อนอยู่อีกเกาะ&rdquo;
            </p>
          </div>
        )}

        {/* Map / Community grid progress */}
        <div className="mb-5">
          <h4 className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-2.5 text-center">
            {isGhostMode ? 'แผนที่และตอนทั้งหมดของเวอร์ชันจริง (Episodes & Areas)' : 'แผนผังเกาะนิทานพื้นบ้านไทย'}
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {episodes.map((ep) => {
              const isCompleted = ep.status === 'COMPLETED';
              return (
                <div 
                  key={ep.id}
                  title={ep.desc}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                    isCompleted 
                      ? 'bg-emerald-950/40 border-emerald-600/70 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.15)]'
                      : 'bg-stone-900/30 border-stone-850 text-stone-600'
                  }`}
                >
                  <div className="text-xl mb-0.5 filter drop-shadow">
                    {isCompleted ? '🍌' : '🔒'}
                  </div>
                  <span className={`text-[9px] font-black truncate w-full ${isCompleted ? 'text-emerald-300' : 'text-stone-550'}`}>
                    {ep.name}
                  </span>
                  <span className="text-[8px] opacity-75 font-semibold mt-0.5">
                    {isCompleted ? 'เคลียร์' : 'ล็อก'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Teaser text */}
        {isGhostMode && (
          <p className="text-center text-[10px] font-black text-[#C96E3A] uppercase tracking-widest animate-pulse mb-5">
            🚨 โปรดติดตามความลับของตาเดชและหมู่บ้านต่อในเวอร์ชันเต็ม...
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRestart}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-stone-950 font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95"
          >
            เริ่มเดินทาง 7 วันใหม่อีกครั้ง
          </button>
        </div>

      </div>
    </div>
  );
}
