/*
 * ESLint configuration file for jest and testing code
 */
module.exports = {
  extends: [
    './.eslintrc.js',
    // 'airbnb',
    'plugin:jest/recommended',
  ],
  files: [
    'src/testing/**.ts',
    '**/__tests__/**.ts',
    'src/**/__mocks__/**.ts',
    './jest.*.ts',
  ],
  env: {
    jest: true,
  },
  parserOptions: {
    project: './tsconfig.test.json',
  },
  plugins: [
    'eslint-plugin-import',
    'jest',
  ],
};
