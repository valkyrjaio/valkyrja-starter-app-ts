/*
 * This file is part of the Valkyrja Application package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';

import { HtmlResponse } from '@valkyrjaio/valkyrja/Http/Message/Response/HtmlResponse.ts';
import { JsonResponse } from '@valkyrjaio/valkyrja/Http/Message/Response/JsonResponse.ts';
import { TextResponse } from '@valkyrjaio/valkyrja/Http/Message/Response/TextResponse.ts';
import { ResponseFactory } from '@valkyrjaio/valkyrja/Http/Message/Response/Factory/ResponseFactory.ts';

import { HomeController } from '../../../../../src/App/Http/Controller/HomeController.ts';

import type { ApplicationContract } from '@valkyrjaio/valkyrja/Application/Kernel/Contract/ApplicationContract.ts';

function controller(): HomeController {
    return new HomeController({} as never, new ResponseFactory());
}

describe('HomeController', () => {
    it('renders the application version as text', () => {
        const app = { getVersion: () => '1.0.0' } as unknown as ApplicationContract;

        const response = HomeController.version(app);

        expect(response).toBeInstanceOf(TextResponse);
        expect(response.getBody().getContents()).toBe('1.0.0');
    });

    it('renders static text', () => {
        expect(HomeController.text()).toBeInstanceOf(TextResponse);
    });

    it('renders the welcome, cached welcome and home html', () => {
        expect(controller().welcome()).toBeInstanceOf(HtmlResponse);
        expect(controller().welcomeCached()).toBeInstanceOf(HtmlResponse);
        expect(controller().home()).toBeInstanceOf(HtmlResponse);
    });

    it('renders a dynamic value into html', () => {
        expect(controller().dynamic('abc').getBody().getContents()).toBe('<h1>abc</h1>');
    });

    it('renders a json response', () => {
        expect(controller().json()).toBeInstanceOf(JsonResponse);
    });
});
