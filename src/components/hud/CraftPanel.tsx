'use client';

import { useEffect, useState } from 'react';
import { useContentStore } from '@/stores/useContentStore';
import { useInventoryStore } from '@/stores/useInventoryStore';
import { useInteractionStore } from '@/stores/useInteractionStore';
import PanelFrame from './PanelFrame';

const ICON_BY_RECIPE: Record<string, string> = {
  knife: '🔪',
  campfire: '🔥',
  shelter: '🏠',
};

interface CraftPanelProps {
  isModal?: boolean;
  onClose?: () => void;
}

export default function CraftPanel({ isModal = false, onClose }: CraftPanelProps) {
  const loaded = useContentStore((state) => state.loaded);
  const recipes = useContentStore((state) => state.recipes);
  const quantities = useInventoryStore((state) => state.quantities);
  const craft = useInventoryStore((state) => state.craft);
  const [message, setMessage] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 1024;
      setIsMobileViewport(isMobile);
      setIsCollapsed(isMobile);
    }
  }, []);

  const canAfford = (recipeKey: string) => {
    const recipe = recipes.find((r) => r.key === recipeKey);
    if (!recipe) return false;
    return recipe.ingredients.every(
      (ingredient) => (quantities[ingredient.itemKey] ?? 0) >= ingredient.quantity,
    );
  };

  const handleCraft = (recipeKey: string) => {
    const result = craft(recipeKey);
    if (result.success) {
      const recipe = recipes.find((r) => r.key === recipeKey);
      if (recipe) {
        const item = useContentStore.getState().getItem(recipe.outputItemKey);
        const itemName = item?.name || recipe.outputItemKey;
        const icon = ICON_BY_RECIPE[recipeKey] || '🛠️';
        
        // Show floating message in center of screen
        useInteractionStore.getState().setPrompt(`คราฟต์สำเร็จ! ได้รับ ${itemName} ${icon}`, 'info');
        setTimeout(() => {
          if (useInteractionStore.getState().promptText?.includes(`ได้รับ ${itemName}`)) {
            useInteractionStore.getState().setPrompt(null);
          }
        }, 3000);
      }
      setMessage('คราฟต์สำเร็จ');
    } else {
      setMessage(`คราฟต์ไม่ได้: ${result.reason}`);
    }
  };

  const content = (
    <PanelFrame title="คราฟต์">
      {!loaded && <div className="text-xs text-stone-400">กำลังโหลด...</div>}
      <div className="flex flex-col gap-1.5">
        {loaded &&
          recipes.map((recipe) => {
            const affordable = canAfford(recipe.key);
            return (
              <button
                key={recipe.key}
                type="button"
                onClick={() => handleCraft(recipe.key)}
                disabled={!affordable}
                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-all ${
                  affordable
                    ? 'bg-emerald-100/60 hover:bg-emerald-200 text-emerald-900 border-2 border-emerald-500 animate-pulse font-black'
                    : 'bg-stone-100 opacity-60 border-2 border-transparent'
                }`}
              >
                <span className="text-base leading-none">{ICON_BY_RECIPE[recipe.key] ?? '🛠️'}</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-stone-800">{recipe.name}</span>
                  <span className="text-[10px] text-stone-500 font-medium">
                    {recipe.ingredients.map((i) => `${i.itemKey} x${i.quantity}`).join(' · ')}
                  </span>
                </div>
              </button>
            );
          })}
      </div>
      {message && <div className="mt-2 text-[11px] text-emerald-700 font-bold">{message}</div>}
    </PanelFrame>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-start overflow-y-auto bg-black/55 backdrop-blur-sm p-4 pointer-events-auto animate-fade-in">
        <div className="my-auto relative w-full max-w-sm rounded-3xl border border-stone-200 bg-[#FCFBF9] p-5 md:p-6 shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 text-base font-bold transition-colors p-1"
          >
            ✕
          </button>
          <div className="mt-2">
            {content}
          </div>
        </div>
      </div>
    );
  }

  if (isCollapsed) {
    // Stacked under the inventory pill on the right — the left side is
    // taken by StatsBar/QuestTracker, and bottom is taken by the mobile
    // joystick + action button, so this is the only clear on-screen spot.
    return (
      <div className="pointer-events-auto absolute right-2 top-[92px] z-40 origin-top-right scale-[0.75] select-none">
        <button
          onClick={() => setIsCollapsed(false)}
          className="bg-[#5c3a2a]/95 hover:bg-[#482c1f] border border-[#C96E3A]/45 rounded-full px-4 py-2 text-xs font-black text-[#FCFBF9] shadow-lg flex items-center gap-1.5 active:scale-95 transition-all"
        >
          🛠️ <span>คราฟต์</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={
        isMobileViewport
          ? 'pointer-events-auto absolute right-2 top-[92px] z-40 w-64 origin-top-right scale-[0.65] select-none'
          : 'pointer-events-auto absolute bottom-5 left-5 w-64 md:w-72'
      }
    >
      <button
        onClick={() => setIsCollapsed(true)}
        className="absolute -top-2 -right-2 z-10 bg-stone-700 hover:bg-stone-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold shadow-md pointer-events-auto"
      >
        ➖
      </button>
      {content}
    </div>
  );
}
