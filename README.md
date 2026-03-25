# AnotaJá 🍽️

Sistema de gerenciamento de pedidos para restaurantes e estabelecimentos de alimentação, com suporte a mesas, delivery e controle por perfis de acesso!

---

## Sumário

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Perfis de Acesso](#perfis-de-acesso)
- [Pré-requisitos](#pré-requisitos)
- [Configuração e Execução](#configuração-e-execução)
  - [Variáveis de Ambiente](#variáveis-de-ambiente)
  - [Executando com Docker](#executando-com-docker)
  - [Executando Localmente](#executando-localmente)
- [Endpoints da API](#endpoints-da-api)
- [Estrutura do Projeto](#estrutura-do-projeto)

---

## Visão Geral

O **AnotaJá** é uma aplicação web full-stack voltada para o gerenciamento de operações de restaurantes. Ele permite que estabelecimentos controlem mesas, registrem pedidos, gerenciem o cardápio, coordenem equipes e acompanhem entregas (delivery), tudo em uma única plataforma com autenticação segura por JWT e controle de acesso baseado em papéis (RBAC).

---

## Tecnologias

### Backend
| Tecnologia | Versão |
|---|---|
| Java | 17 |
| Spring Boot | 4.0.2 |
| Spring Security | — |
| Spring Data MongoDB | — |
| JWT (jjwt) | 0.11.5 |
| Lombok | — |
| Maven | 3.9+ |

### Frontend
| Tecnologia | Versão |
|---|---|
| React | 19.x |
| React Router DOM | 7.x |
| Vite | 7.x |
| React Icons | 5.x |

### Infraestrutura
- **MongoDB** — banco de dados NoSQL
- **Docker** — containerização do backend

---

## Arquitetura

O projeto segue uma arquitetura em camadas (Layered Architecture) no backend, com separação clara entre domínio, infraestrutura e API:

```
anotaJá/
├── backend/          # API REST (Spring Boot)
│   └── src/main/java/com/uepb/project/anotaJa/
│       ├── controller/   # Endpoints REST (HTTP layer)
│       ├── domain/       # Entidades, serviços e regras de negócio
│       └── infra/        # Repositórios, segurança e configurações
└── frontend/         # SPA (React + Vite)
    └── src/
        ├── components/   # Componentes reutilizáveis
        ├── pages/        # Páginas da aplicação
        └── services/     # Camada de comunicação com a API
```

---

## Funcionalidades

- **Autenticação e Autorização** — login com JWT e controle de acesso por papel (OWNER, MANAGER, RECEPTION)
- **Gerenciamento de Mesas** — criação, abertura, fechamento e mesclagem de mesas
- **Pedidos** — registro e acompanhamento de pedidos por mesa
- **Delivery** — abertura de pedidos de entrega com endereço, telefone, taxa e status de entrega
- **Cardápio (Produtos)** — cadastro e listagem de produtos
- **Equipe** — cadastro e gerenciamento de funcionários vinculados ao estabelecimento
- **Dashboards por perfil** — visões específicas para Proprietário (Owner) e Gerente (Manager)

---

## Perfis de Acesso

| Perfil | Descrição |
|---|---|
| `OWNER` | Proprietário do estabelecimento. Acesso total: cadastro de usuários, produtos, mesas e relatórios. |
| `MANAGER` | Gerente. Pode gerenciar mesas, pedidos e mesclagem de mesas. |
| `RECEPTION` | Recepção/Atendente. Acesso às operações do dia a dia: abrir/fechar mesas e registrar pedidos. |

---

## Pré-requisitos

- [Java 17+](https://adoptium.net/)
- [Node.js 18+](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) (local ou Atlas)
- [Docker](https://www.docker.com/) *(opcional, para containerização)*
- [Maven 3.9+](https://maven.apache.org/) *(para execução local sem Docker)*

---

## Configuração e Execução

### Variáveis de Ambiente

#### Backend

Crie um arquivo `.env` ou configure as variáveis no ambiente antes de iniciar:

| Variável | Descrição | Exemplo |
|---|---|---|
| `MONGO_URI` | URI de conexão com o MongoDB | `mongodb://localhost:27017/anotaja` |
| `JWT_SECRET` | Chave secreta para assinatura dos tokens JWT | `minha-chave-secreta-segura` |

> O token JWT expira em `900000ms` (15 minutos) por padrão, configurado em `application.properties`.

#### Frontend

Crie um arquivo `.env` na pasta `frontend/`:

```env
VITE_API_URL=http://localhost:8080
```

---

### Executando com Docker

O projeto disponibiliza um `Dockerfile` para o backend. Para construir e executar:

```bash
# Na raiz do projeto
docker build -t anotaja-backend .

docker run -p 8080:8080 \
  -e MONGO_URI="mongodb://host.docker.internal:27017/anotaja" \
  -e JWT_SECRET="sua-chave-secreta" \
  anotaja-backend
```

---

### Executando Localmente

#### Backend

```bash
cd backend

# Defina as variáveis de ambiente
export MONGO_URI="mongodb://localhost:27017/anotaja"
export JWT_SECRET="sua-chave-secreta"

# Build e execução
./mvnw spring-boot:run
```

A API estará disponível em `http://localhost:8080`.

#### Frontend

```bash
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

---

## Endpoints da API

Todos os endpoints protegidos requerem o header:
```
Authorization: Bearer <token>
```

### Autenticação

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| `POST` | `/auth/login` | Realiza login e retorna o token JWT | Não |

### Usuários

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/users` | Cadastra um novo usuário (Owner) |
| `GET` | `/users/me` | Retorna os dados do usuário autenticado |

### Funcionários

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/employees` | Cadastra um funcionário vinculado ao owner |
| `GET` | `/employees` | Lista funcionários do estabelecimento |
| `DELETE` | `/employees/{id}` | Remove um funcionário |

### Mesas

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/tables` | Cria uma nova mesa |
| `GET` | `/tables` | Lista todas as mesas do estabelecimento |
| `GET` | `/tables/available` | Lista mesas disponíveis |
| `GET` | `/tables/progress` | Lista mesas em atendimento |
| `GET` | `/tables/delivery` | Lista pedidos de delivery |
| `POST` | `/tables/{id}/open` | Abre uma mesa para atendimento |
| `POST` | `/tables/{id}/close` | Fecha uma mesa |
| `POST` | `/tables/{id}/open-delivery` | Abre um pedido de delivery |
| `PATCH` | `/tables/{id}/delivery-status` | Atualiza o status do delivery |
| `POST` | `/tables/merge` | Mescla duas mesas *(OWNER, MANAGER, RECEPTION)* |
| `DELETE` | `/tables/{id}` | Remove uma mesa |

### Pedidos

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/orders` | Cria um pedido vinculado a uma mesa |
| `GET` | `/orders` | Lista pedidos |
| `DELETE` | `/orders/{id}` | Remove um pedido |

### Produtos

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/products` | Cadastra um produto no cardápio |
| `GET` | `/products` | Lista os produtos do estabelecimento |
| `DELETE` | `/products/{id}` | Remove um produto |

---

## Estrutura do Projeto

```
anotaJá/
├── Dockerfile
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/uepb/project/anotaJa/
│       ├── AnotaJaApplication.java
│       ├── controller/
│       │   ├── auth/          # Login
│       │   ├── employee/      # Funcionários
│       │   ├── order/         # Pedidos
│       │   ├── product/       # Produtos
│       │   ├── table/         # Mesas e Delivery
│       │   └── user/          # Usuários
│       ├── domain/
│       │   ├── auth/          # Serviço de autenticação
│       │   ├── employee/      # Entidade e serviço de funcionários
│       │   ├── order/         # Entidade de pedido e itens
│       │   ├── product/       # Entidade de produto
│       │   ├── table/         # Entidade, serviço e status de mesa
│       │   └── user/          # Entidade, roles e repositório de usuários
│       └── infra/
│           ├── config/        # CORS
│           ├── exception/     # Handler global de exceções
│           ├── persistence/   # Mapeamento MongoDB (UserDocument)
│           └── security/      # JWT Filter, JwtService e SecurityConfig
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── components/
        │   ├── DeliveryIcon/
        │   ├── Header/
        │   ├── Modal/
        │   ├── ProductCard/
        │   ├── Sidebar/
        │   └── TableIcon/
        ├── pages/
        │   ├── Home/          # Tela principal com mesas
        │   ├── Login/         # Autenticação
        │   ├── Manager/       # Dashboard do gerente
        │   ├── Orders/        # Pedidos
        │   ├── Owner/         # Dashboard do proprietário
        │   ├── Products/      # Cardápio
        │   └── Team/          # Equipe
        └── services/
            └── api.js         # Funções de comunicação com o backend
```

--- 

## Licença

Este projeto foi desenvolvido como parte de um projeto acadêmico da **UEPB (Universidade Estadual da Paraíba)**. Consulte os responsáveis pelo repositório para informações sobre uso e distribuição.