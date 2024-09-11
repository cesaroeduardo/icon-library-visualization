import { mount } from '@vue/test-utils';
import IconCard from '@/components/IconCard.vue';  // Atualize o caminho para o seu componente
import iconsData from '@/icons.json'; // Atualize o caminho para o seu JSON de ícones

describe('IconCard.vue - Test all icons from icons.json', () => {
  let wrapper;

  beforeEach(() => {
    // Mock do fetch
    global.fetch = jest.fn((url) => {
      if (url.includes('/assets/svg-raw/')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve('<svg fill="#ffffff"></svg>'),  // Um SVG de exemplo
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
      }
      return {};
    });
  });  

  afterEach(() => {
    jest.clearAllMocks();
  });

  iconsData.forEach((icon) => {
    it(`should download the SVG icon correctly for ${icon.name}`, async () => {
      wrapper = mount(IconCard, {
        propsData: {
          name: icon.name,
          icon: icon.icon,
          color: '#000000',
          size: 'text-base',
          downloadFormat: 'svg',
        },
      });      

      const downloadSpy = jest.spyOn(wrapper.vm, 'downloadSVG');
      const linkClickSpy = jest.spyOn(document, 'createElement');
      
      // Executa o método de download do SVG
      await wrapper.vm.downloadSVG();

      // Verifica se o método de download foi chamado
      expect(downloadSpy).toHaveBeenCalled();
      
      // Verifica se o fetch foi chamado com o caminho correto
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining(`/assets/svg-raw/${icon.name}.svg`));
      
      // Verifica se o link foi criado para download
      expect(linkClickSpy).toHaveBeenCalledWith('a');

      // Verifica se a URL para download foi criada corretamente
      expect(window.URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    });
  });
});
