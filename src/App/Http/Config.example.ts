/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { HttpConfig } from '@valkyrjaio/valkyrja/Application/Data/HttpConfig.ts';
import { ComponentProvider } from './Provider/ComponentProvider.ts';

export class Config extends HttpConfig {
    constructor(debugMode: boolean = false) {
        super(
            'App',
            process.cwd(),
            '1.0.0',
            'production',
            debugMode,
            'UTC',
            'some_secret_app_key',
            'src/App/Http/Data',
            'App/Http/Data',
            [new ComponentProvider()],
        );
    }
}
