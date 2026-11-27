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
import { StatusCode } from '@valkyrjaio/valkyrja/Grpc/Message/Enum/StatusCode.ts';

import { AppGrpcServiceId } from '../../../../../src/App/Grpc/Constant/AppGrpcServiceId.ts';
import { PingController } from '../../../../../src/App/Grpc/Controller/PingController.ts';
import { GrpcRouteProvider } from '../../../../../src/App/Grpc/Provider/GrpcRouteProvider.ts';

function containerWithPing(): Container {
    const container = new Container();

    container.setSingleton(AppGrpcServiceId.PingController, new PingController());
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

    it('answers a unary call with the message the controller renders', async () => {
        const response = await GrpcRouteProvider.pingHandler(containerWithPing());

        expect(response.getStatus().getCode()).toBe(StatusCode.OK);
        expect([...response.getMessages()]).toStrictEqual(['pong: hi']);
    });

    it('answers a server-streaming call with every message the controller fans out', async () => {
        const response = await GrpcRouteProvider.fanoutHandler(containerWithPing());

        expect(response.getStatus().getCode()).toBe(StatusCode.OK);
        expect([...response.getMessages()]).toStrictEqual(['hi: one', 'hi: two', 'hi: three']);
    });

    it('answers a client-streaming call with the count the controller collects', async () => {
        const response = await GrpcRouteProvider.collectHandler(containerWithPing());

        expect(response.getStatus().getCode()).toBe(StatusCode.OK);
        expect([...response.getMessages()]).toStrictEqual(['collected 1']);
    });

    it('answers a missing record with NOT_FOUND and no message', async () => {
        const response = await GrpcRouteProvider.missingHandler(containerWithPing());

        expect(response.getStatus().getCode()).toBe(StatusCode.NOT_FOUND);
        expect(response.getStatus().getMessage()).toBe('no such record');
        expect([...response.getMessages()]).toStrictEqual([]);
    });
});
