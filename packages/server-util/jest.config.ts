module.exports = {
  displayName: 'server-util',
  preset: '../../jest.preset.ts',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*-unit-test.(js|ts|tsx)"
  ],
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/server-util',
};
