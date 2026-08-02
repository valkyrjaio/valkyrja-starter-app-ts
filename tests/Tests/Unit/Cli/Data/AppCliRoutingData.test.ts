/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { AppCliRoutingData } from '../../../../../src/App/Cli/Data/AppCliRoutingData.ts';
import { CliRoutingData } from '@valkyrjaio/valkyrja/Cli/Routing/Data/CliRoutingData.ts';

describe('AppCliRoutingData', () => {
    it('is a CliRoutingData', () => {
        expect(new AppCliRoutingData()).toBeInstanceOf(CliRoutingData);
    });
});
