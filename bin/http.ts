/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { App } from '../src/App/Http/App.ts';
import { Config } from '../src/App/Http/Config.ts';

const port = process.env['PORT'] !== undefined ? Number(process.env['PORT']) : 3000;
const debugMode = process.env['APP_DEBUG'] === 'true';

App.run(new Config(debugMode), port);
