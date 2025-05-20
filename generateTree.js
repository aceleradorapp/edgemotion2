const fs = require('fs');
const path = require('path');

const ignoreList = [
  'node_modules', '.git', 'migrations', '.vscode', 'dist', 'build', '.bin',
  'debug', 'ms', 'node', 'accepts', 'anymatch', 'aws-ssl-profiles', 'balanced-match'
];

function generateTree(dir, indent = '') {
  let result = '';
  const items = fs.readdirSync(dir, { withFileTypes: true });

  items.forEach(item => {
    if (ignoreList.includes(item.name)) return;

    const fullPath = path.join(dir, item.name);
    const isHidden = item.name.startsWith('.');

    if (isHidden) return;

    if (item.isDirectory()) {
      result += `${indent}+-- ${item.name}\n`;
      result += generateTree(fullPath, indent + '|   ');
    } else {
      result += `${indent}|-- ${item.name}\n`;
    }
  });

  return result;
}

// Caminho da raiz (pasta atual)
const basePath = process.cwd();

// Gera a árvore e salva no arquivo
const tree = generateTree(basePath);
fs.writeFileSync('estrutura.txt', tree, 'utf8');

console.log('Estrutura salva em estrutura.txt');
