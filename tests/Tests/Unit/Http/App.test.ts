/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
