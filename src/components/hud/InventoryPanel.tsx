'use client';

import React, { useState, useEffect } from 'react';
import { useContentStore } from '@/stores/useContentStore';
import { useInventoryStore } from '@/stores/useInventoryStore';
import { usePlayerStatsStore } from '@/stores/usePlayerStatsStore';
import PanelFrame from './PanelFrame';

const ITEM_EMOJIS: Record<string, string> = {
  wood: '🪵',
  coconut: '🍌', // note: coconut key represents banana fruit in the story
  stone: '🪨',
  knife: '🗡️',
  campfire: '⛩️',
  flashlight: '🔦',
  amulet: '🌸',
  'fallen-fruit': '🟢',
  'sacred-flower': '📄',
  'pearl-shell': '📜',
  sandalwood: '🏺',
  'magic-ring': '💍',
  'night-herb': '🌿',
  'boba-tea': '🧋',
  'elephant-pants': '🐘',
  'retro-sunglasses': '🕶️'
};

export default function InventoryPanel() {
  const quantities = useInventoryStore((state) => state.quantities);
  const equippedItems = useInventoryStore((state) => state.equippedItems);
  const toggleEquip = useInventoryStore((state) => state.toggleEquip);
  const getItem = useContentStore((state) => state.getItem);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 1024;
      setIsCollapsed(isMobile);
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    const timer = setTimeout(() => {
      setToastMsg(null);
    }, 2500);
    return () => clearTimeout(timer);
  };

  const handleUseItem = (itemKey: string) => {
    const qty = quantities[itemKey] ?? 0;
    if (qty <= 0) return;

    if (itemKey === 'coconut') {
      useInventoryStore.getState().remove('coconut', 1);
      usePlayerStatsStore.setState((state) => ({
        hunger: Math.min(100, state.hunger + 30),
        thirst: Math.min(100, state.thirst + 20),
      }));
      triggerToast('🍌 ทานกล้วยน้ำว้าแล้ว! (+30 หิว, +20 น้ำ)');
    } else if (itemKey === 'herbal-tonic') {
      useInventoryStore.getState().remove('herbal-tonic', 1);
      usePlayerStatsStore.setState((state) => ({
        health: Math.min(100, state.health + 50),
        thirst: Math.min(100, state.thirst + 30),
      }));
      triggerToast('🍶 ดื่มยาหอมห้าเจดีย์ป้าศรีแล้ว! ชื่นใจนักแล (+50 เลือด, +30 น้ำ)');
    } else if (itemKey === 'boba-tea') {
      useInventoryStore.getState().remove('boba-tea', 1);
      usePlayerStatsStore.setState((state) => ({
        hunger: Math.min(100, state.hunger + 50),
        thirst: Math.min(100, state.thirst + 50),
        health: Math.min(100, state.health + 25),
      }));
      triggerToast('🧋 ดื่มชานมไข่มุกพาสเทลแล้ว! (+50 หิว, +50 น้ำ, +25 เลือด)');
    } else if (itemKey === 'retro-sunglasses') {
      toggleEquip(itemKey);
      const isNowEquipped = !equippedItems[itemKey];
      triggerToast(isNowEquipped ? '🕶️ สวมใส่แว่น Y2K แล้ว! ชะลอหิว 20% อัตโนมัติ' : '🕶️ ถอดแว่น Y2K ออกแล้ว');
    } else if (itemKey === 'elephant-pants') {
      toggleEquip(itemKey);
      const isNowEquipped = !equippedItems[itemKey];
      triggerToast(isNowEquipped ? '🐘 สวมใส่กางเกงช้างแล้ว! วิ่งเร็วขึ้น +10% อัตโนมัติ' : '🐘 ถอดกางเกงช้างออกแล้ว');
    } else if (itemKey === 'flashlight') {
      triggerToast('🔦 ไฟฉายตราเสือจะเปิดใช้ยามค่ำคืนเพื่อขยายการมองเห็น');
    } else if (itemKey === 'amulet') {
      triggerToast('🌸 ยันต์คุ้มภัยจะทำงานเองเพื่อบล็อกดาเมจผีร้าย 100%');
    } else {
      triggerToast(`📦 เลือก ${getItem(itemKey)?.name ?? itemKey}`);
    }
  };

  const entries = Object.entries(quantities).filter(([, qty]) => qty > 0);

  if (isCollapsed) {
    return (
      <div className="pointer-events-auto absolute right-2 top-[48px] md:top-[68px] z-40 origin-top-right scale-[0.75] md:scale-100 select-none">
        <button
          onClick={() => setIsCollapsed(false)}
          className="bg-[#2D4B32] hover:bg-[#1E3322] border border-[#2D4B32]/30 rounded-full px-4 py-2 text-xs font-black text-white shadow-lg flex items-center gap-1.5 active:scale-95 transition-all"
        >
          🎒 <span>กระเป๋า ({entries.length})</span>
        </button>
      </div>
    );
  }

  return (
    <div className="pointer-events-auto absolute right-2 top-[48px] md:right-5 md:top-20 w-64 md:w-72 origin-top-right scale-[0.65] md:scale-100 z-40 select-none">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-max bg-[#2c5437] border-2 border-white/20 text-white font-extrabold text-[9px] px-3.5 py-1.5 rounded-full shadow-2xl animate-bounce z-50">
          {toastMsg}
        </div>
      )}

      <PanelFrame title="กระเป๋าเดินทาง" onClose={() => setIsCollapsed(true)}>
        {entries.length === 0 && <div className="text-xs text-stone-400 py-4 text-center">กระเป๋าว่างเปล่า</div>}
        
        {/* Inventory List */}
        <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto pr-1">
          {entries.map(([itemKey, qty]) => {
            const isSelected = selectedKey === itemKey;
            const isEquipped = equippedItems[itemKey] === true;
            const emoji = ITEM_EMOJIS[itemKey] || '📦';
            return (
              <div
                key={itemKey}
                onClick={() => setSelectedKey(isSelected ? null : itemKey)}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-[11px] font-black cursor-pointer transition-all border ${
                  isSelected 
                    ? 'bg-[#2D4B32]/10 border-[#2D4B32] text-[#2D4B32]' 
                    : 'bg-stone-100 border-stone-200 hover:bg-stone-150 text-stone-855'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{emoji}</span>
                  <span className="truncate max-w-[120px]">{getItem(itemKey)?.name ?? itemKey}</span>
                  {isEquipped && (
                    <span className="text-[7px] bg-[#2D4B32] text-white px-1.5 py-0.5 rounded font-black scale-90 tracking-wider">
                      สวมใส่
                    </span>
                  )}
                </div>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-black text-emerald-800">
                  {qty}
                </span>
              </div>
            );
          })}
        </div>

        {/* Selected Item Details */}
        {selectedKey && (quantities[selectedKey] ?? 0) > 0 && (() => {
          const item = getItem(selectedKey);
          const emoji = ITEM_EMOJIS[selectedKey] || '📦';
          const isUseable = ['coconut', 'boba-tea', 'herbal-tonic', 'retro-sunglasses', 'elephant-pants', 'flashlight', 'amulet'].includes(selectedKey);
          const isClothing = ['retro-sunglasses', 'elephant-pants'].includes(selectedKey);
          const isCurrentlyEquipped = equippedItems[selectedKey] === true;

          return (
            <div className="mt-3 p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-left animate-slide-up">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-lg leading-none">{emoji}</span>
                <span className="font-extrabold text-[10px] text-stone-850">{item?.name ?? selectedKey}</span>
              </div>
              <p className="text-[8px] text-stone-450 leading-relaxed font-bold mb-2">
                {item?.description ?? 'ไม่มีคำอธิบายสำหรับไอเทมนี้'}
              </p>
              {isUseable && (
                <button
                  type="button"
                  onClick={() => handleUseItem(selectedKey)}
                  className={`w-full py-1.5 rounded-lg text-white text-[9px] font-black tracking-wider uppercase shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1 ${
                    isCurrentlyEquipped 
                      ? 'bg-[#b37d4e] hover:bg-[#a66a39]'
                      : 'bg-[#2D4B32] hover:bg-[#1E3322]'
                  }`}
                >
                  {isClothing 
                    ? (isCurrentlyEquipped ? '❌ ถอดออก (Unequip)' : '🕶️ กดสวมใส่ (Wear)') 
                    : '⚡ กดใช้งาน (Use)'}
                </button>
              )}
            </div>
          );
        })()}
      </PanelFrame>
    </div>
  );
}
