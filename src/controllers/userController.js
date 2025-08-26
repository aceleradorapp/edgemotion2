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
        companyGuid: req.user.guid,
        emailVerifiedAt: new Date()
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

      if (req.user.role === 'owner') {
        return module.exports.listAllUsers(req, res);
      }
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

  async getById(req, res) {
    try {
      const { id } = req.params;
      const companyGuid = req.user.guid;

      const user = await User.findOne({
        where: {
          id
        },
        attributes: ['id', 'guid', 'email', 'displayName', 'photoUrl', 'userTypeId', 'profileId']
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado ou sem permissão' });
      }

      return res.json({ user });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar usuário pelo ID' });
    }
  },

  // LISTAR TODOS OS USUÁRIOS (admin - com filtros e paginação)
  async listAllUsers(req, res) {
    try {
      const { page = 1, limit = 10, search = '', companyGuid = null } = req.query;
      const offset = (page - 1) * limit;

      const where = {
        [Op.or]: [
          { email: { [Op.like]: `%${search}%` } },
          { displayName: { [Op.like]: `%${search}%` } }
        ]
      };

      if (companyGuid) {
        where.companyGuid = companyGuid;
      }

      const { count, rows } = await User.findAndCountAll({
        where,
        attributes: ['id', 'guid', 'email', 'displayName', 'photoUrl', 'companyGuid'],
        include: [
          {
            model: require('../models').UserType,
            attributes: ['id', 'name', 'code']
          },
          {
            model: require('../models').Profile,
            attributes: ['id', 'name', 'code']
          }
        ],
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
      return res.status(500).json({ error: 'Erro ao listar usuários' });
    }
  },


  // ATUALIZAR USUÁRIO DA EMPRESA
  async update(req, res) {
    try {
      const { guid } = req.params;
      const {
        displayName,
        photoUrl,
        userTypeId,
        profileId
        // companyGuid não é permitido alterar
      } = req.body;

      const whereClause = req.user.role === 'owner'
        ? { guid }
        : { guid, companyGuid: req.user.guid };

      const user = await User.findOne({
        where: whereClause 
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado ou sem permissão' });
      }

      // Atualiza somente os campos permitidos
      if (displayName !== undefined) user.displayName = displayName;
      if (photoUrl !== undefined) user.photoUrl = photoUrl;
      if (userTypeId !== undefined) user.userTypeId = userTypeId;
      if (profileId !== undefined) user.profileId = profileId;

      await user.save();

      return res.json({
        message: 'Usuário atualizado com sucesso',
        user
      });

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
  },

  // DELETAR USUÁRIO PELO ID (acesso global, sem restrição por empresa)
  async deleteById(req, res) {
    try {
      const { id } = req.params; console.log(id);

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      await user.destroy();

      return res.json({ message: 'Usuário deletado com sucesso' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
  }


};
