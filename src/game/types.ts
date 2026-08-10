import type Phaser from 'phaser';

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface PlayerMovedPayload {
  x: number;
  y: number;
  direction: Direction;
  isMoving: boolean;
}

export interface ResourceCollectedPayload {
  itemKey: string;
  amount: number;
}

export interface BuildingPlacedPayload {
  recipeKey: string;
  x: number;
  y: number;
}

// Most events are emitted by Phaser and consumed by stores (via play/page.tsx).
// 'building-placed' is the exception: emitted by useInventoryStore after a
// successful craft, consumed by MainScene to render the placed object.
export interface GameEvents {
  'current-scene-ready': Phaser.Scene;
  'player-moved': PlayerMovedPayload;
  'resource-collected': ResourceCollectedPayload;
  'building-placed': BuildingPlacedPayload;
}
