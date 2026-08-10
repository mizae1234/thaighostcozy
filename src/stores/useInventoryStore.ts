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
  coins: number;
  unlockedGhosts: string[];
  passPoints: number;
  passLevel: number;
  isPremiumPass: boolean;
  
  add: (itemKey: string, amount: number) => void;
  remove: (itemKey: string, amount: number) => boolean;
  craft: (recipeKey: string) => CraftResult;
  
  addCoins: (amount: number) => void;
  deductCoins: (amount: number) => boolean;
  unlockGhost: (ghostKey: string) => void;
  addPassPoints: (amount: number) => void;
  upgradePremiumPass: () => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  quantities: {},
  coins: 500, // 500 default coins to allow instant testing
  unlockedGhosts: [],
  passPoints: 0,
  passLevel: 1,
  isPremiumPass: false,

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

  addCoins: (amount) => {
    set((state) => {
      const nextCoins = state.coins + amount;
      if (typeof window !== 'undefined') {
        localStorage.setItem('thaighost_coins', String(nextCoins));
      }
      return { coins: nextCoins };
    });
  },

  deductCoins: (amount) => {
    const current = get().coins;
    if (current < amount) return false;
    const nextCoins = current - amount;
    if (typeof window !== 'undefined') {
      localStorage.setItem('thaighost_coins', String(nextCoins));
    }
    set({ coins: nextCoins });
    return true;
  },

  unlockGhost: (ghostKey) => {
    const list = get().unlockedGhosts;
    if (list.includes(ghostKey)) return;
    const nextGhosts = [...list, ghostKey];
    if (typeof window !== 'undefined') {
      localStorage.setItem('thaighost_unlocked_ghosts', JSON.stringify(nextGhosts));
    }
    set({ unlockedGhosts: nextGhosts });
  },

  addPassPoints: (amount) => {
    const points = get().passPoints + amount;
    // Level up every 100 points, max level 10
    const nextLevel = Math.min(10, Math.floor(points / 100) + 1);
    set({ passPoints: points, passLevel: nextLevel });
  },

  upgradePremiumPass: () => {
    set({ isPremiumPass: true });
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
