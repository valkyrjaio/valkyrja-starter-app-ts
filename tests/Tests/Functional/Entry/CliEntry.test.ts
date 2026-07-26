/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { afterEach, describe, expect, it } from 'vitest';

import { Exiter } from '@valkyrjaio/valkyrja/Cli/Server/Support/Exiter.ts';

import { App } from '../../../../src/App/Cli/App.ts';
import { Config } from '../../../../src/App/Cli/Config.ts';

/**
 * End-to-end smoke test for the CLI entry point (`bin/cli.ts`).
 *
 * `bin/cli.ts` runs `App.run(new Config())`; this boots that exact entry in
 * process (the framework is published as raw TypeScript resolved from
 * `node_modules`, which Node's type stripping refuses to execute directly, so a
 * subprocess of `bin/cli.ts` is not possible — Vitest's transform is what makes
 * the framework's source runnable) and asserts the `list` command boots and lists
 * the application's own `test` command, catching regressions in the entry wiring,
 * provider bootstrap, or command routing that class-level tests miss.
 *
 * The `Config` runs in debug mode, so the framework discovers commands at runtime
 * and the entry functions against the committed (empty) data stubs.
 */
describe('CliEntry', () => {
    afterEach(() => {
        Exiter.unfreeze();
    });

    it('boots and lists the application command', () => {
        // Freeze the exiter so the entry does not terminate the test process.
        Exiter.freeze();

        // The input reads argv as `[caller, command, ...arguments]`.
        const savedArgv = process.argv;
        process.argv = ['App', 'list'];

        let output = '';
        const originalWrite = process.stdout.write.bind(process.stdout);
        process.stdout.write = ((chunk: string | Uint8Array): boolean => {
            output += typeof chunk === 'string' ? chunk : chunk.toString();

            return true;
        }) as typeof process.stdout.write;

        try {
            expect(() => App.run(new Config())).not.toThrow();
        } finally {
            process.stdout.write = originalWrite;
            process.argv = savedArgv;
        }

        // The application's own command is listed.
        expect(output).toContain('test');
        expect(output).not.toContain('Fatal error');
        expect(output).not.toContain('Uncaught');
    });
});
