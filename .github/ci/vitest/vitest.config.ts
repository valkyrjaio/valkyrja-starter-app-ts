/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const require = createRequire(import.meta.url);
const esbuild = require('esbuild');

const root = fileURLToPath(new URL('../../../', import.meta.url));
const reportsDirectory = fileURLToPath(new URL('./coverage', import.meta.url));

/**
 * Lower TC39 Stage-3 decorators in the application's source before Vitest parses it.
 *
 * The routing decorators (`@Route`, `@RouteHandler`, …) the controllers and CLI
 * commands carry are syntax Vitest's own transform cannot parse, so any test that
 * imports a decorated class would fail with a `SyntaxError`. Running esbuild over
 * just those files first lowers the decorators to plain calls, keeping the
 * controllers, commands, and their providers unit-testable.
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
        include: ['tests/**/*.test.ts'],
        passWithNoTests: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov'],
            all: true,
            include: ['src/**/*.ts'],
            exclude: ['src/**/*.test.ts', 'src/**/*.example.ts'],
            reportsDirectory,
            // The gate's floor. The architecture guide's definition of done is 100% line *and*
            // branch, per file, and nothing enforced it before: the report was generated and then
            // ignored, so a run at 55% passed exactly like one at 100%.
            thresholds: {
                lines: 100,
                branches: 100,
                functions: 100,
                statements: 100,
            },
        },
    },
});
