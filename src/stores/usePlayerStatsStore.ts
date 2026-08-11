import { create } from 'zustand';
import { useInventoryStore } from './useInventoryStore';

const DECAY_PER_TICK = 1;
const COCONUT_HUNGER_RESTORE = 30;
const COCONUT_THIRST_RESTORE = 20;

export interface EatResult {
  success: boolean;
  reason?: string;
}

interface PlayerStatsState {
  hunger: number;
  thirst: number;
  health: number;
  nickname: string | null;
  setNickname: (name: string) => void;
  tickDecay: () => void;
  deductOnAction: (hungerAmt: number, thirstAmt: number) => void;
  respawn: () => void;
  eatCoconut: () => EatResult;
}

export const usePlayerStatsStore = create<PlayerStatsState>((set) => ({
  hunger: 100,
  thirst: 100,
  health: 100,
  nickname: null,

  setNickname: (name: string) => set({ nickname: name }),

  deductOnAction: (hungerAmt: number, thirstAmt: number) => {
    set((state) => ({
      hunger: Math.max(0, state.hunger - hungerAmt),
      thirst: Math.max(0, state.thirst - thirstAmt),
    }));
  },

  tickDecay: () => {
    set((state) => {
      const unlockedGhosts = useInventoryStore.getState().unlockedGhosts;
      const quantities = useInventoryStore.getState().quantities;
      const hasNaga = unlockedGhosts.includes('naga');
      const hasKuman = unlockedGhosts.includes('kuman');
      const hasGlasses = (quantities['retro-sunglasses'] ?? 0) > 0;
      const multiplier = hasGlasses ? 0.8 : 1.0;

      const hungerDecay = (hasKuman ? DECAY_PER_TICK * 0.8 : DECAY_PER_TICK) * multiplier;
      const thirstDecay = (hasNaga ? DECAY_PER_TICK * 0.7 : DECAY_PER_TICK) * multiplier;

      const nextHunger = Math.max(0, state.hunger - hungerDecay);
      const nextThirst = Math.max(0, state.thirst - thirstDecay);
      
      // If either hunger or thirst is 0, start losing health rapidly!
      let nextHealth = state.health;
      if (nextHunger === 0 || nextThirst === 0) {
        nextHealth = Math.max(0, state.health - 10);
      }

      return {
        hunger: nextHunger,
        thirst: nextThirst,
        health: nextHealth
      };
    });
  },

  respawn: () => {
    set({ hunger: 50, thirst: 50, health: 100 });
  },

  eatCoconut: () => {
    const removed = useInventoryStore.getState().remove('coconut', 1);
    if (!removed) return { success: false, reason: 'no-coconut' };

    set((state) => ({
      hunger: Math.min(100, state.hunger + COCONUT_HUNGER_RESTORE),
      thirst: Math.min(100, state.thirst + COCONUT_THIRST_RESTORE),
      health: Math.min(100, state.health + 20), // Restore some health when eating too!
    }));
    return { success: true };
  },
}));
