/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ContainerServiceId } from '@valkyrjaio/valkyrja/Container/Constant/ContainerServiceId.ts';
import { Container } from '@valkyrjaio/valkyrja/Container/Manager/Container.ts';
import { EventServiceId } from '@valkyrjaio/valkyrja/Event/Constant/EventServiceId.ts';
import { GrpcRoutingServiceId } from '@valkyrjaio/valkyrja/Grpc/Routing/Constant/GrpcRoutingServiceId.ts';

import { AppContainerData } from '../../../../../src/App/Grpc/Data/AppContainerData.ts';
import { AppEventData } from '../../../../../src/App/Grpc/Data/AppEventData.ts';
import { AppGrpcRoutingData } from '../../../../../src/App/Grpc/Data/AppGrpcRoutingData.ts';
import { DataServiceProvider } from '../../../../../src/App/Grpc/Provider/DataServiceProvider.ts';

describe('DataServiceProvider', () => {
    it('publishes the three data singletons under their service ids', () => {
        expect(Object.keys(new DataServiceProvider().publishers())).toHaveLength(3);
    });

    it('publishes the container, event and grpc routing data', () => {
        const container = new Container();

        DataServiceProvider.publishContainerData(container);
        DataServiceProvider.publishEventData(container);
        DataServiceProvider.publishGrpcRoutingData(container);

        expect(container.getSingleton(ContainerServiceId.Data)).toBeInstanceOf(AppContainerData);
        expect(container.getSingleton(EventServiceId.EventData)).toBeInstanceOf(AppEventData);
        expect(container.getSingleton(GrpcRoutingServiceId.GrpcRoutingData)).toBeInstanceOf(AppGrpcRoutingData);
    });
});
