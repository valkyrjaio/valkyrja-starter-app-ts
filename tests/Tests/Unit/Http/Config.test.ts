/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { Config } from '../../../../src/App/Http/Config.ts';
import { ComponentProvider } from '../../../../src/App/Http/Provider/ComponentProvider.ts';
import { HttpConfig } from '@valkyrjaio/valkyrja/Application/Data/HttpConfig.ts';

describe('Config', () => {
    it('is an HttpConfig', () => {
        expect(new Config()).toBeInstanceOf(HttpConfig);
    });

    it('exposes the configured values', () => {
        const config = new Config();

        expect(config.namespace).toBe('App');
        expect(config.version).toBe('1.0.0');
        expect(config.environment).toBe('production');
        expect(config.debugMode).toBe(false);
        expect(config.timezone).toBe('UTC');
        expect(config.dataPath).toBe('src/App/Http/Data');
        expect(config.dataNamespace).toBe('App/Http/Data');
    });

    it('registers the component provider', () => {
        expect(new Config().providers[0]).toBeInstanceOf(ComponentProvider);
    });
});
