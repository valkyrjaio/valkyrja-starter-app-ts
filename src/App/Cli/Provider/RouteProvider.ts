/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ApplicationServiceId } from '@valkyrjaio/valkyrja/Application/Constant/ApplicationServiceId.ts';
import { Route } from '@valkyrjaio/valkyrja/Cli/Routing/Data/Route.ts';
import { ServiceProvider } from './ServiceProvider.ts';

import type { CliConfigContract } from '@valkyrjaio/valkyrja/Application/Data/Contract/CliConfigContract.ts';
import type { OutputContract } from '@valkyrjaio/valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';
import type { RouteContract } from '@valkyrjaio/valkyrja/Cli/Routing/Data/Contract/RouteContract.ts';
import type { CliRouteProviderContract } from '@valkyrjaio/valkyrja/Cli/Routing/Provider/Contract/CliRouteProviderContract.ts';
import type { ContainerContract } from '@valkyrjaio/valkyrja/Container/Manager/Contract/ContainerContract.ts';
import type { TestCommand } from '../Command/TestCommand.ts';

export class RouteProvider implements CliRouteProviderContract {
    getRoutes(): RouteContract[] {
        return [new Route('test', 'Test command', RouteProvider.testCommandHandler)];
    }

    static testCommandHandler(this: void, container: ContainerContract, route: RouteContract): OutputContract {
        const config = container.getSingleton<CliConfigContract>(ApplicationServiceId.CliConfigContract);

        return container.getSingleton<TestCommand>(ServiceProvider.TestCommandId).run(route, config);
    }
}
