const ASSETSTYPE =  ['css']
const BASESVGPATH = './src/assets/svg-raw'
const FONTTYPES =  ['woff2']
const FONTHEIGHT = 1000
const JSONIdent = 2
const OUTPUTDIR = './src/assets/icon-fonts/new'
const TEMPLATE = {
  css: './templates/css.hbs'
}

const svgInputDir = (folder) => `${BASESVGPATH}/${folder}`

/** @type {import('fantasticon').RunnerOptions[]} */
export default [
  {
    assetTypes: ASSETSTYPE,
    fontTypes: FONTTYPES,
    fontHeight: FONTHEIGHT,
    fontsUrl: '',
    formatOptions: {
      json: {
        indent: JSONIdent
      }
    },
    inputDir: svgInputDir('ai'),
    name: 'azionicons',
    normalize: true,
    outputDir: OUTPUTDIR,
    prefix: 'ai',
    tag: '',
    templates: {
      css: TEMPLATE.css
    }
  },
  {
    assetTypes: ASSETSTYPE,
    fontTypes: FONTTYPES,
    fontHeight: FONTHEIGHT,
    fontsUrl: '',
    formatOptions: {
      json: {
        indent: JSONIdent
      }
    },
    inputDir: svgInputDir('pi'),
    name: 'primeicons',
    normalize: true,
    outputDir: OUTPUTDIR,
    prefix: 'pi',
    tag: '',
    templates: {
      css: TEMPLATE.css
    }
  }
]