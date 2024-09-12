import { config } from '@vue/test-utils';

// Desativar transições globalmente para evitar problemas de manipulação de DOM
config.global.stubs = {
  transition: false,
  'transition-group': false,
};
