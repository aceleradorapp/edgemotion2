// src/controllers/groupParticipantController.js
const { Group, GroupParticipant, User } = require('../models');

module.exports = {
  async addParticipant(req, res) {
  try {
    const { groupId, userId } = req.body;

    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Grupo não encontrado.' });
    }

    // ✅ Verificar se o user já está no grupo
    const existing = await GroupParticipant.findOne({ where: { groupId, userId } });
    if (existing) {
      return res.status(400).json({ error: 'Usuário já está no grupo.' });
    }

    const participant = await GroupParticipant.create({
      groupId,
      userId,
      status: 'pending'
    });

    res.status(201).json(participant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao adicionar participante ao grupo.' });
  }
},

  async listParticipants(req, res) {
    try {
      const { groupId } = req.params;

      const participants = await GroupParticipant.findAll({
        where: { groupId },
        include: [{ model: User, attributes: ['id', 'displayName', 'email'] }]
      });

      res.json(participants);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao listar participantes do grupo.' });
    }
  }
};
