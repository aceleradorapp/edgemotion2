// src/controllers/contractedProjectsController.js
const { Project, SharedLink } = require('../models');

module.exports = {
    async index(req, res) {
        try {
            const projects = await Project.findAll({
                where: { isContracted: true }
            });
            res.json(projects);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao listar projetos contratados.' });
        }
    },

    async show(req, res) {
        try {
            const project = await Project.findOne({
                where: {
                    id: req.params.id,
                    isContracted: true
                }
            });

            if (!project) {
                return res.status(404).json({ error: 'Projeto contratado não encontrado.' });
            }

            res.json(project);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao buscar projeto contratado.' });
        }
    },

    async create(req, res) {
        try {
            const { name, description, imageUrl, userId: userIdBody } = req.body;
            const loggedUserId = req.user.id;
            const loggedUserRole = req.user.role;

            let userIdToUse = loggedUserId;

            if (userIdBody && loggedUserRole === 'admin') {
                userIdToUse = userIdBody;
            }

            const newProject = await Project.create({
                name,
                description,
                imageUrl,
                userId: userIdToUse,
                isContracted: true
            });

            res.status(201).json(newProject);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao criar projeto contratado.' });
        }
    },

    async listByUser(req, res) {
        try {
            const userId = req.params.userId;
            const userType = req.user?.userTypeId; // ou obtenha de onde você está guardando o tipo do usuário            

            // Defina os atributos dinamicamente
            const sharedLinkAttributes = userType === 3
                ? ['guid', 'keyword']
                : ['guid']; // oculta o keyword

            const projects = await Project.findAll({
                where: {
                    isContracted: true,
                    userId: userId
                },
                include: [
                    {
                        model: SharedLink,
                        attributes: sharedLinkAttributes,
                        where: { isActive: true },
                        required: false
                    }
                ]
            });

            res.json(projects);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao listar projetos contratados por usuário.' });
        }
    },


    async update(req, res) {
        try {
            const { name, description, imageUrl } = req.body;

            const project = await Project.findOne({
                where: {
                    id: req.params.id,
                    isContracted: true
                }
            });

            if (!project) {
                return res.status(404).json({ error: 'Projeto contratado não encontrado.' });
            }

            await project.update({ name, description, imageUrl });

            res.json(project);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao atualizar projeto contratado.' });
        }
    },

    async delete(req, res) {
        try {
            const project = await Project.findOne({
                where: {
                    id: req.params.id,
                    isContracted: true
                }
            });

            if (!project) {
                return res.status(404).json({ error: 'Projeto contratado não encontrado.' });
            }

            await project.destroy();
            res.json({ message: 'Projeto contratado removido com sucesso.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao remover projeto contratado.' });
        }
    }
};
