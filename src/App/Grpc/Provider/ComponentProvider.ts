/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

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
import type { ListenerProviderContract } from '@valkyrjaio/valkyrja/Event/Provider/Contract/ListenerProviderContract.ts';
import type { CliRouteProviderContract } from '@valkyrjaio/valkyrja/Cli/Routing/Provider/Contract/CliRouteProviderContract.ts';
import type { HttpRouteProviderContract } from '@valkyrjaio/valkyrja/Http/Routing/Provider/Contract/HttpRouteProviderContract.ts';

export class ComponentProvider implements ComponentProviderContract {
    getComponentProviders(_app: ApplicationContract): ComponentProviderContract[] {
        return [new GrpcApplicationComponentProvider()];
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
        return [];
    }

    getGrpcProviders(_app: ApplicationContract): GrpcRouteProviderContract[] {
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
