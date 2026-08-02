/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * End-to-end smoke test for the CLI entry point (`bin/cli.ts`).
 *
 * The command decorators (`@Route` / `@RouteHandler`) that `TestCommand` carries
 * are TC39 Stage-3 syntax the application's Vitest transform cannot parse, so the
 * command is only unit-testable through the config's decorator-lowering transform.
 * This instead boots the real entry in a subprocess **under tsx** — the loader the
 * app actually uses — and runs the application's `test` command end to end, proving
 * the decorators execute as written against the real runtime.
 *
 * The CLI `Config` runs in debug mode, so the framework rediscovers commands at run
 * time and the entry functions against the committed (empty) data stubs.
 */
const appRoot = fileURLToPath(new URL('../../../../', import.meta.url));
const tsxBin = fileURLToPath(new URL('../../../../node_modules/.bin/tsx', import.meta.url));

function runCommand(args: string[], stdin: string): Promise<{ code: number | null; stdout: string; stderr: string }> {
    return new Promise((resolve) => {
        const child = spawn(process.execPath, [tsxBin, 'bin/cli.ts', ...args], {
            cwd: appRoot,
            env: { ...process.env },
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (chunk: Buffer) => {
            stdout += chunk.toString();
        });
        child.stderr.on('data', (chunk: Buffer) => {
            stderr += chunk.toString();
        });
        child.on('close', (code) => {
            resolve({ code, stdout, stderr });
        });

        child.stdin.write(stdin);
        child.stdin.end();
    });
}

describe('CliEntry (e2e, tsx)', () => {
    it('boots and runs the application `test` command', async () => {
        const { code, stdout, stderr } = await runCommand(['test'], 'no\n');

        expect(code).toBe(0);
        // The command's header renders its route name, and its question is asked.
        expect(stdout).toContain('test');
        expect(stdout).toContain('This is a question, right?');
        expect(stdout).not.toContain('was not found');
        expect(stderr).not.toContain('before initialization');
    }, 30000);

    // `list` exercises the debug-mode path: the app rediscovers its commands at run
    // time from `CliRouteProvider.getControllerClasses()`, which can only hand back
    // the real `TestCommand` class object because the handler references are thunks —
    // a bare class reference would throw on the command ↔ provider import cycle.
    it('lists the framework built-in commands alongside the application command', async () => {
        const { code, stdout, stderr } = await runCommand(['list'], '');

        expect(code).toBe(0);
        expect(stdout).toContain('test');
        expect(stdout).toContain('list');
        expect(stdout).toContain('help');
        expect(stdout).toContain('version');
        expect(stderr).not.toContain('before initialization');
    }, 30000);

    it('renders the command help text the `helpText` self-reference declares', async () => {
        const { code, stdout, stderr } = await runCommand(['test', '--help'], '');

        expect(code).toBe(0);
        expect(stdout).toContain('A command to showcase possibilities for commands.');
        expect(stderr).not.toContain('before initialization');
    }, 30000);
});
