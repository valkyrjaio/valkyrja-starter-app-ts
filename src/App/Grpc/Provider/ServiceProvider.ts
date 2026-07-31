/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { PingController } from '../Controller/PingController.ts';

import type { ContainerContract } from '@valkyrjaio/valkyrja/Container/Manager/Contract/ContainerContract.ts';
import type { ServiceProviderContract } from '@valkyrjaio/valkyrja/Container/Provider/Contract/ServiceProviderContract.ts';

export class ServiceProvider implements ServiceProviderContract {
    static readonly PingControllerId = 'App.Grpc.Controller.PingController' as const;

    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [ServiceProvider.PingControllerId]: ServiceProvider.publishPingController,
        };
    }

    static publishPingController(this: void, container: ContainerContract): void {
        container.setSingleton<PingController>(ServiceProvider.PingControllerId, new PingController());
    }
}
