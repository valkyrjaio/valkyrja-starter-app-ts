/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { AppHttpRoutingData } from '../../../../src/App/Http/Data/AppHttpRoutingData.ts';
import { HttpRoutingData } from '@valkyrjaio/valkyrja/Http/Routing/Data/HttpRoutingData.ts';

// Unlike the stub-based vitest suite (which seeds the empty `*.example.ts`
// templates), this asserts the REAL Sindri-generated data — the HTTP routing
// data cache must contain every route the application's HttpRouteProvider
// registers, with the request-method, dynamic-path and regex lookup maps built.
describe('generated AppHttpRoutingData', () => {
    const data = new AppHttpRoutingData();

    it('is a HttpRoutingData', () => {
        expect(data).toBeInstanceOf(HttpRoutingData);
    });

    it('generates every route defined by the HttpRouteProvider', () => {
        expect(Object.keys(data.routes).sort()).toStrictEqual([
            'dynamicValue',
            'home',
            'json',
            'text',
            'version',
            'welcome',
            'welcome.cached',
        ]);
    });

    it('builds the welcome route from its concrete Route object', () => {
        const route = data.routes['welcome']!();

        expect(route.getName()).toBe('welcome');
        expect(route.getPath()).toBe('/');
    });

    it('maps every request method used by the routes to its paths', () => {
        expect(Object.keys(data.paths).sort()).toStrictEqual(['GET', 'HEAD', 'POST', 'PUT']);
        expect(data.paths['GET']?.['/version']).toBe('version');
        expect(data.paths['POST']?.['/version']).toBe('version');
        expect(data.paths['PUT']?.['/version']).toBe('version');
        expect(data.paths['GET']?.['/']).toBe('welcome');
    });

    it('builds the dynamic route paths and regexes', () => {
        expect(data.dynamicPaths['GET']?.['/{value}']).toBe('dynamicValue');
        expect(data.regexes['GET']?.['/([a-zA-Z]+)']).toBe('dynamicValue');
    });
});
