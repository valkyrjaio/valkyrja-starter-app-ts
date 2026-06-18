/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HttpConfig } from '@valkyrjaio/valkyrja/Application/Data/HttpConfig.ts';
import { ComponentProvider } from './Provider/ComponentProvider.ts';

export class Config extends HttpConfig {
    constructor() {
        super(
            'App',
            process.cwd(),
            '1.0.0',
            'production',
            false,
            'UTC',
            'some_secret_app_key',
            'src/App/Http/Data',
            'App/Http/Data',
            [new ComponentProvider()],
        );
    }
}
