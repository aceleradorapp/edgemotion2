const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { User, UserType, Profile, Message, MessageRecipient, EmailVerificationToken } = require('../models');
const EmailService = require('../services/EmailService');
const moment = require('moment');

const SECRET = process.env.JWT_SECRET || 'segredo-super-seguro';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

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

            // Geração e salvamento do token de verificação de e-mail
            const verificationToken = crypto.randomBytes(32).toString('hex'); // Token aleatório
            const tokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex'); // Hash para armazenar
            const expiresAt = moment().add(1, 'hour').toDate(); // Token expira em 1 hora

            await EmailVerificationToken.create({
                userId: newUser.id,
                tokenHash: tokenHash,
                expiresAt: expiresAt,
            });

            // Montagem do link de verificação
            const verificationLink = `${FRONTEND_URL}/verify-email?token=${verificationToken}&userId=${newUser.id}`;

            // Envio do e-mail de verificação
            await EmailService.sendEmail({
                to: newUser.email,
                subject: 'Ative sua conta EdgeMotion',
                html: `
                    <p>Olá ${newUser.displayName},</p>
                    <p>Obrigado por se cadastrar na EdgeMotion! Para ativar sua conta, por favor clique no link abaixo:</p>
                    <p><a href="${verificationLink}">Ativar minha conta</a></p>
                    <p>Este link de ativação expirará em 1 hora.</p>
                    <p>Se você não solicitou este cadastro, por favor ignore este e-mail.</p>
                    <p>Atenciosamente,<br>Equipe EdgeMotion</p>
                `,
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

    async verifyEmail(req, res) {
        try {
            const { token, userId } = req.query; // Recebe o token e o userId da query string

            if (!token || !userId) {
                return res.status(400).json({ error: 'Token ou ID de usuário ausente.' });
            }

            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            console.log('Usuário encontrado:', user.email);
            if (user.emailVerifiedAt) {
                return res.status(400).json({ error: 'E-mail já verificado para este usuário.' });
            }

            const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

            const verificationRecord = await EmailVerificationToken.findOne({
                where: {
                    userId: userId,
                    tokenHash: tokenHash,
                    usedAt: null, // Garante que o token não foi usado
                },
            });

            if (!verificationRecord) {
                return res.status(400).json({ error: 'Token de verificação inválido ou já utilizado.' });
            }

            if (moment().isAfter(verificationRecord.expiresAt)) {
                return res.status(400).json({ error: 'Token de verificação expirado.' });
            }

            // Marca o e-mail como verificado no usuário
            user.emailVerifiedAt = new Date();
            await user.save();

            // Marca o token de verificação como usado
            verificationRecord.usedAt = new Date();
            await verificationRecord.save();

            // Resposta de sucesso (status 200, com 'message')
            return res.status(200).json({ message: 'E-mail verificado com sucesso!' });
        } catch (error) {
            console.error('Erro ao verificar e-mail:', error);
            // Resposta de erro genérica (status 500, com 'error')
            return res.status(500).json({ error: 'Erro ao verificar e-mail.' });
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
