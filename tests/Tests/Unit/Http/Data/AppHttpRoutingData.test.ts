/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { AppHttpRoutingData } from '../../../../../src/App/Http/Data/AppHttpRoutingData.ts';
import { HttpRoutingData } from '@valkyrjaio/valkyrja/Http/Routing/Data/HttpRoutingData.ts';

describe('AppHttpRoutingData', () => {
    it('is a HttpRoutingData', () => {
        expect(new AppHttpRoutingData()).toBeInstanceOf(HttpRoutingData);
    });
});
