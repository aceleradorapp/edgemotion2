const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const authenticateToken = require('../middlewares/authMiddleware');
const { User } = require('../models');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);

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
