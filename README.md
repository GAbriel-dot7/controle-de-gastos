# Controle de Gastos Pessoais

<p align="center">
  <strong>Organize despesas, categorias e pagamentos em uma aplicação full stack completa.</strong>
</p>

<p align="center">
  <a href="https://github.com/GAbriel-dot7/controle-de-gastos"><img alt="Repositório no GitHub" src="https://img.shields.io/badge/GitHub-Reposit%C3%B3rio-181717?logo=github"></a>
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=222222">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?logo=tailwindcss&logoColor=white">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white">
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-7.10-2D3748?logo=prisma&logoColor=white">
</p>

> Projeto acadêmico desenvolvido para as atividades AV1 e AV2 do 4º bimestre da disciplina de Desenvolvimento de Sistemas Web.

---

## Sobre o projeto

O **Controle de Gastos Pessoais** é uma aplicação web que ajuda usuários a registrar despesas, organizá-las por categoria e acompanhar quais pagamentos estão pendentes ou concluídos.

A principal regra de negócio impede qualquer alteração em despesas pertencentes a um mês encerrado pelo próprio usuário.

### Público-alvo

- Estudantes e jovens adultos que querem acompanhar os gastos mensais.
- Usuários que precisam organizar despesas por categoria e situação de pagamento.
- Pessoas que desejam evitar mudanças acidentais em períodos financeiros já encerrados.

---

## Funcionalidades

- Cadastro e autenticação segura de usuários.
- Login com JWT e senhas protegidas por bcrypt.
- Recuperação dos dados do usuário autenticado.
- Logout e tratamento de sessão expirada.
- CRUD completo de despesas.
- CRUD completo de categorias pessoais.
- Filtros por mês, ano, categoria e situação de pagamento.
- Resumo financeiro por categoria e status.
- Encerramento e reabertura de meses.
- Bloqueio de alterações em meses encerrados.
- Perfil administrativo para consultar e excluir usuários.
- Respostas de validação e erros padronizadas pela API.
- Interface responsiva com estados de carregamento, vazio, sucesso e erro.

---

## Tecnologias

### Backend

| Tecnologia | Versão / finalidade |
|---|---|
| Node.js | Ambiente de execução JavaScript |
| Express | API REST e roteamento HTTP |
| Prisma ORM | 7.10.0 — modelagem e acesso ao banco |
| PostgreSQL | Banco de dados relacional |
| JSON Web Token | 9.0.3 — autenticação stateless |
| bcryptjs | 3.0.3 — hash seguro de senhas |
| Zod | Validação dos dados recebidos pela API |

### Frontend

| Tecnologia | Versão / finalidade |
|---|---|
| React | 19.3.1 — interface baseada em componentes |
| Vite | 8.3.5 — ferramenta de desenvolvimento e build |
| Tailwind CSS | 4.3.0 — estilização responsiva |
| React Router DOM | 7.18.5 — navegação e rotas protegidas |
| Axios | 1.21.0 — comunicação com a API |

> As versões principais exigidas pela atividade estão fixadas sem `^` ou `~` nos arquivos de dependências.

---

## Demonstração

As interfaces foram organizadas para apresentar o fluxo real da aplicação:

- Tela de login e cadastro.
- Dashboard com resumo mensal e filtros.
- Criação, edição, exclusão e alteração de status das despesas.
- Administração de categorias.
- Encerramento e reabertura de meses.
- Área exclusiva para administradores.

### Capturas da interface

> Adicione aqui capturas do dashboard, cadastro/login e regra de mês encerrado antes da apresentação ou publicação do portfólio.

```text
screenshots/
├── login.png
├── dashboard.png
├── despesas.png
└── mes-encerrado.png
```

---

## Arquitetura

```text
controle-de-gastos/
├── backend/
│   ├── docs/                 # Coleção Postman e requisições HTTP
│   ├── prisma/
│   │   ├── migrations/       # Histórico do banco
│   │   ├── schema.prisma     # Modelos e relacionamentos
│   │   └── seed.js           # Usuário administrador inicial
│   ├── src/
│   │   ├── config/           # Banco e variáveis de ambiente
│   │   ├── controllers/      # Entrada e saída HTTP
│   │   ├── middlewares/      # JWT, autorização e erros
│   │   ├── routes/           # Endpoints da API
│   │   ├── services/         # Regras de negócio
│   │   ├── utils/            # Utilidades compartilhadas
│   │   └── validators/       # Schemas Zod
│   └── test/                 # Testes dos validadores
└── frontend/
    ├── src/
    │   ├── components/       # Componentes de interface
    │   ├── contexts/         # Estado de autenticação
    │   ├── pages/            # Páginas da aplicação
    │   ├── routes/           # Proteção de rotas
    │   └── services/         # Cliente HTTP
    └── vite.config.js
```

