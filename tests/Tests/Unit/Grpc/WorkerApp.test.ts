/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { WorkerGrpc } from '@valkyrjaio/valkyrja/Application/Entry/WorkerGrpc.ts';

import { WorkerApp } from '../../../../src/App/Grpc/WorkerApp.ts';

describe('WorkerApp', () => {
    it('is a WorkerGrpc entry', () => {
        expect(WorkerApp.prototype).toBeInstanceOf(WorkerGrpc);
    });

    it('exposes a throwable handler', () => {
        expect(WorkerApp.getThrowableHandler()).toBeDefined();
    });

    it('runs the default exception handler without throwing', () => {
        expect(() => WorkerApp.defaultExceptionHandler()).not.toThrow();
    });
});
