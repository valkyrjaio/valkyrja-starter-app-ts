/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Container } from '@valkyrjaio/valkyrja/Container/Manager/Container.ts';
import { GrpcMessageServiceId } from '@valkyrjaio/valkyrja/Grpc/Message/Constant/GrpcMessageServiceId.ts';
import { ServiceCall } from '@valkyrjaio/valkyrja/Grpc/Message/Call/ServiceCall.ts';

import { PingController } from '../../../../../src/App/Grpc/Controller/PingController.ts';
import { GrpcRouteProvider } from '../../../../../src/App/Grpc/Provider/GrpcRouteProvider.ts';
import { ServiceProvider } from '../../../../../src/App/Grpc/Provider/ServiceProvider.ts';

function containerWithPing(): Container {
    const container = new Container();

    container.setSingleton(ServiceProvider.PingControllerId, new PingController());
    container.setSingleton(GrpcMessageServiceId.ServiceCallContract, ServiceCall.unary('/app.Ping/Ping', 'hi'));

    return container;
}

describe('GrpcRouteProvider', () => {
    // The four ping routes moved from `getRoutes()` onto `PingController`'s `@Method`
    // decorators; Sindri reads them statically from the controller that
    // `getControllerClasses()` names, so the imperative list is now empty.
    it('registers no imperative routes, declaring them on the controller instead', () => {
        expect(new GrpcRouteProvider().getRoutes()).toStrictEqual([]);
    });

    // Debug mode rediscovers routes at run time from this list, so it must hand
    // back the real class object, not a type-only reference erased at run time.
    it('names the controller its routes are declared on', () => {
        expect(new GrpcRouteProvider().getControllerClasses()).toStrictEqual([PingController]);
    });

    it('runs each route handler against the controller the container holds', async () => {
        const container = containerWithPing();

        await expect(GrpcRouteProvider.pingHandler(container)).resolves.toBeDefined();
        await expect(GrpcRouteProvider.fanoutHandler(container)).resolves.toBeDefined();
        await expect(GrpcRouteProvider.collectHandler(container)).resolves.toBeDefined();
        await expect(GrpcRouteProvider.missingHandler(container)).resolves.toBeDefined();
    });
});
