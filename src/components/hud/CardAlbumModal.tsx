'use client';

import React from 'react';
import { useInventoryStore } from '@/stores/useInventoryStore';

interface GhostCard {
  key: string;
  name: string;
  rarity: string;
  rarityColor: string;
  buff: string;
  img: string;
}

const GHOST_CARDS: GhostCard[] = [
  {
    key: 'tani',
    name: 'นางตานีสายแฟ',
    rarity: 'SSR',
    rarityColor: 'text-rose-500 border-rose-500/30 bg-rose-500/10',
    buff: '⚡ พรตานีรักษ์โลก: เพิ่มความเร็วการวิ่งของตัวละคร 20%',
    img: '/assets/stories/ghost-whisperer/gacha/card-tani.png',
  },
  {
    key: 'kuman',
    name: 'กุมารทองติดแท็บเล็ต',
    rarity: 'SR',
    rarityColor: 'text-amber-500 border-amber-500/30 bg-amber-500/10',
    buff: '🎮 พรกุมารเจมเมอร์: แฮกความสามารถลดความหิวช้าลง 20%',
    img: '/assets/stories/ghost-whisperer/gacha/card-kuman.png',
  },
  {
    key: 'pob',
    name: 'ปอบออฟฟิศซินโดรม',
    rarity: 'R',
    rarityColor: 'text-blue-500 border-blue-500/30 bg-blue-500/10',
    buff: '☕ พรปอบเบิร์นเอาท์: เพิ่มปริมาณการเก็บผลผลิต +1 หน่วย',
    img: '/assets/stories/ghost-whisperer/gacha/card-pob.png',
  },
  {
    key: 'naga',
    name: 'พญานาคน้อย',
    rarity: 'UR',
    rarityColor: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10',
    buff: '🌊 พรวารีเทพ: ค่าความกระหายน้ำลดช้าลง 30%',
    img: '/assets/stories/ghost-whisperer/gacha/card-naga.png',
  },
];

interface CardAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CardAlbumModal({ isOpen, onClose }: CardAlbumModalProps) {
  const { unlockedGhosts } = useInventoryStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm pointer-events-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-stone-200 bg-[#FCFBF9] p-8 shadow-2xl text-stone-800 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 text-lg font-bold transition-colors p-1"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black uppercase tracking-wider text-[#2D4B32]">
            📖 สมุดสะสมการ์ดวิญญาณอารักษ์
          </h2>
          <p className="text-xs font-bold text-stone-500 mt-1 uppercase tracking-wider">
            รวบรวมเพื่ออัญเชิญผีไทยและรับพรบัฟสเตตัสช่วยเหลือพิเศษ
          </p>
          <div className="inline-block mt-3 bg-[#2D4B32]/10 border border-[#2D4B32]/20 rounded-full px-4 py-1 text-xs font-bold text-[#2D4B32]">
            ปลดล็อกแล้ว: <span className="font-extrabold">{unlockedGhosts.length}</span> / {GHOST_CARDS.length} ใบ
          </div>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {GHOST_CARDS.map((card) => {
            const isUnlocked = unlockedGhosts.includes(card.key);

            return (
              <div
                key={card.key}
                className={`relative flex flex-col items-center rounded-2xl border p-4 text-center transition-all bg-[#FCFBF9] ${
                  isUnlocked
                    ? 'border-[#2D4B32]/30 shadow-md scale-100 hover:scale-[1.02]'
                    : 'border-stone-200 opacity-45 grayscale filter'
                }`}
              >
                {/* Image display */}
                <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                  <img
                    src={card.img}
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/35 flex items-center justify-center text-white">
                      <span className="text-3xl">🔒</span>
                    </div>
                  )}
                </div>

                {/* Card details */}
                <div className="mt-4 flex flex-col items-center w-full">
                  <span
                    className={`rounded-full border px-3 py-0.5 text-[10px] font-extrabold tracking-wider ${card.rarityColor} mb-1`}
                  >
                    {card.rarity}
                  </span>
                  <h3 className="text-sm font-black text-[#1E2922] mt-1">
                    {card.name}
                  </h3>
                  
                  {isUnlocked ? (
                    <p className="mt-2 text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-250/50 rounded-lg p-2 leading-relaxed w-full">
                      {card.buff}
                    </p>
                  ) : (
                    <p className="mt-2 text-[11px] font-bold text-stone-400 leading-relaxed italic">
                      สุ่มหาได้จากตู้สุ่มสายมู
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Passive Buff Info */}
        <div className="mt-8 bg-stone-50 border border-stone-200 rounded-2xl p-5 text-left">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#2D4B32] mb-3">
            🔮 สิทธิประโยชน์บัฟจากการเปิดใช้งานการ์ด (Active Passive Buffs):
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-bold text-stone-600">
            <div className="flex items-center gap-2">
              <span className={unlockedGhosts.includes('tani') ? 'text-[#2D4B32]' : 'text-stone-300'}>
                {unlockedGhosts.includes('tani') ? '✅' : '❌'}
              </span>
              <span>วิ่งเร็วขึ้น 20% (นางตานี)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={unlockedGhosts.includes('kuman') ? 'text-[#2D4B32]' : 'text-stone-300'}>
                {unlockedGhosts.includes('kuman') ? '✅' : '❌'}
              </span>
              <span>ลดอัตราหิวช้าลง 20% (กุมารทอง)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={unlockedGhosts.includes('pob') ? 'text-[#2D4B32]' : 'text-stone-300'}>
                {unlockedGhosts.includes('pob') ? '✅' : '❌'}
              </span>
              <span>ฟาร์มผลผลิตขุดได้ +1 ชิ้น (ปอบ)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={unlockedGhosts.includes('naga') ? 'text-[#2D4B32]' : 'text-stone-300'}>
                {unlockedGhosts.includes('naga') ? '✅' : '❌'}
              </span>
              <span>ลดอัตรากระหายน้ำช้าลง 30% (พญานาค)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
