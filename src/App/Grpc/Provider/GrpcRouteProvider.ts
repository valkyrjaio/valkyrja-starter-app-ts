/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { GrpcMessageServiceId } from '@valkyrjaio/valkyrja/Grpc/Message/Constant/GrpcMessageServiceId.ts';
import { ServiceProvider } from './ServiceProvider.ts';

import type { ContainerContract } from '@valkyrjaio/valkyrja/Container/Manager/Contract/ContainerContract.ts';
import type { ServiceCallContract } from '@valkyrjaio/valkyrja/Grpc/Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '@valkyrjaio/valkyrja/Grpc/Message/Response/Contract/ServiceResponseContract.ts';
import type { RouteContract } from '@valkyrjaio/valkyrja/Grpc/Routing/Data/Contract/RouteContract.ts';
import type { GrpcRouteProviderContract } from '@valkyrjaio/valkyrja/Grpc/Routing/Provider/Contract/GrpcRouteProviderContract.ts';
// A real value import, even though the controller imports this provider back for its
// `@Method` handler references. That cycle is safe now that handler references are
// thunks: the controller's decorators only build closures, so nothing dereferences
// this half-initialized module binding at class-definition time. Debug mode needs
// the actual class object from `getControllerClasses()`, which a type-only import
// (erased at run time) cannot provide.
import { PingController } from '../Controller/PingController.ts';

export class GrpcRouteProvider implements GrpcRouteProviderContract {
    getControllerClasses(): Array<new (...args: unknown[]) => unknown> {
        // Sindri reads this list statically from the AST; the debug-mode runtime
        // collector reads the same list at run time, so the real class object has
        // to be here (it is a value import for exactly that reason).
        return [PingController];
    }

    getRoutes(): RouteContract[] {
        return [];
    }

    static pingHandler(this: void, container: ContainerContract): Promise<ServiceResponseContract> {
        return Promise.resolve(GrpcRouteProvider.controller(container).ping(GrpcRouteProvider.call(container)));
    }

    static fanoutHandler(this: void, container: ContainerContract): Promise<ServiceResponseContract> {
        return Promise.resolve(GrpcRouteProvider.controller(container).fanout(GrpcRouteProvider.call(container)));
    }

    static collectHandler(this: void, container: ContainerContract): Promise<ServiceResponseContract> {
        return Promise.resolve(GrpcRouteProvider.controller(container).collect(GrpcRouteProvider.call(container)));
    }

    static missingHandler(this: void, container: ContainerContract): Promise<ServiceResponseContract> {
        return Promise.resolve(GrpcRouteProvider.controller(container).missing());
    }

    /** The call is resolved from the container, never from the handler signature. */
    protected static call(container: ContainerContract): ServiceCallContract {
        return container.getSingleton<ServiceCallContract>(GrpcMessageServiceId.ServiceCallContract);
    }

    protected static controller(container: ContainerContract): PingController {
        return container.getSingleton<PingController>(ServiceProvider.PingControllerId);
    }
}
