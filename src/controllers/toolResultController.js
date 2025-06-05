// src/controllers/toolResultController.js
const { ToolResult, ToolInstance, ProjectParticipant } = require('../models');

module.exports = {
  // Salva o resultado da ferramenta
  async create(req, res) {
    try {
      const { toolInstanceId, participantId, score, completedAt, duration, answers } = req.body;

      const instance = await ToolInstance.findByPk(toolInstanceId);
      const participant = await ProjectParticipant.findByPk(participantId);

      if (!instance || !participant) {
        return res.status(404).json({ error: 'Instância da ferramenta ou participante não encontrado.' });
      }

      const result = await ToolResult.create({
        toolInstanceId,
        participantId,
        score,
        completedAt,
        duration,
        answers
      });

      res.status(201).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao registrar resultado.' });
    }
  },

  // Lista todos os resultados de uma ferramenta
  async byToolInstance(req, res) {
    try {
      const { toolInstanceId } = req.params;

      const results = await ToolResult.findAll({ where: { toolInstanceId } });
      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar resultados da ferramenta.' });
    }
  },

  // Lista todos os resultados de um participante
  async byParticipant(req, res) {
    try {
      const { participantId } = req.params;

      const results = await ToolResult.findAll({ where: { participantId } });
      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar resultados do participante.' });
    }
  }
};
