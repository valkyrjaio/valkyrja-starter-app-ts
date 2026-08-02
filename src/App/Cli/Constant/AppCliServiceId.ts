/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
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
