// src/services/evaluationService.js
const { Evaluation, Question, User } = require('../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

// Função utilitária para embaralhar um array (algoritmo de Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const EvaluationService = {
    /**
     * Cria uma nova avaliação e suas questões.
     * Gera um GUID para cada opção de resposta para validação futura.
     * @param {Object} evaluationData - Dados da avaliação (name, description, passingPercentage, maxAttempts, questions)
     * @returns {Object} A nova avaliação criada.
     */
    async createEvaluation(evaluationData) {
        const { questions, ...evalData } = evaluationData;
        const transaction = await Evaluation.sequelize.transaction();

        try {
            const newEvaluation = await Evaluation.create(evalData, { transaction });

            if (questions && questions.length > 0) {
                const questionsWithEvaluationId = questions.map(q => {
                    const optionsWithGuids = q.options.map(option => ({
                        ...option,
                        guid: uuidv4() // Adiciona um GUID único a cada opção
                    }));
                    return {
                        ...q,
                        evaluationId: newEvaluation.id,
                        options: optionsWithGuids
                    };
                });
                await Question.bulkCreate(questionsWithEvaluationId, { transaction });
            }

            await transaction.commit();
            return newEvaluation;
        } catch (error) {
            await transaction.rollback();
            console.error('Erro no service ao criar avaliação:', error);
            throw new Error('Falha ao criar avaliação e suas questões.');
        }
    },

    /**
     * Lista todas as avaliações com opções de filtro e paginação.
     * @param {Object} options - Objeto com filtros (page, limit, search, companyGuid)
     * @returns {Object} Dados paginados das avaliações.
     */
    async getAllEvaluations(options) {
        const { page = 1, limit = 10, search = '', companyGuid = null } = options;
        const offset = (page - 1) * limit;

        const where = {};
        if (search) {
            where.name = { [Op.like]: `%${search}%` };
        }
        if (companyGuid) {
            where.companyGuid = companyGuid;
        }

        const { count, rows } = await Evaluation.findAndCountAll({
            where,
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'guid', 'name', 'description', 'passingPercentage', 'maxAttempts', 'isActive', 'companyGuid', 'createdAt'],
            include: [{
                model: User,
                as: 'creator',
                attributes: ['guid', 'displayName', 'email', 'photoUrl']
            }]
        });

        return {
            total: count,
            page: parseInt(page),
            perPage: parseInt(limit),
            evaluations: rows
        };
    },

    /**
     * Obtém os detalhes de uma avaliação específica pelo GUID.
     * @param {string} evaluationGuid - GUID da avaliação.
     * @returns {Object} A avaliação encontrada ou null.
     */
    async getEvaluationByGuid(evaluationGuid) {
        const evaluation = await Evaluation.findOne({
            where: { guid: evaluationGuid },
            include: [
                {
                    model: Question,
                    as: 'questions',
                    attributes: ['guid', 'type', 'text', 'options']
                }
            ]
        });
        return evaluation;
    },

    /**
     * Atualiza uma avaliação existente.
     * @param {string} evaluationGuid - GUID da avaliação a ser atualizada.
     * @param {Object} updateData - Dados para atualização.
     * @returns {Object} A avaliação atualizada ou null.
     */
    async updateEvaluation(evaluationGuid, updateData) {
        const evaluation = await Evaluation.findOne({ where: { guid: evaluationGuid } });

        if (!evaluation) {
            return null;
        }

        const { questions, ...evalUpdateData } = updateData;

        await evaluation.update(evalUpdateData);
        return evaluation;
    },

    /**
     * Deleta uma avaliação.
     * @param {string} evaluationGuid - GUID da avaliação a ser deletada.
     * @returns {boolean} True se a avaliação foi deletada com sucesso, false caso contrário.
     */
    async deleteEvaluation(evaluationGuid) {
        const evaluation = await Evaluation.findOne({ where: { guid: evaluationGuid } });

        if (!evaluation) {
            return false;
        }

        await evaluation.destroy();
        return true;
    },

    /**
     * Prepara as questões de uma avaliação para serem apresentadas ao usuário.
     * Embaralha as questões e suas opções, e remove as respostas corretas.
     * @param {string} evaluationGuid - O GUID da avaliação.
     * @returns {Array} Um array de questões preparadas para o frontend.
     */
    async prepareEvaluationForUser(evaluationGuid) {
        const evaluation = await Evaluation.findOne({
            where: { guid: evaluationGuid },
            include: [
                {
                    model: Question,
                    as: 'questions',
                    attributes: ['guid', 'type', 'text', 'options']
                }
            ]
        });

        if (!evaluation || !evaluation.questions) {
            return null;
        }

        let shuffledQuestions = shuffleArray(evaluation.questions.map(q => q.toJSON()));

        shuffledQuestions = shuffledQuestions.map(question => {
            const shuffledOptions = shuffleArray(question.options).map(option => {
                const { isCorrect, ...optionWithoutCorrectness } = option;
                return optionWithoutCorrectness;
            });

            return {
                guid: question.guid,
                type: question.type,
                text: question.text,
                options: shuffledOptions
            };
        });

        return {
            evaluationGuid: evaluation.guid,
            evaluationName: evaluation.name,
            questions: shuffledQuestions
        };
    },

    async duplicateEvaluation(sourceEvaluationGuid, newCompanyGuid, userId) {
        const sourceEvaluation = await Evaluation.findOne({
            where: { guid: sourceEvaluationGuid },
            include: [
                {
                    model: Question,
                    as: 'questions',
                    attributes: ['type', 'text', 'options'] // Não precisamos dos GUIDs antigos
                }
            ]
        });

        if (!sourceEvaluation) {
            throw new Error('Avaliação de origem não encontrada.');
        }

        const transaction = await Evaluation.sequelize.transaction();
        try {
            // 1. Criar a nova avaliação (cópia)
            const newEvaluation = await Evaluation.create({
                name: sourceEvaluation.name,
                description: sourceEvaluation.description,
                passingPercentage: sourceEvaluation.passingPercentage,
                maxAttempts: sourceEvaluation.maxAttempts,
                isActive: sourceEvaluation.isActive,
                companyGuid: newCompanyGuid,
                userId: userId,
            }, { transaction });

            // 2. Duplicar as questões
            const newQuestions = sourceEvaluation.questions.map(q => {
                const optionsWithNewGuids = q.options.map(option => ({
                    ...option,
                    guid: uuidv4() // Gera novos GUIDs para as opções
                }));
                return {
                    evaluationId: newEvaluation.id,
                    type: q.type,
                    text: q.text,
                    options: optionsWithNewGuids,
                };
            });

            await Question.bulkCreate(newQuestions, { transaction });

            await transaction.commit();
            return newEvaluation;

        } catch (error) {
            await transaction.rollback();
            console.error('Erro no service ao duplicar avaliação:', error);
            throw new Error('Falha ao duplicar a avaliação.');
        }
    }
};

module.exports = EvaluationService;