// src/controllers/projectsController.js
const { Project, ToolInstance } = require('../models');

module.exports = {
  async index(req, res) {
    try {
      const projects = await Project.findAll({
        where: {
          userId: req.user.id,
          isContracted: false
        }
      });
      res.json(projects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao listar projetos.' });
    }
  },

  async show(req, res) {
    try {
      const project = await Project.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id,
          isContracted: false
        }
      });

      if (!project) {
        return res.status(404).json({ error: 'Projeto não encontrado.' });
      }

      res.json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar projeto.' });
    }
  },

  async showAll(req, res) {
    try {
      const projects = await Project.findAll({
        where: {
          userId: req.user.id,
        },
        include: [        
        {
            model: ToolInstance,
            attributes: ['id', 'guid', 'toolType', 'title', 'description', 'dataUrl', 'orderNumber', 'routePage', 'codeTool'],
            required: false
        }
    ]
      });
      res.json(projects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao listar projetos.' });
    }
  },

  async create(req, res) {
    try {
      const { name, description } = req.body;
      const newProject = await Project.create({
        name,
        description,
        userId: req.user.id,
        isContracted: false
      });

      res.status(201).json(newProject);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar projeto.' });
    }
  },

  async update(req, res) {
    try {
      const { name, description } = req.body;
      const project = await Project.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id,
          isContracted: false
        }
      });

      if (!project) {
        return res.status(404).json({ error: 'Projeto não encontrado.' });
      }

      await project.update({ name, description });
      res.json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao atualizar projeto.' });
    }
  },

  async delete(req, res) {
    try {
      const project = await Project.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id,
          isContracted: false
        }
      });

      if (!project) {
        return res.status(404).json({ error: 'Projeto não encontrado.' });
      }

      await project.destroy();
      res.json({ message: 'Projeto removido com sucesso.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao remover projeto.' });
    }
  }
};
