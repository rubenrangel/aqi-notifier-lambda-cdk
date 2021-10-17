module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/lib', '<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.ts'],
};
