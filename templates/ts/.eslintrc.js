module.exports = {
  "env": {
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint-config-gev",
    "plugin:@typescript-eslint/recommended-requiring-type-checking" // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md#getting-started---linting-with-type-information
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module",
    "tsconfigRootDir": __dirname,
    "project": ['./tsconfig.json'],
  },
  "rules": {
  }
};

