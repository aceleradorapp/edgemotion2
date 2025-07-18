// src/controllers/contractedProjectsController.js
const { Project, SharedLink } = require('../models');
const { Op, col, where } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

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

            if (userIdBody && loggedUserRole === "owner") {
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
                ? ['guid', 'keyword', 'expiresAt']
                : ['guid', 'expiresAt']; // oculta o keyword

            const projects = await Project.findAll({
                where: {
                    isContracted: true,
                    userId: userId
                },
                include: [
                    {
                        model: SharedLink,
                        attributes: sharedLinkAttributes,
                        where: { 
                            isActive: true, 
                            linkCode: where(col('SharedLinks.linkCode'), '=', col('Project.codeLink')) 
                        },
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
    },

    async demoCreate(req, res) {
        try {
            const loggedUser = req.user;

            if (!loggedUser) {
                return res.status(401).json({ error: 'Usuário não autenticado.' });
            }

            const demos = [
                {
                    name: 'Demo EdgeMotion',
                    description: 'Conhecendo o material desenvolvido pela equipe EdgeMotion',
                    imageUrl: '/uploads/project/edgemotioncapa.jpg',
                    keyword: 'midia01',
                },
                {
                    name: 'Demo Intelbras',
                    description: 'Conhecendo a interface do sistema intelbras',
                    imageUrl: '/uploads/project/intelbrascapa.jpg',
                    keyword: 'midia02',
                },
                {
                    name: 'Demo Arduino',
                    description: 'Construindo com Arduino',
                    imageUrl: '/uploads/project/arduinocapa.jpg',
                    keyword: 'midia03',
                }
            ];

            const createdProjects = [];

            for (const demo of demos) {
                const project = await Project.create({
                    name: demo.name,
                    description: demo.description,
                    userId: loggedUser.id,
                    imageUrl: demo.imageUrl,
                    isContracted: true
                });

                const linkCode = uuidv4().replace(/-/g, '').slice(0, 12);
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 30);

                const sharedLink = await SharedLink.create({
                    projectId: project.id,
                    userId: loggedUser.id,
                    linkCode,
                    keyword: demo.keyword,
                    expiresAt,
                    isActive: true
                });

                await project.update({ codeLink: linkCode });

                createdProjects.push({
                    project,
                    sharedLink
                });
            }

            return res.status(201).json({
                message: 'Projetos de demonstração criados com sucesso.',
                createdProjects
            });

        } catch (error) {
            console.error('Erro ao criar projetos demo:', error);
            res.status(500).json({ error: 'Erro ao criar projetos de demonstração.' });
        }
    }


};
