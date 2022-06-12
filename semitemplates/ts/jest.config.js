// https://stackoverflow.com/a/60905543/10247962
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers: 1,
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};