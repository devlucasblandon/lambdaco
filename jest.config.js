const path = require('path');

module.exports  = {
    rootDir: path.join(__dirname),
    verbose: true,
    moduleFileExtensions: ['js', 'json'],
    testPathIgnorePatterns: ['/node_modules/'],
    collectCoverage: true,
    testEnvironment: 'node',
    testMatch: ['**/__test__/**/*.test.js'],
    coverageReporters: ['html', 'json', 'lcov', 'text', 'clover'],
    clearMocks: true,
    reporters: ['default', 'jest-sonar'],
    coverageProvider: 'v8'
};