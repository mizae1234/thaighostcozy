'use client';

import { useState } from 'react';
import { useInventoryStore } from '@/stores/useInventoryStore';

interface ShopItem {
  key: string;
  name: string;
  desc: string;
  price: number;
  icon: string;
}

const SHOP_ITEMS: ShopItem[] = [
  {
    key: 'boba-tea',
    name: 'ชานมไข่มุกพาสเทล',
    desc: 'ชานมไข่มุกหวานร้อยของโปรดตานีและกุมารทอง ถวายแล้วเพิ่มความสนิทสนม',
    price: 50,
    icon: '🧋',
  },
  {
    key: 'elephant-pants',
    name: 'กางเกงช้างสตรีทแวร์',
    desc: 'กางเกงลายช้างสุดฮิต ใส่แต่งตัวละครเพื่อเพิ่มความเร็วในการวิ่ง 10%',
    price: 150,
    icon: '🐘',
  },
  {
    key: 'retro-sunglasses',
    name: 'แว่นตากันแดด Y2K',
    desc: 'แว่นตากันแดดเลนส์ใสสุดเท่ สำหรับให้วิญญาณคู่หูใส่ถ่ายรูปสตรีมมิ่ง',
    price: 100,
    icon: '🕶️',
  },
  {
    key: 'muji-wallpaper',
    name: 'วอลเปเปอร์ศาลมูจิ',
    desc: 'วอลเปเปอร์ลายไม้สไตล์มินิมอล ช่วยยกระดับความหรูหราของศาลพระภูมิ',
    price: 200,
    icon: '🪵',
  },
];

export default function OfferingShopPanel({ onClose }: { onClose: () => void }) {
  const { coins, deductCoins, add, quantities, remove, addCoins } = useInventoryStore();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const bananaQty = quantities['coconut'] ?? 0;

  const handleBuy = (item: ShopItem) => {
    setSuccessMsg(null);
    setErrorMsg(null);

    const success = deductCoins(item.price);
    if (!success) {
      setErrorMsg(`เหรียญทองไม่เพียงพอสำหรับซื้อ ${item.name}!`);
      return;
    }

    // Add item to inventory
    add(item.key, 1);
    setSuccessMsg(`ซื้อ ${item.name} สำเร็จ! ได้เพิ่มเข้ากระเป๋าเป้แล้ว`);
    
    // Clear success message after 2 seconds
    setTimeout(() => {
      setSuccessMsg(null);
    }, 2500);
  };

  const handleSellBanana = () => {
    setSuccessMsg(null);
    setErrorMsg(null);

    if (bananaQty <= 0) {
      setErrorMsg('คุณไม่มี ผลกล้วยน้ำว้า ในกระเป๋าสำหรับขาย!');
      return;
    }

    const success = remove('coconut', 1);
    if (success) {
      addCoins(20); // Earn 20 coins per banana
      setSuccessMsg('ขายผลกล้วยน้ำว้า 1 ผลสำเร็จ! ได้รับ 20 🪙');
      setTimeout(() => {
        setSuccessMsg(null);
      }, 2500);
    }
  };

  const handleSellAllBananas = () => {
    setSuccessMsg(null);
    setErrorMsg(null);

    if (bananaQty <= 0) {
      setErrorMsg('คุณไม่มี ผลกล้วยน้ำว้า ในกระเป๋าสำหรับขาย!');
      return;
    }

    const totalEarned = bananaQty * 20;
    const success = remove('coconut', bananaQty);
    if (success) {
      addCoins(totalEarned);
      setSuccessMsg(`ขายกล้วยทั้งหมด ${bananaQty} ผลสำเร็จ! ได้รับ ${totalEarned} 🪙`);
      setTimeout(() => {
        setSuccessMsg(null);
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm pointer-events-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-stone-200 bg-[#FCFBF9] p-6 shadow-2xl text-stone-800">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div>
            <h2 className="text-xl font-black uppercase tracking-wider text-[#2D4B32]">🛒 ร้านขายของมูของป้าศรี</h2>
            <p className="text-[10px] uppercase tracking-widest text-[#2D4B32]/70 mt-0.5">Shop Daily Offerings & Trade Crops</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-stone-400 hover:text-stone-700 text-lg font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Currency Display & Sell Section */}
        <div className="mt-4 flex flex-col gap-2.5 rounded-2xl bg-white border border-stone-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-stone-500">เหรียญในกระเป๋าของคุณ</span>
            <span className="font-mono text-sm font-extrabold text-[#C96E3A]">{coins} 🪙</span>
          </div>

          <div className="border-t border-stone-100 pt-3 flex items-center justify-between">
            <div className="text-left">
              <span className="text-xs font-black text-stone-700">ขายผลผลิตกล้วยน้ำว้า</span>
              <p className="text-[10px] text-stone-400 font-bold">มีอยู่ในกระเป๋า: {bananaQty} ผล (ผลละ 20 🪙)</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSellBanana}
                disabled={bananaQty <= 0}
                className="rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-200 disabled:text-stone-400 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-sm transition-all"
              >
                ขาย 1 ผล
              </button>
              <button
                onClick={handleSellAllBananas}
                disabled={bananaQty <= 0}
                className="rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-200 disabled:text-stone-400 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-sm transition-all"
              >
                ขายทั้งหมด
              </button>
            </div>
          </div>
        </div>

        {/* Item List Header */}
        <h3 className="mt-5 text-[10px] font-black uppercase tracking-widest text-[#2D4B32] text-left">
          สินค้ามูเตลูที่มีจำหน่าย:
        </h3>

        {/* Item List */}
        <div className="mt-2 space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
          {SHOP_ITEMS.map((item) => (
            <div 
              key={item.key} 
              className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-3 hover:border-stone-300 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                <span className="text-3xl filter drop-shadow-md">{item.icon}</span>
                <div className="text-left">
                  <h4 className="text-xs font-black text-[#1E2922]">{item.name}</h4>
                  <p className="text-[10px] text-stone-500 mt-0.5 leading-relaxed font-bold max-w-[240px]">
                    {item.desc}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleBuy(item)}
                className="rounded-xl bg-[#C96E3A] hover:bg-[#b55c2b] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-sm active:scale-95 transition-all flex flex-col items-center"
              >
                <span>ซื้อ</span>
                <span className="font-mono text-[9px] mt-0.5">{item.price} 🪙</span>
              </button>
            </div>
          ))}
        </div>

        {/* Status Messages */}
        <div className="mt-4 min-h-[20px]">
          {successMsg && (
            <p className="text-center text-xs font-bold text-emerald-700 animate-pulse">{successMsg}</p>
          )}
          {errorMsg && (
            <p className="text-center text-xs font-bold text-rose-600 animate-bounce">{errorMsg}</p>
          )}
        </div>
      </div>
    </div>
  );
}
