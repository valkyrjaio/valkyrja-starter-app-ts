/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
        // The decorator generation path emits the framework Processor's anchored,
        // named-group regex derived from the `{value}` path and its `[a-zA-Z]+`
        // parameter, rather than the hand-written `/([a-zA-Z]+)` the imperative
        // provider previously supplied. It carries no PHP-style `/.../` delimiters,
        // so `Matcher`'s `new RegExp(...)` matches it.
        expect(data.regexes['GET']?.['^\\/(?<value>[a-zA-Z]+)$']).toBe('dynamicValue');
    });
});
