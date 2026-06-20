/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { CliRoutingServiceId } from '@valkyrjaio/valkyrja/Cli/Routing/Constant/CliRoutingServiceId.ts';
import { ContainerServiceId } from '@valkyrjaio/valkyrja/Container/Constant/ContainerServiceId.ts';
import { Container } from '@valkyrjaio/valkyrja/Container/Manager/Container.ts';
import { EventServiceId } from '@valkyrjaio/valkyrja/Event/Constant/EventServiceId.ts';
import { HttpRoutingServiceId } from '@valkyrjaio/valkyrja/Http/Routing/Constant/HttpRoutingServiceId.ts';

import { AppCliRoutingData } from '../../../../../src/App/Cli/Data/AppCliRoutingData.ts';
import { AppContainerData } from '../../../../../src/App/Cli/Data/AppContainerData.ts';
import { AppEventData } from '../../../../../src/App/Cli/Data/AppEventData.ts';
import { AppHttpRoutingData } from '../../../../../src/App/Cli/Data/AppHttpRoutingData.ts';
import { DataServiceProvider } from '../../../../../src/App/Cli/Provider/DataServiceProvider.ts';

describe('DataServiceProvider', () => {
    it('publishes the four data singletons under their service ids', () => {
        expect(Object.keys(new DataServiceProvider().publishers())).toHaveLength(4);
    });

    it('publishes the container, event, cli and http routing data', () => {
        const container = new Container();

        DataServiceProvider.publishContainerData(container);
        DataServiceProvider.publishEventData(container);
        DataServiceProvider.publishCliRoutingData(container);
        DataServiceProvider.publishHttpRoutingData(container);

        expect(container.getSingleton(ContainerServiceId.Data)).toBeInstanceOf(AppContainerData);
        expect(container.getSingleton(EventServiceId.EventData)).toBeInstanceOf(AppEventData);
        expect(container.getSingleton(CliRoutingServiceId.CliRoutingData)).toBeInstanceOf(AppCliRoutingData);
        expect(container.getSingleton(HttpRoutingServiceId.HttpRoutingData)).toBeInstanceOf(AppHttpRoutingData);
    });
});
