import Phaser from 'phaser';
import { fitDisplaySize } from '../utils/fitDisplaySize';

const HARVEST_COOLDOWN_MS = 25000;
const DISPLAY_MAX_DIM = 64;

export default class ResourceNode {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  readonly shadow: Phaser.GameObjects.Image;
  readonly itemKey: string;
  readonly yieldAmount: number;
  readonly originalX: number;
  readonly originalY: number;
  private lastHarvestedAt = -Infinity;

  constructor(scene: Phaser.Scene, x: number, y: number, textureKey: string, itemKey: string, yieldAmount = 1) {
    this.itemKey = itemKey;
    this.yieldAmount = yieldAmount;
    this.originalX = x;
    this.originalY = y;

    // Add a contact shadow beneath the resource to anchor it to the ground
    const shadowY = y + 16;
    this.shadow = scene.add.image(x, shadowY, 'contact-shadow');

    // Fine-tune offset and shadow scale by resource type
    if (itemKey === 'coconut') {
      // Palm tree shadow (larger) at the base of the trunk
      this.shadow.setScale(1.5, 1.3);
      this.shadow.y = y + 40;
    } else if (itemKey === 'wood') {
      // Crate shadow (smaller) and shift crate slightly down to ground it
      this.shadow.setScale(1.0, 1.0);
      y += 8; // Move crate down to align bottom with shadow
      this.shadow.y = y + 10;
    } else if (itemKey === 'stone') {
      // Rock shadow
      this.shadow.setScale(1.2, 1.2);
      y += 4;
      this.shadow.y = y + 12;
    } else if (itemKey === 'fallen-fruit') {
      // Tiny fruit shadow
      this.shadow.setScale(0.35, 0.35);
      y += 6;
      this.shadow.y = y + 4;
    } else if (itemKey === 'sacred-flower') {
      // Tiny flower shadow
      this.shadow.setScale(0.4, 0.4);
      y += 4;
      this.shadow.y = y + 4;
    } else if (itemKey === 'pearl-shell') {
      // Tiny shell shadow
      this.shadow.setScale(0.45, 0.45);
      y += 4;
      this.shadow.y = y + 4;
    } else if (itemKey === 'sandalwood') {
      // Sandalwood log shadow
      this.shadow.setScale(0.7, 0.4);
      this.shadow.y = y + 10;
    } else {
      this.shadow.setScale(1.0, 1.0);
    }

    this.sprite = scene.physics.add.staticSprite(x, y, textureKey);

    // Select size dimensions based on the item type (preventing giant items)
    let displayDim = DISPLAY_MAX_DIM;
    if (itemKey === 'fallen-fruit') {
      displayDim = 24;
    } else if (itemKey === 'sacred-flower') {
      displayDim = 26;
    } else if (itemKey === 'pearl-shell') {
      displayDim = 28;
    } else if (itemKey === 'sandalwood') {
      displayDim = 32;
    } else if (itemKey === 'coconut') {
      displayDim = 88;
    } else if (itemKey === 'stone') {
      displayDim = 36;
    } else if (itemKey === 'wood') {
      displayDim = 46;
    }

    fitDisplaySize(this.sprite, displayDim);
  }

  canHarvest(now: number): boolean {
    const ready = now - this.lastHarvestedAt >= HARVEST_COOLDOWN_MS;
    if (ready && this.sprite.alpha === 0.0) {
      // Randomize position within a safe jitter radius around its original spot
      const rx = this.originalX + (Math.random() - 0.5) * 120;
      const ry = this.originalY + (Math.random() - 0.5) * 120;
      
      this.sprite.setPosition(rx, ry);
      
      // Fine-tune shadow Y based on item type (matching constructor logic)
      let shadowY = ry + 16;
      if (this.itemKey === 'coconut') {
        shadowY = ry + 40;
      } else if (this.itemKey === 'wood') {
        shadowY = ry + 10;
      } else if (this.itemKey === 'stone') {
        shadowY = ry + 12;
      } else if (this.itemKey === 'fallen-fruit' || this.itemKey === 'sacred-flower' || this.itemKey === 'pearl-shell') {
        shadowY = ry + 4;
      } else if (this.itemKey === 'sandalwood') {
        shadowY = ry + 10;
      }
      
      this.shadow.setPosition(rx, shadowY);

      this.sprite.setAlpha(1.0);
      this.shadow.setAlpha(1.0);
    }
    return ready;
  }

  harvest(now: number) {
    this.lastHarvestedAt = now;
    this.sprite.setAlpha(0.0); // Hide completely on cooldown
    this.shadow.setAlpha(0.0);
  }
}
