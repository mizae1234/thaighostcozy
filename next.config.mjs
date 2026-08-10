import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  output: 'standalone',
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      phaser: path.resolve(__dirname, 'node_modules/phaser/dist/phaser.js'),
    };
    return config;
  },
};

export default nextConfig;
