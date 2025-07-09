// src/controllers/componentCategoryController.js
const { ComponentCategory, Component } = require('../models');

module.exports = {
  // GET /api/component-categories
  async index(req, res) {
    try {
      const categories = await ComponentCategory.findAll({
        include: {
          model: Component,
          as: 'Components' // 👈 uso do alias correto
        }
      });
      res.json(categories);
    } catch (err) {
      console.error('Erro no index de categorias:', err);
      res.status(500).json({ error: 'Erro ao listar categorias.' });
    }
  },

  // GET /api/component-categories/listCategory
  async listCategory(req, res) {
    try {
      const categories = await ComponentCategory.findAll(); // Removido o 'include'
      res.json(categories);
    } catch (err) {
      console.error('Erro no index de categorias:', err);
      res.status(500).json({ error: 'Erro ao listar categorias.' });
    }
  },

  // GET /api/component-categories/:id
  async show(req, res) {
    try {
      const category = await ComponentCategory.findByPk(req.params.id, {
        include: {
          model: Component,
          as: 'Components' // 👈 uso do alias correto
        }
      });
      if (!category) {
        return res.status(404).json({ error: 'Categoria não encontrada.' });
      }
      res.json(category);
    } catch (err) {
      console.error('Erro no show de categoria:', err);
      res.status(500).json({ error: 'Erro ao buscar categoria.' });
    }
  },

  // POST /api/component-categories
  async create(req, res) {
    try {
      const { name } = req.body;
      const newCat = await ComponentCategory.create({ name });
      res.status(201).json(newCat);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao criar categoria.' });
    }
  },

  // PUT /api/component-categories/:id
  async update(req, res) {
    try {
      const { name } = req.body;
      const category = await ComponentCategory.findByPk(req.params.id);
      if (!category) return res.status(404).json({ error: 'Categoria não encontrada.' });

      await category.update({ name });
      res.json(category);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao atualizar categoria.' });
    }
  },

  // DELETE /api/component-categories/:id
  async delete(req, res) {
    try {
      const category = await ComponentCategory.findByPk(req.params.id);
      if (!category) return res.status(404).json({ error: 'Categoria não encontrada.' });

      await category.destroy();
      res.json({ message: 'Categoria removida com sucesso.' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao remover categoria.' });
    }
  }
};
