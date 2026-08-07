/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ServiceResponse } from '@valkyrjaio/valkyrja/Grpc/Message/Response/ServiceResponse.ts';
import { Status } from '@valkyrjaio/valkyrja/Grpc/Message/Status/Status.ts';
import { Controller } from './Abstract/Controller.ts';

import type { ServiceCallContract } from '@valkyrjaio/valkyrja/Grpc/Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '@valkyrjaio/valkyrja/Grpc/Message/Response/Contract/ServiceResponseContract.ts';

export class PingController extends Controller {
    /**
     * Render an inbound message for the demo responses.
     *
     * gRPC message payloads are deliberately agnostic — the framework never sees the generated
     * protobuf type — so a controller that wants text has to say what a non-string payload means
     * rather than relying on default stringification.
     */
    protected static render(message: unknown): string {
        return typeof message === 'string' ? message : JSON.stringify(message);
    }

    /** Unary: one message in, one message out. */
    ping(call: ServiceCallContract): ServiceResponseContract {
        const messages = [...(call.getMessages() as Iterable<unknown>)];

        return ServiceResponse.ok(`pong: ${PingController.render(messages[0] ?? '')}`);
    }

    /** Server-streaming: one message in, several out, drained lazily by the adapter. */
    fanout(call: ServiceCallContract): ServiceResponseContract {
        const messages = [...(call.getMessages() as Iterable<unknown>)];
        const prefix = PingController.render(messages[0] ?? '');

        return ServiceResponse.ok().withMessages([`${prefix}: one`, `${prefix}: two`, `${prefix}: three`]);
    }

    /** Client-streaming: several messages in, one out. */
    collect(call: ServiceCallContract): ServiceResponseContract {
        const messages = [...(call.getMessages() as Iterable<unknown>)];

        return ServiceResponse.ok(`collected ${String(messages.length)}`);
    }

    /** A domain outcome the handler owns, returned rather than thrown. */
    missing(): ServiceResponseContract {
        return ServiceResponse.of(Status.notFound('no such record'));
    }
}
