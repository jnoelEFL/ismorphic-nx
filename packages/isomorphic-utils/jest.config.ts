module.exports = {
  displayName: 'isomorphic-utils',
  preset: '../../jest.preset.ts',
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*-unit-test.(js|ts|tsx)"
  ],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  coverageDirectory: '../../coverage/packages/isomorphic-utils',
};
