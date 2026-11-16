# Backend – Controle de Despesas Pessoais

## Visão geral
Este backend fornece autenticação, gerenciamento de categorias e despesas, controle de meses encerrados e autorização por perfil.

## Tecnologias
- Node.js 22+
- Express 5
- Prisma 7.10.0
- PostgreSQL
- JWT
- bcryptjs
- Zod

## Configuração
1. Copie `.env.example` para `.env`.
2. Ajuste `DATABASE_URL`, `JWT_SECRET` e `CORS_ORIGIN`.
3. Execute `npx prisma migrate dev --name init`.
4. Execute `npm run seed` para criar o administrador de exemplo.
5. Inicie com `npm run dev`.

## Variáveis de ambiente
| Nome | Descrição |
|---|---|
| DATABASE_URL | URL do PostgreSQL |
| JWT_SECRET | Chave para assinatura do JWT |
| JWT_EXPIRES_IN | Tempo de expiração do token |
| PORT | Porta do backend |
| CORS_ORIGIN | Origem permitida do frontend |
| NODE_ENV | Ambiente: development ou production |
| SEED_ADMIN_EMAIL | Email do usuário admin do seed |
| SEED_ADMIN_PASSWORD | Senha do usuário admin do seed |

## Rotas principais
- POST /api/auth/register – cadastro do usuário
- POST /api/auth/login – login e recebimento do JWT
- GET /api/auth/me – dados do usuário autenticado
- GET /api/expenses – listar despesas com filtros
- POST /api/expenses – criar despesa
- PUT /api/expenses/:id – editar despesa
- DELETE /api/expenses/:id – excluir despesa
- POST /api/months/close – encerrar um mês
- DELETE /api/months/:year/:month – reabrir mês
- GET /api/users – listagem de usuários (apenas ADMIN)

## Regra de negócio principal
A criação, edição e remoção de despesas em um mês encerrado por um usuário são bloqueadas com erro 409.

## Permissões
- Usuário comum: pode manipular apenas seus próprios dados.
- ADMIN: pode listar e excluir usuários.
