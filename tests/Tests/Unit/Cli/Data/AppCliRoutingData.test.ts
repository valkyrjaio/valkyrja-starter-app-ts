/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { AppCliRoutingData } from '../../../../../src/App/Cli/Data/AppCliRoutingData.ts';
import { CliRoutingData } from '@valkyrjaio/valkyrja/Cli/Routing/Data/CliRoutingData.ts';

describe('AppCliRoutingData', () => {
    it('is a CliRoutingData', () => {
        expect(new AppCliRoutingData()).toBeInstanceOf(CliRoutingData);
    });
});
