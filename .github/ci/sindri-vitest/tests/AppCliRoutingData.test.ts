/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { AppCliRoutingData } from '../../../../src/App/Cli/Data/AppCliRoutingData.ts';
import { AppCliRoutingData as HttpAppCliRoutingData } from '../../../../src/App/Http/Data/AppCliRoutingData.ts';
import { CliRoutingData } from '@valkyrjaio/valkyrja/Cli/Routing/Data/CliRoutingData.ts';

// Asserts the REAL Sindri-generated CLI routing data: the CLI application's
// component-provider tree reaches the framework's own CLI route providers as
// well as the app's, so the cache holds the framework built-ins alongside the
// app's `test` command. The HTTP application declares no CLI providers of its
// own, but its tree still reaches the HTTP routing component's `http:list`.
describe('generated AppCliRoutingData', () => {
    it('is a CliRoutingData', () => {
        expect(new AppCliRoutingData()).toBeInstanceOf(CliRoutingData);
    });

    it('generates the framework built-in commands alongside the app test command', () => {
        const data = new AppCliRoutingData();

        // Decorator-scanned command routes are emitted first, then the imperative
        // `getRoutes()` commands the framework's own route providers declare.
        expect(Object.keys(data.routes)).toStrictEqual(['test', 'help', 'list', 'list:bash', 'version', 'http:list']);
    });

    it.each([['test'], ['help'], ['list'], ['list:bash'], ['version'], ['http:list']])(
        'names the %s route after its key',
        (name) => {
            expect(new AppCliRoutingData().routes[name]!().getName()).toBe(name);
        },
    );

    // `helpText: [() => TestCommand, 'help']` is a self-reference, which only works
    // because the handler reference is a thunk: naming `TestCommand` directly in its
    // own decorator would hit the class binding's temporal dead zone. Sindri looks
    // through the thunk and emits the plain `TestCommand.help` reference.
    it('generates the self-referential help text for the test command', () => {
        const route = new AppCliRoutingData().routes['test']!();

        expect(route.hasHelpText()).toBe(true);
        expect(route.getHelpTextMessage().getText()).toBe('A command to showcase possibilities for commands.');
    });

    it('generates only the HTTP routing command for the HTTP application', () => {
        const data = new HttpAppCliRoutingData();

        expect(Object.keys(data.routes)).toStrictEqual(['http:list']);
        expect(data.routes['http:list']!().getName()).toBe('http:list');
    });
});
