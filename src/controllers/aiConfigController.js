// src/controllers/aiConfigController.js
const { AiConfig, User } = require('../models');
const { Op } = require('sequelize');

module.exports = {

  // CADASTRAR NOVA CHAVE/CONFIG DE IA
  async register(req, res) {
    try {
      const userId = req.user.id;
      const { provider, apiKey } = req.body;

      // Desativar todas as outras configurações do mesmo provedor para este usuário
      await AiConfig.update(
        { isActive: false },
        {
          where: {
            userId,
            provider,
            isActive: true
          }
        }
      );

      // Criar a nova configuração, já a definindo como ativa
      const newConfig = await AiConfig.create({
        userId,
        provider,
        apiKey,
        isActive: true
      });

      return res.status(201).json({
        message: 'Configuração de IA criada com sucesso.',
        config: newConfig
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao registrar configuração de IA' });
    }
  },

  // LISTAR CONFIGURAÇÕES DE IA DO USUÁRIO
  async listAll(req, res) {
    try {
      const userId = req.user.id;

      const configs = await AiConfig.findAll({
        where: { userId },
        attributes: ['id', 'guid', 'provider', 'isActive', 'createdAt'],
        order: [['createdAt', 'DESC']]
      });

      return res.json({ configs });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar configurações de IA' });
    }
  },

  // DEFINIR UMA CONFIGURAÇÃO COMO ATIVA
  async setActive(req, res) {
    try {
      const userId = req.user.id;
      const { guid } = req.params;

      const configToActivate = await AiConfig.findOne({
        where: { guid, userId }
      });

      if (!configToActivate) {
        return res.status(404).json({ error: 'Configuração não encontrada ou sem permissão' });
      }

      // Desativar todas as outras configurações do mesmo provedor para este usuário
      await AiConfig.update(
        { isActive: false },
        {
          where: {
            userId,
            provider: configToActivate.provider
          }
        }
      );

      // Ativar a configuração selecionada
      configToActivate.isActive = true;
      await configToActivate.save();

      return res.json({ message: 'Configuração ativada com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao ativar configuração de IA' });
    }
  },

  // DELETAR CONFIGURAÇÃO DE IA
  async delete(req, res) {
    try {
      const userId = req.user.id;
      const { guid } = req.params;

      const config = await AiConfig.findOne({
        where: { guid, userId }
      });

      if (!config) {
        return res.status(404).json({ error: 'Configuração não encontrada ou sem permissão' });
      }

      await config.destroy();

      return res.json({ message: 'Configuração deletada com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar configuração de IA' });
    }
  }

};