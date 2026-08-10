'use client';

import Phaser from 'phaser';
import { forwardRef, useLayoutEffect, useRef } from 'react';
import { createGameConfig } from './config/gameConfig';

export interface PhaserGameRef {
  game: Phaser.Game | null;
}

export interface PhaserGameProps {
  slug: string;
}

const CONTAINER_ID = 'phaser-container';

const PhaserGame = forwardRef<PhaserGameRef, PhaserGameProps>(({ slug }, ref) => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useLayoutEffect(() => {
    if (!gameRef.current) {
      gameRef.current = new Phaser.Game(createGameConfig(CONTAINER_ID));
      gameRef.current.registry.set('storySlug', slug);
      if (ref && typeof ref === 'object') {
        ref.current = { game: gameRef.current };
      }
    } else {
      gameRef.current.registry.set('storySlug', slug);
    }

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [ref, slug]);

  return <div id={CONTAINER_ID} className="h-full w-full" />;
});

PhaserGame.displayName = 'PhaserGame';

export default PhaserGame;
