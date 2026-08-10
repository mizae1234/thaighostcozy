'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);

  return (
    <main
      className="relative flex min-h-screen w-screen flex-col items-center justify-between overflow-hidden bg-cover bg-center text-stone-100 selection:bg-amber-500 selection:text-black"
      style={{
        backgroundImage: "url('/assets/stories/pla-boo-thong/tiles/island-background.png')",
      }}
    >
      {/* Dark vignette overlay for readibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/85 pointer-events-none" />

      {/* Glow effect */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

      {/* Floating Meteor Decoration */}
      <div className="absolute top-20 left-[55%] pointer-events-none animate-bounce duration-1000">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-red-600 blur-[8px] opacity-70" />
      </div>

      {/* Header / Logo Section */}
      <div className="relative z-10 mt-20 flex flex-col items-center text-center px-4">
        <h1 className="text-5xl font-black uppercase tracking-widest text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] md:text-7xl">
          PAWANA
        </h1>
        <h2 className="mt-1 text-xs font-extrabold uppercase tracking-[0.3em] text-amber-400 drop-shadow-md sm:text-sm">
          THE OCCULT SURVIVAL
        </h2>
        <p className="mt-6 max-w-md text-xs sm:text-sm text-stone-300 font-medium leading-relaxed drop-shadow-md">
          \"เอาชีวิตรอด... อย่าก้าวออกนอกกำแพงสัจจะวิญญาณ\"
        </p>

        {/* Small badge showing online players count */}
        <div className="mt-6 flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/70 px-4 py-1.5 shadow-md">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
            23 ผู้รอดชีวิตกำลังออนไลน์
          </span>
        </div>
      </div>

      {/* Center Control Panel / Buttons */}
      <div className="relative z-10 mb-10 w-full max-w-sm px-6 flex flex-col gap-3">
        {/* Play Button */}
        <Link
          href="/play"
          className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 py-4 text-sm font-black uppercase tracking-[0.2em] text-black shadow-[0_4px_20px_rgba(245,158,11,0.4)] transition-all hover:scale-[1.02] hover:brightness-110 active:scale-95"
        >
          🎮 เริ่มการเดินทาง
        </Link>

        {/* Sub grid */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setShowHowToPlay(true)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-700/50 bg-stone-900/60 py-3 text-xs font-bold uppercase tracking-wider text-stone-200 backdrop-blur-md transition-all hover:bg-stone-800/80 hover:border-stone-500"
          >
            📖 วิธีเล่น
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-700/50 bg-stone-900/60 py-3 text-xs font-bold uppercase tracking-wider text-stone-200 backdrop-blur-md transition-all hover:bg-stone-800/80 hover:border-stone-500"
          >
            ⚙️ ตั้งค่า
          </button>
        </div>
      </div>

      {/* Floating Sprites decorations at bottom corners */}
      <div className="absolute bottom-6 left-8 z-10 flex items-center gap-3 bg-black/40 backdrop-blur-sm px-3.5 py-2 rounded-2xl border border-white/5">
        <img
          src="/assets/stories/pla-boo-thong/sprites/player/player-down.png"
          alt="Player sprite"
          className="w-10 h-10 object-contain pixelated"
        />
        <div className="text-left">
          <p className="text-[9px] font-bold text-stone-500 uppercase tracking-wider">ผู้รอดชีวิต</p>
          <p className="text-xs font-black text-amber-400">น้องเอื้อยสายลุย</p>
        </div>
      </div>

      <div className="absolute bottom-6 right-8 z-10 flex items-center gap-3 bg-black/40 backdrop-blur-sm px-3.5 py-2 rounded-2xl border border-white/5">
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

      {/* Modals */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border-2 border-amber-950/70 bg-stone-950 p-6 shadow-2xl text-stone-200">
            <h3 className="text-lg font-black uppercase tracking-wider text-amber-400 border-b border-stone-800 pb-3">
              📖 วิธีการเล่นบอร์ดเกมปราบผี
            </h3>
            <ul className="mt-4 space-y-3.5 text-xs text-stone-300 leading-relaxed font-medium">
              <li className="flex items-start gap-2.5">
                <span className="text-amber-500">🚶‍♂️</span>
                <span><strong>ควบคุมตัวละคร:</strong> ใช้ปุ่มลูกศร (Arrow Keys) หรือปุ่ม <strong>W A S D</strong> ในการเดินสำรวจรอบเกาะ</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-amber-500">🌌</span>
                <span><strong>ปะทะและรวบรวม:</strong> กดปุ่ม <strong>Spacebar</strong> เพื่อเก็บวัตถุดิบ (ลังไม้, มะพร้าว) หรือพูดคุยสนทนากับวิญญาณ</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-amber-500">🛠️</span>
                <span><strong>เมนูคราฟต์ของ:</strong> ดูรายการวัตถุดิบที่ต้องการแล้วคลิกสร้าง <strong>มีด</strong> หรือ <strong>ศาลมูจิ</strong> ที่แท็บคราฟต์ด้านซ้ายล่าง</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-amber-500">❤️</span>
                <span><strong>เอาชีวิตรอด:</strong> ระวังเกจค่าความหิวความกระหายทางซ้ายบนให้ดี หากหมดเกจพลังจะลดฮวบลงเรื่อยๆ</span>
              </li>
            </ul>
            <button
              onClick={() => setShowHowToPlay(false)}
              className="mt-6 w-full rounded-xl bg-amber-500 py-2.5 text-xs font-bold uppercase tracking-widest text-black hover:bg-yellow-400"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border-2 border-amber-950/70 bg-stone-950 p-6 shadow-2xl text-stone-200">
            <h3 className="text-lg font-black uppercase tracking-wider text-amber-400 border-b border-stone-800 pb-3">
              ⚙️ ตั้งค่าระบบเสียงเกม
            </h3>
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                <span>เอฟเฟกต์เสียง (Sound Effects)</span>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`rounded-lg px-3 py-1.5 text-[10px] font-black ${
                    soundEnabled ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-stone-500'
                  }`}
                >
                  {soundEnabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                </button>
              </div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                <span>ดนตรีประกอบ (Background Music)</span>
                <button
                  onClick={() => setMusicEnabled(!musicEnabled)}
                  className={`rounded-lg px-3 py-1.5 text-[10px] font-black ${
                    musicEnabled ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-stone-500'
                  }`}
                >
                  {musicEnabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="mt-6 w-full rounded-xl bg-amber-500 py-2.5 text-xs font-bold uppercase tracking-widest text-black hover:bg-yellow-400"
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
