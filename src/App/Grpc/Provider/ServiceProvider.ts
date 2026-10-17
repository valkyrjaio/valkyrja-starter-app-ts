/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { AppGrpcServiceId } from '../Constant/AppGrpcServiceId.ts';
import { PingController } from '../Controller/PingController.ts';

import type { ContainerContract } from '@valkyrjaio/valkyrja/Container/Manager/Contract/ContainerContract.ts';
import type { ServiceProviderContract } from '@valkyrjaio/valkyrja/Container/Provider/Contract/ServiceProviderContract.ts';

export class ServiceProvider implements ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [AppGrpcServiceId.PingController]: ServiceProvider.publishPingController,
        };
    }

    static publishPingController(this: void, container: ContainerContract): void {
        container.setSingleton<PingController>(AppGrpcServiceId.PingController, new PingController());
    }
}
