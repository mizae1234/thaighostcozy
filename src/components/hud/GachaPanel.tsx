'use client';

import { useState } from 'react';
import { useInventoryStore } from '@/stores/useInventoryStore';

interface GhostData {
  key: string;
  name: string;
  rarity: string;
  rarityColor: string;
  buff: string;
  img: string;
}

const GHOSTS: GhostData[] = [
  {
    key: 'tani',
    name: 'นางตานีสายแฟ',
    rarity: 'SSR',
    rarityColor: 'text-rose-400 border-rose-500/50 bg-rose-950/20',
    buff: '⚡ พรตานีรักษ์โลก: เพิ่มความเร็วการโตของพืชผล 20%',
    img: '/assets/stories/ghost-whisperer/gacha/card-tani.png',
  },
  {
    key: 'kuman',
    name: 'กุมารทองติดแท็บเล็ต',
    rarity: 'SR',
    rarityColor: 'text-amber-400 border-amber-500/50 bg-amber-950/20',
    buff: '🎮 พรกุมารเจมเมอร์: แฮกเก็บกล่องไม้/หินอัตโนมัติ',
    img: '/assets/stories/ghost-whisperer/gacha/card-kuman.png',
  },
  {
    key: 'pob',
    name: 'ปอบออฟฟิศซินโดรม',
    rarity: 'R',
    rarityColor: 'text-blue-400 border-blue-500/50 bg-blue-950/20',
    buff: '☕ พรปอบเบิร์นเอาท์: เพิ่มจำนวนไม้ที่ขุดได้ 15%',
    img: '/assets/stories/ghost-whisperer/gacha/card-pob.png',
  },
  {
    key: 'naga',
    name: 'พญานาคน้อย',
    rarity: 'UR',
    rarityColor: 'text-emerald-400 border-emerald-500/50 bg-emerald-950/20',
    buff: '🌊 พรวารีเทพ: ค่าความกระหายลดช้าลง 30%',
    img: '/assets/stories/ghost-whisperer/gacha/card-naga.png',
  },
];

interface GachaPanelProps {
  onClose: () => void;
}

export default function GachaPanel({ onClose }: GachaPanelProps) {
  const { coins, deductCoins, unlockGhost, unlockedGhosts } = useInventoryStore();
  const [summonedGhost, setSummonedGhost] = useState<GhostData | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRoll = () => {
    if (isRolling) return;
    setErrorMsg(null);
    setSummonedGhost(null);

    // Cost: 100 coins per roll
    const success = deductCoins(100);
    if (!success) {
      setErrorMsg('เหรียญสายมูไม่เพียงพอ! (ต้องการ 100 🪙)');
      return;
    }

    setIsRolling(true);

    // Roll logic (probability weights: R=45%, SR=30%, SSR=20%, UR=5%)
    const rand = Math.random() * 100;
    let chosen: GhostData;
    if (rand < 5) {
      chosen = GHOSTS[3]; // UR Naga
    } else if (rand < 25) {
      chosen = GHOSTS[0]; // SSR Tani
    } else if (rand < 55) {
      chosen = GHOSTS[1]; // SR Kuman
    } else {
      chosen = GHOSTS[2]; // R Pob
    }

    // Simulate magic roll animation duration
    setTimeout(() => {
      setSummonedGhost(chosen);
      unlockGhost(chosen.key);
      setIsRolling(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl border-2 border-purple-500/30 bg-purple-950/20 p-6 shadow-2xl backdrop-blur-xl text-stone-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-800/40 pb-3">
          <div>
            <h2 className="text-xl font-black uppercase tracking-wider text-purple-300">🔮 ตู้สุ่มอาร์ตทอยสายมู</h2>
            <p className="text-[10px] uppercase tracking-widest text-purple-400 mt-0.5">Summon Cute Thai Ghosts & Spirits</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-stone-400 hover:text-white text-lg font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Cauldron / Cauldron Area */}
        <div className="my-8 flex flex-col items-center justify-center min-h-[280px]">
          {isRolling ? (
            <div className="flex flex-col items-center gap-4">
              {/* Spinning crystal ball */}
              <div className="h-28 w-28 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-600 animate-spin blur-[3px]" />
              <p className="text-sm font-black text-purple-300 animate-pulse tracking-widest">กำลังทำพิธีปลุกเสกสุ่มอาร์ตทอย...</p>
            </div>
          ) : summonedGhost ? (
            <div className="flex flex-col items-center gap-4 animate-scaleUp">
              {/* Summoned Ghost Card Display */}
              <div className="relative group max-w-[200px] overflow-hidden rounded-2xl border-4 border-amber-400 shadow-2xl transition-transform duration-300 hover:scale-105">
                <img 
                  src={summonedGhost.img} 
                  alt={summonedGhost.name} 
                  className="w-full object-contain"
                />
              </div>

              {/* Rarity and name banner */}
              <div className="text-center mt-2">
                <span className={`inline-block rounded-full border px-3 py-0.5 text-[10px] font-extrabold tracking-wider ${summonedGhost.rarityColor} mb-1`}>
                  {summonedGhost.rarity} Companion
                </span>
                <h3 className="text-lg font-black text-yellow-300">{summonedGhost.name}</h3>
                <p className="mt-1 text-xs text-purple-200/90 max-w-xs font-semibold leading-relaxed">
                  {summonedGhost.buff}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center gap-6">
              <span className="text-7xl filter drop-shadow-[0_5px_15px_rgba(147,51,234,0.5)]">🔮</span>
              <div>
                <p className="text-sm font-bold text-purple-300">หม้อปรุงยาวิเศษของสตรีมเมอร์สายมู</p>
                <p className="text-xs text-stone-400 mt-1 max-w-xs font-medium leading-relaxed">
                  ใช้ 100 เหรียญสายมู เพื่อสุ่มกุญแจปลุกเสกอัญเชิญวิญญาณมาช่วยเฝ้าและรดน้ำแปลงผักของคุณ!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action button */}
        {!isRolling && (
          <div className="flex flex-col gap-3">
            {errorMsg && (
              <p className="text-center text-xs font-bold text-rose-400 animate-bounce">{errorMsg}</p>
            )}
            <button
              onClick={handleRoll}
              className="w-full rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-purple-950/40 hover:brightness-110 active:scale-95 transition-all"
            >
              🪙 อัญเชิญกล่องสุ่ม (100 เหรียญ)
            </button>
            <div className="text-center text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              เหรียญของคุณในกระเป๋า: <span className="font-mono text-amber-400 font-extrabold">{coins} 🪙</span>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scaleUp {
          animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
