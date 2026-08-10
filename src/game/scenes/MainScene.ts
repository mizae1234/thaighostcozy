import Phaser from 'phaser';
import { EventBus } from '../EventBus';
import Player from '../entities/Player';
import ResourceNode from '../entities/ResourceNode';
import { WORLD_HEIGHT, WORLD_WIDTH } from '../config/gameConfig';
import { fitDisplaySize } from '../utils/fitDisplaySize';
import type { BuildingPlacedPayload, PlayerMovedPayload } from '../types';

const BUILDING_DISPLAY_MAX_DIM = 88;

// World layout, not narrative content — pixel coordinates on the static MVP
// island background (island-background.png), matched by eye to open ground.
const ISLAND_BOUNDS = { centerX: 640, centerY: 360, radiusX: 480, radiusY: 260 };

const RESOURCE_NODE_LAYOUT: Array<{ x: number; y: number; itemKey: string; texture: string }> = [
  { x: 460, y: 277, itemKey: 'wood', texture: 'node-wood' },
  { x: 820, y: 277, itemKey: 'wood', texture: 'node-wood' },
  { x: 460, y: 443, itemKey: 'wood', texture: 'node-wood' },
  { x: 820, y: 443, itemKey: 'wood', texture: 'node-wood' },
  { x: 640, y: 221, itemKey: 'wood', texture: 'node-wood' },
  { x: 520, y: 332, itemKey: 'coconut', texture: 'node-coconut' },
  { x: 760, y: 332, itemKey: 'coconut', texture: 'node-coconut' },
  { x: 520, y: 388, itemKey: 'coconut', texture: 'node-coconut' },
  { x: 760, y: 388, itemKey: 'coconut', texture: 'node-coconut' },
  { x: 400, y: 332, itemKey: 'stone', texture: 'node-stone' },
  { x: 880, y: 332, itemKey: 'stone', texture: 'node-stone' },
  { x: 640, y: 499, itemKey: 'stone', texture: 'node-stone' },
];

const BUILDING_TEXTURE_BY_RECIPE: Record<string, string> = {
  campfire: 'building-campfire',
  shelter: 'building-shelter',
};

export default class MainScene extends Phaser.Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<'up' | 'down' | 'left' | 'right', Phaser.Input.Keyboard.Key>;
  private harvestKey!: Phaser.Input.Keyboard.Key;
  private resourceNodes: ResourceNode[] = [];
  private lastEmitted: PlayerMovedPayload | null = null;

  constructor() {
    super('Main');
  }

  create() {
    this.add.image(0, 0, 'island-background').setOrigin(0, 0).setDisplaySize(WORLD_WIDTH, WORLD_HEIGHT);
    this.spawnResourceNodes();

    this.player = new Player(this, ISLAND_BOUNDS.centerX, ISLAND_BOUNDS.centerY);

    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.setZoom(2);
    this.cameras.main.startFollow(this.player.sprite, true, 0.12, 0.12);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.harvestKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    const handleBuildingPlaced = this.onBuildingPlaced.bind(this);
    EventBus.on('building-placed', handleBuildingPlaced);
    this.events.once('shutdown', () => {
      EventBus.off('building-placed', handleBuildingPlaced);
    });

    EventBus.emit('current-scene-ready', this);
  }

  update() {
    this.player.update(this.cursors, this.wasd);
    this.clampToIsland();
    this.emitPlayerMovedIfChanged();
    this.tryHarvest();
  }

  private spawnResourceNodes() {
    this.resourceNodes = RESOURCE_NODE_LAYOUT.map(({ x, y, itemKey, texture }) => new ResourceNode(this, x, y, texture, itemKey));
  }

  // The background is a single painted island image, not a tile grid, so
  // there's no per-tile collision to lean on — clamp the player to an
  // ellipse matched by eye to the island's visible ground.
  private clampToIsland() {
    const sprite = this.player.sprite;
    const dx = (sprite.x - ISLAND_BOUNDS.centerX) / ISLAND_BOUNDS.radiusX;
    const dy = (sprite.y - ISLAND_BOUNDS.centerY) / ISLAND_BOUNDS.radiusY;
    const dist = Math.hypot(dx, dy);

    if (dist > 1) {
      const angle = Math.atan2(dy, dx);
      sprite.x = ISLAND_BOUNDS.centerX + Math.cos(angle) * ISLAND_BOUNDS.radiusX;
      sprite.y = ISLAND_BOUNDS.centerY + Math.sin(angle) * ISLAND_BOUNDS.radiusY;
    }
  }

  private tryHarvest() {
    if (!Phaser.Input.Keyboard.JustDown(this.harvestKey)) return;

    const now = this.time.now;
    const playerBounds = this.player.sprite.getBounds();

    const node = this.resourceNodes.find(
      (candidate) =>
        candidate.canHarvest(now) &&
        Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, candidate.sprite.getBounds()),
    );

    if (!node) return;

    node.harvest(now);
    EventBus.emit('resource-collected', { itemKey: node.itemKey, amount: node.yieldAmount });
  }

  private onBuildingPlaced(payload: BuildingPlacedPayload) {
    const texture = BUILDING_TEXTURE_BY_RECIPE[payload.recipeKey];
    if (!texture) return;
    const image = this.add.image(payload.x, payload.y, texture);
    fitDisplaySize(image, BUILDING_DISPLAY_MAX_DIM);
  }

  private emitPlayerMovedIfChanged() {
    const { x, y } = this.player.position;
    const payload: PlayerMovedPayload = {
      x,
      y,
      direction: this.player.direction,
      isMoving: this.player.isMoving,
    };

    const changed =
      !this.lastEmitted ||
      this.lastEmitted.x !== payload.x ||
      this.lastEmitted.y !== payload.y ||
      this.lastEmitted.direction !== payload.direction ||
      this.lastEmitted.isMoving !== payload.isMoving;

    if (changed) {
      this.lastEmitted = payload;
      EventBus.emit('player-moved', payload);
    }
  }
}
