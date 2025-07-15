// src/controllers/messageController.js
const { Message, MessageRecipient, User } = require('../models');

module.exports = {
    async create(req, res) {
        try {
            const senderId = req.user.id;
            const { title, content, recipientIds } = req.body;

            // Validações
            if (!title || !content || !Array.isArray(recipientIds) || recipientIds.length === 0) {
                return res.status(400).json({ error: 'Title, content e recipientIds são obrigatórios.' });
            }

            // Cria a mensagem com título
            const message = await Message.create({ senderId, title, content });

            // Associa destinatários
            const recipientsData = recipientIds.map(recipientId => ({
                messageId: message.id,
                recipientId
            }));
            await MessageRecipient.bulkCreate(recipientsData);

            res.status(201).json(message);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao criar mensagem.' });
        }
    },

    async listReceived(req, res) {
        try {
            const userId = req.user.id;

            // Busca mensagens recebidas (não deletadas)
            const messages = await MessageRecipient.findAll({
                where: { recipientId: req.user.id, deleted: false },
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: Message,
                        as: 'message',
                        include: [
                            {
                                model: User,
                                as: 'sender',
                                attributes: ['id', 'email'] // <- aqui substitua 'username' por 'email' ou os campos reais da tabela
                            }
                        ]
                    }
                ]
            });

            res.json(messages);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao listar mensagens recebidas.' });
        }
    },

    async markAsRead(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params; // garante que pega 'id'

            if (!id) {
                return res.status(400).json({ error: 'ID da mensagem é obrigatório.' });
            }

            const msgRecipient = await MessageRecipient.findOne({
                where: { id, recipientId: userId }
            });

            if (!msgRecipient) {
                return res.status(403).json({ error: 'Mensagem não encontrada ou sem permissão.' });
            }

            msgRecipient.readAt = new Date();
            await msgRecipient.save();

            res.json({ message: 'Mensagem marcada como lida.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao marcar mensagem como lida.' });
        }
    },



    async markAsDeleted(req, res) {
        try {
            const userId = req.user.id;
            const { messageId } = req.params;

            const msgRecipient = await MessageRecipient.findOne({
                where: { recipientId: userId, messageId }
            });

            if (!msgRecipient) {
                return res.status(403).json({ error: 'Mensagem não encontrada ou sem permissão.' });
            }

            msgRecipient.deleted = true;
            await msgRecipient.save();

            res.json({ message: 'Mensagem marcada como deletada.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao marcar mensagem como deletada.' });
        }
    },

    async delete(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            // Verifica se a mensagem existe e se foi enviada pelo usuário autenticado
            const message = await Message.findOne({ where: { id, senderId: userId } });

            if (!message) {
                return res.status(403).json({ error: 'Mensagem não encontrada ou sem permissão para deletar.' });
            }

            // Remove os registros de destinatários vinculados
            await MessageRecipient.destroy({ where: { messageId: id } });

            // Remove a mensagem
            await message.destroy();

            res.json({ message: 'Mensagem deletada com sucesso.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao deletar mensagem.' });
        }
    }


};
