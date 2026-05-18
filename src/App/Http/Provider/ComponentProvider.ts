import { ContainerServiceProvider } from '@valkyrja/valkyrja/Container/Provider/ContainerServiceProvider.js';
import { DataServiceProvider } from './DataServiceProvider.js';
import { RouteProvider } from './RouteProvider.js';
import { ServiceProvider } from './ServiceProvider.js';

import type { ApplicationContract } from '@valkyrja/valkyrja/Application/Kernel/Contract/ApplicationContract.js';
import type { CliRouteProviderContract } from '@valkyrja/valkyrja/Cli/Routing/Provider/Contract/CliRouteProviderContract.js';
import type { ComponentProviderContract } from '@valkyrja/valkyrja/Application/Provider/Contract/ComponentProviderContract.js';
import type { ContainerContract } from '@valkyrja/valkyrja/Container/Manager/Contract/ContainerContract.js';
import type { HttpRouteProviderContract } from '@valkyrja/valkyrja/Http/Routing/Provider/Contract/HttpRouteProviderContract.js';
import type { ListenerProviderContract } from '@valkyrja/valkyrja/Event/Provider/Contract/ListenerProviderContract.js';
import type { ServiceProviderContract } from '@valkyrja/valkyrja/Container/Provider/Contract/ServiceProviderContract.js';
import { HttpApplicationComponentProvider } from '@valkyrja/valkyrja/Application/Provider/HttpApplicationComponentProvider.js';

export class ComponentProvider implements ComponentProviderContract {
    getComponentProviders(_app: ApplicationContract): ComponentProviderContract[] {
        return [new HttpApplicationComponentProvider()];
    }

    getContainerProviders(_app: ApplicationContract): ServiceProviderContract[] {
        return [new DataServiceProvider(), new ServiceProvider()];
    }

    getEventProviders(_app: ApplicationContract): ListenerProviderContract[] {
        return [];
    }

    getCliProviders(_app: ApplicationContract): CliRouteProviderContract[] {
        return [];
    }

    getHttpProviders(_app: ApplicationContract): HttpRouteProviderContract[] {
        return [new RouteProvider()];
    }

    static publish(app: ApplicationContract): void {
        const container: ContainerContract = app.getContainer();

        if (app.getDebugMode()) {
            ContainerServiceProvider.publishData(container);

            return;
        }

        DataServiceProvider.publishContainerData(container);
    }
}
