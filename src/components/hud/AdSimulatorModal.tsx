'use client';

import { useState, useEffect } from 'react';
import { useInventoryStore } from '@/stores/useInventoryStore';

interface AdSimulatorModalProps {
  rewardCoins: number;
  onRewardClaimed: () => void;
  onClose: () => void;
}

export default function AdSimulatorModal({ rewardCoins, onRewardClaimed, onClose }: AdSimulatorModalProps) {
  const { addCoins } = useInventoryStore();
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const duration = 3000; // 3 seconds simulated ad duration
    const intervalTime = 100;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsFinished(true);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const handleClaim = () => {
    // Reward the player with double coins
    addCoins(rewardCoins);
    onRewardClaimed();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      {/* Smartphone Container Mockup */}
      <div className="relative w-full max-w-sm rounded-[36px] border-[12px] border-stone-850 bg-black p-4 shadow-2xl flex flex-col justify-between aspect-[9/16] overflow-hidden">
        
        {/* Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-stone-850 rounded-full z-10" />

        {/* Top Status Bar */}
        <div className="flex justify-between items-center text-[9px] font-bold text-stone-500 px-4 pt-1 select-none">
          <span>ThaiTelecom 5G</span>
          <span className="font-mono">03:30 AM</span>
          <span>🔋 100%</span>
        </div>

        {/* Video Area */}
        <div className="flex-1 my-4 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col items-center justify-center relative p-6 overflow-hidden">
          {/* Animated Background glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-emerald-500/10 to-transparent animate-pulse pointer-events-none" />

          {isFinished ? (
            <div className="text-center flex flex-col items-center gap-4 z-10 animate-scaleUp">
              <span className="text-5xl filter drop-shadow-md">🎉</span>
              <h3 className="text-sm font-black text-amber-400 uppercase tracking-widest">
                ดูวิดีโอสนับสนุนผู้พัฒนาสำเร็จ!
              </h3>
              <p className="text-[10px] text-stone-400 font-semibold max-w-[200px] leading-relaxed">
                ขอบคุณที่รับชมโฆษณา! สามารถกดปุ่มด้านล่างเพื่อเคลมรางวัลโบนัสเหรียญทองพิเศษได้ทันที
              </p>
            </div>
          ) : (
            <div className="text-center flex flex-col items-center gap-5 z-10">
              {/* Spinner icon */}
              <div className="h-12 w-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
              <div>
                <span className="rounded-full bg-stone-800/80 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
                  REWARDED AD SPONSOR
                </span>
                <h4 className="text-xs font-black text-stone-200 uppercase tracking-widest mt-2">
                  Mutelu Town: Idle Farm
                </h4>
                <p className="text-[9px] text-stone-500 mt-1 font-semibold leading-relaxed">
                  วิดีโอโฆษณาจำลองกำลังรันเพื่อแลกเหรียญรางวัลพิเศษ...
                </p>
              </div>
            </div>
          )}

          {/* Ad Progress Bar at Bottom */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1.5">
            <div className="flex justify-between text-[8px] font-bold text-stone-500">
              <span>{isFinished ? 'ดูโฆษณาเสร็จแล้ว' : 'กำลังเล่นโฆษณา...'}</span>
              <span className="font-mono">{Math.floor(progress)}%</span>
            </div>
            <div className="w-full bg-stone-950 rounded-full h-1.5 overflow-hidden border border-white/5">
              <div 
                className="bg-emerald-400 h-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="px-4 pb-2">
          {isFinished ? (
            <button
              onClick={handleClaim}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3 text-xs font-black uppercase tracking-widest text-black shadow-lg shadow-emerald-950/20 hover:brightness-110 active:scale-95 transition-all"
            >
              🪙 รับเหรียญโบนัส +{rewardCoins}
            </button>
          ) : (
            <button
              disabled
              className="w-full rounded-xl bg-stone-800 py-3 text-xs font-black uppercase tracking-widest text-stone-600 cursor-not-allowed border border-stone-800"
            >
              รอรับสิทธิ์ ({Math.max(1, Math.ceil(3 - (progress / 100) * 3))} วินาที)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
