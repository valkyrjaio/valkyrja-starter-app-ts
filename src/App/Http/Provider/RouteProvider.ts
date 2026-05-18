import { ApplicationServiceId } from '@valkyrja/valkyrja/Application/Constant/ApplicationServiceId.js';
import { DynamicRoute } from '@valkyrja/valkyrja/Http/Routing/Data/DynamicRoute.js';
import { Parameter } from '@valkyrja/valkyrja/Http/Routing/Data/Parameter.js';
import { Route } from '@valkyrja/valkyrja/Http/Routing/Data/Route.js';
import { RequestMethod } from '@valkyrja/valkyrja/Http/Message/Enum/RequestMethod.js';
import { ServiceProvider } from './ServiceProvider.js';

import type { ApplicationContract } from '@valkyrja/valkyrja/Application/Kernel/Contract/ApplicationContract.js';
import type { ContainerContract } from '@valkyrja/valkyrja/Container/Manager/Contract/ContainerContract.js';
import type { DynamicRouteContract } from '@valkyrja/valkyrja/Http/Routing/Data/Contract/DynamicRouteContract.js';
import type { ResponseContract } from '@valkyrja/valkyrja/Http/Message/Response/Contract/ResponseContract.js';
import type { RouteContract } from '@valkyrja/valkyrja/Http/Routing/Data/Contract/RouteContract.js';
import type { HttpRouteProviderContract } from '@valkyrja/valkyrja/Http/Routing/Provider/Contract/HttpRouteProviderContract.js';
import { HomeController } from '../Controller/HomeController.js';

export class RouteProvider implements HttpRouteProviderContract {
    getRoutes(): Array<RouteContract | DynamicRouteContract> {
        return [
            new Route('/version', 'version', RouteProvider.versionHandler, [
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PUT,
            ]),
            new Route('/text', 'text', RouteProvider.textHandler, [RequestMethod.GET]),
            new Route('/', 'welcome', RouteProvider.welcomeHandler),
            new Route('/cached', 'welcome.cached', RouteProvider.welcomeCachedHandler),
            new DynamicRoute(
                '/{value}',
                'dynamicValue',
                '/([a-zA-Z]+)',
                [new Parameter('value', '[a-zA-Z]+')],
                RouteProvider.dynamicHandler,
            ),
            new Route('/home', 'home', RouteProvider.homeHandler, [RequestMethod.GET, RequestMethod.HEAD]),
            new Route('/json', 'json', RouteProvider.jsonHandler),
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
