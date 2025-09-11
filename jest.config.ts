import type {Config} from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapping: {
    '^~/(.*)$': '<rootDir>/app/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: [
    '<rootDir>/app/**/__tests__/**/*.(ts|tsx)',
    '<rootDir>/app/**/*.(test|spec).(ts|tsx)',
    '<rootDir>/tests/**/*.(test|spec).(ts|tsx)',
  ],
  collectCoverageFrom: [
    'app/**/*.(ts|tsx)',
    '!app/**/*.d.ts',
  ],
};

export default config;