// src/controllers/sharedLinkController.js
const { SharedLink, Project } = require('../models');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  // Criar link de compartilhamento
  async create(req, res) {
    try {
      const { projectId, expiresAt, keyword, userId: userIdBody } = req.body;

      const loggedUserId = req.user.id;
      const loggedUserRole = req.user.role;

      // Dono do token por padrão
      let userIdToUse = loggedUserId;

      // Se for um owner e estiver passando userId, usar o informado
      if (userIdBody && loggedUserRole === 'owner') {
        userIdToUse = userIdBody;
      }

      // Verifica se o projeto pertence ao userIdToUse (seja owner ou não)
      const project = await Project.findOne({ where: { id: projectId, userId: userIdToUse } });
      if (!project) {
        return res.status(403).json({ error: 'Projeto não encontrado ou sem permissão.' });
      }

      const linkCode = uuidv4().replace(/-/g, '').slice(0, 12); // Código curto

      const sharedLink = await SharedLink.create({
        projectId,
        userId: userIdToUse,
        linkCode,
        keyword,
        expiresAt: expiresAt || null,
        isActive: true
      });

      await project.update({ codeLink: linkCode });

      res.status(201).json({
        message: 'Link de compartilhamento criado com sucesso.',
        sharedLink
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar link de compartilhamento.' });
    }
  },

  async getAll(req, res) {
    try {

      const link = await SharedLink.findAll({ where: { isActive: true } });

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
  },

  async getKeywordByGuid(req, res) {
    try {
      const { guid } = req.params;

      const link = await SharedLink.findOne({
        where: {
          guid,
          isActive: true
        }
      });

      if (!link) {
        return res.status(404).json({ error: 'Link inválido ou inativo.' });
      }

      console.log('Agora:', new Date());
      console.log('expiresAt:', new Date(link.expiresAt));

      if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
        return res.status(410).json({ error: 'Link expirado.' });
      }

      res.json({ keyword: link.keyword });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar keyword pelo GUID.' });
    }
  },

  async updateExpiresAt(req, res) {
    try {
      const { guid } = req.params;
      const { expiresAt } = req.body;

      if (!expiresAt) {
        return res.status(400).json({ error: 'O campo expiresAt é obrigatório.' });
      }

      const link = await SharedLink.findOne({ where: { guid } });

      if (!link) {
        return res.status(404).json({ error: 'Link de compartilhamento não encontrado.' });
      }

      const loggedUserId = req.user.id;
      const loggedUserRole = req.user.role;

      if (link.userId !== loggedUserId && loggedUserRole !== 'owner') {
        return res.status(403).json({ error: 'Sem permissão para atualizar este link.' });
      }

      await link.update({ expiresAt });

      return res.json({
        message: 'Data de expiração atualizada com sucesso.',
        link
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao atualizar data de expiração do link.' });
    }
  },


};
