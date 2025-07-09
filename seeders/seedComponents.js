const sequelize = require('../src/config/sequelize');
const { Component, ComponentCategory } = require('../src/models');

async function seedComponents() {
  await sequelize.sync();

  const components = [
    // Simulation
    { identifier: 'processes', title: 'Processos', icon: 'Settings', category: 'Simulation', index: 0, route: '/simulacao/processos' },
    { identifier: 'software', title: 'Software', icon: 'Code', category: 'Simulation', index: 1, route: '/simulacao/software' },
    { identifier: 'hardware', title: 'Hardware', icon: 'HardDrive', category: 'Simulation', index: 2, route: '/simulacao/hardware' },

    // Interactive Video
    { identifier: 'video_click', title: 'Vídeo Clique', icon: 'Clapperboard', category: 'Interactive Video', index: 0, route: '/video-interativo/video-clique' },
    { identifier: 'video_sequence', title: 'Vídeo Sequência', icon: 'Video', category: 'Interactive Video', index: 1, route: '/video-interativo/video-sequencia' },

    // Interactions
    { identifier: 'mini_games', title: 'Interação', icon: 'Gamepad2', category: 'Interactions', index: 0, route: '/interacoes/interacao' },

    // Tests
    { identifier: 'correct_alternatives', title: 'Alternativas', icon: 'ListChecks', category: 'Tests', index: 0, route: '/testes/alternativas' },
    { identifier: 'alternative', title: 'Alternativa', icon: 'HelpCircle', category: 'Tests', index: 1, route: '/testes/alternativa' },
    { identifier: 'connect_the_dots', title: 'Ligue os Pontos', icon: 'Target', category: 'Tests', index: 2, route: '/testes/ligue-pontos' },

    // Evaluations
    { identifier: 'eval_correct_alternatives', title: 'Alternativas', icon: 'CheckSquare', category: 'Evaluations', index: 0, route: '/avaliacoes/alternativas' },
    { identifier: 'eval_alternative', title: 'Alternativa', icon: 'Award', category: 'Evaluations', index: 1, route: '/avaliacoes/alternativa' },
    { identifier: 'eval_connect_the_dots', title: 'Ligue os Pontos', icon: 'Target', category: 'Evaluations', index: 2, route: '/avaliacoes/ligue-pontos' },
  ];

  for (const comp of components) {
    const category = await ComponentCategory.findOne({ where: { name: comp.category } });

    if (category) {
      await Component.findOrCreate({
        where: { identifier: comp.identifier },
        defaults: {
          title: comp.title,
          icon: comp.icon,
          category: comp.category,
          index: comp.index,
          route: comp.route,
          userTypeId: 'all',
          categoryId: category.id,
        },
      });
    }
  }

  console.log('Componentes criados com sucesso!');
  process.exit();
}

seedComponents().catch((err) => {
  console.error('Erro ao criar componentes:', err);
  process.exit(1);
});
