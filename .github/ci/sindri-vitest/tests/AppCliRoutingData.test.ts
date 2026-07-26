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
// CliRouteProvider registers a single `test` command, while the HTTP
// application exposes no CLI routes at all.
describe('generated AppCliRoutingData', () => {
    it('is a CliRoutingData', () => {
        expect(new AppCliRoutingData()).toBeInstanceOf(CliRoutingData);
    });

    it('generates the test command from the CliRouteProvider', () => {
        const data = new AppCliRoutingData();

        expect(Object.keys(data.routes)).toStrictEqual(['test']);
        expect(data.routes['test']!().getName()).toBe('test');
    });

    it('generates no CLI routes for the HTTP application', () => {
        expect(Object.keys(new HttpAppCliRoutingData().routes)).toStrictEqual([]);
    });
});
