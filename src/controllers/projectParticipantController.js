// src/controllers/projectParticipantController.js
const { ProjectParticipant, Project } = require('../models');

module.exports = {
  // Criar participante
  async create(req, res) {
    try {
      const { projectId, userId, guestEmail } = req.body;

      const project = await Project.findOne({
        where: { id: projectId, userId: req.user.id }
      });

      if (!project) {
        return res.status(403).json({ error: 'Projeto não encontrado ou sem permissão.' });
      }

      const participant = await ProjectParticipant.create({
        projectId,
        userId: userId || null,
        guestEmail: guestEmail || null,
        tokenAccess: guestEmail ? Math.random().toString(36).substring(2, 12) : null,
        status: 'pendente'
      });

      res.status(201).json(participant);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao adicionar participante.' });
    }
  },

  // Listar participantes de um projeto
  async listByProject(req, res) {
    try {
      const { projectId } = req.params;

      const project = await Project.findOne({
        where: { id: projectId, userId: req.user.id }
      });

      if (!project) {
        return res.status(403).json({ error: 'Projeto não encontrado ou sem permissão.' });
      }

      const participants = await ProjectParticipant.findAll({ where: { projectId } });
      res.json(participants);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao listar participantes.' });
    }
  },

  // Atualizar status
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const participant = await ProjectParticipant.findByPk(id);
      if (!participant) {
        return res.status(404).json({ error: 'Participante não encontrado.' });
      }

      await participant.update({ status });
      res.json(participant);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao atualizar status.' });
    }
  },

  // Buscar participante por token de acesso (público)
  async getByToken(req, res) {
    try {
      const { token } = req.params;

      const participant = await ProjectParticipant.findOne({ where: { tokenAccess: token } });

      if (!participant) {
        return res.status(404).json({ error: 'Token inválido ou expirado.' });
      }

      res.json(participant);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar por token.' });
    }
  }
};
