import { create } from 'zustand';
import type { Direction, PlayerMovedPayload } from '@/game/types';

interface PlayerState {
  x: number;
  y: number;
  direction: Direction;
  isMoving: boolean;
  setFromGame: (payload: PlayerMovedPayload) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  x: 0,
  y: 0,
  direction: 'down',
  isMoving: false,
  setFromGame: (payload) => set(payload),
}));
