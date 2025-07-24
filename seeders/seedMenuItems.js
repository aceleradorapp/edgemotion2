const sequelize = require('../src/config/sequelize');
const { MenuItem } = require('../src/models');

async function seedMenuItems() {
  await sequelize.sync();

  const menuItems = [
    {
      "id": 1,
      "name": "Dashboard",
      "icon": "new-dashboard-icon",
      "type": "link",
      "pathOrAction": "/dashboard",
      "highlight": false,
      "position": 1,
      "userTypeId": 1,
      "profileId": 1
    },
    {
      "id": 3,
      "name": "Contratar Projeto",
      "icon": "Handshake",
      "type": "action",
      "pathOrAction": "",
      "highlight": true,
      "position": 2,
      "userTypeId": 1,
      "profileId": 1
    },
    {
      "id": 2,
      "name": "Novo Projeto",
      "icon": "Plus",
      "type": "action",
      "pathOrAction": "",
      "highlight": true,
      "position": 3,
      "userTypeId": 1,
      "profileId": 1
    },
    {
      "id": 18,
      "name": "Criar Projeto Contratado",
      "icon": "Plus",
      "type": "link",
      "pathOrAction": "manage-contracted-projects",
      "highlight": true,
      "position": 4,
      "userTypeId": 3,
      "profileId": 1
    },
    {
      "id": 4,
      "name": "Projetos Contratados",
      "icon": "Handshake",
      "type": "link",
      "pathOrAction": "/dashboard#projetos-contratados",
      "highlight": false,
      "position": 5,
      "userTypeId": 1,
      "profileId": 1
    },
    {
      "id": 5,
      "name": "Meus Projetos",
      "icon": "Briefcase",
      "type": "link",
      "pathOrAction": "/dashboard#meus-projetos",
      "highlight": false,
      "position": 6,
      "userTypeId": 1,
      "profileId": 1
    },
    {
      "id": 21,
      "name": "MENU-DIVIDER",
      "icon": "LayoutDashboard",
      "type": "action",
      "pathOrAction": "",
      "highlight": false,
      "position": 7,
      "userTypeId": 1,
      "profileId": 1
    },
    {
      "id": 6,
      "name": "Adicionar Usuário",
      "icon": "UserCircle2",
      "type": "link",
      "pathOrAction": "/add-users",
      "highlight": false,
      "position": 8,
      "userTypeId": 2,
      "profileId": 1
    },
    {
      "id": 7,
      "name": "Adicionar Projetos ao Usuário",
      "icon": "UserCircle2",
      "type": "link",
      "pathOrAction": "/manage-user-projects",
      "highlight": false,
      "position": 9,
      "userTypeId": 2,
      "profileId": 1
    },
    {
      "id": 20,
      "name": "MENU-DIVIDER",
      "icon": "LayoutDashboard",
      "type": "action",
      "pathOrAction": "",
      "highlight": false,
      "position": 10,
      "userTypeId": 1,
      "profileId": 1
    },
    {
      "id": 10,
      "name": "Criar Link de Treinamento",
      "icon": "Link",
      "type": "link",
      "pathOrAction": "/create-training-link",
      "highlight": false,
      "position": 13,
      "userTypeId": 2,
      "profileId": 1
    },
    {
      "id": 11,
      "name": "Enviar Mensagens",
      "icon": "Send",
      "type": "link",
      "pathOrAction": "/create-message",
      "highlight": false,
      "position": 14,
      "userTypeId": 2,
      "profileId": 1
    },
    {
      "id": 13,
      "name": "Métricas",
      "icon": "BarChart2",
      "type": "link",
      "pathOrAction": "/metricas",
      "highlight": false,
      "position": 15,
      "userTypeId": 2,
      "profileId": 1
    },
    {
      "id": 12,
      "name": "Certificados Emitidos",
      "icon": "Award",
      "type": "link",
      "pathOrAction": "/certificados-emitidos",
      "highlight": false,
      "position": 16,
      "userTypeId": 2,
      "profileId": 1
    },
    {
      "id": 23,
      "name": "MENU-DIVIDER",
      "icon": "LayoutDashboard",
      "type": "action",
      "pathOrAction": "",
      "highlight": false,
      "position": 17,
      "userTypeId": 1,
      "profileId": 1
    },
    {
      "id": 16,
      "name": "Gerenciar Menu Item",
      "icon": "Settings",
      "type": "link",
      "pathOrAction": "/manage-menu-items",
      "highlight": false,
      "position": 18,
      "userTypeId": 3,
      "profileId": 1
    },
    {
      "id": 17,
      "name": "Gerenciar Usuários",
      "icon": "Settings",
      "type": "link",
      "pathOrAction": "/manage-users",
      "highlight": false,
      "position": 19,
      "userTypeId": 3,
      "profileId": 1
    },
    {
      "id": 19,
      "name": "Regras de Usuários",
      "icon": "Settings",
      "type": "link",
      "pathOrAction": "/manage-user-roles",
      "highlight": false,
      "position": 20,
      "userTypeId": 3,
      "profileId": 1
    }
  ]

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
