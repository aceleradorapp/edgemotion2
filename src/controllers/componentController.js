// src/controllers/componentController.js
const { Component, ComponentCategory } = require('../models');

module.exports = {
    // GET /api/components
    async index(req, res) {
    try {
      const comps = await Component.findAll({
        include: {
          model: ComponentCategory,
          as: 'Category',            // 👈 usar o alias exato
          attributes: ['id', 'name'] // (opcional) para não trazer tudo
        }
      });
      res.json(comps);
    } catch (err) {
      console.error('Erro no index:', err);
      res.status(500).json({ error: 'Erro ao listar componentes.' });
    }
  },

    // GET /api/components/:id
    async show(req, res) {
    try {
      const comp = await Component.findByPk(req.params.id, {
        include: {
          model: ComponentCategory,
          as: 'Category'
        }
      });
      if (!comp) return res.status(404).json({ error: 'Componente não encontrado.' });
      res.json(comp);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar componente.' });
    }
  },

    // POST /api/components
    async create(req, res) {
        try {
            const {
                identifier, title, icon,
                category, index, route, userTypeId, categoryId
            } = req.body;

            // opcional: validar se categoryId existe
            const newComp = await Component.create({
                identifier, title, icon, category,
                index, route, userTypeId, categoryId
            });

            res.status(201).json(newComp);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao criar componente.' });
        }
    },

    // PUT /api/components/:id
    async update(req, res) {
        try {
            const comp = await Component.findByPk(req.params.id);
            if (!comp) return res.status(404).json({ error: 'Componente não encontrado.' });

            const {
                identifier, title, icon,
                category, index, route, userTypeId, categoryId
            } = req.body;

            await comp.update({
                identifier, title, icon,
                category, index, route, userTypeId, categoryId
            });
            res.json(comp);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao atualizar componente.' });
        }
    },

    // DELETE /api/components/:id
    async delete(req, res) {
        try {
            const comp = await Component.findByPk(req.params.id);
            if (!comp) return res.status(404).json({ error: 'Componente não encontrado.' });

            await comp.destroy();
            res.json({ message: 'Componente removido com sucesso.' });
        } catch (err) {
            res.status(500).json({ error: 'Erro ao remover componente.' });
        }
    },

    async map(req, res) {
        try {
            const categories = await require('../models').ComponentCategory.findAll({
                include: ['Components'], // alias usado no associate
                order: [
                    ['index', 'ASC'],
                    [{ model: require('../models').Component, as: 'Components' }, 'index', 'ASC']
                ]
            });

            const result = {};

            for (const cat of categories) {
                result[cat.name] = cat.Components.map((comp) => ({
                    id: comp.id,
                    identifier: comp.identifier,
                    title: comp.title,
                    icon: comp.icon,
                    category: comp.category,
                    index: comp.index,
                    rota: comp.route,
                    usertypeId: comp.userTypeId,
                }));
            }

            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao gerar o mapa de componentes.' });
        }
    }
};
