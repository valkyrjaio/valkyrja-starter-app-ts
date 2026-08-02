/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
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
