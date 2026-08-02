/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Container } from '@valkyrjaio/valkyrja/Container/Manager/Container.ts';
import { HttpMessageServiceId } from '@valkyrjaio/valkyrja/Http/Message/Constant/HttpMessageServiceId.ts';

import { AppHttpServiceId } from '../../../../../src/App/Http/Constant/AppHttpServiceId.ts';
import { HomeController } from '../../../../../src/App/Http/Controller/HomeController.ts';
import { ServiceProvider } from '../../../../../src/App/Http/Provider/ServiceProvider.ts';

describe('ServiceProvider', () => {
    it('exposes the home controller publisher', () => {
        expect(Object.keys(new ServiceProvider().publishers())).toHaveLength(1);
    });

    it('publishes the home controller', () => {
        const container = new Container();
        container.setSingleton(HttpMessageServiceId.ServerRequestContract, {} as never);
        container.setSingleton(HttpMessageServiceId.ResponseFactoryContract, {} as never);

        ServiceProvider.publishHomeController(container);

        expect(container.getSingleton(AppHttpServiceId.HomeController)).toBeInstanceOf(HomeController);
    });
});
