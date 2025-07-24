const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, UserType, Profile, Message, MessageRecipient } = require('../models');

const SECRET = process.env.JWT_SECRET || 'segredo-super-seguro';

module.exports = {
    async register(req, res) {
        try {
            const {
                email,
                password,
                displayName,
                photoUrl = null, // Valor opcional com padrão nulo
                userTypeId = 1,  // Valor padrão para userTypeId
                profileId = 1   // Valor padrão para profileId
            } = req.body;

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
                userTypeId,
                profileId,
            });

            await sendUserRegistrationMessage(newUser);

            return res.status(201).json({
                message: 'Usuário criado com sucesso'
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao registrar usuário' });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({
                where: { email },
                include: [
                    { model: UserType, attributes: ['id', 'code', 'name'] },
                    { model: Profile, attributes: ['id', 'code', 'name'] }
                ]
            });

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Senha incorreta' });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    guid: user.guid,
                    email: user.email,
                    userTypeId: user.userTypeId,
                    profileId: user.profileId,
                    role: user.UserType?.name || null
                },
                SECRET,
                { expiresIn: '1d' }
            );

            return res.json({
                message: 'Login bem-sucedido',
                token,
                user: {
                    id: user.id,
                    guid: user.guid,
                    email: user.email,
                    displayName: user.displayName,
                    photoUrl: user.photoUrl,
                    userTypeId: user.userTypeId,
                    profileId: user.profileId,
                    userType: user.UserType?.code || null,
                    profile: user.Profile?.code || null,
                    role: user.UserType?.name || null
                },
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao fazer login' });
        }
    },

    async me(req, res) {
        try {
            const user = req.user;

            return res.json({
                id: user.id,
                guid: user.guid,
                email: user.email,
                displayName: user.displayName,
                photoUrl: user.photoUrl,
                userTypeId: user.userTypeId,
                profileId: user.profileId,
                role: user.role || null,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar dados do usuário' });
        }
    },    

};

async function sendUserRegistrationMessage(newUser) {
        try {
            const senderId = 1; // ID fixo do administrador

            const title = `Novo usuário registrado: ${newUser.displayName}`;
            const content = `
Novo usuário criado no sistema:

- Nome: ${newUser.displayName}
- Email: ${newUser.email}
- Tipo de Usuário: ${newUser.userTypeId}
- Perfil: ${newUser.profileId}
${newUser.photoUrl ? `- Foto: ${newUser.photoUrl}` : ''}
        `.trim();

            const message = await Message.create({ senderId, title, content });

            await MessageRecipient.create({
                messageId: message.id,
                recipientId: [senderId]
            });

        } catch (err) {
            console.error('Erro ao enviar mensagem para o administrador:', err);
        }
    }
