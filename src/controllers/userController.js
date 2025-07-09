const { User } = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

module.exports = {
  // REGISTRAR NOVO USUÁRIO DA EMPRESA
  async register(req, res) {
    try {
      const { email, password, displayName, photoUrl = null } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        email,
        password: hashedPassword,
        displayName,
        photoUrl,
        userTypeId: 2,
        profileId: 2,
        companyGuid: req.user.guid
      });

      return res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: {
          id: newUser.id,
          guid: newUser.guid,
          email: newUser.email,
          displayName: newUser.displayName,
          photoUrl: newUser.photoUrl,
          userTypeId: newUser.userTypeId,
          profileId: newUser.profileId,
          companyGuid: newUser.companyGuid
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
  },

  // LISTAR USUÁRIOS VINCULADOS AO MESMO companyGuid (com filtros e paginação)
  async listAllByCompany(req, res) {
    try {
      const companyGuid = req.user.guid;
      const { page = 1, limit = 10, search = '' } = req.query;
      const offset = (page - 1) * limit;

      const where = {
        companyGuid,
        [Op.or]: [
          { email: { [Op.like]: `%${search}%` } },
          { displayName: { [Op.like]: `%${search}%` } }
        ]
      };

      const { count, rows } = await User.findAndCountAll({
        where,
        attributes: ['id', 'guid', 'email', 'displayName', 'photoUrl'],
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [['createdAt', 'DESC']]
      });

      return res.json({
        total: count,
        page: parseInt(page),
        perPage: parseInt(limit),
        users: rows
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar usuários da empresa' });
    }
  },

  // ATUALIZAR USUÁRIO DA EMPRESA
  async update(req, res) {
    try {
      const { guid } = req.params;
      const { displayName, photoUrl } = req.body;

      const user = await User.findOne({
        where: { guid, companyGuid: req.user.guid }
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado ou sem permissão' });
      }

      user.displayName = displayName ?? user.displayName;
      user.photoUrl = photoUrl ?? user.photoUrl;

      await user.save();

      return res.json({ message: 'Usuário atualizado com sucesso', user });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  },

  // DELETAR USUÁRIO DA EMPRESA
  async delete(req, res) {
    try {
      const { guid } = req.params;

      const user = await User.findOne({
        where: { guid, companyGuid: req.user.guid }
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado ou sem permissão' });
      }

      await user.destroy();

      return res.json({ message: 'Usuário deletado com sucesso' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
  }
};
