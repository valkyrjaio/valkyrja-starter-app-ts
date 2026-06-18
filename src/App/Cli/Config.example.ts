/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CliConfig } from '@valkyrjaio/valkyrja/Application/Data/CliConfig.ts';
import { CliCommandName } from '@valkyrjaio/valkyrja/Cli/Server/Constant/CommandName.ts';
import { ComponentProvider } from './Provider/ComponentProvider.ts';

import type { ApplicationContract } from '@valkyrjaio/valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

export class Config extends CliConfig {
    constructor() {
        super(
            'App',
            process.cwd(),
            '1.0.0',
            'production',
            true,
            'UTC',
            'some_secret_app_key',
            'src/App/Cli/Data',
            'App/Cli/Data',
            'cli',
            CliCommandName.LIST,
            [new ComponentProvider()],
            [
                (app: ApplicationContract) => {
                    ComponentProvider.publish(app);
                },
            ],
        );
    }
}
