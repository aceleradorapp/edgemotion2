const fs = require('fs');
const path = require('path');

module.exports = {
    async listDirectories(req, res) {
        try {
            const packagesPath = path.join(__dirname, '..', '..', 'uploads', 'packages');

            const files = await fs.promises.readdir(packagesPath, { withFileTypes: true });

            const directories = files
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);

            return res.json(directories);
        } catch (error) {
            console.error('Erro ao listar pastas de pacotes:', error);
            return res.status(500).json({ message: 'Erro ao listar pastas' });
        }
    },

    async getPackageJson(req, res) {
        try {
            const { folderName } = req.body;

            if (!folderName) {
                return res.status(400).json({ message: 'Nome da pasta (folderName) é obrigatório' });
            }

            const packageJsonPath = path.join(__dirname, '..', '..', 'uploads', 'packages', folderName, 'package.json');

            if (!fs.existsSync(packageJsonPath)) {
                return res.status(404).json({ message: 'Arquivo package.json não encontrado' });
            }

            const content = await fs.promises.readFile(packageJsonPath, 'utf-8');
            const parsed = JSON.parse(content);

            return res.json(parsed);
        } catch (error) {
            console.error('Erro ao carregar package.json:', error);
            return res.status(500).json({ message: 'Erro ao carregar package.json' });
        }
    },

    async savePackageJson(req, res) {
        try {
            const { folderName, packageJson } = req.body;

            if (!folderName || !packageJson) {
                return res.status(400).json({ message: 'folderName e packageJson são obrigatórios' });
            }

            const folderPath = path.join(__dirname, '..', '..', 'uploads', 'packages', folderName);

            // Cria a pasta se não existir
            if (!fs.existsSync(folderPath)) {
                await fs.promises.mkdir(folderPath, { recursive: true });
            }

            const packageJsonPath = path.join(folderPath, 'package.json');

            // Salva o conteúdo formatado
            await fs.promises.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8');

            return res.status(200).json({ message: 'package.json salvo com sucesso' });
        } catch (error) {
            console.error('Erro ao salvar package.json:', error);
            return res.status(500).json({ message: 'Erro ao salvar package.json' });
        }
    }


};
