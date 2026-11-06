/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { ContainerData } from '@valkyrjaio/valkyrja/Container/Data/ContainerData.ts';

import { AppContainerData } from '../../../../../src/App/Grpc/Data/AppContainerData.ts';

describe('AppContainerData', () => {
    it('is a ContainerData', () => {
        expect(new AppContainerData()).toBeInstanceOf(ContainerData);
    });
});
