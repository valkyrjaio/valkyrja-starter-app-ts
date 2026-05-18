import path from 'path';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: path.resolve(import.meta.dirname, '../../..'),
            },
        },
        rules: {
            '@typescript-eslint/no-namespace'                  : 'off',
            '@typescript-eslint/no-extraneous-class'           : 'off',
            '@typescript-eslint/no-unnecessary-type-parameters': 'off',
            '@typescript-eslint/no-unused-vars'                : ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
            '@typescript-eslint/no-invalid-void-type'          : ['error', { allowAsThisParameter: true }],
        },
    },
);
