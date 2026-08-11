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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4 animate-fade-in pointer-events-auto">
      {/* Modal Card - Forest Noir Cream Theme */}
      <div className="relative w-full max-w-md bg-[#FCFBF9] border border-stone-200 rounded-3xl p-8 shadow-2xl text-[#1E2922] text-center flex flex-col items-center">
        
        {/* New Player Badge overlaying the top-right */}
        <div className="absolute -top-3 right-8 bg-[#C96E3A] text-white text-[9px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md">
          ผู้สื่อวิญญาณใหม่
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 text-lg font-bold transition-colors p-1"
        >
          ✕
        </button>

        {/* Header Title */}
        <h2 className="text-xl font-black text-[#1E2922] mt-4 mb-2">
          ตั้งชื่อผู้สื่อวิญญาณของคุณ
        </h2>

        {/* Subtitle */}
        <p className="text-xs font-bold text-stone-500 mb-8 leading-relaxed max-w-xs">
          ตั้งชื่อเล่นของคุณเพื่อก้าวเข้าสู่ความลี้ลับแห่งสวนกล้วยพนมสารคาม
        </p>

        {/* Error message */}
        {errorMsg && (
          <p className="text-xs font-bold text-[#C96E3A] mb-4 bg-[#C96E3A]/10 border border-[#C96E3A]/20 py-1.5 px-4 rounded-full animate-pulse">
            ⚠️ {errorMsg}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          
          {/* Input Box - Underlined only */}
          <input
            type="text"
            required
            maxLength={20}
            value={nickname}
            onChange={(e) => setNicknameState(e.target.value)}
            placeholder="กรอกชื่อเล่นของคุณ..."
            className="w-full bg-[#FCFBF9] border-b-2 border-stone-200 py-3 text-center text-lg font-bold text-[#1E2922] placeholder-stone-400 outline-none transition-all focus:border-[#2D4B32] text-center"
          />

          {/* Submit Button - Terracotta Pill */}
          <button
            type="submit"
            disabled={loading || !nickname.trim()}
            className="mt-8 w-full bg-[#C96E3A] hover:bg-[#b55c2b] text-white font-black uppercase tracking-widest text-xs py-3.5 px-8 rounded-full shadow-[0_4px_12px_rgba(201,110,58,0.2)] transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <span className="text-sm">🍃</span>
            <span>{loading ? 'กำลังเริ่มการเดินทาง...' : 'เริ่มการเดินทาง'}</span>
          </button>
        </form>

        {/* Footer info text */}
        <p className="mt-8 text-[9px] font-black text-stone-400 uppercase tracking-widest leading-relaxed">
          ผู้เล่นรับเชิญ – ข้อมูลสถิติจะถูกบันทึกบนเบราว์เซอร์นี้และซิงค์ออนไลน์
        </p>
      </div>
    </div>
  );
}
