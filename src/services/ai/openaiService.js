// src/services/ai/openaiService.js
const { OpenAI } = require('openai');

module.exports = {

    // Lógica para gerar o JSON de avaliação
    async generateReviewJson(apiKey, prompt) {
        if (!apiKey) {
            throw new Error('Chave de API da OpenAI não fornecida.');
        }
        if (!prompt) {
            throw new Error('O prompt é obrigatório para gerar o JSON de avaliação.');
        }

        const openai = new OpenAI({ apiKey });

        // Extrai o número de questões e o tópico do prompt
        const regex = /(\d+)\s+questões\s+sobre\s+(.*)/i;
        const match = prompt.match(regex);
        const numQuestions = match && match[1] ? parseInt(match[1], 10) : 5;
        const topic = match && match[2] ? match[2].trim() : 'assuntos gerais';

        const predefinedPrompt = `
      Você é um especialista em criação de avaliações e quizzes. Sua tarefa é gerar um JSON de avaliação com ${numQuestions} questões sobre o tópico "${topic}".
      O JSON deve ter o seguinte formato estrito, com um mix de tipos de perguntas (true_false, multiple_choice_single, multiple_choice_multiple):
      
      {
  "name": "Avaliação de Geografia",
  "description": "Teste seus conhecimentos sobre geografia física e política.",
  "passingPercentage": 0.7,
  "maxAttempts": 3,
  "companyGuid": "bef2e216-4269-42b8-a046-26321f2f27b2",
  "questions": [
    {
      "type": "true_false",
      "text": "O Brasil é o maior país da América do Sul em território.",
      "options": [
        { "text": "Verdadeiro", "isCorrect": true },
        { "text": "Falso", "isCorrect": false }
      ]
    },
    {
      "type": "multiple_choice_single",
      "text": "Qual é o rio mais longo do mundo?",
      "options": [
        { "text": "Rio Amazonas", "isCorrect": true },
        { "text": "Rio Nilo", "isCorrect": false },
        { "text": "Rio Yangtzé", "isCorrect": false },
        { "text": "Rio Mississipi", "isCorrect": false }
      ]
    },
    {
      "type": "multiple_choice_multiple",
      "text": "Quais destes países fazem fronteira com o Brasil?",
      "options": [
        { "text": "Argentina", "isCorrect": true },
        { "text": "Chile", "isCorrect": false },
        { "text": "Colômbia", "isCorrect": true },
        { "text": "Uruguai", "isCorrect": true }
      ]
    },
    {
      "type": "true_false",
      "text": "O Monte Everest está localizado na Cordilheira dos Andes.",
      "options": [
        { "text": "Verdadeiro", "isCorrect": false },
        { "text": "Falso", "isCorrect": true }
      ]
    },
    {
      "type": "multiple_choice_single",
      "text": "Qual é o maior oceano do planeta?",
      "options": [
        { "text": "Atlântico", "isCorrect": false },
        { "text": "Pacífico", "isCorrect": true },
        { "text": "Índico", "isCorrect": false },
        { "text": "Ártico", "isCorrect": false }
      ]
    },
    {
      "type": "multiple_choice_multiple",
      "text": "Quais destes são desertos famosos?",
      "options": [
        { "text": "Saara", "isCorrect": true },
        { "text": "Gobi", "isCorrect": true },
        { "text": "Pampas", "isCorrect": false },
        { "text": "Kalahari", "isCorrect": true }
      ]
    },
    {
      "type": "true_false",
      "text": "A Linha do Equador passa pelo território brasileiro.",
      "options": [
        { "text": "Verdadeiro", "isCorrect": true },
        { "text": "Falso", "isCorrect": false }
      ]
    },
    {
      "type": "multiple_choice_single",
      "text": "Qual é a capital da Austrália?",
      "options": [
        { "text": "Sydney", "isCorrect": false },
        { "text": "Melbourne", "isCorrect": false },
        { "text": "Canberra", "isCorrect": true },
        { "text": "Brisbane", "isCorrect": false }
      ]
    },
    {
      "type": "multiple_choice_multiple",
      "text": "Quais destes países pertencem ao continente africano?",
      "options": [
        { "text": "Egito", "isCorrect": true },
        { "text": "Nigéria", "isCorrect": true },
        { "text": "Turquia", "isCorrect": false },
        { "text": "África do Sul", "isCorrect": true }
      ]
    },
    {
      "type": "true_false",
      "text": "O Polo Norte está localizado no continente da Antártida.",
      "options": [
        { "text": "Verdadeiro", "isCorrect": false },
        { "text": "Falso", "isCorrect": true }
      ]
    }
  ]
}

      Certifique-se de que a sua resposta seja APENAS o objeto JSON, sem nenhum texto adicional. Garanta que cada pergunta tenha apenas uma resposta correta para o tipo 'multiple_choice_single' e pelo menos uma para 'true_false' e 'multiple_choice_multiple'.
    `;

        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: predefinedPrompt }],
                response_format: { type: "json_object" },
            });
            return JSON.parse(completion.choices[0].message.content);
        } catch (error) {
            console.error('Erro na chamada da API da OpenAI:', error);
            throw new Error('Erro na API da OpenAI. Verifique sua chave e o status do serviço.');
        }
    },

};