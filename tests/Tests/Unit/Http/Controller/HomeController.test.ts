/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { HtmlResponse } from '@valkyrjaio/valkyrja/Http/Message/Response/HtmlResponse.ts';
import { JsonResponse } from '@valkyrjaio/valkyrja/Http/Message/Response/JsonResponse.ts';
import { TextResponse } from '@valkyrjaio/valkyrja/Http/Message/Response/TextResponse.ts';
import { ResponseFactory } from '@valkyrjaio/valkyrja/Http/Message/Response/Factory/ResponseFactory.ts';

import { readHttpRouteMetadata } from '@valkyrjaio/valkyrja/Http/Routing/Attribute/RouteAttributeMetadata.ts';

import { HomeController } from '../../../../../src/App/Http/Controller/HomeController.ts';
import { HttpRouteProvider } from '../../../../../src/App/Http/Provider/HttpRouteProvider.ts';

import type { ApplicationContract } from '@valkyrjaio/valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

function controller(): HomeController {
    return new HomeController({} as never, new ResponseFactory());
}

describe('HomeController', () => {
    it('renders the application version as text', () => {
        const app = { getVersion: () => '1.0.0' } as unknown as ApplicationContract;

        const response = HomeController.version(app);

        expect(response).toBeInstanceOf(TextResponse);
        expect(response.getBody().getContents()).toBe('1.0.0');
    });

    it('renders static text', () => {
        expect(HomeController.text()).toBeInstanceOf(TextResponse);
    });

    it('renders the welcome, cached welcome and home html', () => {
        expect(controller().welcome()).toBeInstanceOf(HtmlResponse);
        expect(controller().welcomeCached()).toBeInstanceOf(HtmlResponse);
        expect(controller().home()).toBeInstanceOf(HtmlResponse);
    });

    it('renders a dynamic value into html', () => {
        expect(controller().dynamic('abc').getBody().getContents()).toBe('<h1>abc</h1>');
    });

    it('renders a json response', () => {
        expect(controller().json()).toBeInstanceOf(JsonResponse);
    });

    // Every `@RouteHandler` names its provider through a thunk —
    // `[() => HttpRouteProvider, 'versionHandler']` — because a TC39 Stage-3 method
    // decorator runs while the class binding is still in its temporal dead zone, so
    // a bare class reference would throw on the controller ↔ provider import cycle.
    // This pins that each thunk really does resolve to the provider, and that the
    // method name it is paired with exists there.
    it('resolves every route handler thunk to the provider holding the named handler', () => {
        const metadata = readHttpRouteMetadata(HomeController as unknown as new (...args: unknown[]) => unknown);
        const provider = HttpRouteProvider as unknown as Record<string, unknown>;

        expect(metadata?.methods.size).toBe(7);

        for (const method of metadata?.methods.values() ?? []) {
            const reference = method.handler;

            expect(reference?.[0]()).toBe(HttpRouteProvider);
            expect(typeof provider[reference?.[1] ?? '']).toBe('function');
        }
    });
});
