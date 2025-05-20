# 🚀 EdgeMotion API

API RESTful para gerenciamento de autenticação, perfis de usuário e tipos de usuário. Desenvolvido com Node.js, Express e Sequelize (MySQL).

---

## 📁 Estrutura do Projeto

```plaintext
|-- package-lock.json
|-- package.json
+-- public/                          # Arquivos públicos (ex: imagens, ícones)
|-- README.md
+-- seeders/
|   |-- seedProfiles.js              # Seed para perfis de usuário
|   |-- seedUserTypes.js            # Seed para tipos de usuário
|-- server.js                        # Arquivo principal da aplicação
+-- src/
|   +-- config/
|   |   |-- sequelize.js             # Configuração de conexão com o banco de dados
|   +-- controllers/
|   |   |-- authController.js        # Lógica de autenticação (login)
|   |   |-- profileController.js     # CRUD de perfis
|   |   |-- userTypeController.js    # CRUD de tipos de usuário
|   +-- middlewares/
|   |   |-- authMiddleware.js        # Verificação de token JWT
|   |   |-- authorizeMiddleware.js   # Verificação de permissões
|   +-- models/
|   |   |-- index.js                 # Inicialização e associações dos modelos
|   |   |-- Profile.js               # Modelo de perfil
|   |   |-- User.js                  # Modelo de usuário
|   |   |-- UserType.js              # Modelo de tipo de usuário
|   +-- routes/
|   |   |-- authRoutes.js            # Rotas de autenticação
|   |   |-- profileRoutes.js         # Rotas de perfis
|   |   |-- protectedRoutes.js       # Rotas protegidas
|   |   |-- userTypeRoutes.js        # Rotas de tipos de usuário
|   +-- services/                    # (Reservado) Serviços reutilizáveis
|   +-- utils/                       # (Reservado) Utilitários gerais
+-- uploads/                         # Arquivos enviados (ex: imagens)
```

---

## 🧪 Scripts de Seed

Execute os scripts de seed para criar os dados iniciais no banco:

```bash
node seeders/seedUserTypes.js
node seeders/seedProfiles.js
```

---

## ⚙️ Tecnologias Utilizadas

- **Node.js** + **Express**
- **Sequelize** ORM
- **MySQL** (banco de dados)
- **JWT** para autenticação
- **Bcrypt** para hash de senhas
- **Dotenv** para variáveis de ambiente

---

## 🔐 Autenticação e Autorização

- Os usuários se autenticam via token JWT.
- Rotas protegidas requerem um token válido.
- O middleware de autorização pode restringir o acesso por tipo de usuário ou perfil.

---

## 📌 Boas Práticas

- Uso de **MVC** para separação de responsabilidades
- **Seeders** para popular dados iniciais de forma segura (evita duplicações com `findOrCreate`)
- **Middlewares reutilizáveis** para segurança
- Estrutura modular e escalável para expansão futura

---

## 📞 Contato

Desenvolvido por [Michael Milanez](https://www.linkedin.com/in/michaelmilanez)  
Especialista em Inovação Tecnológica para Educação Interativa.

---