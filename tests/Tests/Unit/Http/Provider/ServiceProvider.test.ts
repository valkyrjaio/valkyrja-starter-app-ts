/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { Container } from '@valkyrjaio/valkyrja/Container/Manager/Container.ts';
import { HttpMessageServiceId } from '@valkyrjaio/valkyrja/Http/Message/Constant/HttpMessageServiceId.ts';

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

        expect(container.getSingleton(ServiceProvider.HomeControllerId)).toBeInstanceOf(HomeController);
    });
});
