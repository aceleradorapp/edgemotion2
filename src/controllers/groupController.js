// src/controllers/groupController.js
const { Group, Project } = require('../models');

module.exports = {
  async create(req, res) {
    try {
      const { projectId, name, description } = req.body;

      const project = await Project.findOne({ where: { id: projectId, userId: req.user.id } });
      if (!project) {
        return res.status(403).json({ error: 'Projeto não encontrado ou sem permissão.' });
      }

      const group = await Group.create({ projectId, name, description });
      res.status(201).json(group);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar grupo.' });
    }
  },

  async listByProject(req, res) {
    try {
      const { projectId } = req.params;

      const project = await Project.findOne({ where: { id: projectId, userId: req.user.id } });
      if (!project) {
        return res.status(403).json({ error: 'Projeto não encontrado ou sem permissão.' });
      }

      const groups = await Group.findAll({ where: { projectId } });
      res.json(groups);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao listar grupos.' });
    }
  }
};
