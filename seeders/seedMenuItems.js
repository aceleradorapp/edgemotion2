const sequelize = require('../src/config/sequelize');
const { MenuItem } = require('../src/models');

async function seedMenuItems() {
  await sequelize.sync();

  const menuItems = [
    {
      name: 'Dashboard',
      icon: 'LayoutDashboard',
      type: 'link',
      pathOrAction: '/dashboard',
      highlight: false,
      position: 1,
      userTypeId: 1 // visitor e acima
    },
    {
      name: 'Novo Projeto',
      icon: 'Plus',
      type: 'action',
      pathOrAction: null,
      highlight: true,
      position: 2,
      userTypeId: 2 // user e acima
    },
    {
      name: 'Contratar Projeto',
      icon: 'Handshake',
      type: 'action',
      pathOrAction: null,
      highlight: true,
      position: 3,
      userTypeId: 3 // owner apenas
    },
    {
      name: 'Projetos Contratados',
      icon: 'Handshake',
      type: 'link',
      pathOrAction: '/dashboard#projetos-contratados',
      highlight: false,
      position: 4,
      userTypeId: 2
    },
    {
      name: 'Meus Projetos',
      icon: 'Briefcase',
      type: 'link',
      pathOrAction: '/dashboard#meus-projetos',
      highlight: false,
      position: 5,
      userTypeId: 2
    },
    {
      name: 'Adicionar Usuário',
      icon: 'UserCircle2',
      type: 'link',
      pathOrAction: '/add-users',
      highlight: false,
      position: 6,
      userTypeId: 3
    },
    {
      name: 'Adicionar Projetos ao Usuário',
      icon: 'UserCircle2',
      type: 'link',
      pathOrAction: '/manage-user-projects',
      highlight: false,
      position: 7,
      userTypeId: 3
    },
    {
      name: 'Grupos',
      icon: 'Users',
      type: 'link',
      pathOrAction: '/groups',
      highlight: false,
      position: 8,
      userTypeId: 2
    },
    {
      name: 'Adicionar Participantes ao grupo',
      icon: 'Users',
      type: 'link',
      pathOrAction: '/group-participants',
      highlight: false,
      position: 9,
      userTypeId: 3
    },
    {
      name: 'Criar Link de Treinamento',
      icon: 'Link',
      type: 'link',
      pathOrAction: '/create-training-link',
      highlight: false,
      position: 10,
      userTypeId: 2
    },
    {
      name: 'Enviar Mensagens',
      icon: 'Send',
      type: 'link',
      pathOrAction: '/create-message',
      highlight: false,
      position: 11,
      userTypeId: 2
    },
    {
      name: 'Certificados Emitidos',
      icon: 'Award',
      type: 'link',
      pathOrAction: '/certificados-emitidos',
      highlight: false,
      position: 12,
      userTypeId: 2
    },
    {
      name: 'Métricas',
      icon: 'BarChart2',
      type: 'link',
      pathOrAction: '/metricas',
      highlight: false,
      position: 13,
      userTypeId: 3
    }
  ];

  for (const item of menuItems) {
    await MenuItem.findOrCreate({
      where: { name: item.name },
      defaults: item,
    });
  }

  console.log('Itens de menu criados com sucesso!');
  process.exit();
}

seedMenuItems().catch((err) => {
  console.error('Erro ao criar itens de menu:', err);
  process.exit(1);
});
