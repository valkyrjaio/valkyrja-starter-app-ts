/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CliRoutingServiceId } from '@valkyrjaio/valkyrja/Cli/Routing/Constant/CliRoutingServiceId.ts';
import { ContainerServiceId } from '@valkyrjaio/valkyrja/Container/Constant/ContainerServiceId.ts';
import { EventServiceId } from '@valkyrjaio/valkyrja/Event/Constant/EventServiceId.ts';
import { HttpRoutingServiceId } from '@valkyrjaio/valkyrja/Http/Routing/Constant/HttpRoutingServiceId.ts';
import { AppCliRoutingData } from '../Data/AppCliRoutingData.ts';
import { AppContainerData } from '../Data/AppContainerData.ts';
import { AppEventData } from '../Data/AppEventData.ts';
import { AppHttpRoutingData } from '../Data/AppHttpRoutingData.ts';

import type { ContainerContract } from '@valkyrjaio/valkyrja/Container/Manager/Contract/ContainerContract.ts';
import type { ServiceProviderContract } from '@valkyrjaio/valkyrja/Container/Provider/Contract/ServiceProviderContract.ts';

export class DataServiceProvider implements ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [ContainerServiceId.Data]: DataServiceProvider.publishContainerData,
            [EventServiceId.EventData]: DataServiceProvider.publishEventData,
            [CliRoutingServiceId.CliRoutingData]: DataServiceProvider.publishCliRoutingData,
            [HttpRoutingServiceId.HttpRoutingData]: DataServiceProvider.publishHttpRoutingData,
        };
    }

    static publishContainerData(this: void, container: ContainerContract): void {
        container.setSingleton(ContainerServiceId.Data, new AppContainerData());
    }

    static publishEventData(this: void, container: ContainerContract): void {
        container.setSingleton(EventServiceId.EventData, new AppEventData());
    }

    static publishCliRoutingData(this: void, container: ContainerContract): void {
        container.setSingleton(CliRoutingServiceId.CliRoutingData, new AppCliRoutingData());
    }

    static publishHttpRoutingData(this: void, container: ContainerContract): void {
        container.setSingleton(HttpRoutingServiceId.HttpRoutingData, new AppHttpRoutingData());
    }
}
