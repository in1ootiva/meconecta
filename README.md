# MeConecta - Plataforma de Cursos Online

Uma plataforma moderna para streaming de cursos de programação, construída com Next.js, TypeScript, Tailwind CSS e Supabase.

## Funcionalidades

- 🎓 Cursos de programação em vídeo
- 👥 Sistema de usuários (estudantes e administradores)
- 📝 Atividades e exercícios
- 💬 Sistema de comentários
- 🔒 Autenticação segura
- 🎨 Interface moderna com Shadcn UI

## Tecnologias Utilizadas

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI
- Supabase (Backend e Banco de Dados)
- React Query
- Zod (Validação)

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase

## Configuração

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/meconecta.git
cd meconecta
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

4. Execute o projeto em desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

## Estrutura do Projeto

```
src/
  ├── app/                 # Rotas e páginas
  ├── components/          # Componentes React
  ├── lib/                 # Utilitários e configurações
  ├── types/              # Definições de tipos TypeScript
  └── styles/             # Estilos globais
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
