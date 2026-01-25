import copy from 'rollup-plugin-copy';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'umd',
    name: 'MumblePreviewer'
  },
  plugins: [
    copy({
      targets: [
        { src: 'public/images', dest: 'dist' }
      ]
    }),
    typescript({
      tsconfig: './tsconfig.json'
    })
  ],
};
