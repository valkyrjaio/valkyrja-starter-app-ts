/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { afterEach, describe, expect, it } from 'vitest';

import { RuntimeServer } from '../Abstract/RuntimeServer.ts';

/**
 * End-to-end test for the standard HTTP runtime.
 *
 * Boots `bin/http.ts` in a subprocess — the real Node server the application
 * ships — and asserts a live `GET /` HTTP request boots the application, matches
 * the welcome route, and renders its view, exercising the full entry path over a
 * socket.
 */
describe('HttpServerEntry (e2e)', () => {
    const server = new RuntimeServer();

    afterEach(async () => {
        await server.stop();
    });

    it('serves a root request over a real HTTP socket', async () => {
        await server.start('bin/http.ts');

        const { status, body } = await server.get('/');

        expect(status).toBe(200);
        expect(body).toContain('Welcome!');
        expect(body).not.toContain('404');
        expect(server.getOutput()).not.toContain('Error');
    }, 60_000);
});
