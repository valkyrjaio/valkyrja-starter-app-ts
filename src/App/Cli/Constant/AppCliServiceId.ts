/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Container binding keys for the CLI application's services.
 *
 * These live in their own constant, free of any command import, so both the
 * `ServiceProvider` (which registers the binding) and the `CliRouteProvider`
 * (whose handler resolves it) can share the key without either pulling the
 * decorator-carrying command into the other's module graph.
 */
export class AppCliServiceId {
    static readonly TestCommand = 'App.Cli.Command.TestCommand' as const;
}
