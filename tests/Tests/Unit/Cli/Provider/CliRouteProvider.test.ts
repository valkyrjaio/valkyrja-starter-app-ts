/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';

import { ApplicationServiceId } from '@valkyrjaio/valkyrja/Application/Constant/ApplicationServiceId.ts';
import { CliConfig } from '@valkyrjaio/valkyrja/Application/Data/CliConfig.ts';
import { CliInteractionConfig } from '@valkyrjaio/valkyrja/Cli/Interaction/Data/CliInteractionConfig.ts';
import { OutputFactory } from '@valkyrjaio/valkyrja/Cli/Interaction/Output/Factory/OutputFactory.ts';
import { Container } from '@valkyrjaio/valkyrja/Container/Manager/Container.ts';
import { Route } from '@valkyrjaio/valkyrja/Cli/Routing/Data/Route.ts';

import { CliRouteProvider } from '../../../../../src/App/Cli/Provider/CliRouteProvider.ts';
import { ServiceProvider } from '../../../../../src/App/Cli/Provider/ServiceProvider.ts';
import { TestCommand } from '../../../../../src/App/Cli/Command/TestCommand.ts';

import type { OutputContract } from '@valkyrjaio/valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';

const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

afterEach(() => {
    stdoutSpy.mockClear();
});

describe('CliRouteProvider', () => {
    it('provides the test route', () => {
        const routes = new CliRouteProvider().getRoutes();

        expect(routes).toHaveLength(1);
        expect(routes[0]?.getName()).toBe('test');
    });

    it('runs the test command through its handler', () => {
        const container = new Container();
        container.setSingleton(ApplicationServiceId.CliConfigContract, new CliConfig());
        container.setSingleton(
            ServiceProvider.TestCommandId,
            new TestCommand({} as never, new OutputFactory(new CliInteractionConfig())),
        );
        const route = new Route('test', 'Test command', (): OutputContract => new OutputFactory().createOutput());

        const output = CliRouteProvider.testCommandHandler(container, route);

        expect(output.getMessages().length).toBeGreaterThan(0);
    });
});
