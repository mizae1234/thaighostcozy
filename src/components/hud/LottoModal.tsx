'use client';

import React, { useState, useEffect } from 'react';
import PanelFrame from './PanelFrame';
import { useInventoryStore } from '@/stores/useInventoryStore';
import { useQuestStore } from '@/stores/useQuestStore';

interface LottoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LottoModal({ isOpen, onClose }: LottoModalProps) {
  const { coins, deductCoins } = useInventoryStore();
  const { currentStepIndex } = useQuestStore();

  const [inputNum, setInputNum] = useState('');
  const [activeTicket, setActiveTicket] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Check if player has already bought a ticket for this day
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ticket = localStorage.getItem('thaighost_lotto_ticket');
      const boughtDay = localStorage.getItem('thaighost_lotto_bought_day');
      
      if (ticket && boughtDay === String(currentStepIndex)) {
        setActiveTicket(ticket);
      } else {
        setActiveTicket(null);
        // Clear stale tickets from other days if they didn't sleep
        if (boughtDay !== String(currentStepIndex)) {
          localStorage.removeItem('thaighost_lotto_ticket');
          localStorage.removeItem('thaighost_lotto_bought_day');
        }
      }
    }
  }, [currentStepIndex, isOpen]);

  if (!isOpen) return null;

  const handleBuy = () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validate 2-digit input
    const cleanNum = inputNum.trim();
    if (!/^\d{2}$/.test(cleanNum)) {
      setErrorMsg('กรุณากรอกตัวเลข 2 หลักเท่านั้น! (เช่น 99 หรือ 05)');
      return;
    }

    if (coins < 50) {
      setErrorMsg('เหรียญสายมูไม่เพียงพอ! (ต้องการ 50 🪙)');
      return;
    }

    // Deduct coins and buy
    const success = deductCoins(50);
    if (success) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('thaighost_lotto_ticket', cleanNum);
        localStorage.setItem('thaighost_lotto_bought_day', String(currentStepIndex));
      }
      setActiveTicket(cleanNum);
      setSuccessMsg(`ซื้อสลากหมายเลข ${cleanNum} สำเร็จ! 🎟️`);
      setInputNum('');
    } else {
      setErrorMsg('เกิดข้อผิดพลาดในการซื้อสลาก');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-md my-auto">
        <PanelFrame title="🎟️ แผงขายสลากกินแบ่งสายมู" onClose={onClose}>
          <div className="flex flex-col p-2 select-none">
            <p className="text-xs text-stone-500 font-bold text-center mb-6 uppercase tracking-wider">
              ซื้อเลขเด็ด 2 ตัวท้าย (ราคาใบละ 50 🪙) ลุ้นรวยรับเช้าวันถัดไป!
            </p>

            <div className="bg-[#2D4B32]/10 border border-[#2D4B32]/30 rounded-2xl p-5 mb-5 text-center">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-widest block mb-1">
                เหรียญสายมูของคุณ:
              </span>
              <span className="text-2xl font-black text-[#C96E3A]">{coins} 🪙</span>
            </div>

            {activeTicket ? (
              <div className="bg-[#2D4B32]/10 border border-[#2D4B32]/30 rounded-2xl p-5 text-center mb-4">
                <span className="text-xs font-bold text-stone-500 block mb-2">
                  สลากที่คุณถือครองวันนี้:
                </span>
                <span className="inline-block text-4xl font-black text-[#C96E3A] border-4 border-[#C96E3A] rounded-2xl px-6 py-2 bg-amber-50 shadow-md tracking-widest animate-pulse">
                  {activeTicket}
                </span>
                <p className="text-xs font-extrabold text-[#2D4B32] mt-4 leading-relaxed">
                  รอลุ้นผลการออกรางวัลเลขท้าย 2 ตัว<br />เมื่อตื่นขึ้นมาในเช้าวันถัดไป ☀️
                </p>
                <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-3 text-[10px] font-bold text-yellow-700 mt-4 leading-normal">
                  💡 รางวัลเลขท้าย 2 ตัวที่ตรงกัน รับทันที 1,000 🪙!
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black text-[#2D4B32]">
                    กรอกตัวเลขที่ต้องการซื้อ (00 - 99):
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    placeholder="99"
                    value={inputNum}
                    onChange={(e) => setInputNum(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center text-3xl font-black border-2 border-stone-300 rounded-2xl py-3 focus:outline-none focus:border-[#2D4B32] text-stone-800 placeholder-stone-300 tracking-widest bg-stone-50"
                  />
                </div>

                {errorMsg && (
                  <div className="bg-rose-50 border border-rose-300 text-rose-700 text-xs font-bold rounded-xl p-3 text-center">
                    ⚠️ {errorMsg}
                  </div>
                )}

                <button
                  onClick={handleBuy}
                  className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 py-3.5 text-xs font-black uppercase tracking-widest text-black shadow-md transition-all active:scale-98"
                >
                  ซื้อสลากนำโชค (50 🪙) 🎟️
                </button>
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-bold rounded-xl p-3 text-center mt-4">
                ✅ {successMsg}
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full mt-4 rounded-xl border border-stone-300 text-stone-600 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-stone-50 transition-colors text-center"
            >
              ย้อนกลับ
            </button>
          </div>
        </PanelFrame>
      </div>
    </div>
  );
}
