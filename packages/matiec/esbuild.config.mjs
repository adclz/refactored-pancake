import { build } from 'esbuild'
import * as fs from "node:fs";


export const esbuildOptions = {
    entryPoints: [
        './src/index.js'
    ],
    format: 'esm',
    bundle: true,
    target: ['esnext'],
    outdir: 'dist',
    platform: 'node',
}

build(esbuildOptions).catch(() => process.exit(1));