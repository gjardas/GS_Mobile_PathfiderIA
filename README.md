🚀 Pathfinder AI — Global Solution FIAP 2025
O GPS de Carreira Inteligente para Requalificação Profissional na Era da IA

O Pathfinder AI é uma solução composta por API Java + Aplicativo Mobile React Native, projetada para auxiliar profissionais em transições de carreira.
Utilizando IA Generativa (Google Gemini), o sistema analisa:

Ponto A → Perfil atual, habilidades e experiência

Ponto B → Objetivo profissional

Saída → Trilha de aprendizado personalizada e evolutiva

A geração da trilha ocorre de forma assíncrona via RabbitMQ, com consulta periódica (polling) no app.

👨‍💻 Integrantes do Grupo
Nome Completo RM Função Principal
Fernando Pacheco RM555317 Backend Java & Cloud
Guilherme Jardim RM556814 Frontend Mobile & Integração

📺 Vídeo de Demonstração

🔗 npm install -g eas-cli

O vídeo deve demonstrar:

Autenticação e navegação protegida

CRUD de Perfil (Nome, Cargo, Skills)

Criação e consulta de trilhas

Geração assíncrona via RabbitMQ

Polling de status no app

Visualização das etapas da trilha

💡 Funcionalidades e Requisitos Atendidos
✔️ 1. Telas e Navegação (7 Telas)

O aplicativo possui navegação completa (pública/autenticada):

WelcomeScreen — Login e Registro

DashboardScreen — Home

ProfileScreen — Edição do Perfil e Skills

CareerGoalScreen — Definição de Objetivo Profissional

ProcessingScreen — Status da geração

LearningPathScreen — Visualização da Trilha Gerada

AboutScreen — Informações e Hash do Commit

✔️ 2. CRUD com API (Java)

Integração total via Axios com a API:

POST /learning-paths → Criar trilha

GET /learning-paths → Listar trilhas

GET /profile → Ler perfil

PUT /profile → Atualizar nome, cargo e skills

DELETE /learning-paths/{id} → Excluir trilha

Todos os dados são persistidos via API (Single Source of Truth).

✔️ 3. Autenticação e Segurança (JWT)

Implementação completa:

/auth/login

/auth/register

Tokens gerados e validados com Spring Security

Logout limpa sessão local

✔️ 4. Estilização

Identidade visual profissional (tema azul/escuro)

UI consistente baseada em um mini design system

Contexto de tema para cores, tipografia e componentes

✔️ 5. Arquitetura do Código

Backend

Camadas organizadas: controller, service, repository, config

Padrões DDD e boas práticas

RabbitMQ para geração assíncrona

Frontend

Estrutura modular:

screens/

api/

context/

components/

ESLint + padrões de formatação

🛠 Arquitetura da Solução
🔧 Backend — API REST em Java
Categoria Tecnologia Finalidade
Framework Spring Boot 3, Java 17 API principal
IA Generativa Spring AI (Google Gemini) Criação de trilhas
Banco de Dados Oracle Database + JPA + PL/SQL Persistência
Mensageria RabbitMQ (Spring AMQP) Processamento assíncrono
📱 Frontend — Aplicativo Mobile
Categoria Tecnologia Uso
Framework React Native (Expo) App Mobile
HTTP Client Axios Integração API
Navegação React Navigation Rotas e telas
Estado Context API Autenticação e Tema
⚙️ Como Executar o Projeto (Ambiente Local)
1️⃣ Subir Infraestrutura com Docker

Na pasta do backend (onde está docker-compose.yml):

docker-compose up -d

Isso provisiona:

Oracle Database

RabbitMQ

Painel de gerenciamento do RabbitMQ

2️⃣ Configurar e Executar o Backend (Java API)
Configurar credenciais

Edite:

src/main/resources/application.yml

Incluindo:

Key da Google Gemini

Credenciais Oracle

Configurações do RabbitMQ

Criar estruturas no banco

Execute no Oracle:

gs_bd.sql

Rodar o Backend
mvn clean install
mvn spring-boot:run

3️⃣ Executar o Aplicativo Mobile (React Native)
Instalar dependências
npm install

Configurar URL da API

Edite:

api/ApiService.js

E configure:

Emulador Android → http://10.0.2.2:8080

Celular físico → IP da máquina na rede local

Rodar o App
npx expo start -c

Abra com:

App Expo Go

Ou emulador Android/iOS

🧩 Estrutura de Pastas (Resumo)
/backend
├── src/main/java
├── src/main/resources
└── docker-compose.yml

/frontend
├── api/
├── screens/
├── components/
├── context/
└── App.js

📄 Licença

Este projeto é parte da Global Solution FIAP 2025.
Uso educacional.

💬 Contato

Fernando Pacheco — Backend

Guilherme Jardim — Mobile & Integração

Se quiser a versão em inglês, com badges ou com instruções mais completas, posso gerar também!
