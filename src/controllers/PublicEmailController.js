const EmailService = require('../services/EmailService');

module.exports = {
  async sendContactEmail(req, res) {
    try {
      const { nome, email, telefone, empresa, interesse, mensagem } = req.body;

      const html = `
        <h2>Nova solicitação de demonstração</h2>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${telefone}</p>
        <p><strong>Empresa:</strong> ${empresa}</p>
        <p><strong>Interesse:</strong> ${interesse}</p>
        <p><strong>Mensagem:</strong><br>${mensagem}</p>
      `;

      const result = await EmailService.sendEmail({
        to: 'contato@edgemotion.com.br',
        subject: 'Nova solicitação de demonstração - EdgeMotion',
        html,
      });

      return res.status(200).json({ message: 'Solicitação enviada com sucesso', result });
    } catch (error) {
      console.error('Erro ao enviar e-mail de contato:', error);
      return res.status(500).json({ message: 'Erro ao enviar solicitação' });
    }
  },
};
