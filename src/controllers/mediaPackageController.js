require('dotenv').config();
const path = require('path');
const extractAndMoveRar = require('../utils/unrarAndMove');
const { MediaPackage, User } = require('../models');

class MediaPackageController {
  upload = async (req, res) => {
    try {
      const { name, description } = req.body;
      const userId = req.user.id; // capturado do token JWT
      const rarFile = req.file;

      if (!rarFile) {
        return res.status(400).json({ error: 'Arquivo .rar não foi enviado.' });
      }

      if (!name) {
        return res.status(400).json({ error: 'Nome da mídia é obrigatório.' });
      }

      const sourcePath = rarFile.path;
      const extractedPath = await extractAndMoveRar(sourcePath, name);

      const media = await MediaPackage.create({
        name,
        description,
        path: extractedPath.replace(/\\/g, '/'), // padrão unix
        userId,
      });

      return res.status(201).json({ message: 'Mídia enviada com sucesso.', media });
    } catch (err) {
      console.error('Erro ao enviar mídia:', err);
      return res.status(500).json({ error: 'Erro ao processar o upload.' });
    }
  };
}

module.exports = new MediaPackageController();
