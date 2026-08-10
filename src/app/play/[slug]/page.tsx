'use client';

import dynamic from 'next/dynamic';
import { useEffect, use } from 'react';
import { EventBus } from '@/game/EventBus';
import type { PlayerMovedPayload, ResourceCollectedPayload } from '@/game/types';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { useContentStore } from '@/stores/useContentStore';
import { useInventoryStore } from '@/stores/useInventoryStore';
import { usePlayerStatsStore } from '@/stores/usePlayerStatsStore';
import { useQuestStore } from '@/stores/useQuestStore';
import StatsBar from '@/components/hud/StatsBar';
import InventoryPanel from '@/components/hud/InventoryPanel';
import CraftPanel from '@/components/hud/CraftPanel';
import DialogueOverlay from '@/components/hud/DialogueOverlay';
import EpisodeEndOverlay from '@/components/hud/EpisodeEndOverlay';
import QuestTracker from '@/components/hud/QuestTracker';
import InteractionPrompt from '@/components/hud/InteractionPrompt';

const PhaserGame = dynamic(() => import('@/game/PhaserGame'), { ssr: false });

const HUNGER_THIRST_TICK_MS = 3000;

interface PlayPageProps {
  params: Promise<{ slug: string }>;
}

export default function PlayPage({ params }: PlayPageProps) {
  const { slug } = use(params);

  useEffect(() => {
    useContentStore.getState().load(slug).then(() => {
      const quests = useContentStore.getState().quests;
      useQuestStore.getState().initQuests(quests);
    });

    const handlePlayerMoved = (payload: PlayerMovedPayload) => {
      usePlayerStore.getState().setFromGame(payload);
    };
    const handleResourceCollected = (payload: ResourceCollectedPayload) => {
      useInventoryStore.getState().add(payload.itemKey, payload.amount);
    };
    const handleBuildingPlaced = (payload: { recipeKey: string }) => {
      useQuestStore.getState().triggerBuildingPlaced(payload.recipeKey);
    };

    EventBus.on('player-moved', handlePlayerMoved);
    EventBus.on('resource-collected', handleResourceCollected);
    EventBus.on('building-placed', handleBuildingPlaced);

    const decayInterval = setInterval(() => {
      if (!useQuestStore.getState().isDialogueActive && !useQuestStore.getState().isEpisodeEnd) {
        usePlayerStatsStore.getState().tickDecay();
      }
    }, HUNGER_THIRST_TICK_MS);

    return () => {
      EventBus.off('player-moved', handlePlayerMoved);
      EventBus.off('resource-collected', handleResourceCollected);
      EventBus.off('building-placed', handleBuildingPlaced);
      clearInterval(decayInterval);
    };
  }, [slug]);

  return (
    <main className="flex h-screen w-screen items-center justify-center bg-black">
      {/* Locked to the game's 16:9 base resolution so HUD margins stay
          correct relative to the visible canvas */}
      <div
        className="relative aspect-video h-full max-h-full w-full max-w-full overflow-hidden"
        style={{ maxWidth: 'min(100%, calc(100vh * 16 / 9))', maxHeight: 'min(100%, calc(100vw * 9 / 16))' }}
      >
        <PhaserGame slug={slug} />
        <StatsBar />
        <InventoryPanel />
        <CraftPanel />
        <QuestTracker />
        <InteractionPrompt />
        <DialogueOverlay />
        <EpisodeEndOverlay />
      </div>
    </main>
  );
}
