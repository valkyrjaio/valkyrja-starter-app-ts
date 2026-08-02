/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { RequestMethod } from '@valkyrjaio/valkyrja/Http/Message/Enum/RequestMethod.ts';
import { HtmlResponse } from '@valkyrjaio/valkyrja/Http/Message/Response/HtmlResponse.ts';
import { TextResponse } from '@valkyrjaio/valkyrja/Http/Message/Response/TextResponse.ts';
import { Route } from '@valkyrjaio/valkyrja/Http/Routing/Attribute/Route.ts';
import { RouteHandler } from '@valkyrjaio/valkyrja/Http/Routing/Attribute/Route/RouteHandler.ts';
import { Controller } from './Abstract/Controller.ts';
import { HttpRouteProvider } from '../Provider/HttpRouteProvider.ts';

import type { ApplicationContract } from '@valkyrjaio/valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { HtmlResponseContract } from '@valkyrjaio/valkyrja/Http/Message/Response/Contract/HtmlResponseContract.ts';
import type { JsonResponseContract } from '@valkyrjaio/valkyrja/Http/Message/Response/Contract/JsonResponseContract.ts';
import type { TextResponseContract } from '@valkyrjaio/valkyrja/Http/Message/Response/Contract/TextResponseContract.ts';

export class HomeController extends Controller {
    @Route({
        path: '/version',
        name: 'version',
        requestMethods: [RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT],
    })
    @RouteHandler([() => HttpRouteProvider, 'versionHandler'])
    static version(app: ApplicationContract): TextResponseContract {
        return new TextResponse(app.getVersion());
    }

    @Route({ path: '/text', name: 'text', requestMethods: [RequestMethod.GET] })
    @RouteHandler([() => HttpRouteProvider, 'textHandler'])
    static text(): TextResponseContract {
        return new TextResponse('Hello World!');
    }

    @Route({ path: '/', name: 'welcome' })
    @RouteHandler([() => HttpRouteProvider, 'welcomeHandler'])
    welcome(): HtmlResponseContract {
        return new HtmlResponse('<h1>Welcome!</h1>');
    }

    @Route({ path: '/cached', name: 'welcome.cached' })
    @RouteHandler([() => HttpRouteProvider, 'welcomeCachedHandler'])
    welcomeCached(): HtmlResponseContract {
        return new HtmlResponse('<h1>Welcome!</h1>');
    }

    @Route({ path: '/{value}', name: 'dynamicValue', parameters: [{ name: 'value', regex: '[a-zA-Z]+' }] })
    @RouteHandler([() => HttpRouteProvider, 'dynamicHandler'])
    dynamic(value: string): HtmlResponseContract {
        return new HtmlResponse(`<h1>${value}</h1>`);
    }

    @Route({ path: '/home', name: 'home', requestMethods: [RequestMethod.GET, RequestMethod.HEAD] })
    @RouteHandler([() => HttpRouteProvider, 'homeHandler'])
    home(): HtmlResponseContract {
        return new HtmlResponse('<h1>Home</h1>');
    }

    @Route({ path: '/json', name: 'json' })
    @RouteHandler([() => HttpRouteProvider, 'jsonHandler'])
    json(): JsonResponseContract {
        return this.responseFactory.createJsonResponse({ example: 'Json response example' });
    }
}
