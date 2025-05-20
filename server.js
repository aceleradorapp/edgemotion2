require('dotenv').config();
const express = require('express');

const authRoutes = require('./src/routes/authRoutes');
const protectedRoutes = require('./src/routes/protectedRoutes');
const userTypeRoutes = require('./src/routes/userTypeRoutes');
const profileRoutes = require('./src/routes/profileRoutes');


const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user-types', userTypeRoutes);
app.use('/api/profiles', profileRoutes);
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
    return db.sequelize.sync({ alter: true });
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

