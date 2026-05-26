/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CliInteractionServiceId } from '@valkyrja/valkyrja/Cli/Interaction/Constant/CliInteractionServiceId.js';
import { LoggerContractId } from '@valkyrja/valkyrja/Log/Logger/Contract/LoggerContract.js';
import { TestCommand } from '../Command/TestCommand.js';

import type { InputContract } from '@valkyrja/valkyrja/Cli/Interaction/Input/Contract/InputContract.js';
import type { OutputFactoryContract } from '@valkyrja/valkyrja/Cli/Interaction/Output/Factory/Contract/OutputFactoryContract.js';
import type { ContainerContract } from '@valkyrja/valkyrja/Container/Manager/Contract/ContainerContract.js';
import type { LoggerContract } from '@valkyrja/valkyrja/Log/Logger/Contract/LoggerContract.js';
import type { ServiceProviderContract } from '@valkyrja/valkyrja/Container/Provider/Contract/ServiceProviderContract.js';

export class ServiceProvider implements ServiceProviderContract {
    static readonly TestCommandId = 'App.Cli.Command.TestCommand' as const;

    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [ServiceProvider.TestCommandId]: ServiceProvider.publishTestCommand,
            [LoggerContractId]: ServiceProvider.publishLogger,
        };
    }

    static publishTestCommand(this: void, container: ContainerContract): void {
        container.setSingleton<TestCommand>(
            ServiceProvider.TestCommandId,
            new TestCommand(
                container.getSingleton<InputContract>(CliInteractionServiceId.InputContract),
                container.getSingleton<OutputFactoryContract>(CliInteractionServiceId.OutputFactoryContract),
            ),
        );
    }

    static publishLogger(this: void, container: ContainerContract): void {
        const nullLogger: LoggerContract = {
            throwable: () => {},
            debug: () => {},
            info: () => {},
            notice: () => {},
            warning: () => {},
            error: () => {},
            critical: () => {},
            alert: () => {},
            emergency: () => {},
        };

        container.setSingleton<LoggerContract>(LoggerContractId, nullLogger);
    }
}
