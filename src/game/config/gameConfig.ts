import Phaser from 'phaser';
import BootScene from '../scenes/BootScene';
import MainScene from '../scenes/MainScene';

export const WORLD_WIDTH = 1280;
export const WORLD_HEIGHT = 720;

export function createGameConfig(parentId: string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent: parentId,
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT,
    backgroundColor: '#1c4d6b',
    pixelArt: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: { gravity: { x: 0, y: 0 }, debug: false },
    },
    scene: [BootScene, MainScene],
  };
}
