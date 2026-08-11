'use client';

import { useState } from 'react';
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
                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors ${
                  affordable
                    ? 'bg-emerald-100/50 hover:bg-emerald-100 text-emerald-800'
                    : 'bg-stone-100 opacity-60'
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm pointer-events-auto animate-fade-in">
        <div className="relative w-full max-w-sm rounded-3xl border border-stone-200 bg-[#FCFBF9] p-6 shadow-2xl">
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

  return (
    <div className="pointer-events-auto absolute bottom-5 left-5 w-64 md:w-72 hidden lg:block">
      {content}
    </div>
  );
}
