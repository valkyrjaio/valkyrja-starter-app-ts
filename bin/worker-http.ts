/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { WorkerApp } from '../src/App/Http/WorkerApp.ts';
import { Config } from '../src/App/Http/Config.ts';

const port = process.env['PORT'] !== undefined ? Number(process.env['PORT']) : 3000;
const debugMode = process.env['APP_DEBUG'] === 'true';

WorkerApp.run(new Config(debugMode), port);
