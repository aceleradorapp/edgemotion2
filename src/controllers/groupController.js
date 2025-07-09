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
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      // Busca o grupo com join no projeto do usuário autenticado
      const group = await Group.findOne({
        where: { id },
        include: {
          model: Project,
          where: { userId: req.user.id },
          attributes: [] // não traz os dados do projeto
        }
      });

      if (!group) {
        return res.status(403).json({ error: 'Grupo não encontrado ou sem permissão.' });
      }

      group.name = name ?? group.name;
      group.description = description ?? group.description;
      await group.save();

      res.json({ message: 'Grupo atualizado com sucesso.', group });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao atualizar grupo.' });
    }
  },

  async delete(req, res) {
  try {
    const { id } = req.params;

    const group = await Group.findOne({
      where: { id },
      include: {
        model: Project,
        where: { userId: req.user.id },
        attributes: []
      }
    });

    if (!group) {
      return res.status(403).json({ error: 'Grupo não encontrado ou sem permissão.' });
    }

    await group.destroy();
    res.json({ message: 'Grupo deletado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar grupo.' });
  }
}


};
