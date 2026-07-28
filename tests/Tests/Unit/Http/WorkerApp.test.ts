/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { WorkerHttp } from '@valkyrjaio/valkyrja/Application/Entry/WorkerHttp.ts';

import { WorkerApp } from '../../../../src/App/Http/WorkerApp.ts';

describe('WorkerApp', () => {
    it('is a WorkerHttp entry', () => {
        expect(WorkerApp.prototype).toBeInstanceOf(WorkerHttp);
    });

    it('exposes a throwable handler', () => {
        expect(WorkerApp.getThrowableHandler()).toBeDefined();
    });

    it('runs the default exception handler without throwing', () => {
        expect(() => WorkerApp.defaultExceptionHandler()).not.toThrow();
    });
});
