/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'jest-expo/android', // https://www.npmjs.com/package/jest-expo
  testEnvironment: 'node', // https://stackoverflow.com/a/67216156/10247962
  maxWorkers: 1, // https://stackoverflow.com/a/60905543/10247962
  setupFiles: [
    './jest.setup.js', // https://reactnavigation.org/docs/testing
  ],
  setupFilesAfterEnv: [
    // "@testing-library/jest-native/extend-expect"
  ],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|pagescrollview)',
  ], // https://docs.expo.dev/guides/testing-with-jest/#jest-configuration
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  moduleNameMapper: {
    // https://github.com/kristerkari/react-native-svg-transformer#usage-with-jest
    '\\.svg': '<rootDir>/__mocks__/svgMock.js',
  },
};