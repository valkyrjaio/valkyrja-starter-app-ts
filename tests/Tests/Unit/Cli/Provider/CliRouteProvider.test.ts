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

import { AppCliServiceId } from '../../../../../src/App/Cli/Constant/AppCliServiceId.ts';
import { CliRouteProvider } from '../../../../../src/App/Cli/Provider/CliRouteProvider.ts';
import { TestCommand } from '../../../../../src/App/Cli/Command/TestCommand.ts';

import type { OutputContract } from '@valkyrjaio/valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';

const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

afterEach(() => {
    stdoutSpy.mockClear();
});

describe('CliRouteProvider', () => {
    // The `test` command moved from `getRoutes()` onto `TestCommand`'s `@Route`
    // decorator; Sindri reads it statically from the command that
    // `getControllerClasses()` names, so the imperative list is now empty.
    it('registers no imperative routes, declaring the command on the controller instead', () => {
        expect(new CliRouteProvider().getRoutes()).toStrictEqual([]);
    });

    // Debug mode rediscovers commands at run time from this list, so it must hand
    // back the real class object. That is only possible because the command's
    // decorator references are thunks: the value import below closes a command ↔
    // provider cycle that a bare class reference would blow up on.
    it('names the TestCommand class for the debug-mode collector', () => {
        expect(new CliRouteProvider().getControllerClasses()).toStrictEqual([TestCommand]);
    });

    it('runs the test command through its handler', () => {
        const container = new Container();
        container.setSingleton(ApplicationServiceId.CliConfigContract, new CliConfig());
        container.setSingleton(
            AppCliServiceId.TestCommand,
            new TestCommand({} as never, new OutputFactory(new CliInteractionConfig())),
        );
        const route = new Route('test', 'Test command', (): OutputContract => new OutputFactory().createOutput());

        const output = CliRouteProvider.testCommandHandler(container, route);

        expect(output.getMessages().length).toBeGreaterThan(0);
    });
});
