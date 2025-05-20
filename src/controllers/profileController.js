const { Profile } = require('../models');

module.exports = {
  async index(req, res) {
    try {
      const profiles = await Profile.findAll();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar os perfis.' });
    }
  },

  async show(req, res) {
    try {
      const profile = await Profile.findByPk(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: 'Perfil não encontrado.' });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar perfil.' });
    }
  },

  async create(req, res) {
    try {
      const { code,  name, description } = req.body;
      const newProfile = await Profile.create({ code, name, description });
      res.status(201).json(newProfile);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar perfil.' });
    }
  },

  async update(req, res) {
    try {
      const { code, name, description } = req.body;
      const profile = await Profile.findByPk(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: 'Perfil não encontrado.' });
      }

      await profile.update({ code, name, description });
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar perfil.' });
    }
  },

  async delete(req, res) {
    try {
      const profile = await Profile.findByPk(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: 'Perfil não encontrado.' });
      }

      await profile.destroy();
      res.json({ message: 'Perfil removido com sucesso.' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao remover perfil.' });
    }
  }
};
