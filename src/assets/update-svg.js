const fs = require('fs');
const path = require('path');

// Caminho simplificado para a pasta svg-raw, já que está na mesma pasta que o script
const svgFolder = path.join(__dirname, 'svg-raw');

// Função para adicionar atributos `fill` e `width/height` ao SVG
function processSVG(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Erro ao ler o arquivo ${filePath}:`, err);
            return;
        }

        let modified = false;

        // Verifica se já tem o atributo 'fill'
        if (!data.includes('fill=')) {
            data = data.replace(/<path/g, '<path fill="currentColor"');
            modified = true;
        }

        // Verifica se já tem os atributos width e height
        if (!data.includes('width=') || !data.includes('height=')) {
            data = data.replace(/<svg/, '<svg width="24" height="24"');
            modified = true;
        }

        // Escreve o arquivo atualizado apenas se foi modificado
        if (modified) {
            fs.writeFile(filePath, data, 'utf8', (err) => {
                if (err) {
                    console.error(`Erro ao escrever o arquivo ${filePath}:`, err);
                } else {
                    console.log(`Arquivo ${filePath} atualizado com sucesso!`);
                }
            });
        } else {
            console.log(`Arquivo ${filePath} já está correto. Nenhuma modificação necessária.`);
        }
    });
}

// Lê todos os arquivos da pasta SVG
fs.readdir(svgFolder, (err, files) => {
    if (err) {
        console.error('Erro ao ler a pasta de SVGs:', err);
        return;
    }

    // Filtra os arquivos que têm extensão .svg
    files.filter(file => path.extname(file) === '.svg').forEach(file => {
        const filePath = path.join(svgFolder, file);
        processSVG(filePath);
    });
});
