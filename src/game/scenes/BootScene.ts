import Phaser from 'phaser';

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
    const slug = this.registry.get('storySlug') || 'pla-boo-thong';
    const tilesBase = `/assets/stories/${slug}/tiles`;
    const playerBase = `/assets/stories/${slug}/sprites/player`;
    const npcBase = `/assets/stories/${slug}/sprites/npc`;

    this.load.image('island-background', `${tilesBase}/island-background.png`);
    this.load.image('node-wood', `${tilesBase}/prop-crate.png`);
    this.load.image('node-coconut', `${tilesBase}/prop-palm-tree.png`);
    this.load.image('node-stone', `${tilesBase}/prop-rocks.png`);
    this.load.image('building-campfire', `${tilesBase}/prop-campfire.png`);
    this.load.image('prop-flower', `${tilesBase}/prop-flower.png`);
    this.load.image('prop-shell', `${tilesBase}/prop-shell.png`);
    this.load.image('prop-sandalwood', `${tilesBase}/prop-sandalwood.png`);
    this.load.image('prop-fallen-fruit', `${tilesBase}/prop-fallen-fruit.png`);

    this.load.image('player-down', `${playerBase}/player-down1.png`);
    this.load.image('player-down-walk1', `${playerBase}/player-down-walk1.png`);
    this.load.image('player-down-walk2', `${playerBase}/player-down-walk2.png`);
    this.load.image('player-up', `${playerBase}/player-up1.png`);
    this.load.image('player-left', `${playerBase}/player-left1.png`);
    this.load.image('player-left-walk1', `${playerBase}/player-left-walk1.png`);
    this.load.image('player-right', `${playerBase}/player-right1.png`);
    this.load.image('player-right-walk1', `${playerBase}/player-right-walk1.png`);

    this.load.image('golden-goby', `${npcBase}/golden-goby.png`);
  }

  create() {
    generateBuildingTexture(this, 'building-shelter', 0xc9a86a, 0x7a5a2e);
    generateShadowTexture(this);

    this.scene.start('Main');
  }
}
