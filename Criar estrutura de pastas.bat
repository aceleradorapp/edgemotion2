@echo off
echo Criando estrutura de pastas para o projeto EdgeMotion...

:: Subpastas principais
mkdir src
cd src
mkdir controllers
mkdir middlewares
mkdir models
mkdir routes
mkdir services
mkdir utils
mkdir config
cd ..

:: Pastas auxiliares
mkdir migrations
mkdir seeders
mkdir public
mkdir uploads

:: Arquivos principais
type nul > .env
type nul > .gitignore
type nul > README.md
type nul > server.js

echo Estrutura criada com sucesso!
pause