O backend segue uma estrutura **MVC**, com regras de negócio isoladas em services e acesso ao banco encapsulado pelo Prisma.

---

## Modelagem de dados

```mermaid
classDiagram
    class User {
        +String id
        +String name
        +String email
        +String passwordHash
        +Role role
    }

    class Category {
        +String id
        +String name
    }

    class Expense {
        +String id
        +String description
        +Decimal amount
        +Date dueDate
        +Int month
        +Int year
        +PaymentStatus paymentStatus
    }

    class MonthClosure {
        +String id
        +Int month
        +Int year
    }

    User --> Category : possui
    User --> Expense : possui
    User --> MonthClosure : encerra
    Category --> Expense : classifica
```

---

## Regra de negócio

Antes de criar, editar, excluir ou alterar o status de uma despesa, o backend verifica se existe um `MonthClosure` para o usuário no mês e ano da operação.

Quando o mês está encerrado, a API responde com:

- **Status:** `409 Conflict`
- **Mensagem:** `O mês X/Y já foi encerrado. Não é possível alterar despesas deste período.`

Esta proteção funciona também ao mover uma despesa entre meses: ambos o mês atual e o novo mês são verificados.

---

## API principal

### Autenticação

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/auth/register` | Cadastro de usuário |
| `POST` | `/api/auth/login` | Login e geração do JWT |
| `GET` | `/api/auth/me` | Dados do usuário autenticado |

### Despesas

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/expenses` | Lista despesas com filtros |
| `GET` | `/api/expenses/:id` | Busca uma despesa |
| `POST` | `/api/expenses` | Cria uma despesa |
| `PUT` | `/api/expenses/:id` | Atualiza uma despesa |
| `PATCH` | `/api/expenses/:id/status` | Atualiza o status de pagamento |
| `DELETE` | `/api/expenses/:id` | Exclui uma despesa |
| `GET` | `/api/expenses/summary` | Retorna o resumo financeiro |

### Categorias e meses

| Método | Rota | Descrição |
|---|---|---|
| `GET`, `POST` | `/api/categories` | Lista ou cria categorias |
| `PUT`, `DELETE` | `/api/categories/:id` | Atualiza ou exclui uma categoria |
| `GET` | `/api/months` | Lista meses encerrados |
| `POST` | `/api/months/close` | Encerra um mês |
| `DELETE` | `/api/months/:year/:month` | Reabre um mês |

### Administração

| Método | Rota | Permissão |
|---|---|---|
| `GET` | `/api/users` | Somente `ADMIN` |
| `DELETE` | `/api/users/:id` | Somente `ADMIN` |

Uma coleção Postman e um arquivo de requisições estão disponíveis em [`backend/docs/`](backend/docs/).

---

## Controle de acesso

| Recurso | Usuário | Administrador |
|---|---:|---:|
| Consultar dados próprios | ✅ | ✅ |
| Criar, editar e excluir despesas próprias | ✅ | ✅ |
| Gerenciar categorias próprias | ✅ | ✅ |
| Encerrar e reabrir meses próprios | ✅ | ✅ |
| Consultar usuários | ❌ | ✅ |
| Excluir usuários | ❌ | ✅ |

As regras são aplicadas no backend pelo middleware JWT e pelo perfil do usuário. A proteção React complementa essa segurança com redirecionamentos e ocultação de ações.

---

## Executando localmente

### Pré-requisitos

- Node.js 22 ou superior
- PostgreSQL 16 ou compatível
- npm

### 1. Clone o repositório

```bash
git clone https://github.com/GAbriel-dot7/controle-de-gastos.git
cd controle-de-gastos
```

### 2. Configure o backend

```bash
cd backend
npm install
cp .env.example .env
```

Preencha o arquivo `.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/controle_gastos"
JWT_SECRET="gere-um-segredo-forte"
JWT_EXPIRES_IN="1d"
PORT="4000"
CORS_ORIGIN="http://localhost:5173"
NODE_ENV="development"
SEED_ADMIN_EMAIL="admin@exemplo.com"
SEED_ADMIN_PASSWORD="defina-uma-senha-de-teste"
```

Prepare o banco e inicie a API:

```bash
npx prisma migrate dev --name init
npm run seed
npm run dev
```

A API ficará disponível em `http://localhost:4000`. Os health checks estão em:

- `http://localhost:4000/health`
- `http://localhost:4000/api/health`

### 3. Configure o frontend

Em outro terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

O conteúdo padrão de `.env.example` aponta para:

```env
VITE_API_URL="http://localhost:4000"
```

A interface normalmente ficará em `http://localhost:5173`.

