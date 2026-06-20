/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ApplicationServiceId } from '@valkyrjaio/valkyrja/Application/Constant/ApplicationServiceId.ts';
import { DynamicRoute } from '@valkyrjaio/valkyrja/Http/Routing/Data/DynamicRoute.ts';
import { Parameter } from '@valkyrjaio/valkyrja/Http/Routing/Data/Parameter.ts';
import { Route } from '@valkyrjaio/valkyrja/Http/Routing/Data/Route.ts';
import { RequestMethod } from '@valkyrjaio/valkyrja/Http/Message/Enum/RequestMethod.ts';
import { ServiceProvider } from './ServiceProvider.ts';

import type { ApplicationContract } from '@valkyrjaio/valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { ContainerContract } from '@valkyrjaio/valkyrja/Container/Manager/Contract/ContainerContract.ts';
import type { DynamicRouteContract } from '@valkyrjaio/valkyrja/Http/Routing/Data/Contract/DynamicRouteContract.ts';
import type { ResponseContract } from '@valkyrjaio/valkyrja/Http/Message/Response/Contract/ResponseContract.ts';
import type { RouteContract } from '@valkyrjaio/valkyrja/Http/Routing/Data/Contract/RouteContract.ts';
import type { HttpRouteProviderContract } from '@valkyrjaio/valkyrja/Http/Routing/Provider/Contract/HttpRouteProviderContract.ts';
import { HomeController } from '../Controller/HomeController.ts';

export class HttpRouteProvider implements HttpRouteProviderContract {
    getRoutes(): Array<RouteContract | DynamicRouteContract> {
        return [
            new Route('/version', 'version', HttpRouteProvider.versionHandler, [
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PUT,
            ]),
            new Route('/text', 'text', HttpRouteProvider.textHandler, [RequestMethod.GET]),
            new Route('/', 'welcome', HttpRouteProvider.welcomeHandler),
            new Route('/cached', 'welcome.cached', HttpRouteProvider.welcomeCachedHandler),
            new DynamicRoute(
                '/{value}',
                'dynamicValue',
                '/([a-zA-Z]+)',
                [new Parameter('value', '[a-zA-Z]+')],
                HttpRouteProvider.dynamicHandler,
            ),
            new Route('/home', 'home', HttpRouteProvider.homeHandler, [RequestMethod.GET, RequestMethod.HEAD]),
            new Route('/json', 'json', HttpRouteProvider.jsonHandler),
        ];
    }

    static versionHandler(this: void, container: ContainerContract, _route: RouteContract): ResponseContract {
        return HomeController.version(
            container.getSingleton<ApplicationContract>(ApplicationServiceId.ApplicationContract),
        );
    }

    static textHandler(this: void, _container: ContainerContract, _route: RouteContract): ResponseContract {
        return HomeController.text();
    }

    static welcomeHandler(this: void, container: ContainerContract, _route: RouteContract): ResponseContract {
        return container.getSingleton<HomeController>(ServiceProvider.HomeControllerId).welcome();
    }

    static welcomeCachedHandler(this: void, container: ContainerContract, _route: RouteContract): ResponseContract {
        return container.getSingleton<HomeController>(ServiceProvider.HomeControllerId).welcomeCached();
    }

    static dynamicHandler(this: void, container: ContainerContract, route: RouteContract): ResponseContract {
        const param = (route as DynamicRouteContract).getParameters().find((p) => p.getName() === 'value');
        const value = (param?.getValue() as string | undefined) ?? '';

        return container.getSingleton<HomeController>(ServiceProvider.HomeControllerId).dynamic(value);
    }

    static homeHandler(this: void, container: ContainerContract, _route: RouteContract): ResponseContract {
        return container.getSingleton<HomeController>(ServiceProvider.HomeControllerId).home();
    }

    static jsonHandler(this: void, container: ContainerContract, _route: RouteContract): ResponseContract {
        return container.getSingleton<HomeController>(ServiceProvider.HomeControllerId).json();
    }
}
