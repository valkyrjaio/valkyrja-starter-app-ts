/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { EventData } from '@valkyrjaio/valkyrja/Event/Data/EventData.ts';

import { AppEventData } from '../../../../../src/App/Grpc/Data/AppEventData.ts';

describe('AppEventData', () => {
    it('is a EventData', () => {
        expect(new AppEventData()).toBeInstanceOf(EventData);
    });
});
