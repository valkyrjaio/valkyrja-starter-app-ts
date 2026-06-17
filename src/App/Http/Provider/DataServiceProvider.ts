/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ContainerServiceId } from '@valkyrjaio/valkyrja/Container/Constant/ContainerServiceId.js';
import { EventServiceId } from '@valkyrjaio/valkyrja/Event/Constant/EventServiceId.js';
import { HttpRoutingServiceId } from '@valkyrjaio/valkyrja/Http/Routing/Constant/HttpRoutingServiceId.js';
import { AppContainerData } from '../Data/AppContainerData.js';
import { AppEventData } from '../Data/AppEventData.js';
import { AppHttpRoutingData } from '../Data/AppHttpRoutingData.js';

import type { ContainerContract } from '@valkyrjaio/valkyrja/Container/Manager/Contract/ContainerContract.js';
import type { ServiceProviderContract } from '@valkyrjaio/valkyrja/Container/Provider/Contract/ServiceProviderContract.js';

export class DataServiceProvider implements ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [ContainerServiceId.Data]: DataServiceProvider.publishContainerData,
            [EventServiceId.EventData]: DataServiceProvider.publishEventData,
            [HttpRoutingServiceId.HttpRoutingData]: DataServiceProvider.publishHttpRoutingData,
        };
    }

    static publishContainerData(this: void, container: ContainerContract): void {
        container.setSingleton(ContainerServiceId.Data, new AppContainerData());
    }

    static publishEventData(this: void, container: ContainerContract): void {
        container.setSingleton(EventServiceId.EventData, new AppEventData());
    }

    static publishHttpRoutingData(this: void, container: ContainerContract): void {
        container.setSingleton(HttpRoutingServiceId.HttpRoutingData, new AppHttpRoutingData());
    }
}
