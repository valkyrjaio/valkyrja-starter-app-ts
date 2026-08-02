/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { AppHttpRoutingData } from '../../../../../src/App/Http/Data/AppHttpRoutingData.ts';
import { HttpRoutingData } from '@valkyrjaio/valkyrja/Http/Routing/Data/HttpRoutingData.ts';

describe('AppHttpRoutingData', () => {
    it('is a HttpRoutingData', () => {
        expect(new AppHttpRoutingData()).toBeInstanceOf(HttpRoutingData);
    });
});
