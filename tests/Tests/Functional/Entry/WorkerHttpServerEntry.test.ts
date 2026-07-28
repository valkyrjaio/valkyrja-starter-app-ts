/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { afterEach, describe, expect, it } from 'vitest';

import { RuntimeServer } from '../Abstract/RuntimeServer.ts';

/**
 * End-to-end test for the persistent-worker HTTP runtime.
 *
 * Boots `bin/worker-http.ts` in a subprocess — the application bootstrapped once
 * with each request served from an isolated child scope — and asserts live `GET
 * /` requests are served correctly, exercising the full worker entry path over a
 * socket.
 *
 * The worker runtime is Node's own HTTP server (there is no separate runtime to
 * install, unlike PHP's FrankenPHP/RoadRunner/OpenSwoole), so this needs no
 * availability gate beyond the entry file itself being present.
 */
describe('WorkerHttpServerEntry (e2e)', () => {
    const server = new RuntimeServer();

    afterEach(async () => {
        await server.stop();
    });

    it('serves a root request over a real HTTP socket', async () => {
        await server.start('bin/worker-http.ts');

        const { status, body } = await server.get('/');

        expect(status).toBe(200);
        expect(body).toContain('Welcome!');
        expect(body).not.toContain('404');
        expect(server.getOutput()).not.toContain('Error');
    }, 60_000);

    it('serves consecutive requests from the same bootstrapped worker', async () => {
        await server.start('bin/worker-http.ts');

        // A second request proves the worker keeps serving after the first child
        // scope is discarded — no state leaks between requests.
        const first = await server.get('/');
        const second = await server.get('/');

        expect(first.status).toBe(200);
        expect(second.status).toBe(200);
        expect(first.body).toContain('Welcome!');
        expect(second.body).toBe(first.body);
    }, 60_000);
});
