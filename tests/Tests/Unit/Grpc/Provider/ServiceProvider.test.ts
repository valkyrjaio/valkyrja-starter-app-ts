/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { Container } from '@valkyrjaio/valkyrja/Container/Manager/Container.ts';

import { PingController } from '../../../../../src/App/Grpc/Controller/PingController.ts';
import { ServiceProvider } from '../../../../../src/App/Grpc/Provider/ServiceProvider.ts';

describe('ServiceProvider', () => {
    it('exposes the ping controller publisher', () => {
        expect(Object.keys(new ServiceProvider().publishers())).toHaveLength(1);
    });

    it('publishes the ping controller', () => {
        const container = new Container();

        ServiceProvider.publishPingController(container);

        expect(container.getSingleton(ServiceProvider.PingControllerId)).toBeInstanceOf(PingController);
    });
});
