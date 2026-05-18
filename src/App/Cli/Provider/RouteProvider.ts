import { ApplicationServiceId } from '@valkyrja/valkyrja/Application/Constant/ApplicationServiceId.js';
import { Route } from '@valkyrja/valkyrja/Cli/Routing/Data/Route.js';
import { ServiceProvider } from './ServiceProvider.js';

import type { CliConfigContract } from '@valkyrja/valkyrja/Application/Data/Contract/CliConfigContract.js';
import type { OutputContract } from '@valkyrja/valkyrja/Cli/Interaction/Output/Contract/OutputContract.js';
import type { RouteContract } from '@valkyrja/valkyrja/Cli/Routing/Data/Contract/RouteContract.js';
import type { CliRouteProviderContract } from '@valkyrja/valkyrja/Cli/Routing/Provider/Contract/CliRouteProviderContract.js';
import type { ContainerContract } from '@valkyrja/valkyrja/Container/Manager/Contract/ContainerContract.js';
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
