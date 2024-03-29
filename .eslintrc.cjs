// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'eslint-config-gev/js', // https://github.com/SrBrahma/eslint-config-gev
  ],
  parser: '@typescript-eslint/parser',
  overrides: [
    //* 2
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended-requiring-type-checking', // *1
        'eslint-config-gev/ts', // https://github.com/SrBrahma/eslint-config-gev
      ],
      parserOptions: {
        tsconfigRootDir: __dirname, // *1
        project: ['./tsconfig.json'], // *1
        ecmaVersion: 12,
        sourceType: 'module',
      },
    },
  ],
  ignorePatterns: ['**/lib/**/*', '**/dist/**/*', '**/node_modules/**/*', 'semitemplates/**/*'],
  rules: {},
};

// [*1] - https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md#getting-started---linting-with-type-information
// [*2] - https://stackoverflow.com/a/64488474
