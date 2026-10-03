/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { GrpcConfig } from '@valkyrjaio/valkyrja/Application/Data/GrpcConfig.ts';
import { ComponentProvider } from './Provider/ComponentProvider.ts';

export class Config extends GrpcConfig {
    constructor(debugMode: boolean = false) {
        super(
            'App',
            process.cwd(),
            '1.0.0',
            'production',
            debugMode,
            'UTC',
            'some_secret_app_key',
            'src/App/Grpc/Data',
            'App/Grpc/Data',
            50051,
            1000,
            [new ComponentProvider()],
        );
    }
}
