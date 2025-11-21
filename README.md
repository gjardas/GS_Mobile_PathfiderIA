# 🚀 Pathfinder AI — Global Solution FIAP 2025

### O GPS de Carreira Inteligente para Requalificação Profissional na Era da IA

O **Pathfinder AI** é uma solução composta por **API Java + Aplicativo Mobile React Native** desenvolvida para auxiliar profissionais em transição e requalificação de carreira.

Baseado em **IA Generativa (Google Gemini)**, o sistema identifica:

- **Ponto A** → Perfil atual, habilidades e experiências
- **Ponto B** → Objetivo profissional
- **Saída** → Trilha de aprendizado personalizada e evolutiva

A geração das trilhas ocorre de forma **assíncrona via RabbitMQ**, enquanto o aplicativo realiza **polling** para atualizar o status.

---

## 👨‍💻 Integrantes do Grupo

| Nome Completo    | RM       | Função Principal             |
| ---------------- | -------- | ---------------------------- |
| Fernando Pacheco | RM555317 | Backend Java & Cloud         |
| Guilherme Jardim | RM556814 | Frontend Mobile & Integração |

---

## 📺 Vídeo de Demonstração

🔗 [https://www.youtube.com/watch?v=k8RhODEm_QM&feature=youtu.be](https://www.youtube.com/watch?v=k8RhODEm_QM&feature=youtu.be)

---

# 💡 Funcionalidades e Requisitos Atendidos

## ✔️ 1. Telas e Navegação (7 Telas)

O aplicativo conta com navegação completa entre telas públicas e autenticadas:

- **WelcomeScreen** — Login e Registro
- **DashboardScreen** — Home
- **ProfileScreen** — Edição de Perfil e Skills
- **CareerGoalScreen** — Definição do Objetivo Profissional
- **ProcessingScreen** — Acompanhamento de geração
- **LearningPathScreen** — Visualização da trilha gerada
- **AboutScreen** — Informações e hash do commit

---

## ✔️ 2. CRUD com API (Java)

Integração total com a API via Axios:

- `POST /learning-paths` — Criar trilha
- `GET /learning-paths` — Listar trilhas
- `GET /profile` — Ler perfil do usuário
- `PUT /profile` — Atualizar nome, cargo e skills
- `DELETE /learning-paths/{id}` — Excluir trilha

Toda a persistência é feita pelo backend (**Single Source of Truth**).

---

## ✔️ 3. Autenticação e Segurança (JWT)

Sistema autenticado com:

- `POST /auth/login`
- `POST /auth/register`
- Tokens JWT via Spring Security
- Logout limpa token salvo no app

---

## ✔️ 4. Estilização

- Design System próprio
- Tema azul/escuro
- Componentes personalizados
- Context API para tema e tipografia

---

## ✔️ 5. Arquitetura do Código

### 🔧 Backend (Java)

Organizado em camadas:

```
controller/
service/
repository/
config/
```

- Boas práticas de DDD
- Spring AI (Google Gemini)
- RabbitMQ para geração assíncrona
- Oracle Database + JPA + PL/SQL

### 📱 Frontend (React Native)

Estrutura modular e organizada:

```
screens/
components/
api/
context/
App.js
```

- React Navigation
- Axios
- Context API
- ESLint configurado

---

# 🛠 Arquitetura da Solução

## 🔧 Backend — API REST em Java

| Categoria      | Tecnologia                | Uso                      |
| -------------- | ------------------------- | ------------------------ |
| Framework      | Spring Boot 3 (Java 17)   | API principal            |
| IA Generativa  | Spring AI (Google Gemini) | Criação das trilhas      |
| Banco de Dados | Oracle Database + JPA     | Persistência             |
| Mensageria     | RabbitMQ                  | Processamento assíncrono |

---

## 📱 Frontend — Aplicativo Mobile

| Categoria     | Tecnologia          | Uso                 |
| ------------- | ------------------- | ------------------- |
| Framework     | React Native (Expo) | App Mobile          |
| HTTP Client   | Axios               | Comunicação com API |
| Navegação     | React Navigation    | Rotas e telas       |
| Estado Global | Context API         | Autenticação e tema |

---

# ⚙️ Como Executar o Projeto (Ambiente Local)

## 1️⃣ Subir Infraestrutura com Docker

Na pasta `/backend`, execute:

```bash
docker-compose up -d
```

Isso sobe:

- Oracle Database
- RabbitMQ
- Painel do RabbitMQ

---

## 2️⃣ Configurar e Executar o Backend

### Editar credenciais

No arquivo:

```
src/main/resources/application.yml
```

Adicionar:

- Chave da Google Gemini
- Credenciais do Oracle
- Configurações do RabbitMQ

### Criar estrutura no Oracle

Executar:

```
gs_bd.sql
```

### Rodar API

```bash
mvn clean install
mvn spring-boot:run
```

---

## 3️⃣ Executar o App (React Native)

### Instalar dependências

```bash
npm install
```

### Configurar URL da API

Editar:

```
api/ApiService.js
```

Definir:

- Emulador Android → `http://10.0.2.2:8080`
- Celular físico → IP local da máquina

### Rodar App

```bash
npx expo start -c
```

Abrir via:

- Expo Go
- Emulador Android/iOS

---

# 🧩 Estrutura de Pastas

```
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
```

---

# 📄 Licença

Este projeto é parte da **Global Solution FIAP 2025**.
Uso estritamente educacional.

---

# 💬 Contato

- **Fernando Pacheco** — Backend
- **Guilherme Jardim** — Mobile & Integração
