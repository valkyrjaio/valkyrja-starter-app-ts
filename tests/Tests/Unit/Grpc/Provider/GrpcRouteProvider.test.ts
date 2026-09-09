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
    it('registers one route per service method, keyed by fully-qualified method', () => {
        expect(new GrpcRouteProvider().getRoutes().map((route) => route.getMethod())).toStrictEqual([
            '/app.Ping/Ping',
            '/app.Ping/Fanout',
            '/app.Ping/Collect',
            '/app.Ping/Missing',
        ]);
    });

    it('carries the streaming shape of each method', () => {
        const routes = new GrpcRouteProvider().getRoutes();

        expect(routes.map((route) => route.isClientStreaming())).toStrictEqual([false, false, true, false]);
        expect(routes.map((route) => route.isServerStreaming())).toStrictEqual([false, true, false, false]);
    });

    it('runs each route handler against the controller the container holds', async () => {
        const container = containerWithPing();

        await expect(GrpcRouteProvider.pingHandler(container)).resolves.toBeDefined();
        await expect(GrpcRouteProvider.fanoutHandler(container)).resolves.toBeDefined();
        await expect(GrpcRouteProvider.collectHandler(container)).resolves.toBeDefined();
        await expect(GrpcRouteProvider.missingHandler(container)).resolves.toBeDefined();
    });
});
