import { FlatCompat } from '@eslint/eslintrc';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
});

export default tseslint.config(
    {
        ignores: ['.next'],
    },
    ...compat.extends('next/core-web-vitals'),
    {
        files: ['**/*.ts', '**/*.tsx'],
        plugins: {
            'unused-imports': unusedImports,
        },
        extends: [
            ...tseslint.configs.recommended,
            ...tseslint.configs.recommendedTypeChecked,
            ...tseslint.configs.stylisticTypeChecked,
        ],
        rules: {
            '@typescript-eslint/array-type': 'off',
            '@typescript-eslint/consistent-type-definitions': 'off',
            '@typescript-eslint/consistent-type-imports': [
                'warn',
                { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
            ],
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/require-await': 'off',
            '@typescript-eslint/no-non-null-assertion': 'error',
            '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
            'import/no-default-export': 'error',
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],
        },
    },
    {
        files: [
            'next.config.ts',
            'src/app/**/page.tsx',
            'src/app/**/layout.tsx',
            'src/app/**/error.tsx',
            'src/app/**/global-error.tsx',
            'src/app/**/not-found.tsx',
            'src/app/**/unauthorized.tsx',
            'src/app/**/icon.tsx',
        ],
        rules: {
            'import/no-default-export': 'off',
        },
    },
    {
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
    },
);
