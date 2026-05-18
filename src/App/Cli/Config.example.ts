import { CliConfig } from '@valkyrja/valkyrja/Application/Data/CliConfig.js';
import { CliCommandName } from '@valkyrja/valkyrja/Cli/Server/Constant/CommandName.js';
import { ComponentProvider } from './Provider/ComponentProvider.js';

import type { ApplicationContract } from '@valkyrja/valkyrja/Application/Kernel/Contract/ApplicationContract.js';

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
