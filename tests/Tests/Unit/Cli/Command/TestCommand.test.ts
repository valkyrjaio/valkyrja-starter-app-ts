/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';

import { CliConfig } from '@valkyrjaio/valkyrja/Application/Data/CliConfig.ts';
import { Answer } from '@valkyrjaio/valkyrja/Cli/Interaction/Message/Answer.ts';
import { CliInteractionConfig } from '@valkyrjaio/valkyrja/Cli/Interaction/Data/CliInteractionConfig.ts';
import { OutputFactory } from '@valkyrjaio/valkyrja/Cli/Interaction/Output/Factory/OutputFactory.ts';
import { Route } from '@valkyrjaio/valkyrja/Cli/Routing/Data/Route.ts';

import { readCliRouteMetadata } from '@valkyrjaio/valkyrja/Cli/Routing/Attribute/RouteAttributeMetadata.ts';

import { TestCommand } from '../../../../../src/App/Cli/Command/TestCommand.ts';
import { CliRouteProvider } from '../../../../../src/App/Cli/Provider/CliRouteProvider.ts';

import type { OutputContract } from '@valkyrjaio/valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';

const stdoutSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

function command(): TestCommand {
    return new TestCommand({} as never, new OutputFactory(new CliInteractionConfig()));
}

afterEach(() => {
    stdoutSpy.mockClear();
});

describe('TestCommand', () => {
    it('exposes help text', () => {
        expect(TestCommand.help().getText()).toContain('command');
    });

    it('renders a header and a question when run', () => {
        const route = new Route('test', 'Test command', (): OutputContract => new OutputFactory().createOutput());

        const output = command().run(route, new CliConfig());

        expect(output.getMessages().length).toBeGreaterThan(0);
    });

    it('confirms a yes answer', () => {
        const output = new OutputFactory(new CliInteractionConfig()).createOutput();
        const answer = new Answer('no').withUserResponse('yes');

        const result = command().answered(output, answer);

        expect(result.getMessages().length).toBeGreaterThan(0);
    });

    // The handler and help-text references are thunks because a TC39 Stage-3 method
    // decorator runs while the class binding is still in its temporal dead zone. That
    // is what makes `helpText: [() => TestCommand, 'help']` — a self-reference PHP
    // spells `self::class` — legal at all.
    it('resolves the handler thunk to the provider and the help-text thunk to itself', () => {
        const metadata = readCliRouteMetadata(TestCommand as unknown as new (...args: unknown[]) => unknown);
        const run = metadata?.methods.get('run');

        expect(run?.handler?.[0]()).toBe(CliRouteProvider);
        expect(run?.handler?.[1]).toBe('testCommandHandler');
        expect(run?.routes[0]?.helpText?.[0]()).toBe(TestCommand);
        expect(run?.routes[0]?.helpText?.[1]).toBe('help');
    });

    it('adds a new line for a non-yes answer', () => {
        const output = new OutputFactory(new CliInteractionConfig()).createOutput();
        const answer = new Answer('no').withUserResponse('no');

        const result = command().answered(output, answer);

        expect(result.getMessages().length).toBeGreaterThan(0);
    });
});
