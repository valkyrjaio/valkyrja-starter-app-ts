import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const require = createRequire(import.meta.url);
const esbuild = require('esbuild');

const root = fileURLToPath(new URL('../../../', import.meta.url));

/**
 * Lower TC39 Stage-3 decorators in the application's source before Vitest parses it.
 *
 * Same plugin as the main Vitest config: the generated CLI data cache references
 * `TestCommand.help`, so importing it pulls the decorated command into this
 * suite's module graph, and Vitest's own transform cannot parse that syntax.
 */
const lowerDecorators = {
    name: 'lower-decorators',
    enforce: 'pre' as const,
    async transform(code: string, id: string) {
        if (!id.includes('/src/App/') || !id.endsWith('.ts')) {
            return null;
        }

        if (!/^\s*@[A-Za-z]/m.test(code)) {
            return null;
        }

        // The sourcemap is load-bearing, not a nicety: lowering prepends esbuild's
        // decorator runtime helpers to the file, and without a map the coverage
        // provider attributes those helpers' lines and branches to the original
        // source, reporting a fully tested controller as barely covered.
        const result = await esbuild.transform(code, {
            loader: 'ts',
            target: 'es2022',
            sourcefile: id,
            sourcemap: true,
        });

        return { code: result.code, map: result.map || null };
    },
};

export default defineConfig({
    plugins: [lowerDecorators],
    test: {
        root,
        include: ['.github/ci/sindri-vitest/tests/**/*.test.ts'],
    },
});
