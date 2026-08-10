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
  eatCoconut: () => EatResult;
}

export const usePlayerStatsStore = create<PlayerStatsState>((set) => ({
  hunger: 100,
  thirst: 100,
  health: 100,

  tickDecay: () => {
    set((state) => ({
      hunger: Math.max(0, state.hunger - DECAY_PER_TICK),
      thirst: Math.max(0, state.thirst - DECAY_PER_TICK),
    }));
  },

  eatCoconut: () => {
    const removed = useInventoryStore.getState().remove('coconut', 1);
    if (!removed) return { success: false, reason: 'no-coconut' };

    set((state) => ({
      hunger: Math.min(100, state.hunger + COCONUT_HUNGER_RESTORE),
      thirst: Math.min(100, state.thirst + COCONUT_THIRST_RESTORE),
    }));
    return { success: true };
  },
}));
