const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

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
                profileId = 1
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

            const user = await User.findOne({ where: { email } });

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
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar dados do usuário' });
        }
    }

};
 