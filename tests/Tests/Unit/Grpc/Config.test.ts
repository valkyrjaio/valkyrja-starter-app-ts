/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { GrpcConfig } from '@valkyrjaio/valkyrja/Application/Data/GrpcConfig.ts';

import { Config } from '../../../../src/App/Grpc/Config.ts';
import { ComponentProvider } from '../../../../src/App/Grpc/Provider/ComponentProvider.ts';

describe('Config', () => {
    it('is a GrpcConfig', () => {
        expect(new Config()).toBeInstanceOf(GrpcConfig);
    });

    it('exposes the configured values', () => {
        const config = new Config();

        expect(config.namespace).toBe('App');
        expect(config.version).toBe('1.0.0');
        expect(config.environment).toBe('production');
        expect(config.debugMode).toBe(false);
        expect(config.timezone).toBe('UTC');
        expect(config.dataPath).toBe('src/App/Grpc/Data');
        expect(config.dataNamespace).toBe('App/Grpc/Data');
    });

    it('enables debug mode when requested', () => {
        expect(new Config(true).debugMode).toBe(true);
    });

    it('registers the component provider', () => {
        expect(new Config().providers[0]).toBeInstanceOf(ComponentProvider);
    });
});
