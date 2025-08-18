// src/controllers/aiPluginController.js
const { AiPlugin, User, UserPluginAccess, AiConfig } = require('../models');
const { Op } = require('sequelize');
const openaiService = require('../services/ai/openaiService');

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

      // NOVO: Verificação de plugin já existente pelo nome ou endpointUrl
      const existingPlugin = await AiPlugin.findOne({
        where: {
          [Op.or]: [{ name }, { endpointUrl }]
        }
      });

      if (existingPlugin) {
        if (existingPlugin.name === name) {
          return res.status(400).json({ error: 'Um plugin com este nome já existe.' });
        }
        if (existingPlugin.endpointUrl === endpointUrl) {
          return res.status(400).json({ error: 'Um plugin com este URL de endpoint já existe.' });
        }
      }

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

      // NOVO: Excluir todos os registros de acesso associados primeiro
      await UserPluginAccess.destroy({
        where: {
          aiPluginId: plugin.id
        }
      });

      // Agora o plugin pode ser deletado
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
      const { userIds } = req.body;
      const plugin = await AiPlugin.findOne({ where: { guid } });
      if (!plugin) {
        return res.status(404).json({ error: 'Plugin não encontrado' });
      }
      if (plugin.enabledGlobally) {
        return res.status(400).json({ error: 'Este plugin está habilitado globalmente. Desative-o antes de gerenciar o acesso individual.' });
      }
      await UserPluginAccess.destroy({ where: { aiPluginId: plugin.id } });
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
      // Busca os plugins habilitados globalmente
      const globalPlugins = await AiPlugin.findAll({
        where: { enabledGlobally: true },
        attributes: ['id', 'guid', 'name', 'description', 'imageUrl', 'endpointUrl'],
      });
      // Busca os plugins com acesso específico para o usuário
      const userSpecificPlugins = await AiPlugin.findAll({
        attributes: ['id', 'guid', 'name', 'description', 'imageUrl', 'endpointUrl'],
        include: [{
          model: User,
          as: 'users',
          through: { attributes: [] },
          where: { id: userId },
        }],
      });
      // Combina os dois resultados, removendo duplicatas
      const allAvailablePlugins = [...globalPlugins, ...userSpecificPlugins];
      const uniquePlugins = Array.from(new Set(allAvailablePlugins.map(p => p.guid)))
        .map(guid => {
          return allAvailablePlugins.find(p => p.guid === guid);
        });
      return res.json({ plugins: uniquePlugins });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar plugins disponíveis' });
    }
  },

  // Middleware para ser usado na rota de execução do plugin
  checkPluginAccess: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { guid } = req.body;
      if (!guid) {
        return res.status(400).json({ error: 'GUID do plugin é obrigatório no corpo da requisição.' });
      }
      // Busca o plugin pelo GUID
      const plugin = await AiPlugin.findOne({ where: { guid } });
      if (!plugin) {
        return res.status(404).json({ error: 'Plugin não encontrado.' });
      }
      // Verifica se o plugin está habilitado globalmente
      if (plugin.enabledGlobally) {
        req.plugin = plugin;
        return next();
      }
      // Se não for global, verifica o acesso específico do usuário
      const hasAccess = await UserPluginAccess.findOne({
        where: {
          userId,
          aiPluginId: plugin.id
        }
      });
      if (hasAccess) {
        req.plugin = plugin;
        next();
      } else {
        return res.status(403).json({ error: 'Acesso negado. Você não tem permissão para usar este plugin.' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao verificar acesso ao plugin' });
    }
  },

  // LÓGICA DE EXECUÇÃO DO PLUGIN "GERAR JSON DE AVALIAÇÕES"
  async generateReviewJson(req, res) {
    try {
      const userId = req.user.id;
      const { prompt } = req.body;
      const aiConfig = await AiConfig.findOne({
        where: {
          userId,
          provider: 'openai',
          isActive: true,
        },
      });
      if (!aiConfig) {
        return res.status(400).json({ error: 'Nenhuma chave de API da OpenAI ativa encontrada para o seu usuário.' });
      }
      const responseJson = await openaiService.generateReviewJson(aiConfig.apiKey, prompt);
      return res.json({
        message: 'JSON de avaliação gerado com sucesso.',
        result: responseJson
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao executar o plugin de geração de JSON. Verifique sua chave de API e o prompt.' });
    }
  },

  async listAccessUsers(req, res) {
    try {
      const { guid } = req.params;

      const plugin = await AiPlugin.findOne({ where: { guid } });
      if (!plugin) {
        return res.status(404).json({ error: 'Plugin não encontrado.' });
      }

      const accesses = await UserPluginAccess.findAll({
        where: { aiPluginId: plugin.id },
        attributes: ['userId']
      });

      const userIds = accesses.map(access => access.userId);
      return res.json({ userIds });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar usuários com acesso ao plugin.' });
    }
  },

  // Exportar o middleware para uso nas rotas
  checkOwnerRole,
};