---

## Testes e validações

### Backend

```bash
cd backend
npm test
find src prisma test -name '*.js' -type f -print0 | xargs -0 -r -n1 node --check
```

Os testes atuais cobrem os validadores de cadastro, despesas e encerramento de meses.

### Frontend

```bash
cd frontend
npm run build
```

---

## Variáveis de ambiente

### Backend

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | Sim em produção | Conexão PostgreSQL |
| `JWT_SECRET` | Sim em produção | Segredo usado para assinar tokens |
| `JWT_EXPIRES_IN` | Não | Validade do JWT |
| `PORT` | Não | Porta da API |
| `CORS_ORIGIN` | Recomendado | Origem autorizada do frontend |
| `NODE_ENV` | Recomendado | Ambiente de execução |
| `SEED_ADMIN_EMAIL` | Não | E-mail do usuário criado pelo seed |
| `SEED_ADMIN_PASSWORD` | Não | Senha temporária do usuário criado pelo seed |

### Frontend

| Variável | Obrigatória | Descrição |
|---|---|---|
| `VITE_API_URL` | Sim em produção | URL pública da API |

Credenciais reais, arquivos `.env` e tokens não devem ser enviados ao repositório.

---

## Publicação

### Backend

- Plataforma sugerida: Render.
- Diretório raiz do serviço: `backend`.
- Comando de build: `npm install && npx prisma generate`.
- Comando de inicialização: `npx prisma migrate deploy && npm start`.
- Banco de dados PostgreSQL acessível pela variável `DATABASE_URL`.

### Frontend

- Plataforma sugerida: Vercel.
- Diretório raiz do projeto: `frontend`.
- Definir `VITE_API_URL` com a URL pública do backend.
- Definir no backend `CORS_ORIGIN` com a URL pública do frontend.

### Status da publicação

- Frontend publicado: **a preencher após o deploy**
- Backend publicado: **a preencher após o deploy**
- Banco de dados em produção: **a configurar antes da apresentação**

---

## Roteiro de demonstração

### AV1 — Backend

1. Explicar objetivo, público-alvo e estrutura MVC.
2. Mostrar o schema Prisma, migrations e relacionamentos.
3. Executar cadastro e login no Postman ou Insomnia.
4. Demonstrar cadastro, atualização e exclusão de despesas persistidas no banco.
5. Realizar uma operação aceita e outra bloqueada pela regra de mês encerrado.
6. Mostrar erro `401` sem token.
7. Demonstrar erro `403` ao tentar acessar dados de outro usuário.
8. Mostrar o acesso administrativo de um usuário comum sendo bloqueado.

### AV2 — Frontend e publicação

1. Contextualizar o problema e a solução.
2. Demonstrar cadastro, login e logout.
3. Criar, editar, filtrar e excluir despesas pela interface.
4. Encerrar um mês e mostrar o bloqueio pela regra de negócio.
5. Navegar pelas rotas protegidas.
6. Mostrar estados de erro, validação, carregamento e lista vazia.
7. Demonstrar o fluxo completo pela URL pública.

---

## Segurança

- Senhas armazenadas com bcrypt.
- Autenticação baseada em JWT.
- Middleware protege rotas privadas.
- Dados principais são vinculados ao usuário autenticado.
- Senhas não são retornadas pelas respostas da API.
- Variáveis sensíveis ficam fora do repositório.
- CORS limita a origem autorizada do frontend.

---

## Componentes e fontes

- [Tailwind CSS 4.3](https://tailwindcss.com) — licença MIT.
- [React 19](https://react.dev) — licença MIT.
- [Express 5](https://expressjs.com) — licença MIT.
- [Prisma](https://www.prisma.io) — licença Apache-2.0.

Os componentes visuais, formulários, tabelas, modais e estados vazios foram desenvolvidos especificamente para este projeto com React e Tailwind CSS. Nenhum componente externo pronto foi reutilizado.

---

## Próximos passos

- Publicar frontend, backend e banco em ambiente de produção.
- Registrar no README os URLs públicos reais.
- Adicionar capturas da interface.
- Ampliar a cobertura de testes da API.
- Adicionar testes de integração com banco isolado.
- Criar painel mais detalhado de evolução mensal.

---

## Documentação complementar

- [`backend/README.md`](backend/README.md)
- [`frontend/README.md`](frontend/README.md)
- [`backend/docs/collection.json`](backend/docs/collection.json)
- [`backend/docs/requests.http`](backend/docs/requests.http)

---

## Autor

Projeto desenvolvido por **Gabriel Robson**.

[![GitHub](https://img.shields.io/badge/GitHub-GAbriel--dot7-181717?logo=github)](https://github.com/GAbriel-dot7)
