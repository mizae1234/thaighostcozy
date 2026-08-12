'use client';

import React, { useState, useEffect } from 'react';
import PanelFrame from './PanelFrame';
import { useInventoryStore } from '@/stores/useInventoryStore';
import { usePlayerStatsStore } from '@/stores/usePlayerStatsStore';
import { useQuestStore } from '@/stores/useQuestStore';

interface SiansiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Fortune {
  number: number;
  title: string;
  desc: string;
  rewardText: string;
  effect: () => void;
}

export default function SiansiModal({ isOpen, onClose }: SiansiModalProps) {
  const { currentStepIndex } = useQuestStore();
  const { addCoins, add } = useInventoryStore();

  const [isShaking, setIsShaking] = useState(false);
  const [hasRolledToday, setHasRolledToday] = useState(false);
  const [result, setResult] = useState<Fortune | null>(null);

  // Check if already rolled today
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lastRolledDay = localStorage.getItem('thaighost_last_siansi_day');
      if (lastRolledDay === String(currentStepIndex)) {
        setHasRolledToday(true);
      } else {
        setHasRolledToday(false);
      }
    }
  }, [currentStepIndex, isOpen]);

  if (!isOpen) return null;

  const FORTUNES: Fortune[] = [
    {
      number: 1,
      title: 'ดวงมหาเฮงปังปุริเย่',
      desc: 'ดวงชะตาพุ่งแรงดั่งบั้งไฟพญานาค หลวงพ่อดลบันดาลให้ป้าศรีเอ็นดู มอบเหรียญและเครื่องรางช่วยเหลือคนขยัน!',
      rewardText: 'ได้รับ 100 🪙 และ มีดพร้าทำสวน 🔪',
      effect: () => {
        addCoins(100);
        add('knife', 1);
      }
    },
    {
      number: 2,
      title: 'ตานีเมตตาอภิบาล',
      desc: 'แม่นางตานีร่างดีเห็นใจในความเหน็ดเหนื่อย แอบโบกใบกล้วยพัดพาไอเย็นมาปัดเป่าความอ่อนล้า ดับกระหายล้างความเหนื่อย',
      rewardText: 'ฟื้นฟูพลังชีวิตและดับกระหายจนเต็ม 💚',
      effect: () => {
        usePlayerStatsStore.setState({
          health: 100,
          thirst: 100
        });
      }
    },
    {
      number: 3,
      title: 'กุมารเจมเมอร์แฮกโชค',
      desc: 'กุมารทองติดแท็บเล็ตแอบแฮกระบบคลังสวนกล้วย เสกวัสดุทำสวนและของป่ามาหล่นใส่หัวผู้เล่นเสียงดังปึก!',
      rewardText: 'ได้รับ ไม้ 🪵 +5 และ หิน 🪨 +5',
      effect: () => {
        add('wood', 5);
        add('stone', 5);
      }
    },
    {
      number: 4,
      title: 'ปอบออฟฟิศสงเคราะห์',
      desc: 'ผีปอบผู้ปวดหลังขอแลกเปลี่ยนนวดบ่าไหล่ให้คุณ แลกกับการรับประทานความเหนื่อยล้า ดับกระหายคลายความหิวโหย',
      rewardText: 'ฟื้นฟูความหิวและพลังชีวิต +50 🍖',
      effect: () => {
        usePlayerStatsStore.setState((state) => ({
          health: Math.min(100, state.health + 30),
          hunger: Math.min(100, state.hunger + 50)
        }));
      }
    },
    {
      number: 5,
      title: 'ธรรมมะคุ้มครองใจ',
      desc: 'หลวงพี่กวาดลานวัดแล้วทักทายอย่างมีเมตตา เตือนสติให้เราก้าวเดินอย่างมั่นคง จิตใจแจ่มใสไม่หวาดกลัวต่อสิ่งชั่วร้าย',
      rewardText: 'ได้รับเครื่องรางกันภัย (Amulet) 🧧 1 ชิ้น',
      effect: () => {
        add('amulet', 1);
      }
    },
    {
      number: 6,
      title: 'กล้วยนำโชคหล่นทับ',
      desc: 'เดินผ่านเครือกล้วยตกทองโบราณแล้วเกิดลมพัดกล้วยสุกหล่นใส่กระเป๋าฟรี ๆ ป้าศรีเห็นยังต้องทึ่ง!',
      rewardText: 'ได้รับ ผลกล้วยน้ำว้า 🍌 +5 และ 30 🪙',
      effect: () => {
        add('banana', 5);
        addCoins(30);
      }
    },
    {
      number: 7,
      title: 'วิญญาณป้องภัยสถิต',
      desc: 'เจ้าที่เจ้าทางและเทวดาอารักษ์ลานวัดแผ่เมตตาจิต ล้อมสลัดปัดเป่าเงามืดรอบตัวคุณให้เบาบางลงยามเดินลุยความมืด',
      rewardText: 'ได้รับเหรียญสายมูก้นถุง 80 🪙',
      effect: () => {
        addCoins(80);
      }
    },
    {
      number: 8,
      title: 'ดวงคนดีทางสายกลาง',
      desc: 'ชีวิตเรียกง่ายไม่โลดโผน หลวงพ่อสอนว่าความพอดีคือลาภอันประเสริฐ เดินหน้าทำงานสุจริตต่อไปจักเจริญรุ่งเรือง',
      rewardText: 'ได้รับเงินกุศลหนุนดวง 50 🪙',
      effect: () => {
        addCoins(50);
      }
    },
    {
      number: 9,
      title: 'พญานาคน้ำบันดาลดับร้อน',
      desc: 'พญานาครุ่นเยาว์พ่นน้ำมนต์ชุ่มฉ่ำลงสู่หน้าผากคุณ คลายความร้อนและบำรุงหัวใจให้เต้นคงที่ แข็งแรงสู้ภารกิจ',
      rewardText: 'ฟื้นฟูหลอดกระหายน้ำ Thirst เต็ม 100% 🌊',
      effect: () => {
        usePlayerStatsStore.setState({
          thirst: 100
        });
      }
    },
    {
      number: 10,
      title: 'น้ำมนต์ป้าศรีนำโชค',
      desc: 'ป้าศรีนำน้ำมนต์ปลุกเสกผสมเกสรดอกมะลิมาพรมใส่หัว ดับกลิ่นอายความหวาดกลัว เพิ่มพลังเดินตัวปลิวไร้คนกวน',
      rewardText: 'ได้รับเหรียญสมทบทุน 60 🪙',
      effect: () => {
        addCoins(60);
      }
    }
  ];

  const handleShake = () => {
    if (isShaking || hasRolledToday) return;

    setIsShaking(true);
    setResult(null);

    // Shake animation duration: 2s
    setTimeout(() => {
      const idx = Math.floor(Math.random() * FORTUNES.length);
      const selected = FORTUNES[idx];
      selected.effect();
      setResult(selected);
      setIsShaking(false);
      setHasRolledToday(true);

      // Save rolled state to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('thaighost_last_siansi_day', String(currentStepIndex));
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-md my-auto">
        <PanelFrame title="🎋 เซียมซีเสี่ยงดวงรายวัน" onClose={onClose}>
          <div className="flex flex-col items-center text-center p-2 select-none">
            <p className="text-xs font-bold text-stone-500 mb-6 uppercase tracking-wider">
              เขย่ากระบอกไม้ไผ่โบราณที่ลานวัดเพื่อขอพรนำโชค (วันละ 1 ครั้ง)
            </p>

            {/* Shake Cup Graphic Area */}
            <div className="relative h-44 flex items-center justify-center mb-6">
              <div
                className={`text-6xl filter drop-shadow-lg transition-transform ${
                  isShaking ? 'animate-shake' : 'hover:scale-105 active:scale-95 cursor-pointer'
                }`}
                onClick={handleShake}
              >
                🏮
              </div>
              {isShaking && (
                <div className="absolute bottom-0 text-[10px] font-black text-amber-600 bg-amber-100 border border-amber-300 rounded-full px-3 py-1 animate-pulse uppercase tracking-widest">
                  กริ๊ก ๆ ๆ... กำลังเขย่าดวงชะตา...
                </div>
              )}
            </div>

            {/* Roll Actions */}
            {!result ? (
              <div className="w-full">
                {hasRolledToday ? (
                  <div className="bg-stone-100 border border-stone-300 rounded-2xl p-4 text-stone-500 text-xs font-bold">
                    🔒 คุณได้เสี่ยงเซียมซีของวันนี้นำโชคไปแล้ว! แวะมาเขย่าใหม่ในเช้าวันถัดไปนะครับ ☀️
                  </div>
                ) : (
                  <button
                    onClick={handleShake}
                    disabled={isShaking}
                    className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 py-3 text-xs font-black uppercase tracking-widest text-black shadow-md transition-all active:scale-98"
                  >
                    {isShaking ? 'เขย่าดวง...' : 'เริ่มต้นเขย่าเซียมซี 🎋'}
                  </button>
                )}
              </div>
            ) : (
              <div className="w-full bg-[#2D4B32]/10 border border-[#2D4B32]/30 rounded-2xl p-5 text-left animate-fadeIn">
                <div className="flex items-center gap-3 border-b border-[#2D4B32]/20 pb-3 mb-3">
                  <span className="text-2xl font-black text-[#C96E3A] bg-amber-100 rounded-xl px-3 py-1 border border-amber-300">
                    ใบที่ {result.number}
                  </span>
                  <h4 className="text-sm font-black text-[#2D4B32]">{result.title}</h4>
                </div>
                
                <p className="text-xs text-stone-600 font-bold leading-relaxed mb-4">
                  {result.desc}
                </p>

                <div className="bg-white/80 border border-[#2D4B32]/20 rounded-xl p-3 text-xs font-black text-[#C96E3A] flex items-center justify-between">
                  <span>🎁 รางวัลเกื้อหนุน:</span>
                  <span>{result.rewardText}</span>
                </div>

                <button
                  onClick={onClose}
                  className="w-full mt-5 rounded-xl bg-[#2D4B32] text-white py-2.5 text-xs font-black uppercase tracking-widest hover:bg-[#253f2a] transition-colors"
                >
                  น้อมรับคำทำนาย 🙏
                </button>
              </div>
            )}
          </div>
        </PanelFrame>
      </div>

      {/* Tailwind Shake Keyframes injection */}
      <style jsx global>{`
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(0px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          55% { transform: translate(-1px, 2px) rotate(-1deg); }
          65% { transform: translate(-3px, 1px) rotate(0deg); }
          75% { transform: translate(2px, 1px) rotate(-1deg); }
          85% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(2px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        .animate-shake {
          animation: shake 0.4s infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
