'use client';

import { useState } from 'react';
import { useContentStore } from '@/stores/useContentStore';
import { useInventoryStore } from '@/stores/useInventoryStore';
import PanelFrame from './PanelFrame';

const ICON_BY_RECIPE: Record<string, string> = {
  knife: '🔪',
  campfire: '🔥',
  shelter: '🏠',
};

export default function CraftPanel() {
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
    setMessage(result.success ? 'คราฟต์สำเร็จ' : `คราฟต์ไม่ได้: ${result.reason}`);
  };

  return (
    <div className="pointer-events-auto absolute bottom-5 left-5 w-60">
      <PanelFrame title="คราฟต์">
        {!loaded && <div className="text-xs text-white/50">กำลังโหลด...</div>}
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
                      ? 'bg-emerald-500/20 hover:bg-emerald-500/30'
                      : 'bg-white/5 opacity-50'
                  }`}
                >
                  <span className="text-base leading-none">{ICON_BY_RECIPE[recipe.key] ?? '🛠️'}</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">{recipe.name}</span>
                    <span className="text-[10px] text-white/60">
                      {recipe.ingredients.map((i) => `${i.itemKey} x${i.quantity}`).join(' · ')}
                    </span>
                  </div>
                </button>
              );
            })}
        </div>
        {message && <div className="mt-2 text-[11px] text-emerald-300">{message}</div>}
      </PanelFrame>
    </div>
  );
}
