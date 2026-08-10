'use client';

import { useState, useEffect } from 'react';
import NicknameModal from '@/components/NicknameModal';

export default function HomePage() {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [localNickname, setLocalNickname] = useState('น้องเอื้อยสายลุย');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('thaighost_nickname');
      if (stored) {
        setLocalNickname(stored);
      }
    }
  }, []);

  return (
    <main
      className="relative flex min-h-screen w-screen flex-col items-center justify-between overflow-hidden bg-cover bg-center text-stone-100 selection:bg-amber-500 selection:text-black"
      style={{
        backgroundImage: "url('/assets/stories/ghost-whisperer/tiles/landing-bg-clean.png')",
      }}
    >
      {/* Dark vignette overlay for readibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80 pointer-events-none" />

      {/* Glow effect */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

      {/* Top Capsule Patch Banner */}
      <div className="relative z-10 mt-6 animate-pulse">
        <button
          type="button"
          onClick={() => setShowNicknameModal(true)}
          className="flex items-center gap-2 rounded-full border border-amber-600/30 bg-[#fde047]/95 px-5 py-1.5 shadow-md transition-all hover:scale-[1.03]"
        >
          <span className="h-2 w-2 rounded-full bg-[#d97706] animate-ping" />
          <span className="text-[11px] font-extrabold text-[#78350f]">
            มีแพทช์ใหม่ — แตะที่นี่เพื่ออัปเดต!
          </span>
        </button>
      </div>

      {/* Header / Logo Section */}
      <div className="relative z-10 mt-12 flex flex-col items-center text-center px-4">
        <h1 className="text-5xl font-black uppercase tracking-widest text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] md:text-7xl">
          PAWANA
        </h1>
        <h2 className="mt-1 text-xs font-extrabold uppercase tracking-[0.3em] text-emerald-400 drop-shadow-md sm:text-sm">
          COZY SPIRITS & FOLKLORE
        </h2>
        <p className="mt-4 max-w-sm text-xs sm:text-sm text-stone-300 font-medium leading-relaxed drop-shadow-md">
          “สัมผัสมิตรภาพ คลี่คลายความหลัง และร่วมทางไปกับเหล่าภูตผีไทยแสนอบอุ่น”
        </p>

        {/* Small badge showing online players count */}
        <div className="mt-4 flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/70 px-4 py-1 shadow-md">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-400">
            23 ผู้สื่อวิญญาณกำลังออนไลน์
          </span>
        </div>
      </div>

      {/* Center Control Panel / Buttons */}
      <div className="relative z-10 mb-6 w-full max-w-sm px-6 flex flex-col gap-3">
        {/* Play Button */}
        <button
          onClick={() => setShowNicknameModal(true)}
          className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 py-3.5 text-sm font-black uppercase tracking-[0.2em] text-black shadow-[0_4px_20px_rgba(245,158,11,0.4)] transition-all hover:scale-[1.02] hover:brightness-110 active:scale-95"
        >
          🎮 เริ่มการเดินทาง
        </button>

        {/* Sub grid */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setShowHowToPlay(true)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-[#e6d0a7]/30 bg-[#fdf4e3]/20 py-2.5 text-xs font-bold text-stone-200 backdrop-blur-md transition-all hover:bg-[#fdf4e3]/30"
          >
            📖 วิธีเล่น
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-[#e6d0a7]/30 bg-[#fdf4e3]/20 py-2.5 text-xs font-bold text-stone-200 backdrop-blur-md transition-all hover:bg-[#fdf4e3]/30"
          >
            ⚙️ ตั้งค่า
          </button>
        </div>
      </div>

      {/* Left Character Badge */}
      <div className="absolute bottom-16 left-8 z-10 flex items-center gap-3 bg-black/40 backdrop-blur-sm px-3.5 py-2 rounded-2xl border border-white/5">
        <img
          src="/assets/stories/pla-boo-thong/sprites/player/player-down.png"
          alt="Player sprite"
          className="w-10 h-10 object-contain pixelated"
        />
        <div className="text-left">
          <p className="text-[9px] font-bold text-stone-500 uppercase tracking-wider">ผู้รอดชีวิต</p>
          <p className="text-xs font-black text-amber-400">{localNickname}</p>
        </div>
      </div>

      {/* Right Spirit Badge */}
      <div className="absolute bottom-16 right-8 z-10 flex items-center gap-3 bg-black/40 backdrop-blur-sm px-3.5 py-2 rounded-2xl border border-white/5">
        <div className="text-right">
          <p className="text-[9px] font-bold text-stone-500 uppercase tracking-wider">วิญญาณอารักษ์</p>
          <p className="text-xs font-black text-emerald-400">นางตานีมินิมอล</p>
        </div>
        <img
          src="/assets/stories/pla-boo-thong/sprites/npc/golden-goby.png"
          alt="Goby sprite"
          className="w-10 h-10 object-contain pixelated"
        />
      </div>

      {/* Bottom Footer Info */}
      <div className="relative z-10 mb-4 flex flex-col items-center gap-1 text-center">
        <div className="flex items-center gap-1.5 text-stone-400 text-[11px] font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-stone-500" />
          <span>ยังไม่ได้เข้าระบบ</span>
        </div>
        <p className="text-[10px] font-medium text-stone-500">
          เกมเอาชีวิตรอดเดี่ยว · เล่นในเบราว์เซอร์ได้เลย
        </p>
      </div>

      {/* Nickname Input Modal */}
      <NicknameModal
        isOpen={showNicknameModal}
        onClose={() => setShowNicknameModal(false)}
      />

      {/* How to Play Modal */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-[28px] border-2 border-[#e6d0a7] bg-[#fdf4e3] p-6 shadow-2xl text-stone-800">
            <h3 className="text-lg font-black uppercase tracking-wider text-[#78350f] border-b border-[#e3cb9f] pb-3">
              📖 วิธีการเล่นบอร์ดเกมปราบผี
            </h3>
            <ul className="mt-4 space-y-3.5 text-xs text-[#5c2d0b] leading-relaxed font-semibold">
              <li className="flex items-start gap-2.5">
                <span className="text-amber-600">🚶‍♂️</span>
                <span><strong>ควบคุมตัวละคร:</strong> ใช้ปุ่มลูกศร (Arrow Keys) หรือปุ่ม <strong>W A S D</strong> ในการเดินสำรวจรอบเกาะ</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-amber-600">🌌</span>
                <span><strong>เก็บกู้ทรัพยากร:</strong> กดปุ่ม <strong>Spacebar</strong> หรือเดินชน เพื่อเก็บวัตถุดิบในสวน (ไม้, ใบตอง, หิน) หรือพูดคุยสนทนากับวิญญาณ</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-amber-600">🛠️</span>
                <span><strong>เมนูคราฟต์ของ:</strong> ดูรายการวัตถุดิบที่ต้องการแล้วคราฟต์สร้างไอเทม เช่น <strong>มีด</strong> หรือ <strong>ศาลพระภูมิมูจิ</strong> ในแท็บคราฟต์ด้านล่าง</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-amber-600">❤️</span>
                <span><strong>เอาชีวิตรอด:</strong> ระวังเกจค่าความหิวความกระหายทางซ้ายบนให้ดี หากหมดเกจพลังจะลดฮวบลงเรื่อยๆ</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-amber-600">🔍</span>
                <span><strong>ปรับมุมกล้อง:</strong> กดปุ่มซูมมุมกล้องใน HUD เพื่อสลับระยะกว้างและแคบได้ทันที</span>
              </li>
            </ul>
            <button
              onClick={() => setShowHowToPlay(false)}
              className="mt-6 w-full rounded-full bg-gradient-to-b from-[#fcd34d] to-[#d97706] text-[#5c2d0b] py-2.5 text-xs font-bold uppercase tracking-widest hover:brightness-105 active:translate-y-0.5"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-[28px] border-2 border-[#e6d0a7] bg-[#fdf4e3] p-6 shadow-2xl text-stone-800">
            <h3 className="text-lg font-black uppercase tracking-wider text-[#78350f] border-b border-[#e3cb9f] pb-3">
              ⚙️ ตั้งค่าระบบเสียงเกม
            </h3>
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-[#5c2d0b]">
                <span>เอฟเฟกต์เสียง (Sound Effects)</span>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`rounded-full px-4 py-1 text-[10px] font-black ${
                    soundEnabled ? 'bg-emerald-600 text-white' : 'bg-stone-300 text-stone-600'
                  }`}
                >
                  {soundEnabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                </button>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-[#5c2d0b]">
                <span>ดนตรีประกอบ (Background Music)</span>
                <button
                  onClick={() => setMusicEnabled(!musicEnabled)}
                  className={`rounded-full px-4 py-1 text-[10px] font-black ${
                    musicEnabled ? 'bg-emerald-600 text-white' : 'bg-stone-300 text-stone-600'
                  }`}
                >
                  {musicEnabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="mt-6 w-full rounded-full bg-gradient-to-b from-[#fcd34d] to-[#d97706] text-[#5c2d0b] py-2.5 text-xs font-bold uppercase tracking-widest hover:brightness-105 active:translate-y-0.5"
            >
              บันทึกการตั้งค่า
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .pixelated {
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }
      `}</style>
    </main>
  );
}
