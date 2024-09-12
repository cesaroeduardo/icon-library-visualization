import { mount } from '@vue/test-utils';
import IconCard from '@/components/IconCard.vue'; 
import iconsData from '@/icons.json';

describe('IconCard.vue - Test all icons from icons.json', () => {
  let wrapper;

  beforeEach(() => {
    // Mock do fetch
    global.fetch = jest.fn((url) => {
      if (url.includes('/assets/svg-raw/')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('<svg fill="#ffffff" width="100" height="100"></svg>'),
        });
      }
      return Promise.reject(new Error('Not Found'));
    });

    // Mock do window.URL.createObjectURL
    window.URL.createObjectURL = jest.fn(() => 'blob:mock-url');

    // Mock do document.createElement para criar links de download
    document.createElement = jest.fn((element) => {
      if (element === 'a') {
        return {
          href: '',
          download: '',
          click: jest.fn(),
          setAttribute: jest.fn(),
          remove: jest.fn(),
        };
      } else {
        console.log(`Mocking element creation for: ${element}`);
        return {}; // Retornar um mock vazio para outros tipos de elementos
      }
    }); 
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  iconsData.forEach((icon) => {
    it(`should render the SVG icon correctly for ${icon.name}`, async () => {
      wrapper = mount(IconCard, {
        propsData: {
          name: icon.name,
          icon: icon.icon,
          color: '#000000',
          size: 'text-base', // Tamanho padrão para este teste
          downloadFormat: 'svg',
        },
        stubs: {
          transition: false,
          'transition-group': false,
        },
      });
    
      // Verifique se o componente foi montado corretamente
      expect(wrapper.exists()).toBe(true);
    });
  });
});
