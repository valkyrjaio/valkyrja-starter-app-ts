/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ApplicationServiceId } from '@valkyrjaio/valkyrja/Application/Constant/ApplicationServiceId.js';
import { Route } from '@valkyrjaio/valkyrja/Cli/Routing/Data/Route.js';
import { ServiceProvider } from './ServiceProvider.js';

import type { CliConfigContract } from '@valkyrjaio/valkyrja/Application/Data/Contract/CliConfigContract.js';
import type { OutputContract } from '@valkyrjaio/valkyrja/Cli/Interaction/Output/Contract/OutputContract.js';
import type { RouteContract } from '@valkyrjaio/valkyrja/Cli/Routing/Data/Contract/RouteContract.js';
import type { CliRouteProviderContract } from '@valkyrjaio/valkyrja/Cli/Routing/Provider/Contract/CliRouteProviderContract.js';
import type { ContainerContract } from '@valkyrjaio/valkyrja/Container/Manager/Contract/ContainerContract.js';
import type { TestCommand } from '../Command/TestCommand.js';

export class RouteProvider implements CliRouteProviderContract {
    getRoutes(): RouteContract[] {
        return [new Route('test', 'Test command', RouteProvider.testCommandHandler)];
    }

    static testCommandHandler(this: void, container: ContainerContract, route: RouteContract): OutputContract {
        const config = container.getSingleton<CliConfigContract>(ApplicationServiceId.CliConfigContract);

        return container.getSingleton<TestCommand>(ServiceProvider.TestCommandId).run(route, config);
    }
}
