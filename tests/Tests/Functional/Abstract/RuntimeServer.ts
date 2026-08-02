/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';

import type { ChildProcess } from 'node:child_process';
import type { AddressInfo } from 'node:net';

/**
 * Harness for runtime end-to-end tests.
 *
 * Boots the real application under a given HTTP entry in a subprocess, waits for
 * it to accept connections, exposes a simple GET helper, and always tears the
 * process down — so tests assert on the response an actual HTTP request
 * produces, exercising the entry wiring end to end.
 *
 * Mirrors PHP's `RuntimeServerTestCase`.
 */
export class RuntimeServer {
    port: number = 0;

    private process: ChildProcess | undefined;

    private output: string = '';

    /**
     * Get the application root directory (the repository root).
     */
    static appRoot(): string {
        return fileURLToPath(new URL('../../../../', import.meta.url));
    }

    /**
     * Get the path to the locally installed `tsx` binary.
     */
    static tsxBinary(): string {
        return fileURLToPath(new URL('../../../../node_modules/.bin/tsx', import.meta.url));
    }

    /**
     * Reserve a free localhost TCP port.
     */
    static async findFreePort(): Promise<number> {
        return new Promise((resolve, reject) => {
            const server = createServer();

            server.on('error', reject);
            server.listen(0, '127.0.0.1', () => {
                const { port } = server.address() as AddressInfo;

                server.close(() => resolve(port));
            });
        });
    }

    /**
     * Start a server process from the given entry file and wait for it to listen.
     */
    async start(entry: string, env: Record<string, string> = {}): Promise<void> {
        this.port = await RuntimeServer.findFreePort();

        // The framework ships TypeScript source, and Node refuses to transform
        // TypeScript that lives under `node_modules`, so the entry is run through
        // `tsx` — the same loader the `http` / `worker-http` scripts use. The local
        // binary is invoked directly rather than through `npx`, so no wrapper
        // process sits between this harness and the server it has to tear down.
        this.process = spawn(RuntimeServer.tsxBinary(), [entry], {
            cwd: RuntimeServer.appRoot(),
            env: {
                ...process.env,
                PORT: String(this.port),
                // Debug mode discovers routes at runtime, so the entry serves against
                // the committed (empty) data stubs rather than a generated cache.
                APP_DEBUG: 'true',
                ...env,
            },
            stdio: ['ignore', 'pipe', 'pipe'],
        });

        this.process.stdout?.on('data', (chunk: Buffer) => {
            this.output += chunk.toString();
        });
        this.process.stderr?.on('data', (chunk: Buffer) => {
            this.output += chunk.toString();
        });

        await this.waitForPort();
    }

    /**
     * Wait for the reserved port to accept a connection.
     */
    async waitForPort(timeoutMilliseconds: number = 20_000): Promise<void> {
        const deadline = Date.now() + timeoutMilliseconds;

        while (Date.now() < deadline) {
            if (this.process?.exitCode !== null && this.process?.exitCode !== undefined) {
                throw new Error(`Server process exited before listening:\n${this.output}`);
            }

            try {
                await fetch(`http://127.0.0.1:${this.port}/`, {
                    signal: AbortSignal.timeout(500),
                });

                return;
            } catch {
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
        }

        throw new Error(`Server did not start listening on port ${this.port} in time:\n${this.output}`);
    }

    /**
     * Perform a GET request against the running server.
     */
    async get(path: string): Promise<{ status: number; body: string }> {
        const response = await fetch(`http://127.0.0.1:${this.port}${path}`, {
            signal: AbortSignal.timeout(10_000),
        });

        return { status: response.status, body: await response.text() };
    }

    /**
     * Read whatever the process has written to stdout and stderr so far.
     */
    getOutput(): string {
        return this.output;
    }

    /**
     * Terminate the server process, escalating to a kill if it does not exit.
     */
    async stop(): Promise<void> {
        const child = this.process;

        if (child === undefined || child.exitCode !== null) {
            this.process = undefined;

            return;
        }

        const exited = new Promise<void>((resolve) => child.once('exit', () => resolve()));

        child.kill('SIGTERM');

        // Fall back to SIGKILL if the process ignores the graceful signal.
        const killTimer = setTimeout(() => child.kill('SIGKILL'), 5_000);

        await exited;

        clearTimeout(killTimer);

        this.process = undefined;
    }
}
