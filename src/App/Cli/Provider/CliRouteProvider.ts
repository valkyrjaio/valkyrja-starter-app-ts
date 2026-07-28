/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ApplicationServiceId } from '@valkyrjaio/valkyrja/Application/Constant/ApplicationServiceId.ts';
import { AppCliServiceId } from '../Constant/AppCliServiceId.ts';
// A real value import, even though the command imports this provider back for its
// `@RouteHandler` reference. That cycle is safe now that handler references are
// thunks: the command's decorators only build closures, so nothing dereferences
// this half-initialized module binding at class-definition time. Debug mode needs
// the actual class object from `getControllerClasses()`, which a type-only import
// (erased at run time) cannot provide.
import { TestCommand } from '../Command/TestCommand.ts';

import type { CliConfigContract } from '@valkyrjaio/valkyrja/Application/Data/Contract/CliConfigContract.ts';
import type { OutputContract } from '@valkyrjaio/valkyrja/Cli/Interaction/Output/Contract/OutputContract.ts';
import type { RouteContract } from '@valkyrjaio/valkyrja/Cli/Routing/Data/Contract/RouteContract.ts';
import type { CliRouteProviderContract } from '@valkyrjaio/valkyrja/Cli/Routing/Provider/Contract/CliRouteProviderContract.ts';
import type { ContainerContract } from '@valkyrjaio/valkyrja/Container/Manager/Contract/ContainerContract.ts';

export class CliRouteProvider implements CliRouteProviderContract {
    getControllerClasses(): Array<new (...args: unknown[]) => unknown> {
        // Sindri reads this list statically from the AST; the debug-mode runtime
        // collector reads the same list at run time, so the real class object has
        // to be here (it is a value import for exactly that reason).
        // @ts-expect-error -- the contract's `new (...args: unknown[]) => unknown` cannot express a command's own constructor parameters
        return [TestCommand];
    }

    getRoutes(): RouteContract[] {
        return [];
    }

    static testCommandHandler(this: void, container: ContainerContract, route: RouteContract): OutputContract {
        const config = container.getSingleton<CliConfigContract>(ApplicationServiceId.CliConfigContract);

        return container.getSingleton<TestCommand>(AppCliServiceId.TestCommand).run(route, config);
    }
}
