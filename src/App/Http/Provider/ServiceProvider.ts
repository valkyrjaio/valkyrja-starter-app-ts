/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { HttpMessageServiceId } from '@valkyrjaio/valkyrja/Http/Message/Constant/HttpMessageServiceId.ts';
import { AppHttpServiceId } from '../Constant/AppHttpServiceId.ts';
import { HomeController } from '../Controller/HomeController.ts';

import type { ContainerContract } from '@valkyrjaio/valkyrja/Container/Manager/Contract/ContainerContract.ts';
import type { ResponseFactoryContract } from '@valkyrjaio/valkyrja/Http/Message/Response/Factory/Contract/ResponseFactoryContract.ts';
import type { ServerRequestContract } from '@valkyrjaio/valkyrja/Http/Message/Request/Contract/ServerRequestContract.ts';
import type { ServiceProviderContract } from '@valkyrjaio/valkyrja/Container/Provider/Contract/ServiceProviderContract.ts';

export class ServiceProvider implements ServiceProviderContract {
    publishers(): Record<string, (container: ContainerContract) => void> {
        return {
            [AppHttpServiceId.HomeController]: ServiceProvider.publishHomeController,
        };
    }

    static publishHomeController(this: void, container: ContainerContract): void {
        container.setSingleton<HomeController>(
            AppHttpServiceId.HomeController,
            new HomeController(
                container.getSingleton<ServerRequestContract>(HttpMessageServiceId.ServerRequestContract),
                container.getSingleton<ResponseFactoryContract>(HttpMessageServiceId.ResponseFactoryContract),
            ),
        );
    }
}
