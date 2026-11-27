/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { GrpcRoutingData } from '@valkyrjaio/valkyrja/Grpc/Routing/Data/GrpcRoutingData.ts';

import { AppGrpcRoutingData } from '../../../../../src/App/Grpc/Data/AppGrpcRoutingData.ts';

describe('AppGrpcRoutingData', () => {
    it('is a GrpcRoutingData', () => {
        expect(new AppGrpcRoutingData()).toBeInstanceOf(GrpcRoutingData);
    });
});
