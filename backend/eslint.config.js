import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.node,
    },
    rules: {
      indent: ['error', 2],
      quotes: [
        'error',
        'single',
        { avoidEscape: true, allowTemplateLiterals: true },
      ],
      semi: 'error',
      'semi-style': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'eol-last': ['error', 'always'],
      'comma-dangle': ['error', 'only-multiline'],
    },
  }
);
