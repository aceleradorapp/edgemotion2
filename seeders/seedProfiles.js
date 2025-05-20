const sequelize = require('../src/config/sequelize');
const { Profile } = require('../src/models');

async function seedProfiles() {
  await sequelize.sync();

  const profiles = [
    { code: "1",name: 'Admin Geral', description: 'Acesso total ao sistema' },
    { code: "2",name: 'Usuário Padrão', description: 'Acesso limitado às funcionalidades' },
  ];

  for (const profile of profiles) {
    await Profile.findOrCreate({
      where: { name: profile.name },
      defaults: {
          code: profile.code,  
          description: profile.description,
        },
    });
  }

  console.log('Perfis criados com sucesso!');
  process.exit();
}

seedProfiles().catch((err) => {
  console.error('Erro ao criar perfis:', err);
  process.exit(1);
});
