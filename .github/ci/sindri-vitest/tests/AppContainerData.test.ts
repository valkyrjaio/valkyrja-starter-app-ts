/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { AppContainerData } from '../../../../src/App/Cli/Data/AppContainerData.ts';
import { AppContainerData as HttpAppContainerData } from '../../../../src/App/Http/Data/AppContainerData.ts';
import { CliRoutingServiceId } from '@valkyrjaio/valkyrja/Cli/Routing/Constant/CliRoutingServiceId.ts';
import { CliServerServiceId } from '@valkyrjaio/valkyrja/Cli/Server/Constant/CliServerServiceId.ts';
import { ContainerData } from '@valkyrjaio/valkyrja/Container/Data/ContainerData.ts';
import { ContainerServiceId } from '@valkyrjaio/valkyrja/Container/Constant/ContainerServiceId.ts';
import { EventServiceId } from '@valkyrjaio/valkyrja/Event/Constant/EventServiceId.ts';
import { HttpRoutingServiceId } from '@valkyrjaio/valkyrja/Http/Routing/Constant/HttpRoutingServiceId.ts';
import { HttpServerServiceId } from '@valkyrjaio/valkyrja/Http/Server/Constant/HttpServerServiceId.ts';

// Asserts the REAL Sindri-generated container data. Every key below is named by
// a framework binding-key constant declared as `'…' as const`, so an empty
// `deferredCallback` here means Sindri stopped resolving those constants and
// silently dropped the publishers they name — the failure that left the cached
// (non-debug) application unable to resolve its own input handler.
describe('generated AppContainerData', () => {
    const data = new AppContainerData();
    const httpData = new HttpAppContainerData();

    it('is a ContainerData', () => {
        expect(data).toBeInstanceOf(ContainerData);
        expect(httpData).toBeInstanceOf(ContainerData);
    });

    it('publishes the deferred services the CLI application needs', () => {
        expect(Object.keys(data.deferredCallback)).toContain(CliServerServiceId.InputHandlerContract);
        expect(Object.keys(data.deferredCallback)).toContain(CliRoutingServiceId.CliRoutingData);
    });

    it('publishes the deferred services the HTTP application needs', () => {
        expect(Object.keys(httpData.deferredCallback)).toContain(HttpServerServiceId.RequestHandlerContract);
        expect(Object.keys(httpData.deferredCallback)).toContain(HttpRoutingServiceId.HttpRoutingData);
    });

    it("publishes the application's own DataServiceProvider services", () => {
        for (const cache of [data, httpData]) {
            expect(Object.keys(cache.deferredCallback)).toContain(ContainerServiceId.Data);
            expect(Object.keys(cache.deferredCallback)).toContain(EventServiceId.EventData);
        }
    });

    it('registers the container data itself when its deferred callback runs', () => {
        const singletons: Record<string, unknown> = {};
        const container = {
            setSingleton: (id: string, service: unknown): void => {
                singletons[id] = service;
            },
        } as unknown as Parameters<(typeof data.deferredCallback)[string]>[0];

        data.deferredCallback[ContainerServiceId.Data]!(container);

        expect(singletons[ContainerServiceId.Data]).toBeInstanceOf(AppContainerData);
    });
});
