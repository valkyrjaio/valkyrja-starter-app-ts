/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HttpMessageServiceId } from '@valkyrjaio/valkyrja/Http/Message/Constant/HttpMessageServiceId.js';
import { HomeController } from '../Controller/HomeController.js';

import type { ContainerContract } from '@valkyrjaio/valkyrja/Container/Manager/Contract/ContainerContract.js';
import type { ResponseFactoryContract } from '@valkyrjaio/valkyrja/Http/Message/Response/Factory/Contract/ResponseFactoryContract.js';
import type { ServerRequestContract } from '@valkyrjaio/valkyrja/Http/Message/Request/Contract/ServerRequestContract.js';
import type { ServiceProviderContract } from '@valkyrjaio/valkyrja/Container/Provider/Contract/ServiceProviderContract.js';

export class ServiceProvider implements ServiceProviderContract {
    static readonly HomeControllerId = 'App.Http.Controller.HomeController' as const;

    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [ServiceProvider.HomeControllerId]: ServiceProvider.publishHomeController,
        };
    }

    static publishHomeController(this: void, container: ContainerContract): void {
        container.setSingleton<HomeController>(
            ServiceProvider.HomeControllerId,
            new HomeController(
                container.getSingleton<ServerRequestContract>(HttpMessageServiceId.ServerRequestContract),
                container.getSingleton<ResponseFactoryContract>(HttpMessageServiceId.ResponseFactoryContract),
            ),
        );
    }
}
