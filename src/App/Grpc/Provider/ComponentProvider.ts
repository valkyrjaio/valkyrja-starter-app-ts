/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ComponentProvider as ValkyrjaComponentProvider } from '@valkyrjaio/valkyrja/Application/Provider/Abstract/ComponentProvider.ts';
import { GrpcApplicationComponentProvider } from '@valkyrjaio/valkyrja/Application/Provider/GrpcApplicationComponentProvider.ts';
import { ContainerServiceProvider } from '@valkyrjaio/valkyrja/Container/Provider/ContainerServiceProvider.ts';
import { DataServiceProvider } from './DataServiceProvider.ts';
import { GrpcRouteProvider } from './GrpcRouteProvider.ts';
import { ServiceProvider } from './ServiceProvider.ts';

import type { ApplicationContract } from '@valkyrjaio/valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { ComponentProviderContract } from '@valkyrjaio/valkyrja/Application/Provider/Contract/ComponentProviderContract.ts';
import type { ContainerContract } from '@valkyrjaio/valkyrja/Container/Manager/Contract/ContainerContract.ts';
import type { ServiceProviderContract } from '@valkyrjaio/valkyrja/Container/Provider/Contract/ServiceProviderContract.ts';
import type { GrpcRouteProviderContract } from '@valkyrjaio/valkyrja/Grpc/Routing/Provider/Contract/GrpcRouteProviderContract.ts';

export class ComponentProvider extends ValkyrjaComponentProvider {
    override getComponentProviders(_app: ApplicationContract): ComponentProviderContract[] {
        return [new GrpcApplicationComponentProvider()];
    }

    override getContainerProviders(_app: ApplicationContract): ServiceProviderContract[] {
        return [new DataServiceProvider(), new ServiceProvider()];
    }

    override getGrpcProviders(_app: ApplicationContract): GrpcRouteProviderContract[] {
        return [new GrpcRouteProvider()];
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
