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
