export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true
    }]
  },
  moduleFileExtensions: ['vue', 'js', 'ts', 'json'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(js|jsx|ts|tsx)',
    '<rootDir>/src/**/*.(test|spec).(js|jsx|ts|tsx)'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,ts,vue}',
    '!src/main.ts',
    '!src/**/__tests__/**'
  ]
};