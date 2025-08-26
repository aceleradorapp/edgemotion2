const EvaluationService = require('../services/evaluationService'); // Importa o serviço

const EvaluationController = {
    /**
     * @route POST /api/evaluations
     * @description Cria uma nova avaliação com suas questões. (Apenas Admin/Gerenciamento)
     * @access Private (Auth Required, Role Admin/CompanyOwner)
     */
    async create(req, res) {
        try {
            const { name, description, passingPercentage, maxAttempts, questions, companyGuid } = req.body;
            const userCompanyGuid = req.user.guid; // Supondo que o companyGuid vem do token do usuário logado
            const userRole = req.user.role; // Supondo que o role vem do token
            const userId = req.user.id;

            // Validação básica de entrada
            if (!name || !passingPercentage || !maxAttempts || !questions || !Array.isArray(questions) || questions.length === 0) {
                return res.status(400).json({ error: 'Dados da avaliação e questões são obrigatórios.' });
            }

            // Validação de permissão para vincular a companyGuid
            let effectiveCompanyGuid = null;
            if (userRole === 'owner') { // Se o usuário for um super-admin 'owner', ele pode definir o companyGuid
                effectiveCompanyGuid = companyGuid || userCompanyGuid; // Permite que o owner defina, ou use o dele
            } else if (userCompanyGuid) { // Usuários de empresa só podem criar para sua própria empresa
                effectiveCompanyGuid = userCompanyGuid;
            } else {
                return res.status(403).json({ error: 'Permissão negada. CompanyGuid é necessário.' });
            }

            // Construir os dados para o serviço
            const evaluationData = {
                name,
                description,
                passingPercentage,
                maxAttempts,
                isActive: true, // Ou de acordo com a regra de negócio
                companyGuid: effectiveCompanyGuid,
                userId: userId,
                questions // Passa as questões para o serviço
            };

            const newEvaluation = await EvaluationService.createEvaluation(evaluationData);

            // Limpar as respostas corretas antes de enviar para o frontend, se for o caso
            // Embora para endpoints de CRUD Admin, talvez não seja estritamente necessário,
            // é uma boa prática para evitar vazamentos acidentais.
            const responseEvaluation = newEvaluation.toJSON();
            if (responseEvaluation.questions) {
                responseEvaluation.questions = responseEvaluation.questions.map(q => {
                    const { options, ...rest } = q;
                    // Se o frontend for listar as questões para edição, talvez queira as opções,
                    // mas sempre pense na segurança. Para este endpoint, assumimos que o admin
                    // pode ver as opções, mas reforço a atenção.
                    return { ...rest, options: JSON.parse(options) }; // Retorna as opções parseadas
                });
            }

            return res.status(201).json({
                message: 'Avaliação criada com sucesso!',
                evaluation: responseEvaluation
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao criar avaliação.' });
        }
    },

    async duplicate(req, res) {
        try {
            const { guid } = req.params;
            const { userGuid } = req.body;
            const requestingUserRole = req.user.role;
            const requestingUserId = req.user.id;

            // Validação de permissão: Apenas o 'owner' pode usar esta funcionalidade
            if (requestingUserRole !== 'owner') {
                return res.status(403).json({ error: 'Permissão negada. Apenas o proprietário pode duplicar avaliações.' });
            }

            // 1. Encontrar o usuário de destino para obter a companyGuid
            const destinationUser = await require('../models').User.findOne({ where: { guid: userGuid } });
            if (!destinationUser) {
                return res.status(404).json({ error: 'Usuário de destino não encontrado.' });
            }

            // 2. Chamar o serviço para duplicar a avaliação
            const newEvaluation = await EvaluationService.duplicateEvaluation(guid, destinationUser.guid, destinationUser.id);

            return res.status(201).json({
                message: 'Avaliação duplicada com sucesso!',
                evaluation: newEvaluation,
            });

        } catch (error) {
            console.error('Erro ao duplicar avaliação:', error);
            return res.status(500).json({ error: error.message || 'Erro ao duplicar a avaliação.' });
        }
    },

    /**
     * @route GET /api/evaluations
     * @description Lista todas as avaliações com filtros. (Apenas Admin/Gerenciamento)
     * @access Private (Auth Required, Role Admin/CompanyOwner)
     */
    async list(req, res) {
        try {
            const userCompanyGuid = req.user.guid;
            const userRole = req.user.role;
            const userProfileId = req.user.profileId;
            const { page, limit, search, companyGuid } = req.query;

            const options = { page, limit, search };

            // Lógica de filtragem por companyGuid baseada no papel do usuário
            // if (userRole === 'owner') { // Super-admin pode filtrar por qualquer companyGuid
            //     options.companyGuid = companyGuid;
            // } else if (userCompanyGuid) { // Usuários de empresa só veem as suas
            //     options.companyGuid = userCompanyGuid;
            // } else {
            //     return res.status(403).json({ error: 'Permissão negada. CompanyGuid é necessário.' });
            // }
            if (userRole === 'owner') {
                options.companyGuid = companyGuid; // Owner pode filtrar por qualquer companyGuid
            } else if (userRole === 'admin' || (userRole === 'user' && userProfileId === 1)) {
                options.companyGuid = userCompanyGuid; // Admin e o novo perfil só veem as suas
            } else {
                return res.status(403).json({ error: 'Permissão negada para listar avaliações.' });
            }

            const evaluations = await EvaluationService.getAllEvaluations(options);

            // Para cada avaliação, limpar as respostas corretas das questões, se existirem
            // (caso o serviço retorne as questões eager-loaded)
            evaluations.evaluations = evaluations.evaluations.map(evalItem => {
                const evalJson = evalItem.toJSON();
                if (evalJson.questions) {
                    evalJson.questions = evalJson.questions.map(q => {
                        const { options, ...rest } = q;
                        return { ...rest, options: JSON.parse(options) };
                    });
                }
                return evalJson;
            });

            return res.json(evaluations);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao listar avaliações.' });
        }
    },

    /**
     * @route GET /api/evaluations/:guid
     * @description Obtém os detalhes de uma avaliação específica. (Apenas Admin/Gerenciamento)
     * @access Private (Auth Required, Role Admin/CompanyOwner)
     */
    async getByGuid(req, res) {
        try {
            const { guid } = req.params;
            const userCompanyGuid = req.user.guid;
            const userProfileId = req.user.profileId;
            const userRole = req.user.role;

            const evaluation = await EvaluationService.getEvaluationByGuid(guid);

            if (!evaluation) {
                return res.status(404).json({ error: 'Avaliação não encontrada.' });
            }

            // Validação de permissão: super-admin ou usuário da empresa dona da avaliação
            // if (userRole !== 'owner' && evaluation.companyGuid !== userCompanyGuid) {
            //     return res.status(403).json({ error: 'Permissão negada para acessar esta avaliação.' });
            // }

            if (userRole === 'owner' || (userRole === 'admin' && evaluation.companyGuid === userCompanyGuid) || (userRole === 'user' && userProfileId === 1 && evaluation.companyGuid === userCompanyGuid)) {
                return res.json({ evaluation });
            } else {
                return res.status(403).json({ error: 'Permissão negada para acessar esta avaliação.' });
            }

            // Para o frontend, sempre remover as respostas corretas das opções
            const responseEvaluation = evaluation.toJSON();
            if (responseEvaluation.questions) {
                responseEvaluation.questions = responseEvaluation.questions.map(q => {
                    const { options, ...rest } = q;
                    return {
                        ...rest,
                        options: userRole === 'owner'
                            ? options
                            : options.map(({ text }) => ({ text })) // remove isCorrect
                    };
                });
            }

            return res.json({ evaluation: responseEvaluation });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar avaliação.' });
        }
    },

    /**
     * @route PUT /api/evaluations/:guid
     * @description Atualiza uma avaliação existente. (Apenas Admin/Gerenciamento)
     * @access Private (Auth Required, Role Admin/CompanyOwner)
     */
    async update(req, res) {
        try {
            const { guid } = req.params;
            const updateData = req.body;
            const userCompanyGuid = req.user.guid;
            const userRole = req.user.role;

            const existingEvaluation = await EvaluationService.getEvaluationByGuid(guid);
            if (!existingEvaluation) {
                return res.status(404).json({ error: 'Avaliação não encontrada.' });
            }

            // Validação de permissão para atualização
            if (userRole !== 'owner' && existingEvaluation.companyGuid !== userCompanyGuid) {
                return res.status(403).json({ error: 'Permissão negada para atualizar esta avaliação.' });
            }

            // Remova 'questions' do updateData se o serviço não for tratá-las diretamente aqui
            // A atualização de questões deve ser um endpoint separado ou lógica mais complexa
            delete updateData.questions;

            const updatedEvaluation = await EvaluationService.updateEvaluation(guid, updateData);

            return res.json({
                message: 'Avaliação atualizada com sucesso!',
                evaluation: updatedEvaluation
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao atualizar avaliação.' });
        }
    },

    /**
     * @route DELETE /api/evaluations/:guid
     * @description Deleta uma avaliação. (Apenas Admin/Gerenciamento)
     * @access Private (Auth Required, Role Admin/CompanyOwner)
     */
    async delete(req, res) {
        try {
            const { guid } = req.params;
            const userCompanyGuid = req.user.guid;
            const userRole = req.user.role;

            const existingEvaluation = await EvaluationService.getEvaluationByGuid(guid);
            if (!existingEvaluation) {
                return res.status(404).json({ error: 'Avaliação não encontrada.' });
            }

            // Validação de permissão para exclusão
            if (userRole !== 'owner' && existingEvaluation.companyGuid !== userCompanyGuid) {
                return res.status(403).json({ error: 'Permissão negada para deletar esta avaliação.' });
            }

            const deleted = await EvaluationService.deleteEvaluation(guid);

            if (!deleted) {
                return res.status(404).json({ error: 'Avaliação não encontrada ou não pôde ser deletada.' });
            }

            return res.json({ message: 'Avaliação deletada com sucesso.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao deletar avaliação.' });
        }
    }
};

module.exports = EvaluationController;