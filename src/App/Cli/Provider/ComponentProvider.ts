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
import { CliRouteProvider } from './CliRouteProvider.ts';
import { ServiceProvider } from './ServiceProvider.ts';

import type { ApplicationContract } from '@valkyrjaio/valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { CliRouteProviderContract } from '@valkyrjaio/valkyrja/Cli/Routing/Provider/Contract/CliRouteProviderContract.ts';
import type { ComponentProviderContract } from '@valkyrjaio/valkyrja/Application/Provider/Contract/ComponentProviderContract.ts';
import type { ContainerContract } from '@valkyrjaio/valkyrja/Container/Manager/Contract/ContainerContract.ts';
import type { HttpRouteProviderContract } from '@valkyrjaio/valkyrja/Http/Routing/Provider/Contract/HttpRouteProviderContract.ts';
import type { ListenerProviderContract } from '@valkyrjaio/valkyrja/Event/Provider/Contract/ListenerProviderContract.ts';
import type { ServiceProviderContract } from '@valkyrjaio/valkyrja/Container/Provider/Contract/ServiceProviderContract.ts';
import { CliWithHttpApplicationComponentProvider } from '@valkyrjaio/valkyrja/Application/Provider/CliWithHttpApplicationComponentProvider.ts';

export class ComponentProvider implements ComponentProviderContract {
    getComponentProviders(_app: ApplicationContract): ComponentProviderContract[] {
        return [new CliWithHttpApplicationComponentProvider()];
    }

    getContainerProviders(_app: ApplicationContract): ServiceProviderContract[] {
        return [new DataServiceProvider(), new ServiceProvider()];
    }

    getEventProviders(_app: ApplicationContract): ListenerProviderContract[] {
        return [];
    }

    getCliProviders(_app: ApplicationContract): CliRouteProviderContract[] {
        return [new CliRouteProvider()];
    }

    getHttpProviders(_app: ApplicationContract): HttpRouteProviderContract[] {
        return [];
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
