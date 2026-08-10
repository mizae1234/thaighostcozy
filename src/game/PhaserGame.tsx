'use client';

import Phaser from 'phaser';
import { forwardRef, useLayoutEffect, useRef } from 'react';
import { createGameConfig } from './config/gameConfig';

export interface PhaserGameRef {
  game: Phaser.Game | null;
}

const CONTAINER_ID = 'phaser-container';

const PhaserGame = forwardRef<PhaserGameRef>((_props, ref) => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useLayoutEffect(() => {
    if (!gameRef.current) {
      gameRef.current = new Phaser.Game(createGameConfig(CONTAINER_ID));
      if (ref && typeof ref === 'object') {
        ref.current = { game: gameRef.current };
      }
    }

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [ref]);

  return <div id={CONTAINER_ID} className="h-full w-full" />;
});

PhaserGame.displayName = 'PhaserGame';

export default PhaserGame;
