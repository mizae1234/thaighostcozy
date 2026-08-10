import Phaser from 'phaser';
import { fitDisplaySize } from '../utils/fitDisplaySize';

const DISPLAY_MAX_DIM = 64;

export default class GoldenGoby {
  readonly image: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.image = scene.add.image(x, y, 'golden-goby');
    fitDisplaySize(this.image, DISPLAY_MAX_DIM);

    scene.tweens.add({
      targets: this.image,
      y: y - 10,
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    scene.tweens.add({
      targets: this.image,
      x: x + 14,
      duration: 2200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 300,
    });
  }
}
