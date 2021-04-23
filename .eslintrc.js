module.exports = {
  "env": {
    "es2021": true,
    "node": true
  },
  "extends": [
    "@srbrahma/eslint-config", // https://github.com/SrBrahma/eslint-config
    "plugin:@typescript-eslint/recommended-requiring-type-checking" // *1
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "tsconfigRootDir": __dirname,   // *1
    "project": ['./tsconfig.json'], // *1
    "ecmaVersion": 12,
    "sourceType": "module",
  },
  "rules": {
  }
};

// [*1] - Optional but improves the linting for TS:
// https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md#getting-started---linting-with-type-information