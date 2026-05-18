import { HttpConfig } from '@valkyrja/valkyrja/Application/Data/HttpConfig.js';
import { ComponentProvider } from './Provider/ComponentProvider.js';

export class Config extends HttpConfig {
    constructor() {
        super(
            'App',
            process.cwd(),
            '1.0.0',
            'production',
            false,
            'UTC',
            'some_secret_app_key',
            'src/App/Http/Data',
            'App/Http/Data',
            [new ComponentProvider()],
        );
    }
}
