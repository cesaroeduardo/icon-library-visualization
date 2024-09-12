const fs = require('fs');
const path = require('path');

// Caminhos para a pasta SVG e para o arquivo JSON
const svgFolder = path.join(__dirname, 'svg-raw');
const jsonFilePath = path.join(__dirname, '../icons.json');

// Lê o arquivo JSON
fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Erro ao ler o arquivo JSON:`, err);
        return;
    }

    // Faz o parse do JSON para um array de objetos
    let jsonIcons;
    try {
        jsonIcons = JSON.parse(data);
    } catch (jsonError) {
        console.error(`Erro ao fazer o parse do JSON:`, jsonError);
        return;
    }

    // Obtém os "names" do JSON
    const jsonIconNames = jsonIcons.map(icon => icon.name);

    // Lê os arquivos da pasta svg-raw
    fs.readdir(svgFolder, (err, files) => {
        if (err) {
            console.error('Erro ao ler a pasta svg-raw:', err);
            return;
        }

        // Filtra os arquivos que têm extensão .svg e remove a extensão do nome
        const svgFiles = files
            .filter(file => path.extname(file) === '.svg')
            .map(file => path.basename(file, '.svg'));

        // Compara os nomes do JSON com os arquivos da pasta
        const missingFiles = jsonIconNames.filter(name => !svgFiles.includes(name));

        if (missingFiles.length > 0) {
            console.log('Os seguintes ícones estão no JSON, mas não têm um arquivo SVG correspondente:');
            missingFiles.forEach(file => console.log(file));
        } else {
            console.log('Todos os ícones do JSON têm um arquivo SVG correspondente.');
        }
    });
});
