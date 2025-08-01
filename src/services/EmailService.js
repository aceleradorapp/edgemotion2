// src/services/EmailService.js
const nodemailer = require('nodemailer');
const { EmailConfig } = require('../models');

class EmailService {
  static async sendEmail({ to, subject, html }) {
    try {
      const config = await EmailConfig.findOne({
        where: { isActive: true },
      });

      if (!config) throw new Error('Configuração de e-mail não encontrada ou inativa');

      const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
          user: config.authUser,
          pass: config.authPass,
        },
      });

      const mailOptions = {
        from: `"${config.senderName || 'Equipe EdgeMotion'}" <${config.senderEmail}>`,
        to,
        subject,
        html,
      };

      const info = await transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw new Error('Erro ao enviar e-mail');
    }
  }
}

module.exports = EmailService;
