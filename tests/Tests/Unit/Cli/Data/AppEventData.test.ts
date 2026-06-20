/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { AppEventData } from '../../../../../src/App/Cli/Data/AppEventData.ts';
import { EventData } from '@valkyrjaio/valkyrja/Event/Data/EventData.ts';

describe('AppEventData', () => {
    it('is a EventData', () => {
        expect(new AppEventData()).toBeInstanceOf(EventData);
    });
});
