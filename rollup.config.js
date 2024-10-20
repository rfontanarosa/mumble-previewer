import copy from 'rollup-plugin-copy';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts', // Your entry point TypeScript file
  output: {
    file: 'dist/bundle.js',
    format: 'umd', // Choose the format (iife, amd, cjs, es) based on your needs
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
