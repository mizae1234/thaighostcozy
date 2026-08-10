import Phaser from 'phaser';
import { fitDisplaySize } from '../utils/fitDisplaySize';

const HARVEST_COOLDOWN_MS = 1500;
const DISPLAY_MAX_DIM = 64;

export default class ResourceNode {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  readonly itemKey: string;
  readonly yieldAmount: number;
  private lastHarvestedAt = -Infinity;

  constructor(scene: Phaser.Scene, x: number, y: number, textureKey: string, itemKey: string, yieldAmount = 1) {
    this.itemKey = itemKey;
    this.yieldAmount = yieldAmount;
    this.sprite = scene.physics.add.staticSprite(x, y, textureKey);
    fitDisplaySize(this.sprite, DISPLAY_MAX_DIM);
  }

  canHarvest(now: number): boolean {
    return now - this.lastHarvestedAt >= HARVEST_COOLDOWN_MS;
  }

  harvest(now: number) {
    this.lastHarvestedAt = now;
  }
}
