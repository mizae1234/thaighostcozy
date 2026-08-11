'use client';

import dynamic from 'next/dynamic';
import { useEffect, use, useState, useRef } from 'react';
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
import SiansiModal from '@/components/hud/SiansiModal';
import LottoModal from '@/components/hud/LottoModal';

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
  const [showSiansi, setShowSiansi] = useState(false);
  const [showLotto, setShowLotto] = useState(false);
  const [lottoDrawResult, setLottoDrawResult] = useState<{
    drawn: boolean;
    won: boolean;
    ticket: string;
    winningNumber: string;
    prize: number;
  } | null>(null);
  const { coins } = useInventoryStore();

  // Tutorial Alert States
  const [tutorialTip, setTutorialTip] = useState<string | null>(null);
  const shownTipsRef = useRef<Set<string>>(new Set());

  const showTipOnce = (tipId: string, text: string) => {
    if (shownTipsRef.current.has(tipId)) return;
    shownTipsRef.current.add(tipId);
    setTutorialTip(text);
    setTimeout(() => {
      setTutorialTip(current => current === text ? null : current);
    }, 8500);
  };

  // Prologue State
  const [showPrologue, setShowPrologue] = useState(false);
  const currentStepIndex = useQuestStore((state) => state.currentStepIndex);

  // Mobile menu dropdown state
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    if (slug === 'ghost-whisperer' && currentStepIndex === 0) {
      setShowPrologue(true);
    }
  }, [slug, currentStepIndex]);

  // Lottery result check on wakeup (when currentStepIndex updates)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentStep = useQuestStore.getState().quests[0]?.steps[currentStepIndex];
    if (currentStep && currentStep.phase === 'DAY') {
      const ticket = localStorage.getItem('thaighost_lotto_ticket');
      const boughtDay = localStorage.getItem('thaighost_lotto_bought_day');

      if (ticket && boughtDay) {
        // If it was bought on a previous step day index, draw!
        if (boughtDay !== String(currentStepIndex)) {
          const winningNumber = String(Math.floor(Math.random() * 105) % 100).padStart(2, '0');
          const won = ticket === winningNumber;
          const prize = 1000;

          if (won) {
            useInventoryStore.getState().addCoins(prize);
          }

          setLottoDrawResult({
            drawn: true,
            won,
            ticket,
            winningNumber,
            prize
          });

          localStorage.removeItem('thaighost_lotto_ticket');
          localStorage.removeItem('thaighost_lotto_bought_day');
        }
      }
    }
  }, [currentStepIndex]);

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

  // Joystick states
  const joystickRef = useRef<HTMLDivElement>(null);
  const [joystickOffset, setJoystickOffset] = useState({ x: 0, y: 0 });

  const handleJoystickTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!joystickRef.current) return;
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const touch = e.touches[0];
    if (!touch) return;

    let dx = touch.clientX - centerX;
    let dy = touch.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = 45; // Max visual offset in pixels

    if (distance > maxRadius) {
      dx = (dx / distance) * maxRadius;
      dy = (dy / distance) * maxRadius;
    }

    setJoystickOffset({ x: dx, y: dy });

    // Thresholds for diagonal movement
    const threshold = 15;
    setVirtualKeys({
      up: dy < -threshold,
      down: dy > threshold,
      left: dx < -threshold,
      right: dx > threshold
    });
  };

  const handleJoystickEnd = () => {
    setJoystickOffset({ x: 0, y: 0 });
    setVirtualKeys({ up: false, down: false, left: false, right: false });
  };

  const handleJoystickMouseDown = (_e: React.MouseEvent<HTMLDivElement>) => {
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!joystickRef.current) return;
      const rect = joystickRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      let dx = moveEvent.clientX - centerX;
      let dy = moveEvent.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxRadius = 45;

      if (distance > maxRadius) {
        dx = (dx / distance) * maxRadius;
        dy = (dy / distance) * maxRadius;
      }

      setJoystickOffset({ x: dx, y: dy });

      const threshold = 15;
      setVirtualKeys({
        up: dy < -threshold,
        down: dy > threshold,
        left: dx < -threshold,
        right: dx > threshold
      });
    };

    const handleMouseUp = () => {
      setJoystickOffset({ x: 0, y: 0 });
      setVirtualKeys({ up: false, down: false, left: false, right: false });
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

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
      if (slug === 'ghost-whisperer') {
        showTipOnce('welcome-tip', "💡 ยินดีต้อนรับสู่ป่ากล้วยคุณตา! กลางวันแนะนำให้คุณฟาร์มของและคราฟต์ศาลพระภูมิตามเป้าหมายเควสต์ด้านซ้าย ส่วนผลผลิตกล้วยน้ำว้าสามารถนำไปคุยขายให้ป้าศรีที่ร้านค้าเพื่อแลกเหรียญมูเตลูได้ครับ");
      }
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
        
        if (payload.itemKey === 'coconut') {
          showTipOnce('banana-eat', "🍌 ผลกล้วยน้ำว้า: กดปุ่ม 'ดื่มชาใบตอง' ในหน้าจอซ้ายบนเพื่อรับประทานและฟื้นฟูค่าพลังงาน Hunger/Thirst ไม่ให้ตัวละครหมดสติ!");
        } else if (payload.itemKey === 'wood') {
          showTipOnce('wood-craft', "🪵 แผ่นไม้กระดาน: สะสมแผ่นไม้และเศษหินเพื่อคราฟต์อุปกรณ์ต่างๆ ในปุ่มคราฟต์ซ้ายล่าง เช่น มีดพร้าทำสวน หรือ ศาลพระภูมิมูจิ!");
        }
      }
    };
    
    const handleBuildingPlaced = (payload: { recipeKey: string }) => {
      useQuestStore.getState().triggerBuildingPlaced(payload.recipeKey);
    };

    const handleOpenShop = () => {
      setShowShop(true);
    };

    const handleOpenSiansi = () => {
      setShowSiansi(true);
    };

    const handleOpenLotto = () => {
      setShowLotto(true);
    };

    EventBus.on('player-moved', handlePlayerMoved);
    EventBus.on('resource-collected', handleResourceCollected);
    EventBus.on('building-placed', handleBuildingPlaced);
    EventBus.on('open-shop-ui', handleOpenShop);
    EventBus.on('open-siansi-ui', handleOpenSiansi);
    EventBus.on('open-lotto-ui', handleOpenLotto);

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
      EventBus.off('open-siansi-ui', handleOpenSiansi);
      EventBus.off('open-lotto-ui', handleOpenLotto);
      clearInterval(decayInterval);
    };
  }, [slug]);

  return (
    <main className="relative flex h-screen w-screen items-center justify-center bg-black select-none">
      {/* Full screen canvas container for native portrait/landscape resizing */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <PhaserGame slug={slug} />
      </div>

      <StatsBar />
        <InventoryPanel />
        <CraftPanel />
        <QuestTracker />
        <InteractionPrompt />

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
            <div className="absolute top-2 right-2 md:top-4 md:right-4 z-40 flex items-center gap-1.5 md:gap-2 origin-top-right scale-[0.75] md:scale-100">
              {/* Coin Counter */}
              <div className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-black/60 px-3 py-1.5 shadow-md backdrop-blur-sm select-none">
                <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Mutelu 🪙</span>
                <span className="font-mono text-xs font-black text-amber-400">{coins}</span>
              </div>

              {!isMobile ? (
                <>
                  {/* Gacha button */}
                  <button
                    onClick={() => setShowGacha(true)}
                    className="rounded-full border border-purple-500/30 bg-purple-950/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-purple-200 shadow-md backdrop-blur-sm hover:brightness-110 active:scale-95 transition-all"
                  >
                    🔮 สุ่มกาชา
                  </button>

                  {/* Card Album button */}
                  <button
                    onClick={() => {
                      setShowCardAlbum(true);
                      showTipOnce('album-buff', "💡 สมุดบันทึกการ์ด: การ์ดแต่ละใบที่คุณสะสมจากการตัดสินใจคืนก่อน จะมอบพรอวยพร (Buff) เช่น เพิ่มความเร็วเดิน หรือลดอัตราการหิวระบายได้ช้าลง!");
                    }}
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

                  {/* Ad Reward Button */}
                  <button
                    onClick={() => setShowAd(true)}
                    className="rounded-full border border-rose-500/30 bg-rose-950/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-rose-200 shadow-md backdrop-blur-sm hover:brightness-110 active:scale-95 transition-all"
                  >
                    📺 รับโบนัสฟรี
                  </button>
                </>
              ) : (
                /* Mobile Menu Dropdown Wrapper */
                <div className="relative">
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="rounded-full border border-amber-500/40 bg-[#2D4B32] px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-amber-200 shadow-md active:scale-90 transition-all flex items-center gap-1"
                  >
                    {showMobileMenu ? '✕ ปิด' : '🔮 เมนูมู'}
                  </button>

                  {showMobileMenu && (
                    <div className="absolute right-0 mt-2.5 z-50 w-32 rounded-2xl border-2 border-[#C96E3A]/40 bg-[#FCFBF9] p-2 shadow-2xl flex flex-col gap-1 text-stone-850 animate-slide-up">
                      <button
                        onClick={() => { setShowGacha(true); setShowMobileMenu(false); }}
                        className="w-full text-left rounded-xl hover:bg-purple-50 px-2.5 py-2 text-[9px] font-black text-purple-700 uppercase tracking-widest border border-transparent hover:border-purple-200"
                      >
                        🔮 สุ่มกาชา
                      </button>
                      <button
                        onClick={() => { setShowCardAlbum(true); setShowMobileMenu(false); }}
                        className="w-full text-left rounded-xl hover:bg-sky-50 px-2.5 py-2 text-[9px] font-black text-sky-700 uppercase tracking-widest border border-transparent hover:border-sky-200"
                      >
                        📖 สมุดการ์ด
                      </button>
                      <button
                        onClick={() => { setShowPass(true); setShowMobileMenu(false); }}
                        className="w-full text-left rounded-xl hover:bg-emerald-50 px-2.5 py-2 text-[9px] font-black text-emerald-700 uppercase tracking-widest border border-transparent hover:border-emerald-200"
                      >
                        🎫 บัตรผ่านมู
                      </button>
                      <button
                        onClick={() => { setShowShop(true); setShowMobileMenu(false); }}
                        className="w-full text-left rounded-xl hover:bg-amber-50 px-2.5 py-2 text-[9px] font-black text-amber-700 uppercase tracking-widest border border-transparent hover:border-amber-200"
                      >
                        🛒 ร้านค้า
                      </button>
                      <button
                        onClick={() => { setShowCraftModal(true); setShowMobileMenu(false); }}
                        className="w-full text-left rounded-xl hover:bg-stone-100 px-2.5 py-2 text-[9px] font-black text-stone-750 uppercase tracking-widest border border-transparent hover:border-stone-200"
                      >
                        🛠️ คราฟต์ของ
                      </button>
                      <button
                        onClick={() => { setShowAd(true); setShowMobileMenu(false); }}
                        className="w-full text-left rounded-xl hover:bg-rose-50 px-2.5 py-2 text-[9px] font-black text-rose-700 uppercase tracking-widest border border-transparent hover:border-rose-200"
                      >
                        📺 โบนัสฟรี
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}


        {/* Virtual Mobile Controls */}
        {isMobile && slug === 'ghost-whisperer' && (
          <>
            {/* Virtual Joystick bottom-left */}
            <div className="absolute bottom-6 left-6 z-40 select-none touch-none">
              <div 
                ref={joystickRef}
                onTouchStart={handleJoystickTouch}
                onTouchMove={handleJoystickTouch}
                onTouchEnd={handleJoystickEnd}
                onMouseDown={handleJoystickMouseDown}
                className="relative w-32 h-32 bg-stone-950/60 border-2 border-amber-500/20 rounded-full flex items-center justify-center backdrop-blur-md shadow-2xl cursor-grab active:cursor-grabbing select-none"
              >
                {/* Visual Guide Directions */}
                <span className="absolute top-1.5 text-[8px] font-black text-stone-500 select-none">▲</span>
                <span className="absolute bottom-1.5 text-[8px] font-black text-stone-500 select-none">▼</span>
                <span className="absolute left-1.5 text-[8px] font-black text-stone-500 select-none">◀</span>
                <span className="absolute right-1.5 text-[8px] font-black text-stone-500 select-none">▶</span>

                {/* Joystick Knob (Analog Stick Handle) */}
                <div 
                  style={{
                    transform: `translate(${joystickOffset.x}px, ${joystickOffset.y}px)`,
                    transition: joystickOffset.x === 0 && joystickOffset.y === 0 ? 'transform 0.15s ease-out' : 'none'
                  }}
                  className="w-14 h-14 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full border-2 border-amber-400 shadow-lg flex items-center justify-center pointer-events-none select-none"
                >
                  <div className="w-8 h-8 bg-amber-600/30 rounded-full border border-amber-400/20 flex items-center justify-center">
                    <span className="text-xs">🕹️</span>
                  </div>
                </div>
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

        {/* Tutorial Tip Box */}
        {tutorialTip && (
          <div className="absolute bottom-24 left-1/2 z-40 w-full max-w-sm -translate-x-1/2 px-4 animate-fade-in pointer-events-auto">
            <div className="rounded-2xl border border-amber-500/30 bg-black/90 p-4 shadow-xl backdrop-blur-md text-stone-200 text-[10px] font-bold leading-relaxed flex items-start gap-2.5 relative">
              <span className="text-sm select-none">💡</span>
              <div className="flex-grow pr-4">
                <span className="text-amber-400 font-extrabold uppercase tracking-wider block mb-1">แนะนำ/เคล็ดลับ</span>
                {tutorialTip}
              </div>
              <button 
                onClick={() => setTutorialTip(null)}
                className="absolute top-2 right-2 text-stone-500 hover:text-stone-300 font-black text-[9px] px-1 select-none"
              >
                ✕
              </button>
            </div>
          </div>
        )}

      {/* Global Overlays & Dialogue */}
      <DialogueOverlay />
      <EpisodeEndOverlay />

      {/* Cozy Modals */}
      {showGacha && <GachaPanel onClose={() => setShowGacha(false)} />}
      {showPass && <MuteluPassPanel onClose={() => setShowPass(false)} />}
      {showShop && <OfferingShopPanel onClose={() => setShowShop(false)} />}
      {showCardAlbum && <CardAlbumModal isOpen={showCardAlbum} onClose={() => setShowCardAlbum(false)} />}
      {showCraftModal && <CraftPanel isModal onClose={() => setShowCraftModal(false)} />}
      {showSiansi && <SiansiModal isOpen={showSiansi} onClose={() => setShowSiansi(false)} />}
      {showLotto && <LottoModal isOpen={showLotto} onClose={() => setShowLotto(false)} />}
      {showAd && (
        <AdSimulatorModal 
          rewardCoins={150} 
          onRewardClaimed={() => {
            // Optional: show a mini toast on successful ad reward
          }} 
          onClose={() => setShowAd(false)} 
        />
      )}

      {/* Lotto Draw Result Overlay */}
      {lottoDrawResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 select-none pointer-events-auto">
          <div className="bg-[#1C2E21] border border-amber-500 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl relative">
            <div className="absolute inset-1.5 rounded-[22px] border border-amber-500/10 pointer-events-none" />
            <div className="text-5xl mb-4">
              {lottoDrawResult.won ? '🎉' : '💸'}
            </div>
            
            <h3 className="text-sm font-black text-amber-400 mb-2 uppercase tracking-wide">
              {lottoDrawResult.won ? 'ยินดีด้วย! คุณถูกสลากเลขเด็ด!' : 'สลากกินแบ่งออกแล้ว!'}
            </h3>

            <div className="bg-[#2D4B32]/30 border border-[#2D4B32]/50 rounded-2xl p-4 my-4 flex flex-col gap-2">
              <div className="flex justify-between text-xs text-stone-300 font-bold">
                <span>หมายเลขที่คุณซื้อ:</span>
                <span className="font-extrabold text-amber-300">{lottoDrawResult.ticket}</span>
              </div>
              <div className="flex justify-between text-xs text-stone-300 font-bold">
                <span>ผลรางวัลที่ออก:</span>
                <span className="font-extrabold text-amber-350">{lottoDrawResult.winningNumber}</span>
              </div>
              {lottoDrawResult.won && (
                <div className="flex justify-between text-xs text-stone-300 font-bold border-t border-[#2D4B32]/30 pt-2 mt-1">
                  <span>เงินรางวัลแจ็กพอต:</span>
                  <span className="font-black text-yellow-400">+{lottoDrawResult.prize} 🪙</span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-stone-400 leading-relaxed font-bold mb-5">
              {lottoDrawResult.won 
                ? 'โชคหล่นทับเข้าข้างคนมูเตลู! ได้รับ 1,000 เหรียญมูเตลูเข้ากระเป๋าสำเร็จ' 
                : 'งวดนี้ยังไม่ถูกรางวัล ไม่เป็นไร แวะไปสอยเลขใหม่จากแผงตลาดสดได้เสมอนะครับ!'}
            </p>

            <button
              onClick={() => setLottoDrawResult(null)}
              className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 py-3 text-xs font-black uppercase tracking-widest text-black shadow-md transition-all active:scale-95"
            >
              ปิดหน้าจอ
            </button>
          </div>
        </div>
      )}

      {/* Story Prologue Intro Overlay */}
      {showPrologue && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 p-4 md:p-8 flex justify-center items-start pointer-events-auto select-none text-[#1E2922]">
          <div className="my-auto mx-auto w-full max-w-xl rounded-3xl border-2 border-amber-500/30 bg-[#FCFBF9] p-5 md:p-8 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
            {/* Inner border decoration */}
            <div className="absolute inset-2.5 rounded-[22px] border border-amber-500/10 pointer-events-none" />

            {/* Header Title */}
            <span className="text-[10px] font-black text-[#C96E3A] uppercase tracking-widest bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-250 animate-pulse">
              📖 ปฐมบทเนื้อเรื่อง (Story Prologue)
            </span>
            <h2 className="mt-4 text-base md:text-lg font-black text-[#2D4B32] uppercase tracking-wider">
              มูเตลูทาวน์: ความลับสวนกล้วยคุณตา
            </h2>
            
            {/* Scroll paper divider */}
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent my-3.5" />

            {/* Story scroll description */}
            <div className="max-h-[220px] overflow-y-auto px-2 text-left space-y-4 mt-3 scrollbar-thin scrollbar-thumb-stone-200">
              <p className="text-xs md:text-sm text-stone-600 font-bold leading-relaxed">
                คุณได้รับจดหมายมรดกจาก <strong className="text-[#C96E3A] font-black">&ldquo;ตาเดช&rdquo;</strong> คุณตาผู้ล่วงลับ ทิ้งมรดกชิ้นสุดท้ายเป็นบ้านไม้และสวนกล้วยน้ำว้าโบราณในหมู่บ้านชนบทอันเงียบสงบ
              </p>
              <p className="text-xs md:text-sm text-stone-600 font-bold leading-relaxed">
                เมื่อคุณก้าวเท้าเข้าสู่หมู่บ้านนี้ กลับมีผู้ใหญ่บ้านเข้ามาทักทายพร้อมเอ่ยเตือนกฎเหล็กด้วยท่าทางมีพิรุธ: 
                <span className="italic block mt-1 bg-rose-50/50 border border-rose-100 p-3 rounded-2xl text-rose-800 font-extrabold text-xs md:text-sm">
                  &ldquo;หลังพระอาทิตย์ตกดิน... อย่าริอ่านก้าวเท้าออกจากบ้านสวนป่ากล้วยเด็ดขาด!&rdquo;
                </span>
              </p>
              <p className="text-xs md:text-sm text-stone-600 font-bold leading-relaxed">
                ตกดึก... กลิ่นอายความลี้ลับเริ่มปกคลุม แสงสีเขียวอ่อนวูบวาบ และเสียงกระซิบคร่ำครวญเรียกชื่อคุณจากกลางดงกล้วยยามค่ำคืน พร้อมกล่องล็อกโบราณปริศนาที่คุณตาฝังทิ้งไว้ในดิน...
              </p>
            </div>

            {/* Quest goals bullet summary */}
            <div className="mt-5 w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 text-left">
              <h4 className="text-xs font-black text-[#2D4B32] uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                🎯 เป้าหมายหลัก (Core Missions):
              </h4>
              <ul className="space-y-2.5 text-[11px] md:text-xs text-stone-500 font-bold">
                <li className="flex items-start gap-2">
                  <span className="text-[#C96E3A]">➔</span>
                  <span>เอาชีวิตรอดให้ครบ <strong className="text-[#C96E3A] font-black">7 วัน 7 คืน</strong> (กลางวันเตรียมตัว / กลางคืนตัดสินใจสืบคดี)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C96E3A]">➔</span>
                  <span>สะสม <strong className="text-[#C96E3A] font-black">การ์ดเบาะแสความลับ</strong> จากการเลือกการตัดสินใจเพื่อเปิดความจริงหักมุม</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C96E3A]">➔</span>
                  <span>คราฟต์ศาลพระภูมิ อุปกรณ์ไฟฉาย เครื่องราง เพื่อคุ้มครองและฟื้นฟูพลังชีวิต</span>
                </li>
              </ul>
            </div>

            {/* Start Adventure button */}
            <button
              onClick={() => setShowPrologue(false)}
              className="mt-6 w-full rounded-full bg-gradient-to-r from-[#2D4B32] to-[#1E3322] hover:brightness-110 py-3.5 text-xs md:text-sm font-black uppercase tracking-widest text-white shadow-lg active:scale-95 transition-all select-none"
            >
              เริ่มการผจญภัยเอาชีวิตรอด ➔
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
