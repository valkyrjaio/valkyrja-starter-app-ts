import { HtmlResponse } from '@valkyrja/valkyrja/Http/Message/Response/HtmlResponse.js';
import { TextResponse } from '@valkyrja/valkyrja/Http/Message/Response/TextResponse.js';
import { Controller } from './Abstract/Controller.js';

import type { ApplicationContract } from '@valkyrja/valkyrja/Application/Kernel/Contract/ApplicationContract.js';
import type { HtmlResponseContract } from '@valkyrja/valkyrja/Http/Message/Response/Contract/HtmlResponseContract.js';
import type { JsonResponseContract } from '@valkyrja/valkyrja/Http/Message/Response/Contract/JsonResponseContract.js';
import type { TextResponseContract } from '@valkyrja/valkyrja/Http/Message/Response/Contract/TextResponseContract.js';

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
