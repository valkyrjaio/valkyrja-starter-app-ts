/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { CliRoutingServiceId } from '@valkyrja/valkyrja/Cli/Routing/Constant/CliRoutingServiceId.js';
import { ContainerServiceId } from '@valkyrja/valkyrja/Container/Constant/ContainerServiceId.js';
import { EventServiceId } from '@valkyrja/valkyrja/Event/Constant/EventServiceId.js';
import { HttpRoutingServiceId } from '@valkyrja/valkyrja/Http/Routing/Constant/HttpRoutingServiceId.js';
import { AppCliRoutingData } from '../Data/AppCliRoutingData.js';
import { AppContainerData } from '../Data/AppContainerData.js';
import { AppEventData } from '../Data/AppEventData.js';
import { AppHttpRoutingData } from '../Data/AppHttpRoutingData.js';

import type { ContainerContract } from '@valkyrja/valkyrja/Container/Manager/Contract/ContainerContract.js';
import type { ServiceProviderContract } from '@valkyrja/valkyrja/Container/Provider/Contract/ServiceProviderContract.js';

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
