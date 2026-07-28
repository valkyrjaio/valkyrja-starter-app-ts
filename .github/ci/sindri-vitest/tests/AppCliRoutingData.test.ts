/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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

        expect(Object.keys(data.routes)).toStrictEqual([
            'help',
            'list',
            'list:bash',
            'version',
            'http:list',
            'test',
        ]);
    });

    it.each([['help'], ['list'], ['list:bash'], ['version'], ['http:list'], ['test']])(
        'names the %s route after its key',
        (name) => {
            expect(new AppCliRoutingData().routes[name]!().getName()).toBe(name);
        },
    );

    it('generates only the HTTP routing command for the HTTP application', () => {
        const data = new HttpAppCliRoutingData();

        expect(Object.keys(data.routes)).toStrictEqual(['http:list']);
        expect(data.routes['http:list']!().getName()).toBe('http:list');
    });
});
