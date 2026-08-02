/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { App } from '../../../../src/App/Http/App.ts';

describe('App', () => {
    it('exposes a throwable handler', () => {
        expect(App.getThrowableHandler()).toBeDefined();
    });

    it('runs the default exception handler without throwing', () => {
        expect(() => App.defaultExceptionHandler()).not.toThrow();
    });
});
