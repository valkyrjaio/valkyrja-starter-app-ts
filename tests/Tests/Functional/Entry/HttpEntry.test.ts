/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { HttpConfig } from '@valkyrjaio/valkyrja/Application/Data/HttpConfig.ts';
import { StatusCode } from '@valkyrjaio/valkyrja/Http/Message/Enum/StatusCode.ts';
import { RequestMethod } from '@valkyrjaio/valkyrja/Http/Message/Enum/RequestMethod.ts';
import { ServerRequest } from '@valkyrjaio/valkyrja/Http/Message/Request/ServerRequest.ts';
import { UriFactory } from '@valkyrjaio/valkyrja/Http/Message/Uri/Factory/UriFactory.ts';
import { HttpServerServiceId } from '@valkyrjaio/valkyrja/Http/Server/Constant/HttpServerServiceId.ts';

import { App } from '../../../../src/App/Http/App.ts';
import { ComponentProvider } from '../../../../src/App/Http/Provider/ComponentProvider.ts';

import type { RequestHandlerContract } from '@valkyrjaio/valkyrja/Http/Server/Handler/Contract/RequestHandlerContract.ts';

/**
 * End-to-end smoke test for the HTTP entry point (`App/Http/App`).
 *
 * `bin/` ships no committed HTTP entry file, so this boots the `App/Http/App`
 * entry in process with the application's real `ComponentProvider` (the same
 * controllers, routes, and providers the server would use) and dispatches a
 * `GET /` request through the request handler, asserting a 2xx response rendering
 * the welcome view — catching regressions in the entry wiring, provider
 * bootstrap, or routing that class-level tests miss.
 *
 * The config runs in debug mode (as the CLI config already does) so the framework
 * discovers routes at runtime and the entry functions against the committed
 * (empty) data stubs, rather than depending on generated routing data.
 */
function debugConfig(): HttpConfig {
    return new HttpConfig(
        'App',
        process.cwd(),
        '1.0.0',
        'production',
        true,
        'UTC',
        'some_secret_app_key',
        'src/App/Http/Data',
        'App/Http/Data',
        [new ComponentProvider()],
    );
}

describe('HttpEntry', () => {
    it('boots and dispatches GET / to the welcome view', () => {
        const app = App.start(debugConfig());
        const container = app.getContainer();

        const handler = container.getSingleton<RequestHandlerContract>(HttpServerServiceId.RequestHandlerContract);
        const request = new ServerRequest(UriFactory.fromString('http://localhost/'), RequestMethod.GET);

        const response = handler.handle(request);

        expect(response.getStatusCode()).toBe(StatusCode.OK);

        const body = response.getBody();
        body.rewind();

        expect(body.getContents()).toContain('Welcome!');
    });
});
