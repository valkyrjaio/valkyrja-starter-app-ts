/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
