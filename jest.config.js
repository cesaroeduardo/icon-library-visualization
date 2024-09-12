module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest', // Transforma arquivos JS com Babel
    '^.+\\.vue$': '@vue/vue3-jest', // Para transformar arquivos Vue
    '^.+\\.svg$': 'jest-transform-stub', // Para lidar com SVGs
  },
  moduleFileExtensions: ['js', 'vue'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Resolve o alias @ para a pasta src
    '\\.(css|less|scss)$': 'identity-obj-proxy', // Para mockar arquivos de estilo
    '\\.(svg|jpg|jpeg|png|gif)$': '<rootDir>/tests/unit/__mocks__/fileMock.js', // Para mockar arquivos SVG e imagens
  },
  transformIgnorePatterns: ['/node_modules/'],
  testEnvironment: 'jsdom', // Define o ambiente de teste para jsdom
  setupFilesAfterEnv: ['<rootDir>/tests/unit/jest.setup.js'], // Apontando para o arquivo de setup
};
