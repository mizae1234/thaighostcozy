'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePlayerStatsStore } from '@/stores/usePlayerStatsStore';
import { getDeviceDetails } from '@/lib/deviceDetector';

interface NicknameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NicknameModal({ isOpen, onClose }: NicknameModalProps) {
  const router = useRouter();
  const [nickname, setNicknameState] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const setStoreNickname = usePlayerStatsStore((state) => state.setNickname);

  // Generate or retrieve playerId from localStorage
  const [playerId, setPlayerId] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('thaighost_player_id');
      if (!id) {
        id = `guest_${Math.random().toString(36).substring(2, 11)}`;
        localStorage.setItem('thaighost_player_id', id);
      }
      setPlayerId(id);

      // Prepopulate nickname if already stored locally
      const storedName = localStorage.getItem('thaighost_nickname');
      if (storedName) {
        setNicknameState(storedName);
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const deviceDetails = getDeviceDetails();

      const res = await fetch('/api/register-player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          nickname: nickname.trim(),
          deviceDetails,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Save locally
        localStorage.setItem('thaighost_nickname', nickname.trim());
        setStoreNickname(nickname.trim());

        // Redirect directly to the ghost mode scene for testing
        router.push(`/play/${data.storySlug}`);
      } else {
        setErrorMsg(data.error || 'เกิดข้อผิดพลาดในการลงทะเบียน');
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to submit registration:', error);
      setErrorMsg('ไม่สามารถเชื่อมต่ออินเทอร์เน็ตได้');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-[#fdf4e3] border-[3px] border-[#e3cb9f] rounded-[32px] p-8 shadow-2xl text-center flex flex-col items-center">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-amber-950/20 bg-white text-amber-950 font-bold transition-all hover:bg-amber-100 hover:scale-105 active:scale-95"
        >
          ✕
        </button>

        {/* Header Title */}
        <h2 className="text-3xl font-extrabold text-[#78350f] mt-4 mb-2 tracking-wide font-sans">
          ตั้งชื่อเล่น
        </h2>

        {/* Subtitle */}
        <p className="text-sm font-semibold text-[#854d0e]/85 mb-8 leading-relaxed max-w-sm">
          ตั้งชื่อเล่นเพื่อบันทึกความคืบหน้าและขึ้นกระดานผู้รอดชีวิต
        </p>

        {/* Error message */}
        {errorMsg && (
          <p className="text-xs font-bold text-red-600 mb-4 bg-red-100/50 py-1.5 px-4 rounded-full">
            ⚠️ {errorMsg}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col items-center">
          
          {/* Input Box */}
          <input
            type="text"
            required
            maxLength={25}
            value={nickname}
            onChange={(e) => setNicknameState(e.target.value)}
            placeholder="ชื่อเล่นของคุณ"
            className="w-full bg-[#fdfaf2] border-2 border-[#e6d0a7] rounded-2xl px-6 py-4 text-center text-lg font-bold text-[#451a03] placeholder-amber-900/30 outline-none transition-all focus:border-[#d97706] focus:ring-4 focus:ring-[#f59e0b]/20 shadow-inner"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !nickname.trim()}
            className="mt-6 w-full max-w-xs bg-gradient-to-b from-[#fcd34d] to-[#d97706] border-b-4 border-[#b45309] hover:from-[#fde047] hover:to-[#f59e0b] text-[#5c2d0b] font-extrabold text-lg py-3 px-8 rounded-full shadow-lg transition-all hover:scale-102 active:translate-y-0.5 active:border-b-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'กำลังเชื่อมต่อ...' : 'เริ่มเลย'}
          </button>
        </form>

        {/* Footer info text */}
        <p className="mt-8 text-xs font-semibold text-[#78350f]/60 max-w-sm leading-normal">
          บัญชีผู้เล่นรับเชิญ – ความคืบหน้าจะถูกบันทึกในเบราว์เซอร์นี้และซิงค์ขึ้นออนไลน์
        </p>
      </div>
    </div>
  );
}
