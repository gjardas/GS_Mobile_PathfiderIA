🚀 Pathfinder AI - Global Solution 2025

"O GPS de Carreira Inteligente para Requalificação Profissional na Era da IA"

📋 Sobre o Projeto

O Pathfinder AI é uma solução mobile inovadora desenvolvida para enfrentar os desafios do futuro do trabalho. Em um mundo onde as competências mudam rapidamente, nosso aplicativo atua como um mentor de carreira inteligente.

Utilizando Inteligência Artificial Generativa, o app analisa o perfil atual do usuário (Ponto A) e seu objetivo de carreira (Ponto B), traçando uma "rota" personalizada de aprendizado. Esta rota não é apenas uma lista de cursos, mas um plano de ação dinâmico gerado em tempo real para preencher gaps de habilidades.

👥 Equipe de Desenvolvimento

Nome Completo

RM

Função Principal

Turma

[Seu Nome Completo]

RMXXXXX

Mobile & Integração

2TDSX

[Nome Integrante 2]

RMXXXXX

Backend Java & IA

2TDSX

[Nome Integrante 3]

RMXXXXX

Banco de Dados & Cloud

2TDSX

📺 Demonstração

🎥 CLIQUE AQUI PARA ASSISTIR AO VÍDEO DE DEMONSTRAÇÃO NO YOUTUBE

(O vídeo demonstra o fluxo completo: Autenticação, CRUD de Perfil, Integração com IA via RabbitMQ e Gamificação da Trilha)

📱 Funcionalidades Principais (Mobile)

O aplicativo foi construído com React Native (Expo) e atende a todos os requisitos da disciplina de Mobile Application Development:

1. 🔐 Autenticação Segura

Login e Registro: Integração direta com endpoints Java Spring Boot (/auth/login, /auth/register).

Segurança: Validação de senha forte no front-end e armazenamento seguro de Token JWT via AsyncStorage.

Sessão Persistente: O usuário permanece logado mesmo após fechar o app.

2. 👤 Gestão de Perfil (CRUD Completo)

Create (Adicionar): Novas habilidades (tags) ao perfil.

Read (Consultar): Visualização dos dados cadastrais e estatísticas.

Update (Editar): Atualização de cargo e informações pessoais.

Delete (Remover): Exclusão de habilidades obsoletas.

3. 🧠 Geração de Trilha com IA (Core)

Fluxo Assíncrono: O app envia a solicitação e monitora o processamento em tempo real (Polling).

Integração RabbitMQ: A comunicação com a IA é desacoplada via mensageria no backend.

Resultado Dinâmico: Renderização de um JSON complexo gerado pela IA em uma interface amigável de cards.

4. 🎮 Gamificação

Checklist Interativo: O usuário pode marcar etapas como concluídas.

Recompensa: Ao concluir uma etapa, a habilidade aprendida é automaticamente adicionada ao perfil do usuário.

🛠️ Arquitetura e Tecnologias

A solução segue uma arquitetura moderna baseada em microsserviços e eventos.

Frontend (Mobile)

Framework: React Native com Expo.

Linguagem: JavaScript (ES6+).

Navegação: React Navigation (Stack).

Comunicação: Axios (HTTP Client).

Estado Global: Context API (AuthContext, ThemeContext).

Estilização: StyleSheet com Design System personalizado (baseado em Shadcn UI).

Assets: SVG Nativo (react-native-svg).

Backend (Integrado)

API: Java Spring Boot 3.

Segurança: Spring Security + JWT.

Banco de Dados: Oracle Database (PL/SQL, Procedures).

Mensageria: RabbitMQ (para processamento assíncrono da IA).

IA: Integração com OpenAI/Gemini API.

🔌 Endpoints Consumidos

O aplicativo se comunica com a API RESTful através dos seguintes endpoints principais:

Método

Endpoint

Descrição

POST

/auth/register

Criação de nova conta de usuário.

POST

/auth/login

Autenticação e recebimento do Token JWT.

GET

/api/v1/learning-paths

Lista o histórico de trilhas do usuário.

POST

/api/v1/learning-paths

Solicita a geração de uma nova trilha (envia para fila).

GET

/api/v1/learning-paths/{id}

Consulta o status e o resultado da geração da trilha.

📲 Como Executar o Projeto

Pré-requisitos

Node.js (v16 ou superior).

Expo CLI instalado globalmente: npm install -g expo-cli.

Dispositivo físico (com App Expo Go) ou Emulador (Android Studio/Xcode).

Backend Java rodando (localmente na porta 8080 ou na nuvem).

Passo a Passo

Clone o repositório:

git clone [https://github.com/seu-usuario/pathfinder-ai-mobile.git](https://github.com/seu-usuario/pathfinder-ai-mobile.git)
cd pathfinder-ai-mobile

Instale as dependências:

npm install

Configure o IP da API:

Abra o arquivo api/apiService.js.

Altere a constante API_BASE_URL para o IP da sua máquina (ex: http://192.168.1.15:8080) ou 10.0.2.2 para emulador Android.

Execute o projeto:

npx expo start

Pressione a para abrir no Android.

Pressione i para abrir no iOS.

Ou leia o QR Code com o celular.
