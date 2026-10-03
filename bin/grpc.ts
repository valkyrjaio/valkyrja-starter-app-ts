/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ServiceCall } from '@valkyrjaio/valkyrja/Grpc/Message/Call/ServiceCall.ts';
import { App } from '../src/App/Grpc/App.ts';
import { Config } from '../src/App/Grpc/Config.ts';

const debugMode = process.env['APP_DEBUG'] === 'true';
const method = process.argv[2] ?? '/app.Ping/Ping';
const message = process.argv[3] ?? 'hello';

// gRPC has no in-core server — HTTP/2 with trailers is out of reach for the built-in one — so this
// entry dispatches a single call through the full pipeline. Serving goes through a transport
// adapter driving `WorkerApp`.
const response = await App.handle(new Config(debugMode), ServiceCall.unary(method, message));

process.stdout.write(`status: ${String(response.getStatus().getCode())} ${response.getStatus().getMessage()}\n`);

for (const outbound of response.getMessages()) {
    process.stdout.write(`message: ${String(outbound)}\n`);
}
