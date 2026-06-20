/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ContainerServiceProvider } from '@valkyrjaio/valkyrja/Container/Provider/ContainerServiceProvider.ts';
import { DataServiceProvider } from './DataServiceProvider.ts';
import { HttpRouteProvider } from './HttpRouteProvider.ts';
import { ServiceProvider } from './ServiceProvider.ts';

import type { ApplicationContract } from '@valkyrjaio/valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { CliRouteProviderContract } from '@valkyrjaio/valkyrja/Cli/Routing/Provider/Contract/CliRouteProviderContract.ts';
import type { ComponentProviderContract } from '@valkyrjaio/valkyrja/Application/Provider/Contract/ComponentProviderContract.ts';
import type { ContainerContract } from '@valkyrjaio/valkyrja/Container/Manager/Contract/ContainerContract.ts';
import type { HttpRouteProviderContract } from '@valkyrjaio/valkyrja/Http/Routing/Provider/Contract/HttpRouteProviderContract.ts';
import type { ListenerProviderContract } from '@valkyrjaio/valkyrja/Event/Provider/Contract/ListenerProviderContract.ts';
import type { ServiceProviderContract } from '@valkyrjaio/valkyrja/Container/Provider/Contract/ServiceProviderContract.ts';
import { HttpApplicationComponentProvider } from '@valkyrjaio/valkyrja/Application/Provider/HttpApplicationComponentProvider.ts';

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
        return [new HttpRouteProvider()];
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
