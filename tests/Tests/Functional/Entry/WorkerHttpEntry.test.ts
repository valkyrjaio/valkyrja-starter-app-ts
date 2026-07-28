/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ContainerData } from '@valkyrjaio/valkyrja/Container/Data/ContainerData.ts';
import { StatusCode } from '@valkyrjaio/valkyrja/Http/Message/Enum/StatusCode.ts';
import { HttpServerServiceId } from '@valkyrjaio/valkyrja/Http/Server/Constant/HttpServerServiceId.ts';
import { RequestMethod } from '@valkyrjaio/valkyrja/Http/Message/Enum/RequestMethod.ts';
import { ServerRequest } from '@valkyrjaio/valkyrja/Http/Message/Request/ServerRequest.ts';
import { UriFactory } from '@valkyrjaio/valkyrja/Http/Message/Uri/Factory/UriFactory.ts';

import { App } from '../../../../src/App/WorkerHttp/App.ts';
import { Config } from '../../../../src/App/Http/Config.ts';

import type { RequestHandlerContract } from '@valkyrjaio/valkyrja/Http/Server/Handler/Contract/RequestHandlerContract.ts';

/**
 * In-process smoke test for the worker HTTP entry point (`App/WorkerHttp/App`).
 *
 * The over-the-socket run in `WorkerHttpServerEntry.test.ts` executes in a
 * subprocess, whose execution coverage instrumentation cannot see, so this boots
 * the same entry in process — bootstrapping the worker once and dispatching a
 * request through an isolated child scope — to cover the entry module and catch
 * regressions in the entry wiring, provider bootstrap, or routing.
 *
 * The config runs in debug mode so the framework discovers routes at runtime and
 * the entry functions against the committed (empty) data stubs.
 */
describe('WorkerHttpEntry', () => {
    it('bootstraps once and dispatches GET / to the welcome view from a child scope', () => {
        const app = App.bootstrap(new Config(true));
        const data = app.getContainer().getData();

        // Mirror the per-request work `handle()` performs, then dispatch through
        // the child container the worker would use for the request.
        const childContainer = App.getChildContainer(app, data);
        const childApp = App.getChildApplication(app, childContainer);

        App.bootstrapChildContainer(childApp, childContainer);

        expect(data).toBeInstanceOf(ContainerData);

        const handler = childContainer.getSingleton<RequestHandlerContract>(HttpServerServiceId.RequestHandlerContract);
        const request = new ServerRequest(UriFactory.fromString('http://localhost/'), RequestMethod.GET);

        const response = handler.handle(request);

        expect(response.getStatusCode()).toBe(StatusCode.OK);

        const body = response.getBody();
        body.rewind();

        expect(body.getContents()).toContain('Welcome!');
    });

    it('serves each request from a distinct child scope', () => {
        const app = App.bootstrap(new Config(true));
        const data = app.getContainer().getData();

        const first = App.getChildContainer(app, data);
        const second = App.getChildContainer(app, data);

        expect(first).not.toBe(second);
    });
});
