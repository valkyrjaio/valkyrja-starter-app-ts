/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { StatusCode } from '@valkyrjaio/valkyrja/Grpc/Message/Enum/StatusCode.ts';
import { ServiceCall } from '@valkyrjaio/valkyrja/Grpc/Message/Call/ServiceCall.ts';

import { AttributeRouteCollector } from '@valkyrjaio/valkyrja/Grpc/Routing/Collector/AttributeRouteCollector.ts';

import { PingController } from '../../../../../src/App/Grpc/Controller/PingController.ts';
import { GrpcRouteProvider } from '../../../../../src/App/Grpc/Provider/GrpcRouteProvider.ts';

const call = (message: unknown): ServiceCall => ServiceCall.unary('/app.Ping/Ping', message);

describe('PingController', () => {
    const controller = new PingController();

    it('answers a unary call with the inbound message', () => {
        expect(controller.ping(call('hi')).getMessages()).toStrictEqual(['pong: hi']);
    });

    // A gRPC payload is deliberately agnostic, so a non-string message takes the
    // controller's own rendering rather than default stringification.
    it('renders a non-string message as JSON', () => {
        expect(controller.ping(call({ a: 1 })).getMessages()).toStrictEqual(['pong: {"a":1}']);
    });

    it('renders an absent unary message as the empty string', () => {
        expect(controller.ping(call(undefined)).getMessages()).toStrictEqual(['pong: ']);
    });

    it('fans out three messages for a server-streaming call', () => {
        expect(controller.fanout(call('hi')).getMessages()).toStrictEqual(['hi: one', 'hi: two', 'hi: three']);
    });

    it('renders an absent message as the empty string', () => {
        expect(controller.fanout(call(undefined)).getMessages()).toStrictEqual([': one', ': two', ': three']);
    });

    it('counts the messages of a client-streaming call', () => {
        expect(controller.collect(call('hi')).getMessages()).toStrictEqual(['collected 1']);
    });

    it('returns NOT_FOUND as a domain outcome rather than a throw', () => {
        const response = controller.missing();

        expect(response.getStatus().getCode()).toBe(StatusCode.NOT_FOUND);
        expect(response.getStatus().getMessage()).toBe('no such record');
    });

    // The decorators are the route declarations, so read them back through the same collector the
    // framework uses in debug mode. This also proves each handler thunk resolves — a thunk that
    // names a missing method silently degrades the route to UNIMPLEMENTED.
    it('declares the four service methods through its decorators', () => {
        const routes = new AttributeRouteCollector().getRoutes(PingController);

        expect(routes.map((route) => route.getMethod())).toStrictEqual([
            '/app.Ping/Ping',
            '/app.Ping/Fanout',
            '/app.Ping/Collect',
            '/app.Ping/Missing',
        ]);
        expect(routes.map((route) => route.isClientStreaming())).toStrictEqual([false, false, true, false]);
        expect(routes.map((route) => route.isServerStreaming())).toStrictEqual([false, true, false, false]);
        expect(routes.map((route) => route.getHandler())).toStrictEqual([
            GrpcRouteProvider.pingHandler,
            GrpcRouteProvider.fanoutHandler,
            GrpcRouteProvider.collectHandler,
            GrpcRouteProvider.missingHandler,
        ]);
    });
});
