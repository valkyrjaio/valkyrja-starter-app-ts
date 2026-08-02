/*
 * This file is part of the Valkyrja Application package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

/**
 * Container binding keys for the HTTP application's services.
 *
 * These live in their own constant, free of any controller import, so both the
 * `ServiceProvider` (which registers the binding) and the `HttpRouteProvider`
 * (whose handlers resolve it) can share the key without either pulling the
 * decorator-carrying controller into the other's module graph.
 */
export class AppHttpServiceId {
    static readonly HomeController = 'App.Http.Controller.HomeController' as const;
}
