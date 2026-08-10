import { create } from 'zustand';
import { EventBus } from '@/game/EventBus';
import { useContentStore } from './useContentStore';
import { usePlayerStore } from './usePlayerStore';

export interface CraftResult {
  success: boolean;
  reason?: string;
}

interface InventoryState {
  quantities: Record<string, number>;
  add: (itemKey: string, amount: number) => void;
  remove: (itemKey: string, amount: number) => boolean;
  craft: (recipeKey: string) => CraftResult;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  quantities: {},

  add: (itemKey, amount) => {
    set((state) => ({
      quantities: { ...state.quantities, [itemKey]: (state.quantities[itemKey] ?? 0) + amount },
    }));
  },

  remove: (itemKey, amount) => {
    const current = get().quantities[itemKey] ?? 0;
    if (current < amount) return false;
    set((state) => ({ quantities: { ...state.quantities, [itemKey]: current - amount } }));
    return true;
  },

  craft: (recipeKey) => {
    const recipe = useContentStore.getState().getRecipe(recipeKey);
    if (!recipe) return { success: false, reason: 'unknown-recipe' };

    const outputItem = useContentStore.getState().getItem(recipe.outputItemKey);
    if (!outputItem) return { success: false, reason: 'unknown-output-item' };

    const quantities = get().quantities;
    const missing = recipe.ingredients.find(
      (ingredient) => (quantities[ingredient.itemKey] ?? 0) < ingredient.quantity,
    );
    if (missing) return { success: false, reason: 'insufficient-ingredients' };

    const nextQuantities = { ...quantities };
    for (const ingredient of recipe.ingredients) {
      nextQuantities[ingredient.itemKey] -= ingredient.quantity;
    }

    if (outputItem.type === 'BUILDING') {
      set({ quantities: nextQuantities });
      const { x, y } = usePlayerStore.getState();
      EventBus.emit('building-placed', { recipeKey: recipe.key, x, y });
      return { success: true };
    }

    nextQuantities[recipe.outputItemKey] = (nextQuantities[recipe.outputItemKey] ?? 0) + recipe.outputQty;
    set({ quantities: nextQuantities });
    return { success: true };
  },
}));
