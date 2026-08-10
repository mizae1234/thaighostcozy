'use client';

import { useState } from 'react';
import { useInventoryStore } from '@/stores/useInventoryStore';

interface Mission {
  id: string;
  desc: string;
  points: number;
  coinsReward: number;
  completed: boolean;
}

export default function MuteluPassPanel({ onClose }: { onClose: () => void }) {
  const { 
    passPoints, 
    passLevel, 
    isPremiumPass, 
    addPassPoints, 
    addCoins, 
    upgradePremiumPass 
  } = useInventoryStore();

  const [missions, setMissions] = useState<Mission[]>([
    { id: '1', desc: '🍵 เสิร์ฟชาใบตองออร์แกนิกให้นางตานี 1 แก้ว', points: 50, coinsReward: 30, completed: false },
    { id: '2', desc: '🏠 สร้างศาลพระภูมิมูจิมินิมอล 1 หลัง', points: 80, coinsReward: 50, completed: false },
    { id: '3', desc: '🎀 ตามหากิ๊บหนีบผมใบตองของตานี 3 อัน', points: 60, coinsReward: 40, completed: false },
  ]);

  const handleCompleteMission = (id: string, pts: number, coins: number) => {
    setMissions(prev => 
      prev.map(m => m.id === id ? { ...m, completed: true } : m)
    );
    addPassPoints(pts);
    addCoins(coins);
  };

  // Progress relative to next level (each level requires 100 points)
  const currentLevelPoints = passPoints % 100;
  const levelProgressPercent = Math.min(100, Math.floor((currentLevelPoints / 100) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-3xl border-2 border-emerald-500/30 bg-emerald-950/20 p-6 shadow-2xl backdrop-blur-xl text-stone-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-800/40 pb-3">
          <div>
            <h2 className="text-xl font-black uppercase tracking-wider text-emerald-300">🎫 บัตรผ่านสายมู (Mutelu Pass)</h2>
            <p className="text-[10px] uppercase tracking-widest text-emerald-400 mt-0.5">Level up and earn seasonal premium rewards</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-stone-400 hover:text-white text-lg font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Level Progress */}
        <div className="my-5 bg-emerald-900/10 border border-emerald-800/30 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="text-center">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Level</span>
            <div className="text-3xl font-black text-white font-mono">{passLevel}</div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
              <span>ความคืบหน้าบัตรผ่าน</span>
              <span className="font-mono text-emerald-300">{currentLevelPoints}/100 EXP</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-stone-800 rounded-full h-3.5 overflow-hidden border border-white/5">
              <div 
                className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 h-full transition-all duration-500"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Daily Missions */}
        <div className="mb-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-stone-400 mb-3">📋 ภารกิจประจําวัน (Daily Quests)</h3>
          <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
            {missions.map((m) => (
              <div 
                key={m.id} 
                className={`flex items-center justify-between rounded-xl border p-3 transition-colors text-xs font-semibold ${
                  m.completed 
                    ? 'border-emerald-800/20 bg-emerald-950/10 text-stone-500 line-through' 
                    : 'border-stone-800 bg-stone-900/40 text-stone-200'
                }`}
              >
                <span>{m.desc}</span>
                {m.completed ? (
                  <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-wider">สำเร็จแล้ว ✅</span>
                ) : (
                  <button
                    onClick={() => handleCompleteMission(m.id, m.points, m.coinsReward)}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white hover:bg-emerald-500 active:scale-95 transition-all"
                  >
                    รับแต้ม (+{m.points} EXP)
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Premium Upgrade Section */}
        <div className="border-t border-emerald-800/40 pt-4 flex flex-col gap-3.5">
          {isPremiumPass ? (
            <div className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 p-4 text-center">
              <span className="text-lg">👑</span>
              <p className="text-xs font-extrabold text-amber-300 uppercase tracking-widest">
                เปิดใช้งานสถานะ PREMIUM PASS เรียบร้อยแล้ว!
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-amber-950/40 via-stone-900/60 to-amber-950/40 border border-amber-500/20 p-4">
              <div className="max-w-[280px]">
                <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">👑 อัปเกรดสถานะพรีเมียมบัตรผ่าน</h4>
                <p className="text-[10px] text-stone-400 mt-1 font-medium leading-relaxed">
                  ปลดล็อกตู้สุ่มอาร์ตทอยลิมิเต็ด, สกินศาลพระภูมิแก้วหรูหรา และเหรียญโบนัสสะสมเพียบ!
                </p>
              </div>
              <button
                onClick={upgradePremiumPass}
                className="rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 px-4 py-3 text-xs font-black uppercase tracking-widest text-black shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                อัปเกรด (99 บาท)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
