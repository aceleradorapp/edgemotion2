// src/controllers/userTypeController.js
const { UserType } = require('../models');

module.exports = {
  async index(req, res) {
    try {
      const userTypes = await UserType.findAll();
      res.json(userTypes);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar os tipos de usuário.' });
    }
  },

  async show(req, res) {
    try {
      const userType = await UserType.findByPk(req.params.id);
      if (!userType) {
        return res.status(404).json({ error: 'Tipo de usuário não encontrado.' });
      }
      res.json(userType);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar tipo de usuário.' });
    }
  },

  async create(req, res) {
    try {
      const { code, name, description } = req.body;
      const newUserType = await UserType.create({ code, name, description });
      res.status(201).json(newUserType);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar tipo de usuário.' });
    }
  },

  async update(req, res) {
    try {
      const { code, name, description } = req.body;
      const userType = await UserType.findByPk(req.params.id);
      if (!userType) {
        return res.status(404).json({ error: 'Tipo de usuário não encontrado.' });
      }

      await userType.update({ code, name, description });
      res.json(userType);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar tipo de usuário.' });
    }
  },

  async delete(req, res) {
    try {
      const userType = await UserType.findByPk(req.params.id);
      if (!userType) {
        return res.status(404).json({ error: 'Tipo de usuário não encontrado.' });
      }

      await userType.destroy();
      res.json({ message: 'Tipo de usuário removido com sucesso.' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao remover tipo de usuário.' });
    }
  }
};
