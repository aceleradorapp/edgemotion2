// src/controllers/aiPluginController.js
const { AiPlugin, User, UserPluginAccess } = require('../models');
const { Op } = require('sequelize');

// Middleware para verificar se o usuário é um 'owner' (proprietário)
const checkOwnerRole = (req, res, next) => {
  if (req.user && req.user.role === 'owner') {
    next();
  } else {
    res.status(403).json({ error: 'Acesso negado. Apenas proprietários podem realizar esta ação.' });
  }
};

module.exports = {

  // CADASTRAR UM NOVO PLUGIN (APENAS PARA OWNER)
  async create(req, res) {
    try {
      const { name, description, imageUrl, endpointUrl, enabledGlobally } = req.body;

      const newPlugin = await AiPlugin.create({
        name,
        description,
        imageUrl,
        endpointUrl,
        enabledGlobally: enabledGlobally || false,
      });

      return res.status(201).json({
        message: 'Plugin de IA criado com sucesso',
        plugin: newPlugin
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar plugin de IA' });
    }
  },

  // LISTAR TODOS OS PLUGINS (APENAS PARA OWNER)
  async listAll(req, res) {
    try {
      const plugins = await AiPlugin.findAll({
        attributes: ['id', 'guid', 'name', 'description', 'imageUrl', 'endpointUrl', 'enabledGlobally'],
        order: [['createdAt', 'DESC']]
      });

      return res.json({ plugins });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar plugins de IA' });
    }
  },

  // ATUALIZAR UM PLUGIN (APENAS PARA OWNER)
  async update(req, res) {
    try {
      const { guid } = req.params;
      const { name, description, imageUrl, endpointUrl, enabledGlobally } = req.body;

      const plugin = await AiPlugin.findOne({ where: { guid } });

      if (!plugin) {
        return res.status(404).json({ error: 'Plugin não encontrado' });
      }

      if (name !== undefined) plugin.name = name;
      if (description !== undefined) plugin.description = description;
      if (imageUrl !== undefined) plugin.imageUrl = imageUrl;
      if (endpointUrl !== undefined) plugin.endpointUrl = endpointUrl;
      if (enabledGlobally !== undefined) plugin.enabledGlobally = enabledGlobally;

      await plugin.save();

      return res.json({ message: 'Plugin atualizado com sucesso', plugin });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar plugin' });
    }
  },

  // DELETAR UM PLUGIN (APENAS PARA OWNER)
  async delete(req, res) {
    try {
      const { guid } = req.params;

      const plugin = await AiPlugin.findOne({ where: { guid } });

      if (!plugin) {
        return res.status(404).json({ error: 'Plugin não encontrado' });
      }

      await plugin.destroy();

      return res.json({ message: 'Plugin deletado com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar plugin' });
    }
  },

  // GERENCIAR ACESSO AO PLUGIN PARA USUÁRIOS ESPECÍFICOS (APENAS PARA OWNER)
  async setAccess(req, res) {
    try {
      const { guid } = req.params;
      const { userIds } = req.body; // Array de IDs de usuários

      const plugin = await AiPlugin.findOne({ where: { guid } });
      if (!plugin) {
        return res.status(404).json({ error: 'Plugin não encontrado' });
      }
      
      if (plugin.enabledGlobally) {
        return res.status(400).json({ error: 'Este plugin está habilitado globalmente. Desative-o antes de gerenciar o acesso individual.' });
      }
      
      // Limpa os acessos existentes
      await UserPluginAccess.destroy({ where: { aiPluginId: plugin.id } });
      
      // Cria novos acessos
      if (userIds && userIds.length > 0) {
        const accessEntries = userIds.map(userId => ({
          userId,
          aiPluginId: plugin.id
        }));
        await UserPluginAccess.bulkCreate(accessEntries);
      }

      return res.json({ message: 'Acesso ao plugin atualizado com sucesso.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao gerenciar acesso ao plugin' });
    }
  },

  // OBTER PLUGINS DISPONÍVEIS PARA O USUÁRIO LOGADO
  async getAvailablePlugins(req, res) {
    try {
      const userId = req.user.id;

      // Encontra todos os plugins habilitados globalmente ou com acesso específico para o usuário
      const plugins = await AiPlugin.findAll({
        where: {
          [Op.or]: [
            { enabledGlobally: true },
            { '$users.id$': userId }
          ]
        },
        include: [{
          model: User,
          as: 'users',
          through: { attributes: [] }, // Evita que a tabela de junção seja incluída
          attributes: []
        }],
        attributes: ['id', 'guid', 'name', 'description', 'imageUrl', 'endpointUrl'],
        order: [['createdAt', 'ASC']]
      });

      return res.json({ plugins });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar plugins disponíveis' });
    }
  },

  // Middleware para ser usado na rota de execução do plugin
  checkPluginAccess: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { guid } = req.params;

      const plugin = await AiPlugin.findOne({
        where: { guid },
        include: [{
          model: User,
          as: 'users',
          through: { attributes: [] },
          where: { id: userId },
          required: false, // Use required: false para LEFT JOIN
        }]
      });

      if (!plugin) {
        return res.status(404).json({ error: 'Plugin não encontrado.' });
      }

      // Se o plugin estiver habilitado globalmente, ou se houver uma entrada na tabela de acesso
      const hasAccess = plugin.enabledGlobally || plugin.users.length > 0;
      
      if (hasAccess) {
        req.plugin = plugin; // Adiciona o plugin ao objeto da requisição para uso posterior
        next();
      } else {
        res.status(403).json({ error: 'Acesso negado. Você não tem permissão para usar este plugin.' });
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao verificar acesso ao plugin' });
    }
  },

  // Exemplo de uma função de execução de plugin (será implementada na Etapa 3)
  async executePluginExample(req, res) {
    // Lógica aqui na Etapa 3
    return res.json({ message: `Executando o plugin: ${req.plugin.name}` });
  },

  // Exportar o middleware para uso nas rotas
  checkOwnerRole,
};