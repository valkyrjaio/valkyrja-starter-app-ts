/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ServiceCall } from '@valkyrjaio/valkyrja/Grpc/Message/Call/ServiceCall.ts';
import { Config } from '../src/App/Grpc/Config.ts';
import { WorkerApp } from '../src/App/Grpc/WorkerApp.ts';

const debugMode = process.env['APP_DEBUG'] === 'true';
const method = process.argv[2] ?? '/app.Ping/Ping';
const message = process.argv[3] ?? 'hello';

// Bootstrap once, then dispatch per call — the shape a transport adapter drives. A real adapter
// builds each `ServiceCall` from the wire instead of from argv, and writes the response back
// through the writer callback.
const app = WorkerApp.bootstrap(new Config(debugMode));
const data = app.getContainer().getData();

await WorkerApp.dispatch(app, data, ServiceCall.unary(method, message), (response) => {
    process.stdout.write(`status: ${String(response.getStatus().getCode())} ${response.getStatus().getMessage()}\n`);

    for (const outbound of response.getMessages()) {
        process.stdout.write(`message: ${String(outbound)}\n`);
    }
});
