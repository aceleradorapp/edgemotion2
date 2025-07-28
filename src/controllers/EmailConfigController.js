// src/controllers/EmailConfigController.js
const { EmailConfig } = require('../models');

module.exports = {
  async createConfig(req, res) {
    try {
      const {
        companyGuid, host, port, secure,
        authUser, authPass, senderName, senderEmail
      } = req.body;

      const config = await EmailConfig.create({
        companyGuid,
        host,
        port,
        secure,
        authUser,
        authPass,
        senderName,
        senderEmail
      });

      return res.status(201).json(config);
    } catch (error) {
      console.error('Erro ao criar configuração de e-mail:', error);
      return res.status(500).json({ message: 'Erro interno ao salvar configuração' });
    }
  },

  async getConfig(req, res) {
    try {
      const { companyGuid } = req.query;

      const config = await EmailConfig.findOne({
        where: { isActive: true }
      });

      if (!config) {
        return res.status(404).json({ message: 'Configuração não encontrada' });
      }

      return res.json(config);
    } catch (error) {
      console.error('Erro ao buscar configuração de e-mail:', error);
      return res.status(500).json({ message: 'Erro interno ao buscar configuração' });
    }
  },

  async updateConfig(req, res) {
    try {
      const { id } = req.params;
      const {
        host, port, secure,
        authUser, authPass, senderName, senderEmail
      } = req.body;

      const config = await EmailConfig.findByPk(id);
      if (!config) {
        return res.status(404).json({ message: 'Configuração não encontrada' });
      }

      await config.update({
        host, port, secure,
        authUser, authPass, senderName, senderEmail
      });

      return res.json(config);
    } catch (error) {
      console.error('Erro ao atualizar configuração de e-mail:', error);
      return res.status(500).json({ message: 'Erro interno ao atualizar configuração' });
    }
  },

  async deleteConfig(req, res) {
    try {
      const { id } = req.params;

      const config = await EmailConfig.findByPk(id);
      if (!config) {
        return res.status(404).json({ message: 'Configuração não encontrada' });
      }

      await config.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir configuração de e-mail:', error);
      return res.status(500).json({ message: 'Erro interno ao excluir configuração' });
    }
  }
};


