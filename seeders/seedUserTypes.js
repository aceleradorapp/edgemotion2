const { UserType } = require('../src/models');
const sequelize = require('../src/config/sequelize');

const seedUserTypes = async () => {
  try {
    await sequelize.authenticate();

    const types = [
      { code: "1",name: 'visitor', description: 'Usuário visitante com permissões limitadas' },
      { code: "2",name: 'user', description: 'Usuário com permissões de usuário comum' },
      { code: "3",name: 'owner', description: 'Administrador com permissões totais' }
    ];

    for (const type of types) {
      const [userType, created] = await UserType.findOrCreate({
        where: { name: type.name },
        defaults: {
          code: type.code, 
          description: type.description
        }
      });
      console.log(`${created ? 'Criado' : 'Já existe'}: ${userType.name}`);
    }

    console.log('Seed de tipos de usuário finalizada com sucesso.');
    process.exit();
  } catch (error) {
    console.error('Erro ao criar tipos de usuário:', error);
    process.exit(1);
  }
};

seedUserTypes();
