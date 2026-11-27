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

import { PingController } from '../../../../../src/App/Grpc/Controller/PingController.ts';

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
});
