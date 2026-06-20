/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { AppContainerData } from '../../../../../src/App/Http/Data/AppContainerData.ts';
import { ContainerData } from '@valkyrjaio/valkyrja/Container/Data/ContainerData.ts';

describe('AppContainerData', () => {
    it('is a ContainerData', () => {
        expect(new AppContainerData()).toBeInstanceOf(ContainerData);
    });
});
