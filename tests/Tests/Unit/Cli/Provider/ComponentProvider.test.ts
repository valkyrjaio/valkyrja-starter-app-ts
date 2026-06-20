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
import { CliWithHttpApplicationComponentProvider } from '@valkyrjaio/valkyrja/Application/Provider/CliWithHttpApplicationComponentProvider.ts';
import { ContainerServiceId } from '@valkyrjaio/valkyrja/Container/Constant/ContainerServiceId.ts';
import { Container } from '@valkyrjaio/valkyrja/Container/Manager/Container.ts';

import { CliRouteProvider } from '../../../../../src/App/Cli/Provider/CliRouteProvider.ts';
import { ComponentProvider } from '../../../../../src/App/Cli/Provider/ComponentProvider.ts';
import { DataServiceProvider } from '../../../../../src/App/Cli/Provider/DataServiceProvider.ts';
import { ServiceProvider } from '../../../../../src/App/Cli/Provider/ServiceProvider.ts';

import type { ApplicationContract } from '@valkyrjaio/valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

const stubApp = {} as ApplicationContract;

describe('ComponentProvider', () => {
    const provider = new ComponentProvider();

    it('returns the cli-with-http application component provider', () => {
        const providers = provider.getComponentProviders(stubApp);

        expect(providers).toHaveLength(1);
        expect(providers[0]).toBeInstanceOf(CliWithHttpApplicationComponentProvider);
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

    it('returns the cli route provider', () => {
        const providers = provider.getCliProviders(stubApp);

        expect(providers).toHaveLength(1);
        expect(providers[0]).toBeInstanceOf(CliRouteProvider);
    });

    it('returns no http providers', () => {
        expect(provider.getHttpProviders(stubApp)).toHaveLength(0);
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
