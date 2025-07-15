const { MenuItem } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  async create(req, res) {
    try {
      const {
        name,
        icon,
        type,
        pathOrAction,
        highlight,
        position,
        minUserTypeId
      } = req.body;

      const item = await MenuItem.create({
        name,
        icon,
        type,
        pathOrAction,
        highlight,
        position,
        minUserTypeId
      });

      res.status(201).json(item);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar item de menu.' });
    }
  },

  async listAllFilter(req, res) {
    try {
      const { userTypeId, profileId } = req.user;

      const items = await MenuItem.findAll({
        where: {
          userTypeId: {
            [Op.lte]: userTypeId  
          },
          profileId: { 
            [Op.lte]: profileId 
          }               
        },
        order: [['position', 'ASC']]
      });

      res.json(items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao listar itens de menu.' });
    }
  },
  
  async listAll(req, res) {
      try {
        const items = await MenuItem.findAll({ order: [['position', 'ASC']] });
        res.json(items);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar itens de menu.' });
      }
    },

  async update(req, res) {
      try {
        const { id } = req.params;

        const item = await MenuItem.findByPk(id);
        if (!item) {
          return res.status(404).json({ error: 'Item de menu não encontrado.' });
        }

        const {
          name,
          icon,
          type,
          pathOrAction,
          highlight,
          position,
          userTypeId
        } = req.body;

        item.name = name ?? item.name;
        item.icon = icon ?? item.icon;
        item.type = type ?? item.type;
        item.pathOrAction = pathOrAction ?? item.pathOrAction;
        item.highlight = highlight ?? item.highlight;
        item.position = position ?? item.position;
        item.userTypeId = userTypeId ?? item.userTypeId;

        await item.save();

        res.json({ message: 'Item atualizado com sucesso.', item });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar item de menu.' });
      }
    },

  async delete (req, res) {
      try {
        const { id } = req.params;

        const item = await MenuItem.findByPk(id);
        if (!item) {
          return res.status(404).json({ error: 'Item de menu não encontrado.' });
        }

        await item.destroy();
        res.json({ message: 'Item de menu deletado com sucesso.' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar item de menu.' });
      }
    }
  };
