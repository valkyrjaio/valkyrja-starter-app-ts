/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ApplicationServiceId } from '@valkyrjaio/valkyrja/Application/Constant/ApplicationServiceId.ts';
import { GrpcApplicationComponentProvider } from '@valkyrjaio/valkyrja/Application/Provider/GrpcApplicationComponentProvider.ts';
import { ContainerServiceId } from '@valkyrjaio/valkyrja/Container/Constant/ContainerServiceId.ts';
import { Container } from '@valkyrjaio/valkyrja/Container/Manager/Container.ts';

import { ComponentProvider } from '../../../../../src/App/Grpc/Provider/ComponentProvider.ts';
import { DataServiceProvider } from '../../../../../src/App/Grpc/Provider/DataServiceProvider.ts';
import { GrpcRouteProvider } from '../../../../../src/App/Grpc/Provider/GrpcRouteProvider.ts';
import { ServiceProvider } from '../../../../../src/App/Grpc/Provider/ServiceProvider.ts';

import type { ApplicationContract } from '@valkyrjaio/valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

const stubApp = {} as ApplicationContract;

describe('ComponentProvider', () => {
    const provider = new ComponentProvider();

    it('returns the grpc application component provider', () => {
        const providers = provider.getComponentProviders(stubApp);

        expect(providers).toHaveLength(1);
        expect(providers[0]).toBeInstanceOf(GrpcApplicationComponentProvider);
    });

    it('returns the data and service container providers', () => {
        const providers = provider.getContainerProviders(stubApp);

        expect(providers).toHaveLength(2);
        expect(providers[0]).toBeInstanceOf(DataServiceProvider);
        expect(providers[1]).toBeInstanceOf(ServiceProvider);
    });

    it('returns no event providers', () => {
        expect(provider.getEventProviders(stubApp)).toHaveLength(0);
    });

    it('returns no cli providers', () => {
        expect(provider.getCliProviders(stubApp)).toHaveLength(0);
    });

    it('returns no http providers', () => {
        expect(provider.getHttpProviders(stubApp)).toHaveLength(0);
    });

    it('returns the grpc route provider', () => {
        const providers = provider.getGrpcProviders(stubApp);

        expect(providers).toHaveLength(1);
        expect(providers[0]).toBeInstanceOf(GrpcRouteProvider);
    });

    it('publishes container data directly in production mode', () => {
        const container = new Container();
        const app = { getContainer: () => container, getDebugMode: () => false } as unknown as ApplicationContract;

        ComponentProvider.publish(app);

        expect(container.isSingletonInstance(ContainerServiceId.Data)).toBe(true);
    });

    it('publishes the full container data in debug mode', () => {
        const container = new Container();
        const app = {
            getContainer: () => container,
            getDebugMode: () => true,
            getContainerProviders: () => [],
        } as unknown as ApplicationContract;
        container.setSingleton(ApplicationServiceId.ApplicationContract, app);

        ComponentProvider.publish(app);

        expect(container.isSingletonInstance(ContainerServiceId.Data)).toBe(true);
    });
});
