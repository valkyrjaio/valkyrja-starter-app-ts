/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HtmlResponse } from '@valkyrjaio/valkyrja/Http/Message/Response/HtmlResponse.js';
import { TextResponse } from '@valkyrjaio/valkyrja/Http/Message/Response/TextResponse.js';
import { Controller } from './Abstract/Controller.js';

import type { ApplicationContract } from '@valkyrjaio/valkyrja/Application/Kernel/Contract/ApplicationContract.js';
import type { HtmlResponseContract } from '@valkyrjaio/valkyrja/Http/Message/Response/Contract/HtmlResponseContract.js';
import type { JsonResponseContract } from '@valkyrjaio/valkyrja/Http/Message/Response/Contract/JsonResponseContract.js';
import type { TextResponseContract } from '@valkyrjaio/valkyrja/Http/Message/Response/Contract/TextResponseContract.js';

export class HomeController extends Controller {
    static version(app: ApplicationContract): TextResponseContract {
        return new TextResponse(app.getVersion());
    }

    static text(): TextResponseContract {
        return new TextResponse('Hello World!');
    }

    welcome(): HtmlResponseContract {
        return new HtmlResponse('<h1>Welcome!</h1>');
    }

    welcomeCached(): HtmlResponseContract {
        return new HtmlResponse('<h1>Welcome!</h1>');
    }

    dynamic(value: string): HtmlResponseContract {
        return new HtmlResponse(`<h1>${value}</h1>`);
    }

    home(): HtmlResponseContract {
        return new HtmlResponse('<h1>Home</h1>');
    }

    json(): JsonResponseContract {
        return this.responseFactory.createJsonResponse({ example: 'Json response example' });
    }
}
