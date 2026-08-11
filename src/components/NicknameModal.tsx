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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in pointer-events-auto">
      {/* Modal Card - Cozy Glassmorphism */}
      <div className="relative w-full max-w-md bg-stone-950/80 border border-amber-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-md text-stone-200 text-center flex flex-col items-center">
        
        {/* Glow effect inside modal */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-amber-500/10 blur-[50px] pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-white text-lg font-bold transition-colors p-1"
        >
          ✕
        </button>

        {/* Header Title */}
        <h2 className="text-2xl font-black uppercase tracking-widest text-amber-400 mt-4 mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          ตั้งชื่อเล่นตัวละคร
        </h2>

        {/* Subtitle */}
        <p className="text-xs font-semibold text-stone-400 mb-8 leading-relaxed max-w-xs">
          ตั้งชื่อเล่นเพื่อใช้สำหรับบันทึกความคืบหน้าและประดับบนบอร์ดผู้สื่อวิญญาณ
        </p>

        {/* Error message */}
        {errorMsg && (
          <p className="text-xs font-bold text-rose-400 mb-4 bg-rose-950/40 border border-rose-900/30 py-1.5 px-4 rounded-full animate-pulse">
            ⚠️ {errorMsg}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          
          {/* Input Box */}
          <input
            type="text"
            required
            maxLength={20}
            value={nickname}
            onChange={(e) => setNicknameState(e.target.value)}
            placeholder="กรอกชื่อเล่นของคุณ..."
            className="w-full bg-stone-900/60 border border-stone-750/50 rounded-xl px-5 py-3.5 text-center text-base font-bold text-white placeholder-stone-600 outline-none transition-all focus:border-amber-500/70 focus:ring-4 focus:ring-amber-500/10 shadow-inner"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !nickname.trim()}
            className="mt-6 w-full bg-gradient-to-r from-amber-500 via-yellow-450 to-amber-500 hover:brightness-110 text-black font-black uppercase tracking-widest text-xs py-3.5 px-8 rounded-xl shadow-[0_4px_20px_rgba(245,158,11,0.25)] transition-all hover:scale-[1.02] active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'กำลังบันทึกสถิติ...' : '🎮 เริ่มการเดินทาง'}
          </button>
        </form>

        {/* Footer info text */}
        <p className="mt-8 text-[10px] font-bold text-stone-500 uppercase tracking-wider leading-relaxed">
          บัญชีผู้เล่นรับเชิญ – ความคืบหน้าจะบันทึกในเบราว์เซอร์นี้และซิงค์ขึ้นออนไลน์
        </p>
      </div>
    </div>
  );
}
