const { EmailConfig } = require('../src/models');
const sequelize = require('../src/config/sequelize');

const seedEmailConfig = async () => {
  try {
    await sequelize.authenticate();

    const config = {
      companyGuid: null,
      host: "mail.edgemotion.com.br",
      port: 465,
      secure: true,
      authUser: "contato@edgemotion.com.br",
      authPass: "mm230475",
      senderName: "Edge Motion",
      senderEmail: "contato@edgemotion.com.br",
    };

    const [emailConfig, created] = await EmailConfig.findOrCreate({
      where: { senderEmail: config.senderEmail },
      defaults: config
    });

    console.log(`${created ? 'Criada' : 'Já existe'} configuração de e-mail para: ${emailConfig.senderEmail}`);

    console.log('Seed de configuração de e-mail finalizada com sucesso.');
    process.exit();
  } catch (error) {
    console.error('Erro ao criar configuração de e-mail:', error);
    process.exit(1);
  }
};

seedEmailConfig();
