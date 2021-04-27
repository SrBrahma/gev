module.exports = {
  "env": {
    "es2021": true,
    "node": true,
    "react-native/react-native": true // *2
  },
  "extends": [
    "@srbrahma/eslint-config/react-native", // https://github.com/SrBrahma/eslint-config
    "plugin:@typescript-eslint/recommended-requiring-type-checking" // *1
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "tsconfigRootDir": __dirname, // *1
    "project": ['./tsconfig.json'], // *1
    "ecmaVersion": 12,
    "sourceType": "module",
    "ecmaFeatures": { // *2
      "jsx": true
    }
  },
  "rules": {
  }
};

// [*1] - https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/TYPED_LINTING.md#getting-started---linting-with-type-information
// [*2] - https://github.com/Intellicode/eslint-plugin-react-native#configuration