/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
