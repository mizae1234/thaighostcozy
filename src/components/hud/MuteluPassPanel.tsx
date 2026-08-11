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
    <div className="fixed inset-0 z-50 flex justify-center items-start overflow-y-auto bg-black/55 backdrop-blur-sm p-4 pointer-events-auto">
      <div className="my-auto relative w-full max-w-xl rounded-3xl border border-stone-200 bg-[#FCFBF9] p-5 md:p-6 shadow-2xl text-stone-800">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div>
            <h2 className="text-xl font-black uppercase tracking-wider text-[#2D4B32]">🎫 บัตรผ่านสายมู (Mutelu Pass)</h2>
            <p className="text-[10px] uppercase tracking-widest text-[#2D4B32]/70 mt-0.5">Level up and earn seasonal premium rewards</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-stone-400 hover:text-stone-700 text-lg font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Level Progress */}
        <div className="my-5 bg-[#FCFBF9] border border-stone-200 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm">
          <div className="text-center px-2">
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider">Level</span>
            <div className="text-3xl font-black text-[#2D4B32] font-mono">{passLevel}</div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-stone-500 mb-1">
              <span>ความคืบหน้าบัตรผ่าน</span>
              <span className="font-mono text-[#2D4B32]">{currentLevelPoints}/100 EXP</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-stone-200 rounded-full h-3.5 overflow-hidden border border-stone-300/40">
              <div 
                className="bg-gradient-to-r from-[#2D4B32] to-[#3f6946] h-full transition-all duration-500"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Daily Missions */}
        <div className="mb-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-stone-500 mb-3">📋 ภารกิจประจําวัน (Daily Quests)</h3>
          <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
            {missions.map((m) => (
              <div 
                key={m.id} 
                className={`flex items-center justify-between rounded-xl border p-3 transition-colors text-xs font-bold ${
                  m.completed 
                    ? 'border-[#2D4B32]/10 bg-[#2D4B32]/5 text-stone-400 line-through' 
                    : 'border-stone-200 bg-white text-[#1E2922]'
                }`}
              >
                <span>{m.desc}</span>
                {m.completed ? (
                  <span className="text-emerald-600 font-bold text-[10px] uppercase tracking-wider">สำเร็จแล้ว ✅</span>
                ) : (
                  <button
                    onClick={() => handleCompleteMission(m.id, m.points, m.coinsReward)}
                    className="rounded-lg bg-[#2D4B32] hover:bg-[#1E3322] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white active:scale-95 transition-all"
                  >
                    รับแต้ม (+{m.points} EXP)
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Premium Upgrade Section */}
        <div className="border-t border-stone-200 pt-4 flex flex-col gap-3.5">
          {isPremiumPass ? (
            <div className="flex items-center justify-center gap-2 rounded-2xl bg-amber-50 border border-amber-200/50 p-4 text-center">
              <span className="text-lg">👑</span>
              <p className="text-xs font-black text-amber-800 uppercase tracking-widest">
                เปิดใช้งานสถานะ PREMIUM PASS เรียบร้อยแล้ว!
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-2xl bg-white border border-stone-250 p-4 shadow-sm">
              <div className="max-w-[280px]">
                <h4 className="text-xs font-black text-[#C96E3A] uppercase tracking-wider">👑 อัปเกรดสถานะพรีเมียมบัตรผ่าน</h4>
                <p className="text-[10px] text-stone-500 mt-1 font-semibold leading-relaxed">
                  ปลดล็อกตู้สุ่มอาร์ตทอยลิมิเต็ด, สกินศาลพระภูมิแก้วหรูหรา และเหรียญโบนัสสะสมเพียบ!
                </p>
              </div>
              <button
                onClick={upgradePremiumPass}
                className="rounded-xl bg-[#C96E3A] hover:bg-[#b55c2b] text-white px-4 py-3 text-xs font-black uppercase tracking-widest shadow-md hover:brightness-110 active:scale-95 transition-all"
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
