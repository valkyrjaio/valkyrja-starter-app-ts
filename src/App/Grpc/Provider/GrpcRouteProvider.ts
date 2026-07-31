/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { GrpcMessageServiceId } from '@valkyrjaio/valkyrja/Grpc/Message/Constant/GrpcMessageServiceId.ts';
import { Route } from '@valkyrjaio/valkyrja/Grpc/Routing/Data/Route.ts';
import { ServiceProvider } from './ServiceProvider.ts';

import type { ContainerContract } from '@valkyrjaio/valkyrja/Container/Manager/Contract/ContainerContract.ts';
import type { ServiceCallContract } from '@valkyrjaio/valkyrja/Grpc/Message/Call/Contract/ServiceCallContract.ts';
import type { ServiceResponseContract } from '@valkyrjaio/valkyrja/Grpc/Message/Response/Contract/ServiceResponseContract.ts';
import type { RouteContract } from '@valkyrjaio/valkyrja/Grpc/Routing/Data/Contract/RouteContract.ts';
import type { GrpcRouteProviderContract } from '@valkyrjaio/valkyrja/Grpc/Routing/Provider/Contract/GrpcRouteProviderContract.ts';
import { PingController } from '../Controller/PingController.ts';

export class GrpcRouteProvider implements GrpcRouteProviderContract {
    getRoutes(): RouteContract[] {
        return [
            new Route('/app.Ping/Ping', GrpcRouteProvider.pingHandler),
            new Route('/app.Ping/Fanout', GrpcRouteProvider.fanoutHandler).withServerStreaming(true),
            new Route('/app.Ping/Collect', GrpcRouteProvider.collectHandler).withClientStreaming(true),
            new Route('/app.Ping/Missing', GrpcRouteProvider.missingHandler),
        ];
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
