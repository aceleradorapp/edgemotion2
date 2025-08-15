const UserEvaluationAttemptService = require('../services/UserEvaluationAttemptService');
const EvaluationService = require('../services/evaluationService'); // Precisamos dele para preparar as questões
const { User } = require('../models');

const UserEvaluationAttemptController = {
  /**
   * @route POST /api/evaluations/:guid/start
   * @description Inicia uma nova tentativa de avaliação para um usuário.
   * @access Private (Auth Required, Role User)
   */
  async start(req, res) {
    try {
      const { guid } = req.params;
      const userGuid = req.user.guid; // O GUID do usuário logado
      const userId = req.user.id;   // O ID do usuário logado

      // 1. Iniciar a tentativa no serviço de tentativas
      const newAttempt = await UserEvaluationAttemptService.startAttempt(guid, userId);

      // 2. Preparar as questões para o frontend (embaralhar e remover respostas)
      const evaluationForUser = await EvaluationService.prepareEvaluationForUser(guid);

      if (!evaluationForUser) {
        return res.status(404).json({ error: 'Avaliação não encontrada ou sem questões.' });
      }

      // Retorna os dados da tentativa e as questões para o frontend
      return res.status(201).json({
        message: 'Avaliação iniciada com sucesso!',
        attempt: {
          guid: newAttempt.guid,
          evaluationGuid: evaluationForUser.evaluationGuid,
          evaluationName: evaluationForUser.evaluationName,
          startTime: newAttempt.startTime
        },
        questions: evaluationForUser.questions
      });
    } catch (error) {
      console.error(error);
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('tentativas excedido')) {
        return res.status(403).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro ao iniciar a avaliação.' });
    }
  },

  /**
   * @route POST /api/evaluations/attempts/:attemptGuid/answer
   * @description Salva a resposta de uma questão para uma tentativa.
   * @access Private (Auth Required, Role User)
   */
  async answer(req, res) {
    try {
      const { attemptGuid } = req.params;
      const { questionGuid, selectedOptions, timeTaken } = req.body;

      // Validação básica
      if (!questionGuid || !selectedOptions || !Array.isArray(selectedOptions)) {
        return res.status(400).json({ error: 'Dados da resposta inválidos.' });
      }

      const answerData = { questionGuid, selectedOptions, timeTaken };

      const newAnswer = await UserEvaluationAttemptService.saveAnswer(attemptGuid, answerData);

      // Você pode optar por retornar a próxima questão aqui ou deixar o frontend
      // solicitar em um endpoint separado. Por simplicidade, vamos apenas
      // confirmar que a resposta foi salva.
      return res.status(201).json({
        message: 'Resposta salva com sucesso!',
        answerGuid: newAnswer.guid
      });
    } catch (error) {
      console.error(error);
      if (error.message.includes('não encontrada')) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro ao salvar a resposta.' });
    }
  },

  /**
   * @route POST /api/evaluations/attempts/:attemptGuid/finish
   * @description Finaliza uma tentativa de avaliação e retorna o resultado.
   * @access Private (Auth Required, Role User)
   */
  async finish(req, res) {
    try {
      const { attemptGuid } = req.params;

      const finishedAttempt = await UserEvaluationAttemptService.finishAttempt(attemptGuid);

      // Limpar dados sensíveis antes de enviar ao usuário
      const response = finishedAttempt.toJSON();
      delete response.userAnswers; // As respostas detalhadas podem ser em outro endpoint
      delete response.evaluation; // Os detalhes da avaliação podem já estar no frontend

      return res.json({
        message: 'Avaliação finalizada com sucesso!',
        result: {
          guid: response.guid,
          score: response.score,
          isApproved: response.isApproved,
          totalTimeTaken: response.totalTimeTaken,
          status: response.status
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao finalizar a avaliação.' });
    }
  },

  async listUserAttempts(req, res) {
    try {
      const userId = req.user.id;
      const userGuid = req.params.userGuid;

      const user = await User.findOne({
        where: { guid: userGuid },
        attributes: ['id'], // retorna apenas o id
      });

      const attempts = await UserEvaluationAttemptService.listUserAttempts(user.id);

      return res.json({
        total: attempts.length,
        attempts: attempts
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar tentativas do usuário.' });
    }
  },

  async getAttemptResult(req, res) {
    try {
      const { attemptGuid } = req.params;
      const attempt = await UserEvaluationAttemptService.getAttemptResult(attemptGuid);

      if (!attempt) {
        return res.status(404).json({ error: 'Tentativa de avaliação não encontrada.' });
      }

      // Remover a informação 'isCorrect' das respostas antes de enviar para o frontend
      // Isso é uma medida de segurança extra, embora a lógica do quiz já tenha finalizado
      const attemptData = attempt.toJSON();
      attemptData.userAnswers = attemptData.userAnswers.map(ua => {
        ua.question.options = ua.question.options.map(opt => {
          const { isCorrect, ...cleanOption } = opt;
          return cleanOption;
        });
        return ua;
      });

      return res.json({ attempt: attemptData });

    } catch (error) {
      console.error('Erro ao buscar o resultado da avaliação:', error);
      if (error.message.includes('não encontrada')) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro ao buscar o resultado da avaliação.' });
    }
  },

  async getRanking(req, res) {
    try {
      const { evaluationGuid } = req.params;

      const ranking = await UserEvaluationAttemptService.getEvaluationRanking(evaluationGuid);

      return res.json({
        total: ranking.length,
        ranking: ranking
      });
    } catch (error) {
      console.error('Erro ao gerar ranking:', error);
      return res.status(500).json({ error: error.message || 'Erro ao gerar o ranking.' });
    }
  },

};

module.exports = UserEvaluationAttemptController;