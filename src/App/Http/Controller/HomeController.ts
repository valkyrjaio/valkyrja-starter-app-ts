/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { HtmlResponse } from '@valkyrjaio/valkyrja/Http/Message/Response/HtmlResponse.ts';
import { TextResponse } from '@valkyrjaio/valkyrja/Http/Message/Response/TextResponse.ts';
import { Controller } from './Abstract/Controller.ts';

import type { ApplicationContract } from '@valkyrjaio/valkyrja/Application/Kernel/Contract/ApplicationContract.ts';
import type { HtmlResponseContract } from '@valkyrjaio/valkyrja/Http/Message/Response/Contract/HtmlResponseContract.ts';
import type { JsonResponseContract } from '@valkyrjaio/valkyrja/Http/Message/Response/Contract/JsonResponseContract.ts';
import type { TextResponseContract } from '@valkyrjaio/valkyrja/Http/Message/Response/Contract/TextResponseContract.ts';

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
