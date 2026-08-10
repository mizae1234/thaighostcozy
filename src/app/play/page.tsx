'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { EventBus } from '@/game/EventBus';
import type { PlayerMovedPayload, ResourceCollectedPayload } from '@/game/types';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { useContentStore } from '@/stores/useContentStore';
import { useInventoryStore } from '@/stores/useInventoryStore';
import { usePlayerStatsStore } from '@/stores/usePlayerStatsStore';
import StatsBar from '@/components/hud/StatsBar';
import InventoryPanel from '@/components/hud/InventoryPanel';
import CraftPanel from '@/components/hud/CraftPanel';

const PhaserGame = dynamic(() => import('@/game/PhaserGame'), { ssr: false });

const STORY_SLUG = 'pla-boo-thong';
const HUNGER_THIRST_TICK_MS = 3000;

export default function PlayPage() {
  useEffect(() => {
    useContentStore.getState().load(STORY_SLUG);

    const handlePlayerMoved = (payload: PlayerMovedPayload) => {
      usePlayerStore.getState().setFromGame(payload);
    };
    const handleResourceCollected = (payload: ResourceCollectedPayload) => {
      useInventoryStore.getState().add(payload.itemKey, payload.amount);
    };

    EventBus.on('player-moved', handlePlayerMoved);
    EventBus.on('resource-collected', handleResourceCollected);

    const decayInterval = setInterval(() => {
      usePlayerStatsStore.getState().tickDecay();
    }, HUNGER_THIRST_TICK_MS);

    return () => {
      EventBus.off('player-moved', handlePlayerMoved);
      EventBus.off('resource-collected', handleResourceCollected);
      clearInterval(decayInterval);
    };
  }, []);

  return (
    <main className="flex h-screen w-screen items-center justify-center bg-black">
      {/* Locked to the game's 16:9 base resolution so HUD margins stay
          correct relative to the visible canvas, regardless of the
          browser window's own aspect ratio (Phaser's own FIT letterboxing
          happens outside this box, not inside it). `aspect-video` alone can
          collapse to 0x0 as a bare flex child with no other sizing hint in
          some browsers — pairing explicit w-full/h-full with max-w/max-h
          computed from the *other* axis via the aspect-ratio forces a
          definite size deterministically. */}
      <div
        className="relative aspect-video h-full max-h-full w-full max-w-full"
        style={{ maxWidth: 'min(100%, calc(100vh * 16 / 9))', maxHeight: 'min(100%, calc(100vw * 9 / 16))' }}
      >
        <PhaserGame />
        <StatsBar />
        <InventoryPanel />
        <CraftPanel />
      </div>
    </main>
  );
}
