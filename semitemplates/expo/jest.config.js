/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'jest-expo/universal', // https://www.npmjs.com/package/jest-expo
  testEnvironment: 'node',
  maxWorkers: 1, // https://stackoverflow.com/a/60905543/10247962
  setupFiles: [
    "./jest/setup.js" // https://reactnavigation.org/docs/testing
  ],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
  ], // https://docs.expo.dev/guides/testing-with-jest/#jest-configuration
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
};