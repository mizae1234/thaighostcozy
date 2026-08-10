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

    // Recreate walk animations using the current preloaded textures
    if (scene.anims.exists('walk-down')) scene.anims.remove('walk-down');
    scene.anims.create({
      key: 'walk-down',
      frames: [
        { key: 'player-down' },
        { key: 'player-down-walk1' },
        { key: 'player-down' },
        { key: 'player-down-walk2' }
      ],
      frameRate: 6,
      repeat: -1
    });

    if (scene.anims.exists('walk-left')) scene.anims.remove('walk-left');
    scene.anims.create({
      key: 'walk-left',
      frames: [
        { key: 'player-left' },
        { key: 'player-left-walk1' }
      ],
      frameRate: 6,
      repeat: -1
    });

    if (scene.anims.exists('walk-right')) scene.anims.remove('walk-right');
    scene.anims.create({
      key: 'walk-right',
      frames: [
        { key: 'player-right' },
        { key: 'player-right-walk1' }
      ],
      frameRate: 6,
      repeat: -1
    });

    if (scene.anims.exists('walk-up')) scene.anims.remove('walk-up');
    scene.anims.create({
      key: 'walk-up',
      frames: [
        { key: 'player-up' },
        { key: 'player-up-walk1' },
        { key: 'player-up' },
        { key: 'player-up-walk2' }
      ],
      frameRate: 6,
      repeat: -1
    });
  }

  private updateShadowPosition() {
    this.shadow.setPosition(this.sprite.x, this.sprite.y + this.sprite.displayHeight * 0.36);
  }

  update(
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    wasd: Record<'up' | 'down' | 'left' | 'right', Phaser.Input.Keyboard.Key>,
    isDialogueActive: boolean,
    isEpisodeEnd: boolean,
    isStarving: boolean,
    speedMultiplier = 1.0
  ) {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;

    // Freeze player controls during dialogue/episode-end screens
    if (isDialogueActive || isEpisodeEnd) {
      body.setVelocity(0, 0);
      this.sprite.stop();
      this.sprite.setAngle(0);
      const fitScale = DISPLAY_MAX_DIM / Math.max(this.sprite.width, this.sprite.height);
      this.sprite.setDisplaySize(this.sprite.width * fitScale, this.sprite.height * fitScale);
      this.isMoving = false;
      this.updateShadowPosition();
      return;
    }

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
      const currentSpeed = isStarving 
        ? (SPEED * speedMultiplier) * 0.5 
        : SPEED * speedMultiplier;

      const length = Math.hypot(vx, vy);
      body.setVelocity((vx / length) * currentSpeed, (vy / length) * currentSpeed);

      const previousDirection = this.direction;
      if (vx < 0) this.direction = 'left';
      else if (vx > 0) this.direction = 'right';
      else if (vy < 0) this.direction = 'up';
      else if (vy > 0) this.direction = 'down';

      // Play walk animation for the corresponding direction
      const animKey = `walk-${this.direction}`;
      if (!this.sprite.anims.isPlaying || this.sprite.anims.currentAnim?.key !== animKey) {
        this.sprite.play(animKey);
      }

      // Wobble/Bobbing effect to complement the leg movement
      const time = this.sprite.scene.time.now;
      const stepSpeed = 0.016;
      let wobbleAngle = 0;
      let scaleX = 1;
      let scaleY = 1;

      if (this.direction === 'up' || this.direction === 'down') {
        scaleY = 1 - Math.sin(time * stepSpeed * 2) * 0.04;
        scaleX = 1 + Math.sin(time * stepSpeed * 2) * 0.02;
        wobbleAngle = Math.sin(time * stepSpeed) * 3;
      } else {
        wobbleAngle = this.direction === 'left' ? -4 : 4;
        scaleY = 1 + Math.sin(time * stepSpeed * 2) * 0.03;
      }

      this.sprite.setAngle(wobbleAngle);
      const fitScale = DISPLAY_MAX_DIM / Math.max(this.sprite.width, this.sprite.height);
      this.sprite.setDisplaySize(
        this.sprite.width * fitScale * scaleX,
        this.sprite.height * fitScale * scaleY
      );
    } else {
      body.setVelocity(0, 0);
      this.sprite.stop();
      this.sprite.setAngle(0);
      this.sprite.setTexture(TEXTURE_BY_DIRECTION[this.direction]);
      
      const fitScale = DISPLAY_MAX_DIM / Math.max(this.sprite.width, this.sprite.height);
      this.sprite.setDisplaySize(this.sprite.width * fitScale, this.sprite.height * fitScale);
    }

    this.isMoving = moving;
    this.updateShadowPosition();
  }

  get position() {
    return { x: this.sprite.x, y: this.sprite.y };
  }
}
