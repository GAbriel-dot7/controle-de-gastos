# Frontend – Controle de Despesas Pessoais

## Visão geral
A interface web permite cadastrar e acompanhar despesas, organizar categorias, encerrar meses e administrar usuários com perfil ADMIN.

## Tecnologias
- React 19
- Vite
- Tailwind CSS 4.3.0
- React Router DOM
- Axios

## Componentes e fontes
- Tailwind CSS 4.3 – https://tailwindcss.com – MIT License
- React 19 – https://react.dev – MIT License
- Os componentes da interface foram desenvolvidos para o projeto com React e Tailwind CSS; não foram reutilizados componentes prontos externos.

## Variáveis de ambiente
| Nome | Descrição |
|---|---|
| VITE_API_URL | URL base da API backend |

## Executar localmente
1. Copie `.env.example` para `.env`.
2. Ajuste `VITE_API_URL`.
3. Rode `npm install`.
4. Execute `npm run dev`.

## Observações
- A aplicação usa `localStorage` para guardar o token e os dados do usuário.
- Sessões expiradas redirecionam o usuário para a tela de login.
