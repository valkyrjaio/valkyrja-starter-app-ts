/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CliInteractionServiceId } from '@valkyrjaio/valkyrja/Cli/Interaction/Constant/CliInteractionServiceId.ts';
import { LoggerContractId } from '@valkyrjaio/valkyrja/Log/Logger/Contract/LoggerContract.ts';
import { TestCommand } from '../Command/TestCommand.ts';

import type { InputContract } from '@valkyrjaio/valkyrja/Cli/Interaction/Input/Contract/InputContract.ts';
import type { OutputFactoryContract } from '@valkyrjaio/valkyrja/Cli/Interaction/Output/Factory/Contract/OutputFactoryContract.ts';
import type { ContainerContract } from '@valkyrjaio/valkyrja/Container/Manager/Contract/ContainerContract.ts';
import type { LoggerContract } from '@valkyrjaio/valkyrja/Log/Logger/Contract/LoggerContract.ts';
import type { ServiceProviderContract } from '@valkyrjaio/valkyrja/Container/Provider/Contract/ServiceProviderContract.ts';

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
