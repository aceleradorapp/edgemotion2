// src/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const authenticateToken = require('../middlewares/authMiddleware');
const { User, Project  } = require('../models');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);


// Novo endpoint para salvar JSON de ferramenta
router.post('/tool-json', authenticateToken, async (req, res) => {
  try {
    const { toolId, jsonData } = req.body;

    if (!toolId || !jsonData) {
      return res.status(400).json({ error: 'Parâmetros toolId e jsonData são obrigatórios.' });
    }

    const { ToolInstance, Project } = require('../models');

    // Busca a ferramenta e o projeto
    const tool = await ToolInstance.findByPk(toolId);
    if (!tool) return res.status(404).json({ error: 'Ferramenta não encontrada.' });

    const project = await Project.findByPk(tool.projectId);
    if (!project || project.userId !== req.user.id) {
      return res.status(403).json({ error: 'Sem permissão para salvar dados dessa ferramenta.' });
    }

    // Caminho: uploads/tool/{userId}/{guid}.json
    const dirPath = path.join(__dirname, `../../uploads/tool/${req.user.id}`);
    const fileName = `${tool.guid}.json`;
    const filePath = path.join(dirPath, fileName);

    // Cria a pasta se não existir
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Salva o JSON no arquivo
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf8');

    // Atualiza a ferramenta com o caminho do arquivo
    const dataUrl = `/uploads/tool/${req.user.id}/${fileName}`;
    await tool.update({ dataUrl });

    res.status(201).json({
      message: 'JSON salvo com sucesso.',
      dataUrl
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar JSON da ferramenta.' });
  }
});


router.post('/:type', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { type } = req.params;
    const allowedTypes = ['user', 'project', 'tool', 'group'];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ error: 'Tipo de upload inválido.' });
    }

    const imageUrl = `/uploads/${type}/${req.file.filename}`;

    // Se for user, salva no banco
    if (type === 'user') {
      const user = await User.findByPk(req.user.id);
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

      await user.update({ photoUrl: imageUrl });
    }

    // 👉 Persistir no projeto
    if (type === 'project') {
      const projectId = req.query.projectId || req.body.projectId;
      if (!projectId) {
        return res.status(400).json({ error: 'Parâmetro projectId é obrigatório.' });
      }

      const project = await Project.findOne({
        where: { id: projectId, userId: req.user.id }
      });
      if (!project) {
        return res.status(404).json({ error: 'Projeto não encontrado ou sem permissão.' });
      }

      await project.update({ imageUrl });
    }

    res.status(201).json({
      message: 'Upload realizado com sucesso.',
      type,
      fileUrl: imageUrl
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao realizar upload.' });
  }
});

// Listar imagens do usuário (baseado no ID)
router.get('/user/images', authenticateToken, async (req, res) => {
  try {
    const dirPath = path.join(__dirname, '../../uploads/user');
    const files = await readdir(dirPath);

    // Filtro opcional: apenas arquivos que começam com o ID do usuário (se prefixar futuramente)
    const urls = files.map(name => ({
      name,
      url: `/uploads/users/${name}`
    }));

    res.json({ images: urls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar imagens.' });
  }
});

// Deletar imagem específica
router.delete('/user/images/:filename', authenticateToken, async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../uploads/user', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Imagem não encontrada.' });
    }

    await unlink(filePath);
    res.json({ message: 'Imagem deletada com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar imagem.' });
  }
});


module.exports = router;
