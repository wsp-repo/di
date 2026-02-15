module.exports = {
  moduleNameMapper: {
    '^src$': '<rootDir>/src',
    '^src/(.+)$': '<rootDir>/src/$1',
  },
  modulePathIgnorePatterns: ['src/typings'],
  modulePaths: ['<rootDir>'],
  preset: 'ts-jest',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'reports',
        outputName: 'unit.xml',
      },
    ],
    ['jest-html-reporter', {
      pageTitle: 'Test Report',
      outputPath: './reports/unit.html'
    }]
  ],
  rootDir: './src/',
  testEnvironment: 'node',
  // prettier-ignore
  testPathIgnorePatterns: [
    '/node_modules./',
    '<rootDir>/(dist|reports)./',
  ],
  testRegex: '.spec.ts$',
};
