import Phaser from 'phaser';

const TILES_BASE = '/assets/stories/pla-boo-thong/tiles';
const PLAYER_BASE = '/assets/stories/pla-boo-thong/sprites/player';
const NPC_BASE = '/assets/stories/pla-boo-thong/sprites/npc';

const PLACEHOLDER_BASE_SIZE = 48;

function generateBuildingTexture(scene: Phaser.Scene, key: string, fillColor: number, strokeColor: number) {
  const size = PLACEHOLDER_BASE_SIZE;
  const graphics = scene.make.graphics({ x: 0, y: 0 });
  graphics.fillStyle(fillColor, 1);
  graphics.fillRect(0, 0, size, size);
  graphics.lineStyle(3, strokeColor, 1);
  graphics.strokeRect(0, 0, size, size);
  graphics.generateTexture(key, size, size);
  graphics.destroy();
}

// A soft contact shadow so sprites don't look like they're floating over the
// painted background — no art asset needed, just a translucent dark ellipse.
function generateShadowTexture(scene: Phaser.Scene) {
  const width = 64;
  const height = 28;
  const graphics = scene.make.graphics({ x: 0, y: 0 });
  graphics.fillStyle(0x000000, 0.35);
  graphics.fillEllipse(width / 2, height / 2, width, height);
  graphics.generateTexture('contact-shadow', width, height);
  graphics.destroy();
}

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.image('island-background', `${TILES_BASE}/island-background.png`);
    this.load.image('node-wood', `${TILES_BASE}/prop-crate.png`);
    this.load.image('node-coconut', `${TILES_BASE}/prop-palm-tree.png`);
    this.load.image('node-stone', `${TILES_BASE}/prop-rocks.png`);
    this.load.image('building-campfire', `${TILES_BASE}/prop-campfire.png`);

    this.load.image('player-down', `${PLAYER_BASE}/player-down.png`);
    this.load.image('player-up', `${PLAYER_BASE}/player-up.png`);
    this.load.image('player-left', `${PLAYER_BASE}/player-left.png`);
    this.load.image('player-right', `${PLAYER_BASE}/player-right.png`);

    this.load.image('golden-goby', `${NPC_BASE}/golden-goby.png`);
  }

  create() {
    generateBuildingTexture(this, 'building-shelter', 0xc9a86a, 0x7a5a2e);
    generateShadowTexture(this);

    this.scene.start('Main');
  }
}
