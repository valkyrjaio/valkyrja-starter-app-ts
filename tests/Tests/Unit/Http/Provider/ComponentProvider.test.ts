/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ApplicationServiceId } from '@valkyrjaio/valkyrja/Application/Constant/ApplicationServiceId.ts';
import { HttpApplicationComponentProvider } from '@valkyrjaio/valkyrja/Application/Provider/HttpApplicationComponentProvider.ts';
import { ContainerServiceId } from '@valkyrjaio/valkyrja/Container/Constant/ContainerServiceId.ts';
import { Container } from '@valkyrjaio/valkyrja/Container/Manager/Container.ts';

import { ComponentProvider } from '../../../../../src/App/Http/Provider/ComponentProvider.ts';
import { DataServiceProvider } from '../../../../../src/App/Http/Provider/DataServiceProvider.ts';
import { HttpRouteProvider } from '../../../../../src/App/Http/Provider/HttpRouteProvider.ts';
import { ServiceProvider } from '../../../../../src/App/Http/Provider/ServiceProvider.ts';

import type { ApplicationContract } from '@valkyrjaio/valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

const stubApp = {} as ApplicationContract;

describe('ComponentProvider', () => {
    const provider = new ComponentProvider();

    it('returns the http application component provider', () => {
        const providers = provider.getComponentProviders(stubApp);

        expect(providers).toHaveLength(1);
        expect(providers[0]).toBeInstanceOf(HttpApplicationComponentProvider);
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

    it('returns the http route provider', () => {
        const providers = provider.getHttpProviders(stubApp);

        expect(providers).toHaveLength(1);
        expect(providers[0]).toBeInstanceOf(HttpRouteProvider);
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
