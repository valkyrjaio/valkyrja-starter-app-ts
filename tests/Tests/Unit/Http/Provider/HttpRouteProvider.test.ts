/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { ApplicationServiceId } from '@valkyrjaio/valkyrja/Application/Constant/ApplicationServiceId.ts';
import { Container } from '@valkyrjaio/valkyrja/Container/Manager/Container.ts';
import { DynamicRoute } from '@valkyrjaio/valkyrja/Http/Routing/Data/DynamicRoute.ts';
import { Parameter } from '@valkyrjaio/valkyrja/Http/Routing/Data/Parameter.ts';
import { ResponseFactory } from '@valkyrjaio/valkyrja/Http/Message/Response/Factory/ResponseFactory.ts';

import { HomeController } from '../../../../../src/App/Http/Controller/HomeController.ts';
import { HttpRouteProvider } from '../../../../../src/App/Http/Provider/HttpRouteProvider.ts';
import { ServiceProvider } from '../../../../../src/App/Http/Provider/ServiceProvider.ts';

import type { ApplicationContract } from '@valkyrjaio/valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { RouteContract } from '@valkyrjaio/valkyrja/Http/Routing/Data/Contract/RouteContract.ts';

function containerWithHome(): Container {
    const container = new Container();
    const app = { getVersion: () => '1.0.0' } as unknown as ApplicationContract;
    container.setSingleton(ApplicationServiceId.ApplicationContract, app);
    container.setSingleton(ServiceProvider.HomeControllerId, new HomeController({} as never, new ResponseFactory()));

    return container;
}

describe('HttpRouteProvider', () => {
    it('provides all of the home routes', () => {
        expect(new HttpRouteProvider().getRoutes()).toHaveLength(7);
    });

    it('runs each route handler', () => {
        const container = containerWithHome();
        const routes = new HttpRouteProvider().getRoutes();
        const route = routes[0] as RouteContract;

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
