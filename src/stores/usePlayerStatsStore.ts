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
  tickDecay: () => void;
  respawn: () => void;
  eatCoconut: () => EatResult;
}

export const usePlayerStatsStore = create<PlayerStatsState>((set) => ({
  hunger: 100,
  thirst: 100,
  health: 100,

  tickDecay: () => {
    set((state) => {
      const nextHunger = Math.max(0, state.hunger - DECAY_PER_TICK);
      const nextThirst = Math.max(0, state.thirst - DECAY_PER_TICK);
      
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
