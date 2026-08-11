'use client';

import dynamic from 'next/dynamic';
import { useEffect, use, useState } from 'react';
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

// Cozy Gen Z Panels
import GachaPanel from '@/components/hud/GachaPanel';
import MuteluPassPanel from '@/components/hud/MuteluPassPanel';
import OfferingShopPanel from '@/components/hud/OfferingShopPanel';
import AdSimulatorModal from '@/components/hud/AdSimulatorModal';
import CardAlbumModal from '@/components/hud/CardAlbumModal';

const PhaserGame = dynamic(() => import('@/game/PhaserGame'), { ssr: false });

const HUNGER_THIRST_TICK_MS = 3000;

interface PlayPageProps {
  params: Promise<{ slug: string }>;
}

export default function PlayPage({ params }: PlayPageProps) {
  const { slug } = use(params);
  
  // Panel Toggles
  const [showGacha, setShowGacha] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [showCardAlbum, setShowCardAlbum] = useState(false);
  const { coins } = useInventoryStore();

  // Fainting Respawn States
  const [showFaintOverlay, setShowFaintOverlay] = useState(false);
  const [faintPenaltyText, setFaintPenaltyText] = useState('');

  const [isMobile, setIsMobile] = useState(false);
  const [showCraftModal, setShowCraftModal] = useState(false);
  const [currentScene, setCurrentScene] = useState<unknown>(null);
  const [virtualKeys, setVirtualKeys] = useState({
    up: false,
    down: false,
    left: false,
    right: false
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent;
      const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) || window.innerWidth < 1024;
      setIsMobile(mobileCheck);
    }
  }, []);

  useEffect(() => {
    const handleSceneReady = (scene: unknown) => {
      setCurrentScene(scene);
    };
    EventBus.on('current-scene-ready', handleSceneReady);
    return () => {
      EventBus.off('current-scene-ready', handleSceneReady);
    };
  }, []);

  useEffect(() => {
    if (currentScene && typeof currentScene === 'object' && 'registry' in currentScene) {
      const reg = (currentScene as { registry: { set: (key: string, value: boolean) => void } }).registry;
      reg.set('virtual-up', virtualKeys.up);
      reg.set('virtual-down', virtualKeys.down);
      reg.set('virtual-left', virtualKeys.left);
      reg.set('virtual-right', virtualKeys.right);
    }
  }, [virtualKeys, currentScene]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCoins = localStorage.getItem('thaighost_coins');
      if (storedCoins) {
        useInventoryStore.setState({ coins: parseInt(storedCoins, 10) });
      }
      const storedGhosts = localStorage.getItem('thaighost_unlocked_ghosts');
      if (storedGhosts) {
        useInventoryStore.setState({ unlockedGhosts: JSON.parse(storedGhosts) });
      }
    }

    useContentStore.getState().load(slug).then(() => {
      const quests = useContentStore.getState().quests;
      useQuestStore.getState().initQuests(quests);
    });

    const handlePlayerMoved = (payload: PlayerMovedPayload) => {
      usePlayerStore.getState().setFromGame(payload);
    };
    
    const handleResourceCollected = (payload: ResourceCollectedPayload) => {
      const unlocked = useInventoryStore.getState().unlockedGhosts;
      const hasPob = unlocked.includes('pob');
      const finalAmount = hasPob ? payload.amount + 1 : payload.amount;
      
      useInventoryStore.getState().add(payload.itemKey, finalAmount);
      
      // Cozy Mode Reward: Give 10 coins for every item harvested!
      if (slug === 'ghost-whisperer') {
        useInventoryStore.getState().addCoins(10);
      }
    };
    
    const handleBuildingPlaced = (payload: { recipeKey: string }) => {
      useQuestStore.getState().triggerBuildingPlaced(payload.recipeKey);
    };

    const handleOpenShop = () => {
      setShowShop(true);
    };

    EventBus.on('player-moved', handlePlayerMoved);
    EventBus.on('resource-collected', handleResourceCollected);
    EventBus.on('building-placed', handleBuildingPlaced);
    EventBus.on('open-shop-ui', handleOpenShop);

    const decayInterval = setInterval(() => {
      if (!useQuestStore.getState().isDialogueActive && !useQuestStore.getState().isEpisodeEnd) {
        usePlayerStatsStore.getState().tickDecay();
        
        // Check health depletion
        const health = usePlayerStatsStore.getState().health;
        if (health <= 0) {
          // Teleport player back to spawn near house
          EventBus.emit('respawn-player', undefined);
          
          // Reset player stats
          usePlayerStatsStore.getState().respawn();

          // Deduct penalty items (1 wood, 1 stone if available)
          const store = useInventoryStore.getState();
          const woodQty = store.quantities['wood'] ?? 0;
          const stoneQty = store.quantities['stone'] ?? 0;
          let penaltyMsg = '';
          if (woodQty > 0) {
            store.remove('wood', 1);
            penaltyMsg += '🪵 แผ่นไม้ x1 ';
          }
          if (stoneQty > 0) {
            store.remove('stone', 1);
            penaltyMsg += '🪨 หิน x1';
          }

          setFaintPenaltyText(penaltyMsg ? `เสียไอเทม: ${penaltyMsg}` : 'ไม่เสียไอเทม (ไม่มีวัตถุดิบในกระเป๋า)');
          setShowFaintOverlay(true);

          setTimeout(() => {
            setShowFaintOverlay(false);
          }, 3500);
        }
      }
    }, HUNGER_THIRST_TICK_MS);

    return () => {
      EventBus.off('player-moved', handlePlayerMoved);
      EventBus.off('resource-collected', handleResourceCollected);
      EventBus.off('building-placed', handleBuildingPlaced);
      EventBus.off('open-shop-ui', handleOpenShop);
      clearInterval(decayInterval);
    };
  }, [slug]);

  return (
    <main className="flex h-screen w-screen items-center justify-center bg-black select-none">
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

        {/* Fainting Overlay */}
        {showFaintOverlay && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 text-center animate-fade-in pointer-events-auto">
            <span className="text-4xl animate-bounce">💤</span>
            <h2 className="mt-4 text-lg font-black text-red-500 uppercase tracking-widest">
              คุณหมดสติเนื่องจากขาดน้ำและอาหาร!
            </h2>
            <p className="mt-2 text-xs text-stone-400 font-medium">
              ตื่นขึ้นมาอีกครั้งที่บ้านสวน และมีสิ่งของตกหล่นสูญหาย...
            </p>
            <p className="mt-4 text-[10px] font-black text-amber-400 bg-amber-950/50 border border-amber-900/50 rounded-full px-4 py-1.5 uppercase tracking-wider">
              {faintPenaltyText}
            </p>
          </div>
        )}

        {/* Cozy Gen Z HUD Menu Bar (Conditionally loaded for ghost-whisperer) */}
        {slug === 'ghost-whisperer' && (
          <>
            {/* Top Right Control bar */}
            <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
              {/* Coin Counter */}
              <div className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-black/60 px-3 py-1.5 shadow-md backdrop-blur-sm">
                <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Mutelu 🪙</span>
                <span className="font-mono text-xs font-black text-amber-400">{coins}</span>
              </div>

              {/* Gacha button */}
              <button
                onClick={() => setShowGacha(true)}
                className="rounded-full border border-purple-500/30 bg-purple-950/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-purple-200 shadow-md backdrop-blur-sm hover:brightness-110 active:scale-95 transition-all"
              >
                🔮 สุ่มกาชา
              </button>

              {/* Card Album button */}
              <button
                onClick={() => setShowCardAlbum(true)}
                className="rounded-full border border-sky-500/30 bg-sky-950/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-sky-200 shadow-md backdrop-blur-sm hover:brightness-110 active:scale-95 transition-all"
              >
                📖 สมุดการ์ด
              </button>

              {/* Pass button */}
              <button
                onClick={() => setShowPass(true)}
                className="rounded-full border border-emerald-500/30 bg-emerald-950/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-200 shadow-md backdrop-blur-sm hover:brightness-110 active:scale-95 transition-all"
              >
                🎫 บัตรผ่านมู
              </button>

              {/* Shop button */}
              <button
                onClick={() => setShowShop(true)}
                className="rounded-full border border-amber-500/30 bg-stone-900/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-amber-300 shadow-md backdrop-blur-sm hover:brightness-110 active:scale-95 transition-all"
              >
                🛒 ร้านค้า
              </button>

              {/* Mobile Craft button */}
              {isMobile && (
                <button
                  onClick={() => setShowCraftModal(true)}
                  className="rounded-full border border-amber-500/30 bg-stone-900/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-amber-300 shadow-md backdrop-blur-sm hover:brightness-110 active:scale-95 transition-all"
                >
                  🛠️ คราฟต์
                </button>
              )}

              {/* Ad Reward Button */}
              <button
                onClick={() => setShowAd(true)}
                className="rounded-full border border-rose-500/30 bg-rose-950/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-rose-200 shadow-md backdrop-blur-sm hover:brightness-110 active:scale-95 transition-all"
              >
                📺 รับโบนัสฟรี
              </button>
            </div>
          </>
        )}

        {/* Cozy Modals */}
        {showGacha && <GachaPanel onClose={() => setShowGacha(false)} />}
        {showPass && <MuteluPassPanel onClose={() => setShowPass(false)} />}
        {showShop && <OfferingShopPanel onClose={() => setShowShop(false)} />}
        {showCardAlbum && <CardAlbumModal isOpen={showCardAlbum} onClose={() => setShowCardAlbum(false)} />}
        {showCraftModal && <CraftPanel isModal onClose={() => setShowCraftModal(false)} />}
        {showAd && (
          <AdSimulatorModal 
            rewardCoins={150} 
            onRewardClaimed={() => {
              // Optional: show a mini toast on successful ad reward
            }} 
            onClose={() => setShowAd(false)} 
          />
        )}

        {/* Virtual Mobile Controls */}
        {isMobile && slug === 'ghost-whisperer' && (
          <>
            {/* D-Pad bottom-left */}
            <div className="absolute bottom-6 left-6 z-40 select-none touch-none">
              <div className="relative w-36 h-36 bg-stone-950/50 border border-stone-800/40 rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl">
                {/* UP */}
                <button
                  type="button"
                  onTouchStart={() => setVirtualKeys(prev => ({ ...prev, up: true }))}
                  onTouchEnd={() => setVirtualKeys(prev => ({ ...prev, up: false }))}
                  onMouseDown={() => setVirtualKeys(prev => ({ ...prev, up: true }))}
                  onMouseUp={() => setVirtualKeys(prev => ({ ...prev, up: false }))}
                  onMouseLeave={() => setVirtualKeys(prev => ({ ...prev, up: false }))}
                  className="absolute top-1 w-12 h-10 bg-stone-900/70 border border-stone-800/50 active:bg-amber-600 active:text-black rounded-t-xl flex items-center justify-center text-stone-400 hover:text-white text-lg font-bold select-none"
                >
                  ▲
                </button>
                {/* DOWN */}
                <button
                  type="button"
                  onTouchStart={() => setVirtualKeys(prev => ({ ...prev, down: true }))}
                  onTouchEnd={() => setVirtualKeys(prev => ({ ...prev, down: false }))}
                  onMouseDown={() => setVirtualKeys(prev => ({ ...prev, down: true }))}
                  onMouseUp={() => setVirtualKeys(prev => ({ ...prev, down: false }))}
                  onMouseLeave={() => setVirtualKeys(prev => ({ ...prev, down: false }))}
                  className="absolute bottom-1 w-12 h-10 bg-stone-900/70 border border-stone-800/50 active:bg-amber-600 active:text-black rounded-b-xl flex items-center justify-center text-stone-400 hover:text-white text-lg font-bold select-none"
                >
                  ▼
                </button>
                {/* LEFT */}
                <button
                  type="button"
                  onTouchStart={() => setVirtualKeys(prev => ({ ...prev, left: true }))}
                  onTouchEnd={() => setVirtualKeys(prev => ({ ...prev, left: false }))}
                  onMouseDown={() => setVirtualKeys(prev => ({ ...prev, left: true }))}
                  onMouseUp={() => setVirtualKeys(prev => ({ ...prev, left: false }))}
                  onMouseLeave={() => setVirtualKeys(prev => ({ ...prev, left: false }))}
                  className="absolute left-1 w-10 h-12 bg-stone-900/70 border border-stone-800/50 active:bg-amber-600 active:text-black rounded-l-xl flex items-center justify-center text-stone-400 hover:text-white text-lg font-bold select-none"
                >
                  ◀
                </button>
                {/* RIGHT */}
                <button
                  type="button"
                  onTouchStart={() => setVirtualKeys(prev => ({ ...prev, right: true }))}
                  onTouchEnd={() => setVirtualKeys(prev => ({ ...prev, right: false }))}
                  onMouseDown={() => setVirtualKeys(prev => ({ ...prev, right: true }))}
                  onMouseUp={() => setVirtualKeys(prev => ({ ...prev, right: false }))}
                  onMouseLeave={() => setVirtualKeys(prev => ({ ...prev, right: false }))}
                  className="absolute right-1 w-10 h-12 bg-stone-900/70 border border-stone-800/50 active:bg-amber-600 active:text-black rounded-r-xl flex items-center justify-center text-stone-400 hover:text-white text-lg font-bold select-none"
                >
                  ▶
                </button>
                {/* CENTER DECORATION */}
                <div className="w-10 h-10 bg-amber-500/10 rounded-full border border-amber-500/5 pointer-events-none" />
              </div>
            </div>

            {/* Action button bottom-right */}
            <div className="absolute bottom-6 right-6 z-40 select-none touch-none">
              <button
                type="button"
                onTouchStart={() => EventBus.emit('virtual-harvest', undefined)}
                onMouseDown={() => EventBus.emit('virtual-harvest', undefined)}
                className="w-20 h-20 bg-gradient-to-r from-amber-500 via-yellow-450 to-amber-500 active:scale-90 border-2 border-amber-400/50 rounded-full flex flex-col items-center justify-center text-black font-black uppercase text-[10px] tracking-widest shadow-2xl transition-all"
              >
                <span className="text-xl">✨</span>
                <span>ACTION</span>
              </button>
            </div>
          </>
        )}

      </div>
    </main>
  );
}
