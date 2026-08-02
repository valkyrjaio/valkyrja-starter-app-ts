/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { AppEventData } from '../../../../../src/App/Http/Data/AppEventData.ts';
import { EventData } from '@valkyrjaio/valkyrja/Event/Data/EventData.ts';

describe('AppEventData', () => {
    it('is a EventData', () => {
        expect(new AppEventData()).toBeInstanceOf(EventData);
    });
});
