const fs = require('fs');
const path = require('path');

// Caminho para a pasta svg-raw
const svgFolder = path.join(__dirname, 'svg-raw');

// Função para verificar se o arquivo SVG contém a propriedade "stroke"
function checkForStroke(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Erro ao ler o arquivo ${filePath}:`, err);
            return;
        }

        // Verifica se o arquivo contém a propriedade "stroke"
        if (data.includes('stroke=')) {
            console.log(`O arquivo ${path.basename(filePath)} contém a propriedade "stroke".`);
        }
    });
}

// Lê todos os arquivos da pasta svg-raw
fs.readdir(svgFolder, (err, files) => {
    if (err) {
        console.error('Erro ao ler a pasta de SVGs:', err);
        return;
    }

    // Filtra os arquivos que têm extensão .svg
    files.filter(file => path.extname(file) === '.svg').forEach(file => {
        const filePath = path.join(svgFolder, file);
        checkForStroke(filePath);
    });
});
