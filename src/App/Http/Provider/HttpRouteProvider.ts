/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ApplicationServiceId } from '@valkyrjaio/valkyrja/Application/Constant/ApplicationServiceId.ts';
import { AppHttpServiceId } from '../Constant/AppHttpServiceId.ts';
// A real value import, even though the controller imports this provider back for its
// `@RouteHandler` references. That cycle is safe now that handler references are
// thunks: the controller's decorators only build closures, so nothing dereferences
// this half-initialized module binding at class-definition time. Debug mode needs
// the actual class object from `getControllerClasses()`, which a type-only import
// (erased at run time) cannot provide.
import { HomeController } from '../Controller/HomeController.ts';

import type { ApplicationContract } from '@valkyrjaio/valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { ContainerContract } from '@valkyrjaio/valkyrja/Container/Manager/Contract/ContainerContract.ts';
import type { DynamicRouteContract } from '@valkyrjaio/valkyrja/Http/Routing/Data/Contract/DynamicRouteContract.ts';
import type { ResponseContract } from '@valkyrjaio/valkyrja/Http/Message/Response/Contract/ResponseContract.ts';
import type { RouteContract } from '@valkyrjaio/valkyrja/Http/Routing/Data/Contract/RouteContract.ts';
import type { HttpRouteProviderContract } from '@valkyrjaio/valkyrja/Http/Routing/Provider/Contract/HttpRouteProviderContract.ts';

export class HttpRouteProvider implements HttpRouteProviderContract {
    getControllerClasses(): Array<new (...args: unknown[]) => unknown> {
        // Sindri reads this list statically from the AST; the debug-mode runtime
        // collector reads the same list at run time, so the real class object has
        // to be here (it is a value import for exactly that reason).
        // @ts-expect-error -- the contract's `new (...args: unknown[]) => unknown` cannot express a controller's own constructor parameters
        return [HomeController];
    }

    getRoutes(): Array<RouteContract | DynamicRouteContract> {
        return [];
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
        return container.getSingleton<HomeController>(AppHttpServiceId.HomeController).welcome();
    }

    static welcomeCachedHandler(this: void, container: ContainerContract, _route: RouteContract): ResponseContract {
        return container.getSingleton<HomeController>(AppHttpServiceId.HomeController).welcomeCached();
    }

    static dynamicHandler(this: void, container: ContainerContract, route: RouteContract): ResponseContract {
        const param = (route as DynamicRouteContract).getParameters().find((p) => p.getName() === 'value');
        const value = (param?.getValue() as string | undefined) ?? '';

        return container.getSingleton<HomeController>(AppHttpServiceId.HomeController).dynamic(value);
    }

    static homeHandler(this: void, container: ContainerContract, _route: RouteContract): ResponseContract {
        return container.getSingleton<HomeController>(AppHttpServiceId.HomeController).home();
    }

    static jsonHandler(this: void, container: ContainerContract, _route: RouteContract): ResponseContract {
        return container.getSingleton<HomeController>(AppHttpServiceId.HomeController).json();
    }
}
