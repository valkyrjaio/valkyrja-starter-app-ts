/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ContainerServiceId } from '@valkyrjaio/valkyrja/Container/Constant/ContainerServiceId.ts';
import { EventServiceId } from '@valkyrjaio/valkyrja/Event/Constant/EventServiceId.ts';
import { GrpcRoutingServiceId } from '@valkyrjaio/valkyrja/Grpc/Routing/Constant/GrpcRoutingServiceId.ts';
import { AppContainerData } from '../Data/AppContainerData.ts';
import { AppEventData } from '../Data/AppEventData.ts';
import { AppGrpcRoutingData } from '../Data/AppGrpcRoutingData.ts';

import type { ContainerContract } from '@valkyrjaio/valkyrja/Container/Manager/Contract/ContainerContract.ts';
import type { ServiceProviderContract } from '@valkyrjaio/valkyrja/Container/Provider/Contract/ServiceProviderContract.ts';

export class DataServiceProvider implements ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [ContainerServiceId.Data]: DataServiceProvider.publishContainerData,
            [EventServiceId.EventData]: DataServiceProvider.publishEventData,
            [GrpcRoutingServiceId.GrpcRoutingData]: DataServiceProvider.publishGrpcRoutingData,
        };
    }

    static publishContainerData(this: void, container: ContainerContract): void {
        container.setSingleton(ContainerServiceId.Data, new AppContainerData());
    }

    static publishEventData(this: void, container: ContainerContract): void {
        container.setSingleton(EventServiceId.EventData, new AppEventData());
    }

    static publishGrpcRoutingData(this: void, container: ContainerContract): void {
        container.setSingleton(GrpcRoutingServiceId.GrpcRoutingData, new AppGrpcRoutingData());
    }
}
