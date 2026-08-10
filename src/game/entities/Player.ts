import Phaser from 'phaser';
import type { Direction } from '../types';
import { fitDisplaySize } from '../utils/fitDisplaySize';

const SPEED = 120;
const DISPLAY_MAX_DIM = 76;

const TEXTURE_BY_DIRECTION: Record<Direction, string> = {
  up: 'player-up',
  down: 'player-down',
  left: 'player-left',
  right: 'player-right',
};

export default class Player {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  private readonly shadow: Phaser.GameObjects.Image;
  direction: Direction = 'down';
  isMoving = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.shadow = scene.add.image(x, y, 'contact-shadow');
    this.sprite = scene.physics.add.sprite(x, y, TEXTURE_BY_DIRECTION[this.direction]);
    this.sprite.setCollideWorldBounds(true);
    fitDisplaySize(this.sprite, DISPLAY_MAX_DIM);
    this.updateShadowPosition();
  }

  private updateShadowPosition() {
    this.shadow.setPosition(this.sprite.x, this.sprite.y + this.sprite.displayHeight * 0.36);
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, wasd: Record<'up' | 'down' | 'left' | 'right', Phaser.Input.Keyboard.Key>) {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    let vx = 0;
    let vy = 0;

    const left = cursors.left.isDown || wasd.left.isDown;
    const right = cursors.right.isDown || wasd.right.isDown;
    const up = cursors.up.isDown || wasd.up.isDown;
    const down = cursors.down.isDown || wasd.down.isDown;

    if (left) vx -= 1;
    if (right) vx += 1;
    if (up) vy -= 1;
    if (down) vy += 1;

    const moving = vx !== 0 || vy !== 0;

    if (moving) {
      const length = Math.hypot(vx, vy);
      body.setVelocity((vx / length) * SPEED, (vy / length) * SPEED);

      const previousDirection = this.direction;
      if (vx < 0) this.direction = 'left';
      else if (vx > 0) this.direction = 'right';
      else if (vy < 0) this.direction = 'up';
      else if (vy > 0) this.direction = 'down';

      if (this.direction !== previousDirection) {
        this.sprite.setTexture(TEXTURE_BY_DIRECTION[this.direction]);
        fitDisplaySize(this.sprite, DISPLAY_MAX_DIM);
      }
    } else {
      body.setVelocity(0, 0);
    }

    this.isMoving = moving;
    this.updateShadowPosition();
  }

  get position() {
    return { x: this.sprite.x, y: this.sprite.y };
  }
}
