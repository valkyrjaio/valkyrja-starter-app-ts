/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ComponentProvider as ValkyrjaComponentProvider } from '@valkyrjaio/valkyrja/Application/Provider/Abstract/ComponentProvider.ts';
import { ContainerServiceProvider } from '@valkyrjaio/valkyrja/Container/Provider/ContainerServiceProvider.ts';
import { DataServiceProvider } from './DataServiceProvider.ts';
import { HttpRouteProvider } from './HttpRouteProvider.ts';
import { ServiceProvider } from './ServiceProvider.ts';

import type { ApplicationContract } from '@valkyrjaio/valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { ComponentProviderContract } from '@valkyrjaio/valkyrja/Application/Provider/Contract/ComponentProviderContract.ts';
import type { ContainerContract } from '@valkyrjaio/valkyrja/Container/Manager/Contract/ContainerContract.ts';
import type { HttpRouteProviderContract } from '@valkyrjaio/valkyrja/Http/Routing/Provider/Contract/HttpRouteProviderContract.ts';
import type { ServiceProviderContract } from '@valkyrjaio/valkyrja/Container/Provider/Contract/ServiceProviderContract.ts';
import { HttpApplicationComponentProvider } from '@valkyrjaio/valkyrja/Application/Provider/HttpApplicationComponentProvider.ts';

export class ComponentProvider extends ValkyrjaComponentProvider {
    override getComponentProviders(_app: ApplicationContract): ComponentProviderContract[] {
        return [new HttpApplicationComponentProvider()];
    }

    override getContainerProviders(_app: ApplicationContract): ServiceProviderContract[] {
        return [new DataServiceProvider(), new ServiceProvider()];
    }

    override getHttpProviders(_app: ApplicationContract): HttpRouteProviderContract[] {
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
