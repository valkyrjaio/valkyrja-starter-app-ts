/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
import { LoggerContractId } from '@valkyrjaio/valkyrja/Log/Logger/Contract/LoggerContract.ts';
import { AppCliServiceId } from '../../../../src/App/Cli/Constant/AppCliServiceId.ts';
import { AppHttpServiceId } from '../../../../src/App/Http/Constant/AppHttpServiceId.ts';

// Asserts the REAL Sindri-generated container data. Every key below is named by
// a binding-key constant rather than a bare string, covering each form Sindri
// has to resolve: a framework class static (`'…' as const`), a constant the
// provider declares for its own service, and a module-level exported constant.
// A key missing here means Sindri stopped resolving that form and silently
// dropped the publishers it names — the failure that left the cached
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

    it("publishes the services the application's own ServiceProvider declares", () => {
        // Keyed by a constant the application declares itself, which lives in no import map.
        expect(Object.keys(data.deferredCallback)).toContain(AppCliServiceId.TestCommand);
        expect(Object.keys(httpData.deferredCallback)).toContain(AppHttpServiceId.HomeController);
    });

    it('publishes the service keyed by a module-level constant', () => {
        // `LoggerContractId` is an exported const, not a class static.
        expect(Object.keys(data.deferredCallback)).toContain(LoggerContractId);
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
