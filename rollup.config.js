// rollup.config.js
// https://www.rollupjs.com/guide/command-line-reference

import typescript from '@rollup/plugin-typescript';

export default {
    input: './src/index.ts',
    output: [
        {
            file: './es/imdux.js',
            format: 'esm',
            name: 'imdux',
        },
        {
            file: './dist/imdux.js',
            format: 'cjs',
            name: 'imdux',
        },
    ],
    plugins: [typescript({ target: 'ES2015' })],
};
