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
  {
    key: 'amulet',
    name: 'ยันต์แดงป้องภัย',
    desc: 'ผ้ายันต์มงคลลงอักขระคุ้มภัย บล็อกดาเมจจากผีเงาดำได้ 100% ต่อแผ่น',
    price: 40,
    icon: '🌸',
  },
];

export default function OfferingShopPanel({ onClose }: { onClose: () => void }) {
  const { coins, deductCoins, add, quantities, remove, addCoins } = useInventoryStore();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const bananaQty = quantities['coconut'] ?? 0;
  const herbQty = quantities['night-herb'] ?? 0;

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

  const handleSellHerb = () => {
    setSuccessMsg(null);
    setErrorMsg(null);

    if (herbQty <= 0) {
      setErrorMsg('คุณไม่มี ว่านตานีราตรี ในกระเป๋าสำหรับขาย!');
      return;
    }

    const success = remove('night-herb', 1);
    if (success) {
      addCoins(50); // Earn 50 coins per night-herb
      setSuccessMsg('ขายว่านตานีราตรี 1 ต้นสำเร็จ! ได้รับ 50 🪙');
      setTimeout(() => {
        setSuccessMsg(null);
      }, 2500);
    }
  };

  const handleSellAllHerbs = () => {
    setSuccessMsg(null);
    setErrorMsg(null);

    if (herbQty <= 0) {
      setErrorMsg('คุณไม่มี ว่านตานีราตรี ในกระเป๋าสำหรับขาย!');
      return;
    }

    const totalEarned = herbQty * 50;
    const success = remove('night-herb', herbQty);
    if (success) {
      addCoins(totalEarned);
      setSuccessMsg(`ขายว่านตานีราตรีทั้งหมด ${herbQty} ต้นสำเร็จ! ได้รับ ${totalEarned} 🪙`);
      setTimeout(() => {
        setSuccessMsg(null);
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start overflow-y-auto bg-black/55 backdrop-blur-sm p-4 pointer-events-auto">
      <div className="my-auto relative w-full max-w-4xl rounded-3xl border border-stone-200 bg-[#FCFBF9] p-5 md:p-6 shadow-2xl text-stone-800 animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div>
            <h2 className="text-xl font-black uppercase tracking-wider text-[#2D4B32] flex items-center gap-2">
              <span>🛒</span> ร้านค้าครบวงจรของป้าศรี
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-[#2D4B32]/70 mt-0.5">
              อัปเกรดตัวละคร • ขายวัตถุดิบด่วน • บูชาของมงคล
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-stone-400 hover:text-stone-700 text-lg font-bold p-1 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Currency summary banner */}
        <div className="mt-4 flex items-center justify-between rounded-xl bg-[#2D4B32]/10 border border-[#2D4B32]/20 p-3 shadow-inner">
          <span className="text-xs font-black uppercase tracking-wider text-[#2D4B32]">
            กระเป๋าเงินเหรียญทองมูเตลู (Mutelu Coins)
          </span>
          <span className="font-mono text-sm font-black text-[#C96E3A] flex items-center gap-1">
            {coins} 🪙
          </span>
        </div>

        {/* Success/Error Alerts */}
        <div className="mt-2 min-h-[24px]">
          {successMsg && (
            <p className="text-center text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 py-1.5 rounded-lg animate-pulse">{successMsg}</p>
          )}
          {errorMsg && (
            <p className="text-center text-xs font-extrabold text-rose-600 bg-rose-50 border border-rose-200 py-1.5 rounded-lg animate-bounce">{errorMsg}</p>
          )}
        </div>

        {/* 3-Column Grid Container */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* COLUMN 1: Character Upgrades */}
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-stone-100 pb-2 mb-3">
                <span className="text-lg">👤</span>
                <h3 className="text-xs font-black uppercase tracking-wider text-stone-700">อัปเกรดตัวละคร</h3>
              </div>
              <p className="text-[9px] text-stone-400 font-bold mb-4">เพิ่มความสามารถถาวรให้ตัวละครของคุณ</p>
              
              <div className="space-y-4">
                {/* Elephant Pants */}
                <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-stone-50 border border-stone-150 relative">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🐘</span>
                    <div className="text-left">
                      <h4 className="text-xs font-black text-stone-850">กางเกงช้างสตรีทแวร์</h4>
                      <p className="text-[9px] text-stone-400 font-bold">ถวายเพื่อสวมใส่: เพิ่มความเร็ววิ่ง +10%</p>
                    </div>
                  </div>
                  {quantities['elephant-pants'] ? (
                    <div className="mt-2 w-full text-center py-1 rounded bg-emerald-50 border border-emerald-250 text-emerald-700 text-[9px] font-black uppercase tracking-wider">
                      ✅ สวมใส่อยู่ (Active)
                    </div>
                  ) : (
                    <button
                      onClick={() => handleBuy(SHOP_ITEMS.find(i => i.key === 'elephant-pants')!)}
                      className="mt-2 w-full rounded-lg bg-[#C96E3A] hover:bg-[#b55c2b] py-1.5 text-[9px] font-black uppercase tracking-widest text-white transition-all flex items-center justify-center gap-1"
                    >
                      <span>ซื้ออัปเกรด</span>
                      <span className="font-mono text-[8px] bg-black/10 px-1.5 py-0.5 rounded">150 🪙</span>
                    </button>
                  )}
                </div>

                {/* Y2K Sunglasses */}
                <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-stone-50 border border-stone-150 relative">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🕶️</span>
                    <div className="text-left">
                      <h4 className="text-xs font-black text-stone-850">แว่นตากันแดด Y2K</h4>
                      <p className="text-[9px] text-stone-400 font-bold">ลดอัตราหิวและกระหายน้ำลง 20%</p>
                    </div>
                  </div>
                  {quantities['retro-sunglasses'] ? (
                    <div className="mt-2 w-full text-center py-1 rounded bg-emerald-50 border border-emerald-250 text-emerald-700 text-[9px] font-black uppercase tracking-wider">
                      ✅ สวมใส่อยู่ (Active)
                    </div>
                  ) : (
                    <button
                      onClick={() => handleBuy(SHOP_ITEMS.find(i => i.key === 'retro-sunglasses')!)}
                      className="mt-2 w-full rounded-lg bg-[#C96E3A] hover:bg-[#b55c2b] py-1.5 text-[9px] font-black uppercase tracking-widest text-white transition-all flex items-center justify-center gap-1"
                    >
                      <span>ซื้ออัปเกรด</span>
                      <span className="font-mono text-[8px] bg-black/10 px-1.5 py-0.5 rounded">100 🪙</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Trade & Sell Crops */}
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-stone-100 pb-2 mb-3">
                <span className="text-lg">💰</span>
                <h3 className="text-xs font-black uppercase tracking-wider text-stone-700">ขายของป่าทั้งหมด</h3>
              </div>
              <p className="text-[9px] text-stone-400 font-bold mb-4">เทรดพืชผลและสมุนไพรในกระเป๋าเป้เป็นเหรียญทอง</p>

              <div className="space-y-4">
                {/* Banana Sale */}
                <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#2D4B32]/5 border border-[#2D4B32]/10 text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-black text-stone-850">🍌 ผลกล้วยน้ำว้า</h4>
                      <p className="text-[9px] text-[#2D4B32] font-black mt-0.5">ราคาขาย: 20 🪙 / ผล</p>
                    </div>
                    <span className="text-[10px] font-black text-stone-500 bg-white border border-stone-200 px-2 py-0.5 rounded">
                      มี: {bananaQty}
                    </span>
                  </div>
                  <div className="flex gap-2.5 mt-1">
                    <button
                      onClick={handleSellBanana}
                      disabled={bananaQty <= 0}
                      className="flex-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-200 disabled:text-stone-400 py-1.5 text-[9px] font-black uppercase tracking-widest text-white transition-all"
                    >
                      ขาย 1 ผล
                    </button>
                    <button
                      onClick={handleSellAllBananas}
                      disabled={bananaQty <= 0}
                      className="flex-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-200 disabled:text-stone-400 py-1.5 text-[9px] font-black uppercase tracking-widest text-white transition-all"
                    >
                      ขายหมด
                    </button>
                  </div>
                </div>

                {/* Night Herb Sale */}
                <div className="flex flex-col gap-2 p-3 rounded-xl bg-purple-50 border border-purple-100 text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-black text-stone-850">🌿 ว่านตานีราตรี</h4>
                      <p className="text-[9px] text-purple-700 font-black mt-0.5">ราคาขาย: 50 🪙 / ต้น</p>
                    </div>
                    <span className="text-[10px] font-black text-stone-500 bg-white border border-stone-200 px-2 py-0.5 rounded">
                      มี: {herbQty}
                    </span>
                  </div>
                  <div className="flex gap-2.5 mt-1">
                    <button
                      onClick={handleSellHerb}
                      disabled={herbQty <= 0}
                      className="flex-1 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:bg-stone-200 disabled:text-stone-400 py-1.5 text-[9px] font-black uppercase tracking-widest text-white transition-all"
                    >
                      ขาย 1 ต้น
                    </button>
                    <button
                      onClick={handleSellAllHerbs}
                      disabled={herbQty <= 0}
                      className="flex-1 rounded-lg bg-purple-750 hover:bg-purple-850 disabled:bg-stone-200 disabled:text-stone-400 py-1.5 text-[9px] font-black uppercase tracking-widest text-white transition-all"
                    >
                      ขายหมด
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 3: Mutelu Offerings */}
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-stone-100 pb-2 mb-3">
                <span className="text-lg">🛒</span>
                <h3 className="text-xs font-black uppercase tracking-wider text-stone-700">สินค้ามูเตลูทั่วไป</h3>
              </div>
              <p className="text-[9px] text-stone-400 font-bold mb-4">บูชาเครื่องเสนอและของแต่งศาลเพื่อขอรับพร</p>

              <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-0.5">
                {/* Boba Tea */}
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-stone-150 hover:bg-stone-50 transition-colors">
                  <div className="flex items-center gap-2.5 text-left">
                    <span className="text-2xl">🧋</span>
                    <div>
                      <h4 className="text-[11px] font-black text-stone-850 leading-none">ชานมไข่มุกพาสเทล</h4>
                      <p className="text-[8px] text-stone-400 font-bold mt-1 max-w-[120px]">ถวายแล้วเพิ่มความสนิทสนมตานี</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuy(SHOP_ITEMS.find(i => i.key === 'boba-tea')!)}
                    className="rounded-lg bg-[#C96E3A] hover:bg-[#b55c2b] px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-white shadow-sm flex flex-col items-center"
                  >
                    <span>ซื้อ</span>
                    <span className="text-[8px] font-mono mt-0.5">50 🪙</span>
                  </button>
                </div>

                {/* Amulet */}
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-stone-150 hover:bg-stone-50 transition-colors">
                  <div className="flex items-center gap-2.5 text-left">
                    <span className="text-2xl">🌸</span>
                    <div>
                      <h4 className="text-[11px] font-black text-stone-850 leading-none">ยันต์แดงป้องภัย</h4>
                      <p className="text-[8px] text-stone-400 font-bold mt-1 max-w-[120px]">บล็อกดาเมจจากผีร้ายกลางคืน 100%</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuy(SHOP_ITEMS.find(i => i.key === 'amulet')!)}
                    className="rounded-lg bg-[#C96E3A] hover:bg-[#b55c2b] px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-white shadow-sm flex flex-col items-center"
                  >
                    <span>ซื้อ</span>
                    <span className="text-[8px] font-mono mt-0.5">40 🪙</span>
                  </button>
                </div>

                {/* Muji Wallpaper */}
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-stone-150 hover:bg-stone-50 transition-colors">
                  <div className="flex items-center gap-2.5 text-left">
                    <span className="text-2xl">🪵</span>
                    <div>
                      <h4 className="text-[11px] font-black text-stone-850 leading-none">วอลเปเปอร์ศาลมูจิ</h4>
                      <p className="text-[8px] text-[#2D4B32] font-bold mt-1 max-w-[120px]">ยกระดับตกแต่งของศาลพระภูมิ</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuy(SHOP_ITEMS.find(i => i.key === 'muji-wallpaper')!)}
                    className="rounded-lg bg-[#C96E3A] hover:bg-[#b55c2b] px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-white shadow-sm flex flex-col items-center"
                  >
                    <span>ซื้อ</span>
                    <span className="text-[8px] font-mono mt-0.5">200 🪙</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
