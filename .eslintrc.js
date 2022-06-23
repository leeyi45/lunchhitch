/**
 * Configuration for eslint
 */
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint-config-prettier',
    'airbnb',
    'plugin:@next/next/recommended',
    'plugin:react/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    'eslint-plugin-import',
    'eslint-plugin-prettier',
    '@typescript-eslint',
  ],
  rules: {
    'linebreak-style': 0,
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'jsx-a11y/label-has-associated-control': [
      'error', {
        required: {
          some: ['nesting', 'id '],
        },
      },
    ],
    'no-else-return': 0,
    'react/destructuring-assignment': 0,
    'react/function-component-definition': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-props-no-spreading': 0,
    'react/no-array-index-key': 0,
    '@typescript-eslint/no-unused-vars': 'error',
    'max-len': [0, { code: 100 }],
    'no-unused-vars': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
