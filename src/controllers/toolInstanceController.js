// src/controllers/toolInstanceController.js
const { ToolInstance, Project } = require('../models');

module.exports = {
  async index(req, res) {
  try {
    const { projectId } = req.params;

    // Se foi informado um ID de projeto
    if (projectId) {
      const project = await Project.findOne({
        where: { id: projectId, userId: req.user.id }
      });

      if (!project) {
        return res.status(403).json({ error: 'Projeto não encontrado ou sem permissão.' });
      }

      const tools = await ToolInstance.findAll({ where: { projectId } });
      return res.json(tools);
    }

    // Caso nenhum projectId tenha sido passado, buscar todos os projetos do usuário
    const userProjects = await Project.findAll({
      where: { userId: req.user.id },
      attributes: ['id']
    });

    const projectIds = userProjects.map(p => p.id);

    const tools = await ToolInstance.findAll({
      where: { projectId: projectIds }
    });

    return res.json(tools);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao listar ferramentas.' });
  }
},


  async create(req, res) {
    try {
      const { projectId, toolType, title, description, dataUrl, order } = req.body;

      const project = await Project.findOne({
        where: { id: projectId, userId: req.user.id }
      });

      if (!project) {
        return res.status(403).json({ error: 'Projeto não encontrado ou sem permissão.' });
      }

      const tool = await ToolInstance.create({
        projectId,
        toolType,
        title,
        description,
        dataUrl,
        order
      });

      res.status(201).json(tool);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar ferramenta.' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const tool = await ToolInstance.findByPk(id);

      if (!tool) {
        return res.status(404).json({ error: 'Ferramenta não encontrada.' });
      }

      const project = await Project.findOne({
        where: { id: tool.projectId, userId: req.user.id }
      });

      if (!project) {
        return res.status(403).json({ error: 'Sem permissão para alterar esta ferramenta.' });
      }

      const { toolType, title, description, dataUrl, order } = req.body;

      await tool.update({ toolType, title, description, dataUrl, order });

      res.json(tool);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao atualizar ferramenta.' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const tool = await ToolInstance.findByPk(id);

      if (!tool) {
        return res.status(404).json({ error: 'Ferramenta não encontrada.' });
      }

      const project = await Project.findOne({
        where: { id: tool.projectId, userId: req.user.id }
      });

      if (!project) {
        return res.status(403).json({ error: 'Sem permissão para excluir esta ferramenta.' });
      }

      await tool.destroy();
      res.json({ message: 'Ferramenta removida com sucesso.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao remover ferramenta.' });
    }
  }
};
