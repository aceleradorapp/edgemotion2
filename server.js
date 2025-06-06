require('dotenv').config();
const express = require('express');

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


const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user-types', userTypeRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tools', toolInstanceRoutes);
app.use('/api/results', toolResultRoutes);
app.use('/api/participants', projectParticipantRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/group-participants', groupParticipantRoutes);
app.use('/api/shared-links', sharedLinkRoutes);
app.use('/api', protectedRoutes);

// Teste
app.get('/', (req, res) => {
  res.send('EdgeMotion API rodando com sucesso!');
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

