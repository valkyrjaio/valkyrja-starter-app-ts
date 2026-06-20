/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ContainerServiceId } from '@valkyrjaio/valkyrja/Container/Constant/ContainerServiceId.ts';
import { Container } from '@valkyrjaio/valkyrja/Container/Manager/Container.ts';

import { Config } from '../../../../src/App/Cli/Config.ts';
import { ComponentProvider } from '../../../../src/App/Cli/Provider/ComponentProvider.ts';
import { CliConfig } from '@valkyrjaio/valkyrja/Application/Data/CliConfig.ts';

import type { ApplicationContract } from '@valkyrjaio/valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

describe('Config', () => {
    it('is a CliConfig', () => {
        expect(new Config()).toBeInstanceOf(CliConfig);
    });

    it('exposes the configured values', () => {
        const config = new Config();

        expect(config.namespace).toBe('App');
        expect(config.version).toBe('1.0.0');
        expect(config.environment).toBe('production');
        expect(config.debugMode).toBe(true);
        expect(config.timezone).toBe('UTC');
        expect(config.dataPath).toBe('src/App/Cli/Data');
        expect(config.dataNamespace).toBe('App/Cli/Data');
    });

    it('registers the component provider', () => {
        expect(new Config().providers[0]).toBeInstanceOf(ComponentProvider);
    });

    it('registers a publish callback that publishes the container data', () => {
        const container = new Container();
        const app = { getContainer: () => container, getDebugMode: () => false } as unknown as ApplicationContract;

        for (const callback of new Config().callbacks) {
            callback(app);
        }

        expect(container.isSingletonInstance(ContainerServiceId.Data)).toBe(true);
    });
});
