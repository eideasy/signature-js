/* eslint-disable max-len */
/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  modulePathIgnorePatterns: ['scripts'],
  globals: {
    NODE_ENV: 'test',
  },
};
