module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',  // Resolve o alias '@'
    '\\.(css|less|scss|svg)$': '<rootDir>/tests/unit/__mocks__/fileMock.js', // Mock para SVG e CSS
  },
}
