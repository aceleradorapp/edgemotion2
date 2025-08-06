//server.js
require('dotenv').config();
const express = require('express');
const YAML = require('yamljs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const projectParticipantRoutes = require('./src/routes/projectParticipantRoutes');
const toolInstanceRoutes = require('./src/routes/toolInstanceRoutes');
const toolResultRoutes = require('./src/routes/toolResultRoutes');
const sharedLinkRoutes = require('./src/routes/sharedLinkRoutes');
const protectedRoutes = require('./src/routes/protectedRoutes');
const userTypeRoutes = require('./src/routes/userTypeRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const projectRoutes = require('./src/routes/projectRoutes');
const groupRoutes = require('./src/routes/groupRoutes');
const groupParticipantRoutes = require('./src/routes/groupParticipantRoutes');
const authRoutes = require('./src/routes/authRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const componentCategoryRoutes = require('./src/routes/componentCategoryRoutes');
const componentRoutes = require('./src/routes/componentRoutes');
const playerRoutes = require('./src/routes/playerRoutes');
const contractedProjectsRoutes = require('./src/routes/contractedProjectsRoutes');
const usersRoutes = require('./src/routes/usersRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const menuItemRoutes = require('./src/routes/menuItemRoutes');
const emailConfigRoutes = require('./src/routes/emailConfigRoutes');
const publicRoutes = require('./src/routes/publicRoutes');
const packageRoutes = require('./src/routes/packageRoutes');
const audioRoutes = require('./src/routes/audioRoutes');
const evaluationRoutes = require('./src/routes/evaluationRoutes');


const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'));

const app = express();
const PORT = process.env.PORT || 3030;

// Middlewares
app.use(express.json());

app.use(cors());

// Routes
app.use('/api/public', publicRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/user-types', userTypeRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contracted-projects', contractedProjectsRoutes);
app.use('/api/tools', toolInstanceRoutes);
app.use('/api/results', toolResultRoutes);
app.use('/api/participants', projectParticipantRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/group-participants', groupParticipantRoutes);
app.use('/api/shared-links', sharedLinkRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api', protectedRoutes);
app.use('/api/component-categories', componentCategoryRoutes);
app.use('/api/components', componentRoutes);
app.use('/api', playerRoutes);
app.use('/api', usersRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/email-config', emailConfigRoutes);
app.use('/api', packageRoutes);
app.use('/api', audioRoutes);
app.use('/api', evaluationRoutes);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // acessar imagem via URL pública
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/media', express.static(path.join(__dirname, 'uploads', 'packages')));


// Teste
app.get('/', (req, res) => {
  res.send('EdgeMotion API rodando com sucesso! Acesse http://localhost:3030/api-docs/ para documentação');
});

// Banco de Dados
const db = require('./src/models');

// Testa conexão e sincroniza as tabelas
db.sequelize.authenticate()
  .then(() => {
    console.log('Conexão com banco de dados estabelecida com sucesso.');
    //return db.sequelize.sync({ alter: true });
    return db.sequelize.sync();
  })
  .then(() => {
    console.log('Tabelas sincronizadas com sucesso!');
  })
  .catch(err => {
    console.error('Erro ao conectar ou sincronizar com banco de dados:', err);
  });

// Inicialização
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

