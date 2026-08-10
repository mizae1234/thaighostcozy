import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const boundaryRules = [
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'] },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['src/game/scenes/**', 'src/game/entities/**', 'src/game/systems/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react', message: 'Phaser game code must not import React — use EventBus.' },
            { name: 'zustand', message: 'Phaser game code must not import Zustand — use EventBus.' },
          ],
          patterns: [
            {
              group: ['@/stores/*'],
              message: 'Phaser game code must not import Zustand stores directly — use EventBus.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/stores/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/game/scenes/*', '@/game/entities/*'],
              message: 'Zustand stores must not import Phaser scenes/entities directly — use EventBus.',
            },
          ],
        },
      ],
    },
  },
];

export default boundaryRules;
