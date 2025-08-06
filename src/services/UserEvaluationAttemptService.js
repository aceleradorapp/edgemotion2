// src/services/userEvaluationAttemptService.js
const { UserEvaluationAttempt, UserAnswer, Evaluation, Question, User } = require('../models');
const { Op } = require('sequelize');

const UserEvaluationAttemptService = {
    /**
     * Inicia uma nova tentativa de avaliação para um usuário.
     * @param {string} evaluationGuid - GUID da avaliação.
     * @param {number} userId - ID do usuário que está tentando.
     * @returns {Object} A nova tentativa criada.
     */
    async startAttempt(evaluationGuid, userId) {
        const evaluation = await Evaluation.findOne({ where: { guid: evaluationGuid } });
        const user = await User.findByPk(userId);

        if (!evaluation || !user) {
            throw new Error('Avaliação ou usuário não encontrado.');
        }

        const attemptsUsed = await UserEvaluationAttempt.count({
            where: {
                userId: user.id,
                evaluationId: evaluation.id,
                status: { [Op.in]: ['completed', 'passed', 'failed'] }
            }
        });

        if (evaluation.maxAttempts && attemptsUsed >= evaluation.maxAttempts) {
            throw new Error('Número máximo de tentativas excedido.');
        }

        const newAttempt = await UserEvaluationAttempt.create({
            userId: user.id,
            evaluationId: evaluation.id,
            status: 'started',
            startTime: new Date()
        });

        return newAttempt;
    },

    /**
     * Salva a resposta de uma questão.
     * @param {string} attemptGuid - GUID da tentativa.
     * @param {Object} answerData - Dados da resposta (questionGuid, selectedOptions, timeTaken).
     * @returns {Object} A resposta do usuário criada ou atualizada.
     */
    async saveAnswer(attemptGuid, answerData) {
        const attempt = await UserEvaluationAttempt.findOne({ where: { guid: attemptGuid } });
        const question = await Question.findOne({ where: { guid: answerData.questionGuid } });

        if (!attempt || !question) {
            throw new Error('Tentativa de avaliação ou questão não encontrada.');
        }

        // Verificar se o usuário já respondeu a esta questão nesta tentativa
        const existingAnswer = await UserAnswer.findOne({
            where: { userEvaluationAttemptId: attempt.id, questionId: question.id }
        });

        if (existingAnswer) {
            await existingAnswer.update({
                selectedOptions: answerData.selectedOptions,
                timeTaken: answerData.timeTaken
            });
            return existingAnswer;
        }

        const newAnswer = await UserAnswer.create({
            userEvaluationAttemptId: attempt.id,
            questionId: question.id,
            selectedOptions: answerData.selectedOptions,
            timeTaken: answerData.timeTaken,
            isCorrect: false
        });

        return newAnswer;
    },

    /**
     * Finaliza uma tentativa de avaliação, calcula o score e o status.
     * @param {string} attemptGuid - GUID da tentativa a ser finalizada.
     * @returns {Object} A tentativa finalizada com os resultados.
     */
    async finishAttempt(attemptGuid) {
        const attempt = await UserEvaluationAttempt.findOne({
            where: { guid: attemptGuid },
            include: [
                {
                    model: Evaluation,
                    as: 'evaluation'
                },
                {
                    model: UserAnswer,
                    as: 'userAnswers',
                    include: [{ model: Question, as: 'question' }]
                }
            ]
        });

        if (!attempt) {
            throw new Error('Tentativa de avaliação não encontrada.');
        }
        if (attempt.status !== 'started' && attempt.status !== 'in_progress') {
            throw new Error('A avaliação já foi finalizada.');
        }

        const { evaluation, userAnswers } = attempt;
        let correctAnswersCount = 0;
        const totalQuestions = evaluation.questions ? evaluation.questions.length : 0;

        for (const userAnswer of userAnswers) {
            const question = userAnswer.question;
            const parsedOptions = question.options;

            const correctOptionGuids = parsedOptions
                .filter(opt => opt.isCorrect)
                .map(opt => opt.guid);

            const selectedOptionGuids = userAnswer.selectedOptions;

            const isAnswerCorrect = selectedOptionGuids.length === correctOptionGuids.length &&
                selectedOptionGuids.every(guid => correctOptionGuids.includes(guid));

            if (isAnswerCorrect) {
                correctAnswersCount++;
            }

            await userAnswer.update({ isCorrect: isAnswerCorrect });
        }

        const totalAnsweredQuestions = userAnswers.length;
        const finalScore = (correctAnswersCount / totalAnsweredQuestions) || 0;

        const isApproved = finalScore >= evaluation.passingPercentage;

        await attempt.update({
            endTime: new Date(),
            totalTimeTaken: (new Date() - attempt.startTime) / 1000,
            score: finalScore,
            isApproved: isApproved,
            status: isApproved ? 'passed' : 'failed'
        });

        return attempt;
    },

    /**
     * Lista todas as tentativas de avaliação de um usuário.
     * @param {number} userId - O ID do usuário.
     * @returns {Array} Um array de tentativas de avaliação.
     */
    async listUserAttempts(userId) {
        const attempts = await UserEvaluationAttempt.findAll({
            where: { userId },
            attributes: ['guid', 'status', 'startTime', 'endTime', 'score', 'isApproved'],
            include: [
                {
                    model: Evaluation,
                    as: 'evaluation',
                    attributes: ['guid', 'name', 'description']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        return attempts;
    },

    async getAttemptResult(attemptGuid) {
        const attempt = await UserEvaluationAttempt.findOne({
            where: { guid: attemptGuid },
            include: [
                {
                    model: Evaluation,
                    as: 'evaluation',
                    attributes: ['guid', 'name', 'description', 'passingPercentage']
                },
                {
                    model: UserAnswer,
                    as: 'userAnswers',
                    include: [{
                        model: Question,
                        as: 'question',
                        attributes: ['guid', 'text', 'type', 'options']
                    }]
                }
            ]
        });

        if (!attempt) {
            throw new Error('Tentativa de avaliação não encontrada.');
        }

        return attempt;
    }
};

module.exports = UserEvaluationAttemptService;