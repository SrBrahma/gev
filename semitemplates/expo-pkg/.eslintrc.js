// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  env: {
    es2021: true,
    node: true,
    'react-native/react-native': true // *3
  },
  extends: [
    'eslint-config-gev/js' // https://github.com/SrBrahma/eslint-config-gev
  ],
  parser: '@typescript-eslint/parser',
  overrides: [ // *2
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended-requiring-type-checking', // *1
        'eslint-config-gev/react-native' // https://github.com/SrBrahma/eslint-config-gev
      ],
      parserOptions: {
        tsconfigRootDir: __dirname, // *1
        project: ['./tsconfig.lint.json'], // *1
        ecmaVersion: 12,
        sourceType: 'module',
        ecmaFeatures: { // *3
          jsx: true
        }
      },
    }
  ],
  ignorePatterns: ['**/lib/**/*', '**/dist/**/*', '**/node_modules/**/*', '.eslintrc.js'],
  rules: {
  }
};

// [*1] - https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md#getting-started---linting-with-type-information
// [*2] - https://stackoverflow.com/a/64488474
// [*3] - https://github.com/Intellicode/eslint-plugin-react-native#configuration