/*
 * ESLint configuration file for jest and testing code
 */
module.exports = {
  extends: [
    'airbnb',
    'plugin:jest/recommended',
    '../.eslintrc.js',
  ],
  env: {
    jest: true,
  },
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: [
    'eslint-plugin-import',
    'jest',
  ],
  rules: {
    'linebreak-style': 0,
    'no-underscore-dangle': 0,
    'jest/expect-expect': [
      'error',
      {
        assertFunctionNames: [
          'expect**',
        ],
      },
    ],
  },
};
