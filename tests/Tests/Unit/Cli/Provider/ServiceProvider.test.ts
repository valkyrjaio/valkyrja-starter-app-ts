/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { describe, expect, it } from 'vitest';

import { CliInteractionServiceId } from '@valkyrjaio/valkyrja/Cli/Interaction/Constant/CliInteractionServiceId.ts';
import { Container } from '@valkyrjaio/valkyrja/Container/Manager/Container.ts';
import { LoggerContractId } from '@valkyrjaio/valkyrja/Log/Logger/Contract/LoggerContract.ts';

import { AppCliServiceId } from '../../../../../src/App/Cli/Constant/AppCliServiceId.ts';
import { ServiceProvider } from '../../../../../src/App/Cli/Provider/ServiceProvider.ts';
import { TestCommand } from '../../../../../src/App/Cli/Command/TestCommand.ts';

import type { LoggerContract } from '@valkyrjaio/valkyrja/Log/Logger/Contract/LoggerContract.ts';

describe('ServiceProvider', () => {
    it('exposes the test command and logger publishers', () => {
        expect(Object.keys(new ServiceProvider().publishers())).toHaveLength(2);
    });

    it('publishes the test command', () => {
        const container = new Container();
        container.setSingleton(CliInteractionServiceId.InputContract, {} as never);
        container.setSingleton(CliInteractionServiceId.OutputFactoryContract, {} as never);

        ServiceProvider.publishTestCommand(container);

        expect(container.getSingleton(AppCliServiceId.TestCommand)).toBeInstanceOf(TestCommand);
    });

    it('publishes a null logger whose methods are all no-ops', () => {
        const container = new Container();

        ServiceProvider.publishLogger(container);
        const logger = container.getSingleton<LoggerContract>(LoggerContractId);

        expect(() => {
            logger.throwable(new Error('x'));
            logger.debug('x');
            logger.info('x');
            logger.notice('x');
            logger.warning('x');
            logger.error('x');
            logger.critical('x');
            logger.alert('x');
            logger.emergency('x');
        }).not.toThrow();
    });
});
