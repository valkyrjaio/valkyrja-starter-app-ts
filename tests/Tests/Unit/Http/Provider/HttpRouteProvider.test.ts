/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ApplicationServiceId } from '@valkyrjaio/valkyrja/Application/Constant/ApplicationServiceId.ts';
import { Container } from '@valkyrjaio/valkyrja/Container/Manager/Container.ts';
import { DynamicRoute } from '@valkyrjaio/valkyrja/Http/Routing/Data/DynamicRoute.ts';
import { Parameter } from '@valkyrjaio/valkyrja/Http/Routing/Data/Parameter.ts';
import { Route } from '@valkyrjaio/valkyrja/Http/Routing/Data/Route.ts';
import { HtmlResponse } from '@valkyrjaio/valkyrja/Http/Message/Response/HtmlResponse.ts';
import { ResponseFactory } from '@valkyrjaio/valkyrja/Http/Message/Response/Factory/ResponseFactory.ts';

import { AppHttpServiceId } from '../../../../../src/App/Http/Constant/AppHttpServiceId.ts';
import { HomeController } from '../../../../../src/App/Http/Controller/HomeController.ts';
import { HttpRouteProvider } from '../../../../../src/App/Http/Provider/HttpRouteProvider.ts';

import type { ApplicationContract } from '@valkyrjaio/valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { RouteContract } from '@valkyrjaio/valkyrja/Http/Routing/Data/Contract/RouteContract.ts';

function containerWithHome(): Container {
    const container = new Container();
    const app = { getVersion: () => '1.0.0' } as unknown as ApplicationContract;
    container.setSingleton(ApplicationServiceId.ApplicationContract, app);
    container.setSingleton(AppHttpServiceId.HomeController, new HomeController({} as never, new ResponseFactory()));

    return container;
}

describe('HttpRouteProvider', () => {
    // The seven home routes moved from `getRoutes()` onto `HomeController`'s `@Route`
    // decorators; Sindri reads them statically from the controller that
    // `getControllerClasses()` names, so the imperative list is now empty.
    it('registers no imperative routes, declaring them on the controller instead', () => {
        expect(new HttpRouteProvider().getRoutes()).toStrictEqual([]);
    });

    // Debug mode rediscovers routes at run time from this list, so it must hand
    // back the real class object, not a type-only reference erased at run time.
    it('names the controller its routes are declared on', () => {
        expect(new HttpRouteProvider().getControllerClasses()).toStrictEqual([HomeController]);
    });

    it('runs each route handler', () => {
        const container = containerWithHome();
        const route = new Route('/', 'welcome', () => new HtmlResponse('')) as RouteContract;

        expect(HttpRouteProvider.versionHandler(container, route)).toBeDefined();
        expect(HttpRouteProvider.textHandler(container, route)).toBeDefined();
        expect(HttpRouteProvider.welcomeHandler(container, route)).toBeDefined();
        expect(HttpRouteProvider.welcomeCachedHandler(container, route)).toBeDefined();
        expect(HttpRouteProvider.homeHandler(container, route)).toBeDefined();
        expect(HttpRouteProvider.jsonHandler(container, route)).toBeDefined();
    });

    it('binds the dynamic parameter value, falling back to an empty string', () => {
        const container = containerWithHome();

        // Parameter with a value.
        const withValue = new DynamicRoute('/{value}', 'd', '/(.+)', [
            new Parameter('value', '.+', null, false, true, null, 'abc'),
        ]);
        expect(HttpRouteProvider.dynamicHandler(container, withValue).getBody().getContents()).toBe('<h1>abc</h1>');

        // Parameter present but with no value.
        const noValue = new DynamicRoute('/{value}', 'd', '/(.+)', [new Parameter('value', '.+')]);
        expect(HttpRouteProvider.dynamicHandler(container, noValue).getBody().getContents()).toBe('<h1></h1>');

        // No matching parameter at all.
        const noParam = new DynamicRoute('/{x}', 'd', '/(.+)', [new Parameter('x', '.+')]);
        expect(HttpRouteProvider.dynamicHandler(container, noParam).getBody().getContents()).toBe('<h1></h1>');
    });
});
