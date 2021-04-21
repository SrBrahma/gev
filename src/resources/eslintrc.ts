export function eslintrcJsData() {
  // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md
  // could add jest?
  return (
`module.exports = {
  "env": {
    "es2021": true,
    "node": true
  },
  "extends": [
    "@srbrahma/eslint-config
    "plugin:@typescript-eslint/recommended-requiring-type-checking" // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md#getting-started---linting-with-type-information
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module",
    "tsconfigRootDir": "__dirname",
    "project": ['./tsconfig.json'],
  },
  "rules": {
  }
};

`)
}