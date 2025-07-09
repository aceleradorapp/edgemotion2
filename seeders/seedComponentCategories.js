const sequelize = require('../src/config/sequelize');
const { ComponentCategory } = require('../src/models');

async function seedComponentCategories() {
  await sequelize.sync();

  const categories = [
    { name: 'Simulation', index: 0 },
    { name: 'Interactive Video', index: 1 },
    { name: 'Interactions', index: 2 },
    { name: 'Tests', index: 3 },
    { name: 'Evaluations', index: 4 }
  ];

  for (const cat of categories) {
    await ComponentCategory.findOrCreate({
      where: { name: cat.name },
    });
  }

  console.log('Categorias de componentes criadas com sucesso!');
  process.exit();
}

seedComponentCategories().catch((err) => {
  console.error('Erro ao criar categorias:', err);
  process.exit(1);
});
