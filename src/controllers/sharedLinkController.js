// src/controllers/sharedLinkController.js
const { SharedLink, Project } = require('../models');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  // Criar link de compartilhamento
  async create(req, res) {
    try {
      const { projectId, expiresAt } = req.body;

      const project = await Project.findOne({ where: { id: projectId, userId: req.user.id } });
      if (!project) {
        return res.status(403).json({ error: 'Projeto não encontrado ou sem permissão.' });
      }

      const linkCode = uuidv4().replace(/-/g, '').slice(0, 12); // Código curto

      const sharedLink = await SharedLink.create({
        projectId,
        userId: req.user.id,
        linkCode,
        expiresAt: expiresAt || null,
        isActive: true
      });

      res.status(201).json({
        message: 'Link de compartilhamento criado com sucesso.',
        sharedLink
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar link de compartilhamento.' });
    }
  },

  // Acessar link publicamente
  async getByCode(req, res) {
    try {
      const { code } = req.params;

      const link = await SharedLink.findOne({ where: { linkCode: code, isActive: true } });

      if (!link) {
        return res.status(404).json({ error: 'Link inválido ou inativo.' });
      }

      if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
        return res.status(410).json({ error: 'Link expirado.' });
      }

      res.json(link);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar link.' });
    }
  }
};
